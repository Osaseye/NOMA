import { ChevronDown, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'
import { brand } from '../../constants/brand'

const copy = {
  about: {
    title: 'About Noma',
    subtitle: `Noma is a Nigerian retail brand operated under ${brand.legalEntity}, built for clear pricing, responsive support, and practical everyday shopping.`,
  },
  contact: {
    title: 'Contact Noma',
    subtitle: 'We are here to help. Reach out to us for product questions, order support, or delivery updates.',
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions about ordering, delivery, and returns.',
  },
  policies: {
    title: 'Our Policies',
    subtitle: 'Everything you need to know about delivery, returns, and how we handle your data.',
  },
  account: {
    title: 'My Account',
    subtitle: 'Manage your orders and preferences.',
  },
}

export function StaticInfoPage({ type }: { type: keyof typeof copy }) {
  const { title, subtitle } = copy[type]
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [activeTab, setActiveTab] = useState('delivery')

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="h-[88px]" />
      
      {/* Hero section */}
      <div className="bg-[#12203D] py-16 text-center text-white md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h1 className="text-[2rem] font-extrabold tracking-tight md:text-[3rem]">{title}</h1>
          <p className="mt-4 text-[15px] font-medium leading-relaxed text-white/60 md:text-[17px]">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8 lg:px-12">
        {/* ── ABOUT ── */}
        {type === 'about' && (
          <div className="flex flex-col gap-8 rounded-3xl bg-white p-8 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.06)] md:p-12 text-[15px] leading-relaxed text-[#12203D]/70">
            <p>
              At <strong className="text-[#12203D]">{brand.name}</strong>, we believe shopping for your home should be simple, transparent, and completely stress-free. Operated by {brand.legalEntity}, we started this journey to eliminate the hidden fees and delivery uncertainties that often come with online shopping in Nigeria.
            </p>
            <p>
              Whether you are upgrading your kitchen appliances, grabbing the latest electronics, or shopping for everyday home essentials, our promise remains the same: <strong className="text-[#12203D]">What you see is what you pay.</strong>
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-4">
              <div className="rounded-2xl bg-[#F7F8FA] p-6 text-center">
                <h3 className="text-lg font-extrabold text-[#12203D] mb-2">100% Authentic</h3>
                <p className="text-[13px]">Every item is sourced directly from verified manufacturers and distributors.</p>
              </div>
              <div className="rounded-2xl bg-[#F7F8FA] p-6 text-center">
                <h3 className="text-lg font-extrabold text-[#12203D] mb-2">Honest Pricing</h3>
                <p className="text-[13px]">Your delivery fee is calculated and confirmed before you pay a dime.</p>
              </div>
              <div className="rounded-2xl bg-[#F7F8FA] p-6 text-center">
                <h3 className="text-lg font-extrabold text-[#12203D] mb-2">Fast Support</h3>
                <p className="text-[13px]">Our WhatsApp support team is always ready to answer your questions.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── CONTACT ── */}
        {type === 'contact' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
            <div className="rounded-3xl bg-white p-8 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.06)] md:p-10">
              <h2 className="mb-6 text-xl font-bold text-[#12203D]">Send us a message</h2>
              <form className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input placeholder="Full Name" className="rounded-2xl border border-black/8 bg-[#F7F8FA] px-4 py-3.5 text-[14px] font-medium text-[#12203D] outline-none transition-all focus:border-[#2F5FE3]/30 focus:bg-white" />
                  <input placeholder="Email Address" className="rounded-2xl border border-black/8 bg-[#F7F8FA] px-4 py-3.5 text-[14px] font-medium text-[#12203D] outline-none transition-all focus:border-[#2F5FE3]/30 focus:bg-white" />
                </div>
                <input placeholder="Order Number (Optional)" className="rounded-2xl border border-black/8 bg-[#F7F8FA] px-4 py-3.5 text-[14px] font-medium text-[#12203D] outline-none transition-all focus:border-[#2F5FE3]/30 focus:bg-white" />
                <textarea rows={5} placeholder="How can we help you?" className="resize-none rounded-2xl border border-black/8 bg-[#F7F8FA] p-4 text-[14px] font-medium text-[#12203D] outline-none transition-all focus:border-[#2F5FE3]/30 focus:bg-white" />
                <button className="mt-2 rounded-2xl bg-[#2F5FE3] py-4 text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(47,95,227,0.3)] hover:bg-[#2348C0]">
                  Send Message
                </button>
              </form>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="rounded-3xl bg-[#12203D] p-8 text-white shadow-[0_4px_16px_-8px_rgba(0,0,0,0.06)] md:p-10">
                <h2 className="mb-6 text-lg font-bold">Contact Info</h2>
                <div className="flex flex-col gap-5 text-[14px] text-white/70">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10"><Phone size={18} /></div>
                    <span>{brand.phone}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10"><Mail size={18} /></div>
                    <span>support@shopnoma.com</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10"><MapPin size={18} /></div>
                    <span>Lagos, Nigeria</span>
                  </div>
                </div>
              </div>
              <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 rounded-3xl bg-[#25D366] p-8 text-white shadow-[0_4px_16px_-8px_rgba(37,211,102,0.3)] transition-all hover:bg-[#1fba59] md:p-10">
                <div className="flex flex-col items-center text-center">
                  <MessageCircle size={32} className="mb-3" />
                  <span className="text-[18px] font-extrabold tracking-tight">Chat with us on WhatsApp</span>
                  <span className="mt-1 text-[13px] font-medium text-white/80">Fastest response time</span>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        {type === 'faq' && (
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            {[
              { q: 'How is the delivery fee calculated?', a: 'Delivery fees are calculated based on your exact location and the size (bulkiness) of your items. The final fee is always displayed transparently on the checkout page before you make any payment.' },
              { q: 'Do you offer Pay on Delivery?', a: 'Yes! Pay on Delivery is available for selected areas in Lagos. You can choose this option at checkout if your address qualifies.' },
              { q: 'How long does delivery take?', a: 'Standard delivery takes 2–5 business days depending on your location. We also offer an Express 1–2 day delivery option for an additional fee in major cities.' },
              { q: 'What is your return policy?', a: 'We offer a hassle-free 30-day return policy for items that are defective, damaged, or significantly different from the description. Contact our support team to initiate a return.' },
              { q: 'Are your products authentic?', a: 'Absolutely. We only source directly from official manufacturers and authorized distributors. Every product is 100% authentic and comes with a standard warranty.' },
            ].map((faq, i) => (
              <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_-8px_rgba(0,0,0,0.04)]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-6 text-left text-[16px] font-bold text-[#12203D]"
                >
                  {faq.q}
                  <ChevronDown size={18} className={`shrink-0 text-[#12203D]/40 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-[14px] leading-relaxed text-[#12203D]/60 border-t border-black/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── POLICIES ── */}
        {type === 'policies' && (
          <div className="rounded-3xl bg-white p-6 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.06)] md:p-10">
            <div className="mb-8 flex gap-4 overflow-x-auto border-b border-black/5 pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { id: 'delivery', label: 'Delivery Policy' },
                { id: 'returns', label: 'Returns & Refunds' },
                { id: 'privacy', label: 'Privacy Policy' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative shrink-0 pb-4 text-[14px] font-bold transition-colors ${activeTab === tab.id ? 'text-[#2F5FE3]' : 'text-[#12203D]/50 hover:text-[#12203D]'}`}
                >
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#2F5FE3] rounded-t-full" />}
                </button>
              ))}
            </div>

            <div className="prose prose-sm max-w-none text-[#12203D]/70">
              {activeTab === 'delivery' && (
                <>
                  <h3 className="text-lg font-bold text-[#12203D]">Delivery Timelines & Fees</h3>
                  <p>Customer-facing screens show final prices only. We ensure that your delivery fee is fully calculated and transparently displayed on the checkout page before you complete your purchase.</p>
                  <p>Standard deliveries occur within 2-5 business days. Remote locations may require additional time. Bulky items (such as large refrigerators or generators) may incur a specialized freight charge, which is always communicated upfront.</p>
                </>
              )}
              {activeTab === 'returns' && (
                <>
                  <h3 className="text-lg font-bold text-[#12203D]">30-Day Return Guarantee</h3>
                  <p>If you receive a defective item, you have 30 days from the date of delivery to request a return or exchange. Items must be in their original packaging with all accessories and manuals included.</p>
                  <p>Refunds are processed to your original payment method within 3-5 business days after we receive and inspect the returned item.</p>
                </>
              )}
              {activeTab === 'privacy' && (
                <>
                  <h3 className="text-lg font-bold text-[#12203D]">Data Protection</h3>
                  <p>Your privacy is important to us. We collect your name, email, phone number, and delivery address solely for the purpose of fulfilling your order and providing customer support.</p>
                  <p>Payments are securely processed via certified third-party payment gateways (Paystack/Flutterwave). We do not store your raw credit card details on our servers.</p>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* ── ACCOUNT ── */}
        {type === 'account' && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-xl font-bold text-[#12203D]">Guest Checkout Default</h2>
            <p className="mt-3 max-w-md text-[14px] text-[#12203D]/60">
              Noma uses a lightweight guest checkout by default so you can shop faster. Account creation for order history and saved addresses will be available in a future update.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
