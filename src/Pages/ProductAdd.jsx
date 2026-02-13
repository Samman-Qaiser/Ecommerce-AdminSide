import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Save,
  X,
  Upload,
  IndianRupee,
  FileText,
  Tag,
  Loader2,
  Image as ImageIcon,
  Video as VideoIcon,
  PackagePlus,
  Info,
  Layers,
  ShoppingBag,
  Zap
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '../components/ui/Progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { useActiveSubCategories } from '../tanstackhooks/useSubCategories';
import { useCreateProduct } from '../tanstackhooks/useProducts';

const BADGE_OPTIONS = ['Top Rated', 'New Arrival', 'Best Seller'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ProductAdd = ({ onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      stockQuantity: '',
      subCategoryId: '',
      fabric: ''
    }
  });

  const { data: subCategories, isLoading: loadingSubCategories } = useActiveSubCategories();
  const createProduct = useCreateProduct();

  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [colorInput, setColorInput] = useState('');
  const [colors, setColors] = useState([]);
  const [washcareInput, setWashcareInput] = useState('');
  const [washcare, setWashcare] = useState([]);

  const formValues = watch();

  const calculateDiscount = () => {
    const price = Number(formValues.price) || 0;
    const original = Number(formValues.originalPrice) || 0;
    if (original > price && price > 0) {
      return Math.round(((original - price) / original) * 100);
    }
    return 0;
  };

  const handleImageSelect = (files) => {
    const fileArray = Array.from(files);
    setImageFiles(prev => [...prev, ...fileArray]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleBadge = (badge) => {
    setSelectedBadges(prev => prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]);
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const addColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput.trim())) {
      setColors(prev => [...prev, colorInput.trim()]);
      setColorInput('');
    }
  };

  const addWashcare = () => {
    if (washcareInput.trim() && !washcare.includes(washcareInput.trim())) {
      setWashcare(prev => [...prev, washcareInput.trim()]);
      setWashcareInput('');
    }
  };

  const onSubmit = async (data) => {
    try {
      const productData = {
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description,
        price: Number(data.price),
        originalPrice: Number(data.originalPrice) || Number(data.price),
        discount: calculateDiscount(),
        stockQuantity: Number(data.stockQuantity),
        subCategoryId: data.subCategoryId || null,
        imageFiles,
        videoFile,
        badges: selectedBadges,
        details: { fabric: data.fabric || '', colors, sizes: selectedSizes, washcare }
      };
      await createProduct.mutateAsync({ productData, onProgress: setUploadProgress }, { onSuccess: () => onSuccess?.() });
    } catch (error) { console.error('Submit error:', error); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-300 mx-auto bg-slate-50/50 min-h-screen pb-20">
      
      {/* --- STICKY HEADER --- */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <PackagePlus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Create Product</h2>
            <p className="text-xs text-slate-500 font-medium">Add a new item to your storefront</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" type="button" onClick={onCancel} className="hover:bg-slate-100">Cancel</Button>
          <Button type="submit" disabled={createProduct.isPending || imageFiles.length === 0} className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
            {createProduct.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Publish Product
          </Button>
        </div>
      </div>

      <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LEFT COLUMN: GENERAL INFO & MEDIA --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Alert */}
          {uploadProgress && (
            <Alert className="bg-indigo-50 border-indigo-200">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              <AlertDescription className="w-full">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold text-indigo-700">Uploading Assets...</span>
                  <span className="text-sm font-bold text-indigo-700">{uploadProgress.progress}%</span>
                </div>
                <Progress value={uploadProgress.progress} className="h-2 bg-indigo-200" />
              </AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card className="border-none shadow-sm shadow-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-500" /> General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-slate-700 font-semibold">Product Title</Label>
                <Input 
                  id="name"
                  placeholder="e.g. Premium Oversized Cotton Hoodie" 
                  className={`bg-slate-50/50 focus-visible:ring-indigo-500 ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                  {...register('name', { required: 'Product name is required' })}
                />
                {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="text-slate-700 font-semibold">Description</Label>
                <Textarea 
                  id="description"
                  rows={5} 
                  placeholder="Write a compelling description..." 
                  className="bg-slate-50/50 resize-none border-slate-200 focus-visible:ring-indigo-500"
                  {...register('description', { required: 'Description is required' })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card className="border-none shadow-sm shadow-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-500" /> Product Media
              </CardTitle>
              <CardDescription>Upload high-quality images and a showcase video.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Image Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imageFiles.map((file, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm">
                    <img src={URL.createObjectURL(file)} className="h-full w-full object-cover transition group-hover:scale-105" alt="" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white p-1.5 rounded-full shadow-lg transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                <Label htmlFor="image-upload" className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-400 cursor-pointer transition-all group">
                  <div className="bg-slate-100 p-3 rounded-full group-hover:bg-indigo-50 transition-colors">
                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-2">Add Image</span>
                  <Input type="file" multiple accept="image/*" id="image-upload" className="hidden" onChange={(e) => handleImageSelect(e.target.files)} />
                </Label>
              </div>

              <Separator className="bg-slate-100" />

              {/* Video Section */}
              <div className="space-y-3">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <VideoIcon className="w-4 h-4" /> Product Video <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </Label>
                {videoFile ? (
                  <div className="relative rounded-xl overflow-hidden border">
                    <video src={URL.createObjectURL(videoFile)} className="w-full h-48 object-cover" controls />
                    <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-8 w-8" onClick={() => setVideoFile(null)}><X className="w-4 h-4" /></Button>
                  </div>
                ) : (
                  <Label htmlFor="video-upload" className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                    <div className="bg-indigo-50 p-3 rounded-lg"><VideoIcon className="w-5 h-5 text-indigo-500" /></div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-700">Upload Video</p>
                      <p className="text-xs text-slate-400">MP4, max 30s recommended</p>
                    </div>
                    <Input type="file" accept="video/*" id="video-upload" className="hidden" onChange={(e) => setVideoFile(e.target.files[0])} />
                  </Label>
                )}
              </div>
            </CardContent>
          </Card>
             {/* Specifications Card */}
          <Card className="border-none shadow-sm shadow-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-600 text-xs">Fabric Detail</Label>
                <Input {...register('fabric')} placeholder="Linen, Cotton..." className="mt-1 bg-slate-50/50" />
              </div>

              <div>
                <Label className="text-slate-600 text-xs font-bold mb-2 block uppercase tracking-tighter">Sizes Available</Label>
                <div className="flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map((size) => (
                    <div
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`h-9 w-9 flex items-center justify-center rounded-lg cursor-pointer border-2 transition-all font-bold text-xs ${
                        selectedSizes.includes(size) 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tag Style Inputs for Colors & Washcare */}
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-600 text-xs">Colors</Label>
                  <div className="flex gap-2 mt-1">
                    <Input value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())} placeholder="Red..." className="h-8 text-sm" />
                    <Button type="button" onClick={addColor} variant="outline" size="sm" className="h-8">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {colors.map((c, i) => (
                      <Badge key={i} variant="secondary" className="bg-slate-200 text-slate-700 hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer" onClick={() => setColors(prev => prev.filter((_, idx) => idx !== i))}>
                        {c} <X className="w-2 h-2 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- RIGHT COLUMN: PRICING & CATEGORY --- */}
        <div className="space-y-6">
          
          {/* Pricing Card */}
          <Card className="border-none shadow-sm shadow-slate-200 overflow-hidden">
            <div className="h-1.5 bg-indigo-500 w-full" />
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-500" /> Pricing & Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-slate-700 font-semibold">Selling Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">₹</span>
                  <Input type="number" {...register('price', { required: true })} className="pl-7 bg-slate-50/50 border-slate-200 focus-visible:ring-indigo-500" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-slate-700 font-semibold">MRP (Original Price)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">₹</span>
                  <Input type="number" {...register('originalPrice')} className="pl-7 bg-slate-50/50 border-slate-200 focus-visible:ring-indigo-500" />
                </div>
              </div>

              {calculateDiscount() > 0 && (
                <div className="bg-emerald-50 text-emerald-700 p-2 rounded-lg text-xs font-bold flex items-center gap-2 animate-pulse">
                  <Zap className="w-3 h-3 fill-emerald-700" /> {calculateDiscount()}% Discount Applied
                </div>
              )}

              <Separator className="bg-slate-100" />

              <div className="grid gap-2">
                <Label className="text-slate-700 font-semibold">Stock Quantity</Label>
                <Input type="number" {...register('stockQuantity', { required: true })} className="bg-slate-50/50 border-slate-200 focus-visible:ring-indigo-500" />
              </div>
            </CardContent>
          </Card>

          {/* Organization Card */}
          <Card className="border-none shadow-sm shadow-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" /> Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2">
                <Label className="text-slate-700 font-semibold">Category</Label>
                <Controller
                  name="subCategoryId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-slate-50/50 w-full border-slate-200">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Product Badges</Label>
                <div className="flex flex-wrap gap-2">
                  {BADGE_OPTIONS.map((badge) => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => toggleBadge(badge)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        selectedBadges.includes(badge) 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

       
        </div>
      </div>
    </form>
  );
};

export default ProductAdd;