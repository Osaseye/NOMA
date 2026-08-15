// CuratedBanners.tsx
import { Link } from 'react-router-dom'
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder'
import { HiOutlineArrowRight } from 'react-icons/hi2'

export function CuratedBanners() {
  return (
    <section className="bg-[#F7F8FA] py-10 md:py-16 border-t border-black/5">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#2F5FE3]">
              FEATURED COLLECTIONS
            </span>
            <h2 className="font-['Outfit'] text-2xl font-black text-[#12203D] md:text-3xl">
              Curated for Nigerian Homes
            </h2>
          </div>
          <Link
            to="/catalog"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#2F5FE3] hover:underline"
          >
            Explore All Categories <HiOutlineArrowRight className="text-sm" />
          </Link>
        </div>

        {/* Asymmetric Showcase Grid: 7 cols + 5 cols */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Main Hero Category Banner: Kitchen (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-black/5 bg-[#FFF9F5] p-6 md:p-8 shadow-xs relative overflow-hidden group">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 z-10">
              <div>
                <span className="inline-block rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-700 mb-2">
                  TOP POPULAR
                </span>
                <h3 className="font-['Outfit'] text-2xl font-black text-[#12203D] md:text-3xl">
                  Upgrade Your Kitchen
                </h3>
                <p className="mt-1 text-xs md:text-sm font-medium text-[#12203D]/70 max-w-sm">
                  Air fryers, heavy-duty blenders & nonstick cookware designed for quick daily cooking.
                </p>
              </div>

              <div className="shrink-0">
                <span className="inline-block rounded-2xl bg-white border border-black/5 px-3.5 py-1.5 text-xs font-black text-[#12203D] shadow-2xs">
                  From ₦18,000
                </span>
              </div>
            </div>

            <div className="my-6 z-10">
              <ImagePlaceholder
                label="Kitchen Collection"
                variant="warm-canvas"
                aspectRatio="aspect-[16/9]"
                className="rounded-2xl border border-black/5 shadow-xs transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </div>

            <div className="z-10">
              <Link
                to="/category/kitchen"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#12203D] px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-[#2F5FE3]"
              >
                <span>Shop Kitchen Category</span>
                <HiOutlineArrowRight className="text-sm" />
              </Link>
            </div>
          </div>

          {/* Right Column: Stacked 2 Banners (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Banner 2: Stay Powered */}
            <div className="flex flex-col justify-between rounded-3xl border border-red-100 bg-red-50/40 p-6 shadow-xs relative overflow-hidden group">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white mb-2">
                    HOT POWER SALE
                  </span>
                  <h3 className="font-['Outfit'] text-xl font-black text-[#12203D] md:text-2xl">
                    Stay Powered Up
                  </h3>
                  <p className="mt-1 text-xs font-medium text-[#12203D]/70">
                    Generators, inverters & high-capacity power banks.
                  </p>
                </div>
              </div>

              <div className="my-4">
                <ImagePlaceholder
                  label="Generators & Power"
                  variant="skeleton"
                  aspectRatio="aspect-[21/9]"
                  className="rounded-xl border border-red-100"
                />
              </div>

              <Link
                to="/category/appliances"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-600 hover:underline"
              >
                Shop Power Solutions <HiOutlineArrowRight className="text-sm" />
              </Link>
            </div>

            {/* Banner 3: Stay Connected (Navy Dark Card) */}
            <div className="flex flex-col justify-between rounded-3xl bg-[#12203D] p-6 text-white shadow-md relative overflow-hidden group">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block rounded-full bg-[#2F5FE3] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white mb-2">
                    SMART HOME AUDIO & TV
                  </span>
                  <h3 className="font-['Outfit'] text-xl font-black text-white md:text-2xl">
                    Stay Connected
                  </h3>
                  <p className="mt-1 text-xs font-medium text-white/70">
                    4K Smart TVs, home soundbars & entertainment systems.
                  </p>
                </div>
              </div>

              <div className="my-4">
                <ImagePlaceholder
                  label="Smart TVs & Audio"
                  variant="skeleton"
                  aspectRatio="aspect-[21/9]"
                  className="rounded-xl border border-white/10"
                />
              </div>

              <Link
                to="/category/electronics"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white hover:text-[#2F5FE3] transition-colors"
              >
                Explore Electronics <HiOutlineArrowRight className="text-sm" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
