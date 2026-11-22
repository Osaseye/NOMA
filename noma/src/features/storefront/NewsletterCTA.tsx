import { ArrowRight, Star } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export function NewsletterCTA() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = email.trim()
    if (!clean || !clean.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }
    toast.success('Subscribed to Noma restock and price-drop alerts.')
    setEmail('')
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-8 rounded-[10px] border border-[#E5E7EB] bg-[#F6F7F9] p-6 sm:p-8 lg:grid-cols-12 lg:p-10">
          {/* Left Copy & Verified Rating */}
          <div className="space-y-3 lg:col-span-6">
            <h2 className="text-2xl font-bold tracking-tight text-[#0B1220] md:text-[1.75rem]">
              Get restock &amp; price drop alerts
            </h2>
            <p className="max-w-[52ch] text-sm leading-[1.6] text-[#374151]">
              Receive brief alerts when popular electronics restock or daily Naira price drops go live.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-[#0B1220]">
              <Star size={16} weight="fill" className="text-[#FEB719]" />
              <span className="font-mono font-bold">4.9 / 5</span>
              <span className="text-[#5E6675]">rated by verified Nigerian homes</span>
            </div>
          </div>

          {/* Right Form Control & Catalog Link */}
          <div className="space-y-3 lg:col-span-6">
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address for restock alerts
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="h-11 flex-1 rounded-[6px] border border-[#D1D5DB] bg-white px-3.5 text-sm text-[#0B1220] placeholder:text-[#5E6675]/70 focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
              />
              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-[6px] bg-[#0B1220] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1E293B] active:scale-[0.98]"
              >
                Subscribe
              </button>
            </form>

            <div className="flex items-center justify-between text-xs text-[#5E6675]">
              <span>Zero spam. Unsubscribe anytime.</span>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1 font-semibold text-[#1049EB] hover:text-[#0D3BC2] hover:underline"
              >
                <span>Browse All Products</span>
                <ArrowRight size={13} weight="regular" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
