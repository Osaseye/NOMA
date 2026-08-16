import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiSparkles, HiCheckCircle, HiArrowLeft, HiPhoto, HiPlus, HiTrash, HiArrowUpTray } from 'react-icons/hi2'
import type { Product, CategoryId } from '../../types/commerce'
import { formatNaira, getMarkupAmount } from '../../utils/pricing'
import { useProductStore } from '../../store/productStore'

export function ProductEditorForm({ product }: { product?: Product }) {
  const navigate = useNavigate()
  const { addProduct, updateProduct, categories } = useProductStore()

  const isEditing = Boolean(product?.id)

  const [name, setName] = useState(product?.name || '')
  const [category, setCategory] = useState(product?.category || 'electronics')
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

  // Markup calculation
  const markupAmount = getMarkupAmount(finalPrice, basePrice)
  const markupPercent = basePrice > 0 ? Math.round(((finalPrice - basePrice) / basePrice) * 100) : 0

  // File Upload Handlers
  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setImage(result)
        if (!detailImages.includes(result)) {
          setDetailImages((prev) => [result, ...prev])
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDetailGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          setDetailImages((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
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
    } else {
      addProduct({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
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
    }
    setSuccessMsg(true)
    setTimeout(() => {
      setSuccessMsg(false)
      navigate('/admin/products')
    }, 1200)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-12">
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-100 p-4 text-xs font-bold text-emerald-800 shadow-md">
          <HiCheckCircle size={20} /> Product saved successfully! Redirecting to catalog...
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
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:bg-emerald-700 transition-all"
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
              <label className="text-[11px] font-bold uppercase text-slate-600">Product Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samsung 55 UHD 4K Smart TV"
                className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-600">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
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
                <label className="text-[11px] font-bold uppercase text-slate-600">Brand Name</label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Samsung, LG, Binatone"
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
                <label className="text-[11px] font-bold uppercase text-slate-600">Storefront Customer Price (₦)</label>
                <input
                  type="number"
                  required
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs font-black text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Profit Margin Box */}
            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-emerald-800">Net Markup Earned Per Sale</span>
                <span className="font-['Outfit'] font-black text-lg text-emerald-900">{formatNaira(markupAmount)}</span>
              </div>
              <span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-black text-emerald-900">
                +{markupPercent}% Margin
              </span>
            </div>
          </div>

          {/* Technical Specs List */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
              Technical Specifications (Displayed on Details Page)
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                placeholder="e.g. 55-inch 4K OLED Display"
                className="flex-1 rounded-xl border border-slate-300 p-2.5 text-xs font-bold"
              />
              <button
                type="button"
                onClick={handleAddSpec}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                <HiPlus size={16} /> Add Spec
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {specs.map((spec, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-800 border border-slate-200"
                >
                  {spec}
                  <button type="button" onClick={() => handleRemoveSpec(i)} className="text-rose-500 hover:text-rose-700">
                    <HiTrash size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Image File Uploads & Badges */}
        <div className="flex flex-col gap-6">
          {/* Main Card Image File Upload */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <HiPhoto size={18} className="text-emerald-600" /> Main Card Image (Upload File)
            </h3>

            <div className="h-52 w-full rounded-xl bg-slate-50 border p-3 flex items-center justify-center overflow-hidden">
              <img src={image} alt="Preview" className="max-h-full max-w-full object-contain" />
            </div>

            {/* File Uploader */}
            <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/50 p-3 text-xs font-bold text-emerald-800 cursor-pointer hover:bg-emerald-100/60 transition-colors">
              <HiArrowUpTray size={18} /> Upload Main Product Image File
              <input type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
            </label>
          </div>

          {/* Product Detail Page Additional Gallery Uploads */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <HiPhoto size={18} className="text-emerald-600" /> Detail Page Gallery Images
            </h3>

            <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100">
              <HiPlus size={18} /> Upload Additional Gallery Images
              <input type="file" accept="image/*" multiple onChange={handleDetailGalleryUpload} className="hidden" />
            </label>

            <div className="grid grid-cols-3 gap-2 pt-2">
              {detailImages.map((imgUrl, i) => (
                <div key={i} className="relative h-20 w-full rounded-lg bg-slate-50 border p-1 overflow-hidden">
                  <img src={imgUrl} alt={`Gallery ${i}`} className="h-full w-full object-contain" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(i)}
                    className="absolute top-1 right-1 rounded-full bg-rose-600 p-1 text-white hover:bg-rose-700"
                  >
                    <HiTrash size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stock & Badges */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
              Stock & Badging
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-600">Stock Quantity</label>
              <input
                type="number"
                required
                value={stockQty}
                onChange={(e) => setStockQty(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-600">Storefront Card Badge</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Best seller, Popular"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-600">Discount Badge (-%)</label>
              <input
                type="text"
                value={discountBadge}
                onChange={(e) => setDiscountBadge(e.target.value)}
                placeholder="e.g. -15%"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900"
              />
            </div>

            <label className="flex items-center gap-2 pt-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={bulky}
                onChange={(e) => setBulky(e.target.checked)}
                className="rounded text-emerald-600"
              />
              Bulky Item (Heavy Delivery Freight)
            </label>
          </div>
        </div>
      </div>
    </form>
  )
}
