import {
  ArrowsCounterClockwise,
  CaretLeft,
  CaretRight,
  Check,
  Heart,
  Lock,
  MagnifyingGlassPlus,
  Minus,
  Plus,
  ShareNetwork,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Warning,
  WhatsappLogo,
  X,
  XCircle,
} from '@phosphor-icons/react'
import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ProductCard } from '../../components/commerce/ProductCard'
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useCartStore } from '../../store/cartStore'
import { useProductStore } from '../../store/productStore'
import { useUserStore } from '../../store/userStore'
import type { Product } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

interface ProductDetailProps {
  product: Product
  onAddToCart: (selectedSize?: string, quantity?: number) => void
}

const QA_ITEMS = [
  {
    q: 'Can I order this item in bulk or wholesale quantities?',
    a: 'Yes! Noma supports both single retail purchases and bulk orders (including footwear bales and wholesale quantities). Click "Order on WhatsApp" for custom bulk pricing.',
  },
  {
    q: 'Is Pay on Delivery supported?',
    a: 'Pay on Delivery is supported for verified addresses across eligible metro locations. Delivery fees are calculated upfront before you pay.',
  },
  {
    q: 'How long does shipping take after checkout?',
    a: 'Standard delivery arrives within 2 to 5 business days nationwide, with express 1 to 2 day dispatch available in Lagos and Abuja.',
  },
]

