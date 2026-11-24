import { ArrowsCounterClockwise, Package, Truck, WhatsappLogo } from '@phosphor-icons/react'

const highlights = [
  {
    icon: Package,
    title: 'Retail & Bulk Orders',
    detail: 'Buy single items or wholesale quantities',
  },
  {
    icon: Truck,
    title: 'Fast Nationwide Delivery',
    detail: 'Doorstep shipping across all 36 states',
  },
  {
    icon: ArrowsCounterClockwise,
    title: 'Pay on Delivery',
    detail: 'Available in eligible metro areas',
  },
  {
    icon: WhatsappLogo,
    title: 'Direct WhatsApp Support',
    detail: 'Chat with a real person anytime',
  },
]

export function TrustStrip() {
  return (
    <section aria-label="Shopping highlights">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3.5 rounded-2xl border border-slate-200/70 bg-white px-4 py-3.5 shadow-2xs"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FE] text-[#1049EB]">
                <item.icon size={20} weight="duotone" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-slate-900 sm:text-sm">{item.title}</h3>
                <p className="truncate text-xs text-slate-500">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
