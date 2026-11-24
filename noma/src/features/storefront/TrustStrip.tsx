import { Package, ShieldCheck, Truck, WhatsappLogo } from '@phosphor-icons/react'

const mobileHighlights = [
  {
    icon: Package,
    shortLabel: 'Retail & Bulk',
    desktopLabel: 'Retail & Wholesale Footwear and Fashion',
  },
  {
    icon: Truck,
    shortLabel: '36 States',
    desktopLabel: 'Nationwide Doorstep Delivery Across All 36 States',
  },
  {
    icon: ShieldCheck,
    shortLabel: 'Pay on Delivery',
    desktopLabel: 'Pay on Delivery in Eligible Metro Areas',
  },
  {
    icon: WhatsappLogo,
    shortLabel: '24/7 WhatsApp',
    desktopLabel: 'Direct WhatsApp Order & Bulk Support',
  },
]

export function TrustStrip() {
  return (
    <section aria-label="Shopping highlights" className="border-b border-slate-100 py-3">
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        {/* Mobile View: Crisp Icon + Short Micro-Label Row (No ugly wrapped text paragraphs) */}
        <div className="grid grid-cols-4 gap-1 text-center md:hidden">
          {mobileHighlights.map((item) => (
            <div key={item.shortLabel} className="flex flex-col items-center justify-center gap-1 py-0.5">
              <item.icon size={18} weight="regular" className="text-slate-800" />
              <span className="text-[10px] font-semibold leading-tight text-slate-700">
                {item.shortLabel}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop View: Sleek Inline Text + Subtle Icon Ribbon */}
        <div className="hidden items-center justify-between gap-6 text-xs font-medium text-slate-600 md:flex">
          {mobileHighlights.map((item, idx) => (
            <div key={item.shortLabel} className="contents">
              <div className="inline-flex items-center gap-2">
                <item.icon size={16} weight="regular" className="text-slate-800" />
                <span>{item.desktopLabel}</span>
              </div>
              {idx < mobileHighlights.length - 1 ? (
                <span className="text-slate-300">&bull;</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
