// tanstackhooks/useSubCategories.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subCategoryService } from '../service/subcategoryService';
export { useActiveCategories } from './useCategories';
import { toast } from 'react-hot-toast';

// Query Keys
const QUERY_KEYS = {
  all: ['subcategories'],
  active: ['subcategories', 'active'],
  byCategory: (categoryId) => ['subcategories', 'category', categoryId],
  categories: {
    active: ['categories', 'active'],
  }
};

// ============ SUBCATEGORY HOOKS ============

// GET ALL SUBCATEGORIES (Admin)
export const useSubCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.all,
    queryFn: subCategoryService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// GET ACTIVE SUBCATEGORIES (User-facing)
export const useActiveSubCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.active,
    queryFn: subCategoryService.getActive,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// GET SUBCATEGORIES BY CATEGORY
export const useSubCategoriesByCategory = (categoryId) => {
  return useQuery({
    queryKey: QUERY_KEYS.byCategory(categoryId),
    queryFn: () => subCategoryService.getByCategory(categoryId),
    enabled: !!categoryId, // Only run if categoryId exists
    staleTime: 5 * 60 * 1000,
  });
};

// CREATE SUBCATEGORY
export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subCategoryService.create,
    
    onSuccess: () => {
      // Invalidate all subcategory queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.active });
      
      toast.success('SubCategory created successfully!');
    },
    
    onError: (error) => {
      toast.error('Failed to create subcategory');
      console.error(error);
    }
  });
};

// UPDATE SUBCATEGORY
export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => subCategoryService.update(id, data),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.active });
      
      toast.success('SubCategory updated successfully!');
    },
    
    onError: () => {
      toast.error('Failed to update subcategory');
    }
  });
};

// DELETE SUBCATEGORY
export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subCategoryService.delete,
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.active });
      
      toast.success('SubCategory deleted successfully!');
    },
    
    onError: () => {
      toast.error('Failed to delete subcategory');
    }
  });
};

