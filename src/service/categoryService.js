
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../firebase/firebaseconfig'; // Make sure storage is exported from config

// Helper function to handle image upload
// const uploadImage = async (file, folder) => {
//   if (!file) return null;
//   const fileName = `${Date.now()}_${file.name}`;
//   const storageRef = ref(storage, `categories/${folder}/${fileName}`);
//   const snapshot = await uploadBytes(storageRef, file);
//   return await getDownloadURL(snapshot.ref);
// };

// Helper function to delete image from storage
const deleteImageFromStorage = async (imageUrl) => {
  if (!imageUrl) return;
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image from storage:", error);
    // Log error but don't block the main process
  }
};

export const categoryService = {
  // CREATE - Category create with Image Upload
  create: async (categoryData) => {
    const { mainImageFile, bannerFile, ...restData } = categoryData;

    // 1. Upload Images first
    // const mainImageUrl = await uploadImage(mainImageFile, 'main');
    // const bannerUrl = await uploadImage(bannerFile, 'banners');

    // 2. Save to Firestore
    const docRef = await addDoc(collection(db, 'category'), {
      ...restData,
      // mainImage: mainImageUrl,
      // bannerImage: bannerUrl,
      productCount: 0,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  },

  // READ ALL - Same as before
  getAll: async () => {
    const q = query(collection(db, 'category'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

 // Testing ke liye orderBy hata kar dekhein
getActive: async () => {
  const q = query(
    collection(db, 'category'), 
    where('isActive', '==', true)
    // orderBy hata dein temporary
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
},
  // READ ONE - Same as before
  getById: async (id) => {
    const docSnap = await getDoc(doc(db, 'category', id));
    if (!docSnap.exists()) throw new Error('Category not found');
    return { id: docSnap.id, ...docSnap.data() };
  },

  // UPDATE - Category update with Storage Cleanup
  update: async (id, updatedData) => {
    const { mainImageFile, bannerFile, ...restData } = updatedData;
    const oldDoc = await categoryService.getById(id);
    let newData = { ...restData, updatedAt: serverTimestamp() };

    // Handle Main Image Update
    if (mainImageFile) {
      await deleteImageFromStorage(oldDoc.mainImage); // Purani delete karo
      newData.mainImage = await uploadImage(mainImageFile, 'main'); // Nayi upload karo
    }

    // Handle Banner Update
    if (bannerFile) {
      await deleteImageFromStorage(oldDoc.bannerImage); // Purani delete karo
      newData.bannerImage = await uploadImage(bannerFile, 'banners'); // Nayi upload karo
    }

    await updateDoc(doc(db, 'category', id), newData);
  },

  // DELETE - Category & its Images from Storage
  delete: async (id) => {
    // 1. Get doc to find image URLs
    const category = await categoryService.getById(id);

    // 2. Delete Images from Storage
    if (category.mainImage) await deleteImageFromStorage(category.mainImage);
    if (category.bannerImage) await deleteImageFromStorage(category.bannerImage);

    // 3. Delete from Firestore
    await deleteDoc(doc(db, 'category', id));
  },

  // TOGGLE ACTIVE - Same as before
  toggleActive: async (id, currentStatus) => {
    await updateDoc(doc(db, 'category', id), {
      isActive: !currentStatus,
      updatedAt: serverTimestamp()
    });
  }
};