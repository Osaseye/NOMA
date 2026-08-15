// TodaysBestDeals.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder'
import { formatNaira } from '../../utils/pricing'
import { FaShoppingBag } from 'react-icons/fa'
import { HiOutlineClock } from 'react-icons/hi2'

const deals = [
  {
    id: 'd1',
    name: 'Sumec Firman 2.5KVA Generator',
    originalPrice: 380000,
    dealPrice: 320000,
    slug: 'sumec-firman-generator',
    discount: '-15%',
  },
  {
    id: 'd2',
    name: 'Xiaomi Smart Air Fryer 5L',
    originalPrice: 120000,
    dealPrice: 95000,
    slug: 'xiaomi-smart-air-fryer',
    discount: '-20%',
  },
  {
    id: 'd3',
    name: 'Nonstick Cookware Set 12-Piece',
    originalPrice: 88000,
    dealPrice: 72000,
    slug: 'non-stick-cookware-set',
    discount: '-18%',
  },
  {
    id: 'd4',
    name: 'Hisense 2-Door Refrigerator',
    originalPrice: 410000,
    dealPrice: 350000,
    slug: 'hisense-2-door-fridge',
    discount: '-14%',
  },
]

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

  return (
    <section className="bg-[#F7F8FA] py-10 md:py-14 border-t border-black/5">
      <div className="w-full px-4 md:px-8 lg:px-12">
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
            <h2 className="font-['Outfit'] text-2xl font-black tracking-tight text-[#12203D] md:text-[32px]">
              Today's Best Deals
            </h2>
            <p className="mt-0.5 text-xs font-medium text-[#12203D]/60 md:text-sm">
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

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
          {deals.map((deal) => (
            <Link
              key={deal.id}
              to={`/product/${deal.slug}`}
              className="group relative flex flex-col justify-between rounded-3xl border border-black/5 bg-white p-4 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.12)] md:p-5"
            >
              {/* Discount Tag - Red Accent */}
              <div className="absolute top-3 left-3 z-10 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-black text-white uppercase tracking-wider shadow-xs">
                {deal.discount}
              </div>

              {/* Placeholder image */}
              <div className="mb-4 pt-4">
                <ImagePlaceholder
                  label="Deal Product"
                  variant="skeleton"
                  aspectRatio="aspect-square"
                  className="rounded-2xl"
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
                      {formatNaira(deal.dealPrice)}
                    </span>
                    <span className="text-xs font-medium text-[#12203D]/40 line-through">
                      {formatNaira(deal.originalPrice)}
                    </span>
                  </div>

                  <button
                    aria-label={`Add ${deal.name} to cart`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2F5FE3] transition-colors hover:bg-red-600 hover:text-white md:h-9 md:w-9"
                    onClick={(e) => e.preventDefault()}
                  >
                    <FaShoppingBag className="text-xs" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
