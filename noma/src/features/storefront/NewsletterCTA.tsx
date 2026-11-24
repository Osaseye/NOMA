import { useState } from 'react'
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
    toast.success('You are subscribed to Noma updates and new arrivals.')
    setEmail('')
  }

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 lg:flex-row lg:items-center lg:p-10">
          <div className="max-w-lg">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Stay in the loop on new arrivals &amp; bulk deals
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500 sm:text-sm">
              Be the first to know when fresh footwear bales, fashion drops, and home appliances arrive.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex w-full max-w-md flex-col gap-2.5 sm:flex-row"
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
              className="h-11 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1049EB] focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#1049EB] px-6 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#0D3BC2]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
