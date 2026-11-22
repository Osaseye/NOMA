import { MagnifyingGlass, MapPin, Truck } from '@phosphor-icons/react'

const steps = [
  {
    number: '01',
    icon: MagnifyingGlass,
    title: 'Browse & Discover',
    description:
      'Search or filter electronics, kitchen appliances, and solar essentials with transparent Naira pricing.',
  },
  {
    number: '02',
    icon: Truck,
    title: 'Order with Confidence',
    description:
      'Checkout online or via WhatsApp with your Nigerian delivery fee confirmed upfront before payment.',
  },
  {
    number: '03',
    icon: MapPin,
    title: 'Delivered to Your Door',
    description:
      'Tracked nationwide dispatch with live status updates until your package arrives safely.',
  },
]

export function HowItWorks() {
  return (
    <section className="border-b border-[#E5E7EB] bg-white py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[#0B1220] md:text-[1.75rem]">
            How Noma Works
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[#5E6675]">
            From browsing to doorstep delivery in three straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col justify-between rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#1049EB]">
                    <step.icon size={20} weight="regular" />
                  </div>
                  <span className="font-mono text-sm font-bold text-[#1049EB]">{step.number}</span>
                </div>
                <h3 className="text-base font-bold text-[#0B1220]">{step.title}</h3>
                <p className="text-xs leading-relaxed text-[#5E6675]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
