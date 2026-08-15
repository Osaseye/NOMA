// CartPage.tsx - Overhauled to match cart.png 100%
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus,
  ShieldCheck,
  Trash2,
  Truck,
  Clock,
  RotateCcw,
  Lock,
  Tag,
  ArrowLeft,
} from 'lucide-react'
import { toast } from 'sonner'
import { products } from '../../mock/commerce'
import { useCartStore } from '../../store/cartStore'
import { formatNaira } from '../../utils/pricing'
import type { Product } from '../../types/commerce'

// Sample fallback cart products matching cart.png design
const sampleCartProducts: (Product & { subSpecs: string })[] = [
  {
    id: 'c1',
    name: 'Samsung 55" 4K UHD Smart TV',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
    finalPrice: 185000,
    basePrice: 230000,
    category: 'electronics',
    slug: 'samsung-55-4k-uhd-smart-tv',
    subSpecs: '55 inch | 4K UHD | Smart TV',
    stockQty: 10,
    rating: 4.8,
    badge: 'Popular',
    description: 'Samsung Smart TV',
    specs: ['4K UHD', 'Smart TV'],
  },
  {
    id: 'c2',
    name: 'Samsung Soundbar HW-T400',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
    finalPrice: 65000,
    basePrice: 75000,
    category: 'electronics',
    slug: 'samsung-soundbar-hw-t400',
    subSpecs: '2.1 Channel | 150W',
    stockQty: 10,
    rating: 4.6,
    badge: 'Best Value',
    description: 'Samsung Soundbar',
    specs: ['2.1 Channel'],
  },
  {
    id: 'c3',
    name: 'LG XBOOM RN5 Party Speaker',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    finalPrice: 120000,
    basePrice: 140000,
    category: 'electronics',
    slug: 'lg-xboom-rn5-party-speaker',
    subSpecs: '500W | Bluetooth | USB',
    stockQty: 10,
    rating: 4.7,
    badge: 'Hot Seller',
    description: 'LG Party Speaker',
    specs: ['500W', 'Bluetooth'],
  },
]

// Recommended items matching cart.png bottom carousel
const recommendedProducts = [
  {
    id: 'rec1',
    name: 'Universal TV Wall Mount 32" – 65"',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80',
    price: 8500,
    rating: 4.6,
    reviews: 210,
  },
  {
    id: 'rec2',
    name: 'UGREEN HDMI Cable 2.0 (2M)',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    price: 6500,
    rating: 4.7,
    reviews: 148,
  },
  {
    id: 'rec3',
    name: 'Oraimo Power Strip 4 Outlets',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80',
    price: 9500,
    rating: 4.8,
    reviews: 96,
  },
  {
    id: 'rec4',
    name: 'Amazon Fire TV Stick 4K Max',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80',
    price: 48000,
    rating: 4.6,
    reviews: 312,
  },
  {
    id: 'rec5',
    name: 'Screen Cleaner Kit',
    image: 'https://images.unsplash.com/photo-1585336261026-875a60a1c92f?auto=format&fit=crop&w=400&q=80',
    price: 3000,
    rating: 4.5,
    reviews: 78,
  },
]

