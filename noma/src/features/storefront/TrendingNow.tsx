import { ArrowRight, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/commerce/ProductCard'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useAdminStore } from '../../store/adminStore'
import { useProductStore } from '../../store/productStore'

export function TrendingNow() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { products } = useProductStore()
  const { settings } = useAdminStore()

  const trendingList = products.filter((p) => settings.trendingProductIds.includes(p.id))
  const displayProducts = trendingList.length > 0 ? trendingList : products.slice(0, 8)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 280
    scrollRef.current.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="border-b border-[#E5E7EB] bg-[#F6F7F9] py-14">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Header Row (No eyebrow, no emoji) */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0B1220] md:text-[1.75rem]">
            Trending now
          </h2>

          <div className="flex items-center gap-3">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1049EB] hover:text-[#0D3BC2] hover:underline"
            >
              <span>View all</span>
              <ArrowRight size={14} weight="regular" />
            </Link>

            {displayProducts.length > 0 ? (
              <div className="hidden items-center gap-1.5 md:flex">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  aria-label="Scroll trending left"
                  className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#0B1220] transition-colors hover:border-[#D1D5DB] hover:bg-[#EEF0F4]"
                >
                  <CaretLeft size={16} weight="regular" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  aria-label="Scroll trending right"
                  className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#0B1220] transition-colors hover:border-[#D1D5DB] hover:bg-[#EEF0F4]"
                >
                  <CaretRight size={16} weight="regular" />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Horizontal Snap Track */}
        {displayProducts.length === 0 ? (
          <EmptyState
            title="Trending selection coming soon"
            detail="Featured products added to the store catalog will appear in this rail automatically."
            action={
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
              >
                Explore Catalog
              </Link>
            }
          />
        ) : (
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className="w-[220px] shrink-0 snap-start md:w-[250px]"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
