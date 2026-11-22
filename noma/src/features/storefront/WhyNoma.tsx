import { ArrowRight, CheckCircle, Headset, ShieldCheck, Truck } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const pillars = [
  {
    number: '01',
    title: 'Genuine Home Electronics & Appliances',
    detail:
      'Every generator, air fryer, smart TV, and kitchen unit is sourced directly from verified distributors and checked for Nigerian power and usage conditions.',
    icon: CheckCircle,
  },
  {
    number: '02',
    title: 'Fast Doorstep Delivery Nationwide',
    detail:
      'Orders dispatch within 2 to 5 business days with real-time order tracking and direct WhatsApp delivery notifications before arrival.',
    icon: Truck,
  },
  {
    number: '03',
    title: 'Human Support via WhatsApp',
    detail:
      'No endless automated loops. Speak directly with trained Noma specialists for product checks, bulk quotes, or dispatch updates.',
    icon: Headset,
  },
]

export function WhyNoma() {
  return (
    <section className="border-b border-[#E5E7EB] bg-white py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Sticky Flat Obsidian Manifesto (No glow blobs, no eyebrow) */}
          <div className="flex flex-col justify-between rounded-[10px] border border-[#0B1220] bg-[#0B1220] p-7 text-white lg:sticky lg:top-24 lg:col-span-5 lg:p-9">
            <div>
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-white md:text-[1.75rem]">
                Transparent pricing before you pay
              </h2>
              <p className="mt-3 text-sm leading-[1.6] text-white/75">
                Noma calculates exact delivery fees by Nigerian state and package weight before checkout, eliminating surprise dispatch markups.
              </p>
            </div>

            <div className="mt-8 space-y-4 border-t border-white/15 pt-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-white/15 bg-white/10 text-white">
                  <ShieldCheck size={18} weight="fill" className="text-[#FEB719]" />
                </span>
                <div>
                  <div className="text-xs font-bold text-white">Pay-on-Delivery Available</div>
                  <div className="text-[11px] text-white/65">Supported across eligible metro locations</div>
                </div>
              </div>

              <Link
                to="/orders"
                className="inline-flex w-full items-center justify-between rounded-[6px] border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-[#0B1220]"
              >
                <span>Track an order</span>
                <ArrowRight size={15} weight="regular" />
              </Link>
            </div>
          </div>

          {/* Open Hairline Index Rows */}
          <div className="divide-y divide-[#E5E7EB] border-y border-[#E5E7EB] lg:col-span-7">
            {pillars.map((pillar) => (
              <div key={pillar.number} className="flex items-start gap-4 py-6 sm:gap-6 sm:py-7">
                <span className="font-mono text-sm font-bold tracking-wider text-[#1049EB] sm:text-base">
                  {pillar.number}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold tracking-tight text-[#0B1220] sm:text-lg">
                      {pillar.title}
                    </h3>
                    <pillar.icon size={18} weight="regular" className="shrink-0 text-[#1049EB]" />
                  </div>
                  <p className="mt-1.5 max-w-[60ch] text-sm leading-[1.6] text-[#374151]">
                    {pillar.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
