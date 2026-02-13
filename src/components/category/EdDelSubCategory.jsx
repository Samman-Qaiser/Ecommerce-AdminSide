import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Pencil, Trash2, Layers, Star, ImageIcon } from "lucide-react";
import CreateSubCategory from "./CreateSubCategory";

export function EdDelSubCategory({ 
  subcategories, 
  categories, 
  onUpdate, 
  onDelete, 
  isLoading 
}) {
  const [editSubCat, setEditSubCat] = useState(null);
  const [deleteSubCat, setDeleteSubCat] = useState(null);

  const handleUpdate = (data) => {
    onUpdate({
      id: editSubCat.id,
      data
    });
    setEditSubCat(null);
  };

  const getCategoryName = (categoryId) => {
    const category = categories?.find(cat => cat.id === categoryId);
    return category?.name || "Uncategorized";
  };

  if (!subcategories || subcategories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
        <Layers className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-600">No subcategories found</h3>
        <p className="text-slate-400">Add some categories to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead className="font-semibold">Sub Category</TableHead>
              <TableHead className="font-semibold">Parent</TableHead>
              <TableHead className="font-semibold">Badge</TableHead>
              <TableHead className="font-semibold">Featured</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subcategories.map((subCat) => (
              <TableRow key={subCat.id} className="hover:bg-slate-50/50 transition-colors group">
                <TableCell>
                  <div className="h-12 w-12 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
                    {subCat.image ? (
                      <img
                        src={subCat.image}
                        alt={subCat.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{subCat.name}</span>
                    <span className="text-[11px] text-slate-400 truncate max-w-37.5">
                      {subCat.description || "No description"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none px-2 py-0.5 font-medium">
                    {getCategoryName(subCat.categoryId)}
                  </Badge>
                </TableCell>

                <TableCell>
                  {subCat.badge && subCat.badge !== "none" ? (
                    <div className="flex items-center gap-1 text-xs font-medium text-amber-600">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {subCat.badge}
                    </div>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </TableCell>

                <TableCell>
                  {subCat.isFeatured ? (
                    <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-50 border-indigo-100 px-2 py-0.5 font-bold text-[10px] uppercase">
                      Featured
                    </Badge>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${subCat.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                    <span className={`text-xs font-semibold ${subCat.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {subCat.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => setEditSubCat(subCat)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-500 hover:text-destructive hover:bg-red-50"
                      onClick={() => setDeleteSubCat(subCat)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modern Dialog Styles */}
   {/* Edit Dialog - Width Adjusted */}
<Dialog open={!!editSubCat} onOpenChange={() => setEditSubCat(null)}>
  {/* Yahan max-w-5xl (approx 1024px) kiya hai jo form ke liye ideal hai */}
  <DialogContent className="min-w-4xl w-[85vw] p-0 overflow-y-auto h-[87vh] mt-7 border-none shadow-2xl bg-slate-50">
    <DialogHeader className="p-6 bg-white border-b">
      <div className="flex items-center justify-between">
        <div>
          <DialogTitle className="text-2xl font-bold text-slate-800">
            Edit Sub-Category
          </DialogTitle>
          <p className="text-sm text-slate-500 mt-1">
            Make changes to the sub-category details and assets below.
          </p>
        </div>
        {/* Optional: Aap yahan ek Badge bhi dikha sakte hain status ka */}
        <Badge variant={editSubCat?.isActive ? "success" : "secondary"}>
          {editSubCat?.isActive ? "Live" : "Draft"}
        </Badge>
      </div>
    </DialogHeader>

    {/* Scrollable area with proper padding */}
    <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar bg-slate-50/30">
      {editSubCat && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
           <CreateSubCategory
            editData={editSubCat}
            onSubmit={handleUpdate}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  </DialogContent>
</Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteSubCat} onOpenChange={() => setDeleteSubCat(null)}>
        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              You are about to delete <span className="font-bold text-slate-800">"{deleteSubCat?.name}"</span>. 
              This will remove all association with products. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-xl border-slate-200">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-6"
              onClick={() => {
                onDelete(deleteSubCat.id);
                setDeleteSubCat(null);
              }}
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}