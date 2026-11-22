import {
  ArrowsCounterClockwise,
  Clock,
  ShieldCheck,
  Truck,
  Wallet,
} from '@phosphor-icons/react'

const trustItems = [
  {
    icon: Truck,
    title: 'Delivery Fee Upfront',
    detail: 'Confirmed before payment',
  },
  {
    icon: Clock,
    title: '2-5 Days Delivery',
    detail: 'Tracked nationwide dispatch',
  },
  {
    icon: Wallet,
    title: 'Pay on Delivery',
    detail: 'Available in selected areas',
  },
  {
    icon: ArrowsCounterClockwise,
    title: '30-Day Returns',
    detail: 'Verified condition guarantee',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    detail: 'Card, bank transfer & USSD',
  },
]

export function TrustStrip() {
  return (
    <section className="border-y border-[#E5E7EB] bg-white" aria-label="Store guarantees">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-2 divide-y divide-[#E5E7EB] sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-center gap-3 px-3 py-4 sm:px-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#EEF3FE] text-[#1049EB]">
                <item.icon size={18} weight="regular" />
              </span>
              <div className="min-w-0">
                <span className="block truncate text-xs font-semibold text-[#0B1220]">
                  {item.title}
                </span>
                <span className="block truncate text-[11px] text-[#5E6675]">
                  {item.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
