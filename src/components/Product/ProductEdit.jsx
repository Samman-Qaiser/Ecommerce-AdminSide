import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Save,
  Image as ImageIcon,
  Video,
  X,
  Sparkles,
  IndianRupee,
  Package,
  FileText,
  Tag,
  Upload,
  Loader2,
  AlertCircle
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/Progress.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useActiveSubCategories } from '../../tanstackhooks/useSubCategories';
import { useUpdateProduct } from '../../tanstackhooks/useProducts';

const BADGE_OPTIONS = ['Top Rated', 'New Arrival', 'Best Seller'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ProductEdit = ({ product, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      ...product,
      details: product.details || {
        fabric: '',
        colors: [],
        sizes: [],
        washcare: []
      }
    }
  });

  // Hooks
  const { data: subCategories, isLoading: loadingSubCategories } = useActiveSubCategories();
  const updateProduct = useUpdateProduct();

  // Local state
  const [existingImages, setExistingImages] = useState(product.images || []);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [existingVideo, setExistingVideo] = useState(product.video || null);
  const [newVideoFile, setNewVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [selectedBadges, setSelectedBadges] = useState(product.badges || []);
  const [selectedSizes, setSelectedSizes] = useState(product.details?.sizes || []);
  const [colorInput, setColorInput] = useState('');
  const [colors, setColors] = useState(product.details?.colors || []);
  const [washcareInput, setWashcareInput] = useState('');
  const [washcare, setWashcare] = useState(product.details?.washcare || []);

  const formValues = watch();

  // Calculate discount
  const calculateDiscount = () => {
    const price = Number(formValues.price) || 0;
    const original = Number(formValues.originalPrice) || 0;
    if (original > price && price > 0) {
      return Math.round(((original - price) / original) * 100);
    }
    return 0;
  };

  // Handle new image selection
  const handleNewImages = (files) => {
    const fileArray = Array.from(files);
    setNewImageFiles(prev => [...prev, ...fileArray]);
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove new image
  const removeNewImage = (index) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle video upload
  const handleVideoUpload = (file) => {
    if (!file) return;
    setNewVideoFile(file);
  };

  // Toggle badge
  const toggleBadge = (badge) => {
    setSelectedBadges(prev =>
      prev.includes(badge)
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
    );
  };

  // Toggle size
  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  // Add color
  const addColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput.trim())) {
      setColors(prev => [...prev, colorInput.trim()]);
      setColorInput('');
    }
  };

  // Add washcare
  const addWashcare = () => {
    if (washcareInput.trim() && !washcare.includes(washcareInput.trim())) {
      setWashcare(prev => [...prev, washcareInput.trim()]);
      setWashcareInput('');
    }
  };

  // Submit handler
  const onSubmit = async (data) => {
    try {
      const productData = {
        ...data,
        existingImages,
        imageFiles: newImageFiles,
        existingVideo,
        videoFile: newVideoFile,
        badges: selectedBadges,
        discount: calculateDiscount(),
        details: {
          fabric: data.fabric || '',
          colors,
          sizes: selectedSizes,
          washcare
        }
      };

      await updateProduct.mutateAsync(
        {
          id: product.id,
          productData,
          onProgress: setUploadProgress
        },
        {
          onSuccess: () => {
            onSave?.();
          }
        }
      );
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Edit Product</h2>
          <p className="text-sm text-slate-500">Update product information</p>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {uploadProgress.stage === 'images' && 'Uploading images...'}
                {uploadProgress.stage === 'video' && 'Uploading video...'}
                {uploadProgress.stage === 'saving' && 'Saving product...'}
                {uploadProgress.stage === 'complete' && 'Complete!'}
              </p>
              <Progress value={uploadProgress.progress} />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* BASIC INFO */}
      <div className="space-y-4">
        <div>
          <Label>
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            className="border border-gray-300 mt-2"
            {...register('name', { required: 'Product name is required' })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-2">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            rows={4}
            className="border border-gray-300 mt-2"
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* SubCategory Selection */}
        <div>
          <Label className="mb-2">Category</Label>
          <Controller
            name="subCategoryId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={loadingSubCategories}
              >
                <SelectTrigger className="border border-gray-300 mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* PRICING */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2">
            Selling Price <span className="text-red-500">*</span>
          </Label>
          <div className="relative mt-2">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="number"
              className="pl-10 border border-gray-300"
              {...register('price', { 
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' }
              })}
            />
          </div>
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-2">Original Price (MRP)</Label>
          <Input
            type="number"
            className="border border-gray-300 mt-2"
            {...register('originalPrice')}
          />
        </div>
      </div>

      {calculateDiscount() > 0 && (
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <Tag className="w-4 h-4" />
          {calculateDiscount()}% discount applied
        </div>
      )}

      <Separator />

      {/* INVENTORY */}
      <div>
        <Label className="mb-2">
          Stock Quantity <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          className="border border-gray-300 mt-2"
          {...register('stockQuantity', { 
            required: 'Stock quantity is required',
            min: { value: 0, message: 'Stock cannot be negative' }
          })}
        />
        {errors.stockQuantity && (
          <p className="text-red-500 text-sm mt-1">{errors.stockQuantity.message}</p>
        )}
      </div>

      <Separator />

      {/* PRODUCT IMAGES */}
      <div className="space-y-3">
        <Label>Product Images</Label>
        
        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div>
            <p className="text-sm text-slate-500 mb-2">Current Images</p>
            <div className="grid grid-cols-4 gap-3">
              {existingImages.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt={`Product ${i + 1}`}
                    className="h-24 w-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images Preview */}
        {newImageFiles.length > 0 && (
          <div>
            <p className="text-sm text-slate-500 mb-2">New Images</p>
            <div className="grid grid-cols-4 gap-3">
              {newImageFiles.map((file, i) => (
                <div key={i} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New ${i + 1}`}
                    className="h-24 w-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleNewImages(e.target.files)}
            className="hidden"
            id="image-upload"
          />
          <Label
            htmlFor="image-upload"
            className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg hover:bg-slate-50 transition"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm">Add More Images</span>
          </Label>
        </div>
      </div>

      <Separator />

      {/* PRODUCT VIDEO */}
      <div className="space-y-3">
        <Label>Product Video (optional)</Label>

        {(existingVideo || newVideoFile) && (
          <div className="relative">
            <video
              src={newVideoFile ? URL.createObjectURL(newVideoFile) : existingVideo}
              controls
              className="w-full h-48 rounded-lg border object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setExistingVideo(null);
                setNewVideoFile(null);
              }}
              className="absolute top-2 right-2 bg-red-600 text-white rounded p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <Input
          type="file"
          accept="video/mp4,video/webm"
          onChange={(e) => handleVideoUpload(e.target.files[0])}
        />
        <p className="text-xs text-slate-500">
          Recommended: MP4 format, max 30 seconds
        </p>
      </div>

      <Separator />

      {/* BADGES */}
      <div className="space-y-3">
        <Label>Product Badges</Label>
        <div className="flex flex-wrap gap-2">
          {BADGE_OPTIONS.map((badge) => (
            <Badge
              key={badge}
              variant={selectedBadges.includes(badge) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleBadge(badge)}
            >
              {badge}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* PRODUCT DETAILS */}
      <div className="space-y-4">
        <h3 className="font-semibold">Product Details</h3>

        {/* Fabric */}
        <div>
          <Label>Fabric</Label>
          <Input
            className="border border-gray-300 mt-2"
            {...register('fabric')}
            placeholder="e.g., 100% Cotton"
          />
        </div>

        {/* Colors */}
        <div>
          <Label>Available Colors</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="Enter color"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
            />
            <Button type="button" onClick={addColor} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {colors.map((color, i) => (
              <Badge key={i} variant="secondary">
                {color}
                <X
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() => setColors(prev => prev.filter((_, idx) => idx !== i))}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <Label>Available Sizes</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {SIZE_OPTIONS.map((size) => (
              <Badge
                key={size}
                variant={selectedSizes.includes(size) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleSize(size)}
              >
                {size}
              </Badge>
            ))}
          </div>
        </div>

        {/* Washcare */}
        <div>
          <Label>Wash Care Instructions</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={washcareInput}
              onChange={(e) => setWashcareInput(e.target.value)}
              placeholder="Enter instruction"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWashcare())}
            />
            <Button type="button" onClick={addWashcare} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {washcare.map((item, i) => (
              <Badge key={i} variant="secondary">
                {item}
                <X
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() => setWashcare(prev => prev.filter((_, idx) => idx !== i))}
                />
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
          disabled={updateProduct.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={updateProduct.isPending}>
          {updateProduct.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductEdit;