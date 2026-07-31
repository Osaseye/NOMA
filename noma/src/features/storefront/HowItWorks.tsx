import { MapPin, Search, Truck } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Browse & Discover',
    description: 'Search or browse hundreds of home products across electronics, kitchen, appliances, and more — all with clear, final prices.',
    color: '#2F5FE3',
    bg: '#EEF2FF',
  },
  {
    number: '02',
    icon: Truck,
    title: 'Order with Confidence',
    description: 'Add to cart or order via WhatsApp. Your delivery fee is confirmed upfront — no surprises at checkout.',
    color: '#10B981',
    bg: '#E8F5EB',
  },
  {
    number: '03',
    icon: MapPin,
    title: 'Delivered to Your Door',
    description: 'We handle sourcing, packing, and delivery. Track your order every step of the way until it arrives.',
    color: '#F5A623',
    bg: '#FFF4E5',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[#12203D] md:text-[32px]">
            How Noma Works
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] font-medium text-[#12203D]/55">
            From browsing to your doorstep in 3 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          {/* Dashed connector line (desktop only) */}
          <div className="absolute left-[calc(16.67%+24px)] top-14 hidden h-px w-[calc(66.67%-48px)] border-t-2 border-dashed border-[#12203D]/10 md:block" />

          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center">
              {/* Step icon */}
              <div
                className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-2xl shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]"
                style={{ backgroundColor: step.bg }}
              >
                <step.icon size={32} strokeWidth={2} style={{ color: step.color }} />
                {/* Step number */}
                <span
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold text-white shadow"
                  style={{ backgroundColor: step.color }}
                >
                  {i + 1}
                </span>
              </div>

              <h3 className="mt-5 text-[17px] font-extrabold text-[#12203D]">{step.title}</h3>
              <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#12203D]/55">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
