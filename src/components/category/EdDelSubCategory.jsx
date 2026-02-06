import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const EdDelSubCategory = () => {
  const [subCategories, setSubCategories] = useState([
    {
      id: "sub_1",
      name: "Banarsi Saree",
      categoryName: "Saree",
      productCount: 12,
      isFeatured: true,
    },
    {
      id: "sub_2",
      name: "Silk Saree",
      categoryName: "Saree",
      productCount: 0,
      isFeatured: false,
    },
  ]);

  const categories = ["Saree", "Suits"];

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEdit = (sub) => {
    setEditData({ ...sub });
    setOpen(true);
  };

  const handleUpdate = () => {
    setSubCategories((prev) =>
      prev.map((item) =>
        item.id === editData.id ? editData : item
      )
    );
    setOpen(false);
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this sub category?")) return;
    setSubCategories((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Sub Categories
        </h2>

        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {subCategories.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">
                  {sub.name}
                </TableCell>
                <TableCell>{sub.categoryName}</TableCell>

                <TableCell>
                  <Badge variant="secondary">
                    {sub.productCount}
                  </Badge>
                </TableCell>

                <TableCell>
                  {sub.isFeatured ? (
                    <Star className="w-4 h-4 text-yellow-500" />
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(sub)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={sub.productCount > 0}
                    onClick={() => handleDelete(sub.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="text-sm text-muted-foreground mt-3">
          ⚠ Sub category with products cannot be deleted
        </p>
      </div>

      {/* 🔥 EDIT DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sub Category</DialogTitle>
          </DialogHeader>

          {editData && (
            <div className="space-y-4">
              <Input
                value={editData.name}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    name: e.target.value,
                  })
                }
                placeholder="Sub category name"
              />

              <Select
                value={editData.categoryName}
                onValueChange={(value) =>
                  setEditData({
                    ...editData,
                    categoryName: value,
                  })
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center justify-between">
                <span className="font-medium">
                  Featured
                </span>
                <Switch
                  checked={editData.isFeatured}
                  onCheckedChange={(val) =>
                    setEditData({
                      ...editData,
                      isFeatured: val,
                    })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EdDelSubCategory;
