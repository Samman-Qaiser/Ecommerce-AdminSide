import { EdDelCategory } from "../components/category/EdDelCategory";
import { CreateCategory } from "../components/category/CreateCategory";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory
} from "../tanstackhooks/useCategories";
// Skeleton ko import karna mat bhoolna
import { CategoryTableSkeleton } from "../components/ui/CategoryTableSkeleton"

const Categories = () => {
  const { data: categories, isLoading } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  const handleCreate = (data) => {
    createCategory(data);
  };

  const handleUpdate = (category) => {
    updateCategory({
      id: category.id,
      data: category
    });
  };

  const handleDelete = (id) => {
    deleteCategory(id);
  };



  return (
    <div className="space-y-7 p-6 max-w-350 mx-auto">
  
      
      {/* Create Section: Ye foran load ho jayega */}
      <CreateCategory 
        onCreate={handleCreate} 
        isLoading={isCreating} 
      />
      
      {/* Table Section: Yahan Skeleton logic hai */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xl font-semibold text-slate-800">Existing Categories</h2>
        
        {isLoading ? (
          <CategoryTableSkeleton /> 
        ) : (
          <div className="animate-in fade-in duration-500">
            <EdDelCategory
              categories={categories || []}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              isLoading={isUpdating}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;