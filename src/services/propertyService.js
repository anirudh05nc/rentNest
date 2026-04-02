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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";

const PROPERTIES_COLLECTION = "properties";

export const uploadImages = async (files) => {
  const uploadPromises = files.map(async (file) => {
    const storageRef = ref(storage, `properties/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
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
