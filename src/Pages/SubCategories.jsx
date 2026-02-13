
import CreateSubCategory from "../components/category/CreateSubCategory";
import { EdDelSubCategory } from "../components/category/EdDelSubCategory";
import {
  useSubCategories,
  useCreateSubCategory,
  useUpdateSubCategory,
  useDeleteSubCategory,
} from "../tanstackhooks/useSubCategories";
import { useCategories } from "../tanstackhooks/useCategories"; // Import from category hooks
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { CategoryTableSkeleton } from "../components/ui/CategoryTableSkeleton";
const SubCategories = () => {
  const { data: subcategories, isLoading } = useSubCategories();
  const { data: categories } = useCategories(); // For parent category names
  const { mutate: createSubCategory, isPending: isCreating } = useCreateSubCategory();
  const { mutate: updateSubCategory, isPending: isUpdating } = useUpdateSubCategory();
  const { mutate: deleteSubCategory } = useDeleteSubCategory();

  const handleCreate = (data) => {
    createSubCategory(data);
  };

  const handleUpdate = ({ id, data }) => {
    updateSubCategory({ id, data });
  };

  const handleDelete = (id) => {
    deleteSubCategory(id);
  };

 

  return (
    <div className="space-y-7 p-6">


      <CreateSubCategory onSubmit={handleCreate} isLoading={isCreating} />
      {isLoading ?(
        <CategoryTableSkeleton />
      ):(
 <EdDelSubCategory
        subcategories={subcategories || []}
        categories={categories || []}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isLoading={isUpdating}
      />
      )}
     
    </div>
  );
};

export default SubCategories;