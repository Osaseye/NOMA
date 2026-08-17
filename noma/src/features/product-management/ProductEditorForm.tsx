import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiSparkles, HiCheckCircle, HiArrowLeft, HiPhoto, HiPlus, HiTrash, HiArrowUpTray } from 'react-icons/hi2'
import type { Product, CategoryId } from '../../types/commerce'
import { formatNaira, getMarkupAmount } from '../../utils/pricing'
import { useProductStore } from '../../store/productStore'
import { storageService } from '../../services/firebase/storageService'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function ProductEditorForm({ product }: { product?: Product }) {
  const navigate = useNavigate()
  const { addProduct, updateProduct, categories } = useProductStore()

  const isEditing = Boolean(product?.id)

  const [name, setName] = useState(product?.name || '')
  const [category, setCategory] = useState(product?.category || (categories[0]?.id as CategoryId) || 'electronics')
  const [subCategory, setSubCategory] = useState(product?.subCategory || product?.subcategory || '')
  const [brand, setBrand] = useState(product?.brand || 'Noma')
  const [basePrice, setBasePrice] = useState(product?.basePrice || 100000)
  const [finalPrice, setFinalPrice] = useState(product?.finalPrice || 120000)
  const [stockQty, setStockQty] = useState(product?.stockQty || 15)
  const [badge, setBadge] = useState(product?.badge || 'Best Seller')
  const [discountBadge, setDiscountBadge] = useState(product?.discountBadge || '')
  const [bulky, setBulky] = useState(product?.bulky || false)
  const [image, setImage] = useState(product?.image || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80')
  const [detailImages, setDetailImages] = useState<string[]>([product?.image || ''])
  const [description, setDescription] = useState(product?.description || '')
  const [specs, setSpecs] = useState<string[]>(product?.specs || ['High durability build', '1 Year warranty'])
  const [newSpec, setNewSpec] = useState('')
  const [successMsg, setSuccessMsg] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Subcategories for current selected category
  const selectedCategoryObj = categories.find((c) => c.id === category)
  const availableSubCategories = selectedCategoryObj?.subcategories || []

  // Markup calculation
  const markupAmount = getMarkupAmount(finalPrice, basePrice)
  const markupPercent = basePrice > 0 ? Math.round(((finalPrice - basePrice) / basePrice) * 100) : 0

  // File Upload Handlers via storageService
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadingImage(true)
      const toastId = toast.loading('Uploading product image...')
      try {
        const downloadUrl = await storageService.uploadImage(file, 'products')
        setImage(downloadUrl)
        if (!detailImages.includes(downloadUrl)) {
          setDetailImages((prev) => [downloadUrl, ...prev])
        }
        toast.success('Product image uploaded!', { id: toastId })
      } catch (err: any) {
        console.error('Failed to upload product image:', err)
        toast.error(err?.message || 'Failed to upload product image', { id: toastId })
      } finally {
        setUploadingImage(false)
      }
    }
  }

  const handleDetailGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setUploadingImage(true)
      const toastId = toast.loading('Uploading gallery images...')
      try {
        for (const file of Array.from(files)) {
          const downloadUrl = await storageService.uploadImage(file, 'products')
          setDetailImages((prev) => [...prev, downloadUrl])
        }
        toast.success('Gallery images uploaded!', { id: toastId })
      } catch (err: any) {
        console.error('Failed to upload gallery images:', err)
        toast.error(err?.message || 'Failed to upload gallery images', { id: toastId })
      } finally {
        setUploadingImage(false)
      }
    }
  }

  const handleRemoveGalleryImage = (idx: number) => {
    setDetailImages(detailImages.filter((_, i) => i !== idx))
  }

  const handleAddSpec = () => {
    if (!newSpec.trim()) return
    setSpecs([...specs, newSpec.trim()])
    setNewSpec('')
  }

  const handleRemoveSpec = (idx: number) => {
    setSpecs(specs.filter((_, i) => i !== idx))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && product) {
      updateProduct(product.id, {
        name,
        category,
        subCategory,
        brand,
        basePrice: Number(basePrice),
        finalPrice: Number(finalPrice),
        stockQty: Number(stockQty),
        badge,
        discountBadge,
        bulky,
        image,
        description,
        specs,
      })
      toast.success('Product updated live on storefront!')
    } else {
      addProduct({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        subCategory,
        brand,
        basePrice: Number(basePrice),
        finalPrice: Number(finalPrice),
        stockQty: Number(stockQty),
        rating: 4.8,
        reviewsCount: 1,
        badge,
        discountBadge,
        bulky,
        image,
        description,
        specs,
      })
      toast.success(`Product "${name}" published live on storefront!`)
    }
    setSuccessMsg(true)
    setTimeout(() => {
      setSuccessMsg(false)
      navigate('/admin/products')
    }, 1200)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-12 font-['Outfit',sans-serif]">
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-100 p-4 text-xs font-bold text-emerald-800 shadow-md">
          <HiCheckCircle size={20} /> Product saved & published live! Redirecting to catalog...
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <HiArrowLeft size={16} /> Back to Products Catalog
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploadingImage}
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {isEditing ? 'Save & Update Product' : 'Create Product Card'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Basic Details & Pricing */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Basic Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
              Basic Product Information (Displayed on Card & Details Page)
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-600">Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samsung 55 UHD 4K Smart TV"
                className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-600">Main Category *</label>
                <select
                  value={category}
                  onChange={(e) => {
                    const newCat = e.target.value as CategoryId
                    setCategory(newCat)
                    setSubCategory('')
                  }}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-600">Sub Category</label>
                {availableSubCategories.length > 0 ? (
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="">-- Select Subcategory --</option>
                    {availableSubCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.label} {sub.ageGroup ? `(${sub.ageGroup})` : ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    placeholder="e.g. Women's Shoes, Mountain Bikes"
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                  />
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-600">Brand Name</label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Samsung, LG, Noma"
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-600">Product Details Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description shown to customers on the product detail page..."
                className="w-full rounded-xl border border-slate-300 p-3 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Pricing & Profit Psychology */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Pricing & Profit Psychology</span>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                <HiSparkles size={14} /> Confidential Operator Calculation
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-600">Supplier Base Cost (₦)</label>
                <input
                  type="number"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-600">Customer Final Retail Price (₦)</label>
                <input
                  type="number"
                  required
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-emerald-700 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4 border border-emerald-200">
              <div>
                <span className="text-xs font-bold text-slate-700">Calculated Markup Profit:</span>
                <span className="ml-2 text-sm font-black text-emerald-800">{formatNaira(markupAmount)}</span>
              </div>
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white">
                +{markupPercent}% Margin
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Media & Badges */}
        <div className="flex flex-col gap-6">
          {/* Main Image Uploader */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
              Main Product Image
            </h3>

            <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
              <img src={image} alt="Product Main" className="h-full w-full object-contain p-2" />
            </div>

            <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-500 bg-emerald-50/50 p-3 text-xs font-bold text-emerald-800 cursor-pointer hover:bg-emerald-100/60">
              {uploadingImage ? (
                <>
                  <Loader2 size={16} className="animate-spin text-emerald-600" />
                  <span>Uploading Image File...</span>
                </>
              ) : (
                <>
                  <HiArrowUpTray size={16} /> Upload Image File to Storage
                  <input type="file" accept="image/*" disabled={uploadingImage} onChange={handleMainImageUpload} className="hidden" />
                </>
              )}
            </label>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Or Image Web URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Inventory & Badge */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
              Stock & Badges
            </h3>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">Stock Quantity Available</label>
              <input
                type="number"
                required
                value={stockQty}
                onChange={(e) => setStockQty(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">Store Badge Tag</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Best Seller, New Arrival"
                className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={bulky}
                onChange={(e) => setBulky(e.target.checked)}
                className="rounded text-emerald-600"
              />
              Bulky Freight Item (Requires Special Delivery)
            </label>
          </div>
        </div>
      </div>
    </form>
  )
}
