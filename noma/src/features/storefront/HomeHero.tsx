import { ArrowRight, CaretLeft, CaretRight, WhatsappLogo } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { brand } from '../../constants/brand'
import { useAdminStore } from '../../store/adminStore'

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1]

const HERO_SLIDES = [
  {
    id: 'fashion',
    navLabel: 'Shoes & Fashion',
    title: 'Footwear & Apparel — Single Pairs or Wholesale Bales.',
    subtitle:
      'Shop trending sneakers, leather footwear, and contemporary clothing priced for everyday shoppers and bulk resellers across Nigeria.',
    imageDesktop: '/images/cat-clothing.png',
    imageMobile: '/images/cat-clothing.png',
    ctaText: 'Shop Shoes & Fashion',
    ctaHref: '/category/clothing',
  },
  {
    id: 'kitchen',
    navLabel: 'Kitchen & Catering',
    title: 'Kitchen, Cookware & Catering Supplies.',
    subtitle:
      'Commercial and home blenders, digital air fryers, stainless cookware sets, and catering essentials delivered to your doorstep.',
    imageDesktop: '/images/editorial-kitchen.png',
    imageMobile: '/images/editorial-kitchen.png',
    ctaText: 'Shop Kitchen & Catering',
    ctaHref: '/category/kitchen',
  },
  {
    id: 'living',
    navLabel: 'Smart Living & TVs',
    title: '4K Smart Displays, Audio & Modern Home Living.',
    subtitle:
      'Transform your living space with ultra-crisp 4K televisions, acoustic soundbars, and contemporary home upgrades.',
    imageDesktop: '/images/hero-living-desktop.png',
    imageMobile: '/images/hero-living-mobile.png',
    ctaText: 'Explore Electronics',
    ctaHref: '/category/electronics',
  },
  {
    id: 'power',
    navLabel: 'Power & Appliances',
    title: 'Silent Inverter Power, Cooling & Major Appliances.',
    subtitle:
      'Energy-efficient refrigerators, low-draw air conditioners, and lithium backup systems built for Nigerian homes.',
    imageDesktop: '/images/editorial-power.png',
    imageMobile: '/images/editorial-power.png',
    ctaText: 'Shop Appliances',
    ctaHref: '/category/appliances',
  },
  {
    id: 'phones',
    navLabel: 'Phones & Gadgets',
    title: 'Smartphones, Fast Chargers & Everyday Tech.',
    subtitle:
      'Stay connected with verified smartphones, high-capacity power banks, and wireless audio accessories.',
    imageDesktop: '/images/cat-phones.png',
    imageMobile: '/images/cat-phones.png',
    ctaText: 'Shop Phones & Tech',
    ctaHref: '/category/phones',
  },
]

export function HomeHero() {
  const { settings } = useAdminStore()
  const prefersReducedMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const whatsappDigits = settings.whatsappNumber?.replace(/\D/g, '')
  const whatsappUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : brand.whatsapp

  useEffect(() => {
    if (isPaused) return
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [isPaused])

  const currentSlide = HERO_SLIDES[activeIndex]

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const deltaX = touchStartX.current - e.changedTouches[0].clientX
    if (deltaX > 45) {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length)
    } else if (deltaX < -45) {
      setActiveIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
    }
    touchStartX.current = null
  }

  return (
    <section className="pt-3 sm:pt-4">
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative h-[440px] w-full overflow-hidden rounded-2xl bg-slate-950 sm:h-[520px] lg:h-[600px]"
        >
          {/* All 5 Slide Canvases Pre-mounted with Smooth Opacity Crossfade & Subtle Scale */}
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === activeIndex
            return (
              <picture
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  isActive ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
                }`}
              >
                <source media="(max-width: 767px)" srcSet={slide.imageMobile} />
                <img
                  src={slide.imageDesktop}
                  alt={slide.title}
                  fetchPriority={idx === 0 ? 'high' : 'auto'}
                  className={`h-full w-full object-cover object-center transition-transform duration-[6000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </picture>
            )
          })}

          {/* Editorial Vignette Overlay */}
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-black/40 to-black/10 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/40 sm:to-transparent" />

          {/* Floating Hero Content */}
          <div className="absolute inset-0 z-30 flex flex-col justify-end p-6 pb-16 sm:justify-center sm:p-12 lg:p-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={prefersReducedMotion ? false : 'hidden'}
                animate="visible"
                exit={prefersReducedMotion ? undefined : 'exit'}
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.065, delayChildren: 0.02 },
                  },
                  exit: {
                    opacity: 0,
                    y: -8,
                    transition: { duration: 0.16, ease: EASE_OUT_EXPO },
                  },
                }}
                className="max-w-2xl"
              >
                <motion.span
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.34, ease: EASE_OUT_EXPO },
                    },
                  }}
                  className="mb-3 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-white/95 backdrop-blur-md"
                >
                  {currentSlide.navLabel}
                </motion.span>

                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.42, ease: EASE_OUT_EXPO },
                    },
                  }}
                  className="text-2xl font-bold leading-[1.12] tracking-tight text-white drop-shadow-xs sm:text-5xl lg:text-[3.35rem]"
                >
                  {currentSlide.title}
                </motion.h1>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4, ease: EASE_OUT_EXPO },
                    },
                  }}
                  className="mt-3.5 max-w-xl text-xs leading-relaxed text-white/90 sm:mt-4 sm:text-base"
                >
                  {currentSlide.subtitle}
                </motion.p>

                {/* Floating Action Buttons */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.38, ease: EASE_OUT_EXPO },
                    },
                  }}
                  className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8"
                >
                  <Link
                    to={currentSlide.ctaHref}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1049EB] px-6 py-3 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:bg-[#0D3BC2] active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-sm"
                  >
                    <span>{currentSlide.ctaText}</span>
                    <ArrowRight size={16} weight="bold" />
                  </Link>

                  <a
                    href={`${whatsappUrl}?text=${encodeURIComponent('Hello Noma, I would like to inquire about bulk/wholesale or retail orders.')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-black/40 px-5 py-3 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-black/60 active:scale-[0.98] sm:px-6 sm:py-3.5 sm:text-sm"
                  >
                    <WhatsappLogo size={18} weight="fill" className="text-emerald-400" />
                    <span>Wholesale &amp; Bulk Desk</span>
                  </a>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Interactive Slide Bar: Labeled Pills on Desktop + Dots & Arrows */}
          <div className="absolute inset-x-0 bottom-4 z-30 flex items-center justify-between px-6 sm:bottom-6 sm:px-12 lg:px-16">
            {/* Desktop Labeled Slide Selector Pills */}
            <div className="hidden items-center gap-2 lg:flex">
              {HERO_SLIDES.map((slide, idx) => {
                const isActive = idx === activeIndex
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold backdrop-blur-md transition-all ${
                      isActive
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'bg-black/35 text-white/80 hover:bg-black/55 hover:text-white'
                    }`}
                  >
                    {slide.navLabel}
                  </button>
                )
              })}
            </div>

            {/* Mobile & Tablet Progress Dots */}
            <div className="flex items-center gap-1.5 lg:hidden">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to ${slide.navLabel}`}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeIndex ? 'w-7 bg-white' : 'w-2 bg-white/45 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                }
                aria-label="Previous slide"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/60"
              >
                <CaretLeft size={16} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
                aria-label="Next slide"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/60"
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
