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
    q: 'Does this item come with an official warranty?',
    a: 'Yes. All Noma electronics and home appliances include a 1-year distributor warranty and verified invoice.',
  },
  {
    q: 'Is Pay on Delivery supported for this product?',
    a: 'Pay on Delivery is supported for verified addresses across eligible metro locations. Delivery fees are calculated upfront at checkout.',
  },
  {
    q: 'How long does shipping take after checkout?',
    a: 'Standard delivery arrives within 2 to 5 business days nationwide, with express 1 to 2 day dispatch available in major hubs.',
  },
]

export function ProductDetail({ product, onAddToCart }: ProductDetailProps) {
  const navigate = useNavigate()
  const { toggleWishlist, isInWishlist } = useUserStore()
  const wishlisted = isInWishlist(product.id)

  const [quantity, setQuantity] = useState(1)
  const [selectedImgIndex, setSelectedImgIndex] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'delivery' | 'reviews' | 'qa'>(
    'overview'
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
      (c) => c.id === product.category || c.id.toLowerCase() === product.category.toLowerCase()
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
        (s) => s.id === raw || s.label.toLowerCase() === raw.toLowerCase()
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

    toast.success('Thank you. Your product review has been published.')
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
    return allStoreProducts
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 4)
  }, [allStoreProducts, product.id, product.category])

  const hasCompareAt = Boolean(
    product.compareAtPrice && product.compareAtPrice > product.finalPrice
  )
  const savingsAmount =
    hasCompareAt && product.compareAtPrice ? product.compareAtPrice - product.finalPrice : 0
  const discountPercent =
    hasCompareAt && product.compareAtPrice
      ? Math.round(((product.compareAtPrice - product.finalPrice) / product.compareAtPrice) * 100)
      : 0

  const handleAddToCartWithValidation = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size before adding to cart.')
      return
    }
    if (maxAvailableStock <= 0) {
      toast.error('This option is currently out of stock.')
      return
    }
    onAddToCart(selectedSize || undefined, quantity)
    toast.success(`Added ${product.name}${selectedSize ? ` (Size: ${selectedSize})` : ''} to cart`)
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
    <div className="min-h-screen bg-[#F6F7F9] pb-24 pt-4 text-[#0B1220]">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium text-[#5E6675]">
          <Link to="/" className="transition-colors hover:text-[#1049EB]">
            Home
          </Link>
          <CaretRight size={12} weight="regular" />
          <Link
            to={`/category/${product.category}`}
            className="capitalize transition-colors hover:text-[#1049EB]"
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
          <span className="max-w-[220px] truncate font-semibold text-[#0B1220] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Studio 7/5 Grid */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left 7 Cols: Studio Gallery */}
          <div className="flex flex-col gap-3 md:flex-row lg:col-span-7">
            {galleryImages.length > 1 ? (
              <div className="hidden w-16 shrink-0 flex-col gap-2.5 md:flex">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`aspect-square w-full overflow-hidden rounded-[6px] border bg-white p-1.5 transition-colors ${
                      selectedImgIndex === idx
                        ? 'border-[#1049EB] ring-1 ring-[#1049EB]'
                        : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
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
              className="relative flex aspect-[4/3] w-full flex-1 select-none items-center justify-center overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white p-6"
            >
              {/* Discount Micro Tag */}
              {discountPercent > 0 ? (
                <span className="absolute left-3.5 top-3.5 z-10 rounded-[4px] bg-[#B91C1C] px-2 py-0.5 font-mono text-xs font-semibold text-white">
                  -{discountPercent}%
                </span>
              ) : product.discountBadge ? (
                <span className="absolute left-3.5 top-3.5 z-10 rounded-[4px] bg-[#B91C1C] px-2 py-0.5 text-xs font-semibold text-white">
                  {product.discountBadge}
                </span>
              ) : null}

              {/* Share & Wishlist */}
              <div className="absolute right-3.5 top-3.5 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareProduct}
                  aria-label="Share product"
                  title="Share product"
                  className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#5E6675] transition-colors hover:border-[#0B1220]/30 hover:text-[#1049EB]"
                >
                  <ShareNetwork size={16} weight="regular" />
                </button>
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#5E6675] transition-colors hover:border-[#0B1220]/30"
                >
                  <Heart
                    size={16}
                    weight={wishlisted ? 'fill' : 'regular'}
                    className={wishlisted ? 'text-[#B91C1C]' : 'text-[#5E6675]'}
                  />
                </button>
              </div>

              {/* Mobile Prev/Next Controls */}
              {galleryImages.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImgIndex(
                        (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
                      )
                    }
                    aria-label="Previous image"
                    className="absolute left-2.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#0B1220] md:hidden"
                  >
                    <CaretLeft size={16} weight="regular" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImgIndex((prev) => (prev + 1) % galleryImages.length)
                    }
                    aria-label="Next image"
                    className="absolute right-2.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#0B1220] md:hidden"
                  >
                    <CaretRight size={16} weight="regular" />
                  </button>
                </>
              ) : null}

              {/* Studio Image or Placeholder */}
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
                    className="h-full w-full object-contain"
                  />
                </button>
              ) : (
                <ImagePlaceholder aspectRatio="h-full w-full" label="Product Image" />
              )}

              {galleryImages.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setZoomOpen(true)}
                  className="absolute bottom-3.5 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-[6px] border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#0B1220] transition-colors hover:bg-[#F6F7F9] md:inline-flex"
                >
                  <MagnifyingGlassPlus size={14} weight="regular" className="text-[#5E6675]" />
                  <span>Click to zoom</span>
                </button>
              ) : null}

              {galleryImages.length > 1 ? (
                <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 md:hidden">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImgIndex(idx)}
                      aria-label={`Select image ${idx + 1}`}
                      className={`h-1.5 rounded-[2px] transition-all ${
                        selectedImgIndex === idx ? 'w-5 bg-[#1049EB]' : 'w-1.5 bg-[#D1D5DB]'
                      }`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* Right 5 Cols: Product Meta, Pricing & Actions */}
          <div className="flex flex-col gap-5 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6 lg:col-span-5">
            <div className="flex flex-wrap items-center gap-2">
              {product.badge ? (
                <span className="rounded-[4px] bg-[#0B1220] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  {product.badge}
                </span>
              ) : null}
              {product.brand ? (
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5E6675]">
                  {product.brand}
                </span>
              ) : null}
            </div>

            <h1 className="text-2xl font-bold leading-tight tracking-tight text-[#0B1220] sm:text-3xl">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Star size={15} weight="fill" className="text-[#FEB719]" />
                <span className="font-mono font-bold text-[#0B1220]">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              {productReviews.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="font-mono text-[#5E6675] hover:text-[#1049EB] hover:underline"
                >
                  ({productReviews.length} {productReviews.length === 1 ? 'review' : 'reviews'})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reviews')
                    setShowReviewModal(true)
                  }}
                  className="font-semibold text-[#1049EB] hover:underline"
                >
                  Write the first review
                </button>
              )}
            </div>

            {/* Price & Stock Box */}
            <div className="space-y-2.5 rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <strong className="font-mono text-2xl font-bold tracking-tight text-[#0B1220] sm:text-3xl">
                  {formatNaira(product.finalPrice)}
                </strong>
                {hasCompareAt && product.compareAtPrice ? (
                  <span className="font-mono text-sm text-[#5E6675] line-through">
                    {formatNaira(product.compareAtPrice)}
                  </span>
                ) : null}
              </div>

              {hasCompareAt && savingsAmount > 0 ? (
                <span className="block font-mono text-xs font-semibold text-[#15803D]">
                  You save {formatNaira(savingsAmount)}
                </span>
              ) : null}

              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs font-semibold">
                {product.stockQty > 5 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-1 text-[#15803D]">
                    <span className="h-1.5 w-1.5 rounded-[2px] bg-[#15803D]" />
                    <span>In stock (</span>
                    <span className="font-mono">{product.stockQty}</span>
                    <span>available)</span>
                  </span>
                ) : product.stockQty > 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-1 text-[#B45309]">
                    <span className="h-1.5 w-1.5 rounded-[2px] bg-[#FEB719]" />
                    <span>Only</span>
                    <span className="font-mono">{product.stockQty}</span>
                    <span>left in stock</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#FECACA] bg-[#FEF2F2] px-2.5 py-1 text-[#B91C1C]">
                    <span className="h-1.5 w-1.5 rounded-[2px] bg-[#B91C1C]" />
                    <span>Out of stock</span>
                  </span>
                )}
              </div>
            </div>

            {/* Inline Size Variant Chips */}
            {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
              <div className="space-y-2.5 rounded-[8px] border border-[#E5E7EB] bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B1220]">
                    Available Sizes <span className="text-[#B91C1C]">*</span>
                  </span>
                  {selectedSize ? (
                    <span className="font-mono text-xs font-bold text-[#1049EB]">
                      Size: {selectedSize}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#B45309]">
                      Select a size
                    </span>
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
                        className={`relative flex min-w-[48px] items-center justify-center rounded-[6px] border px-3 py-2 font-mono text-xs font-semibold transition-colors ${
                          isSelected
                            ? 'border-[#0B1220] bg-[#0B1220] text-white'
                            : isOutOfStock
                              ? 'cursor-not-allowed border-[#E5E7EB] bg-[#F6F7F9] text-[#5E6675]/50 line-through'
                              : 'border-[#E5E7EB] bg-white text-[#0B1220] hover:border-[#1049EB]'
                        }`}
                      >
                        {s.size}
                      </button>
                    )
                  })}
                </div>

                {activeSizeObj ? (
                  <div className="flex items-center gap-1.5 pt-1 text-[11px] font-semibold">
                    {activeSizeObj.stockQty > 5 ? (
                      <span className="inline-flex items-center gap-1.5 text-[#15803D]">
                        <Check size={13} weight="bold" />
                        <span>
                          Size {selectedSize} in stock (
                          <span className="font-mono">{activeSizeObj.stockQty}</span> available)
                        </span>
                      </span>
                    ) : activeSizeObj.stockQty > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-[#B45309]">
                        <Warning size={13} weight="regular" />
                        <span>
                          Only <span className="font-mono">{activeSizeObj.stockQty}</span> left in
                          Size {selectedSize}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[#B91C1C]">
                        <XCircle size={13} weight="regular" />
                        <span>Size {selectedSize} is out of stock</span>
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Bulky Freight Notice */}
            {product.bulky ? (
              <div className="flex items-center gap-2.5 rounded-[6px] border border-[#FDE68A] bg-[#FFFBEB] p-3 text-xs font-semibold text-[#B45309]">
                <Truck size={18} weight="regular" className="shrink-0" />
                <span>Bulky Freight Item: Scheduled specialized delivery applies.</span>
              </div>
            ) : null}

            {/* Quantity & CTA Buttons */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#0B1220]">Quantity</span>
                <div className="flex items-center rounded-[6px] border border-[#E5E7EB] bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={maxAvailableStock <= 0}
                    aria-label="Decrease quantity"
                    className="p-2 text-[#5E6675] hover:text-[#0B1220] disabled:opacity-40"
                  >
                    <Minus size={14} weight="regular" />
                  </button>
                  <span className="w-10 text-center font-mono text-xs font-bold text-[#0B1220]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(maxAvailableStock || 1, q + 1))
                    }
                    disabled={maxAvailableStock <= 0 || quantity >= maxAvailableStock}
                    aria-label="Increase quantity"
                    className="p-2 text-[#5E6675] hover:text-[#0B1220] disabled:opacity-40"
                  >
                    <Plus size={14} weight="regular" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={maxAvailableStock <= 0}
                  onClick={handleAddToCartWithValidation}
                  className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#0B1220] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1049EB] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingBag size={17} weight="regular" />
                  <span>{maxAvailableStock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
                <button
                  type="button"
                  disabled={maxAvailableStock <= 0}
                  onClick={handleBuyNow}
                  className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#1049EB] bg-white px-5 py-3 text-sm font-semibold text-[#1049EB] transition-colors hover:bg-[#EEF3FE] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              <Link
                to={`/whatsapp-order?product=${encodeURIComponent(product.slug || product.id)}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-4 py-2.5 text-xs font-semibold text-[#0B1220] transition-colors hover:border-[#D1D5DB] hover:bg-[#EEF0F4]"
              >
                <WhatsappLogo size={16} weight="fill" className="text-[#15803D]" />
                <span>Order on WhatsApp</span>
              </Link>
            </div>

            {/* 4-Point Trust Strip */}
            <div className="grid grid-cols-2 gap-3 border-t border-[#E5E7EB] pt-4 text-[11px] font-semibold text-[#374151]">
              <div className="flex items-center gap-2">
                <ArrowsCounterClockwise size={15} weight="regular" className="text-[#1049EB]" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} weight="fill" className="text-[#1049EB]" />
                <span>1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={15} weight="regular" className="text-[#1049EB]" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={15} weight="regular" className="text-[#1049EB]" />
                <span>Pay on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tabs Panel */}
        <div className="mb-14 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-8">
          <div className="flex gap-6 overflow-x-auto border-b border-[#E5E7EB] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'specs', label: 'Specifications' },
              { id: 'delivery', label: 'Delivery & Returns' },
              { id: 'reviews', label: `Reviews (${productReviews.length})` },
              { id: 'qa', label: 'Q&A' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`relative whitespace-nowrap pb-3 text-xs font-semibold transition-colors sm:text-sm ${
                  activeTab === tab.id
                    ? 'text-[#1049EB]'
                    : 'text-[#5E6675] hover:text-[#0B1220]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id ? (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1049EB]" />
                ) : null}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === 'overview' ? (
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-12">
              <div
                className={
                  product.whatsInTheBox && product.whatsInTheBox.length > 0
                    ? 'space-y-5 md:col-span-7'
                    : 'space-y-5 md:col-span-12'
                }
              >
                <div>
                  <h2 className="text-base font-bold text-[#0B1220]">Product Description</h2>
                  <p className="mt-2 max-w-[65ch] text-sm leading-[1.6] text-[#374151]">
                    {product.description || 'No detailed product description provided yet.'}
                  </p>
                </div>

                {activeHighlights.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {activeHighlights.map((feat, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#1049EB]/25 bg-[#EEF3FE] px-3 py-1.5 text-xs font-semibold text-[#1049EB]"
                      >
                        <ShieldCheck size={14} weight="fill" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {product.whatsInTheBox && product.whatsInTheBox.length > 0 ? (
                <div className="rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-5 md:col-span-5">
                  <h3 className="text-sm font-bold text-[#0B1220]">What&apos;s in the Box</h3>
                  <ul className="mt-3 space-y-2.5 text-xs font-medium text-[#374151]">
                    {product.whatsInTheBox.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]">
                          <Check size={12} weight="bold" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Grouped Specification Cards */}
          {activeTab === 'specs' ? (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Classification &amp; Identity
                </span>
                <dl className="mt-3 space-y-3 text-xs">
                  {product.brand ? (
                    <div className="flex items-center justify-between gap-4 border-b border-[#E5E7EB] pb-2.5">
                      <dt className="text-[#5E6675]">Brand</dt>
                      <dd className="font-semibold text-[#0B1220]">{product.brand}</dd>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between gap-4 border-b border-[#E5E7EB] pb-2.5">
                    <dt className="text-[#5E6675]">Category</dt>
                    <dd className="font-semibold text-[#0B1220]">{displayCategory}</dd>
                  </div>
                  {displaySubcategory ? (
                    <div className="flex items-center justify-between gap-4 border-b border-[#E5E7EB] pb-2.5">
                      <dt className="text-[#5E6675]">Subcategory</dt>
                      <dd className="font-semibold text-[#0B1220]">{displaySubcategory}</dd>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[#5E6675]">Condition</dt>
                    <dd className="font-semibold text-[#0B1220]">Brand New - Verified</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Warranty &amp; Handling
                </span>
                <dl className="mt-3 space-y-3 text-xs">
                  <div className="flex items-center justify-between gap-4 border-b border-[#E5E7EB] pb-2.5">
                    <dt className="text-[#5E6675]">Warranty</dt>
                    <dd className="font-semibold text-[#15803D]">1 Year Distributor Warranty</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-[#E5E7EB] pb-2.5">
                    <dt className="text-[#5E6675]">Freight Type</dt>
                    <dd className="font-semibold text-[#0B1220]">
                      {product.bulky ? 'Specialized Heavy Freight' : 'Standard Parcel Dispatch'}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[#5E6675]">Returns</dt>
                    <dd className="font-semibold text-[#0B1220]">30-Day Eligibility</dd>
                  </div>
                </dl>
              </div>

              {activeHighlights.length > 0 ? (
                <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-5 md:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                    Key Technical Specifications
                  </span>
                  <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {activeHighlights.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-3 py-2.5 text-xs font-semibold text-[#0B1220]"
                      >
                        <Check size={14} weight="bold" className="shrink-0 text-[#1049EB]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Delivery & Returns */}
          {activeTab === 'delivery' ? (
            <div className="mt-6 max-w-[65ch] space-y-4 text-sm leading-[1.6] text-[#374151]">
              <div>
                <h2 className="text-base font-bold text-[#0B1220]">Delivery Policy</h2>
                <p className="mt-1">
                  Standard delivery takes 2 to 5 business days across Nigeria. Express 1 to 2 day delivery is calculated transparently at checkout based on state and parcel size.
                </p>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B1220]">Return &amp; Refund Policy</h3>
                <p className="mt-1">
                  Noma provides a 30-day return window for unused items in original packaging with accessories intact. Pay on Delivery is available in eligible metro locations.
                </p>
              </div>
            </div>
          ) : null}

          {/* Reviews */}
          {activeTab === 'reviews' ? (
            <div className="mt-6 space-y-6">
              <div className="flex flex-col items-start justify-between gap-4 rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-5">
                  <div className="flex min-w-[96px] flex-col items-center justify-center rounded-[6px] border border-[#FDE68A] bg-[#FFFBEB] p-3">
                    <span className="font-mono text-2xl font-bold text-[#0B1220]">
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
                              : 'text-[#E5E7EB]'
                          }
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[10px] font-semibold uppercase text-[#B45309]">
                      {productReviews.length} {productReviews.length === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#0B1220]">
                      Customer Ratings &amp; Reviews
                    </h2>
                    <p className="mt-0.5 text-xs text-[#5E6675]">
                      Verified buyer feedback for {product.name}.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowReviewModal(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#0B1220] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1049EB] sm:w-auto"
                >
                  <Plus size={14} weight="regular" />
                  <span>Write a Review</span>
                </button>
              </div>

              {productReviews.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#5E6675]">Filter:</span>
                  {(['all', 5, 4, 3, 2, 1] as const).map((r) => (
                    <button
                      key={String(r)}
                      type="button"
                      onClick={() => setFilterRating(r)}
                      className={`inline-flex items-center gap-1 rounded-[6px] border px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                        filterRating === r
                          ? 'border-[#0B1220] bg-[#0B1220] text-white'
                          : 'border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F6F7F9]'
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
                  detail="Purchased or used this item? Share your experience with fellow shoppers."
                  action={
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(true)}
                      className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1049EB]"
                    >
                      <Plus size={14} weight="regular" />
                      <span>Write a Review</span>
                    </button>
                  }
                />
              ) : (
                <div className="divide-y divide-[#E5E7EB] rounded-[8px] border border-[#E5E7EB]">
                  {filteredProductReviews.map((rev) => (
                    <div key={rev.id} className="space-y-2 p-5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#0B1220]">{rev.author}</span>
                          {rev.verifiedPurchase ? (
                            <span className="rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 text-[10px] font-semibold text-[#15803D]">
                              Verified Buyer
                            </span>
                          ) : null}
                        </div>
                        <span className="font-mono text-[11px] text-[#5E6675]">{rev.date}</span>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={13}
                            weight="fill"
                            className={star <= rev.rating ? 'text-[#FEB719]' : 'text-[#E5E7EB]'}
                          />
                        ))}
                      </div>

                      {rev.title ? (
                        <h3 className="text-xs font-bold text-[#0B1220]">{rev.title}</h3>
                      ) : null}
                      <p className="text-xs leading-relaxed text-[#374151]">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* Q&A Hairline Accordion */}
          {activeTab === 'qa' ? (
            <div className="mt-6 max-w-2xl">
              <h2 className="mb-4 text-base font-bold text-[#0B1220]">
                Frequently Asked Questions
              </h2>
              <div className="divide-y divide-[#E5E7EB] rounded-[8px] border border-[#E5E7EB] bg-white">
                {QA_ITEMS.map((item, idx) => {
                  const isOpen = openQaIndex === idx
                  return (
                    <div key={item.q}>
                      <button
                        type="button"
                        onClick={() => setOpenQaIndex(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-xs font-semibold text-[#0B1220] hover:bg-[#F6F7F9]"
                      >
                        <span>{item.q}</span>
                        {isOpen ? (
                          <Minus size={14} weight="regular" className="shrink-0 text-[#5E6675]" />
                        ) : (
                          <Plus size={14} weight="regular" className="shrink-0 text-[#5E6675]" />
                        )}
                      </button>
                      {isOpen ? (
                        <div className="border-t border-[#E5E7EB] bg-[#F6F7F9] px-4 py-3 text-xs leading-relaxed text-[#374151]">
                          {item.a}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>

        {/* Related Products (4-col canonical ProductCard grid) */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-[#0B1220] md:text-2xl">
              You might also like
            </h2>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1049EB] hover:underline"
            >
              <span>View all</span>
              <CaretRight size={14} weight="regular" />
            </Link>
          </div>

          {relatedProducts.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag size={24} weight="regular" />}
              title="No related products found yet"
              detail="Additional items in this category will appear here as they are added."
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {zoomOpen && galleryImages.length > 0 ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/75 p-4">
          <div className="relative w-full max-w-4xl rounded-[10px] border border-[#E5E7EB] bg-white p-4 sm:p-6 shadow-[0_8px_24px_rgba(11,18,32,0.08)]">
            <div className="mb-3 flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <span className="truncate text-sm font-bold text-[#0B1220]">{product.name}</span>
              <button
                type="button"
                onClick={() => setZoomOpen(false)}
                aria-label="Close zoom view"
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#5E6675] hover:text-[#0B1220]"
              >
                <X size={16} weight="regular" />
              </button>
            </div>

            <div className="relative flex aspect-[16/10] items-center justify-center rounded-[8px] bg-[#F6F7F9] p-6">
              <img
                src={galleryImages[selectedImgIndex]}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
              {galleryImages.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImgIndex(
                        (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
                      )
                    }
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#0B1220] hover:bg-[#F6F7F9]"
                  >
                    <CaretLeft size={16} weight="regular" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImgIndex((prev) => (prev + 1) % galleryImages.length)
                    }
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#0B1220] hover:bg-[#F6F7F9]"
                  >
                    <CaretRight size={16} weight="regular" />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* Write a Review Modal */}
      {showReviewModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[10px] border border-[#E5E7EB] bg-white p-6 shadow-[0_8px_24px_rgba(11,18,32,0.08)] sm:p-8">
            <button
              type="button"
              onClick={() => setShowReviewModal(false)}
              aria-label="Close review modal"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#5E6675] hover:text-[#0B1220]"
            >
              <X size={16} weight="regular" />
            </button>

            <div className="border-b border-[#E5E7EB] pb-4">
              <span className="inline-block rounded-[4px] border border-[#1049EB]/25 bg-[#EEF3FE] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#1049EB]">
                Submit Feedback
              </span>
              <h3 className="mt-2 text-lg font-bold text-[#0B1220]">
                Write a Review for {product.name}
              </h3>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-5 space-y-4 text-xs">
              <div>
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Overall Rating *
                </span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRatingInput(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        size={22}
                        weight="fill"
                        className={
                          (hoverRating || reviewRatingInput) >= star
                            ? 'text-[#FEB719]'
                            : 'text-[#E5E7EB]'
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-mono text-xs font-bold text-[#0B1220]">
                    {hoverRating || reviewRatingInput} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-[6px] border border-[#D1D5DB] bg-white px-3.5 py-2.5 text-sm text-[#0B1220] focus:border-[#1049EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={reviewerEmail}
                  onChange={(e) => setReviewerEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full rounded-[6px] border border-[#D1D5DB] bg-white px-3.5 py-2.5 text-sm text-[#0B1220] focus:border-[#1049EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Headline (Optional)
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summary of your experience"
                  className="w-full rounded-[6px] border border-[#D1D5DB] bg-white px-3.5 py-2.5 text-sm text-[#0B1220] focus:border-[#1049EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Detailed Review *
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share product quality, packaging, or delivery details..."
                  className="w-full rounded-[6px] border border-[#D1D5DB] bg-white px-3.5 py-2.5 text-sm text-[#0B1220] focus:border-[#1049EB] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="rounded-[6px] border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#0B1220] hover:bg-[#F6F7F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-[6px] bg-[#0B1220] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1049EB]"
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
