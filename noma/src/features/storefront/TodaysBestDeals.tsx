import { ArrowRight, Clock, Plus, Star, Tag } from '@phosphor-icons/react'
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
  const openDrawer = useCartStore((state) => state.openDrawer)
  const { h, m, s } = useDealsCountdown(settings.todaysDealsEndTimestamp)

  const selectedDeals = products.filter((p) => settings.todaysDealsProductIds.includes(p.id))
  const discountedFallback = products.filter(
    (p) => p.compareAtPrice && p.compareAtPrice > p.finalPrice,
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
      toast.info('Select a size option to add to bag')
      navigate(`/product/${deal.slug || deal.id}`)
      return
    }

    addItem(deal.id)
    openDrawer()
  }

  const useSpotlightLayout = displayDeals.length >= 4
  const leadDeal = useSpotlightLayout ? displayDeals[0] : null
  const secondaryDeals = useSpotlightLayout ? displayDeals.slice(1, 4) : []
  const extraDeals = useSpotlightLayout ? displayDeals.slice(4) : []

  return (
    <section className="border-b border-[#E4E4E7] bg-white">
      <div className="mx-auto max-w-[1600px] border-x border-[#E4E4E7]">
        {/* Exposed Architectural Header Row with Tabular Mono Countdown */}
        <div className="flex flex-col justify-between border-b border-[#E4E4E7] sm:flex-row sm:items-stretch">
          <div className="flex items-center gap-4 px-5 py-4 sm:px-8">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#09090B]">
                <span className="h-2 w-2 bg-[#FEB719]" />
                <span>03 / DAILY PRICE DROPS</span>
              </div>
              <h2 className="mt-0.5 text-xl font-bold tracking-tight text-[#09090B] sm:text-2xl">
                Today&apos;s Best Deals
              </h2>
            </div>
          </div>

          {/* JetBrains Mono Countdown Cell */}
          <div className="flex items-center justify-between gap-3 border-t border-[#E4E4E7] bg-[#FAFAFA] px-5 py-3.5 sm:border-l sm:border-t-0 sm:px-8">
            <div className="flex items-center gap-2">
              <Clock size={15} weight="regular" className="text-[#09090B]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
                EXPIRES IN
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-xs font-bold tabular-nums text-[#09090B]">
              <span className="border border-[#E4E4E7] bg-white px-2 py-1">
                {String(h).padStart(2, '0')}H
              </span>
              <span className="text-[#71717A]">:</span>
              <span className="border border-[#E4E4E7] bg-white px-2 py-1">
                {String(m).padStart(2, '0')}M
              </span>
              <span className="text-[#71717A]">:</span>
              <span className="border border-[#E4E4E7] bg-white px-2 py-1 text-[#1049EB]">
                {String(s).padStart(2, '0')}S
              </span>
            </div>
          </div>
        </div>

        {/* Deals Spotlight Exposed 1px Matrix */}
        {displayDeals.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<Tag size={24} weight="regular" />}
              title="No flash deals active right now"
              detail="New daily Naira price drops will appear here once scheduled in store settings."
              action={
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-1.5 bg-[#09090B] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#1049EB]"
                >
                  <span>Browse Catalog</span>
                  <ArrowRight size={14} weight="regular" />
                </Link>
              }
            />
          </div>
        ) : useSpotlightLayout && leadDeal ? (
          <>
            <div className="grid grid-cols-1 gap-px bg-[#E4E4E7] lg:grid-cols-12">
              {/* Spotlight Lead Cell (6 Cols) */}
              {(() => {
                const { hasCompare, compareAt, pct } = getDiscountInfo(leadDeal)
                const outOfStock = leadDeal.stockQty <= 0
                const hasSizes = Boolean(leadDeal.sizes && leadDeal.sizes.length > 0)
                return (
                  <Link
                    to={`/product/${leadDeal.slug || leadDeal.id}`}
                    className="group flex flex-col justify-between bg-white p-6 transition-colors hover:bg-[#FAFAFA] sm:p-8 lg:col-span-6"
                  >
                    <div>
                      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#71717A]">
                        <span>SPOTLIGHT DROP / 01</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-[#09090B]">
                          <Star size={12} weight="fill" className="text-[#FEB719]" />
                          {(leadDeal.rating || 4.8).toFixed(1)}
                        </span>
                      </div>

                      <div className="relative aspect-[4/3] overflow-hidden border border-[#E4E4E7] bg-[#F4F4F5] p-6">
                        {pct > 0 ? (
                          <span className="absolute left-3 top-3 bg-[#FEB719] px-2.5 py-0.5 font-mono text-xs font-bold text-[#09090B]">
                            -{pct}%
                          </span>
                        ) : leadDeal.discountBadge ? (
                          <span className="absolute left-3 top-3 bg-[#FEB719] px-2.5 py-0.5 font-mono text-xs font-bold text-[#09090B]">
                            {leadDeal.discountBadge}
                          </span>
                        ) : null}

                        <img
                          src={leadDeal.image}
                          alt={leadDeal.name}
                          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="mt-5">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#71717A]">
                          {leadDeal.brand || leadDeal.category.replace(/-/g, ' ')}
                        </span>
                        <h3 className="mt-1 text-lg font-bold tracking-tight text-[#09090B] transition-colors group-hover:text-[#1049EB] sm:text-xl">
                          {leadDeal.name}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#52525B]">
                          {leadDeal.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#E4E4E7] pt-4">
                      <div>
                        <div className="flex items-baseline gap-2.5">
                          <strong className="font-mono text-xl font-bold tabular-nums text-[#09090B]">
                            {formatNaira(leadDeal.finalPrice)}
                          </strong>
                          {hasCompare ? (
                            <span className="font-mono text-xs tabular-nums text-[#71717A] line-through">
                              {formatNaira(compareAt)}
                            </span>
                          ) : null}
                        </div>
                        {hasCompare ? (
                          <span className="font-mono text-[11px] font-semibold text-[#16A34A]">
                            SAVE {formatNaira(compareAt - leadDeal.finalPrice)}
                          </span>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        disabled={outOfStock}
                        onClick={(e) => handleDealAdd(leadDeal, e)}
                        className={`inline-flex items-center justify-center gap-2 px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                          outOfStock
                            ? 'cursor-not-allowed border border-[#E4E4E7] bg-[#F4F4F5] text-[#71717A]'
                            : 'bg-[#09090B] text-white hover:bg-[#1049EB]'
                        }`}
                      >
                        <Plus size={14} weight="bold" />
                        <span>
                          {outOfStock ? 'SOLD OUT' : hasSizes ? 'SELECT SIZE' : 'ADD TO BAG'}
                        </span>
                      </button>
                    </div>
                  </Link>
                )
              })()}

              {/* Right 6 Columns: 3 Stacked Exposed 1px Deal Rows */}
              <div className="grid grid-cols-1 gap-px bg-[#E4E4E7] lg:col-span-6">
                {secondaryDeals.map((deal, idx) => {
                  const { hasCompare, compareAt, pct } = getDiscountInfo(deal)
                  const outOfStock = deal.stockQty <= 0
                  const hasSizes = Boolean(deal.sizes && deal.sizes.length > 0)
                  return (
                    <Link
                      key={deal.id}
                      to={`/product/${deal.slug || deal.id}`}
                      className="group flex items-center gap-4 bg-white p-5 transition-colors hover:bg-[#FAFAFA] sm:gap-6 sm:p-6"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-[#E4E4E7] bg-[#F4F4F5] p-2.5 sm:h-28 sm:w-28">
                        {pct > 0 ? (
                          <span className="absolute left-1.5 top-1.5 bg-[#FEB719] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#09090B]">
                            -{pct}%
                          </span>
                        ) : null}
                        <img
                          src={deal.image}
                          alt={deal.name}
                          loading="lazy"
                          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                        <div>
                          <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
                            <span className="truncate">
                              0{idx + 2} / {deal.brand || deal.category.replace(/-/g, ' ')}
                            </span>
                            <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#09090B]">
                              <Star size={11} weight="fill" className="text-[#FEB719]" />
                              {(deal.rating || 4.8).toFixed(1)}
                            </span>
                          </div>
                          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-[#09090B] transition-colors group-hover:text-[#1049EB]">
                            {deal.name}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E4E4E7] pt-2.5">
                          <div className="flex items-baseline gap-2">
                            <strong className="font-mono text-sm font-bold tabular-nums text-[#09090B]">
                              {formatNaira(deal.finalPrice)}
                            </strong>
                            {hasCompare ? (
                              <span className="font-mono text-xs tabular-nums text-[#71717A] line-through">
                                {formatNaira(compareAt)}
                              </span>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            disabled={outOfStock}
                            onClick={(e) => handleDealAdd(deal, e)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                              outOfStock
                                ? 'cursor-not-allowed border border-[#E4E4E7] bg-[#F4F4F5] text-[#71717A]'
                                : 'bg-[#09090B] text-white hover:bg-[#1049EB]'
                            }`}
                          >
                            <Plus size={12} weight="bold" />
                            <span>{outOfStock ? 'SOLD OUT' : hasSizes ? 'OPTIONS' : 'ADD'}</span>
                          </button>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {extraDeals.length > 0 ? (
              <div className="grid grid-cols-2 gap-px border-t border-[#E4E4E7] bg-[#E4E4E7] lg:grid-cols-4">
                {extraDeals.map((deal, idx) => (
                  <ProductCard key={deal.id} product={deal} index={idx + 4} />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className="grid grid-cols-2 gap-px bg-[#E4E4E7] lg:grid-cols-4">
            {displayDeals.map((deal, idx) => (
              <ProductCard key={deal.id} product={deal} index={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
