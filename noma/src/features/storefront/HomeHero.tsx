import { ArrowRight, Sparkle, WhatsappLogo } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { brand } from '../../constants/brand'
import { useAdminStore } from '../../store/adminStore'

export function HomeHero() {
  const { settings } = useAdminStore()
  const whatsappDigits = settings.whatsappNumber?.replace(/\D/g, '')
  const whatsappUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : brand.whatsapp

  return (
    <section className="pt-4 sm:pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#13203B] to-[#1049EB] text-white shadow-lg">
          <div className="grid grid-cols-1 items-center gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:gap-10 lg:p-12">
            {/* Left 7 Cols: Clear, Welcoming Copy for Shoes (Retail & Bulk), Fashion, Home & Electronics */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-[#FEB719] backdrop-blur-xs">
                <Sparkle size={14} weight="fill" />
                <span>Retail &amp; Wholesale Marketplace</span>
              </div>

              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Quality shoes, fashion, and home essentials — in single pairs or bulk.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">
                Shop trending footwear, clothing, kitchen appliances, and electronics at honest Naira prices, with fast delivery across Nigeria.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/catalog"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FEB719] px-6 py-3.5 text-sm font-bold text-slate-950 shadow-sm transition-transform hover:scale-[1.01] hover:bg-[#fca311]"
                >
                  <span>Shop All Products</span>
                  <ArrowRight size={16} weight="bold" />
                </Link>

                <a
                  href={`${whatsappUrl}?text=${encodeURIComponent('Hello Noma, I would like to inquire about bulk/wholesale or retail orders.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-xs transition-colors hover:bg-white/20"
                >
                  <WhatsappLogo size={18} weight="fill" className="text-emerald-400" />
                  <span>Bulk &amp; Wholesale Inquiry</span>
                </a>
              </div>
            </div>

            {/* Right 5 Cols: Clean Framed Visual without awkward empty space */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-900/40 shadow-inner">
                <picture>
                  <source media="(max-width: 767px)" srcSet="/images/hero-living-mobile.png" />
                  <img
                    src="/images/hero-living-desktop.png"
                    alt="Noma Marketplace Collection"
                    fetchPriority="high"
                    className="h-full w-full object-cover object-center"
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
