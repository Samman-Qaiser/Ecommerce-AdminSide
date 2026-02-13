import { useState } from "react";
import { toast } from "react-hot-toast"; // Using react-hot-toast
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ImagePlus, X, LayoutGrid, Loader2, CheckCircle2 } from "lucide-react";

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function CreateCategory({ onCreate, isLoading }) {
  const initialState = {
    name: "",
    description: "",
    featured: false,
    isActive: true,
  };

  const [form, setForm] = useState(initialState);
  const [previews, setPreviews] = useState({ banner: null, main: null });
  const [files, setFiles] = useState({ banner: null, main: null });

  // Handle Image Selection
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit check
        return toast.error("File is too large! Max 2MB allowed.");
      }
      setFiles((prev) => ({ ...prev, [type]: file }));
      setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const removeImage = (type) => {
    setPreviews((prev) => ({ ...prev, [type]: null }));
    setFiles((prev) => ({ ...prev, [type]: null }));
  };

  const resetForm = () => {
    setForm(initialState);
    setPreviews({ banner: null, main: null });
    setFiles({ banner: null, main: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      return toast.error("Category name is required!");
    }

    try {
      // Logic pass to parent
      await onCreate({
        ...form,
        slug: slugify(form.name),
        bannerFile: files.banner,
        mainImageFile: files.main,
      });

      // Show Success Toast
      toast.success("Category published successfully!");
      resetForm();
    } catch (error) {
      toast.error(error?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="w-full mx-auto  animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <LayoutGrid className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Category</h1>
            <p className="text-sm text-muted-foreground">Add a new category to your store's inventory.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <Button variant="outline" onClick={resetForm} disabled={isLoading}>
                Discard
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} className="min-w-[140px]">
                {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>
                ) : (
                    "Publish Category"
                )}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-md bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Category Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">Category Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Summer Collection"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-background/50 h-11 focus-visible:ring-primary"
                />
                <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                  <span className="bg-muted px-1.5 py-0.5 rounded text-primary">Slug:</span>
                  <span>{slugify(form.name) || "automatic"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc" className="text-sm font-semibold">Description</Label>
                <Textarea
                  id="desc"
                  rows={6}
                  placeholder="Enter category description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="bg-background/50 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Visibility & Status</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 border rounded-xl bg-background/30">
                    <div className="space-y-0.5">
                        <Label className="text-sm">Featured Category</Label>
                        <p className="text-xs text-muted-foreground">Display on home page</p>
                    </div>
                    <Switch
                        checked={form.featured}
                        onCheckedChange={(v) => setForm({ ...form, featured: v })}
                    />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl bg-background/30">
                    <div className="space-y-0.5">
                        <Label className="text-sm">Active Status</Label>
                        <p className="text-xs text-muted-foreground">Visible to customers</p>
                    </div>
                    <Switch
                        checked={form.isActive}
                        onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                    />
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Media Side */}
        <div className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-primary/[0.03]">
              <CardTitle className="text-sm uppercase font-bold text-muted-foreground tracking-widest">Display Assets</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Thumbnail */}
              <div className="space-y-3">
                <Label className="text-xs font-bold text-center block">Thumbnail Image (1:1)</Label>
                <div className="relative group border-2 border-dashed rounded-2xl p-2 hover:border-primary/50 transition-all cursor-pointer">
                  {previews.main ? (
                    <div className="relative aspect-square rounded-xl overflow-hidden shadow-inner">
                      <img src={previews.main} className="object-cover w-full h-full" alt="Main" />
                      <button 
                        onClick={() => removeImage('main')} 
                        className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-square rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                      <ImagePlus className="w-10 h-10 text-muted-foreground/60 mb-2" />
                      <span className="text-[10px] font-medium text-muted-foreground">Upload 800x800</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'main')} />
                    </label>
                  )}
                </div>
              </div>

              {/* Banner */}
              <div className="space-y-3">
                <Label className="text-xs font-bold text-center block">Banner Image (16:9)</Label>
                <div className="relative group border-2 border-dashed rounded-2xl p-2 hover:border-primary/50 transition-all cursor-pointer">
                  {previews.banner ? (
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-inner">
                      <img src={previews.banner} className="object-cover w-full h-full" alt="Banner" />
                      <button 
                        onClick={() => removeImage('banner')} 
                        className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-[16/9] rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                      <ImagePlus className="w-8 h-8 text-muted-foreground/60 mb-1" />
                      <span className="text-[10px] font-medium text-muted-foreground">Upload 1920x1080</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'banner')} />
                    </label>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}