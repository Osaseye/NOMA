import { useEffect, useMemo, useRef, useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import {
  CaretDown,
  Check,
  EnvelopeSimple,
  MagnifyingGlass,
  MapPin,
  Phone,
} from '@phosphor-icons/react'
import { MiniCartDrawer } from '../components/commerce/MiniCartDrawer'
import { FloatingWhatsApp } from '../components/layout/FloatingWhatsApp'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { ScrollToTop } from '../components/ui/ScrollToTop'
import { brand } from '../constants/brand'
import { useAdminStore } from '../store/adminStore'
import { useCartStore } from '../store/cartStore'

const NIGERIAN_STATES_WITH_ETA: { name: string; eta: string }[] = [
  { name: 'Lagos', eta: '1–2 days' },
  { name: 'FCT - Abuja', eta: '2–3 days' },
  { name: 'Ogun', eta: '2–3 days' },
  { name: 'Oyo', eta: '2–3 days' },
  { name: 'Rivers', eta: '2–4 days' },
  { name: 'Delta', eta: '2–4 days' },
  { name: 'Edo', eta: '2–4 days' },
  { name: 'Enugu', eta: '2–4 days' },
  { name: 'Anambra', eta: '2–4 days' },
  { name: 'Kano', eta: '3–5 days' },
  { name: 'Kaduna', eta: '3–5 days' },
  { name: 'Akwa Ibom', eta: '3–5 days' },
  { name: 'Cross River', eta: '3–5 days' },
  { name: 'Imo', eta: '3–5 days' },
  { name: 'Kwara', eta: '2–4 days' },
  { name: 'Osun', eta: '2–3 days' },
  { name: 'Ondo', eta: '2–3 days' },
  { name: 'Ekiti', eta: '2–4 days' },
  { name: 'Plateau', eta: '3–5 days' },
  { name: 'Abia', eta: '3–5 days' },
  { name: 'Adamawa', eta: '4–5 days' },
  { name: 'Bauchi', eta: '4–5 days' },
  { name: 'Bayelsa', eta: '3–5 days' },
  { name: 'Benue', eta: '3–5 days' },
  { name: 'Borno', eta: '4–5 days' },
  { name: 'Ebonyi', eta: '3–5 days' },
  { name: 'Gombe', eta: '4–5 days' },
  { name: 'Jigawa', eta: '4–5 days' },
  { name: 'Katsina', eta: '4–5 days' },
  { name: 'Kebbi', eta: '4–5 days' },
  { name: 'Kogi', eta: '2–4 days' },
  { name: 'Nasarawa', eta: '2–4 days' },
  { name: 'Niger', eta: '3–5 days' },
  { name: 'Sokoto', eta: '4–5 days' },
  { name: 'Taraba', eta: '4–5 days' },
  { name: 'Yobe', eta: '4–5 days' },
  { name: 'Zamfara', eta: '4–5 days' },
]

function NigeriaFlagIcon({ className = 'h-3.5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 20"
      aria-hidden="true"
      className={`inline-block shrink-0 overflow-hidden rounded-[2px] border border-slate-300/80 shadow-2xs ${className}`}
    >
      <rect width="10" height="20" x="0" y="0" fill="#008751" />
      <rect width="10" height="20" x="10" y="0" fill="#FFFFFF" />
      <rect width="10" height="20" x="20" y="0" fill="#008751" />
    </svg>
  )
}

export function StorefrontLayout() {
  const { settings } = useAdminStore()
  const deliveryState = useCartStore((state) => state.deliveryState)
  const setDeliveryState = useCartStore((state) => state.setDeliveryState)

  const [stateMenuOpen, setStateMenuOpen] = useState(false)
  const [stateQuery, setStateQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const supportPhone = settings.supportPhone || brand.phone
  const supportEmail = settings.supportEmail || brand.supportEmail || brand.email

  useEffect(() => {
    if (!stateMenuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStateMenuOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setStateMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [stateMenuOpen])

  const filteredStates = useMemo(() => {
    const q = stateQuery.trim().toLowerCase()
    if (!q) return NIGERIAN_STATES_WITH_ETA
    return NIGERIAN_STATES_WITH_ETA.filter((s) => s.name.toLowerCase().includes(q))
  }, [stateQuery])

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white text-slate-900">
      <ScrollToTop />

      {/* Top Utility Bar: Phone & Email (Left), Nigeria Flag + Custom State Dropdown (Center), Quick Links (Right) */}
      <div className="relative z-50 border-b border-slate-200/70 bg-[#F4F4F5] text-slate-700">
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

          {/* Center: Nigeria Flag + Pin Icon + Custom State Popover Trigger */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setStateMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-2xs ring-1 ring-slate-200/80 transition-all hover:bg-white hover:ring-slate-300"
              aria-expanded={stateMenuOpen}
              aria-haspopup="listbox"
            >
              <NigeriaFlagIcon />
              <MapPin size={12} weight="fill" className="text-slate-700" />
              <span>{deliveryState}</span>
              <CaretDown
                size={11}
                weight="bold"
                className={`text-slate-500 transition-transform ${stateMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Custom Designed Nigerian States Dropdown Popover */}
            {stateMenuOpen ? (
              <div className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl sm:w-80">
                <div className="mb-2.5 flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <NigeriaFlagIcon />
                    <span className="text-xs font-bold text-slate-900">
                      Select Delivery State
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">36 States + FCT</span>
                </div>

                {/* Quick Filter Input */}
                <div className="relative mb-2.5">
                  <MagnifyingGlass
                    size={13}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={stateQuery}
                    onChange={(e) => setStateQuery(e.target.value)}
                    placeholder="Find your state..."
                    className="h-8 w-full rounded-xl border border-slate-200 bg-[#F4F4F5] pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Custom Scrollable State Grid */}
                <div
                  role="listbox"
                  aria-label="Nigerian states"
                  className="no-scrollbar max-h-60 space-y-0.5 overflow-y-auto pr-0.5"
                >
                  {filteredStates.length === 0 ? (
                    <p className="py-6 text-center text-xs text-slate-400">No state found</p>
                  ) : (
                    filteredStates.map((st) => {
                      const isSelected = st.name === deliveryState
                      return (
                        <button
                          key={st.name}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setDeliveryState(st.name)
                            setStateMenuOpen(false)
                            setStateQuery('')
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                            isSelected
                              ? 'bg-slate-900 font-semibold text-white'
                              : 'text-slate-700 hover:bg-[#F4F4F5] hover:text-slate-950'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{st.name}</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <span
                              className={`text-[10px] ${
                                isSelected ? 'text-white/75' : 'text-slate-400'
                              }`}
                            >
                              {st.eta}
                            </span>
                            {isSelected ? <Check size={12} weight="bold" /> : null}
                          </span>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            ) : null}
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
