import { ArrowRight, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatNaira } from '../../utils/pricing'

const flashDeals = [
  {
    id: 'fd1',
    name: 'Sumec Firman Generator 2.5KVA',
    image: '/products/generator.png',
    originalPrice: 380000,
    dealPrice: 320000,
    slug: 'sumec-firman-generator',
  },
  {
    id: 'fd2',
    name: 'Xiaomi Smart Air Fryer 5L',
    image: '/products/air-fryer.png',
    originalPrice: 120000,
    dealPrice: 95000,
    slug: 'xiaomi-smart-air-fryer',
  },
  {
    id: 'fd3',
    name: 'Nonstick Cookware Set 12pc',
    image: '/products/cookware.png',
    originalPrice: 88000,
    dealPrice: 72000,
    slug: 'non-stick-cookware-set',
  },
]

function useCountdown() {
  const getTimeLeft = () => {
    const now = new Date()
    const midnight = new Date()
    midnight.setHours(23, 59, 59, 999)
    const diff = midnight.getTime() - now.getTime()
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return { h, m, s }
  }
  const [time, setTime] = useState(getTimeLeft())
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#12203D] bg-white text-2xl font-black text-[#12203D] shadow-[4px_4px_0_0_#12203D] md:h-16 md:w-16 md:text-3xl">
        {String(value).padStart(2, '0')}
      </div>
      <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#12203D]/60">{label}</span>
    </div>
  )
}

export function FlashDeals() {
  const { h, m, s } = useCountdown()

  return (
    <section className="bg-[#F9F9F6] py-16 md:py-24 border-y border-[#12203D]/10">
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8 lg:px-12">
        {/* Header Block */}
        <div className="mb-12 flex flex-col justify-between gap-8 border-b border-[#12203D]/10 pb-8 md:flex-row md:items-end">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F44336] shadow-[4px_4px_0_0_#12203D] border-2 border-[#12203D]">
                <Zap size={24} className="fill-white text-white" strokeWidth={0} />
              </div>
              <h2 className="font-['Outfit'] text-[2.5rem] font-black leading-none tracking-tight text-[#12203D] md:text-[4rem]">
                FLASH DEALS
              </h2>
            </div>
            <p className="text-[14px] font-bold uppercase tracking-widest text-[#12203D]/50">
              Limited time offers • Ends at midnight
            </p>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <Digit value={h} label="hrs" />
            <span className="mb-6 text-3xl font-black text-[#12203D] md:text-4xl">:</span>
            <Digit value={m} label="min" />
            <span className="mb-6 text-3xl font-black text-[#12203D] md:text-4xl">:</span>
            <Digit value={s} label="sec" />
          </div>
        </div>

        {/* Deal Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {flashDeals.map((deal) => {
            const pct = Math.round(((deal.originalPrice - deal.dealPrice) / deal.originalPrice) * 100)
            return (
              <Link
                key={deal.id}
                to={`/product/${deal.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border-2 border-[#12203D] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#12203D]"
              >
                {/* Discount Badge */}
                <div className="absolute right-0 top-0 z-10 flex h-12 w-16 items-center justify-center rounded-bl-3xl border-b-2 border-l-2 border-[#12203D] bg-[#F44336] text-[15px] font-black text-white">
                  -{pct}%
                </div>
                
                {/* Image */}
                <div className="flex h-[240px] items-center justify-center border-b-2 border-[#12203D] bg-[#F7F8FA] p-6">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* Info */}
                <div className="flex flex-col p-6">
                  <span className="mb-4 line-clamp-2 text-[15px] font-bold text-[#12203D]">
                    {deal.name}
                  </span>
                  <div className="mt-auto flex items-end gap-3">
                    <span className="text-2xl font-black tracking-tight text-[#12203D]">{formatNaira(deal.dealPrice)}</span>
                    <span className="mb-1 text-[13px] font-bold text-[#12203D]/40 line-through">{formatNaira(deal.originalPrice)}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#12203D] bg-[#12203D] px-8 py-4 text-[13px] font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-[#12203D] hover:shadow-[4px_4px_0_0_#12203D]"
          >
            View All Deals <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  )
}