export function CartPage() {
  const navigate = useNavigate()
  const { items, addItem, removeItem } = useCartStore()
  const [deliveryLocation, setDeliveryLocation] = useState('Ibadan, Oyo State')
  const [changingLocation, setChangingLocation] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [showPromoInput, setShowPromoInput] = useState(false)

  // Map real store cart items or use sample items if store is empty
  const storeProductsInCart = products.filter((p) => items[p.id])
  const activeCartList =
    storeProductsInCart.length > 0
      ? storeProductsInCart.map((p) => ({
          ...p,
          subSpecs: `${p.category} | Premium Quality`,
          qty: items[p.id],
        }))
      : sampleCartProducts.map((p) => ({
          ...p,
          qty: items[p.id] || 1,
        }))

  const itemCount = activeCartList.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = activeCartList.reduce((sum, item) => sum + item.finalPrice * item.qty, 0)
  const deliveryFee = 3500
  const grandTotal = subtotal + deliveryFee

  const handleUpdateQuantity = (productId: string, delta: number) => {
    if (delta > 0) {
      addItem(productId)
    } else {
      removeItem(productId)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-['Outfit',sans-serif] text-[#12203D] selection:bg-[#2F5FE3] selection:text-white pb-24 pt-3 md:pt-5">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 lg:px-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-gray-500">
          <Link to="/" className="hover:text-[#2F5FE3] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="font-bold text-[#12203D]">Cart</span>
        </nav>

        {/* Page Title & Header Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200/60 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#12203D] sm:text-4xl">
              Your Cart ({itemCount})
            </h1>
            <p className="mt-1 text-xs md:text-sm font-medium text-gray-500">
              Review your items and proceed to checkout
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-4 py-2 text-xs font-bold text-[#2F5FE3]">
            <ShieldCheck size={16} className="text-[#2F5FE3]" />
            <span>Your data is safe and secure</span>
          </div>
        </div>

        {/* Main 2-Column Grid Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start mb-16">
          {/* Left Column: Cart Items List + Delivery Location Strip */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* White Container Card for Cart Items */}
            <div className="rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 shadow-xs divide-y divide-gray-100">
              {activeCartList.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5 first:pt-0 last:pb-0"
                >
                  {/* Left: Product Thumbnail & Meta */}
                  <div className="flex items-center gap-4 flex-1">
                    <Link
                      to={`/product/${item.slug || item.id}`}
                      className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-2"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </Link>

                    <div className="flex flex-col gap-1">
                      <Link
                        to={`/product/${item.slug || item.id}`}
                        className="text-sm sm:text-base font-extrabold text-[#12203D] hover:text-[#2F5FE3] transition-colors leading-snug"
                      >
                        {item.name}
                      </Link>
                      <span className="text-xs font-medium text-gray-400">
                        {item.subSpecs}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> In stock
                      </span>
                    </div>
                  </div>

                  {/* Right: Price, Quantity Selector, Subtotal & Trash */}
                  <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    {/* Unit Price (Desktop) */}
                    <div className="hidden md:flex flex-col text-right">
                      <span className="text-sm font-extrabold text-[#12203D]">
                        {formatNaira(item.finalPrice)}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-2xs">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="p-2 text-gray-500 hover:text-[#12203D] active:scale-95 transition-transform"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs font-extrabold text-[#12203D]">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="p-2 text-gray-500 hover:text-[#12203D] active:scale-95 transition-transform"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Total Price for line item */}
                    <div className="flex flex-col text-right">
                      <span className="text-sm sm:text-base font-extrabold text-[#12203D]">
                        {formatNaira(item.finalPrice * item.qty)}
                      </span>
                    </div>

                    {/* Delete Icon */}
                    <button
                      onClick={() => {
                        for (let i = 0; i < item.qty; i++) removeItem(item.id)
                        toast.info(`Removed ${item.name} from cart`)
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Location Strip below cart items (Matching cart.png) */}
            <div className="rounded-2xl border border-blue-100 bg-[#F0F4FF] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#12203D]">
                <Truck size={16} className="text-[#2F5FE3]" />
                <span>Deliver to {deliveryLocation}</span>
              </div>
              <button
                onClick={() => setChangingLocation(!changingLocation)}
                className="text-xs font-bold text-[#2F5FE3] hover:underline"
              >
                Change location
              </button>
            </div>

            {changingLocation && (
              <div className="flex gap-2 p-3 rounded-2xl bg-white border border-gray-200">
                <input
                  type="text"
                  defaultValue={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="Enter city, state..."
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs outline-none focus:border-[#2F5FE3]"
                />
                <button
                  onClick={() => setChangingLocation(false)}
                  className="rounded-xl bg-[#2F5FE3] px-4 py-2 text-xs font-bold text-white"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary Card + Trust Values Card */}
          <div className="lg:col-span-5 flex flex-col gap-5 sticky top-24">
            {/* Order Summary Card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-xl font-extrabold text-[#12203D]">Order Summary</h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-gray-600 font-medium">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-extrabold text-[#12203D]">{formatNaira(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-gray-600 font-medium">
                  <span>Delivery fee</span>
                  <span className="font-extrabold text-[#12203D]">{formatNaira(deliveryFee)}</span>
                </div>

                {/* Promo Code Link / Input */}
                {!showPromoInput ? (
                  <button
                    onClick={() => setShowPromoInput(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#2F5FE3] hover:underline pt-1"
                  >
                    <Tag size={14} />
                    <span>Have a promo code?</span>
                  </button>
                ) : (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs outline-none uppercase"
                    />
                    <button
                      onClick={() => {
                        toast.success('Promo code applied!')
                        setShowPromoInput(false)
                      }}
                      className="rounded-xl bg-[#12203D] px-3 py-1.5 text-xs font-bold text-white"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-extrabold text-[#12203D]">Total</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#12203D]">
                    {formatNaira(grandTotal)}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-gray-400">All prices are inclusive of taxes</p>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => navigate('/checkout')}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2F5FE3] py-4 text-sm font-extrabold text-white shadow-xs hover:bg-[#254ec4] active:scale-[0.99] transition-all"
                >
                  <Lock size={16} />
                  <span>Proceed to Checkout</span>
                </button>

                <button
                  onClick={() => navigate('/catalog')}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#2F5FE3] bg-white py-3.5 text-sm font-extrabold text-[#2F5FE3] shadow-2xs hover:bg-blue-50/50 active:scale-[0.99] transition-all"
                >
                  <ArrowLeft size={16} />
                  <span>Continue Shopping</span>
                </button>
              </div>
            </div>

            {/* Trust Values Container Card (Matching cart.png right card) */}
            <div className="rounded-2xl border border-blue-100/60 bg-[#F6F8FD] p-5 space-y-3 text-xs font-medium text-gray-700">
              <div className="flex items-center gap-3">
                <Truck size={16} className="text-[#2F5FE3] shrink-0" />
                <span>Delivery fee confirmed before you pay</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-[#2F5FE3] shrink-0" />
                <span>2 – 5 business days delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw size={16} className="text-[#2F5FE3] shrink-0" />
                <span>Easy 30-day returns</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-[#2F5FE3] shrink-0" />
                <span>Pay safely with Noma</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Recommendations Section: "You might also like" (Matching cart.png) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#12203D]">You might also like</h2>
            <div className="flex items-center gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-2xs hover:border-[#2F5FE3] hover:text-[#2F5FE3]">
                <ChevronLeft size={18} />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-2xs hover:border-[#2F5FE3] hover:text-[#2F5FE3]">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {recommendedProducts.map((rec) => (
              <div
                key={rec.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-3.5 shadow-2xs hover:border-gray-200 hover:shadow-md transition-all"
              >
                {/* Product Image */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 p-2">
                  <img
                    src={rec.image}
                    alt={rec.name}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="mt-3 flex flex-col gap-1">
                  <h3 className="text-xs font-bold text-[#12203D] line-clamp-2">
                    {rec.name}
                  </h3>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 mt-1">
                    <span className="text-amber-400">★</span>
                    <span className="font-bold text-[#12203D]">{rec.rating}</span>
                    <span>({rec.reviews})</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#12203D]">
                      {formatNaira(rec.price)}
                    </span>
                    <button
                      onClick={() => {
                        addItem(rec.id)
                        toast.success(`Added ${rec.name} to cart`)
                      }}
                      className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50/60 px-2.5 py-1 text-xs font-bold text-[#2F5FE3] hover:bg-[#2F5FE3] hover:text-white transition-colors"
                    >
                      <Plus size={12} strokeWidth={2.5} />
                      <span>Add</span>
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
