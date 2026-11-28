import { ArrowRight, CheckCircle, WhatsappLogo } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { brand } from '../../constants/brand'
import { useAdminStore } from '../../store/adminStore'

const VENDOR_PILLARS = [
  'Your own branded Shop Noma link for Instagram & WhatsApp bios',
  'Studio-grade product descriptions, copy & clean catalog pages handled for you',
  'Instant bank-transfer checkout & tracked nationwide delivery across Nigeria',
]

export function VendorPartnerBanner() {
  const { settings } = useAdminStore()
  const whatsappDigits = settings.whatsappNumber?.replace(/\D/g, '')
  const whatsappBase = whatsappDigits ? `https://wa.me/${whatsappDigits}` : brand.whatsapp
  const vendorApplyHref = `${whatsappBase}?text=${encodeURIComponent(
    'Hello Shop Noma, I run an Instagram/WhatsApp brand and would like to open an Official Brand Store on Shop Noma.',
  )}`

  return (
    <section>
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
          <div className="grid grid-cols-1 items-center lg:grid-cols-12">
            {/* Left 6 Cols: Clean Editorial Vendor Pitch */}
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-6 lg:p-14">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1049EB]">
                <span className="h-2 w-2 rounded-full bg-[#FEB719]" />
                <span>Official Brand Stores · For IG &amp; WhatsApp Vendors</span>
              </div>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
                Grow your brand on Shop Noma.
              </h2>

              <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Sell on Instagram or WhatsApp? Get a dedicated branded storefront on Shop Noma — without paying for a website — and reach shoppers nationwide with trusted checkout.
              </p>

              <ul className="mt-6 space-y-2.5">
                {VENDOR_PILLARS.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-xs font-medium text-slate-700 sm:text-sm">
                    <CheckCircle
                      size={17}
                      weight="fill"
                      className="mt-0.5 shrink-0 text-[#1049EB]"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={vendorApplyHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#1049EB] px-6 text-xs font-semibold text-white transition-colors hover:bg-[#0D3EC7] sm:text-sm"
                >
                  <WhatsappLogo size={17} weight="fill" className="text-[#FEB719]" />
                  <span>Become a Brand Partner</span>
                  <ArrowRight size={14} weight="bold" />
                </a>

                <Link
                  to="/about"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-800 transition-colors hover:border-slate-950 hover:text-slate-950 sm:text-sm"
                >
                  How Shop Noma Works
                </Link>
              </div>
            </div>

            {/* Right 6 Cols: Noma Brand Illustration */}
            <div className="relative flex h-full min-h-[260px] items-center justify-center bg-white lg:col-span-6 lg:min-h-[400px]">
              <img
                src="/images/email-header-banner.jpg"
                alt="Shop Noma Brand Partners — Nigerian entrepreneurs and shoppers"
                loading="lazy"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
