import { ArrowsCounterClockwise, Headset, ShieldCheck, Truck } from '@phosphor-icons/react'

const trustItems = [
  {
    code: 'SPEC-01',
    icon: ShieldCheck,
    title: 'Verified Warranty',
    detail: '100% genuine items backed by distributor warranty',
  },
  {
    code: 'SPEC-02',
    icon: Truck,
    title: 'Nationwide Delivery',
    detail: '2 to 5 business days with upfront Naira shipping rates',
  },
  {
    code: 'SPEC-03',
    icon: ArrowsCounterClockwise,
    title: 'Pay on Delivery',
    detail: 'Available in eligible metro zones across Nigeria',
  },
  {
    code: 'SPEC-04',
    icon: Headset,
    title: 'WhatsApp Concierge',
    detail: 'Direct human order tracking and product assistance',
  },
]

export function TrustStrip() {
  return (
    <section aria-label="Store guarantees" className="border-b border-[#E4E4E7] bg-[#FAFAFA]">
      <div className="mx-auto max-w-[1600px] border-x border-[#E4E4E7]">
        <div className="grid grid-cols-1 divide-y divide-[#E4E4E7] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-start gap-3.5 p-5 lg:p-6">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#E4E4E7] bg-white text-[#09090B]">
                <item.icon size={18} weight="regular" />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
                  {item.code}
                </span>
                <div className="mt-0.5 text-xs font-bold uppercase tracking-wider text-[#09090B]">
                  {item.title}
                </div>
                <div className="mt-0.5 text-xs leading-relaxed text-[#52525B]">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
