import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload, Trash2, Save } from "lucide-react";

const CreateSubCategory = ({ editData = null }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    image: null,
    bannerImage: null,
    isFeatured: false,
  });

  // Dummy categories (baad mein DB se ayengi)
  const categories = [
    { id: "1", name: "Saree" },
    { id: "2", name: "Suits" },

  ];

  // Edit mode data load
  useEffect(() => {
    if (editData) {
      setForm({
        ...editData,
        image: null,
        bannerImage: null,
      });
    }
  }, [editData]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.categoryId) {
      alert("Name & Category required");
      return;
    }

    if (editData) {
      console.log("UPDATE SUB CATEGORY 👉", form);
    } else {
      console.log("CREATE SUB CATEGORY 👉", form);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this sub category?")) {
      console.log("DELETE SUB CATEGORY 👉", editData?.id);
    }
  };

  return (
    <Card >
      <CardHeader>
        <CardTitle>
          {editData ? "Edit Sub Category" : "Create Sub Category"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 gap-3 grid grid-cols-2">
        {/* Name */}
        <div  className="space-y-2"> 
              <label className="text-sm font-medium">Sub Category Name</label>
        <Input
          placeholder="Sub Category Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        </div>
      <div className="space-y-2">
                     <label className="text-sm font-medium">Sub Category Description</label>
                      {/* Description */}
        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

       <div className="space-y-3">
          {/* Parent Category */}
            <label className="text-sm font-medium">Select Parent Category</label>
            
        <Select
          value={form.categoryId}
          onValueChange={(value) => handleChange("categoryId", value)}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
       </div>

      

        {/* Image Upload */}
        <div>
          <label className="text-sm font-medium">Sub Category Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleChange("image", e.target.files[0])}
          />
        </div>

        {/* Banner Image */}
        <div>
          <label className="text-sm font-medium">Banner Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleChange("bannerImage", e.target.files[0])
            }
          />
        </div>

        {/* Featured */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Featured Sub Category</span>
          <Switch
            checked={form.isFeatured}
            onCheckedChange={(value) =>
              handleChange("isFeatured", value)
            }
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-3">
          {editData && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}

          <Button className="ml-auto" onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            {editData ? "Update" : "Create"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateSubCategory;
