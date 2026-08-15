// TrendingNow.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder'
import { formatNaira } from '../../utils/pricing'
import { FaShoppingBag } from 'react-icons/fa'

type TrendingProduct = {
  id: string
  slug: string
  name: string
  price: number
}

const trendingProducts: TrendingProduct[] = [
  {
    id: 't1',
    slug: 'sumec-firman-generator',
    name: 'Sumec Firman Generator',
    price: 320000,
  },
  {
    id: 't2',
    slug: 'xiaomi-smart-air-fryer',
    name: 'Xiaomi Smart Air Fryer',
    price: 95000,
  },
  {
    id: 't3',
    slug: 'binatone-blender',
    name: 'Binatone Blender',
    price: 45000,
  },
  {
    id: 't4',
    slug: 'hisense-2-door-fridge',
    name: 'Hisense 2-Door Fridge',
    price: 350000,
  },
  {
    id: 't5',
    slug: 'oraimo-power-bank',
    name: 'Oraimo Power Bank',
    price: 18500,
  },
]

export function TrendingNow() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 280
    scrollRef.current.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="bg-[#F7F8FA] py-10 md:py-14">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Header row */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#12203D] md:text-[28px]">
            <span>🔥</span> Trending Now
          </h2>
          <div className="flex items-center gap-4">
            <Link
              to="/catalog"
              className="text-sm font-bold text-[#2F5FE3] hover:underline"
            >
              View all
            </Link>
            <div className="hidden items-center gap-2 md:flex">
              <button
                onClick={() => scroll('left')}
                aria-label="Scroll left"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-[#12203D]/60 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] transition hover:border-[#2F5FE3] hover:text-[#2F5FE3]"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Scroll right"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-[#12203D]/60 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] transition hover:border-[#2F5FE3] hover:text-[#2F5FE3]"
              >
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal scroll track */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5"
        >
          {trendingProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              aria-label={`View ${product.name}`}
              className="group flex w-[180px] shrink-0 flex-col justify-between rounded-3xl border border-black/5 bg-white p-4 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] md:w-[220px] md:p-5"
            >
              {/* ImagePlaceholder utility */}
              <div className="mb-4">
                <ImagePlaceholder
                  label="Product"
                  variant="skeleton"
                  aspectRatio="aspect-square"
                  className="rounded-2xl"
                />
              </div>

              {/* Info & Action */}
              <div className="flex items-end justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <span className="line-clamp-2 text-xs font-semibold leading-snug text-[#12203D]/70 md:text-[13px]">
                    {product.name}
                  </span>
                  <span className="text-[15px] font-extrabold text-[#12203D] md:text-base">
                    {formatNaira(product.price)}
                  </span>
                </div>

                {/* Cart Action Button */}
                <button
                  aria-label={`Add ${product.name} to cart`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F0F4FF] text-[#2F5FE3] transition-colors hover:bg-[#2F5FE3] hover:text-white md:h-9 md:w-9"
                  onClick={(e) => e.preventDefault()}
                >
                  <FaShoppingBag className="text-xs" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
