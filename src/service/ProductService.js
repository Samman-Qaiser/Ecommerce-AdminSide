import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  orderBy,
  query,
  where,
  limit,
  startAfter,
  serverTimestamp,
  writeBatch,
  getDoc,
  increment
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable 
} from 'firebase/storage';
import { db, storage } from '../firebase/firebaseconfig';



export const productService = {
  
  // ==================== IMAGE UPLOAD ====================

  uploadImage: async (file, folder = 'products', onProgress = null) => {
    if (!file) return null;
    
    try {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const fileName = `${timestamp}_${sanitizedName}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      
      if (onProgress) {
        // Use resumable upload for progress tracking
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress(Math.round(progress));
            },
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      } else {
        // Simple upload without progress
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error('Failed to upload image');
    }
  },


  uploadMultipleImages: async (files, folder = 'products', onProgress = null) => {
    if (!files || files.length === 0) return [];
    
    const uploadPromises = files.map((file, index) => {
      return productService.uploadImage(
        file, 
        folder,
        onProgress ? (progress) => {
          // Calculate overall progress
          const overallProgress = ((index * 100) + progress) / files.length;
          onProgress(Math.round(overallProgress));
        } : null
      );
    });
    
    return await Promise.all(uploadPromises);
  },

 
  uploadVideo: async (file, onProgress = null) => {
    if (!file) return null;
    
    try {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const fileName = `${timestamp}_${sanitizedName}`;
      const storageRef = ref(storage, `products/videos/${fileName}`);
      
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            if (onProgress) {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress(Math.round(progress));
            }
          },
          (error) => reject(error),
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });
    } catch (error) {
      console.error('Video upload failed:', error);
      throw new Error('Failed to upload video');
    }
  },

  /**
   * Delete file from storage
   * @param {string} fileUrl - File URL to delete
   */
  deleteFile: async (fileUrl) => {
    if (!fileUrl) return;
    
    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('File deletion failed:', error);
      // Don't throw - file might already be deleted
    }
  },

  // ==================== CRUD OPERATIONS ====================
  
 
  create: async (productData, onProgress = null) => {
    try {
      const { 
        imageFiles = [], 
        videoFile = null,
        subCategoryId,
        ...restData 
      } = productData;
      
      // Step 1: Upload images
      let uploadedImages = [];
      if (imageFiles.length > 0) {
        onProgress?.({ stage: 'images', progress: 0 });
        uploadedImages = await productService.uploadMultipleImages(
          imageFiles,
          'products/images',
          (progress) => onProgress?.({ stage: 'images', progress })
        );
      }
      
      // Step 2: Upload video
      let videoUrl = null;
      if (videoFile) {
        onProgress?.({ stage: 'video', progress: 0 });
        videoUrl = await productService.uploadVideo(
          videoFile,
          (progress) => onProgress?.({ stage: 'video', progress })
        );
      }
      
      // Step 3: Create product document
      onProgress?.({ stage: 'saving', progress: 0 });
      
      const productDoc = {
        ...restData,
        images: uploadedImages,
        video: videoUrl,
        subCategoryId: subCategoryId || null,
        stockQuantity: Number(restData.stockQuantity) || 0,
        price: Number(restData.price) || 0,
        originalPrice: Number(restData.originalPrice) || 0,
        discount: restData.discount || 0,
        inStock: Number(restData.stockQuantity) > 0,
        badges: restData.badges || [],
        details: restData.details || {
          fabric: '',
          colors: [],
          sizes: [],
          washcare: []
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'products'), productDoc);
      
      // Step 4: Update subcategory product count (if applicable)
      if (subCategoryId) {
        const subCategoryRef = doc(db, 'subcategories', subCategoryId);
        await updateDoc(subCategoryRef, {
          productCount: increment(1)
        });
      }
      
      onProgress?.({ stage: 'complete', progress: 100 });
      
      return docRef.id;
    } catch (error) {
      console.error('Product creation failed:', error);
      throw new Error(`Failed to create product: ${error.message}`);
    }
  },

  /**
   * Get all products with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Products and pagination info
   */
  getAll: async (options = {}) => {
    try {
      const {
        pageSize = 20,
        lastDoc = null,
        subCategoryId = null,
        inStock = null,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;
      
      let q = collection(db, 'products');
      const constraints = [];
      
      // Apply filters
      if (subCategoryId) {
        constraints.push(where('subCategoryId', '==', subCategoryId));
      }
      
      if (inStock !== null) {
        constraints.push(where('inStock', '==', inStock));
      }
      
      // Apply sorting
      constraints.push(orderBy(sortBy, sortOrder));
      
      // Apply pagination
      constraints.push(limit(pageSize));
      
      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }
      
      q = query(q, ...constraints);
      
      const snapshot = await getDocs(q);
      
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to ISO strings for JSON compatibility
        createdAt: doc.data().createdAt?.toDate().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate().toISOString()
      }));
      
      return {
        products,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: snapshot.docs.length === pageSize
      };
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw new Error('Failed to fetch products');
    }
  },

  /**
   * Get single product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Product data
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Product not found');
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate().toISOString(),
        updatedAt: docSnap.data().updatedAt?.toDate().toISOString()
      };
    } catch (error) {
      console.error('Failed to fetch product:', error);
      throw error;
    }
  },

  /**
   * Update product with file management
   * @param {string} id - Product ID
   * @param {Object} productData - Updated product data
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<void>}
   */
  update: async (id, productData, onProgress = null) => {
    try {
      const { 
        imageFiles = [], 
        videoFile = null,
        existingImages = [],
        existingVideo = null,
        ...restData 
      } = productData;
      
      const updateData = { ...restData };
      
      // Handle new images
      if (imageFiles.length > 0) {
        onProgress?.({ stage: 'images', progress: 0 });
        const newImages = await productService.uploadMultipleImages(
          imageFiles,
          'products/images',
          (progress) => onProgress?.({ stage: 'images', progress })
        );
        updateData.images = [...existingImages, ...newImages];
      } else {
        updateData.images = existingImages;
      }
      
      // Handle new video
      if (videoFile) {
        onProgress?.({ stage: 'video', progress: 0 });
        // Delete old video if exists
        if (existingVideo) {
          await productService.deleteFile(existingVideo);
        }
        updateData.video = await productService.uploadVideo(
          videoFile,
          (progress) => onProgress?.({ stage: 'video', progress })
        );
      } else {
        updateData.video = existingVideo;
      }
      
      // Update document
      onProgress?.({ stage: 'saving', progress: 0 });
      
      await updateDoc(doc(db, 'products', id), {
        ...updateData,
        stockQuantity: Number(updateData.stockQuantity) || 0,
        price: Number(updateData.price) || 0,
        originalPrice: Number(updateData.originalPrice) || 0,
        inStock: Number(updateData.stockQuantity) > 0,
        updatedAt: serverTimestamp()
      });
      
      onProgress?.({ stage: 'complete', progress: 100 });
    } catch (error) {
      console.error('Product update failed:', error);
      throw new Error(`Failed to update product: ${error.message}`);
    }
  },

  /**
   * Delete product and associated files
   * @param {string} id - Product ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    try {
      // Get product data first
      const productDoc = await productService.getById(id);
      
      // Delete all images
      if (productDoc.images && productDoc.images.length > 0) {
        await Promise.all(
          productDoc.images.map(url => productService.deleteFile(url))
        );
      }
      
      // Delete video
      if (productDoc.video) {
        await productService.deleteFile(productDoc.video);
      }
      
      // Update subcategory count
      if (productDoc.subCategoryId) {
        const subCategoryRef = doc(db, 'subcategories', productDoc.subCategoryId);
        await updateDoc(subCategoryRef, {
          productCount: increment(-1)
        });
      }
      
      // Delete product document
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error('Product deletion failed:', error);
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  },

  /**
   * Batch delete products
   * @param {string[]} ids - Array of product IDs
   * @returns {Promise<void>}
   */
  batchDelete: async (ids) => {
    try {
      const batch = writeBatch(db);
      
      // Fetch all products first
      const products = await Promise.all(
        ids.map(id => productService.getById(id))
      );
      
      // Delete all associated files
      await Promise.all(
        products.flatMap(product => [
          ...(product.images || []).map(url => productService.deleteFile(url)),
          product.video ? productService.deleteFile(product.video) : Promise.resolve()
        ])
      );
      
      // Batch delete documents
      ids.forEach(id => {
        batch.delete(doc(db, 'products', id));
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Batch delete failed:', error);
      throw new Error('Failed to delete products');
    }
  },

  /**
   * Search products by name
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching products
   */
  search: async (searchTerm) => {
    try {
      const q = query(
        collection(db, 'products'),
        orderBy('name'),
        limit(20)
      );
      
      const snapshot = await getDocs(q);
      
      // Client-side filtering (Firestore doesn't support full-text search)
      const products = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      return products;
    } catch (error) {
      console.error('Search failed:', error);
      throw new Error('Failed to search products');
    }
  }
};