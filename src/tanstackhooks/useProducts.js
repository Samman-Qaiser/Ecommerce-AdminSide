import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  useInfiniteQuery 
} from '@tanstack/react-query';
import { productService } from '../service/ProductService';
import { toast } from "react-hot-toast";

/**
 * Query Keys for Products
 * Hierarchical structure for efficient cache invalidation
 */
export const PRODUCT_QUERY_KEYS = {
  all: ['products'],
  lists: () => [...PRODUCT_QUERY_KEYS.all, 'list'],
  list: (filters) => [...PRODUCT_QUERY_KEYS.lists(), filters],
  details: () => [...PRODUCT_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...PRODUCT_QUERY_KEYS.details(), id],
  search: (term) => [...PRODUCT_QUERY_KEYS.all, 'search', term]
};

/**
 * Hook: Get all products with pagination
 * @param {Object} options - Query options
 * @returns {Object} Query result with products data
 */
export const useProducts = (options = {}) => {
  return useInfiniteQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(options),
    queryFn: ({ pageParam = null }) => 
      productService.getAll({ ...options, lastDoc: pageParam }),
    getNextPageParam: (lastPage) => 
      lastPage.hasMore ? lastPage.lastDoc : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
};

/**
 * Hook: Get single product by ID
 * @param {string} id - Product ID
 * @param {Object} options - Additional query options
 * @returns {Object} Query result with product data
 */
export const useProduct = (id, options = {}) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id, // Only run if ID exists
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options
  });
};

/**
 * Hook: Search products
 * @param {string} searchTerm - Search term
 * @returns {Object} Query result with search results
 */
export const useProductSearch = (searchTerm) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.search(searchTerm),
    queryFn: () => productService.search(searchTerm),
    enabled: searchTerm.length > 2, // Only search if term is long enough
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000
  });
};

/**
 * Hook: Create product mutation
 * @returns {Object} Mutation object with create function
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productData, onProgress }) => 
      productService.create(productData, onProgress),
    
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: PRODUCT_QUERY_KEYS.lists() 
      });
      
      // Snapshot previous value
      const previousProducts = queryClient.getQueryData(
        PRODUCT_QUERY_KEYS.lists()
      );
      
      // Optimistically update (optional - can be heavy for image uploads)
      // We skip this for products due to file uploads
      
      return { previousProducts };
    },
    
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(
          PRODUCT_QUERY_KEYS.lists(),
          context.previousProducts
        );
      }
      
      toast.error(error.message || 'Failed to create product');
      console.error('Create product error:', error);
    },
    
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ 
        queryKey: PRODUCT_QUERY_KEYS.lists() 
      });
      
      toast.success('Product created successfully!');
    },
    
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ 
        queryKey: PRODUCT_QUERY_KEYS.all 
      });
    }
  });
};

/**
 * Hook: Update product mutation
 * @returns {Object} Mutation object with update function
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, productData, onProgress }) => 
      productService.update(id, productData, onProgress),
    
    onMutate: async ({ id, productData }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: PRODUCT_QUERY_KEYS.detail(id) 
      });
      
      // Snapshot previous value
      const previousProduct = queryClient.getQueryData(
        PRODUCT_QUERY_KEYS.detail(id)
      );
      
      // Optimistically update the detail view
      queryClient.setQueryData(
        PRODUCT_QUERY_KEYS.detail(id),
        (old) => ({ ...old, ...productData })
      );
      
      return { previousProduct, id };
    },
    
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousProduct) {
        queryClient.setQueryData(
          PRODUCT_QUERY_KEYS.detail(context.id),
          context.previousProduct
        );
      }
      
      toast.error(error.message || 'Failed to update product');
      console.error('Update product error:', error);
    },
    
    onSuccess: (data, variables) => {
      toast.success('Product updated successfully!');
    },
    
    onSettled: (data, error, variables) => {
      // Refetch both detail and list
      queryClient.invalidateQueries({ 
        queryKey: PRODUCT_QUERY_KEYS.detail(variables.id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: PRODUCT_QUERY_KEYS.lists() 
      });
    }
  });
};

/**
 * Hook: Delete product mutation
 * @returns {Object} Mutation object with delete function
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => productService.delete(id),
    
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: PRODUCT_QUERY_KEYS.lists() 
      });
      
      // Snapshot previous value
      const previousProducts = queryClient.getQueryData(
        PRODUCT_QUERY_KEYS.lists()
      );
      
      // Optimistically remove from cache
      queryClient.setQueriesData(
        { queryKey: PRODUCT_QUERY_KEYS.lists() },
        (old) => {
          if (!old) return old;
          
          // Handle infinite query structure
          if (old.pages) {
            return {
              ...old,
              pages: old.pages.map(page => ({
                ...page,
                products: page.products.filter(p => p.id !== id)
              }))
            };
          }
          
          // Handle regular query
          return old.filter(p => p.id !== id);
        }
      );
      
      return { previousProducts, id };
    },
    
    onError: (error, id, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(
          PRODUCT_QUERY_KEYS.lists(),
          context.previousProducts
        );
      }
      
      toast.error(error.message || 'Failed to delete product');
      console.error('Delete product error:', error);
    },
    
    onSuccess: (data, id) => {
      toast.success('Product deleted successfully!');
      
      // Remove from detail cache
      queryClient.removeQueries({ 
        queryKey: PRODUCT_QUERY_KEYS.detail(id) 
      });
    },
    
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ 
        queryKey: PRODUCT_QUERY_KEYS.lists() 
      });
    }
  });
};

/**
 * Hook: Batch delete products mutation
 * @returns {Object} Mutation object with batch delete function
 */
export const useBatchDeleteProducts = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ids) => productService.batchDelete(ids),
    
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ 
        queryKey: PRODUCT_QUERY_KEYS.lists() 
      });
      
      const previousProducts = queryClient.getQueryData(
        PRODUCT_QUERY_KEYS.lists()
      );
      
      // Optimistically remove all
      queryClient.setQueriesData(
        { queryKey: PRODUCT_QUERY_KEYS.lists() },
        (old) => {
          if (!old) return old;
          
          if (old.pages) {
            return {
              ...old,
              pages: old.pages.map(page => ({
                ...page,
                products: page.products.filter(p => !ids.includes(p.id))
              }))
            };
          }
          
          return old.filter(p => !ids.includes(p.id));
        }
      );
      
      return { previousProducts, ids };
    },
    
    onError: (error, ids, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(
          PRODUCT_QUERY_KEYS.lists(),
          context.previousProducts
        );
      }
      
      toast.error('Failed to delete products');
      console.error('Batch delete error:', error);
    },
    
    onSuccess: (data, ids) => {
      toast.success(`${ids.length} products deleted successfully!`);
      
      // Remove all from detail cache
      ids.forEach(id => {
        queryClient.removeQueries({ 
          queryKey: PRODUCT_QUERY_KEYS.detail(id) 
        });
      });
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ 
        queryKey: PRODUCT_QUERY_KEYS.all 
      });
    }
  });
};

/**
 * Prefetch product details
 * Useful for hover states or predictive loading
 */
export const usePrefetchProduct = () => {
  const queryClient = useQueryClient();
  
  return (id) => {
    queryClient.prefetchQuery({
      queryKey: PRODUCT_QUERY_KEYS.detail(id),
      queryFn: () => productService.getById(id),
      staleTime: 5 * 60 * 1000
    });
  };
};