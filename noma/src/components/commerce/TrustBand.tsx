import { Clock, RefreshCw, ShieldCheck, Truck, Wallet } from 'lucide-react'

const trustItems = [
  {
    icon: Truck,
    title: 'Delivery Fee\nUpfront',
  },
  {
    icon: Clock,
    title: '2-5 Days\nDelivery',
  },
  {
    icon: Wallet,
    title: 'Pay on Delivery\n(Selected Areas)',
  },
  {
    icon: RefreshCw,
    title: '30-Day\nReturns',
  },
  {
    icon: ShieldCheck,
    title: 'Secure\nPayments',
  },
]

export function TrustBand() {
  return (
    <section className="border-y border-black/5 bg-white py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 overflow-x-auto px-6 md:px-8">
        {trustItems.map((item, index) => (
          <div
            key={index}
            className="flex shrink-0 items-center gap-2.5 px-3 py-2"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[#2F5FE3]">
              <item.icon size={17} strokeWidth={1.8} />
            </span>
            <span className="whitespace-pre-line text-[11px] font-semibold leading-snug text-[#0B1B33]">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
