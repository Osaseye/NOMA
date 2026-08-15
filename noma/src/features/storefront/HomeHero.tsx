// HomeHero.tsx
import { ArrowRight, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function HomeHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F7F8FA] min-h-[480px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[640px] flex items-center">
      {/* Mobile background image */}
      <img
        src="/products/hero-background-mobile.png"
        alt="Noma Home Products Mobile"
        className="block md:hidden absolute inset-0 w-full h-full object-cover object-right-top opacity-90"
      />

      {/* Desktop background image */}
      <img
        src="/products/hero-background-desktop.png"
        alt="Noma Home Products Desktop"
        className="hidden md:block absolute inset-0 w-full h-full object-cover object-right"
      />

      {/* Main hero content overlay */}
      <div className="relative z-10 w-full py-8 md:py-14 lg:py-16 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          {/* Left Hero Column */}
          <div className="flex flex-col items-start max-w-xl">
            {/* Delivery Badge */}
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-gray-200/80 bg-white/90 px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wide text-[#12203D] backdrop-blur-md sm:text-[10px] md:px-4 md:py-2 md:text-[11px] shadow-xs">
              <Truck size={14} className="shrink-0 text-[#F5A623]" />
              <span className="truncate">DELIVERY COST CONFIRMED BEFORE YOU PAY</span>
              <svg width="14" height="10" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-0.5 shrink-0 rounded-[2px]">
                <rect width="16" height="12" fill="#FFFFFF" />
                <rect width="5.33333" height="12" fill="#008751" />
                <rect x="10.6667" width="5.33333" height="12" fill="#008751" />
              </svg>
            </div>

            {/* Exactly 2 words per line layout for mobile and desktop */}
            <h1 className="mt-4 font-sans text-[2.1rem] font-black leading-[1.1] tracking-tight text-[#12203D] sm:text-[2.7rem] md:text-[3.3rem] lg:text-[3.9rem]">
              Everything your<br />
              <span className="text-[#2F5FE3]">home</span> needs,<br />
              without the<br />
              market stress.
            </h1>

            {/* Subtitle */}
            <p className="mt-3.5 max-w-[420px] text-[14px] font-medium leading-relaxed text-[#12203D]/80 sm:text-[16px] md:mt-5 md:text-[17px]">
              Shop electronics, kitchenware, appliances and more with clear prices and no surprises.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4 md:mt-8">
              <Link
                to="/catalog"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#2F5FE3] px-6 text-[14px] font-extrabold text-white shadow-[0_4px_16px_rgba(47,95,227,0.35)] transition-all hover:bg-[#2348C0] active:scale-95 sm:h-12 sm:px-8 sm:text-[15px]"
              >
                Shop Now
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <Link
                to="/catalog"
                className="inline-flex h-11 items-center justify-center rounded-full border border-gray-200/90 bg-white/95 px-6 text-[14px] font-bold text-[#12203D] shadow-xs backdrop-blur-md transition-all hover:bg-gray-50 active:scale-95 sm:h-12 sm:px-8 sm:text-[15px]"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}