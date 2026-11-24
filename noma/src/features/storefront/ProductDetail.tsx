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
    <div className="min-h-screen bg-white pb-28 text-[#09090B]">
      <div className="mx-auto max-w-[1600px] border-x border-[#E4E4E7]">
        {/* Architectural Breadcrumb Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E4E7] bg-[#FAFAFA] px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-[#71717A] sm:px-8">
          <nav className="flex flex-wrap items-center gap-2">
            <Link to="/" className="transition-colors hover:text-[#09090B]">
              INDEX
            </Link>
            <span>/</span>
            <Link
              to={`/category/${product.category}`}
              className="transition-colors hover:text-[#09090B]"
            >
              {displayCategory}
            </Link>
            {displaySubcategory ? (
              <>
                <span>/</span>
                <span>{displaySubcategory}</span>
              </>
            ) : null}
            <span>/</span>
            <span className="max-w-[220px] truncate font-semibold text-[#09090B] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          <span>SKU: {product.id.toUpperCase()}</span>
        </div>

        {/* Studio 7/5 Exposed 1px Architectural Grid */}
        <div className="grid grid-cols-1 divide-y divide-[#E4E4E7] border-b border-[#E4E4E7] lg:grid-cols-12 lg:divide-x lg:divide-y-0">
          {/* Left 7 Cols: Concrete Studio Gallery */}
          <div className="flex flex-col bg-[#F4F4F5] lg:col-span-7">
            <div className="relative flex flex-1 flex-col md:flex-row">
              {galleryImages.length > 1 ? (
                <div className="hidden w-20 shrink-0 flex-col divide-y divide-[#E4E4E7] border-r border-[#E4E4E7] bg-white md:flex">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`aspect-square w-full p-2 transition-colors ${
                        selectedImgIndex === idx
                          ? 'bg-[#F4F4F5] ring-2 ring-inset ring-[#09090B]'
                          : 'bg-white hover:bg-[#FAFAFA]'
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-contain mix-blend-multiply"
                      />
                    </button>
                  ))}
                </div>
              ) : null}

              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="relative flex aspect-[4/3] w-full flex-1 select-none items-center justify-center overflow-hidden bg-[#F4F4F5] p-6 sm:p-12"
              >
                {/* Discount Micro Tag */}
                {discountPercent > 0 ? (
                  <span className="absolute left-4 top-4 z-10 bg-[#FEB719] px-2.5 py-0.5 font-mono text-xs font-bold text-[#09090B]">
                    -{discountPercent}%
                  </span>
                ) : product.discountBadge ? (
                  <span className="absolute left-4 top-4 z-10 bg-[#FEB719] px-2.5 py-0.5 font-mono text-xs font-bold text-[#09090B]">
                    {product.discountBadge}
                  </span>
                ) : null}

                {/* Share & Wishlist */}
                <div className="absolute right-4 top-4 z-10 flex items-center gap-px border border-[#E4E4E7] bg-[#E4E4E7]">
                  <button
                    type="button"
                    onClick={handleShareProduct}
                    aria-label="Share product"
                    title="Share product"
                    className="flex h-9 w-9 items-center justify-center bg-white text-[#52525B] transition-colors hover:bg-[#09090B] hover:text-white"
                  >
                    <ShareNetwork size={15} weight="regular" />
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                    title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                    className={`flex h-9 w-9 items-center justify-center transition-colors ${
                      wishlisted
                        ? 'bg-[#09090B] text-white'
                        : 'bg-white text-[#52525B] hover:bg-[#09090B] hover:text-white'
                    }`}
                  >
                    <Heart size={15} weight={wishlisted ? 'fill' : 'regular'} />
                  </button>
                </div>

                {/* Mobile Prev/Next Controls */}
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
                      className="absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-[#E4E4E7] bg-white text-[#09090B] md:hidden"
                    >
                      <CaretLeft size={15} weight="regular" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedImgIndex((prev) => (prev + 1) % galleryImages.length)
                      }
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-[#E4E4E7] bg-white text-[#09090B] md:hidden"
                    >
                      <CaretRight size={15} weight="regular" />
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
                    className="absolute bottom-4 left-4 hidden items-center gap-1.5 border border-[#E4E4E7] bg-white px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#09090B] transition-colors hover:border-[#09090B] md:inline-flex"
                  >
                    <MagnifyingGlassPlus size={13} weight="regular" />
                    <span>INSPECT IMAGE</span>
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Architectural Product Specification & Conversion Panel */}
          <div className="flex flex-col justify-between divide-y divide-[#E4E4E7] bg-white lg:col-span-5">
            {/* Block 1: Brand, Title & Rating */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {product.badge ? (
                    <span className="bg-[#09090B] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
                      {product.badge}
                    </span>
                  ) : null}
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#71717A]">
                    {product.brand || displayCategory}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <Star size={14} weight="fill" className="text-[#FEB719]" />
                  <span className="font-mono font-bold text-[#09090B]">
                    {averageRating.toFixed(1)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('reviews')}
                    className="font-mono text-[11px] text-[#71717A] hover:text-[#1049EB] hover:underline"
                  >
                    [{productReviews.length}]
                  </button>
                </div>
              </div>

              <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-[#09090B] sm:text-3xl">
                {product.name}
              </h1>

              {/* Price & Stock Status */}
              <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4 border-t border-[#E4E4E7] pt-5">
                <div>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <strong className="font-mono text-2xl font-bold tabular-nums tracking-tight text-[#09090B] sm:text-3xl">
                      {formatNaira(product.finalPrice)}
                    </strong>
                    {hasCompareAt && product.compareAtPrice ? (
                      <span className="font-mono text-sm tabular-nums text-[#71717A] line-through">
                        {formatNaira(product.compareAtPrice)}
                      </span>
                    ) : null}
                  </div>
                  {hasCompareAt && savingsAmount > 0 ? (
                    <span className="mt-1 block font-mono text-xs font-semibold text-[#16A34A]">
                      SAVE {formatNaira(savingsAmount)}
                    </span>
                  ) : null}
                </div>

                <div className="font-mono text-[11px] font-semibold uppercase">
                  {product.stockQty > 5 ? (
                    <span className="inline-flex items-center gap-1.5 border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-1 text-[#16A34A]">
                      <span className="h-1.5 w-1.5 bg-[#16A34A]" />
                      <span>IN STOCK [{product.stockQty}]</span>
                    </span>
                  ) : product.stockQty > 0 ? (
                    <span className="inline-flex items-center gap-1.5 border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-1 text-[#B45309]">
                      <span className="h-1.5 w-1.5 bg-[#FEB719]" />
                      <span>LOW STOCK [{product.stockQty}]</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 border border-[#FECACA] bg-[#FEF2F2] px-2.5 py-1 text-[#DC2626]">
                      <span className="h-1.5 w-1.5 bg-[#DC2626]" />
                      <span>SOLD OUT</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Block 2: Size Variant Chips (if applicable) */}
            {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
              <div className="p-6 sm:px-8">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                    SELECT SIZE *
                  </span>
                  {selectedSize ? (
                    <span className="font-mono text-xs font-bold text-[#1049EB]">
                      SIZE: {selectedSize}
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] font-semibold uppercase text-[#D97706]">
                      REQUIRED
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
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
                        className={`flex min-w-[48px] items-center justify-center border px-3.5 py-2 font-mono text-xs font-semibold transition-colors ${
                          isSelected
                            ? 'border-[#09090B] bg-[#09090B] text-white'
                            : isOutOfStock
                              ? 'cursor-not-allowed border-[#E4E4E7] bg-[#F4F4F5] text-[#71717A]/40 line-through'
                              : 'border-[#E4E4E7] bg-white text-[#09090B] hover:border-[#09090B]'
                        }`}
                      >
                        {s.size}
                      </button>
                    )
                  })}
                </div>

                {activeSizeObj ? (
                  <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[11px] font-semibold">
                    {activeSizeObj.stockQty > 5 ? (
                      <span className="inline-flex items-center gap-1.5 text-[#16A34A]">
                        <Check size={13} weight="bold" />
                        <span>SIZE {selectedSize} AVAILABLE ({activeSizeObj.stockQty})</span>
                      </span>
                    ) : activeSizeObj.stockQty > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-[#D97706]">
                        <Warning size={13} weight="regular" />
                        <span>ONLY {activeSizeObj.stockQty} LEFT IN SIZE {selectedSize}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[#DC2626]">
                        <XCircle size={13} weight="regular" />
                        <span>SIZE {selectedSize} SOLD OUT</span>
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Block 3: Quantity, Add to Bag (Opens Slide-Out Drawer) & Buy Now */}
            <div className="space-y-4 p-6 sm:p-8">
              {product.bulky ? (
                <div className="flex items-center gap-2.5 border border-[#FDE68A] bg-[#FFFBEB] p-3 font-mono text-[11px] font-semibold text-[#B45309]">
                  <Truck size={16} weight="regular" className="shrink-0" />
                  <span>BULKY FREIGHT UNIT: SPECIALIZED CARGO HANDLING APPLIES</span>
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                  QUANTITY
                </span>
                <div className="flex items-center border border-[#E4E4E7] bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={maxAvailableStock <= 0}
                    aria-label="Decrease quantity"
                    className="flex h-9 w-9 items-center justify-center text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#09090B] disabled:opacity-40"
                  >
                    <Minus size={13} weight="regular" />
                  </button>
                  <span className="w-11 border-x border-[#E4E4E7] text-center font-mono text-xs font-bold text-[#09090B]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxAvailableStock || 1, q + 1))}
                    disabled={maxAvailableStock <= 0 || quantity >= maxAvailableStock}
                    aria-label="Increase quantity"
                    className="flex h-9 w-9 items-center justify-center text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#09090B] disabled:opacity-40"
                  >
                    <Plus size={13} weight="regular" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={maxAvailableStock <= 0}
                  onClick={handleAddToCartWithValidation}
                  className="inline-flex items-center justify-center gap-2 bg-[#09090B] px-5 py-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#1049EB] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingBag size={16} weight="regular" />
                  <span>{maxAvailableStock <= 0 ? 'SOLD OUT' : 'ADD TO BAG'}</span>
                </button>
                <button
                  type="button"
                  disabled={maxAvailableStock <= 0}
                  onClick={handleBuyNow}
                  className="inline-flex items-center justify-center gap-2 border border-[#09090B] bg-white px-5 py-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#09090B] transition-colors hover:bg-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>DIRECT CHECKOUT</span>
                </button>
              </div>

              <Link
                to={`/whatsapp-order?product=${encodeURIComponent(product.slug || product.id)}`}
                className="inline-flex w-full items-center justify-center gap-2 border border-[#E4E4E7] bg-[#FAFAFA] px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#09090B] transition-colors hover:border-[#09090B]"
              >
                <WhatsappLogo size={16} weight="fill" className="text-[#16A34A]" />
                <span>Order via WhatsApp Concierge</span>
              </Link>
            </div>

            {/* Block 4: 4-Cell Exposed Trust Grid */}
            <div className="grid grid-cols-2 gap-px bg-[#E4E4E7] font-mono text-[10px] font-semibold uppercase tracking-wider text-[#09090B]">
              <div className="flex items-center gap-2 bg-[#FAFAFA] p-4">
                <Truck size={15} weight="regular" className="text-[#1049EB]" />
                <span>DISPATCH TO {deliveryState.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FAFAFA] p-4">
                <ShieldCheck size={15} weight="fill" className="text-[#1049EB]" />
                <span>1-YR OEM WARRANTY</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FAFAFA] p-4">
                <ArrowsCounterClockwise size={15} weight="regular" className="text-[#1049EB]" />
                <span>30-DAY RETURN POLICY</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FAFAFA] p-4">
                <Lock size={15} weight="regular" className="text-[#1049EB]" />
                <span>PAY ON DELIVERY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Architectural Details Tabs Panel */}
        <div className="border-b border-[#E4E4E7] bg-white">
          <div className="flex divide-x divide-[#E4E4E7] overflow-x-auto border-b border-[#E4E4E7] bg-[#FAFAFA]">
            {[
              { id: 'overview', label: '01 / OVERVIEW' },
              { id: 'specs', label: '02 / SPECIFICATIONS' },
              { id: 'delivery', label: '03 / LOGISTICS & RETURNS' },
              { id: 'reviews', label: `04 / REVIEWS [${productReviews.length}]` },
              { id: 'qa', label: '05 / FAQ' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`relative shrink-0 px-6 py-4 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#09090B] text-white'
                    : 'bg-[#FAFAFA] text-[#52525B] hover:bg-white hover:text-[#09090B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-10">
            {/* Overview */}
            {activeTab === 'overview' ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                <div
                  className={
                    product.whatsInTheBox && product.whatsInTheBox.length > 0
                      ? 'space-y-5 md:col-span-7'
                      : 'space-y-5 md:col-span-12'
                  }
                >
                  <div>
                    <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#71717A]">
                      ARCHITECTURAL BRIEF
                    </h2>
                    <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-[#09090B]">
                      {product.description || 'No detailed product description provided yet.'}
                    </p>
                  </div>

                  {activeHighlights.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {activeHighlights.map((feat, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1.5 border border-[#E4E4E7] bg-[#FAFAFA] px-3 py-1.5 font-mono text-xs font-medium text-[#09090B]"
                        >
                          <ShieldCheck size={14} weight="fill" className="text-[#1049EB]" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                {product.whatsInTheBox && product.whatsInTheBox.length > 0 ? (
                  <div className="border border-[#E4E4E7] bg-[#FAFAFA] p-6 md:col-span-5">
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#09090B]">
                      INCLUDED IN FACTORY BOX
                    </h3>
                    <ul className="mt-4 space-y-2.5 text-xs font-medium text-[#09090B]">
                      {product.whatsInTheBox.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2.5">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-[#BBF7D0] bg-[#F0FDF4] text-[#16A34A]">
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

            {/* Specifications */}
            {activeTab === 'specs' ? (
              <div className="grid grid-cols-1 gap-px border border-[#E4E4E7] bg-[#E4E4E7] md:grid-cols-2">
                <div className="bg-white p-6">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                    CLASSIFICATION &amp; IDENTITY
                  </span>
                  <dl className="mt-4 space-y-3 text-xs">
                    {product.brand ? (
                      <div className="flex items-center justify-between gap-4 border-b border-[#E4E4E7] pb-2.5">
                        <dt className="text-[#71717A]">Brand</dt>
                        <dd className="font-mono font-semibold text-[#09090B]">{product.brand}</dd>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between gap-4 border-b border-[#E4E4E7] pb-2.5">
                      <dt className="text-[#71717A]">Department</dt>
                      <dd className="font-mono font-semibold text-[#09090B]">{displayCategory}</dd>
                    </div>
                    {displaySubcategory ? (
                      <div className="flex items-center justify-between gap-4 border-b border-[#E4E4E7] pb-2.5">
                        <dt className="text-[#71717A]">Subcategory</dt>
                        <dd className="font-mono font-semibold text-[#09090B]">
                          {displaySubcategory}
                        </dd>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-[#71717A]">Condition</dt>
                      <dd className="font-mono font-semibold text-[#09090B]">
                        Factory Sealed - Verified
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-white p-6">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                    WARRANTY &amp; LOGISTICS
                  </span>
                  <dl className="mt-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-4 border-b border-[#E4E4E7] pb-2.5">
                      <dt className="text-[#71717A]">Warranty</dt>
                      <dd className="font-mono font-semibold text-[#16A34A]">
                        1 Year Distributor Warranty
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-b border-[#E4E4E7] pb-2.5">
                      <dt className="text-[#71717A]">Freight Class</dt>
                      <dd className="font-mono font-semibold text-[#09090B]">
                        {product.bulky ? 'Specialized Heavy Cargo' : 'Standard Parcel Dispatch'}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-[#71717A]">Returns</dt>
                      <dd className="font-mono font-semibold text-[#09090B]">
                        30-Day Return Window
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : null}

            {/* Delivery & Returns */}
            {activeTab === 'delivery' ? (
              <div className="max-w-[65ch] space-y-4 text-sm leading-relaxed text-[#52525B]">
                <div>
                  <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#09090B]">
                    NATIONWIDE DISPATCH POLICY
                  </h2>
                  <p className="mt-1.5">
                    Standard delivery takes 2 to 5 business days across Nigeria. Express 24–48hr delivery is available in Lagos &amp; Abuja and calculated transparently in the slide-out bag drawer and checkout.
                  </p>
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#09090B]">
                    RETURN &amp; REPLACEMENT GUARANTEE
                  </h3>
                  <p className="mt-1.5">
                    Noma provides a 30-day return window for unused units in original factory packaging with accessories intact. Pay on Delivery is available in eligible metro locations.
                  </p>
                </div>
              </div>
            ) : null}

            {/* Reviews */}
            {activeTab === 'reviews' ? (
              <div className="space-y-6">
                <div className="flex flex-col items-start justify-between gap-4 border border-[#E4E4E7] bg-[#FAFAFA] p-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-5">
                    <div className="flex min-w-[96px] flex-col items-center justify-center border border-[#E4E4E7] bg-white p-3">
                      <span className="font-mono text-2xl font-bold text-[#09090B]">
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
                                : 'text-[#E4E4E7]'
                            }
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] font-semibold uppercase text-[#71717A]">
                        {productReviews.length} REVIEWS
                      </span>
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-[#09090B]">
                        Verified Customer Reviews
                      </h2>
                      <p className="mt-0.5 text-xs text-[#52525B]">
                        Authentic owner feedback for {product.name}.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowReviewModal(true)}
                    className="inline-flex w-full items-center justify-center gap-2 bg-[#09090B] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#1049EB] sm:w-auto"
                  >
                    <Plus size={14} weight="regular" />
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
                        className={`inline-flex items-center gap-1 border px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                          filterRating === r
                            ? 'border-[#09090B] bg-[#09090B] text-white'
                            : 'border-[#E4E4E7] bg-white text-[#09090B] hover:border-[#09090B]'
                        }`}
                      >
                        {r === 'all' ? (
                          'ALL'
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
                        className="inline-flex items-center gap-1.5 bg-[#09090B] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#1049EB]"
                      >
                        <Plus size={14} weight="regular" />
                        <span>Write a Review</span>
                      </button>
                    }
                  />
                ) : (
                  <div className="divide-y divide-[#E4E4E7] border border-[#E4E4E7]">
                    {filteredProductReviews.map((rev) => (
                      <div key={rev.id} className="space-y-2 p-5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#09090B]">{rev.author}</span>
                            {rev.verifiedPurchase ? (
                              <span className="border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#16A34A]">
                                VERIFIED BUYER
                              </span>
                            ) : null}
                          </div>
                          <span className="font-mono text-[11px] text-[#71717A]">{rev.date}</span>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={13}
                              weight="fill"
                              className={star <= rev.rating ? 'text-[#FEB719]' : 'text-[#E4E4E7]'}
                            />
                          ))}
                        </div>

                        {rev.title ? (
                          <h3 className="text-xs font-bold text-[#09090B]">{rev.title}</h3>
                        ) : null}
                        <p className="text-xs leading-relaxed text-[#52525B]">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Q&A Hairline Accordion */}
            {activeTab === 'qa' ? (
              <div className="max-w-2xl">
                <div className="divide-y divide-[#E4E4E7] border border-[#E4E4E7] bg-white">
                  {QA_ITEMS.map((item, idx) => {
                    const isOpen = openQaIndex === idx
                    return (
                      <div key={item.q}>
                        <button
                          type="button"
                          onClick={() => setOpenQaIndex(isOpen ? null : idx)}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-xs font-semibold text-[#09090B] hover:bg-[#FAFAFA]"
                        >
                          <span>{item.q}</span>
                          {isOpen ? (
                            <Minus size={14} weight="regular" className="shrink-0 text-[#71717A]" />
                          ) : (
                            <Plus size={14} weight="regular" className="shrink-0 text-[#71717A]" />
                          )}
                        </button>
                        {isOpen ? (
                          <div className="border-t border-[#E4E4E7] bg-[#FAFAFA] px-5 py-4 text-xs leading-relaxed text-[#52525B]">
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
        </div>

        {/* Related Products (4-Col Exposed 1px Grid) */}
        <div>
          <div className="flex items-center justify-between border-b border-[#E4E4E7] px-5 py-4 sm:px-8">
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1049EB]">
                RELATED HARDWARE
              </span>
              <h2 className="mt-0.5 text-xl font-bold tracking-tight text-[#09090B]">
                Compatible &amp; Similar Units
              </h2>
            </div>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-wider text-[#09090B] hover:text-[#1049EB]"
            >
              <span>VIEW ALL</span>
              <CaretRight size={14} weight="regular" />
            </Link>
          </div>

          {relatedProducts.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<ShoppingBag size={24} weight="regular" />}
                title="No related products found yet"
                detail="Additional items in this department will appear here as they are added."
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-px bg-[#E4E4E7] md:grid-cols-4">
              {relatedProducts.map((relProduct, idx) => (
                <ProductCard key={relProduct.id} product={relProduct} index={idx} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Mobile Bottom Add-to-Bag Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-[#09090B] bg-white px-4 py-3 shadow-2xl md:hidden">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold text-[#52525B]">{product.name}</p>
          <p className="font-mono text-sm font-bold tabular-nums text-[#09090B]">
            {formatNaira(product.finalPrice)}
          </p>
        </div>
        <button
          type="button"
          disabled={maxAvailableStock <= 0}
          onClick={handleAddToCartWithValidation}
          className="inline-flex shrink-0 items-center justify-center gap-2 bg-[#09090B] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#1049EB] disabled:opacity-50"
        >
          <ShoppingBag size={15} weight="regular" />
          <span>{maxAvailableStock <= 0 ? 'SOLD OUT' : 'ADD TO BAG'}</span>
        </button>
      </div>

      {/* Lightbox Zoom Modal */}
      {zoomOpen && galleryImages.length > 0 ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090B]/80 p-4">
          <div className="relative w-full max-w-4xl border border-[#E4E4E7] bg-white p-4 sm:p-6">
            <div className="mb-3 flex items-center justify-between border-b border-[#E4E4E7] pb-3">
              <span className="truncate font-mono text-xs font-bold uppercase text-[#09090B]">
                {product.name}
              </span>
              <button
                type="button"
                onClick={() => setZoomOpen(false)}
                aria-label="Close zoom view"
                className="flex h-8 w-8 items-center justify-center border border-[#E4E4E7] bg-white text-[#09090B]"
              >
                <X size={16} weight="regular" />
              </button>
            </div>

            <div className="relative flex aspect-[16/10] items-center justify-center bg-[#F4F4F5] p-6">
              <img
                src={galleryImages[selectedImgIndex]}
                alt={product.name}
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Write a Review Modal */}
      {showReviewModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090B]/60 p-4">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[#09090B] bg-white p-6 sm:p-8">
            <button
              type="button"
              onClick={() => setShowReviewModal(false)}
              aria-label="Close review modal"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center border border-[#E4E4E7] bg-white text-[#09090B]"
            >
              <X size={16} weight="regular" />
            </button>

            <div className="border-b border-[#E4E4E7] pb-4">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#1049EB]">
                VERIFIED FEEDBACK
              </span>
              <h3 className="mt-1 text-lg font-bold text-[#09090B]">
                Review {product.name}
              </h3>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-5 space-y-4 text-xs">
              <div>
                <span className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                  OVERALL RATING *
                </span>
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
                            : 'text-[#E4E4E7]'
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-mono text-xs font-bold text-[#09090B]">
                    {hoverRating || reviewRatingInput} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                  YOUR NAME *
                </label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Full name"
                  className="w-full border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] focus:border-[#09090B] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                  EMAIL ADDRESS (OPTIONAL)
                </label>
                <input
                  type="email"
                  value={reviewerEmail}
                  onChange={(e) => setReviewerEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] focus:border-[#09090B] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                  HEADLINE (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summary of your experience"
                  className="w-full border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] focus:border-[#09090B] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                  DETAILED REVIEW *
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share product quality, packaging, or delivery details..."
                  className="w-full border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] focus:border-[#09090B] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="border border-[#E4E4E7] bg-white px-4 py-2.5 font-mono text-xs font-semibold uppercase text-[#09090B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#09090B] px-5 py-2.5 font-mono text-xs font-semibold uppercase text-white hover:bg-[#1049EB]"
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
