import { ArrowRight, Truck } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'

export function HomeHero() {
  const { settings } = useAdminStore()
  const shouldReduceMotion = useReducedMotion()
  const activeBanners = (settings.heroBanners || []).filter((b) => b.active)
  const currentBanner = activeBanners[0]

  const bannerImage =
    currentBanner?.imageUrl && !currentBanner.imageUrl.includes('unsplash.com')
      ? currentBanner.imageUrl
      : ''

  return (
    <section className="flex min-h-[calc(100dvh-64px)] items-center bg-white pt-8 pb-10 md:pt-12 lg:max-h-[700px]">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.22fr_1fr] lg:gap-12">
          {/* Left Column: Editorial Stack (Max 4 Elements) */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col items-start"
          >
            {/* Eyebrow 1 */}
            <div className="inline-flex max-w-full items-center gap-2 rounded-[4px] border border-[#E5E7EB] bg-[#F6F7F9] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0B1220]">
              <Truck size={14} weight="regular" className="shrink-0 text-[#1049EB]" />
              <span className="truncate">
                {currentBanner?.badge?.replace(/[—–]/g, '-') || 'NIGERIA HOME & TECH MARKETPLACE'}
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-4 max-w-xl font-sans text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0B1220] md:text-5xl lg:text-[3.5rem]">
              {currentBanner?.title ? (
                currentBanner.title.replace(/[—–]/g, '-')
              ) : (
                <>
                  Everything your <span className="text-[#1049EB]">home</span> needs, priced clearly.
                </>
              )}
            </h1>

            {/* Subtext (<= 20 words) */}
            <p className="mt-4 max-w-[46ch] text-sm leading-[1.6] text-[#374151] md:text-[15px]">
              {currentBanner?.subtitle
                ? currentBanner.subtitle.replace(/[—–]/g, '-')
                : 'Shop electronics, kitchenware, appliances, and solar gear with upfront delivery fees and zero surprises.'}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to={currentBanner?.targetUrl || '/catalog'}
                className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#0B1220] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E293B] active:scale-[0.98]"
              >
                <span>Shop Catalog</span>
                <ArrowRight size={16} weight="regular" />
              </Link>
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#0B1220] transition-colors hover:border-[#D1D5DB] hover:bg-[#F6F7F9] active:scale-[0.98]"
              >
                Browse Categories
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Architectural Studio Image Frame */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06, ease: 'easeOut' }}
            className="w-full"
          >
            <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-[#F6F7F9]">
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt={currentBanner?.title || 'Noma curated home products'}
                  className="aspect-[4/5] w-full object-cover md:aspect-[16/10]"
                />
              ) : (
                <>
                  <img
                    src="/images/hero-living-mobile.png"
                    alt="Noma curated home appliances and espresso bar"
                    className="block aspect-[4/5] w-full object-cover md:hidden"
                  />
                  <img
                    src="/images/hero-living-desktop.png"
                    alt="Noma minimalist living space with smart home electronics"
                    className="hidden aspect-[16/10] w-full object-cover md:block"
                  />
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
