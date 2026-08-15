// TrustStrip.tsx
import {
  HiOutlineTruck,
  HiOutlineClock,
  HiOutlineCreditCard,
  HiOutlineArrowPath,
  HiOutlineShieldCheck,
} from 'react-icons/hi2'

const trustItems = [
  {
    icon: HiOutlineTruck,
    title: 'Delivery Fee Upfront',
  },
  {
    icon: HiOutlineClock,
    title: '2–5 Days Delivery',
  },
  {
    icon: HiOutlineCreditCard,
    title: 'Pay on Delivery (Selected Areas)',
  },
  {
    icon: HiOutlineArrowPath,
    title: '30-Day Returns',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Secure Payments',
  },
]

export function TrustStrip() {
  return (
    <section className="relative z-20 -mt-10 sm:-mt-12 md:-mt-14 lg:-mt-16 bg-transparent pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="rounded-2xl md:rounded-3xl bg-white border border-gray-100/90 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-4 md:p-6 flex items-center justify-between gap-4 overflow-x-auto md:overflow-x-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className={`flex shrink-0 items-center gap-3 ${
                index !== trustItems.length - 1
                  ? 'md:border-r md:border-gray-100 md:pr-4 lg:pr-6'
                  : ''
              }`}
            >
              <item.icon className="text-xl md:text-2xl text-[#2F5FE3] shrink-0 stroke-[1.8]" />
              <span className="text-[12px] font-bold text-[#12203D] leading-tight whitespace-nowrap">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}