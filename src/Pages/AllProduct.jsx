import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Search, PackagePlus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

import AdminProductCard from '../components/Product/ProductCard';
import ProductEdit from '../components/Product/ProductEdit';
import ProductAdd from './ProductAdd';

import { 
  useProducts, 
  useDeleteProduct,
  useProductSearch 
} from '../tanstackhooks/useProducts';
import {  ProductGridSkeleton } from '../components/Product/ProductSekeletonCard';

const AllProduct = () => {
  // State
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Queries
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useProducts({
    pageSize: 20
  });

  const { data: searchResults, isLoading: searchLoading } = useProductSearch(
    searchTerm,
    { enabled: searchTerm.length > 2 }
  );

  // Mutations
  const deleteProductMutation = useDeleteProduct();

  // Handlers
  const handleEdit = (product) => {
    setEditProduct(product);
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    
    try {
      await deleteProductMutation.mutateAsync(deleteProduct.id);
      setDeleteProduct(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setIsSearching(value.length > 2);
  };

  // Get products to display
  const displayProducts = isSearching 
    ? searchResults || []
    : data?.pages.flatMap(page => page.products) || [];

  // Loading state
  if (isLoading) {
    return (
   <ProductGridSkeleton count={12} />
  
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load products: {error?.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-slate-500 text-sm">
            {displayProducts.length} products total
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
        {searchLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-slate-400" />
        )}
      </div>

      {/* Products Grid */}
      {displayProducts.length === 0 ? (
        <div className="text-center py-12">
          <PackagePlus className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-semibold text-slate-600">No products found</h3>
          <p className="text-slate-500 text-sm mt-1">
            {isSearching 
              ? 'Try a different search term'
              : 'Get started by adding your first product'
            }
          </p>
          {!isSearching && (
            <Button onClick={() => setShowAddDialog(true)} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <AdminProductCard
                key={product.id}
                product={product}
                isAdmin
                onEdit={() => handleEdit(product)}
                onDelete={() => setDeleteProduct(product)}
              />
            ))}
          </div>

          {/* Load More */}
          {!isSearching && hasNextPage && (
            <div className="flex justify-center pt-6">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] mt-5 overflow-y-auto">
          <ProductAdd
            onSuccess={() => setShowAddDialog(false)}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {editProduct && (
            <ProductEdit
              product={editProduct}
              onSave={() => setEditProduct(null)}
              onCancel={() => setEditProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteProduct}
        onOpenChange={() => setDeleteProduct(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteProduct?.name}"? This action
              cannot be undone and will permanently remove the product and all its images.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteProductMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AllProduct;