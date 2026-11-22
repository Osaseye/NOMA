import { WhatsappLogo } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { brand } from '../../constants/brand'
import { useAdminStore } from '../../store/adminStore'
import { useProductStore } from '../../store/productStore'

const footerLinks = {
  support: [
    { label: 'Track My Order', href: '/orders' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Returns & Refunds', href: '/returns' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'WhatsApp Support', href: '/whatsapp-order' },
  ],
  legal: [
    { label: 'About Noma', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Delivery Policy', href: '/delivery-policy' },
  ],
}

export function StoreFooter() {
  const { categories } = useProductStore()
  const { settings } = useAdminStore()

  const supportEmail = settings.supportEmail || brand.supportEmail
  const supportPhone = settings.supportPhone || brand.phone
  const whatsappDigits = settings.whatsappNumber?.replace(/\D/g, '')
  const whatsappUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : brand.whatsapp

  return (
    <footer className="border-t border-[#E5E7EB] bg-[#F6F7F9] text-[#0B1220]">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 divide-y divide-[#E5E7EB] md:grid-cols-2 md:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {/* Column 1: Shop */}
          <div className="p-6 sm:p-8 lg:p-10">
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0B1220]">
              Shop
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  to="/catalog"
                  className="text-sm font-medium text-[#374151] transition-colors hover:text-[#1049EB]"
                >
                  All Products
                </Link>
              </li>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.id}`}
                      className="text-sm font-medium text-[#374151] transition-colors hover:text-[#1049EB]"
                    >
                      {cat.label}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-xs text-[#5E6675]">Categories loading...</li>
              )}
            </ul>
          </div>

          {/* Column 2: Support */}
          <div className="border-[#E5E7EB] p-6 sm:p-8 md:border-l lg:border-l-0 lg:p-10">
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0B1220]">
              Support
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm font-medium text-[#374151] transition-colors hover:text-[#1049EB]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="border-[#E5E7EB] p-6 sm:p-8 md:border-t lg:border-t-0 lg:p-10">
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0B1220]">
              Legal
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm font-medium text-[#374151] transition-colors hover:text-[#1049EB]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Direct Desk */}
          <div className="border-[#E5E7EB] p-6 sm:p-8 md:border-l md:border-t lg:border-l-0 lg:border-t-0 lg:p-10">
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0B1220]">
              Direct Desk
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#5E6675]">
                  General Inquiries
                </span>
                <a
                  href={`mailto:${brand.email}`}
                  className="font-medium text-[#0B1220] transition-colors hover:text-[#1049EB]"
                >
                  {brand.email}
                </a>
              </div>

              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#5E6675]">
                  Customer Support
                </span>
                <a
                  href={`mailto:${supportEmail}`}
                  className="font-medium text-[#0B1220] transition-colors hover:text-[#1049EB]"
                >
                  {supportEmail}
                </a>
              </div>

              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#5E6675]">
                  Phone Desk
                </span>
                <a
                  href={`tel:${supportPhone.replace(/\s+/g, '')}`}
                  className="font-mono text-xs font-medium text-[#0B1220] transition-colors hover:text-[#1049EB]"
                >
                  {supportPhone}
                </a>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#0B1220] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1049EB]"
              >
                <WhatsappLogo size={15} weight="fill" className="text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>
              <Link
                to="/catalog"
                className="inline-flex w-full items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-semibold text-[#0B1220] transition-colors hover:bg-[#EEF0F4]"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#E5E7EB] bg-[#F6F7F9]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-[#5E6675] sm:flex-row md:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="shrink-0">
              <img src="/logo.PNG" alt="Noma" className="h-7 w-auto object-contain" />
            </Link>
            <span className="hidden h-3.5 w-px bg-[#D1D5DB] sm:inline-block" />
            <span className="font-medium text-[#5E6675]">Everything your home needs</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link to="/terms" className="transition-colors hover:text-[#0B1220]">
              Terms
            </Link>
            <Link to="/privacy" className="transition-colors hover:text-[#0B1220]">
              Privacy
            </Link>
            <span>
              &copy; {new Date().getFullYear()} {brand.legalEntity}. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
