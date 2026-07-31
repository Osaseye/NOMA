import { Receipt, Truck, Wallet, RefreshCw } from 'lucide-react'

const trustItems = [
  {
    icon: Receipt,
    title: 'Delivery Fee Upfront',
    subtitle: 'No hidden charges after payment',
    accent: '#2F5FE3',
    tint: '#EAF0FF',
  },
  {
    icon: Truck,
    title: '2–5 Day Delivery',
    subtitle: 'Nationwide coverage, tracked',
    accent: '#12203D',
    tint: '#EEF1F5',
  },
  {
    icon: Wallet,
    title: 'Pay on Delivery',
    subtitle: 'Available in selected areas',
    accent: '#C08A2E',
    tint: '#FBF2DF',
  },
  {
    icon: RefreshCw,
    title: '30-Day Returns',
    subtitle: 'Easy, hassle-free returns',
    accent: '#2F5FE3',
    tint: '#EAF0FF',
  },
]

export function TrustStrip() {
  return (
    <section className="bg-[#F7F8FA] py-10 md:py-14">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-12">
        <ul
          role="list"
          className="grid grid-cols-2 gap-px overflow-hidden rounded-[28px] border border-[#12203D]/[0.08] bg-[#12203D]/[0.06] md:grid-cols-4"
        >
          {trustItems.map((item, i) => (
            <li
              key={i}
              className="group flex items-start gap-4 bg-white p-5 transition-colors duration-300 ease-out hover:bg-[#FAFBFC] md:p-6"
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
                style={{ backgroundColor: item.tint }}
              >
                <item.icon size={20} strokeWidth={2.2} style={{ color: item.accent }} />
              </span>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold tracking-tight text-[#12203D] md:text-sm">
                  {item.title}
                </span>
                <span className="mt-0.5 text-[11px] font-medium leading-snug text-[#475569] md:text-xs">
                  {item.subtitle}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function Preview() {
  return (
    <div style={{ background: '#F4F5F7', minHeight: '100%', paddingTop: 24, paddingBottom: 24 }}>
      <TrustStrip />
    </div>
  )
}