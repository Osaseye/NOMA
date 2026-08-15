import { ChevronDown, Mail, MessageCircle, Phone } from 'lucide-react'
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
        {/* ── CONTACT / HELP & SUPPORT matching Section 4 of ChatGPT Image ── */}
        {type === 'contact' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Column 1: Contact Us */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-6">
              <h3 className="text-base font-extrabold text-[#12203D]">Contact Us</h3>

              {/* WhatsApp Card */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#12203D]">Chat with us on WhatsApp</h4>
                    <p className="text-[11px] text-gray-500">Get quick answers to your questions</p>
                  </div>
                </div>
                <a
                  href={brand.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition-colors"
                >
                  <MessageCircle size={14} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Call Us */}
              <div className="flex items-start gap-3 pt-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2F5FE3]">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#12203D]">Call Us</h4>
                  <p className="text-[11px] text-gray-400">Mon - Sat (8am - 8pm)</p>
                  <span className="text-xs font-black text-[#12203D] mt-0.5 block">
                    0901 234 5678
                  </span>
                </div>
              </div>

              {/* Email Us */}
              <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2F5FE3]">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#12203D]">Email Us</h4>
                  <span className="text-xs font-extrabold text-[#2F5FE3] block">support@noma.ng</span>
                  <p className="text-[11px] text-gray-400 mt-0.5">We usually respond within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Column 2: Popular Topics */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-[#12203D]">Popular Topics</h3>
              <div className="space-y-2 text-xs font-semibold text-gray-700">
                {[
                  'How do I place an order?',
                  'How do I track my order?',
                  'Delivery & Shipping',
                  'Returns & Refunds',
                  'Payment Methods',
                ].map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => setOpenFaq(i)}
                    className="flex w-full items-center justify-between rounded-xl bg-gray-50/80 px-4 py-3 text-left hover:bg-blue-50/70 hover:text-[#2F5FE3] transition-colors"
                  >
                    <span>{topic}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: Start a Conversation Live Chat Box */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#12203D] mb-3">Start a Conversation</h3>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5 flex items-center gap-3 mb-4">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                      alt="Agent"
                      className="h-10 w-10 rounded-full object-cover border-2 border-white"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#12203D]">Chat with Noma Support</h4>
                    <p className="text-[10px] text-gray-500">We typically reply in a few minutes</p>
                  </div>
                </div>

                {/* Chat Bubbles */}
                <div className="space-y-3 text-xs">
                  <div className="rounded-2xl rounded-tl-xs bg-gray-100 p-3 max-w-[85%] font-medium text-gray-800">
                    Hello! How can we help you today?
                    <span className="block text-[9px] text-gray-400 mt-1">10:30 AM</span>
                  </div>

                  <div className="rounded-2xl rounded-tr-xs bg-[#2F5FE3] p-3 max-w-[85%] ml-auto font-medium text-white shadow-2xs">
                    I need help with my order
                    <span className="block text-[9px] text-blue-200 mt-1">10:31 AM</span>
                  </div>

                  <div className="rounded-2xl rounded-tl-xs bg-gray-100 p-3 max-w-[85%] font-medium text-gray-800">
                    Sure! Please share your order number and we'll assist you right away.
                    <span className="block text-[9px] text-gray-400 mt-1">10:31 AM</span>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="pt-3 border-t border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full rounded-full border border-gray-200 bg-gray-50/70 pl-4 pr-10 py-2.5 text-xs outline-none focus:border-[#2F5FE3]"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#2F5FE3] p-1.5 text-white shadow-2xs hover:bg-[#254ec4]">
                    <MessageCircle size={13} />
                  </button>
                </div>
              </div>
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
