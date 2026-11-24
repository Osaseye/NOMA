import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowCounterClockwise,
  ArrowUpRight,
  EnvelopeSimple,
  MapPin,
  ShieldCheck,
  Truck,
  WhatsappLogo,
} from '@phosphor-icons/react'
import { brand } from '../../constants/brand'
import { useAdminStore } from '../../store/adminStore'

export const StoreFooter: React.FC = () => {
  const { settings } = useAdminStore()
  const whatsappDigits = settings.whatsappNumber?.replace(/\D/g, '')
  const whatsappBaseUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : brand.whatsapp
  const whatsappConciergeHref = `${whatsappBaseUrl}?text=${encodeURIComponent(
    'Hello Noma Concierge, I need assistance with an order.',
  )}`
  const supportEmail = settings.supportEmail || brand.email

  return (
    <footer className="border-t border-[#E4E4E7] bg-white text-[#09090B]">
      {/* Architectural Trust Matrix Strip */}
      <div className="mx-auto max-w-[1600px] border-x border-b border-[#E4E4E7]">
        <div className="grid grid-cols-1 divide-y divide-[#E4E4E7] md:grid-cols-3 md:divide-x md:divide-y-0">
          <div className="flex items-start gap-4 p-6 lg:p-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#E4E4E7] bg-[#F4F4F5] text-[#09090B]">
              <ShieldCheck size={20} weight="regular" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#1049EB]">
                01 / AUTHENTICITY
              </span>
              <h4 className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#09090B]">
                Manufacturer Warranty &amp; Sealed Units
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-[#71717A]">
                Every appliance and electronics unit ships factory-sealed with serial verification.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 lg:p-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#E4E4E7] bg-[#F4F4F5] text-[#09090B]">
              <Truck size={20} weight="regular" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#1049EB]">
                02 / LOGISTICS
              </span>
              <h4 className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#09090B]">
                Nationwide Tracked Dispatch
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-[#71717A]">
                24–48hr delivery across Lagos &amp; Abuja; insured cargo dispatch to all 36 states.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 lg:p-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#E4E4E7] bg-[#F4F4F5] text-[#09090B]">
              <ArrowCounterClockwise size={20} weight="regular" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#1049EB]">
                03 / PROTECTION
              </span>
              <h4 className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#09090B]">
                7-Day DOA Replacement Guarantee
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-[#71717A]">
                Immediate replacement or refund on verified arrival defects plus Pay-on-Delivery in select zones.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Exposed Grid Footer Links */}
      <div className="mx-auto max-w-[1600px] border-x border-[#E4E4E7]">
        <div className="grid grid-cols-1 divide-y divide-[#E4E4E7] md:grid-cols-2 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
          {/* Col 1: Brand Identity */}
          <div className="flex flex-col justify-between bg-[#FAFAFA] p-6 lg:col-span-4 lg:p-10">
            <div className="space-y-4">
              <Link to="/" className="inline-block">
                <img
                  src="/logo.PNG"
                  alt="Noma Store"
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <p className="max-w-sm text-xs leading-relaxed text-[#52525B]">
                Architectural home electronics, smart living appliances, and lithium power systems curated for modern Nigerian residences.
              </p>
            </div>

            <div className="mt-8 space-y-2 border-t border-[#E4E4E7] pt-4 font-mono text-[11px] text-[#52525B]">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#09090B]" />
                <span>LAGOS &bull; ABUJA &bull; PORT HARCOURT</span>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeSimple size={14} className="text-[#09090B]" />
                <a href={`mailto:${supportEmail}`} className="hover:text-[#1049EB]">
                  {supportEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Departments */}
          <div className="p-6 lg:col-span-3 lg:p-10">
            <h3 className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
              INDEX / DEPARTMENTS
            </h3>
            <ul className="space-y-2.5 text-xs font-medium text-[#52525B]">
              <li>
                <Link to="/catalog" className="flex items-center justify-between hover:text-[#09090B]">
                  <span>All Catalog</span>
                  <ArrowUpRight size={12} className="text-[#71717A]" />
                </Link>
              </li>
              <li>
                <Link
                  to="/category/electronics"
                  className="flex items-center justify-between hover:text-[#09090B]"
                >
                  <span>Smart Televisions &amp; Audio</span>
                  <ArrowUpRight size={12} className="text-[#71717A]" />
                </Link>
              </li>
              <li>
                <Link
                  to="/category/appliances"
                  className="flex items-center justify-between hover:text-[#09090B]"
                >
                  <span>Climate &amp; Large Appliances</span>
                  <ArrowUpRight size={12} className="text-[#71717A]" />
                </Link>
              </li>
              <li>
                <Link
                  to="/category/kitchen"
                  className="flex items-center justify-between hover:text-[#09090B]"
                >
                  <span>Precision Kitchen Systems</span>
                  <ArrowUpRight size={12} className="text-[#71717A]" />
                </Link>
              </li>
              <li>
                <Link
                  to="/category/phones"
                  className="flex items-center justify-between hover:text-[#09090B]"
                >
                  <span>Phones &amp; Mobile Power</span>
                  <ArrowUpRight size={12} className="text-[#71717A]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Client Services */}
          <div className="p-6 lg:col-span-2 lg:p-10">
            <h3 className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
              CLIENT CARE
            </h3>
            <ul className="space-y-2.5 text-xs font-medium text-[#52525B]">
              <li>
                <Link to="/orders" className="hover:text-[#09090B]">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-[#09090B]">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#09090B]">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-[#09090B]">
                  Delivery &amp; Warranty
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#09090B]">
                  About Noma
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#09090B]">
                  Terms &amp; Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Concierge Desk */}
          <div className="flex flex-col justify-between p-6 lg:col-span-3 lg:p-10">
            <div>
              <h3 className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                CONCIERGE DESK
              </h3>
              <p className="mb-5 text-xs leading-relaxed text-[#52525B]">
                Need specification advice, bulk B2B quoting, or same-day Lagos dispatch confirmation?
              </p>
              <a
                href={whatsappConciergeHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 border border-[#09090B] bg-[#09090B] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-[#1049EB] hover:bg-[#1049EB]"
              >
                <WhatsappLogo size={16} weight="fill" />
                WhatsApp Concierge
              </a>
            </div>

            <div className="mt-6 border-t border-[#E4E4E7] pt-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
                HOURS: MON–SAT / 08:00–20:00 WAT
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Edge Info Bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E4E4E7] bg-[#F4F4F5] px-6 py-4 text-[11px] text-[#71717A] sm:flex-row lg:px-10">
          <p className="font-mono text-[10px] uppercase tracking-wider">
            &copy; {new Date().getFullYear()} NOMA COMMERCE NIGERIA. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-wider">
            <span>NGN (₦)</span>
            <span>&bull;</span>
            <span>BANK TRANSFER / CARD / POD</span>
            <span>&bull;</span>
            <span>CLOUDFLARE EDGE</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
