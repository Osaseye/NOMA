import { useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Baby,
  Camera,
  Check,
  CheckCircle,
  Image as ImageIcon,
  Plus,
  Sneaker,
  Sparkle,
  SpinnerGap,
  Star,
  Trash,
  TShirt,
  UploadSimple,
  X,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { runGeminiProductStudio } from '../../services/ai/geminiProductStudio'
import { storageService } from '../../services/firebase/storageService'
import { useAdminStore } from '../../store/adminStore'
import { useProductStore } from '../../store/productStore'
import { useSupplierStore } from '../../store/supplierStore'
import type { CategoryId, Product, ProductSizeVariant } from '../../types/commerce'
import { formatNaira, getMarkupAmount } from '../../utils/pricing'

const inputBaseClass =
  'w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-950 placeholder:text-slate-400 transition-colors focus:border-slate-950 focus:outline-none'

const labelBaseClass =
  'text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500'

export function ProductEditorForm({ product }: { product?: Product }) {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const studioInputRef = useRef<HTMLInputElement>(null)
  const { addProduct, updateProduct, categories } = useProductStore()
  const { suppliers } = useSupplierStore()
  const { settings } = useAdminStore()

  const isEditing = Boolean(product?.id)

  const [name, setName] = useState(product?.name || '')
  const [category, setCategory] = useState<CategoryId>(
    (product?.category as CategoryId) || (categories[0]?.id as CategoryId) || 'electronics'
  )

  const initialSubCategory = useMemo(() => {
    const raw = product?.subCategory || product?.subcategory || ''
    if (!raw) return ''
    for (const cat of categories) {
      const match = cat.subcategories?.find(
        (s) => s.id === raw || s.label.toLowerCase() === raw.toLowerCase()
      )
      if (match) return match.label
    }
    return raw.startsWith('sub-') ? '' : raw
  }, [product, categories])

  const [subCategoryInput, setSubCategoryInput] = useState<string | null>(null)
  const subCategory = subCategoryInput !== null ? subCategoryInput : initialSubCategory

  const [supplierId, setSupplierId] = useState(product?.supplierId || '')
  const [brand, setBrand] = useState(product?.brand || 'Noma')
  const [basePrice, setBasePrice] = useState<number>(product?.basePrice ?? 100000)
  const [finalPrice, setFinalPrice] = useState<number>(product?.finalPrice ?? 120000)
  const [compareAtPrice, setCompareAtPrice] = useState<number>(product?.compareAtPrice ?? 0)
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
  const initialImages =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : product?.image
      ? [product.image]
      : []
  const [images, setImages] = useState<string[]>(initialImages)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Description & Highlights
  const [description, setDescription] = useState(product?.description || '')
  const [whatsInTheBox, setWhatsInTheBox] = useState<string[]>(
    Array.isArray(product?.whatsInTheBox) ? product.whatsInTheBox : []
  )
  const [boxItemInput, setBoxItemInput] = useState('')

  const [keyFeatures, setKeyFeatures] = useState<string[]>(
    Array.isArray(product?.keyFeatures)
      ? product.keyFeatures
      : Array.isArray(product?.specs) && product.specs.length > 0
      ? product.specs
      : []
  )
  const [featureInput, setFeatureInput] = useState('')
  const [successMsg, setSuccessMsg] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Gemini AI Product Description & Metadata Pipeline State
  const [studioRawFile, setStudioRawFile] = useState<File | null>(null)
  const [studioRawPreview, setStudioRawPreview] = useState<string>('')
  const [studioNotes, setStudioNotes] = useState('')
  const [studioRunning, setStudioRunning] = useState(false)

  const handleSelectStudioPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setStudioRawFile(file)
    const reader = new FileReader()
    reader.onload = () => setStudioRawPreview(String(reader.result || ''))
    reader.readAsDataURL(file)
  }

  const handleRunGeminiStudioPipeline = async () => {
    if (!studioRawFile) {
      toast.error('Select a product photo first.')
      return
    }
    setStudioRunning(true)
    const toastId = toast.loading(
      'Uploading photo to Cloudflare R2 & scanning with Gemini AI to write product details...'
    )
    try {
      const [uploadedUrl, result] = await Promise.all([
        storageService.uploadImage(studioRawFile, 'products'),
        runGeminiProductStudio({
          file: studioRawFile,
          adminNotes: studioNotes,
          categories,
          apiKey: settings.geminiApiKey,
          extraApiKeys: settings.geminiApiKeys || [],
        }),
      ])

      setImages((prev) => [uploadedUrl, ...prev])
      if (result.name) setName(result.name)
      if (result.brand) setBrand(result.brand)
      if (result.category && categories.some((c) => c.id === result.category)) {
        handleCategoryChange(result.category as CategoryId)
      }
      if (result.subCategory) setSubCategoryInput(result.subCategory)
      if (result.description) setDescription(result.description)
      if (result.keyFeatures.length > 0) setKeyFeatures(result.keyFeatures)
      if (result.whatsInTheBox.length > 0) setWhatsInTheBox(result.whatsInTheBox)
      if (result.badge) setBadge(result.badge)

      toast.success(
        `Photo uploaded to Cloudflare R2 & product details generated (${result.usedKeyLabel || 'Gemini AI'})!`,
        { id: toastId }
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gemini scan failed'
      toast.error(msg, { id: toastId })
    } finally {
      setStudioRunning(false)
    }
  }

  const selectedCategoryObj = categories.find((c) => c.id === category)
  const availableSubCategories = selectedCategoryObj?.subcategories || []
  const categoryMarkupPercent = selectedCategoryObj?.defaultMarkupPercent ?? 20

  const selectedSupplierObj = suppliers.find((s) => s.id === supplierId)
  const supplierName = selectedSupplierObj?.name || product?.supplierName || ''

  const markupAmount = getMarkupAmount(finalPrice, basePrice)
  const markupPercent =
    basePrice > 0 ? Math.round(((finalPrice - basePrice) / basePrice) * 100) : 0
  const activeDiscountPercent =
    compareAtPrice > finalPrice && compareAtPrice > 0
      ? Math.round(((compareAtPrice - finalPrice) / compareAtPrice) * 100)
      : 0

  const applyQuickDiscount = (percent: number) => {
    const originalRetail =
      compareAtPrice > finalPrice && compareAtPrice > 0 ? compareAtPrice : finalPrice
    if (originalRetail <= 0) {
      toast.error('Enter a retail price before applying a discount.')
      return
    }
    const discounted = Math.max(100, Math.round((originalRetail * (100 - percent)) / 100))
    setCompareAtPrice(originalRetail)
    setFinalPrice(discounted)
    setDiscountBadge(`-${percent}%`)
  }

  const clearQuickDiscount = () => {
    if (compareAtPrice > finalPrice && compareAtPrice > 0) {
      setFinalPrice(compareAtPrice)
    }
    setCompareAtPrice(0)
    setDiscountBadge('')
  }

  const handleBasePriceChange = (newBaseCost: number) => {
    setBasePrice(newBaseCost)
    if (newBaseCost > 0) {
      const calculatedFinal = Math.round(newBaseCost * (1 + categoryMarkupPercent / 100))
      setFinalPrice(calculatedFinal)
    }
  }

  const handleCategoryChange = (newCat: CategoryId) => {
    setCategory(newCat)
    setSubCategoryInput('')
    const targetCat = categories.find((c) => c.id === newCat)
    const targetMarkup = targetCat?.defaultMarkupPercent ?? 20
    if (basePrice > 0) {
      const calculatedFinal = Math.round(basePrice * (1 + targetMarkup / 100))
      setFinalPrice(calculatedFinal)
    }
  }

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return

    const files = Array.from(fileList)
    e.target.value = ''

    setUploadingImage(true)
    const toastId = toast.loading(`Uploading ${files.length} product image(s)...`)
    try {
      const uploadPromises = files.map((file) => storageService.uploadImage(file, 'products'))
      const downloadUrls = await Promise.all(uploadPromises)
      setImages((prev) => [...prev, ...downloadUrls])
      toast.success(`${downloadUrls.length} image(s) added to gallery.`, { id: toastId })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload image(s)'
      console.error('Failed to upload images:', err)
      toast.error(message, { id: toastId })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return
    setImages((prev) => [...prev, newImageUrl.trim()])
    setNewImageUrl('')
    toast.success('Image URL added to gallery.')
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setImages((prev) => {
      const target = prev[indexToPrimary]
      const remaining = prev.filter((_, idx) => idx !== indexToPrimary)
      return [target, ...remaining]
    })
    toast.success('Primary cover image updated.')
  }

  const handleAddBoxItem = () => {
    if (!boxItemInput.trim()) return
    setWhatsInTheBox((prev) => [...prev, boxItemInput.trim()])
    setBoxItemInput('')
  }

  const handleRemoveBoxItem = (idx: number) => {
    setWhatsInTheBox((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAddFeature = () => {
    if (!featureInput.trim()) return
    setKeyFeatures((prev) => [...prev, featureInput.trim()])
    setFeatureInput('')
  }

  const handleRemoveFeature = (idx: number) => {
    setKeyFeatures((prev) => prev.filter((_, i) => i !== idx))
  }

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
    toast.success('Preset sizes added.')
  }

  const handleAddCustomSize = () => {
    if (!customSizeInput.trim()) return
    const sizeName = customSizeInput.trim().toUpperCase()
    if (sizes.some((s) => s.size.toLowerCase() === sizeName.toLowerCase())) {
      toast.error('This size already exists.')
      return
    }
    const updated = [
      ...sizes,
      { size: sizeName, stockQty: Math.max(0, Number(customSizeQty) || 0) },
    ]
    setSizes(updated)
    setCustomSizeInput('')
    setCustomSizeQty(5)
    setStockQty(updated.reduce((sum, s) => sum + s.stockQty, 0))
    toast.success(`Size "${sizeName}" added.`)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!name.trim()) {
      toast.error('Product title is required.')
      return
    }

    setIsSubmitting(true)

    const mainCoverImage = images[0] || '/images/catalog-banner-all.png'

    const payload = {
      name: name.trim(),
      category,
      subCategory: subCategory.trim() || '',
      supplierId: supplierId || '',
      supplierName: supplierName || '',
      brand: brand.trim() || 'Noma',
      basePrice: Number(basePrice) || 0,
      finalPrice: Number(finalPrice) || 0,
      compareAtPrice: compareAtPrice > 0 ? Number(compareAtPrice) : undefined,
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
        toast.success('Product updated live on storefront.')
      } else {
        await addProduct({
          ...payload,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          rating: 0,
          reviewsCount: 0,
        })
        toast.success(`Product "${name}" published live on storefront.`)
      }

      setSuccessMsg(true)
      setTimeout(() => {
        setSuccessMsg(false)
        navigate('/admin/products')
      }, 600)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Please check your connection and try again.'
      console.error('Failed to save product:', err)
      toast.error(`Error saving product: ${message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-12">
      {successMsg ? (
        <div className="flex items-center gap-2 rounded-[8px] border border-[#BBF7D0] bg-[#F0FDF4] p-4 text-xs font-semibold text-[#15803D]">
          <CheckCircle size={18} weight="regular" />
          <span>Product saved and published live. Redirecting to catalog...</span>
        </div>
      ) : null}

      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft size={15} weight="regular" />
          <span>Back to Products</span>
        </button>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-950 sm:flex-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploadingImage || isSubmitting || studioRunning}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50 sm:flex-none"
          >
            {isSubmitting ? (
              <>
                <SpinnerGap size={15} weight="regular" className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Publish Product'
            )}
          </button>
        </div>
      </div>

      {/* GEMINI AI PRODUCT COPYWRITER (Uploads Original Photo to Cloudflare R2 + Generates Title, Description & Features) */}
      <section className="rounded-xl border border-slate-200 bg-[#F4F4F5]/60 p-5">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3.5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Sparkle size={16} weight="fill" className="text-slate-950" />
              <h2 className="text-sm font-bold text-slate-950">
                Gemini AI Product Description &amp; Details Scanner
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Select a product photo to upload it untouched to Cloudflare R2 while Gemini scans it and auto-fills the title, category, description, features, and box contents.
            </p>
          </div>

          <input
            ref={studioInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleSelectStudioPhoto}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => studioInputRef.current?.click()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:border-slate-950"
          >
            <Camera size={15} weight="bold" />
            <span>{studioRawFile ? 'Change Photo' : 'Select Product Photo'}</span>
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {studioRawPreview ? (
              <img
                src={studioRawPreview}
                alt="Selected product"
                className="h-16 w-16 shrink-0 rounded-lg border border-slate-200 bg-white object-cover"
              />
            ) : (
              <button
                type="button"
                onClick={() => studioInputRef.current?.click()}
                className="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 bg-white text-[10px] font-semibold text-slate-500 hover:border-slate-950 hover:text-slate-950"
              >
                <UploadSimple size={15} />
                <span>Photo</span>
              </button>
            )}

            <div className="flex-1">
              <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                Optional Notes / Hint for Gemini
              </label>
              <input
                type="text"
                value={studioNotes}
                onChange={(e) => setStudioNotes(e.target.value)}
                placeholder="e.g. Nike Air Force 1 white sneakers, sizes 40-45, wholesale bale available..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-950 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none"
              />
            </div>

            <button
              type="button"
              disabled={!studioRawFile || studioRunning}
              onClick={handleRunGeminiStudioPipeline}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-end rounded-lg bg-slate-950 px-4 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-40"
            >
              {studioRunning ? (
                <>
                  <SpinnerGap size={15} className="animate-spin" />
                  <span>Scanning &amp; Writing Copy...</span>
                </>
              ) : (
                <>
                  <Sparkle size={14} weight="fill" />
                  <span>Upload &amp; Auto-Fill Description</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Basic Details, Pricing, Packaging & Highlights */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Basic Info */}
          <section className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <h3 className="border-b border-[#E5E7EB] pb-3 text-xs font-bold uppercase tracking-[0.06em] text-[#0B1220]">
              Basic Product Information
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className={labelBaseClass}>Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samsung 55 UHD 4K Smart TV"
                className={inputBaseClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelBaseClass}>Main Category *</label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as CategoryId)}
                  className={inputBaseClass}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} (+{c.defaultMarkupPercent}% markup)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelBaseClass}>Sub Category</label>
                {availableSubCategories.length > 0 ? (
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategoryInput(e.target.value)}
                    className={inputBaseClass}
                  >
                    <option value="">Select Subcategory</option>
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
                    onChange={(e) => setSubCategoryInput(e.target.value)}
                    placeholder="e.g. Smart 4K TVs"
                    className={inputBaseClass}
                  />
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelBaseClass}>Supplier</label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className={inputBaseClass}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((sup) => (
                    <option key={sup.id} value={sup.id}>
                      {sup.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelBaseClass}>Brand Name</label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Samsung, LG, Noma"
                  className={inputBaseClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelBaseClass}>Product Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description shown to customers on the product detail page..."
                className={inputBaseClass}
              />
            </div>
          </section>

          {/* Pricing, Discounts & Markup */}
          <section className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.06em] text-[#0B1220]">
                Pricing, Discounts &amp; Markup
              </h3>
              <span className="font-mono text-[11px] font-semibold text-slate-500">
                Category Rule: +{categoryMarkupPercent}%
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label className={labelBaseClass}>Supplier Base Cost (₦) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={basePrice}
                  onChange={(e) => handleBasePriceChange(Number(e.target.value))}
                  placeholder="e.g. 50000"
                  className={`${inputBaseClass} font-mono tabular-nums font-semibold`}
                />
                <span className="text-[11px] text-[#5E6675]">Operator sourcing cost</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelBaseClass}>Customer Retail Price (₦) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(Number(e.target.value))}
                  placeholder="e.g. 60000"
                  className={`${inputBaseClass} font-mono tabular-nums font-bold text-[#0B1220]`}
                />
                <span className="text-[11px] text-[#5E6675]">
                  Suggested: +{categoryMarkupPercent}% over base
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelBaseClass}>Original / Compare-At Price (₦)</label>
                <input
                  type="number"
                  min={0}
                  value={compareAtPrice || ''}
                  onChange={(e) => setCompareAtPrice(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="Optional (e.g. 75000)"
                  className={`${inputBaseClass} font-mono tabular-nums`}
                />
                <span className="text-[11px] text-[#5E6675]">
                  Higher than retail shows strike-through &amp; -% tag
                </span>
              </div>
            </div>

            {/* 1-Click Discount Controls */}
            <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Quick Discount
                </span>
                {activeDiscountPercent > 0 ? (
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className="rounded-full bg-[#1049EB] px-2 py-0.5 text-[11px] font-bold text-white">
                      -{activeDiscountPercent}%
                    </span>
                    <span className="tabular-nums text-slate-400 line-through">
                      {formatNaira(compareAtPrice)}
                    </span>
                    <span className="font-bold tabular-nums text-slate-950">
                      {formatNaira(finalPrice)}
                    </span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">No active discount</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {[10, 15, 20, 25, 30].map((pct) => {
                  const isActive = activeDiscountPercent === pct
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => applyQuickDiscount(pct)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#1049EB] text-white'
                          : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-950 hover:text-slate-950'
                      }`}
                    >
                      -{pct}% Off
                    </button>
                  )
                })}
                {activeDiscountPercent > 0 || discountBadge ? (
                  <button
                    type="button"
                    onClick={clearQuickDiscount}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-50"
                  >
                    Remove Discount
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3.5 text-xs">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-slate-600">
                  Calculated Profit Margin:
                </span>
                <span
                  className={`font-mono tabular-nums text-sm font-bold ${
                    markupAmount < 0 ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {formatNaira(markupAmount)}
                </span>
              </div>
              <span
                className={`font-mono tabular-nums font-bold ${
                  markupAmount < 0 ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                {markupPercent >= 0 ? `+${markupPercent}%` : `${markupPercent}%`} Margin
              </span>
            </div>
          </section>

          {/* What's in the Box */}
          <section className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.06em] text-[#0B1220]">
                  What&apos;s in the Box
                </h3>
                <p className="mt-0.5 text-[11px] text-[#5E6675]">
                  List items included inside the package for customer clarity.
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-[#5E6675]">
                {whatsInTheBox.length} item(s)
              </span>
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
                placeholder="e.g. Power Cable, Remote Control, User Manual..."
                className={inputBaseClass}
              />
              <button
                type="button"
                onClick={handleAddBoxItem}
                className="inline-flex shrink-0 items-center gap-1 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
              >
                <Plus size={14} weight="regular" />
                <span>Add</span>
              </button>
            </div>

            {whatsInTheBox.length > 0 ? (
              <div className="flex flex-col gap-2">
                {whatsInTheBox.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-3.5 py-2 text-xs font-medium text-[#0B1220]"
                  >
                    <span className="flex items-center gap-2">
                      <Check size={14} weight="regular" className="text-[#15803D]" />
                      <span>{item}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBoxItem(idx)}
                      className="p-1 text-[#5E6675] transition-colors hover:text-[#B91C1C]"
                      aria-label={`Remove ${item}`}
                    >
                      <Trash size={14} weight="regular" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#5E6675]">No package items added yet.</p>
            )}
          </section>

          {/* Key Highlights / Specs */}
          <section className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.06em] text-[#0B1220]">
                  Key Product Highlights &amp; Specs
                </h3>
                <p className="mt-0.5 text-[11px] text-[#5E6675]">
                  Highlight specs displayed on the storefront (e.g. 4K Resolution, 1 Year Warranty).
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-[#5E6675]">
                {keyFeatures.length} spec(s)
              </span>
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
                className={inputBaseClass}
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="inline-flex shrink-0 items-center gap-1 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
              >
                <Plus size={14} weight="regular" />
                <span>Add</span>
              </button>
            </div>

            {keyFeatures.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {keyFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#1049EB]/25 bg-[#EEF3FE] px-2.5 py-1 text-xs font-semibold text-[#1049EB]"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-[#1049EB]/70 transition-colors hover:text-[#B91C1C]"
                      aria-label={`Remove ${feat}`}
                    >
                      <X size={12} weight="regular" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#5E6675]">No key specs added yet.</p>
            )}
          </section>

          {/* Sizing & Variant Inventory Manager */}
          <section className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.06em] text-[#0B1220]">
                  <span>Available Sizes &amp; Per-Size Stock</span>
                  <span className="rounded-[4px] border border-[#E5E7EB] bg-[#F6F7F9] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#374151]">
                    Variants
                  </span>
                </h3>
                <p className="mt-0.5 text-[11px] text-[#5E6675]">
                  Configure selectable sizes (EU 40, S, M, L) with stock counts per variant.
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-[#5E6675]">
                {sizes.length} size(s)
              </span>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-col gap-2">
              <span className={labelBaseClass}>Quick-Add Size Presets:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleAddPresetSizes(['38', '39', '40', '41', '42', '43', '44', '45', '46'])
                  }
                  className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-3 py-1.5 text-xs font-semibold text-[#0B1220] transition-colors hover:border-[#1049EB] hover:bg-[#EEF3FE] hover:text-[#1049EB]"
                >
                  <Sneaker size={15} weight="regular" />
                  <span>Shoe Sizes (EU 38 - 46)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAddPresetSizes(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'])
                  }
                  className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-3 py-1.5 text-xs font-semibold text-[#0B1220] transition-colors hover:border-[#1049EB] hover:bg-[#EEF3FE] hover:text-[#1049EB]"
                >
                  <TShirt size={15} weight="regular" />
                  <span>Clothing Sizes (XS - 3XL)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAddPresetSizes(['0-6M', '6-12M', '1-2Y', '2-3Y', '4-5Y'])
                  }
                  className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-3 py-1.5 text-xs font-semibold text-[#0B1220] transition-colors hover:border-[#1049EB] hover:bg-[#EEF3FE] hover:text-[#1049EB]"
                >
                  <Baby size={15} weight="regular" />
                  <span>Baby &amp; Kids (0-6M - 4-5Y)</span>
                </button>
                {sizes.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSizes([])
                      toast.info('All sizes cleared.')
                    }}
                    className="rounded-[6px] border border-[#FECACA] bg-[#FEF2F2] px-3 py-1.5 text-xs font-semibold text-[#B91C1C] hover:bg-[#FEE2E2]"
                  >
                    Clear All
                  </button>
                ) : null}
              </div>
            </div>

            {/* Custom Size Adder */}
            <div className="flex flex-wrap items-center gap-2 border-t border-[#E5E7EB] pt-3">
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
                placeholder="Custom Size (e.g. 47, One Size)"
                className={`${inputBaseClass} min-w-[160px] flex-1`}
              />
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[#5E6675]">Qty:</span>
                <input
                  type="number"
                  min={0}
                  value={customSizeQty}
                  onChange={(e) => setCustomSizeQty(Number(e.target.value))}
                  className="w-16 rounded-[6px] border border-[#D1D5DB] bg-white p-2.5 text-center font-mono text-xs font-bold text-[#0B1220] focus:border-[#1049EB] focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleAddCustomSize}
                className="inline-flex items-center gap-1 rounded-[6px] bg-[#0B1220] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
              >
                <Plus size={14} weight="regular" />
                <span>Add</span>
              </button>
            </div>

            {/* Sizes Grid */}
            {sizes.length > 0 ? (
              <div className="flex flex-col gap-2 pt-1">
                <span className={labelBaseClass}>Configured Sizes &amp; Stock Breakdown:</span>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {sizes.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] p-2.5"
                    >
                      <span className="rounded-[4px] border border-[#E5E7EB] bg-white px-2.5 py-1 font-mono text-xs font-bold text-[#0B1220]">
                        {s.size}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-[#5E6675]">Units:</span>
                        <input
                          type="number"
                          min={0}
                          value={s.stockQty}
                          onChange={(e) => handleUpdateSizeQty(idx, Number(e.target.value))}
                          className="w-14 rounded-[4px] border border-[#D1D5DB] bg-white p-1 text-center font-mono text-xs font-bold text-[#0B1220] focus:border-[#1049EB] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(idx)}
                          className="p-1 text-[#5E6675] hover:text-[#B91C1C]"
                          title="Remove size"
                        >
                          <Trash size={14} weight="regular" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#5E6675]">
                No sizes configured. Default single product stock quantity applies.
              </p>
            )}
          </section>
        </div>

        {/* Right Col: Gallery Manager & Stock/Badges */}
        <div className="flex flex-col gap-6">
          {/* Gallery */}
          <section className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <h3 className="border-b border-[#E5E7EB] pb-3 text-xs font-bold uppercase tracking-[0.06em] text-[#0B1220]">
              Product Photo Gallery ({images.length})
            </h3>

            {/* Cover Preview */}
            <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9]">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[0]}
                    alt="Main Cover"
                    className="h-full w-full object-contain p-2"
                  />
                  <span className="absolute left-2.5 top-2.5 rounded-[4px] bg-[#0B1220] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
                    Primary Cover
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-[#5E6675]">
                  <ImageIcon size={32} weight="regular" />
                  <span className="text-xs font-medium">No images uploaded yet</span>
                </div>
              )}
            </div>

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

            <button
              type="button"
              disabled={uploadingImage}
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-dashed border-[#D1D5DB] bg-[#F6F7F9] p-4 text-xs font-semibold text-[#0B1220] transition-colors hover:border-[#1049EB] hover:bg-[#EEF3FE]/50 disabled:opacity-60"
            >
              {uploadingImage ? (
                <>
                  <SpinnerGap size={16} weight="regular" className="animate-spin text-[#1049EB]" />
                  <span>Uploading Images to Storage...</span>
                </>
              ) : (
                <>
                  <UploadSimple size={16} weight="regular" className="text-[#1049EB]" />
                  <span>Upload Photos from Device</span>
                </>
              )}
            </button>

            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Or paste image URL (https://...)"
                className={inputBaseClass}
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="shrink-0 rounded-[6px] bg-[#0B1220] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
              >
                Add URL
              </button>
            </div>

            {images.length > 0 ? (
              <div className="flex flex-col gap-2 border-t border-[#E5E7EB] pt-3">
                <span className={labelBaseClass}>
                  Gallery Thumbnails (Star sets cover)
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`group relative flex aspect-square items-center justify-center overflow-hidden rounded-[6px] border bg-[#F6F7F9] p-1 ${
                        idx === 0 ? 'border-[#1049EB] ring-1 ring-[#1049EB]' : 'border-[#E5E7EB]'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-contain"
                      />

                      <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-[#0B1220]/45 p-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                        {idx !== 0 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSetPrimaryImage(idx)
                            }}
                            title="Set as Primary Cover"
                            className="rounded-[4px] bg-white p-1.5 text-[#B45309] hover:bg-[#FFFBEB]"
                          >
                            <Star size={13} weight="fill" className="text-[#FEB719]" />
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveImage(idx)
                          }}
                          title="Remove Photo"
                          className="rounded-[4px] bg-white p-1.5 text-[#B91C1C] hover:bg-[#FEF2F2]"
                        >
                          <Trash size={13} weight="regular" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          {/* Stock & Badges */}
          <section className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <h3 className="border-b border-[#E5E7EB] pb-3 text-xs font-bold uppercase tracking-[0.06em] text-[#0B1220]">
              Stock &amp; Badges
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className={labelBaseClass}>Stock Quantity Available *</label>
              <input
                type="number"
                required
                min={0}
                value={stockQty}
                onChange={(e) => setStockQty(Number(e.target.value))}
                placeholder="15"
                className={`${inputBaseClass} font-mono tabular-nums font-bold`}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className={labelBaseClass}>Badge Tag</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. New, Best Seller"
                  className={inputBaseClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelBaseClass}>Discount Tag</label>
                <input
                  type="text"
                  value={discountBadge}
                  onChange={(e) => setDiscountBadge(e.target.value)}
                  placeholder="e.g. -20%, Flash Sale"
                  className={`${inputBaseClass} font-mono`}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['New Arrival', 'Best Seller', 'Flash Deal', 'Limited Stock', 'Retail & Bulk'].map(
                (preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBadge(badge === preset ? '' : preset)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      badge === preset
                        ? 'bg-slate-950 text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-950 hover:text-slate-950'
                    }`}
                  >
                    {preset}
                  </button>
                )
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 border-t border-[#E5E7EB] pt-3 text-xs font-semibold text-[#374151]">
              <input
                type="checkbox"
                checked={bulky}
                onChange={(e) => setBulky(e.target.checked)}
                className="h-4 w-4 rounded-[4px] border-[#D1D5DB] text-[#1049EB] focus:ring-[#1049EB]"
              />
              <span>Bulky Freight Item (Requires Special Delivery)</span>
            </label>
          </section>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between gap-3 rounded-[8px] border border-[#E5E7EB] bg-white p-4">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="rounded-[6px] border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#374151] transition-colors hover:bg-[#F6F7F9]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploadingImage || isSubmitting}
          className="inline-flex items-center gap-2 rounded-[6px] bg-[#0B1220] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B] disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <SpinnerGap size={15} weight="regular" className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : isEditing ? (
            'Save & Update Product'
          ) : (
            'Create Product'
          )}
        </button>
      </div>
    </form>
  )
}
