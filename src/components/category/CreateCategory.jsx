import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function CreateCategory({ onCreate }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    featured: false,
  });

  const [bannerFile, setBannerFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBannerFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!form.name || !bannerFile) return;

    onCreate({
      ...form,
      id: Date.now(),
      slug: slugify(form.name),
      banner: bannerFile, // 👈 ab file ja rahi hai
    });

    // reset
    setForm({ name: "", description: "", featured: false });
    setBannerFile(null);
    setPreview(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Category</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Banner Image</label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-full object-cover rounded border"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={form.featured}
            onCheckedChange={(v) =>
              setForm({ ...form, featured: v })
            }
          />
          <span>Featured</span>
        </div>

        <Button onClick={handleSubmit}>Create Category</Button>
      </CardContent>
    </Card>
  );
}
