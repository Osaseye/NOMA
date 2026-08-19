import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiSparkles,
  HiCheckCircle,
  HiArrowLeft,
  HiArrowUpTray,
  HiPlus,
  HiTrash,
  HiPhoto,
  HiStar,
} from 'react-icons/hi2'
import type { Product, CategoryId, ProductSizeVariant } from '../../types/commerce'
import { formatNaira, getMarkupAmount } from '../../utils/pricing'
import { useProductStore } from '../../store/productStore'
import { useSupplierStore } from '../../store/supplierStore'
import { storageService } from '../../services/firebase/storageService'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function ProductEditorForm({ product }: { product?: Product }) {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addProduct, updateProduct, categories } = useProductStore()
  const { suppliers } = useSupplierStore()

  const isEditing = Boolean(product?.id)

  const [name, setName] = useState(product?.name || '')
  const [category, setCategory] = useState<CategoryId>(
    (product?.category as CategoryId) || (categories[0]?.id as CategoryId) || 'electronics'
  )
  // Resolve subcategory initial value if it was saved as an ID (e.g. sub-1234567)
  const initialSubCategory = useMemo(() => {
    const raw = product?.subCategory || product?.subcategory || ''
    if (!raw) return ''
    for (const cat of categories) {
      const match = cat.subcategories?.find((s) => s.id === raw || s.label.toLowerCase() === raw.toLowerCase())
      if (match) return match.label
    }
    return raw.startsWith('sub-') ? '' : raw
  }, [product, categories])

  const [subCategory, setSubCategory] = useState(initialSubCategory)

  useEffect(() => {
    if (initialSubCategory && !subCategory) {
      setSubCategory(initialSubCategory)
    }
  }, [initialSubCategory])
  const [supplierId, setSupplierId] = useState(product?.supplierId || '')
  const [brand, setBrand] = useState(product?.brand || 'Noma')
  const [basePrice, setBasePrice] = useState<number>(product?.basePrice ?? 100000)
  const [finalPrice, setFinalPrice] = useState<number>(product?.finalPrice ?? 120000)
  const [stockQty, setStockQty] = useState<number>(product?.stockQty ?? 15)
  const [badge, setBadge] = useState(product?.badge ?? 'Best Seller')
  const [discountBadge, setDiscountBadge] = useState(product?.discountBadge || '')
  const [bulky, setBulky] = useState(product?.bulky || false)

  // Sizing & Variant Inventory State
  const [sizes, setSizes] = useState<ProductSizeVariant[]>(
    Array.isArray(product?.sizes) ? product.sizes : []
  )
  const [customSizeInput, setCustomSizeInput] = useState('')
  const [customSizeQty, setCustomSizeQty] = useState<number>(5)

  // Images state
  const initialImages = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : product?.image
    ? [product.image]
    : []
  const [images, setImages] = useState<string[]>(initialImages)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Description
  const [description, setDescription] = useState(product?.description || '')

  // "What's in the Box" state
  const [whatsInTheBox, setWhatsInTheBox] = useState<string[]>(
    Array.isArray(product?.whatsInTheBox) ? product.whatsInTheBox : []
  )
  const [boxItemInput, setBoxItemInput] = useState('')

  // "Key Highlights / Features" state
  const [keyFeatures, setKeyFeatures] = useState<string[]>(
    Array.isArray(product?.keyFeatures)
      ? product.keyFeatures
      : Array.isArray(product?.specs) && product.specs.length > 0
      ? product.specs
      : []
  )
  const [featureInput, setFeatureInput] = useState('')

  const [successMsg, setSuccessMsg] = useState(false)

  // Selected category object & markup
  const selectedCategoryObj = categories.find((c) => c.id === category)
  const availableSubCategories = selectedCategoryObj?.subcategories || []
  const categoryMarkupPercent = selectedCategoryObj?.defaultMarkupPercent ?? 20

  // Selected supplier name
  const selectedSupplierObj = suppliers.find((s) => s.id === supplierId)
  const supplierName = selectedSupplierObj?.name || product?.supplierName || ''

  // Markup calculation
  const markupAmount = getMarkupAmount(finalPrice, basePrice)
  const markupPercent = basePrice > 0 ? Math.round(((finalPrice - basePrice) / basePrice) * 100) : 0

  // Auto-calculate finalPrice when basePrice changes
  const handleBasePriceChange = (newBaseCost: number) => {
    setBasePrice(newBaseCost)
    if (newBaseCost > 0) {
      const calculatedFinal = Math.round(newBaseCost * (1 + categoryMarkupPercent / 100))
      setFinalPrice(calculatedFinal)
    }
  }

  // When category changes, recalculate suggested finalPrice
  const handleCategoryChange = (newCat: CategoryId) => {
    setCategory(newCat)
    setSubCategory('')
    const targetCat = categories.find((c) => c.id === newCat)
    const targetMarkup = targetCat?.defaultMarkupPercent ?? 20
    if (basePrice > 0) {
      const calculatedFinal = Math.round(basePrice * (1 + targetMarkup / 100))
      setFinalPrice(calculatedFinal)
    }
  }

  // Multi-file upload handler
  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return

    // Immediately copy files to array and reset target so selecting the same file again works
    const files = Array.from(fileList)
    e.target.value = ''

    setUploadingImage(true)
    const toastId = toast.loading(`Uploading ${files.length} product image(s)...`)
    try {
      const uploadPromises = files.map((file) => storageService.uploadImage(file, 'products'))
      const downloadUrls = await Promise.all(uploadPromises)
      setImages((prev) => [...prev, ...downloadUrls])
      toast.success(`${downloadUrls.length} image(s) added to product gallery!`, { id: toastId })
    } catch (err: any) {
      console.error('Failed to upload images:', err)
      toast.error(err?.message || 'Failed to upload image(s)', { id: toastId })
    } finally {
      setUploadingImage(false)
    }
  }

  // Add image by URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return
    setImages((prev) => [...prev, newImageUrl.trim()])
    setNewImageUrl('')
    toast.success('Image URL added to gallery')
  }

  // Remove an image from gallery
  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  // Set an image as primary (move to index 0)
  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setImages((prev) => {
      const target = prev[indexToPrimary]
      const remaining = prev.filter((_, idx) => idx !== indexToPrimary)
      return [target, ...remaining]
    })
    toast.success('Primary cover image updated')
  }

  // "What's in the Box" handlers
  const handleAddBoxItem = () => {
    if (!boxItemInput.trim()) return
    setWhatsInTheBox((prev) => [...prev, boxItemInput.trim()])
    setBoxItemInput('')
  }

  const handleRemoveBoxItem = (idx: number) => {
    setWhatsInTheBox((prev) => prev.filter((_, i) => i !== idx))
  }

  // "Key Highlights" handlers
  const handleAddFeature = () => {
    if (!featureInput.trim()) return
    setKeyFeatures((prev) => [...prev, featureInput.trim()])
    setFeatureInput('')
  }

  const handleRemoveFeature = (idx: number) => {
    setKeyFeatures((prev) => prev.filter((_, i) => i !== idx))
  }

  // Sizing & Variant Inventory Handlers
  const handleAddPresetSizes = (presetList: string[]) => {
    setSizes((prev) => {
      const existingSizes = new Set(prev.map((s) => s.size))
      const newItems = presetList
        .filter((size) => !existingSizes.has(size))
        .map((size) => ({ size, stockQty: 5 }))
      const combined = [...prev, ...newItems]
      const total = combined.reduce((sum, s) => sum + s.stockQty, 0)
      setStockQty(total)
      return combined
    })
    toast.success('Preset sizes added!')
  }

  const handleAddCustomSize = () => {
    if (!customSizeInput.trim()) return
    const sizeName = customSizeInput.trim().toUpperCase()
    if (sizes.some((s) => s.size.toLowerCase() === sizeName.toLowerCase())) {
      toast.error('This size already exists.')
      return
    }
    const updated = [...sizes, { size: sizeName, stockQty: Math.max(0, Number(customSizeQty) || 0) }]
    setSizes(updated)
    setCustomSizeInput('')
    setCustomSizeQty(5)
    setStockQty(updated.reduce((sum, s) => sum + s.stockQty, 0))
    toast.success(`Size "${sizeName}" added!`)
  }

  const handleUpdateSizeQty = (index: number, newQty: number) => {
    setSizes((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], stockQty: Math.max(0, newQty) }
      setStockQty(copy.reduce((sum, s) => sum + s.stockQty, 0))
      return copy
    })
  }

  const handleRemoveSize = (index: number) => {
    setSizes((prev) => {
      const updated = prev.filter((_, idx) => idx !== index)
      if (updated.length > 0) {
        setStockQty(updated.reduce((sum, s) => sum + s.stockQty, 0))
      }
      return updated
    })
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!name.trim()) {
      toast.error('Product title is required.')
      return
    }

    setIsSubmitting(true)

    const mainCoverImage = images[0] || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80'

    const payload = {
      name: name.trim(),
      category,
      subCategory: subCategory.trim() || '',
      supplierId: supplierId || '',
      supplierName: supplierName || '',
      brand: brand.trim() || 'Noma',
      basePrice: Number(basePrice) || 0,
      finalPrice: Number(finalPrice) || 0,
      stockQty: Number(stockQty) || 0,
      badge: badge.trim() || '',
      discountBadge: discountBadge.trim() || '',
      bulky: Boolean(bulky),
      image: mainCoverImage,
      images: images.length > 0 ? images : [mainCoverImage],
      description: description.trim() || '',
      specs: keyFeatures,
      whatsInTheBox,
      keyFeatures,
      sizes: Array.isArray(sizes) ? sizes : [],
    }

    try {
      if (isEditing && product) {
        await updateProduct(product.id, payload)
        toast.success('Product updated live on storefront!')
      } else {
        await addProduct({
          ...payload,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          rating: 0,
          reviewsCount: 0,
        })
        toast.success(`Product "${name}" published live on storefront!`)
      }

      setSuccessMsg(true)
      setTimeout(() => {
        setSuccessMsg(false)
        navigate('/admin/products')
      }, 800)
    } catch (err: any) {
      console.error('Failed to save product to database:', err)
      toast.error(`Error saving product: ${err?.message || 'Please check your connection and try again.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8 pb-12 font-['Outfit',sans-serif]">
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-100 p-4 text-xs font-bold text-emerald-800 shadow-md">
          <HiCheckCircle size={20} /> Product saved & published live! Redirecting to catalog...
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <HiArrowLeft size={16} /> Back to Products Catalog
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="flex-1 sm:flex-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploadingImage || isSubmitting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : isEditing ? (
              'Save & Update Product'
            ) : (
              'Create Product Card'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Basic Details, Pricing, Packaging & Highlights */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Basic Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
              Basic Product Information
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-600">Main Category *</label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as CategoryId)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} (+{c.defaultMarkupPercent}% markup)
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
                      <option key={sub.id} value={sub.label}>
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
                <label className="text-[11px] font-bold uppercase text-slate-600">Supplier *</label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 bg-white"
                >
                  <option value="">-- Select Supplier --</option>
                  {suppliers.map((sup) => (
                    <option key={sup.id} value={sup.id}>
                      {sup.name}
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

          {/* Pricing & Profit Psychology with Category Markup auto-calculation */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Pricing & Automatic Category Markup</span>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                <HiSparkles size={14} /> Category Markup: +{categoryMarkupPercent}%
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase text-slate-600">Supplier Base Cost (₦) *</label>
                  <span className="text-[10px] text-slate-400">Your sourcing cost</span>
                </div>
                <input
                  type="number"
                  required
                  min={0}
                  value={basePrice}
                  onChange={(e) => handleBasePriceChange(Number(e.target.value))}
                  placeholder="e.g. 50000"
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase text-slate-600">Customer Final Retail Price (₦) *</label>
                  <span className="text-[10px] text-emerald-600 font-bold">Auto-calculated (+{categoryMarkupPercent}%)</span>
                </div>
                <input
                  type="number"
                  required
                  min={0}
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(Number(e.target.value))}
                  placeholder="e.g. 60000"
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
                +{markupPercent}% Active Margin
              </span>
            </div>
          </div>

          {/* "What's in the Box" Packaging Content Manager */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  What's in the Box (Packaging Contents)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  List items included inside the product package for customer clarity.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">{whatsInTheBox.length} item(s)</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={boxItemInput}
                onChange={(e) => setBoxItemInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddBoxItem()
                  }
                }}
                placeholder="e.g. Power Cable, Remote Control + Batteries, User Manual..."
                className="flex-1 rounded-xl border border-slate-300 p-2.5 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddBoxItem}
                className="flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
              >
                <HiPlus size={15} /> Add Item
              </button>
            </div>

            {whatsInTheBox.length > 0 ? (
              <div className="flex flex-col gap-2 pt-1">
                {whatsInTheBox.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-800"
                  >
                    <span>✓ {item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBoxItem(idx)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                    >
                      <HiTrash size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No package items added yet.</p>
            )}
          </div>

          {/* "Key Highlights / Features" Manager */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Key Product Highlights & Specs
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Highlight key specs displayed as badges on the storefront (e.g. 4K Resolution, 1 Year Warranty).
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">{keyFeatures.length} feature(s)</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddFeature()
                  }
                }}
                placeholder="e.g. Wireless Remote, 4K UHD, Bluetooth 5.2..."
                className="flex-1 rounded-xl border border-slate-300 p-2.5 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
              >
                <HiPlus size={15} /> Add Feature
              </button>
            </div>

            {keyFeatures.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {keyFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-[#2F5FE3]"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-blue-400 hover:text-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No key features added yet.</p>
            )}
          </div>

          {/* Sizing & Variant Inventory Manager (Footwear & Apparel) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span>Available Sizes & Per-Size Stock</span>
                  <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-black text-purple-700">
                    Footwear & Apparel
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Configure dynamic selectable sizes (e.g. EU 40, 41, 42 or S, M, L) with dedicated stock quantity per size.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">{sizes.length} size(s)</span>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase text-slate-500">Quick-Add Size Presets:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleAddPresetSizes(['38', '39', '40', '41', '42', '43', '44', '45', '46'])}
                  className="rounded-xl border border-purple-200 bg-purple-50/70 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors"
                >
                  👟 Shoe Sizes (EU 38 - 46)
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPresetSizes(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'])}
                  className="rounded-xl border border-blue-200 bg-blue-50/70 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  👕 Clothing Sizes (XS - 3XL)
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPresetSizes(['0-6M', '6-12M', '1-2Y', '2-3Y', '4-5Y'])}
                  className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  👶 Baby & Kids (0-6M - 4-5Y)
                </button>
                {sizes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSizes([])
                      toast.info('All sizes cleared.')
                    }}
                    className="rounded-xl border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Custom Size Adder */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={customSizeInput}
                onChange={(e) => setCustomSizeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCustomSize()
                  }
                }}
                placeholder="Custom Size (e.g. 47, One Size, 32W/30L)"
                className="flex-1 rounded-xl border border-slate-300 p-2.5 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500">Qty:</span>
                <input
                  type="number"
                  min={0}
                  value={customSizeQty}
                  onChange={(e) => setCustomSizeQty(Number(e.target.value))}
                  className="w-16 rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900 text-center outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddCustomSize}
                className="flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
              >
                <HiPlus size={15} /> Add
              </button>
            </div>

            {/* Sizes List Table */}
            {sizes.length > 0 ? (
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-[10px] font-bold uppercase text-slate-500">Configured Sizes & Stock breakdown:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {sizes.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-2.5 gap-2"
                    >
                      <span className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-extrabold text-[#12203D] shadow-2xs">
                        Size {s.size}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500">Units:</span>
                        <input
                          type="number"
                          min={0}
                          value={s.stockQty}
                          onChange={(e) => handleUpdateSizeQty(idx, Number(e.target.value))}
                          className="w-14 rounded-lg border border-slate-300 bg-white p-1 text-xs font-bold text-center text-slate-900 outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(idx)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                          title="Remove size"
                        >
                          <HiTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No sizes configured. Default single product stock quantity will apply.</p>
            )}
          </div>
        </div>

        {/* Right Col: Multi-Image Gallery Manager & Stock/Badges */}
        <div className="flex flex-col gap-6">
          {/* Multi-Image Gallery Manager */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Product Photo Gallery ({images.length})
              </h3>
            </div>

            {/* Primary Cover Image Preview */}
            <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
              {images.length > 0 ? (
                <>
                  <img src={images[0]} alt="Main Cover" className="h-full w-full object-contain p-2" />
                  <span className="absolute top-2 left-2 rounded-lg bg-emerald-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                    Primary Cover
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-400">
                  <HiPhoto size={36} />
                  <span className="text-xs font-semibold">No images uploaded yet</span>
                </div>
              )}
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              id="product-photo-upload"
              type="file"
              multiple
              accept="image/*"
              disabled={uploadingImage}
              onChange={handleMultipleFilesUpload}
              className="hidden"
            />

            {/* Upload Multiple Files Button */}
            <button
              type="button"
              disabled={uploadingImage}
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-500 bg-emerald-50/70 p-4 text-xs font-bold text-emerald-800 cursor-pointer hover:bg-emerald-100 active:scale-[0.99] transition-all text-center select-none disabled:opacity-60"
            >
              {uploadingImage ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin text-emerald-600" />
                  <span>Uploading Images to Storage...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <HiArrowUpTray size={18} className="text-emerald-700" />
                  <span>Upload Photos from Device</span>
                </div>
              )}
            </button>

            {/* Add Image by Web URL */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Or paste image URL (https://...)"
                className="flex-1 rounded-xl border border-slate-300 p-2 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-900 active:scale-95 transition-all"
              >
                Add URL
              </button>
            </div>

            {/* All Thumbnails Grid with Primary / Remove controls */}
            {images.length > 0 && (
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase text-slate-500">
                  All Gallery Images (Click star to set as Cover)
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`group relative aspect-square rounded-xl border-2 overflow-hidden bg-slate-50 p-1 flex items-center justify-center ${
                        idx === 0 ? 'border-emerald-500 shadow-2xs' : 'border-slate-200'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="h-full w-full object-contain" />
                      
                      {/* Actions overlay: visible on hover on desktop, always visible on mobile/touch */}
                      <div className="absolute inset-0 bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSetPrimaryImage(idx)
                            }}
                            title="Set as Primary Cover"
                            className="p-1.5 rounded-lg bg-white text-amber-500 shadow hover:bg-amber-50 active:scale-95"
                          >
                            <HiStar size={14} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveImage(idx)
                          }}
                          title="Remove Photo"
                          className="p-1.5 rounded-lg bg-white text-red-600 shadow hover:bg-red-50 active:scale-95"
                        >
                          <HiTrash size={14} />
                        </button>
                      </div>

                      {idx === 0 && (
                        <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Inventory, Badges & Freight */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
              Stock & Badges
            </h3>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">
                Stock Quantity Available *
              </label>
              <input
                type="number"
                required
                min={0}
                value={stockQty}
                onChange={(e) => setStockQty(Number(e.target.value))}
                placeholder="15"
                className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">
                  Badge Tag
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. New, Best Seller, Hot Deal"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">
                  Discount Tag
                </label>
                <input
                  type="text"
                  value={discountBadge}
                  onChange={(e) => setDiscountBadge(e.target.value)}
                  placeholder="e.g. -20% OFF"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer pt-2 border-t border-slate-100">
              <input
                type="checkbox"
                checked={bulky}
                onChange={(e) => setBulky(e.target.checked)}
                className="rounded h-4 w-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Bulky Freight Item (Requires Special Delivery)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Mobile-Friendly Sticky Bottom Bar / Action Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white p-4 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploadingImage || isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:bg-emerald-700 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : isEditing ? (
            'Save & Update Product'
          ) : (
            'Create Product Card'
          )}
        </button>
      </div>
    </form>
  )
}
