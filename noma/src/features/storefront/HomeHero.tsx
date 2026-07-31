import { ArrowRight, Plus, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatNaira } from '../../utils/pricing'

type FloatingLabel = {
  name: string
  price: number
  slug: string
  position: string
}

// These are just price labels pointing to items already in the background image
const floatingLabels: FloatingLabel[] = [
  {
    name: 'Samsung 55" 4K UHD Smart TV',
    price: 185000,
    slug: 'samsung-55-4k-uhd-smart-tv',
    position: 'top-12 right-[45%] w-48',
  },
  {
    name: 'Nonstick Cookware Set',
    price: 42000,
    slug: 'nonstick-cookware-set',
    position: 'top-[42%] right-[22%] w-44',
  },
  {
    name: 'Binatone Blender',
    price: 45000,
    slug: 'binatone-blender',
    position: 'bottom-32 right-[40%] w-36',
  },
  {
    name: 'Standing Fan 16"',
    price: 28000,
    slug: 'standing-fan-16',
    position: 'top-[35%] right-8 w-36',
  },
]

export function HomeHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F7F8FA]">
      {/* Background image driving height proportionally on desktop */}
      <img
        src="/products/background.png"
        alt=""
        className="w-full h-[600px] object-cover md:h-auto md:min-h-[600px]"
      />

      {/* Main hero content container overlay */}
      <div className="absolute inset-0 flex items-center">
        {/* Match header padding: no max-w-7xl, just px-4 md:px-8 lg:px-12 */}
        <div className="relative grid w-full grid-cols-1 items-center px-4 pt-32 md:grid-cols-2 md:px-8 lg:px-12 lg:pt-24">

          {/* ── Left: Copy ── */}
          <div className="relative z-10 flex flex-col pt-0 -mt-12 md:-mt-24 md:pt-0">
            {/* Delivery Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/5 bg-white/60 px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-[#12203D] backdrop-blur-sm md:text-[11px]">
              <Truck size={14} className="text-[#F5A623]" />
              DELIVERY COST CONFIRMED BEFORE YOU PAY
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1 rounded-[2px]">
                <rect width="16" height="12" fill="#FFFFFF" />
                <rect width="5.33333" height="12" fill="#008751" />
                <rect x="10.6667" width="5.33333" height="12" fill="#008751" />
              </svg>
            </div>

            {/* Headline */}
            <h1 className="mt-8 max-w-lg text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-[#12203D] md:text-[3.5rem] lg:text-[4.2rem]">
              Everything your <br className="hidden md:block" />
              <span className="text-[#2F5FE3]">home</span> needs, <br className="hidden md:block" />
              without the <br className="hidden md:block" />
              market stress.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-[420px] text-[15px] font-medium leading-relaxed text-[#12203D]/70 md:text-[17px]">
              Shop electronics, kitchenware, appliances and more with clear prices and no surprises.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/catalog"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#2F5FE3] px-8 text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(47,95,227,0.3)] transition-all hover:bg-[#2348C0] active:scale-95"
              >
                Shop Now
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <Link
                to="/categories"
                className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white px-8 text-[15px] font-bold text-[#12203D] shadow-sm transition-all hover:bg-gray-50 active:scale-95"
              >
                Browse Categories
              </Link>
            </div>
          </div>

          {/* ── Right: Floating Price Labels ── */}
          <div className="relative hidden h-[500px] md:block">
            {floatingLabels.map((label) => (
              <Link
                key={label.slug}
                to={`/product/${label.slug}`}
                aria-label={`View ${label.name}`}
                className={`group absolute flex flex-col rounded-[14px] bg-white px-4 py-3 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.2)] ${label.position}`}
              >
                <span className="text-[11px] font-semibold leading-snug text-[#12203D]/70">
                  {label.name}
                </span>
                <span className="mt-0.5 text-sm font-extrabold text-[#12203D]">
                  {formatNaira(label.price)}
                </span>
                {/* Floating Plus Button */}
                <span className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#2F5FE3] text-white shadow-md transition-transform group-hover:scale-110 group-hover:bg-[#2348C0]">
                  <Plus size={16} strokeWidth={3} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}