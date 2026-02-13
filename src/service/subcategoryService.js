// services/subCategoryService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseconfig';

export const subCategoryService = {
  // Upload image
  // uploadImage: async (file, folder = 'subcategories') => {
  //   if (!file) return null;
    
  //   const timestamp = Date.now();
  //   const fileName = `${timestamp}_${file.name}`;
  //   const storageRef = ref(storage, `${folder}/${fileName}`);
    
  //   await uploadBytes(storageRef, file);
  //   const downloadURL = await getDownloadURL(storageRef);
    
  //   return downloadURL;
  // },

  // CREATE - SubCategory create
  create: async (subCategoryData) => {
    const { imageFile, bannerFile, ...restData } = subCategoryData;
    
    // Upload images
    // const imageURL = await subCategoryService.uploadImage(imageFile, 'subcategories/images');
    // const bannerURL = await subCategoryService.uploadImage(bannerFile, 'subcategories/banners');
    
    // Auto-generate slug
    const slug = restData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const docRef = await addDoc(collection(db, 'subcategories'), {
      ...restData,
      slug,
      // image: imageURL,
      // banner: bannerURL,
      productCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  },

  // READ ALL - Sare subcategories
  getAll: async () => {
    const q = query(
      collection(db, 'subcategories'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // READ BY CATEGORY - Specific category ke subcategories
  getByCategory: async (categoryId) => {
    const q = query(
      collection(db, 'subcategories'),
      where('categoryId', '==', categoryId),
      orderBy('name', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // READ ACTIVE - Sirf active subcategories (user-facing)
  getActive: async () => {
    const q = query(
      collection(db, 'subcategories'),
      where('isActive', '==', true),
    
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // UPDATE
  update: async (id, subCategoryData) => {
    const { imageFile, bannerFile, ...restData } = subCategoryData;
    
    const updateData = { ...restData };
    
    // Upload new image if provided
    if (imageFile) {
      updateData.image = await subCategoryService.uploadImage(imageFile, 'subcategories/images');
    }
    
    // Upload new banner if provided
    if (bannerFile) {
      updateData.banner = await subCategoryService.uploadImage(bannerFile, 'subcategories/banners');
    }
    
    // Update slug if name changed
    if (restData.name) {
      updateData.slug = restData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    await updateDoc(doc(db, 'subcategories', id), {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  },

  // DELETE
  delete: async (id) => {
    await deleteDoc(doc(db, 'subcategories', id));
  },
};