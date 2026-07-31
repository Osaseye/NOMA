import { Sparkles, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatNaira } from '../../utils/pricing'

const newArrivals = [
  { id: 'na1', slug: 'sumec-firman-generator', name: 'Sumec Firman Generator', image: '/products/generator.png', price: 320000 },
  { id: 'na2', slug: 'xiaomi-smart-air-fryer', name: 'Xiaomi Smart Air Fryer', image: '/products/air-fryer.png', price: 95000 },
  { id: 'na3', slug: 'nonstick-cookware-set', name: 'Nonstick Cookware Set', image: '/products/cookware.png', price: 72000 },
  { id: 'na4', slug: 'binatone-blender', name: 'Binatone Blender Pro', image: '/products/blender.png', price: 45000 },
  { id: 'na5', slug: 'hero-tv', name: 'Samsung 55" 4K Smart TV', image: '/products/hero-tv.png', price: 185000 },
  { id: 'na6', slug: 'phones', name: 'Latest Smartphones', image: '/products/phones.png', price: 150000 },
]

export function NewArrivals() {
  return (
    <section className="bg-white py-16 md:py-24 border-b border-[#12203D]/10">
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 border-b border-[#12203D]/10 pb-8 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[4px_4px_0_0_#12203D] border-2 border-[#12203D]">
              <Sparkles size={24} className="text-[#2F5FE3]" strokeWidth={2} />
            </div>
            <h2 className="font-['Outfit'] text-[2.5rem] font-black leading-none tracking-tight text-[#12203D] md:text-[4rem]">
              NEW ARRIVALS
            </h2>
          </div>
          <Link
            to="/catalog?sort=newest"
            className="group flex items-center gap-2 text-[13px] font-black uppercase tracking-widest text-[#12203D] transition-colors hover:text-[#2F5FE3]"
          >
            Explore Collection
            <span className="block h-px w-8 bg-[#12203D] transition-all group-hover:w-12 group-hover:bg-[#2F5FE3]" />
          </Link>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 md:gap-6">
          {newArrivals.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              aria-label={`View ${product.name}`}
              className="group relative flex flex-col justify-between rounded-3xl border-2 border-[#12203D] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#12203D] overflow-hidden"
            >
              {/* NEW badge */}
              <div className="absolute left-0 top-0 z-10 flex h-8 items-center justify-center rounded-br-2xl border-b-2 border-r-2 border-[#12203D] bg-[#10B981] px-3 text-[11px] font-black text-white">
                NEW
              </div>

              {/* Image */}
              <div className="flex aspect-square items-center justify-center bg-[#F9F9F6] p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col p-4">
                <span className="line-clamp-2 text-[12px] font-bold leading-snug text-[#12203D] md:text-[13px]">
                  {product.name}
                </span>
                <div className="mt-4 flex items-end justify-between gap-2">
                  <span className="text-[16px] font-black tracking-tight text-[#12203D] md:text-lg">
                    {formatNaira(product.price)}
                  </span>
                  <button
                    aria-label={`Add ${product.name} to cart`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 border-[#12203D] bg-white text-[#12203D] transition-colors hover:bg-[#12203D] hover:text-white"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Truck size={14} strokeWidth={2.5} />
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
