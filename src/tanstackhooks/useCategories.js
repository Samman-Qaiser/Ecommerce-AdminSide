import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../service/categoryService';
import { toast } from 'react-hot-toast';

// Query Keys (centralized)
const QUERY_KEYS = {
  all: ['categories'],
  active: ['categories', 'active'],
  detail: (id) => ['categories', id],
};

// GET ALL CATEGORIES (Admin)
export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.all,
    queryFn: categoryService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

// GET ACTIVE CATEGORIES (User-facing)
export const useActiveCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.active,
    queryFn: categoryService.getActive,
    staleTime: 10 * 60 * 1000, // 10 minutes cache (rarely changes)
  });
};

// GET SINGLE CATEGORY
export const useCategory = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => categoryService.getById(id),
    enabled: !!id, // Only run if ID exists
  });
};

// CREATE CATEGORY
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.create,
    
    onSuccess: () => {
      // Invalidate cache - fresh data fetch hoga
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.active });
      
      toast.success('Category created successfully!');
    },
    
    onError: (error) => {
      toast.error('Failed to create category');
      console.error(error);
    }
  });
};

// UPDATE CATEGORY
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => categoryService.update(id, data),
    
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.active });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
      
      toast.success('Category updated successfully!');
    },
    
    onError: () => {
      toast.error('Failed to update category');
    }
  });
};

// DELETE CATEGORY
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.delete,
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.active });
      
      toast.success('Category deleted successfully!');
    },
    
    onError: () => {
      toast.error('Failed to delete category');
    }
  });
};

// TOGGLE ACTIVE STATUS
export const useToggleCategoryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, currentStatus }) => 
      categoryService.toggleActive(id, currentStatus),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.active });
      
      toast.success('Status updated!');
    }
  });
};