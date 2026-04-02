import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase/config";

const PROPERTIES_COLLECTION = "properties";

const compressImageBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // Aggressive down-scaling for Firestore limits
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const uploadImages = async (files) => {
  const uploadPromises = files.map(async (file) => {
    return await compressImageBase64(file);
  });
  return Promise.all(uploadPromises);
};

export const addProperty = async (propertyData) => {
  const docRef = await addDoc(collection(db, PROPERTIES_COLLECTION), {
    ...propertyData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getProperties = async (filters = {}) => {
  let q = query(collection(db, PROPERTIES_COLLECTION), orderBy("createdAt", "desc"));

  if (filters.location) {
    q = query(q, where("location", "==", filters.location));
  }
  
  if (filters.ownerId) {
    q = query(q, where("ownerId", "==", filters.ownerId));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getPropertyById = async (id) => {
  const docRef = doc(db, PROPERTIES_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const updateProperty = async (id, data) => {
  const docRef = doc(db, PROPERTIES_COLLECTION, id);
  await updateDoc(docRef, data);
};

export const deleteProperty = async (id) => {
  const docRef = doc(db, PROPERTIES_COLLECTION, id);
  await deleteDoc(docRef);
};
