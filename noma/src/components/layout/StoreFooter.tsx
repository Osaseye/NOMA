import { Link } from 'react-router-dom'
import { brand } from '../../constants/brand'

const footerLinks = {
  shop: [
    { label: 'Electronics', href: '/category/electronics' },
    { label: 'Kitchen', href: '/category/kitchen' },
    { label: 'Appliances', href: '/category/appliances' },
    { label: 'Phones & Tablets', href: '/category/phones' },
    { label: 'Clothing & Fashion', href: '/category/clothing' },
    { label: 'Home Essentials', href: '/category/home-essentials' },
  ],
  help: [
    { label: 'Track My Order', href: '/track-order' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Returns & Refunds', href: '/policies' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'WhatsApp Support', href: brand.whatsapp, external: true },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/policies' },
    { label: 'Terms of Service', href: '/policies' },
    { label: 'Delivery Policy', href: '/policies' },
    { label: 'About Noma', href: '/about' },
  ],
}

export function StoreFooter() {
  return (
    <footer className="bg-[#F9F9F6] text-[#12203D]">
      <div className="w-full">
        {/* Top border wrapper */}
        <div className="border-t border-[#12203D]/10">
          <div className="mx-auto w-full max-w-[1600px]">
            {/* 4-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 lg:divide-x divide-[#12203D]/10">

              {/* SHOP */}
              <div className="p-8 md:p-10 lg:p-12">
                <h3 className="mb-6 text-[12px] font-bold uppercase tracking-widest text-[#12203D]">SHOP</h3>
                <ul className="flex flex-col gap-3">
                  {footerLinks.shop.map((link) => (
                    <li key={link.href}>
                      <Link to={link.href} className="text-[14px] font-medium text-[#12203D]/70 transition-colors hover:text-[#12203D]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* HELP */}
              <div className="p-8 md:p-10 lg:p-12 border-t md:border-t-0 md:border-l border-[#12203D]/10 lg:border-l-0">
                <h3 className="mb-6 text-[12px] font-bold uppercase tracking-widest text-[#12203D]">HELP</h3>
                <ul className="flex flex-col gap-3">
                  {footerLinks.help.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-[14px] font-medium text-[#12203D]/70 transition-colors hover:text-[#12203D]">
                          {link.label}
                        </a>
                      ) : (
                        <Link to={link.href} className="text-[14px] font-medium text-[#12203D]/70 transition-colors hover:text-[#12203D]">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* LEGAL */}
              <div className="p-8 md:p-10 lg:p-12">
                <h3 className="mb-6 text-[12px] font-bold uppercase tracking-widest text-[#12203D]">LEGAL</h3>
                <ul className="flex flex-col gap-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.label}>
                      <Link to={link.href} className="text-[14px] font-medium text-[#12203D]/70 transition-colors hover:text-[#12203D]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CONTACT */}
              <div className="p-8 md:p-10 lg:p-12 border-t md:border-t-0 md:border-l border-[#12203D]/10 lg:border-l-0">
                <h3 className="mb-6 text-[12px] font-bold uppercase tracking-widest text-[#12203D]">CONTACT</h3>

                <div className="mb-6 flex flex-col gap-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#12203D]">GENERAL INQUIRIES:</span>
                  <a href="mailto:hello@shopnoma.com" className="text-[14px] font-medium text-[#12203D]/70 transition-colors hover:text-[#12203D]">hello@shopnoma.com</a>
                </div>

                <div className="mb-8 flex flex-col gap-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#12203D]">SUPPORT:</span>
                  <a href="mailto:support@shopnoma.com" className="text-[14px] font-medium text-[#12203D]/70 transition-colors hover:text-[#12203D]">support@shopnoma.com</a>
                </div>

                <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className="mb-3 flex w-full items-center justify-center rounded bg-[#12203D] py-3.5 text-[11px] font-extrabold tracking-widest text-white transition-colors hover:bg-black">
                  CHAT ON WHATSAPP
                </a>
                <Link to="/catalog" className="flex w-full items-center justify-center rounded border border-[#12203D]/20 bg-transparent py-3.5 text-[11px] font-extrabold tracking-widest text-[#12203D] transition-colors hover:bg-[#12203D]/5">
                  BROWSE CATALOG
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Big Text Section */}
        <div className="border-t border-[#12203D]/10">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-8 p-8 md:flex-row md:gap-12 md:p-10 lg:p-12">
            <Link to="/" className="shrink-0">
              <img src="/logo.PNG" alt="Noma" className="h-16 w-32 object-contain" />
            </Link>
            <div className="font-['Outfit'] text-[4rem] font-black leading-none tracking-tight text-[#12203D] md:text-[6rem] lg:text-[8rem]">
              SINCE 2026
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#12203D]/10">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-6 p-8 text-[11px] font-bold uppercase tracking-wider text-[#12203D]/60 md:flex-row md:p-10 lg:px-12 lg:py-8">
            <span>EVERYTHING YOUR HOME NEEDS</span>

            <div className="flex gap-6">
              <Link to="/policies" className="transition-colors hover:text-[#12203D]">TERMS & CONDITIONS</Link>
              <Link to="/policies" className="transition-colors hover:text-[#12203D]">PRIVACY POLICY</Link>
            </div>

            <span>©{new Date().getFullYear()} {brand.legalEntity}. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
