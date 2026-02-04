import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { 
  Upload, 
  X, 
  Plus, 
  Image as ImageIcon, 
  Video, 
  Save, 
  Eye,
  Sparkles,
  IndianRupee,
  Package,
  Tag,
  FileText,
  ChevronDown
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

const ProductAdd = () => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      categoryId: '',
      stock: '',
      featured: false,
      badge: '',
      status: 'active',
    }
  })

  // State for images and video
  const [mainImage, setMainImage] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])
  const [productVideo, setProductVideo] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)

  // Watch form values for preview
  const formValues = watch()

  // Main Categories with Subcategories
  const categories = {
    sarees: {
      name: 'Sarees',
      id: 'cat_sarees',
      subcategories: [
        { id: 'sub_silk_saree', name: 'Silk Sarees' },
        { id: 'sub_cotton_saree', name: 'Cotton Sarees' },
        { id: 'sub_designer_saree', name: 'Designer Sarees' },
        { id: 'sub_banarasi_saree', name: 'Banarasi Sarees' },
        { id: 'sub_kanjivaram_saree', name: 'Kanjivaram Sarees' },
        { id: 'sub_georgette_saree', name: 'Georgette Sarees' },
        { id: 'sub_chiffon_saree', name: 'Chiffon Sarees' },
        { id: 'sub_linen_saree', name: 'Linen Sarees' },
        // Add more as needed
      ]
    },
    suits: {
      name: 'Suits',
      id: 'cat_suits',
      subcategories: [
        { id: 'sub_anarkali_suit', name: 'Anarkali Suits' },
        { id: 'sub_punjabi_suit', name: 'Punjabi Suits' },
        { id: 'sub_palazzo_suit', name: 'Palazzo Suits' },
        { id: 'sub_straight_suit', name: 'Straight Suits' },
        { id: 'sub_sharara_suit', name: 'Sharara Suits' },
        { id: 'sub_churidar_suit', name: 'Churidar Suits' },
        { id: 'sub_patiala_suit', name: 'Patiala Suits' },
        { id: 'sub_cotton_suit', name: 'Cotton Suits' },
        // Add more as needed
      ]
    }
  }

  // Get all subcategories for dropdown
  const getAllSubcategories = () => {
    const allSubs = []
    Object.values(categories).forEach(cat => {
      cat.subcategories.forEach(sub => {
        allSubs.push({
          ...sub,
          parentName: cat.name
        })
      })
    })
    return allSubs
  }

  // Handle Main Image Upload
  const handleMainImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Gallery Images Upload
  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGalleryImages(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  // Handle Video Upload
  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProductVideo(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove Gallery Image
  const removeGalleryImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index))
  }

  // Calculate discount percentage
  const calculateDiscount = () => {
    const price = parseFloat(formValues.price) || 0
    const originalPrice = parseFloat(formValues.originalPrice) || 0
    if (originalPrice > price && price > 0) {
      return Math.round(((originalPrice - price) / originalPrice) * 100)
    }
    return 0
  }

  // Form Submit
  const onSubmit = (data) => {
    const productData = {
      ...data,
      image: mainImage,
      images: galleryImages,
      video: productVideo,
      inStock: parseInt(data.stock) > 0,
      discount: calculateDiscount(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    console.log('Product Data:', productData)
    alert('Product created successfully! (Check console for data)')
    
    // Here you'll add Firebase logic later
    // await addDoc(collection(db, 'products'), productData)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Add New Product
                </h1>
                <p className="text-sm text-slate-500">Create and manage your product catalog</p>
              </div>
            </div>
            
     
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Basic Information Card */}
              <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
                <div className="bg-linear-to-r from-slate-50 to-slate-100/50 px-6 py-4 border-b border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <FileText className="w-4 h-4 text-slate-700" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
                  </div>
                </div>
                
                <div className="p-6 space-y-5">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Royal Blue Banarasi Silk Saree"
                      className="h-11 bg-slate-50/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                      {...register('name', { required: 'Product name is required' })}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your product in detail... (features, material, occasion, etc.)"
                      rows={5}
                      className="resize-none bg-slate-50/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                      {...register('description', { required: 'Description is required' })}
                    />
                    {errors.description && (
                      <p className="text-xs text-red-500">{errors.description.message}</p>
                    )}
                  </div>

                  {/* Category & Subcategory */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) => {
                          const selected = getAllSubcategories().find(sub => sub.id === value)
                          setValue('category', selected.name)
                          setValue('categoryId', selected.id)
                        }}
                      >
                        <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(categories).map(cat => (
                            <React.Fragment key={cat.id}>
                              <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 bg-slate-50">
                                {cat.name}
                              </div>
                              {cat.subcategories.map(sub => (
                                <SelectItem key={sub.id} value={sub.id}>
                                  {sub.name}
                                </SelectItem>
                              ))}
                            </React.Fragment>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-xs text-red-500">{errors.category.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        Selected Category
                      </Label>
                      <div className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center">
                        <span className="text-sm text-slate-600">
                          {formValues.category || 'None selected'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
                <div className="bg-linear-to-r from-emerald-50 to-teal-50/50 px-6 py-4 border-b border-emerald-200/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <IndianRupee className="w-4 h-4 text-emerald-700" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">Pricing</h2>
                  </div>
                </div>
                
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Selling Price */}
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        Selling Price <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="price"
                          type="number"
                          placeholder="1800"
                          className="h-11 pl-10 bg-slate-50/50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                          {...register('price', { 
                            required: 'Price is required',
                            min: { value: 1, message: 'Price must be greater than 0' }
                          })}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-xs text-red-500">{errors.price.message}</p>
                      )}
                    </div>

                    {/* Original Price */}
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice" className="text-sm font-medium text-slate-700">
                        Original Price (Optional)
                      </Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="originalPrice"
                          type="number"
                          placeholder="2500"
                          className="h-11 pl-10 bg-slate-50/50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                          {...register('originalPrice')}
                        />
                      </div>
                      <p className="text-xs text-slate-500">For showing discount</p>
                    </div>
                  </div>

                  {/* Discount Badge */}
                  {calculateDiscount() > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">
                        {calculateDiscount()}% Discount will be displayed
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Inventory Card */}
              <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
                <div className="bg-linear-to-r from-orange-50 to-amber-50/50 px-6 py-4 border-b border-orange-200/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Package className="w-4 h-4 text-orange-700" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">Inventory</h2>
                  </div>
                </div>
                
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Stock Quantity */}
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        Stock Quantity <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="50"
                        className="h-11 bg-slate-50/50 border-slate-200 focus:border-orange-500 focus:ring-orange-500/20"
                        {...register('stock', { 
                          required: 'Stock quantity is required',
                          min: { value: 0, message: 'Stock cannot be negative' }
                        })}
                      />
                      {errors.stock && (
                        <p className="text-xs text-red-500">{errors.stock.message}</p>
                      )}
                    </div>

                    {/* Stock Status Display */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        Stock Status
                      </Label>
                      <div className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${parseInt(formValues.stock || 0) > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-sm text-slate-600">
                          {parseInt(formValues.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Media Upload Card */}
              <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
                <div className="bg-linear-to-r from-purple-50 to-pink-50/50 px-6 py-4 border-b border-purple-200/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <ImageIcon className="w-4 h-4 text-purple-700" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">Media Upload</h2>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Main Image */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      Main Product Image <span className="text-red-500">*</span>
                    </Label>
                    
                    {!mainImage ? (
                      <label className="group relative block w-full h-64 border-2 border-dashed border-slate-300 rounded-xl hover:border-purple-400 transition-all cursor-pointer overflow-hidden bg-linear-to-br from-slate-50 to-purple-50/20">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageChange}
                          className="hidden"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-purple-500" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-700">Click to upload main image</p>
                            <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
                          </div>
                        </div>
                      </label>
                    ) : (
                      <div className="relative group">
                        <img
                          src={mainImage}
                          alt="Main product"
                          className="w-full h-64 object-cover rounded-xl border-2 border-purple-200"
                        />
                        <button
                          type="button"
                          onClick={() => setMainImage(null)}
                          className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Gallery Images */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700">
                      Gallery Images (Optional)
                    </Label>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {galleryImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      
                      {/* Add More Button */}
                      <label className="group relative block w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:border-purple-400 transition-all cursor-pointer bg-slate-50/50">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryImagesChange}
                          className="hidden"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Plus className="w-6 h-6 text-slate-400 group-hover:text-purple-500 transition-colors" />
                          <span className="text-xs text-slate-500 mt-1">Add Images</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <Separator />

                  {/* Product Video */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      Product Video <span className="text-xs text-slate-500">(Optional)</span>
                    </Label>
                    
                    {!productVideo ? (
                      <label className="group relative block w-full h-48 border-2 border-dashed border-slate-300 rounded-xl hover:border-purple-400 transition-all cursor-pointer overflow-hidden bg-linear-to-br from-slate-50 to-indigo-50/20">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                          className="hidden"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <div className="w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Video className="w-7 h-7 text-indigo-500" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-700">Upload product video</p>
                            <p className="text-xs text-slate-500 mt-1">MP4, MOV, WebM up to 50MB</p>
                          </div>
                        </div>
                      </label>
                    ) : (
                      <div className="relative group">
                        <video
                          src={productVideo}
                          controls
                          className="w-full h-48 object-cover rounded-xl border-2 border-purple-200"
                        />
                        <button
                          type="button"
                          onClick={() => setProductVideo(null)}
                          className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Settings & Preview */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Display Settings Card */}
              <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden sticky top-24">
                <div className="bg-linear-to-r from-indigo-50 to-blue-50/50 px-6 py-4 border-b border-indigo-200/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Sparkles className="w-4 h-4 text-indigo-700" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">Display Settings</h2>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex-1">
                      <Label htmlFor="featured" className="text-sm font-medium text-slate-700 cursor-pointer">
                        Featured Product
                      </Label>
                      <p className="text-xs text-slate-500 mt-1">Show on homepage</p>
                    </div>
                    <Switch
                      id="featured"
                      checked={formValues.featured}
                      onCheckedChange={(checked) => setValue('featured', checked)}
                    />
                  </div>

                  {/* Badge Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Product Badge
                    </Label>
                <Select
  onValueChange={(value) => {
    if (value === "none") {
      setValue("badge", "")
    } else {
      setValue("badge", value)
    }
  }}
>
  <SelectTrigger className="h-11 bg-slate-50/50 w-full border-slate-200">
    <SelectValue placeholder="No badge" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="none">No Badge</SelectItem>
    <SelectItem value="NEW"> New Arrival</SelectItem>
    <SelectItem value="SALE"> On Sale</SelectItem>
    <SelectItem value="BEST SELLER"> Best Seller</SelectItem>
    <SelectItem value="TOP RATED"> Top Rated</SelectItem>
  </SelectContent>
</Select>

                  </div>

                  {/* Status Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      defaultValue="active"
                      onValueChange={(value) => setValue('status', value)}
                    >
                      <SelectTrigger className="h-11 w-full bg-slate-50/50 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem value="draft">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            Draft
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Submit Buttons */}
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full h-12 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Product
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11"
                      onClick={() => window.history.back()}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductAdd