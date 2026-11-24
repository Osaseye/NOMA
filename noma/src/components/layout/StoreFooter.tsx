import React from 'react'
import { Link } from 'react-router-dom'
import { EnvelopeSimple, MapPin, WhatsappLogo } from '@phosphor-icons/react'
import { brand } from '../../constants/brand'
import { useAdminStore } from '../../store/adminStore'
import { useProductStore } from '../../store/productStore'

export const StoreFooter: React.FC = () => {
  const { settings } = useAdminStore()
  const categories = useProductStore((state) => state.categories)
  const whatsappDigits = settings.whatsappNumber?.replace(/\D/g, '')
  const whatsappBaseUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : brand.whatsapp
  const whatsappConciergeHref = `${whatsappBaseUrl}?text=${encodeURIComponent(
    'Hello Noma, I need assistance with an order.',
  )}`
  const supportEmail = settings.supportEmail || brand.email

  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-800">
      <div className="mx-auto w-full max-w-[1600px] px-3 py-10 sm:px-5 lg:px-6 lg:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12">
          {/* Col 1: Brand Summary */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block">
              <img
                src="/logo.PNG"
                alt="Noma"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-500 sm:text-sm">
              Your everyday marketplace for quality shoes (retail &amp; bulk), clothing, kitchen appliances, and electronics delivered across Nigeria.
            </p>

            <div className="mt-4 space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-slate-700" />
                <span>Lagos • Abuja • Nationwide Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeSimple size={15} className="text-slate-700" />
                <a href={`mailto:${supportEmail}`} className="hover:text-slate-950">
                  {supportEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Dynamic Categories */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold text-slate-900 sm:text-sm">Categories</h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 sm:text-sm">
              <li>
                <Link to="/catalog" className="hover:text-slate-950">
                  All Products
                </Link>
              </li>
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.id}`} className="hover:text-slate-950">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold text-slate-900 sm:text-sm">Customer Care</h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 sm:text-sm">
              <li>
                <Link to="/orders" className="hover:text-slate-950">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-slate-950">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-slate-950">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-slate-950">
                  Help &amp; Delivery Info
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-slate-950">
                  About Noma
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-slate-950">
                  Terms &amp; Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick WhatsApp Help (Neutral Dark Button, No Loud Blue) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold text-slate-900 sm:text-sm">Need Help or Bulk Pricing?</h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Chat with our team on WhatsApp for wholesale shoe inquiries, order updates, or product questions.
            </p>
            <a
              href={whatsappConciergeHref}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
            >
              <WhatsappLogo size={17} weight="fill" className="text-emerald-400" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Noma Marketplace. All rights reserved.</p>
          <p>Secure Checkout • Bank Transfer • Card • Pay on Delivery</p>
        </div>
      </div>
    </footer>
  )
}