export function ProductDetail({ product, onAddToCart }: ProductDetailProps) {
  const navigate = useNavigate()
  const { toggleWishlist, isInWishlist } = useUserStore()
  const openDrawer = useCartStore((state) => state.openDrawer)
  const deliveryState = useCartStore((state) => state.deliveryState)
  const wishlisted = isInWishlist(product.id)

  const [quantity, setQuantity] = useState(1)
  const [selectedImgIndex, setSelectedImgIndex] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'delivery' | 'reviews' | 'qa'>(
    'overview',
  )
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [openQaIndex, setOpenQaIndex] = useState<number | null>(0)

  const { reviews, addReview, products: allStoreProducts, categories } = useProductStore()

  const activeSizeObj = useMemo(() => {
    if (!product.sizes || product.sizes.length === 0 || !selectedSize) return null
    return product.sizes.find((s) => s.size === selectedSize) || null
  }, [product.sizes, selectedSize])

  const maxAvailableStock = activeSizeObj ? activeSizeObj.stockQty : product.stockQty

  const displayCategory = useMemo(() => {
    const found = categories.find(
      (c) => c.id === product.category || c.id.toLowerCase() === product.category.toLowerCase(),
    )
    if (found?.label) return found.label
    return product.category
      ? product.category.charAt(0).toUpperCase() + product.category.slice(1).replace(/-/g, ' ')
      : ''
  }, [product.category, categories])

  const displaySubcategory = useMemo(() => {
    const raw = product.subCategory || product.subcategory
    if (!raw) return ''
    for (const cat of categories) {
      const match = cat.subcategories?.find(
        (s) => s.id === raw || s.label.toLowerCase() === raw.toLowerCase(),
      )
      if (match) return match.label
    }
    return raw.startsWith('sub-') ? '' : raw
  }, [product.subCategory, product.subcategory, categories])

  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewRatingInput, setReviewRatingInput] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewerName, setReviewerName] = useState('')
  const [reviewerEmail, setReviewerEmail] = useState('')
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [filterRating, setFilterRating] = useState<number | 'all'>('all')

  const productReviews = useMemo(() => {
    return reviews.filter((r) => r.productId === product.id && r.status === 'approved')
  }, [reviews, product.id])

  const averageRating = useMemo(() => {
    if (productReviews.length === 0) return product.rating || 4.8
    const sum = productReviews.reduce((a, b) => a + b.rating, 0)
    return Number((sum / productReviews.length).toFixed(1))
  }, [productReviews, product.rating])

  const filteredProductReviews = useMemo(() => {
    if (filterRating === 'all') return productReviews
    return productReviews.filter((r) => r.rating === filterRating)
  }, [productReviews, filterRating])

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewerName.trim() || !reviewComment.trim()) {
      toast.error('Please enter your name and review comment.')
      return
    }

    addReview({
      productId: product.id,
      productName: product.name,
      author: reviewerName.trim(),
      email: reviewerEmail.trim(),
      rating: reviewRatingInput,
      title: reviewTitle.trim() || undefined,
      comment: reviewComment.trim(),
      verifiedPurchase: true,
      status: 'approved',
    })

    toast.success('Thank you! Your review has been published.')
    setReviewerName('')
    setReviewerEmail('')
    setReviewTitle('')
    setReviewComment('')
    setReviewRatingInput(5)
    setShowReviewModal(false)
  }

  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const galleryImages = useMemo(() => {
    const list: string[] = []
    if (product.image && !product.image.includes('unsplash.com')) {
      list.push(product.image)
    }
    if (Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img && !img.includes('unsplash.com') && !list.includes(img)) {
          list.push(img)
        }
      })
    }
    return list
  }, [product.image, product.images])

  const relatedProducts = useMemo(() => {
    const SPACE_CLUSTERS: string[][] = [
      ['electronics', 'appliances', 'phones', 'power', 'solar'],
      ['kitchen', 'cooking', 'home-essentials', 'wines'],
      ['clothing', 'fashion', 'shoes'],
      ['outdoor', 'bicycles'],
    ]

    const currentCat = (product.category || '').toLowerCase()
    const currentSub = (product.subCategory || product.subcategory || '').toLowerCase()
    const currentBrand = (product.brand || '').toLowerCase()
    const currentCluster = SPACE_CLUSTERS.find((cluster) => cluster.includes(currentCat)) || [
      currentCat,
    ]
    const titleWords = product.name
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)

    return allStoreProducts
      .filter((p) => p.id !== product.id)
      .map((candidate) => {
        const candCat = (candidate.category || '').toLowerCase()
        const candSub = (candidate.subCategory || candidate.subcategory || '').toLowerCase()
        const candBrand = (candidate.brand || '').toLowerCase()
        const candName = candidate.name.toLowerCase()

        let score = 0
        if (currentSub && candSub && currentSub === candSub) {
          score += 120
        }
        if (candCat === currentCat) {
          score += 80
        } else if (currentCluster.includes(candCat)) {
          score += 45
        }
        if (currentBrand && candBrand && currentBrand === candBrand) {
          score += 30
        }
        for (const word of titleWords) {
          if (candName.includes(word)) {
            score += 15
          }
        }
        return { candidate, score }
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((entry) => entry.candidate)
  }, [allStoreProducts, product.id, product.category, product.subCategory, product.subcategory, product.brand, product.name])

  const hasCompareAt = Boolean(
    product.compareAtPrice && product.compareAtPrice > product.finalPrice,
  )
  const savingsAmount =
    hasCompareAt && product.compareAtPrice ? product.compareAtPrice - product.finalPrice : 0
  const discountPercent =
    hasCompareAt && product.compareAtPrice
      ? Math.round(((product.compareAtPrice - product.finalPrice) / product.compareAtPrice) * 100)
      : 0

  const handleAddToCartWithValidation = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size before adding to bag.')
      return
    }
    if (maxAvailableStock <= 0) {
      toast.error('This option is currently out of stock.')
      return
    }
    onAddToCart(selectedSize || undefined, quantity)
    openDrawer()
  }

  const handleBuyNow = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size before proceeding to checkout.')
      return
    }
    if (maxAvailableStock <= 0) {
      toast.error('This option is currently out of stock.')
      return
    }
    onAddToCart(selectedSize || undefined, quantity)
    navigate('/checkout')
  }

  const handleToggleWishlist = () => {
    toggleWishlist(product.id)
    toast.success(!wishlisted ? 'Saved to wishlist' : 'Removed from wishlist')
  }

  const handleShareProduct = async () => {
    const currentUrl = window.location.href
    const shareTitle = `${product.name} | NOMA Marketplace`
    const shareText = `Check out ${product.name} on NOMA for ${formatNaira(product.finalPrice)}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl,
        })
        return
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl)
      toast.success('Product link copied to clipboard')
    } else {
      toast.info(`Product Link: ${currentUrl}`)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (galleryImages.length <= 1 || !touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    if (distance > 40) {
      setSelectedImgIndex((prev) => (prev + 1) % galleryImages.length)
    } else if (distance < -40) {
      setSelectedImgIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  const activeHighlights = useMemo(() => {
    if (Array.isArray(product.keyFeatures) && product.keyFeatures.length > 0) {
      return product.keyFeatures
    }
    if (Array.isArray(product.specs) && product.specs.length > 0) {
      return product.specs
    }
    return []
  }, [product.keyFeatures, product.specs])

  return (
    <div className="min-h-screen pb-28 pt-5 text-slate-900">
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        {/* Friendly Breadcrumb */}
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="transition-colors hover:text-slate-900">
            Home
          </Link>
          <CaretRight size={12} weight="regular" />
          <Link
            to={`/category/${product.category}`}
            className="capitalize transition-colors hover:text-slate-900"
          >
            {displayCategory}
          </Link>
          {displaySubcategory ? (
            <>
              <CaretRight size={12} weight="regular" />
              <span className="capitalize">{displaySubcategory}</span>
            </>
          ) : null}
          <CaretRight size={12} weight="regular" />
          <span className="max-w-[220px] truncate font-semibold text-slate-900 sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Clean 7/5 Product Studio Layout */}
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
          {/* Left 7 Cols: Image Gallery */}
          <div className="flex flex-col gap-3 md:flex-row lg:col-span-7">
            {galleryImages.length > 1 ? (
              <div className="hidden w-16 shrink-0 flex-col gap-2.5 md:flex">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`aspect-square w-full overflow-hidden rounded-xl border bg-white p-1.5 transition-all ${
                      selectedImgIndex === idx
                        ? 'border-slate-900 ring-2 ring-slate-900/15'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            ) : null}

            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative flex aspect-[4/3] w-full flex-1 select-none items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-[#F4F4F5] p-6"
            >
              {discountPercent > 0 ? (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                  -{discountPercent}%
                </span>
              ) : product.discountBadge ? (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                  {product.discountBadge}
                </span>
              ) : null}

              <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareProduct}
                  aria-label="Share product"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-2xs transition-colors hover:text-slate-900"
                >
                  <ShareNetwork size={16} weight="regular" />
                </button>
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-2xs transition-colors ${
                    wishlisted ? 'text-rose-500' : 'text-slate-600 hover:text-rose-500'
                  }`}
                >
                  <Heart size={16} weight={wishlisted ? 'fill' : 'regular'} />
                </button>
              </div>

              {galleryImages.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImgIndex(
                        (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
                      )
                    }
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-xs md:hidden"
                  >
                    <CaretLeft size={15} weight="bold" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImgIndex((prev) => (prev + 1) % galleryImages.length)
                    }
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-xs md:hidden"
                  >
                    <CaretRight size={15} weight="bold" />
                  </button>
                </>
              ) : null}

              {galleryImages.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setZoomOpen(true)}
                  aria-label="Zoom product image"
                  className="h-full w-full cursor-zoom-in"
                >
                  <img
                    src={galleryImages[selectedImgIndex]}
                    alt={product.name}
                    className="h-full w-full object-contain mix-blend-multiply"
                  />
                </button>
              ) : (
                <ImagePlaceholder aspectRatio="h-full w-full" label="Product Image" />
              )}

              {galleryImages.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setZoomOpen(true)}
                  className="absolute bottom-4 left-4 hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 md:inline-flex"
                >
                  <MagnifyingGlassPlus size={14} weight="regular" />
                  <span>Click to zoom</span>
                </button>
              ) : null}
            </div>
          </div>

          {/* Right 5 Cols: Clean Conversion Card (Neutral Charcoal Palette, No Loud Blue) */}
          <div className="flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6 lg:col-span-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {product.badge ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-800">
                    {product.badge}
                  </span>
                ) : null}
                <span className="text-xs font-semibold capitalize text-slate-500">
                  {product.brand || displayCategory}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <Star size={14} weight="fill" className="text-[#FEB719]" />
                <span className="font-bold text-slate-900">{averageRating.toFixed(1)}</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="text-slate-500 hover:text-slate-900 hover:underline"
                >
                  ({productReviews.length} {productReviews.length === 1 ? 'review' : 'reviews'})
                </button>
              </div>
            </div>

            <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
              {product.name}
            </h1>

            {/* Price & Stock Box */}
            <div className="rounded-xl bg-[#F4F4F5] p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <strong className="text-2xl font-bold tabular-nums text-slate-900 sm:text-3xl">
                      {formatNaira(product.finalPrice)}
                    </strong>
                    {hasCompareAt && product.compareAtPrice ? (
                      <span className="text-sm tabular-nums text-slate-400 line-through">
                        {formatNaira(product.compareAtPrice)}
                      </span>
                    ) : null}
                  </div>
                  {hasCompareAt && savingsAmount > 0 ? (
                    <span className="mt-1 block text-xs font-semibold text-emerald-700">
                      You save {formatNaira(savingsAmount)}
                    </span>
                  ) : null}
                </div>

                <div className="text-xs font-semibold">
                  {product.stockQty > 5 ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span>In stock ({product.stockQty})</span>
                    </span>
                  ) : product.stockQty > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-amber-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span>Only {product.stockQty} left</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-rose-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                      <span>Out of stock</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Size Variant Pills */}
            {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Select Size *</span>
                  {selectedSize ? (
                    <span className="font-semibold text-slate-900">Size: {selectedSize}</span>
                  ) : (
                    <span className="font-medium text-slate-500">Please choose a size</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const isSelected = selectedSize === s.size
                    const isOutOfStock = s.stockQty <= 0

                    return (
                      <button
                        key={s.size}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => {
                          setSelectedSize(s.size)
                          setQuantity((q) => Math.min(q, Math.max(1, s.stockQty)))
                        }}
                        className={`flex min-w-[48px] items-center justify-center rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : isOutOfStock
                              ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-slate-900'
                        }`}
                      >
                        {s.size}
                      </button>
                    )
                  })}
                </div>

                {activeSizeObj ? (
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    {activeSizeObj.stockQty > 5 ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700">
                        <Check size={13} weight="bold" />
                        <span>Size {selectedSize} available ({activeSizeObj.stockQty} in stock)</span>
                      </span>
                    ) : activeSizeObj.stockQty > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-amber-700">
                        <Warning size={13} weight="regular" />
                        <span>Only {activeSizeObj.stockQty} left in Size {selectedSize}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-rose-600">
                        <XCircle size={13} weight="regular" />
                        <span>Size {selectedSize} is out of stock</span>
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Quantity & CTAs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Quantity</span>
                <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={maxAvailableStock <= 0}
                    aria-label="Decrease quantity"
                    className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <Minus size={13} weight="bold" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold tabular-nums text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxAvailableStock || 1, q + 1))}
                    disabled={maxAvailableStock <= 0 || quantity >= maxAvailableStock}
                    aria-label="Increase quantity"
                    className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <Plus size={13} weight="bold" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={maxAvailableStock <= 0}
                  onClick={handleAddToCartWithValidation}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingBag size={17} weight="regular" />
                  <span>{maxAvailableStock <= 0 ? 'Out of Stock' : 'Add to Bag'}</span>
                </button>
                <button
                  type="button"
                  disabled={maxAvailableStock <= 0}
                  onClick={handleBuyNow}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              <Link
                to={`/whatsapp-order?product=${encodeURIComponent(product.slug || product.id)}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-[#F4F4F5] px-4 py-3 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-200"
              >
                <WhatsappLogo size={17} weight="fill" className="text-emerald-600" />
                <span>Order or Ask About Bulk Pricing on WhatsApp</span>
              </Link>
            </div>

            {/* Clean 4-Point Assurances */}
            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-slate-800" />
                <span>Ships to {deliveryState}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-slate-800" />
                <span>Quality Checked</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowsCounterClockwise size={16} className="text-slate-800" />
                <span>Easy Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-slate-800" />
                <span>Pay on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Details Tabs Card */}
        <div className="mb-12 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-8">
          <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-slate-100 pb-3">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'specs', label: 'Details & Specs' },
              { id: 'delivery', label: 'Delivery & Returns' },
              { id: 'reviews', label: `Reviews (${productReviews.length})` },
              { id: 'qa', label: 'Common Questions' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-[#F4F4F5] text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === 'overview' ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                <div
                  className={
                    product.whatsInTheBox && product.whatsInTheBox.length > 0
                      ? 'space-y-4 md:col-span-7'
                      : 'space-y-4 md:col-span-12'
                  }
                >
                  <h2 className="text-base font-bold text-slate-900">About this item</h2>
                  <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
                    {product.description || 'No detailed product description provided yet.'}
                  </p>

                  {activeHighlights.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {activeHighlights.map((feat, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F4F5] px-3.5 py-1.5 text-xs font-semibold text-slate-800"
                        >
                          <Check size={13} weight="bold" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                {product.whatsInTheBox && product.whatsInTheBox.length > 0 ? (
                  <div className="rounded-xl bg-[#F4F4F5] p-5 md:col-span-5">
                    <h3 className="text-sm font-bold text-slate-900">What&apos;s Included</h3>
                    <ul className="mt-3 space-y-2 text-xs font-medium text-slate-700">
                      {product.whatsInTheBox.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2.5">
                          <Check size={14} weight="bold" className="text-emerald-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            {activeTab === 'specs' ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-[#F4F4F5] p-5">
                  <h3 className="text-xs font-bold text-slate-900">Product Information</h3>
                  <dl className="mt-3 space-y-2.5 text-xs">
                    {product.brand ? (
                      <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                        <dt className="text-slate-500">Brand</dt>
                        <dd className="font-semibold text-slate-900">{product.brand}</dd>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                      <dt className="text-slate-500">Category</dt>
                      <dd className="font-semibold text-slate-900">{displayCategory}</dd>
                    </div>
                    {displaySubcategory ? (
                      <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                        <dt className="text-slate-500">Subcategory</dt>
                        <dd className="font-semibold text-slate-900">{displaySubcategory}</dd>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-500">Order Options</dt>
                      <dd className="font-semibold text-slate-900">Retail &amp; Bulk Available</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-xl bg-[#F4F4F5] p-5">
                  <h3 className="text-xs font-bold text-slate-900">Shipping &amp; Returns</h3>
                  <dl className="mt-3 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                      <dt className="text-slate-500">Condition</dt>
                      <dd className="font-semibold text-emerald-700">Brand New &amp; Verified</dd>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                      <dt className="text-slate-500">Delivery</dt>
                      <dd className="font-semibold text-slate-900">2 - 5 Business Days</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-500">Return Policy</dt>
                      <dd className="font-semibold text-slate-900">Easy Return Guarantee</dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : null}

            {activeTab === 'delivery' ? (
              <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-slate-600">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Delivery Information</h2>
                  <p className="mt-1">
                    Standard delivery takes 2 to 5 business days across Nigeria. Express 24–48hr delivery is available in Lagos and Abuja. Exact delivery fees are shown in your shopping bag and checkout.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Returns &amp; Exchanges</h3>
                  <p className="mt-1">
                    We accept returns and exchanges on unused items in their original packaging. Contact our support team on WhatsApp for quick assistance.
                  </p>
                </div>
              </div>
            ) : null}

            {activeTab === 'reviews' ? (
              <div className="space-y-6">
                <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-[#F4F4F5] p-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex min-w-[88px] flex-col items-center justify-center rounded-xl bg-white p-3 shadow-2xs">
                      <span className="text-2xl font-bold text-slate-900">
                        {averageRating.toFixed(1)}
                      </span>
                      <div className="my-1 flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={12}
                            weight="fill"
                            className={
                              star <= Math.round(averageRating)
                                ? 'text-[#FEB719]'
                                : 'text-slate-200'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-medium text-slate-500">
                        {productReviews.length} reviews
                      </span>
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-slate-900">Customer Reviews</h2>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Verified feedback for {product.name}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowReviewModal(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    <Plus size={14} weight="bold" />
                    <span>Write a Review</span>
                  </button>
                </div>

                {productReviews.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {(['all', 5, 4, 3, 2, 1] as const).map((r) => (
                      <button
                        key={String(r)}
                        type="button"
                        onClick={() => setFilterRating(r)}
                        className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                          filterRating === r
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {r === 'all' ? (
                          'All'
                        ) : (
                          <>
                            <span>{r}</span>
                            <Star size={11} weight="fill" className="text-[#FEB719]" />
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                ) : null}

                {filteredProductReviews.length === 0 ? (
                  <EmptyState
                    icon={<Star size={24} weight="fill" className="text-[#FEB719]" />}
                    title="No reviews yet"
                    detail="Have you bought this item? Share your thoughts with other shoppers."
                    action={
                      <button
                        type="button"
                        onClick={() => setShowReviewModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
                      >
                        <Plus size={14} weight="bold" />
                        <span>Write a Review</span>
                      </button>
                    }
                  />
                ) : (
                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                    {filteredProductReviews.map((rev) => (
                      <div key={rev.id} className="space-y-2 p-5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{rev.author}</span>
                            {rev.verifiedPurchase ? (
                              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                                Verified Buyer
                              </span>
                            ) : null}
                          </div>
                          <span className="text-xs text-slate-400">{rev.date}</span>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={13}
                              weight="fill"
                              className={star <= rev.rating ? 'text-[#FEB719]' : 'text-slate-200'}
                            />
                          ))}
                        </div>

                        {rev.title ? (
                          <h3 className="text-xs font-bold text-slate-900">{rev.title}</h3>
                        ) : null}
                        <p className="text-xs leading-relaxed text-slate-600">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {activeTab === 'qa' ? (
              <div className="max-w-2xl divide-y divide-slate-100 rounded-xl border border-slate-200">
                {QA_ITEMS.map((item, idx) => {
                  const isOpen = openQaIndex === idx
                  return (
                    <div key={item.q}>
                      <button
                        type="button"
                        onClick={() => setOpenQaIndex(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-xs font-semibold text-slate-900 hover:bg-slate-50"
                      >
                        <span>{item.q}</span>
                        {isOpen ? (
                          <Minus size={14} weight="bold" className="shrink-0 text-slate-400" />
                        ) : (
                          <Plus size={14} weight="bold" className="shrink-0 text-slate-400" />
                        )}
                      </button>
                      {isOpen ? (
                        <div className="bg-slate-50 px-5 py-4 text-xs leading-relaxed text-slate-600">
                          {item.a}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">You Might Also Like</h2>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:underline"
            >
              <span>See all</span>
              <CaretRight size={14} weight="bold" />
            </Link>
          </div>

          {relatedProducts.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag size={24} weight="regular" />}
              title="No related products yet"
              detail="More items in this category will appear here soon."
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Mobile Bottom Add-to-Bag Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-slate-200 bg-white px-4 py-3 shadow-lg md:hidden">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500">{product.name}</p>
          <p className="text-base font-bold tabular-nums text-slate-900">
            {formatNaira(product.finalPrice)}
          </p>
        </div>
        <button
          type="button"
          disabled={maxAvailableStock <= 0}
          onClick={handleAddToCartWithValidation}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
        >
          <ShoppingBag size={16} weight="regular" />
          <span>{maxAvailableStock <= 0 ? 'Out of Stock' : 'Add to Bag'}</span>
        </button>
      </div>

      {/* Lightbox Zoom Modal */}
      {zoomOpen && galleryImages.length > 0 ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="truncate text-sm font-bold text-slate-900">{product.name}</span>
              <button
                type="button"
                onClick={() => setZoomOpen(false)}
                aria-label="Close zoom view"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div className="relative flex aspect-[16/10] items-center justify-center rounded-xl bg-slate-50 p-6">
              <img
                src={galleryImages[selectedImgIndex]}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Write a Review Modal */}
      {showReviewModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setShowReviewModal(false)}
              aria-label="Close review modal"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700"
            >
              <X size={16} weight="bold" />
            </button>

            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Write a Review</h3>
              <p className="mt-0.5 text-xs text-slate-500">{product.name}</p>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-5 space-y-4 text-xs">
              <div>
                <span className="mb-2 block font-semibold text-slate-700">Your Rating *</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRatingInput(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5"
                    >
                      <Star
                        size={22}
                        weight="fill"
                        className={
                          (hoverRating || reviewRatingInput) >= star
                            ? 'text-[#FEB719]'
                            : 'text-slate-200'
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-900">
                    {hoverRating || reviewRatingInput} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-slate-700">Your Name *</label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-slate-700">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={reviewerEmail}
                  onChange={(e) => setReviewerEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-slate-700">
                  Review Title (Optional)
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summary of your experience"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-slate-700">Your Review *</label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share product quality, sizing, or delivery experience..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
