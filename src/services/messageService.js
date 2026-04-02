import { 
  collection, 
  addDoc, 
  query, 
  where, 
  or,
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
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    or(
      where("senderId", "==", userId),
      where("receiverId", "==", userId)
    )
  );

  return onSnapshot(q, (snapshot) => {
    const allMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    allMessages.sort((a, b) => {
      const timeA = a.timestamp?.toMillis() || Date.now();
      const timeB = b.timestamp?.toMillis() || Date.now();
      return timeA - timeB;
    });
    callback(allMessages);
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
