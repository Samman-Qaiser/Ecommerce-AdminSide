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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export function EdDelCategory({ categories, onDelete, onUpdate }) {
  const [editCat, setEditCat] = useState(null);

  const handleSave = () => {
    onUpdate(editCat);
    setEditCat(null);
  };

  return (
    <>
      <Table className="rounded-xl border bg-white shadow-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Banner</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Featured</TableHead>
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
                  "—"
                )}
              </TableCell>
              <TableCell className="font-medium">{cat.name}</TableCell>
              <TableCell className="text-muted-foreground">/{cat.slug}</TableCell>
              <TableCell>{cat.featured ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setEditCat(cat)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => onDelete(cat.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={!!editCat} onOpenChange={() => setEditCat(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>

          {editCat && (
            <div className="space-y-4">
              <Input
                value={editCat.name}
                onChange={(e) =>
                  setEditCat({ ...editCat, name: e.target.value })
                }
              />
              <Textarea
                value={editCat.description}
                onChange={(e) =>
                  setEditCat({ ...editCat, description: e.target.value })
                }
              />
              <Input
                value={editCat.banner}
                onChange={(e) =>
                  setEditCat({ ...editCat, banner: e.target.value })
                }
              />
              <div className="flex items-center gap-2">
                <Switch
                  checked={editCat.featured}
                  onCheckedChange={(v) =>
                    setEditCat({ ...editCat, featured: v })
                  }
                />
                <span>Featured</span>
              </div>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
