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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ImageDownIcon, ImageIcon, Pencil, Trash2 } from "lucide-react";

export function EdDelCategory({ categories, onDelete, onUpdate, isLoading }) {
  const [editCat, setEditCat] = useState(null);
  const [deleteCat, setDeleteCat] = useState(null);
  
  const [bannerFile, setBannerFile] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);

  const handleEdit = (cat) => {
    setEditCat(cat);
    setBannerPreview(cat.banner || null);
    setMainImagePreview(cat.mainImage || null);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    onUpdate({
      ...editCat,
      bannerFile,
      mainImageFile,
    });
    
    // Reset
    setEditCat(null);
    setBannerFile(null);
    setMainImageFile(null);
    setBannerPreview(null);
    setMainImagePreview(null);
  };

  const handleCancel = () => {
    setEditCat(null);
    setBannerFile(null);
    setMainImageFile(null);
    setBannerPreview(null);
    setMainImagePreview(null);
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No categories found. Create your first category!
      </div>
    );
  }

  return (
    <>
      <Table className="rounded-xl border bg-white shadow-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Banner</TableHead>
            <TableHead>Main Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell>
                {cat.banner ? (
                  <img
                    src={cat.banner}
                    alt={cat.name}
                    className="h-10 w-16 object-cover rounded"
                  />
                ) : (
               <ImageIcon className="w-5 h-5 text-slate-300" />
                )}
              </TableCell>
              <TableCell>
                {cat.mainImage ? (
                  <img
                    src={cat.mainImage}
                    alt={cat.name}
                    className="h-10 w-16 object-cover rounded"
                  />
                ) : (
                 <ImageIcon className="w-15 h-5 text-slate-300" />
           
                )}
              </TableCell>
              <TableCell className="font-medium">{cat.name}</TableCell>
              <TableCell className="text-muted-foreground">
                /{cat.slug}
              </TableCell>
              <TableCell>
                {cat.featured ? (
                  <Badge variant="default">Featured</Badge>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell>
                {cat.isActive ? (
                  <Badge variant="success" className="bg-green-500">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleEdit(cat)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => setDeleteCat(cat)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={!!editCat} onOpenChange={handleCancel}>
        <DialogContent className="max-w-2xl max-h-[88vh] mt-7 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>

          {editCat && (
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input
                  value={editCat.name}
                  onChange={(e) =>
                    setEditCat({ ...editCat, name: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editCat.description}
                  onChange={(e) =>
                    setEditCat({ ...editCat, description: e.target.value })
                  }
                />
              </div>

              {/* Banner Image */}
              <div className="space-y-2">
                <Label>Banner Image</Label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleBannerChange} 
                />
                {bannerPreview && (
                  <img
                    src={bannerPreview}
                    alt="Banner"
                    className="h-32 w-full object-cover rounded border"
                  />
                )}
              </div>

              {/* Main Image */}
              <div className="space-y-2">
                <Label>Main Image</Label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleMainImageChange} 
                />
                {mainImagePreview && (
                  <img
                    src={mainImagePreview}
                    alt="Main"
                    className="h-32 w-full object-cover rounded border"
                  />
                )}
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2">
                <Switch
                  id="edit-featured"
                  checked={editCat.featured}
                  onCheckedChange={(v) =>
                    setEditCat({ ...editCat, featured: v })
                  }
                />
                <Label htmlFor="edit-featured">Featured</Label>
              </div>

              {/* Active */}
              <div className="flex items-center gap-2">
                <Switch
                  id="edit-active"
                  checked={editCat.isActive}
                  onCheckedChange={(v) =>
                    setEditCat({ ...editCat, isActive: v })
                  }
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteCat}
        onOpenChange={() => setDeleteCat(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteCat?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                onDelete(deleteCat.id);
                setDeleteCat(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}