import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  doc,
  getDocs,
  limit
} from "firebase/firestore";
import { db } from "../firebase/config";

const MESSAGES_COLLECTION = "messages";

export const sendMessage = async (senderId, senderName, receiverId, propertyId, propertyTitle, message) => {
  await addDoc(collection(db, MESSAGES_COLLECTION), {
    senderId,
    senderName,
    receiverId,
    propertyId,
    propertyTitle,
    message,
    timestamp: serverTimestamp(),
  });
};

export const subscribeToMessages = (userId, callback) => {
  // Query messages where user is either sender or receiver
  // Note: Firestore doesn't support OR queries across different fields easily without composite indexes or separate queries
  // For simplicity in this MVP, we'll query messages where the user is involved
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const allMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Filter client-side for involvement
    const userMessages = allMessages.filter(m => m.senderId === userId || m.receiverId === userId);
    callback(userMessages);
  });
};

export const getConversations = (messages, currentUserId) => {
  const conversations = {};
  
  messages.forEach(msg => {
    const otherId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
    const convoKey = `${otherId}_${msg.propertyId}`;
    
    if (!conversations[convoKey]) {
      conversations[convoKey] = {
        otherId,
        otherName: msg.senderId === currentUserId ? 'Owner' : msg.senderName,
        propertyId: msg.propertyId,
        propertyTitle: msg.propertyTitle,
        lastMessage: msg.message,
        timestamp: msg.timestamp,
        messages: []
      };
    }
    
    conversations[convoKey].messages.push(msg);
    conversations[convoKey].lastMessage = msg.message;
    conversations[convoKey].timestamp = msg.timestamp;
  });
  
  return Object.values(conversations).sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
};
