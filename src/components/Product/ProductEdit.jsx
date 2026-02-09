import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Save,
  Image as ImageIcon,
  Video,
  X,
  Sparkles,
  IndianRupee,
  Package,
  FileText,
  Tag
} from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

const ProductEdit = ({ product, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: product
  })

  const [mainImage, setMainImage] = useState(product.image)
  const [galleryImages, setGalleryImages] = useState(product.images || [])
  const [productVideo, setProductVideo] = useState(product.video || null)

  const formValues = watch()

  // ---------- helpers ----------
  const calculateDiscount = () => {
    const price = Number(formValues.price) || 0
    const original = Number(formValues.originalPrice) || 0
    if (original > price && price > 0) {
      return Math.round(((original - price) / original) * 100)
    }
    return 0
  }

  const handleImageUpload = (file, setter) => {
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setter(reader.result)
    reader.readAsDataURL(file)
  }

  const onSubmit = (data) => {
    const updatedProduct = {
      ...product,
      ...data,
      image: mainImage,
      images: galleryImages,
      video: productVideo,
      discount: calculateDiscount(),
      updatedAt: new Date().toISOString(),
      inStock: Number(data.stock) > 0,
    }

    onSave(updatedProduct)
  }
 const handleVideoUpload = (file) => {
  if (!file) return
  const reader = new FileReader()
  reader.onloadend = () => setProductVideo(reader.result)
  reader.readAsDataURL(file)
}

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

      {/* BASIC INFO */}
      <div className="space-y-4">
        <Label>Product Name <span className="text-red-500">*</span></Label>
        <Input
          className='border border-gray-300'
          {...register('name', { required: 'Required' })}
        />

        <Label className='mb-2'>Description <span className="text-red-500">*</span></Label>
        <Textarea
          rows={4}
          className='border border-gray-300'
          {...register('description', { required: 'Required' })}
        />
      </div>

      <Separator />

      {/* PRICING */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className='mb-2'>Selling Price *</Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="number"
              className="pl-10 border border-gray-300"
              {...register('price', { required: true })}
            />
          </div>
        </div>

        <div>
          <Label className='mb-2'>Original Price</Label>
          <Input type="number" {...register('originalPrice')} className='border border-gray-300' />
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
        <Label className='mb-2'>Stock Quantity *</Label>
        <Input
          type="number"
          className='border border-gray-300'
          {...register('stock', { required: true })}
        />
      </div>

      <Separator />

      {/* MAIN IMAGE */}
      <div className="space-y-2">
        <Label>Main Image *</Label>
        {mainImage && (
          <img
            src={mainImage}
            className="h-40 rounded-lg object-cover border"
          />
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0], setMainImage)}
        />
      </div>

      {/* GALLERY */}
      <div className="space-y-2">
        <Label>Gallery Images</Label>
        <div className="grid grid-cols-4 gap-3">
          {galleryImages.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} className="h-24 w-full object-cover rounded" />
              <button
                type="button"
                onClick={() =>
                  setGalleryImages(galleryImages.filter((_, x) => x !== i))
                }
                className="absolute top-1 right-1 bg-red-500 text-white rounded p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            Array.from(e.target.files).forEach(f =>
              handleImageUpload(f, img =>
                setGalleryImages(prev => [...prev, img])
              )
            )
          }
        />
      </div>

      <Separator />


{/* PRODUCT VIDEO */}
<div className="space-y-2">
  <Label>Product Video (optional)</Label>

  {productVideo && (
    <div className="relative">
      <video
        src={productVideo}
        controls
        className="w-full h-48 rounded-lg border object-cover"
      />
      <button
        type="button"
        onClick={() => setProductVideo(null)}
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
    Recommended: MP4, max 20–30 seconds
  </p>
</div>


      {/* FEATURED */}
      <div className="flex items-center justify-between">
        <Label>Featured Product</Label>
        <Switch
         className='bg-amber-300'
          checked={formValues.featured}
          onCheckedChange={(v) => setValue('featured', v)}
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

    </form>
  )
}

export default ProductEdit
