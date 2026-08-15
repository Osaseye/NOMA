import {
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Lock,
  Minus,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Tv,
  Volume2,
  Wifi,
} from 'lucide-react'
import { HiOutlineShoppingBag } from 'react-icons/hi2'
import { useState, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import type { Product } from '../../types/commerce'
import { useUserStore } from '../../store/userStore'
import { useCartStore } from '../../store/cartStore'
import { products } from '../../mock/commerce'
import { formatNaira } from '../../utils/pricing'

interface ProductDetailProps {
  product: Product
  onAddToCart: () => void
}

export function ProductDetail({ product, onAddToCart }: ProductDetailProps) {
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const { toggleWishlist, isInWishlist } = useUserStore()
  const wishlisted = isInWishlist(product.id)

  const [quantity, setQuantity] = useState(1)
  const [selectedImgIndex, setSelectedImgIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'delivery' | 'reviews' | 'qa'>('overview')
  const [deliveryLocation, setDeliveryLocation] = useState('Ibadan, Oyo State')
  const [changingLocation, setChangingLocation] = useState(false)

  // Touch Swipe tracking for mobile carousel
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  // Multi-angle product images gallery
  const galleryImages = [
    product.image,
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
  ]

  // Suggested / Related products matching details.png
  const relatedProducts = useMemo(() => {
    return products.filter((p) => p.id !== product.id).slice(0, 5)
  }, [product.id])

  const savingsAmount = product.basePrice && product.basePrice > product.finalPrice
    ? product.basePrice - product.finalPrice
    : 0

  const handleBuyNow = () => {
    onAddToCart()
    navigate('/checkout')
  }

  const handleToggleWishlist = () => {
    toggleWishlist(product.id)
    toast.success(!wishlisted ? 'Added to wishlist' : 'Removed from wishlist')
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 40
    const isRightSwipe = distance < -40

    if (isLeftSwipe) {
      setSelectedImgIndex((prev) => (prev + 1) % galleryImages.length)
    } else if (isRightSwipe) {
      setSelectedImgIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-['Outfit',sans-serif] text-[#12203D] selection:bg-[#2F5FE3] selection:text-white pb-24 pt-2 md:pt-4">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-2 md:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
          <Link to="/" className="hover:text-[#2F5FE3] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-gray-400" />
          <Link to="/catalog" className="hover:text-[#2F5FE3] capitalize transition-colors">
            {product.category}
          </Link>
          <ChevronRight size={12} className="text-gray-400" />
          <Link to={`/category/${product.category}`} className="hover:text-[#2F5FE3] transition-colors">
            {product.category === 'electronics' ? 'TVs' : 'Items'}
          </Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="font-semibold text-[#12203D] truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Top Main Grid: Left Gallery + Right Product Info */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start mb-12">
          {/* Left: Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-3 md:flex-row">
            {/* Desktop Left Thumbnails Column */}
            <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`relative aspect-square w-full overflow-hidden rounded-xl border-2 bg-white p-1.5 transition-all ${
                    selectedImgIndex === idx
                      ? 'border-[#2F5FE3] shadow-xs'
                      : 'border-gray-200/80 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
              <button className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-gray-300 bg-white py-2 text-[10px] font-bold text-gray-500 hover:border-[#2F5FE3] hover:text-[#2F5FE3]">
                <span>↓ View more</span>
              </button>
            </div>

            {/* Main Showcase Box with Touch Carousel Support */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative flex-1 aspect-[4/3] w-full overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-xs flex items-center justify-center select-none"
            >
              {/* Discount Badge */}
              {product.discountBadge && (
                <div className="absolute left-4 top-4 z-10 rounded-lg bg-[#E53E3E] px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-2xs">
                  {product.discountBadge} OFF
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                className="absolute right-4 top-4 z-10 rounded-full border border-gray-200 bg-white/90 p-2.5 text-gray-500 shadow-2xs hover:bg-white hover:text-red-500 transition-colors"
                aria-label="Save to Wishlist"
              >
                <Heart size={20} className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
              </button>

              {/* Mobile Left / Right Quick Chevron Controls */}
              <button
                onClick={() => setSelectedImgIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-xs md:hidden"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setSelectedImgIndex((prev) => (prev + 1) % galleryImages.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-xs md:hidden"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>

              {/* Product Main Display Image */}
              <img
                src={galleryImages[selectedImgIndex]}
                alt={product.name}
                className="h-full w-full object-contain transition-all duration-300"
              />

              {/* Tap to zoom button (Desktop) */}
              <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 items-center gap-1.5 rounded-full border border-gray-200/80 bg-white/90 backdrop-blur-xs px-4 py-1.5 text-xs font-bold text-gray-700 shadow-2xs">
                <Search size={14} className="text-gray-500" />
                <span>Tap to zoom</span>
              </div>

              {/* Mobile Carousel Dots (Overlaying AT THE BOTTOM OF THE IMAGE CONTAINER) */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 md:hidden z-20">
                {galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      selectedImgIndex === idx ? 'w-6 bg-[#2F5FE3]' : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product Meta, Delivery Card, Buy Actions */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Best Seller Badge (Sparkles instead of Zap) */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F5FE3] px-3 py-1 text-xs font-bold text-white shadow-2xs">
                <Sparkles size={13} className="text-white" /> Best Seller
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-extrabold tracking-tight text-[#12203D] sm:text-3xl lg:text-4xl leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Sales count */}
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <div className="flex items-center gap-1 text-amber-400">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span className="font-extrabold text-[#12203D] text-sm">{product.rating ?? 4.8}</span>
              </div>
              <span>({product.reviewsCount ?? 124} reviews)</span>
              <span className="text-gray-300">|</span>
              <span className="font-medium text-gray-600">125 sold this month</span>
            </div>

            {/* Price Block */}
            <div className="flex flex-col gap-1 rounded-2xl bg-gray-50/60 p-4 border border-gray-100">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold tracking-tight text-[#12203D]">
                  {formatNaira(product.finalPrice)}
                </span>
                {product.discountBadge && (
                  <span className="rounded-md bg-[#E53E3E] px-2 py-0.5 text-xs font-black text-white">
                    {product.discountBadge}
                  </span>
                )}
              </div>
              {product.basePrice && product.basePrice > product.finalPrice && (
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-400 line-through font-medium">
                    {formatNaira(product.basePrice)}
                  </span>
                  <span className="font-extrabold text-emerald-600">
                    You save {formatNaira(savingsAmount)}
                  </span>
                </div>
              )}

              {/* Stock status & Shipping */}
              <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-gray-600">
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> In stock
                </span>
                <span className="text-gray-300">|</span>
                <span>Ships in 24 - 48 hrs</span>
              </div>
            </div>

            {/* Delivery Location & Fee Section (No border, no background) */}
            <div className="py-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#12203D]">
                  <Truck size={16} className="text-[#2F5FE3]" />
                  <span>Deliver to {deliveryLocation}</span>
                </div>
                <button
                  onClick={() => setChangingLocation(!changingLocation)}
                  className="text-xs font-bold text-[#2F5FE3] hover:underline"
                >
                  Change
                </button>
              </div>

              {changingLocation && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="Enter city, state..."
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-[#2F5FE3]"
                  />
                  <button
                    onClick={() => setChangingLocation(false)}
                    className="rounded-xl bg-[#2F5FE3] px-3 py-1.5 text-xs font-bold text-white"
                  >
                    Save
                  </button>
                </div>
              )}

              <div className="text-xs text-gray-600 space-y-1.5 pl-6">
                <p className="font-medium">
                  Estimated delivery <span className="font-bold text-[#12203D]">May 16 - May 18</span> (2 - 3 business days)
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <ShieldCheck size={15} className="text-gray-400" />
                  <span className="font-medium text-gray-700">Delivery fee:</span>
                  <span className="font-extrabold text-[#12203D]">₦3,500</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Confirmed before payment
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#12203D]">Quantity</span>
                <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-2xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-gray-500 hover:text-[#12203D]"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-[#12203D]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-gray-500 hover:text-[#12203D]"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                <button
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) onAddToCart()
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#2F5FE3] py-3.5 px-6 text-sm font-bold text-white shadow-xs hover:bg-[#254ec4] active:scale-[0.98] transition-all"
                >
                  <HiOutlineShoppingBag className="text-xl stroke-[1.8]" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#2F5FE3] bg-white py-3.5 px-6 text-sm font-bold text-[#2F5FE3] shadow-2xs hover:bg-blue-50/50 active:scale-[0.98] transition-all"
                >
                  <Sparkles size={18} />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* 4 Trust Value Props Icons Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100 text-[11px] font-semibold text-gray-600">
              <div className="flex items-center gap-2">
                <RotateCcw size={16} className="text-[#2F5FE3]" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#2F5FE3]" />
                <span>1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-[#2F5FE3]" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#2F5FE3]" />
                <span>Pay on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Details Tabs */}
        <div className="mb-16 rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-xs">
          {/* Tab Navigation Header */}
          <div className="flex overflow-x-auto border-b border-gray-100 pb-2 scrollbar-none gap-6 md:gap-10">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'specs', label: 'Specifications' },
              { id: 'delivery', label: 'Delivery & Returns' },
              { id: 'reviews', label: `Reviews (${product.reviewsCount ?? 124})` },
              { id: 'qa', label: 'Q&A' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-xs md:text-sm font-bold transition-all whitespace-nowrap relative ${
                  activeTab === tab.id
                    ? 'text-[#2F5FE3]'
                    : 'text-gray-500 hover:text-[#12203D]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#2F5FE3]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview Content */}
          {activeTab === 'overview' && (
            <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12">
              {/* Product Description & Key Icon Highlights */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#12203D]">Product Description</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 font-normal">
                    {product.description ||
                      'Experience stunning picture quality with the Samsung 55" 4K UHD Smart TV. Enjoy vibrant colors, sharp details, and immersive sound that brings your entertainment to life.'}
                  </p>
                </div>

                {/* 5 Feature Highlight Badges (Sparkles icon used) */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/70 p-3 text-center">
                    <Tv size={20} className="text-[#2F5FE3] mb-1.5" />
                    <span className="text-[11px] font-extrabold text-[#12203D]">4K UHD</span>
                    <span className="text-[9px] text-gray-500">Resolution</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/70 p-3 text-center">
                    <Sparkles size={20} className="text-[#2F5FE3] mb-1.5" />
                    <span className="text-[11px] font-extrabold text-[#12203D]">Smart TV</span>
                    <span className="text-[9px] text-gray-500">Tizen OS</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/70 p-3 text-center">
                    <ShieldCheck size={20} className="text-[#2F5FE3] mb-1.5" />
                    <span className="text-[11px] font-extrabold text-[#12203D]">HDR 10+</span>
                    <span className="text-[9px] text-gray-500">High Dynamic</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/70 p-3 text-center">
                    <Wifi size={20} className="text-[#2F5FE3] mb-1.5" />
                    <span className="text-[11px] font-extrabold text-[#12203D]">PurColor</span>
                    <span className="text-[9px] text-gray-500">Vivid Colors</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/70 p-3 text-center">
                    <Volume2 size={20} className="text-[#2F5FE3] mb-1.5" />
                    <span className="text-[11px] font-extrabold text-[#12203D]">Dolby Audio</span>
                    <span className="text-[9px] text-gray-500">Surround</span>
                  </div>
                </div>
              </div>

              {/* What's in the Box List */}
              <div className="md:col-span-5 rounded-2xl bg-[#F8F9FB] p-6 border border-gray-100/80">
                <h4 className="text-sm font-extrabold text-[#12203D]">What's in the Box</h4>
                <ul className="mt-4 space-y-3 text-xs font-semibold text-gray-700">
                  <li className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>Samsung 55" 4K Smart TV</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>Smart Remote Control + Batteries</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>Power Cable & User Manual</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>Table Stand Legs</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Specifications */}
          {activeTab === 'specs' && (
            <div className="mt-8 space-y-4 max-w-2xl">
              <h3 className="text-base font-bold text-[#12203D]">Technical Specifications</h3>
              <div className="divide-y divide-gray-100 text-xs">
                <div className="grid grid-cols-2 py-3">
                  <span className="font-semibold text-gray-500">Brand</span>
                  <span className="font-bold text-[#12203D]">Samsung</span>
                </div>
                <div className="grid grid-cols-2 py-3">
                  <span className="font-semibold text-gray-500">Screen Size</span>
                  <span className="font-bold text-[#12203D]">55 Inches</span>
                </div>
                <div className="grid grid-cols-2 py-3">
                  <span className="font-semibold text-gray-500">Display Tech</span>
                  <span className="font-bold text-[#12203D]">Crystal 4K UHD</span>
                </div>
                <div className="grid grid-cols-2 py-3">
                  <span className="font-semibold text-gray-500">Refresh Rate</span>
                  <span className="font-bold text-[#12203D]">60Hz</span>
                </div>
                <div className="grid grid-cols-2 py-3">
                  <span className="font-semibold text-gray-500">Connectivity</span>
                  <span className="font-bold text-[#12203D]">3 HDMI, 2 USB, Wi-Fi, Bluetooth</span>
                </div>
                <div className="grid grid-cols-2 py-3">
                  <span className="font-semibold text-gray-500">Warranty</span>
                  <span className="font-bold text-[#12203D]">1 Year Official Warranty</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Delivery & Returns */}
          {activeTab === 'delivery' && (
            <div className="mt-8 space-y-4 max-w-2xl text-xs">
              <h3 className="text-base font-bold text-[#12203D]">Delivery Policy</h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Standard delivery takes 2 - 3 business days within major cities. Express same-day delivery is available for select items at checkout.
              </p>
              <h4 className="font-extrabold text-[#12203D] pt-2">Return & Refund Policy</h4>
              <p className="text-gray-600 leading-relaxed font-normal">
                We offer a hassle-free 30-day return policy for unused items in their original packaging. Pay on delivery is available for verified addresses.
              </p>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={20} className="fill-amber-400" />
                  <span className="text-xl font-extrabold text-[#12203D]">4.8</span>
                </div>
                <span className="text-xs font-semibold text-gray-500">Based on {product.reviewsCount ?? 124} customer reviews</span>
              </div>
              <div className="space-y-4 divide-y divide-gray-100">
                <div className="pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#12203D]">Adebayo K.</span>
                    <span className="text-[10px] text-gray-400">2 days ago</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 font-normal">
                    Delivered right on time in Ibadan. Amazing picture clarity and sound!
                  </p>
                </div>
                <div className="pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#12203D]">Grace O.</span>
                    <span className="text-[10px] text-gray-400">1 week ago</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 font-normal">
                    Easy to set up and super fast shipping. Highly recommend Noma store!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Q&A */}
          {activeTab === 'qa' && (
            <div className="mt-8 space-y-4 max-w-2xl text-xs">
              <h3 className="text-base font-bold text-[#12203D]">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="font-extrabold text-[#12203D]">Q: Does it come with a wall mount bracket?</p>
                  <p className="mt-1 text-gray-600 font-normal">A: The box includes the table stand legs. Wall mount brackets can be ordered separately or requested upon delivery.</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="font-extrabold text-[#12203D]">Q: Is pay on delivery supported?</p>
                  <p className="mt-1 text-gray-600 font-normal">A: Yes, pay on delivery is supported for major state capitals across Nigeria.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section: "You might also like" Product Recommendations Carousel */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#12203D]">You might also like</h2>
            <Link
              to="/catalog"
              className="text-xs font-bold text-[#2F5FE3] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {relatedProducts.map((relProduct) => (
              <div
                key={relProduct.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-3.5 shadow-2xs hover:border-gray-200 hover:shadow-md transition-all"
              >
                {/* Product Image */}
                <Link to={`/product/${relProduct.id}`} className="block relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
                  {relProduct.discountBadge && (
                    <span className="absolute left-2 top-2 z-10 rounded bg-[#E53E3E] px-1.5 py-0.5 text-[9px] font-black text-white">
                      {relProduct.discountBadge}
                    </span>
                  )}
                  <img
                    src={relProduct.image}
                    alt={relProduct.name}
                    className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>

                {/* Info */}
                <div className="mt-3 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {relProduct.category}
                  </span>
                  <Link
                    to={`/product/${relProduct.id}`}
                    className="text-xs font-bold text-[#12203D] hover:text-[#2F5FE3] line-clamp-2 transition-colors"
                  >
                    {relProduct.name}
                  </Link>

                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-sm font-black text-[#12203D]">
                      {formatNaira(relProduct.finalPrice)}
                    </span>
                    <button
                      onClick={() => {
                        addItem(relProduct)
                        toast.success(`Added ${relProduct.name} to cart`)
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#2F5FE3] hover:bg-[#2F5FE3] hover:text-white transition-colors"
                      aria-label="Add to cart"
                    >
                      <Plus size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
