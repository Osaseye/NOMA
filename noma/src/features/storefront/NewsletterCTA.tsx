import { ArrowRight, WhatsappLogo } from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { brand } from '../../constants/brand'
import { useAdminStore } from '../../store/adminStore'

export function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const { settings } = useAdminStore()
  const whatsappDigits = settings.whatsappNumber?.replace(/\D/g, '')
  const whatsappUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : brand.whatsapp

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = email.trim()
    if (!clean || !clean.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }
    toast.success('Welcome! You are now subscribed to Noma updates.')
    setEmail('')
  }

  return (
    <section>
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 sm:gap-5">
          {/* Left 6 Cols: Visual Wholesale & Bulk Buyer CTA */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-slate-950 p-6 text-white sm:p-10 lg:col-span-6">
            <img
              src="/images/cat-clothing.png"
              alt="Bulk and wholesale footwear and fashion"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <div className="relative z-10 max-w-md">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Wholesale &amp; Reseller Desk
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Buying shoes or fashion in bulk?
              </h2>
              <p className="mt-2.5 text-xs leading-relaxed text-white/80 sm:text-sm">
                Get direct wholesale bale pricing, custom quantity quotes, and priority nationwide dispatch from our team.
              </p>
            </div>

            <div className="relative z-10 mt-6">
              <a
                href={`${whatsappUrl}?text=${encodeURIComponent('Hello Noma Wholesale Desk, I want to request bulk pricing.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold text-slate-950 transition-transform hover:scale-[1.01] hover:bg-slate-100"
              >
                <WhatsappLogo size={17} weight="fill" className="text-emerald-600" />
                <span>Request Bulk Quote on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right 6 Cols: Sleek Minimalist New Arrivals & Deals Club Signup */}
          <div className="flex flex-col justify-between rounded-2xl bg-[#F4F4F5] p-6 sm:p-10 lg:col-span-6">
            <div className="max-w-md">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Noma Insider
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                First access to new drops &amp; restocks.
              </h2>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                Join our mailing list for early notifications when new footwear, clothing, and home essentials arrive.
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="mt-6 flex w-full max-w-lg flex-col gap-2.5 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="h-11 flex-1 rounded-full border border-slate-300 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-slate-900 px-6 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              >
                <span>Join Now</span>
                <ArrowRight size={14} weight="bold" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
