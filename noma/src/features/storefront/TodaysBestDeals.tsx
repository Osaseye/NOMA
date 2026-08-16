import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatNaira } from '../../utils/pricing'
import { FaShoppingBag } from 'react-icons/fa'
import { HiOutlineClock, HiTag } from 'react-icons/hi2'
import { useProductStore } from '../../store/productStore'
import { useAdminStore } from '../../store/adminStore'
import { useCartStore } from '../../store/cartStore'

function useCountdown() {
  const getTimeLeft = () => {
    const now = new Date()
    const midnight = new Date()
    midnight.setHours(23, 59, 59, 999)
    const diff = midnight.getTime() - now.getTime()
    const h = Math.max(0, Math.floor(diff / 3600000))
    const m = Math.max(0, Math.floor((diff % 3600000) / 60000))
    const s = Math.max(0, Math.floor((diff % 60000) / 1000))
    return { h, m, s }
  }
  const [time, setTime] = useState(getTimeLeft())
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

export function TodaysBestDeals() {
  const { h, m, s } = useCountdown()
  const { products } = useProductStore()
  const { settings } = useAdminStore()
  const addItem = useCartStore((state) => state.addItem)

  // Filter deal products selected in Admin Site Settings
  const dealProducts = products.filter((p) => settings.todaysDealsProductIds.includes(p.id))
  const displayDeals = dealProducts.length > 0 ? dealProducts : products.slice(0, 4)

  return (
    <section className="bg-[#F7F8FA] py-10 md:py-14 border-t border-black/5 font-['Outfit',sans-serif]">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Header Block */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-red-600">
                LIMITED QUANTITY OFFERS
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[#12203D] md:text-[32px]">
              Today's Best Deals
            </h2>
            <p className="mt-0.5 text-xs font-medium text-[#526484] md:text-sm">
              Hand-picked discounts on essential home electronics & appliances
            </p>
          </div>

          {/* Countdown timer with red accents */}
          <div className="flex items-center gap-2.5 rounded-2xl bg-white border border-red-100 px-4 py-2 shadow-xs">
            <HiOutlineClock className="text-lg text-red-600" />
            <span className="text-[11px] font-extrabold text-[#12203D]/70 uppercase tracking-wider">
              Ends In:
            </span>
            <div className="flex items-center gap-1 font-mono text-sm font-extrabold text-[#12203D]">
              <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-md border border-red-100">
                {String(h).padStart(2, '0')}h
              </span>
              <span className="text-red-600">:</span>
              <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-md border border-red-100">
                {String(m).padStart(2, '0')}m
              </span>
              <span className="text-red-600">:</span>
              <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-md border border-red-100">
                {String(s).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Deals Cards Grid or Empty State */}
        {displayDeals.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-red-200 bg-white p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-1">
              <HiTag size={28} />
            </div>
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black uppercase text-red-700 tracking-wider">
              Flash Deals Coming Soon
            </span>
            <h3 className="font-bold text-base text-[#12203D]">No Flash Deals Active Right Now</h3>
            <p className="text-xs text-slate-500 max-w-md">
              Special daily deal price drops are being scheduled by the store team. Check back soon for discount offers!
            </p>
            <Link
              to="/catalog"
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#2F5FE3] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#254ec4]"
            >
              Browse Full Product Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
            {displayDeals.map((deal) => (
              <Link
                key={deal.id}
                to={`/product/${deal.slug}`}
                className="group relative flex flex-col justify-between rounded-3xl border border-black/5 bg-white p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md md:p-5"
              >
                {/* Discount Tag */}
                {deal.discountBadge && (
                  <div className="absolute top-3 left-3 z-10 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-black text-white uppercase tracking-wider shadow-xs">
                    {deal.discountBadge}
                  </div>
                )}

                {/* Product Image */}
                <div className="mb-4 h-36 w-full rounded-2xl bg-slate-50 border p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col gap-2">
                  <span className="line-clamp-2 text-xs font-bold leading-snug text-[#12203D] md:text-[14px]">
                    {deal.name}
                  </span>

                  <div className="flex items-end justify-between gap-2 mt-1">
                    <div className="flex flex-col">
                      <span className="text-[15px] font-black text-[#12203D] md:text-base">
                        {formatNaira(deal.finalPrice)}
                      </span>
                      {deal.basePrice > deal.finalPrice && (
                        <span className="text-xs font-medium text-[#12203D]/40 line-through">
                          {formatNaira(deal.basePrice)}
                        </span>
                      )}
                    </div>

                    <button
                      aria-label={`Add ${deal.name} to cart`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2F5FE3] transition-colors hover:bg-red-600 hover:text-white"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        addItem(deal)
                      }}
                    >
                      <FaShoppingBag className="text-xs" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
