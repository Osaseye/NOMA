import { ArrowRight, Clock, ShoppingBag, Star, Tag } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ProductCard } from '../../components/commerce/ProductCard'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useAdminStore } from '../../store/adminStore'
import { useCartStore } from '../../store/cartStore'
import { useProductStore } from '../../store/productStore'
import type { Product } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

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

function getDiscountInfo(product: Product) {
  const hasCompare = Boolean(product.compareAtPrice && product.compareAtPrice > product.finalPrice)
  const compareAt = hasCompare && product.compareAtPrice ? product.compareAtPrice : 0
  const pct =
    hasCompare && compareAt > 0
      ? Math.round(((compareAt - product.finalPrice) / compareAt) * 100)
      : 0
  return { hasCompare, compareAt, pct }
}

export function TodaysBestDeals() {
  const navigate = useNavigate()
  const { products } = useProductStore()
  const { settings } = useAdminStore()
  const addItem = useCartStore((state) => state.addItem)
  const { h, m, s } = useDealsCountdown(settings.todaysDealsEndTimestamp)

  const selectedDeals = products.filter((p) => settings.todaysDealsProductIds.includes(p.id))
  const discountedFallback = products.filter(
    (p) => p.compareAtPrice && p.compareAtPrice > p.finalPrice
  )
  const displayDeals =
    selectedDeals.length > 0
      ? selectedDeals
      : discountedFallback.length > 0
        ? discountedFallback.slice(0, 4)
        : products.slice(0, 4)

  const handleDealAdd = (deal: Product, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (deal.stockQty <= 0) return

    if (deal.sizes && deal.sizes.length > 0) {
      toast.info('Select a size option to add to cart')
      navigate(`/product/${deal.slug || deal.id}`)
      return
    }

    addItem(deal.id)
    toast.success(`${deal.name} added to cart`)
  }

  const useSpotlightLayout = displayDeals.length >= 4
  const leadDeal = useSpotlightLayout ? displayDeals[0] : null
  const secondaryDeals = useSpotlightLayout ? displayDeals.slice(1, 4) : []
  const extraDeals = useSpotlightLayout ? displayDeals.slice(4) : []

  return (
    <section className="border-b border-[#E5E7EB] bg-[#F6F7F9] py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Header Row with Eyebrow 2 + Tabular Mono Countdown */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            {/* Eyebrow 2 (Static amber dot, zero animate-ping) */}
            <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0B1220]">
              <span className="h-2 w-2 rounded-[2px] bg-[#FEB719]" />
              <span>DAILY PRICE DROPS</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0B1220] md:text-[1.75rem]">
              Today&apos;s Best Deals
            </h2>
          </div>

          {/* JetBrains Mono Countdown */}
          <div className="flex items-center gap-2.5 rounded-[8px] border border-[#E5E7EB] bg-white px-3.5 py-2">
            <Clock size={16} weight="regular" className="text-[#B45309]" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5E6675]">
              Ends in
            </span>
            <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#0B1220] sm:text-sm">
              <span className="rounded-[4px] border border-[#E5E7EB] bg-[#F6F7F9] px-2 py-0.5">
                {String(h).padStart(2, '0')}h
              </span>
              <span className="text-[#5E6675]">:</span>
              <span className="rounded-[4px] border border-[#E5E7EB] bg-[#F6F7F9] px-2 py-0.5">
                {String(m).padStart(2, '0')}m
              </span>
              <span className="text-[#5E6675]">:</span>
              <span className="rounded-[4px] border border-[#E5E7EB] bg-[#F6F7F9] px-2 py-0.5">
                {String(s).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Deals Spotlight Matrix or Empty State */}
        {displayDeals.length === 0 ? (
          <EmptyState
            icon={<Tag size={24} weight="regular" />}
            title="No flash deals active right now"
            detail="New daily Naira price drops will appear here once scheduled in store settings."
            action={
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
              >
                <span>Browse Catalog</span>
                <ArrowRight size={14} weight="regular" />
              </Link>
            }
          />
        ) : useSpotlightLayout && leadDeal ? (
          <>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Spotlight Lead Card */}
              {(() => {
                const { hasCompare, compareAt, pct } = getDiscountInfo(leadDeal)
                const outOfStock = leadDeal.stockQty <= 0
                const hasSizes = Boolean(leadDeal.sizes && leadDeal.sizes.length > 0)
                return (
                  <Link
                    to={`/product/${leadDeal.slug || leadDeal.id}`}
                    className="group flex flex-col justify-between rounded-[8px] border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#0B1220]/30 lg:col-span-6"
                  >
                    <div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-[#F6F7F9] p-6">
                        {pct > 0 ? (
                          <span className="absolute left-3 top-3 rounded-[4px] bg-[#B91C1C] px-2 py-0.5 font-mono text-[11px] font-semibold text-white">
                            -{pct}%
                          </span>
                        ) : leadDeal.discountBadge ? (
                          <span className="absolute left-3 top-3 rounded-[4px] bg-[#B91C1C] px-2 py-0.5 text-[11px] font-semibold text-white">
                            {leadDeal.discountBadge}
                          </span>
                        ) : leadDeal.badge ? (
                          <span className="absolute left-3 top-3 rounded-[4px] bg-[#0B1220] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                            {leadDeal.badge}
                          </span>
                        ) : null}

                        <img
                          src={leadDeal.image}
                          alt={leadDeal.name}
                          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-medium uppercase tracking-wider text-[#5E6675]">
                            {leadDeal.brand || leadDeal.category.replace(/-/g, ' ')}
                          </span>
                          <span className="inline-flex items-center gap-1 font-mono font-semibold text-[#0B1220]">
                            <Star size={13} weight="fill" className="text-[#FEB719]" />
                            {(leadDeal.rating || 4.8).toFixed(1)}
                          </span>
                        </div>
                        <h3 className="mt-1.5 text-lg font-bold tracking-tight text-[#0B1220] transition-colors group-hover:text-[#1049EB]">
                          {leadDeal.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5E6675]">
                          {leadDeal.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E7EB] pt-4">
                      <div>
                        <div className="flex items-baseline gap-2.5">
                          <strong className="font-mono text-xl font-bold text-[#0B1220]">
                            {formatNaira(leadDeal.finalPrice)}
                          </strong>
                          {hasCompare ? (
                            <span className="font-mono text-xs text-[#5E6675] line-through">
                              {formatNaira(compareAt)}
                            </span>
                          ) : null}
                        </div>
                        {hasCompare ? (
                          <span className="font-mono text-[11px] font-semibold text-[#15803D]">
                            Save {formatNaira(compareAt - leadDeal.finalPrice)}
                          </span>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        disabled={outOfStock}
                        onClick={(e) => handleDealAdd(leadDeal, e)}
                        className={`inline-flex items-center justify-center gap-2 rounded-[6px] px-4 py-2.5 text-xs font-semibold transition-colors ${
                          outOfStock
                            ? 'cursor-not-allowed border border-[#E5E7EB] bg-[#F6F7F9] text-[#5E6675]'
                            : 'bg-[#0B1220] text-white hover:bg-[#1049EB]'
                        }`}
                      >
                        <ShoppingBag size={15} weight="regular" />
                        <span>
                          {outOfStock ? 'Unavailable' : hasSizes ? 'Select Option' : 'Add to Cart'}
                        </span>
                      </button>
                    </div>
                  </Link>
                )
              })()}

              {/* Right Column: 3 Compact Stacked Deal Rows */}
              <div className="flex flex-col justify-between gap-4 lg:col-span-6">
                {secondaryDeals.map((deal) => {
                  const { hasCompare, compareAt, pct } = getDiscountInfo(deal)
                  const outOfStock = deal.stockQty <= 0
                  const hasSizes = Boolean(deal.sizes && deal.sizes.length > 0)
                  return (
                    <Link
                      key={deal.id}
                      to={`/product/${deal.slug || deal.id}`}
                      className="group flex flex-1 items-center gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-4 transition-colors hover:border-[#0B1220]/30"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[6px] bg-[#F6F7F9] p-2 sm:h-28 sm:w-28">
                        {pct > 0 ? (
                          <span className="absolute left-1.5 top-1.5 rounded-[4px] bg-[#B91C1C] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
                            -{pct}%
                          </span>
                        ) : deal.discountBadge ? (
                          <span className="absolute left-1.5 top-1.5 rounded-[4px] bg-[#B91C1C] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            {deal.discountBadge}
                          </span>
                        ) : null}
                        <img
                          src={deal.image}
                          alt={deal.name}
                          loading="lazy"
                          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-[11px] font-medium uppercase tracking-wider text-[#5E6675]">
                              {deal.brand || deal.category.replace(/-/g, ' ')}
                            </span>
                            <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] font-semibold text-[#0B1220]">
                              <Star size={12} weight="fill" className="text-[#FEB719]" />
                              {(deal.rating || 4.8).toFixed(1)}
                            </span>
                          </div>
                          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-[#0B1220] transition-colors group-hover:text-[#1049EB]">
                            {deal.name}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-baseline gap-2">
                            <strong className="font-mono text-sm font-bold text-[#0B1220] sm:text-base">
                              {formatNaira(deal.finalPrice)}
                            </strong>
                            {hasCompare ? (
                              <span className="font-mono text-xs text-[#5E6675] line-through">
                                {formatNaira(compareAt)}
                              </span>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            disabled={outOfStock}
                            onClick={(e) => handleDealAdd(deal, e)}
                            className={`inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs font-semibold transition-colors ${
                              outOfStock
                                ? 'cursor-not-allowed border border-[#E5E7EB] bg-[#F6F7F9] text-[#5E6675]'
                                : 'bg-[#0B1220] text-white hover:bg-[#1049EB]'
                            }`}
                          >
                            <ShoppingBag size={13} weight="regular" />
                            <span>{outOfStock ? 'Unavailable' : hasSizes ? 'Option' : 'Add'}</span>
                          </button>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {extraDeals.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {extraDeals.map((deal) => (
                  <ProductCard key={deal.id} product={deal} />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayDeals.map((deal) => (
              <ProductCard key={deal.id} product={deal} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
