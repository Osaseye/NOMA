import { ArrowRight, Clock, Tag } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/commerce/ProductCard'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useAdminStore } from '../../store/adminStore'
import { useProductStore } from '../../store/productStore'

function computeCountdown(endTimestamp?: number) {
  const now = Date.now()
  let target = typeof endTimestamp === 'number' && endTimestamp > now ? endTimestamp : 0

  if (!target) {
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)
    target = endOfDay.getTime()
  }

  const diff = Math.max(0, target - now)
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { h, m, s }
}

function useDealsCountdown(endTimestamp?: number) {
  const [time, setTime] = useState(() => computeCountdown(endTimestamp))

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(computeCountdown(endTimestamp))
    }, 1000)
    return () => window.clearInterval(id)
  }, [endTimestamp])

  return time
}

export function TodaysBestDeals() {
  const { products } = useProductStore()
  const { settings } = useAdminStore()
  const { h, m, s } = useDealsCountdown(settings.todaysDealsEndTimestamp)

  const selectedDeals = products.filter((p) => settings.todaysDealsProductIds.includes(p.id))
  const discountedFallback = products.filter(
    (p) => p.compareAtPrice && p.compareAtPrice > p.finalPrice,
  )
  const displayDeals = (
    selectedDeals.length > 0
      ? selectedDeals
      : discountedFallback.length > 0
        ? discountedFallback
        : products
  ).slice(0, 4)

  return (
    <section>
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Today&apos;s Best Deals
          </h2>

          {/* Clean Borderless Brand Countdown (Zero Colored Container) */}
          <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="h-2 w-2 rounded-full bg-[#FEB719]" />
            <Clock size={15} weight="regular" className="text-[#1049EB]" />
            <span>Ends in</span>
            <span className="font-bold tabular-nums text-[#1049EB]">
              {String(h).padStart(2, '0')}h : {String(m).padStart(2, '0')}m :{' '}
              {String(s).padStart(2, '0')}s
            </span>
          </div>
        </div>

        {displayDeals.length === 0 ? (
          <EmptyState
            icon={<Tag size={24} weight="regular" />}
            title="No deals active right now"
            detail="Check back soon for new price drops."
            action={
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              >
                <span>Browse Catalog</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {displayDeals.map((deal) => (
              <ProductCard key={deal.id} product={deal} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
