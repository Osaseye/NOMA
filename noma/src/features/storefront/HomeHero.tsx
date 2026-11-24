import { ArrowRight, CaretLeft, CaretRight, WhatsappLogo } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { brand } from '../../constants/brand'
import { useAdminStore } from '../../store/adminStore'

const HERO_SLIDES = [
  {
    id: 'living',
    title: 'Everyday fashion, footwear & modern home essentials.',
    subtitle:
      'Shop quality shoes in single pairs or bulk bales, contemporary clothing, kitchen appliances, and electronics delivered nationwide.',
    imageDesktop: '/images/hero-living-desktop.png',
    imageMobile: '/images/hero-living-mobile.png',
    ctaText: 'Shop All Products',
    ctaHref: '/catalog',
  },
  {
    id: 'fashion',
    title: 'Footwear & Apparel — Retail Pairs & Wholesale Bales.',
    subtitle:
      'Curated sneakers, leather shoes, and fashion staples priced for individual shoppers and bulk resellers across Nigeria.',
    imageDesktop: '/images/cat-clothing.png',
    imageMobile: '/images/cat-clothing.png',
    ctaText: 'Explore Fashion & Shoes',
    ctaHref: '/category/clothing',
  },
  {
    id: 'kitchen',
    title: 'Upgrade your kitchen & daily living spaces.',
    subtitle:
      'Durable cookware, digital air fryers, blenders, and smart home hardware with upfront delivery pricing.',
    imageDesktop: '/images/editorial-kitchen.png',
    imageMobile: '/images/editorial-kitchen.png',
    ctaText: 'Shop Kitchen & Home',
    ctaHref: '/category/kitchen',
  },
]

export function HomeHero() {
  const { settings } = useAdminStore()
  const [activeIndex, setActiveIndex] = useState(0)

  const whatsappDigits = settings.whatsappNumber?.replace(/\D/g, '')
  const whatsappUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : brand.whatsapp

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [])

  const currentSlide = HERO_SLIDES[activeIndex]

  return (
    <section className="pt-3 sm:pt-4">
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        {/* Full-Bleed Big Photography Canvas with Floating Overlay (No AI Gradient Box, No Badge) */}
        <div className="relative h-[430px] w-full overflow-hidden rounded-2xl bg-slate-900 sm:h-[500px] lg:h-[580px]">
          {/* Big Full-Frame Background Image */}
          <picture key={currentSlide.id}>
            <source media="(max-width: 767px)" srcSet={currentSlide.imageMobile} />
            <img
              src={currentSlide.imageDesktop}
              alt={currentSlide.title}
              fetchPriority="high"
              className="h-full w-full object-cover object-center transition-transform duration-700"
            />
          </picture>

          {/* Subtle Dark Vignette for Floating Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 sm:bg-gradient-to-r sm:from-black/75 sm:via-black/40 sm:to-transparent" />

          {/* Floating Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:justify-center sm:p-12 lg:p-16">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-xs sm:text-5xl lg:text-[3.4rem]">
                {currentSlide.title}
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
                {currentSlide.subtitle}
              </p>

              {/* Floating Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to={currentSlide.ctaHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-bold text-slate-950 shadow-md transition-transform hover:scale-[1.02] hover:bg-slate-100 sm:text-sm"
                >
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight size={16} weight="bold" />
                </Link>

                <a
                  href={`${whatsappUrl}?text=${encodeURIComponent('Hello Noma, I would like to inquire about bulk/wholesale or retail orders.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-black/35 px-6 py-3.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-black/55 sm:text-sm"
                >
                  <WhatsappLogo size={18} weight="fill" className="text-emerald-400" />
                  <span>Wholesale &amp; Bulk Desk</span>
                </a>
              </div>
            </div>
          </div>

          {/* Floating Minimal Slide Controls */}
          <div className="absolute bottom-5 right-5 flex items-center gap-2 sm:bottom-8 sm:right-10">
            <div className="mr-2 flex items-center gap-1.5">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeIndex ? 'w-7 bg-white' : 'w-2 bg-white/45 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
              }
              aria-label="Previous slide"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-black/55 sm:inline-flex"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
              aria-label="Next slide"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-black/55 sm:inline-flex"
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
