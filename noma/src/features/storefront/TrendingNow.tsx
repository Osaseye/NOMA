import { HiChevronLeft, HiChevronRight, HiSparkles } from 'react-icons/hi2'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { formatNaira } from '../../utils/pricing'
import { FaShoppingBag } from 'react-icons/fa'
import { useProductStore } from '../../store/productStore'
import { useAdminStore } from '../../store/adminStore'
import { useCartStore } from '../../store/cartStore'

export function TrendingNow() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { products } = useProductStore()
  const { settings } = useAdminStore()
  const addItem = useCartStore((s) => s.addItem)

  // Filter products by trending IDs or fallback to top products
  const trendingList = products.filter((p) => settings.trendingProductIds.includes(p.id))
  const displayProducts = trendingList.length > 0 ? trendingList : products.slice(0, 6)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 280
    scrollRef.current.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="bg-[#F7F8FA] py-10 md:py-14 font-['Outfit',sans-serif]">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Header row */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#12203D] md:text-[28px]">
            <span>🔥</span> Trending Now
          </h2>
          <div className="flex items-center gap-4">
            <Link to="/catalog" className="text-xs font-bold text-[#2F5FE3] hover:underline">
              View all
            </Link>
            {displayProducts.length > 0 && (
              <div className="hidden items-center gap-2 md:flex">
                <button
                  onClick={() => scroll('left')}
                  aria-label="Scroll left"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-[#12203D]/60 shadow-xs transition hover:border-[#2F5FE3] hover:text-[#2F5FE3]"
                >
                  <HiChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scroll('right')}
                  aria-label="Scroll right"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-[#12203D]/60 shadow-xs transition hover:border-[#2F5FE3] hover:text-[#2F5FE3]"
                >
                  <HiChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic List or Empty State */}
        {displayProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-1">
              <HiSparkles size={28} />
            </div>
            <h3 className="font-bold text-base text-[#12203D]">Trending Selection Coming Soon</h3>
            <p className="text-xs text-slate-500 max-w-md">
              Top requested trending items will appear here as soon as products are added to the store catalog.
            </p>
            <Link
              to="/catalog"
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#2F5FE3] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#254ec4]"
            >
              Explore Catalog
            </Link>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5"
          >
            {displayProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                aria-label={`View ${product.name}`}
                className="group flex w-[200px] shrink-0 flex-col justify-between rounded-3xl border border-black/5 bg-white p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md md:w-[230px] md:p-5"
              >
                {/* Product Image */}
                <div className="mb-4 h-36 w-full rounded-2xl bg-slate-50 border p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Info & Action */}
                <div className="flex items-end justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="line-clamp-2 text-xs font-semibold leading-snug text-[#12203D]/80 md:text-[13px]">
                      {product.name}
                    </span>
                    <span className="text-[15px] font-black text-[#12203D] md:text-base">
                      {formatNaira(product.finalPrice)}
                    </span>
                  </div>

                  {/* Cart Action Button */}
                  <button
                    aria-label={`Add ${product.name} to cart`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0F4FF] text-[#2F5FE3] transition-colors hover:bg-[#2F5FE3] hover:text-white"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      addItem(product)
                    }}
                  >
                    <FaShoppingBag className="text-xs" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
