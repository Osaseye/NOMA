import { Outlet, Link } from 'react-router-dom'
import { CaretDown, EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react'
import { MiniCartDrawer } from '../components/commerce/MiniCartDrawer'
import { FloatingWhatsApp } from '../components/layout/FloatingWhatsApp'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { ScrollToTop } from '../components/ui/ScrollToTop'
import { brand } from '../constants/brand'
import { useAdminStore } from '../store/adminStore'
import { useCartStore } from '../store/cartStore'

const NIGERIAN_STATES = [
  'Lagos',
  'FCT - Abuja',
  'Oyo',
  'Ogun',
  'Rivers',
  'Edo',
  'Delta',
  'Enugu',
  'Anambra',
  'Kano',
  'Kaduna',
  'Akwa Ibom',
  'Cross River',
  'Imo',
  'Kwara',
  'Osun',
  'Ondo',
  'Ekiti',
  'Plateau',
  'Abia',
]

export function StorefrontLayout() {
  const { settings } = useAdminStore()
  const deliveryState = useCartStore((state) => state.deliveryState)
  const setDeliveryState = useCartStore((state) => state.setDeliveryState)

  const supportPhone = settings.supportPhone || brand.phone
  const supportEmail = settings.supportEmail || brand.supportEmail || brand.email

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white text-slate-900">
      <ScrollToTop />

      {/* Neutral Subtle Top Utility Bar: Phone & Email (Left), Location Pin Dropdown (Center), Quick Links (Right) */}
      <div className="border-b border-slate-200/70 bg-[#F4F4F5] text-slate-700">
        <div className="mx-auto flex h-9 w-full max-w-[1600px] items-center justify-between px-3 text-xs sm:px-5 lg:px-6">
          {/* Left: Phone & Email */}
          <div className="flex items-center gap-4">
            <a
              href={`tel:${supportPhone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 font-medium text-slate-600 transition-colors hover:text-slate-950"
            >
              <Phone size={13} weight="regular" className="text-slate-500" />
              <span>{supportPhone}</span>
            </a>
            <a
              href={`mailto:${supportEmail}`}
              className="hidden items-center gap-1.5 font-medium text-slate-600 transition-colors hover:text-slate-950 md:inline-flex"
            >
              <EnvelopeSimple size={13} weight="regular" className="text-slate-500" />
              <span>{supportEmail}</span>
            </a>
          </div>

          {/* Center: Pin Icon + State Dropdown ("Lagos") */}
          <div className="relative inline-flex items-center">
            <MapPin size={13} weight="fill" className="mr-1 text-slate-800" />
            <div className="relative inline-flex items-center">
              <select
                value={deliveryState}
                onChange={(e) => setDeliveryState(e.target.value)}
                aria-label="Select delivery location"
                className="cursor-pointer appearance-none bg-transparent pr-4 text-xs font-semibold text-slate-900 focus:outline-none"
              >
                {NIGERIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <CaretDown
                size={11}
                weight="bold"
                className="pointer-events-none absolute right-0 text-slate-500"
              />
            </div>
          </div>

          {/* Right: Subtle Quick Links */}
          <div className="hidden items-center gap-4 text-xs font-medium text-slate-600 sm:flex">
            <span>Retail &amp; Wholesale</span>
            <span className="text-slate-300">|</span>
            <Link to="/orders" className="transition-colors hover:text-slate-950">
              Track Order
            </Link>
            <Link to="/support" className="hidden transition-colors hover:text-slate-950 lg:inline">
              Help
            </Link>
          </div>
        </div>
      </div>

      <StoreHeader />
      <MiniCartDrawer />

      <main className="flex-1">
        <Outlet />
      </main>

      <StoreFooter />
      <FloatingWhatsApp />
    </div>
  )
}
