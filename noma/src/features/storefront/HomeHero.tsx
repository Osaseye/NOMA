import { ArrowRight, ArrowUpRight, ShieldCheck, Truck } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../../store/productStore'
import { formatNaira } from '../../utils/pricing'

export function HomeHero() {
  const products = useProductStore((state) => state.products)
  const spotlightProduct =
    products.find((p) => p.compareAtPrice && p.compareAtPrice > p.finalPrice) || products[0]

  return (
    <section className="border-b border-[#E4E4E7] bg-white">
      <div className="mx-auto max-w-[1600px] border-x border-[#E4E4E7]">
        {/* Architectural Split Grid: 6 Cols Editorial Manifesto / 6 Cols Studio Visual */}
        <div className="grid grid-cols-1 divide-y divide-[#E4E4E7] lg:grid-cols-12 lg:divide-x lg:divide-y-0">
          {/* Left 6 Columns: Editorial Studio Manifesto */}
          <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-6 lg:p-14">
            <div>
              {/* Exposed Index Strip */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E4E7] pb-3">
                <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#09090B]">
                  <span className="h-2 w-2 bg-[#1049EB]" />
                  <span>EDITION 2026 / HOME ARCHITECTURE</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A]">
                  LAGOS &bull; ABUJA &bull; PH
                </span>
              </div>

              <h1 className="max-w-[16ch] text-3xl font-bold leading-[1.06] tracking-[-0.03em] text-[#09090B] sm:text-5xl lg:text-[3.5rem]">
                Precision hardware for modern Nigerian living.
              </h1>

              <p className="mt-5 max-w-[50ch] text-sm leading-relaxed text-[#52525B] sm:text-base">
                Factory-sealed 4K displays, low-draw inverter cooling, and silent lithium backup systems—priced transparently in Naira with upfront state delivery estimates.
              </p>

              {/* Sharp Architectural CTA Pair */}
              <div className="mt-8 flex flex-wrap items-stretch gap-3">
                <Link
                  to="/catalog"
                  className="inline-flex items-center justify-center gap-3 bg-[#09090B] px-7 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#1049EB]"
                >
                  <span>Explore Full Index</span>
                  <ArrowRight size={15} weight="regular" />
                </Link>
                <Link
                  to="/orders"
                  className="inline-flex items-center justify-center gap-2 border border-[#E4E4E7] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#09090B] transition-colors hover:border-[#09090B] hover:bg-[#FAFAFA]"
                >
                  <span>Track Dispatch</span>
                </Link>
              </div>
            </div>

            {/* Bottom Technical Spec Bar inside Left Cell */}
            <div className="mt-10 grid grid-cols-2 divide-x divide-[#E4E4E7] border border-[#E4E4E7] bg-[#FAFAFA] sm:grid-cols-3">
              <div className="p-3.5">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
                  DISPATCH WINDOW
                </span>
                <strong className="mt-0.5 block font-mono text-xs font-bold text-[#09090B]">
                  24–48 HRS METRO
                </strong>
              </div>
              <div className="p-3.5">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
                  SETTLEMENT
                </span>
                <strong className="mt-0.5 block font-mono text-xs font-bold text-[#09090B]">
                  CARD / TRANSFER / POD
                </strong>
              </div>
              <div className="col-span-2 border-t border-[#E4E4E7] p-3.5 sm:col-span-1 sm:border-t-0">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
                  PROTECTION
                </span>
                <strong className="mt-0.5 block font-mono text-xs font-bold text-[#16A34A]">
                  1-YR OEM WARRANTY
                </strong>
              </div>
            </div>
          </div>

          {/* Right 6 Columns: Full-Bleed Architectural Concrete Visual Cell */}
          <div className="relative flex flex-col justify-between bg-[#F4F4F5] lg:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:h-full">
              <picture>
                <source media="(max-width: 767px)" srcSet="/images/hero-living-mobile.png" />
                <img
                  src="/images/hero-living-desktop.png"
                  alt="Noma contemporary Nigerian residence featuring smart 4K display, acoustic soundbar, and lithium power system"
                  fetchPriority="high"
                  className="h-full w-full object-cover object-center"
                />
              </picture>

              {/* Architectural Spec Tag Overlay */}
              {spotlightProduct ? (
                <Link
                  to={`/product/${spotlightProduct.slug || spotlightProduct.id}`}
                  className="group absolute bottom-4 left-4 right-4 flex items-center justify-between border border-[#09090B] bg-white/95 p-3.5 backdrop-blur-md transition-colors hover:bg-[#09090B] hover:text-white sm:left-auto sm:right-6 sm:bottom-6 sm:w-80"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#71717A] group-hover:text-[#FEB719]">
                      <span>FEATURED UNIT</span>
                      <span>&bull;</span>
                      <span>IN STOCK</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs font-semibold text-[#09090B] group-hover:text-white">
                      {spotlightProduct.name}
                    </p>
                    <p className="mt-0.5 font-mono text-xs font-bold text-[#09090B] group-hover:text-[#FEB719]">
                      {formatNaira(spotlightProduct.finalPrice)}
                    </p>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#E4E4E7] bg-[#F4F4F5] text-[#09090B] group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white">
                    <ArrowUpRight size={15} />
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {/* Sub-Hero Department Quick Bar */}
        <div className="grid grid-cols-2 divide-x divide-y divide-[#E4E4E7] border-t border-[#E4E4E7] bg-white sm:grid-cols-4 sm:divide-y-0">
          <div className="flex items-center gap-2.5 px-5 py-3 text-xs">
            <ShieldCheck size={16} className="shrink-0 text-[#1049EB]" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#09090B]">
              FACTORY SEALED SERIALS
            </span>
          </div>
          <div className="flex items-center gap-2.5 px-5 py-3 text-xs">
            <Truck size={16} className="shrink-0 text-[#1049EB]" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#09090B]">
              FREE SHIPPING &ge; ₦250,000
            </span>
          </div>
          <Link
            to="/category/electronics"
            className="flex items-center justify-between px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#52525B] transition-colors hover:bg-[#FAFAFA] hover:text-[#09090B]"
          >
            <span>01 / SMART DISPLAYS</span>
            <ArrowUpRight size={13} />
          </Link>
          <Link
            to="/category/kitchen"
            className="flex items-center justify-between px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#52525B] transition-colors hover:bg-[#FAFAFA] hover:text-[#09090B]"
          >
            <span>02 / KITCHEN SYSTEMS</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  )
}
