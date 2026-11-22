import { ArrowRight, Sparkle } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/commerce/ProductCard'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useAdminStore } from '../../store/adminStore'
import { useProductStore } from '../../store/productStore'

function getTimeLeft(endTimestamp?: number) {
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
  return { h, m, s, expired: diff <= 0 }
}

function useCountdown(endTimestamp?: number) {
  const [time, setTime] = useState(() => getTimeLeft(endTimestamp))

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(getTimeLeft(endTimestamp))
    }, 1000)
    return () => window.clearInterval(id)
  }, [endTimestamp])

  return time
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white font-mono text-lg font-bold text-[#0B1220] md:h-12 md:w-12 md:text-xl">
        {String(value).padStart(2, '0')}
      </div>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#5E6675]">
        {label}
      </span>
    </div>
  )
}

export function FlashDeals() {
  const { settings } = useAdminStore()
  const { products } = useProductStore()
  const { h, m, s, expired } = useCountdown(settings.todaysDealsEndTimestamp)

  const dealProducts = (settings.todaysDealsProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  const displayDeals =
    dealProducts.length > 0
      ? dealProducts
      : products
          .filter(
            (p) =>
              (p.compareAtPrice && p.compareAtPrice > p.finalPrice) || Boolean(p.discountBadge)
          )
          .slice(0, 4)

  return (
    <section className="border-y border-[#E5E7EB] bg-[#F6F7F9] py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-6 border-b border-[#E5E7EB] pb-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1049EB]">
              <Sparkle size={14} weight="fill" className="text-[#FEB719]" />
              <span>{expired ? 'Refreshing soon' : 'Limited-time offers'}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0B1220] md:text-[1.75rem]">
              Flash Deals
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Digit value={h} label="hrs" />
            <span className="mb-4 font-mono text-xl font-bold text-[#5E6675]">:</span>
            <Digit value={m} label="min" />
            <span className="mb-4 font-mono text-xl font-bold text-[#5E6675]">:</span>
            <Digit value={s} label="sec" />
          </div>
        </div>

        {displayDeals.length === 0 ? (
          <EmptyState
            title="No active flash deals right now"
            detail="Featured price drops will appear here once scheduled by the store team."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {displayDeals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 rounded-[6px] bg-[#0B1220] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1049EB]"
          >
            <span>View All Deals</span>
            <ArrowRight size={14} weight="regular" />
          </Link>
        </div>
      </div>
    </section>
  )
}
