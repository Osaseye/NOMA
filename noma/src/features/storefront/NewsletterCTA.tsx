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
    <section className="bg-white">
      <div className="mx-auto max-w-[1600px] border-x border-[#E4E4E7]">
        <div className="grid grid-cols-1 divide-y divide-[#E4E4E7] lg:grid-cols-12 lg:divide-x lg:divide-y-0">
          {/* Left 6 Cols: Copy & Verified Rating */}
          <div className="flex flex-col justify-between bg-[#FAFAFA] p-6 sm:p-10 lg:col-span-6">
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1049EB]">
                06 / DISPATCH &amp; RESTOCK ALERTS
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#09090B] sm:text-3xl">
                Get restock &amp; Naira price-drop dispatches.
              </h2>
              <p className="mt-2.5 max-w-[52ch] text-xs leading-relaxed text-[#52525B] sm:text-sm">
                Receive direct inventory notifications when high-demand appliances restock or daily Naira price drops go live.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 border-t border-[#E4E4E7] pt-4 text-xs font-semibold text-[#09090B]">
              <Star size={15} weight="fill" className="text-[#FEB719]" />
              <span className="font-mono font-bold">4.9 / 5.0</span>
              <span className="text-[#71717A]">&mdash; RATED BY VERIFIED NIGERIAN HOMES</span>
            </div>
          </div>

          {/* Right 6 Cols: Architectural Form Control */}
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-6">
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address for restock alerts
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER EMAIL ADDRESS (YOU@DOMAIN.COM)"
                required
                className="h-12 flex-1 border border-[#E4E4E7] bg-[#F4F4F5] px-4 font-mono text-xs text-[#09090B] placeholder:text-[#71717A] focus:border-[#09090B] focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-12 shrink-0 items-center justify-center bg-[#09090B] px-7 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#1049EB]"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-[#71717A]">
              <span>ZERO SPAM. UNSUBSCRIBE ANYTIME.</span>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1 font-semibold uppercase text-[#09090B] hover:text-[#1049EB]"
              >
                <span>BROWSE FULL INDEX</span>
                <ArrowRight size={13} weight="regular" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
