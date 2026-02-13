import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Save, Loader2, BadgeCheck, X, ImagePlus, LayoutPanelTop } from "lucide-react";
import { useActiveCategories } from "../../tanstackhooks/useCategories";
import { toast } from "react-hot-toast";

const CreateSubCategory = ({ editData = null, onSubmit, isLoading }) => {
  const { data: parentCategories, isLoading: loadingCats } = useActiveCategories();

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    badge: "none",
    isFeatured: false,
    isActive: true,
  });

  const [files, setFiles] = useState({ image: null, banner: null });
  const [previews, setPreviews] = useState({ image: null, banner: null });

  // Pre-fill form
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        description: editData.description || "",
        categoryId: editData.categoryId || "",
        badge: editData.badge || "none",
        isFeatured: editData.isFeatured || false,
        isActive: editData.isActive || true,
      });
      setPreviews({
        image: editData.image || null,
        banner: editData.banner || null,
      });
    }
  }, [editData]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error(`${type === 'image' ? 'Thumbnail' : 'Banner'} size must be under 2MB`);
    }

    setFiles((prev) => ({ ...prev, [type]: file }));
    setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    toast.success(`${type === 'image' ? 'Thumbnail' : 'Banner'} selected!`);
  };

  const removeImage = (type) => {
    setFiles((prev) => ({ ...prev, [type]: null }));
    setPreviews((prev) => ({ ...prev, [type]: null }));
  };

 const handleSubmit = async () => {
    if (!form.name || !form.categoryId) {
      return toast.error("Name and Category are mandatory!");
    }

    try {
        console.log("Submitting Form Data:", form); // Debugging line
        
        // Agar onSubmit prop nahi mila toh error throw karega
        if (!onSubmit) {
          throw new Error("onSubmit prop is missing in the component!");
        }

        await onSubmit({
            ...form,
            imageFile: files.image,
            bannerFile: files.banner,
        });
        
    } catch (error) {
        console.error("Submission Error:", error);
        // Ab exact error toast mein dikhayega
        toast.error(error.message || "Submission failed!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
            {editData ? "Edit Sub-Category" : "Create Sub-Category"}
          </h2>
          <p className="text-slate-500 text-sm">Organize your products with precision.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md border-slate-200">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-base font-semibold">General Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium text-slate-700">Sub-Category Name *</Label>
                  <Input
                    placeholder="e.g. Luxury Handbags"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium text-slate-700">Parent Category *</Label>
                  <Select
                    value={form.categoryId}
                    onValueChange={(v) => setForm({ ...form, categoryId: v })}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder={loadingCats ? "Fetching..." : "Select Parent"} />
                    </SelectTrigger>
                    <SelectContent>
                      {parentCategories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-medium text-slate-700">Description</Label>
                <Textarea
                  placeholder="Tell customers about this collection..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="min-h-30 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Banner Upload Card */}
          <Card className="shadow-md border-slate-200">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <LayoutPanelTop className="w-4 h-4" /> Category Banner
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {previews.banner ? (
                <div className="relative rounded-lg overflow-hidden border-2 border-slate-100">
                  <img src={previews.banner} className="w-full h-48 object-cover" />
                  <Button 
                    variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full"
                    onClick={() => removeImage('banner')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 rounded-lg h-40 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group">
                  <ImagePlus className="w-10 h-10 text-slate-400 group-hover:scale-110 transition-transform" />
                  <span className="mt-2 text-sm font-medium text-slate-600">Upload Banner Image</span>
                  <p className="text-xs text-slate-400">Recommended: 1200x400px</p>
                  <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'banner')} accept="image/*" />
                </label>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Settings & Thumbnail */}
        <div className="space-y-6">
          <Card className="shadow-md border-slate-200">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-base font-semibold">Thumbnail & Badge</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Thumbnail Upload */}
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Thumbnail</Label>
                {previews.image ? (
                  <div className="relative rounded-lg overflow-hidden border">
                    <img src={previews.image} className="w-full h-40 object-cover" />
                    <Button 
                      variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full"
                      onClick={() => removeImage('image')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 rounded-lg h-40 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer">
                    <ImagePlus className="w-8 h-8 text-slate-400" />
                    <span className="mt-2 text-xs font-medium text-slate-600">Upload Square Image</span>
                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'image')} accept="image/*" />
                  </label>
                )}
              </div>

              {/* Badge Selection */}
              <div className="space-y-3 pt-4 border-t">
                <Label className="flex items-center gap-2 font-medium">
                  <BadgeCheck className="w-4 h-4 text-primary" /> Promotion Badge
                </Label>
                <Select value={form.badge} onValueChange={(v) => setForm({ ...form, badge: v })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="Best Seller">🔥 Best Seller</SelectItem>
                    <SelectItem value="Top Rated">⭐ Top Rated</SelectItem>
                    <SelectItem value="New Arrival">✨ New Arrival</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Switches */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 transition-colors">
                  <Label className="cursor-pointer">Featured Category</Label>
                  <Switch checked={form.isFeatured} onCheckedChange={(v) => setForm({ ...form, isFeatured: v })} />
                </div>
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 transition-colors">
                  <Label className="cursor-pointer font-semibold text-primary">Active Status</Label>
                  <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-5 h-5" />}
            {editData ? "Update Sub-Category" : "Publish Sub-Category"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateSubCategory;