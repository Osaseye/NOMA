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
    <section className="border-b border-[#E4E4E7] bg-white">
      <div className="mx-auto max-w-[1600px] border-x border-[#E4E4E7]">
        <div className="grid grid-cols-1 divide-y divide-[#E4E4E7] lg:grid-cols-12 lg:divide-x lg:divide-y-0">
          {/* Left 5 Cols: Architectural Jet Black Manifesto Cell */}
          <div className="flex flex-col justify-between bg-[#09090B] p-8 text-white sm:p-10 lg:col-span-5 lg:p-12">
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#FEB719]">
                04 / THE NOMA STANDARD
              </span>
              <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                Transparent pricing before you pay.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                Noma calculates exact delivery fees by Nigerian state and package weight before checkout—eliminating surprise dispatch markups.
              </p>
            </div>

            <div className="mt-10 space-y-4 border-t border-white/15 pt-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/20 bg-white/5 text-[#FEB719]">
                  <ShieldCheck size={20} weight="fill" />
                </span>
                <div>
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    Pay-on-Delivery Supported
                  </div>
                  <div className="text-xs text-white/65">
                    Available across eligible metro zones in Nigeria
                  </div>
                </div>
              </div>

              <Link
                to="/orders"
                className="inline-flex w-full items-center justify-between border border-white/20 bg-white/10 px-5 py-3.5 font-mono text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[#09090B]"
              >
                <span>Track an Order</span>
                <ArrowRight size={15} weight="regular" />
              </Link>
            </div>
          </div>

          {/* Right 7 Cols: Exposed 1px Hairline Index Rows */}
          <div className="divide-y divide-[#E4E4E7] lg:col-span-7">
            {pillars.map((pillar) => (
              <div
                key={pillar.number}
                className="flex items-start gap-5 p-6 transition-colors hover:bg-[#FAFAFA] sm:gap-6 sm:p-8 lg:p-10"
              >
                <span className="border border-[#E4E4E7] bg-[#F4F4F5] px-2.5 py-1 font-mono text-xs font-bold text-[#1049EB]">
                  {pillar.number}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold tracking-tight text-[#09090B] sm:text-lg">
                      {pillar.title}
                    </h3>
                    <pillar.icon size={18} weight="regular" className="shrink-0 text-[#09090B]" />
                  </div>
                  <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-[#52525B]">
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
