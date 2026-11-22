import {
  ArrowsCounterClockwise,
  CaretRight,
  ChatCircleDots,
  Envelope,
  FileText,
  Headset,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  Truck,
  WhatsappLogo,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { brand } from '../../constants/brand'
import { useAdminStore } from '../../store/adminStore'

const copy = {
  about: {
    title: 'About Noma',
    subtitle: `Noma is a Nigerian retail platform operated under ${brand.legalEntity}, built for transparent pricing and reliable doorstep delivery.`,
  },
  contact: {
    title: 'Contact Noma',
    subtitle:
      'Reach our customer desk for product specifications, order status updates, or state delivery estimates.',
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Clear answers about Nigerian delivery fees, payment methods, and returns.',
  },
  returns: {
    title: 'Returns & Refunds Policy',
    subtitle: 'Details on our 30-day return eligibility, inspection, and refund timelines.',
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How Noma collects, secures, and manages your personal order information.',
  },
  terms: {
    title: 'Terms of Service',
    subtitle: 'Terms and guidelines governing shopping and order fulfillment on Noma.',
  },
  delivery: {
    title: 'Delivery & Shipping Policy',
    subtitle: 'Delivery zones, dispatch timelines, and upfront fee estimation across Nigeria.',
  },
  policies: {
    title: 'Our Policies',
    subtitle: 'Delivery standards, 30-day returns, and data protection guidelines.',
  },
  account: {
    title: 'My Account',
    subtitle: 'Manage your saved delivery addresses and order history.',
  },
}

const FAQ_ITEMS = [
  {
    q: 'How is the delivery fee calculated?',
    a: 'Delivery fees are calculated dynamically from your Nigerian state and whether an item requires heavy freight handling. The final fee is always displayed upfront on checkout before payment.',
  },
  {
    q: 'Do you offer Pay on Delivery?',
    a: 'Yes. Pay on Delivery is available for verified addresses in eligible metro areas and can be selected directly at checkout.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 2-5 business days depending on state corridor. Express 1-2 day dispatch is available in major hubs.',
  },
  {
    q: 'What is your return policy?',
    a: 'Eligible unused items in original packaging can be returned within 30 days of delivery if defective, damaged in transit, or not as described.',
  },
  {
    q: 'Are your products authentic?',
    a: 'Yes. Every item is sourced from verified distributors and includes a 1-year distributor warranty.',
  },
]

export function StaticInfoPage({ type }: { type: keyof typeof copy }) {
  const { settings } = useAdminStore()
  const { title, subtitle } = copy[type] || copy.about
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [activeTab, setActiveTab] = useState<'delivery' | 'returns' | 'privacy'>(
    type === 'returns' ? 'returns' : type === 'privacy' ? 'privacy' : 'delivery'
  )

  const supportPhone = settings.supportPhone || brand.phone
  const supportEmail = settings.supportEmail || brand.supportEmail
  const whatsappDigits = (settings.whatsappNumber || brand.whatsappNumber).replace(/\D/g, '')
  const whatsappUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : brand.whatsapp

  return (
    <div className="min-h-screen bg-[#F6F7F9] pb-20 text-[#0B1220]">
      {/* Light Editorial Header */}
      <div className="border-b border-[#E5E7EB] bg-white py-12 text-center md:py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B1220] md:text-4xl">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-[60ch] text-sm leading-[1.6] text-[#374151] md:text-[15px]">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8">
        {/* ABOUT */}
        {type === 'about' ? (
          <div className="space-y-8 rounded-[8px] border border-[#E5E7EB] bg-white p-6 sm:p-10">
            <div className="max-w-[65ch] space-y-4 text-sm leading-[1.65] text-[#374151] md:text-[15px]">
              <p>
                At <strong className="text-[#0B1220]">{brand.name}</strong>, operated by{' '}
                {brand.legalEntity}, shopping for home electronics and kitchen appliances is built around upfront clarity with zero hidden dispatch surprises.
              </p>
              <p>
                Every item lists final Naira pricing and calculates Nigerian delivery fees before checkout. <strong className="text-[#0B1220]">What you see is what you pay.</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 border-t border-[#E5E7EB] pt-6 md:grid-cols-3">
              <div className="rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-5">
                <ShieldCheck size={22} weight="fill" className="mb-3 text-[#1049EB]" />
                <h2 className="text-sm font-bold text-[#0B1220]">100% Authentic</h2>
                <p className="mt-1 text-xs leading-relaxed text-[#5E6675]">
                  Sourced directly from authorized Nigerian distributors with warranty coverage.
                </p>
              </div>
              <div className="rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-5">
                <Truck size={22} weight="regular" className="mb-3 text-[#1049EB]" />
                <h2 className="text-sm font-bold text-[#0B1220]">Upfront Shipping</h2>
                <p className="mt-1 text-xs leading-relaxed text-[#5E6675]">
                  State and freight rates are calculated transparently before you pay.
                </p>
              </div>
              <div className="rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-5">
                <ChatCircleDots size={22} weight="regular" className="mb-3 text-[#1049EB]" />
                <h2 className="text-sm font-bold text-[#0B1220]">Human Desk Support</h2>
                <p className="mt-1 text-xs leading-relaxed text-[#5E6675]">
                  Speak directly with specialists via WhatsApp, phone, or email.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* CONTACT */}
        {type === 'contact' ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Column 1: Direct Contact */}
            <div className="space-y-5 rounded-[8px] border border-[#E5E7EB] bg-white p-6">
              <h2 className="border-b border-[#E5E7EB] pb-3 text-base font-bold text-[#0B1220]">
                Direct Channels
              </h2>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-[#EEF3FE] text-[#1049EB]">
                  <Phone size={17} weight="regular" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#0B1220]">Call Support</h3>
                  <p className="text-[11px] text-[#5E6675]">Mon - Sat (8:00 AM - 8:00 PM)</p>
                  <a
                    href={`tel:${supportPhone.replace(/\s+/g, '')}`}
                    className="mt-0.5 block font-mono text-xs font-bold text-[#0B1220] hover:text-[#1049EB]"
                  >
                    {supportPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-[#E5E7EB] pt-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-[#EEF3FE] text-[#1049EB]">
                  <Envelope size={17} weight="regular" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#0B1220]">Email Support</h3>
                  <a
                    href={`mailto:${supportEmail}`}
                    className="mt-0.5 block text-xs font-semibold text-[#1049EB] hover:underline"
                  >
                    {supportEmail}
                  </a>
                  <p className="mt-0.5 text-[11px] text-[#5E6675]">Responses within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Help Topics */}
            <div className="space-y-4 rounded-[8px] border border-[#E5E7EB] bg-white p-6">
              <h2 className="border-b border-[#E5E7EB] pb-3 text-base font-bold text-[#0B1220]">
                Popular Questions
              </h2>
              <div className="divide-y divide-[#E5E7EB]">
                {FAQ_ITEMS.slice(0, 4).map((item, idx) => (
                  <button
                    key={item.q}
                    type="button"
                    onClick={() => setOpenFaq(idx)}
                    className="flex w-full items-center justify-between gap-2 py-2.5 text-left text-xs font-semibold text-[#374151] transition-colors hover:text-[#1049EB]"
                  >
                    <span>{item.q}</span>
                    <CaretRight size={13} weight="regular" className="shrink-0 text-[#5E6675]" />
                  </button>
                ))}
              </div>
              {openFaq !== null && FAQ_ITEMS[openFaq] ? (
                <div className="rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] p-3 text-xs leading-relaxed text-[#374151]">
                  {FAQ_ITEMS[openFaq].a}
                </div>
              ) : null}
            </div>

            {/* Column 3: Noma Care Desk (Phosphor Headset Badge - No Unsplash Avatar) */}
            <div className="flex flex-col justify-between space-y-5 rounded-[8px] border border-[#E5E7EB] bg-white p-6">
              <div className="space-y-4">
                <h2 className="border-b border-[#E5E7EB] pb-3 text-base font-bold text-[#0B1220]">
                  Customer Service
                </h2>

                <div className="flex items-center gap-3 rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-[#1049EB]/25 bg-[#EEF3FE] text-[#1049EB]">
                    <Headset size={20} weight="regular" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0B1220]">Noma Care Desk</h3>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#15803D]">
                      <span className="h-1.5 w-1.5 rounded-[2px] bg-[#15803D]" />
                      <span>Support agents on standby</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-[#5E6675]">
                  Need help confirming product compatibility or delivery status? Chat directly with our team on WhatsApp.
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#0B1220] py-3 text-xs font-semibold text-white transition-colors hover:bg-[#1049EB]"
              >
                <WhatsappLogo size={16} weight="fill" className="text-[#25D366]" />
                <span>Chat Live on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : null}

        {/* FAQ (Clean border-bottom accordion with Plus/Minus) */}
        {type === 'faq' ? (
          <div className="mx-auto max-w-3xl divide-y divide-[#E5E7EB] rounded-[8px] border border-[#E5E7EB] bg-white">
            {FAQ_ITEMS.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <div key={faq.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold text-[#0B1220] transition-colors hover:bg-[#F6F7F9] sm:px-6"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <Minus size={16} weight="regular" className="shrink-0 text-[#1049EB]" />
                    ) : (
                      <Plus size={16} weight="regular" className="shrink-0 text-[#5E6675]" />
                    )}
                  </button>
                  {isOpen ? (
                    <div className="border-t border-[#E5E7EB] bg-[#F6F7F9] px-5 py-4 text-sm leading-[1.6] text-[#374151] sm:px-6">
                      {faq.a}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : null}

        {/* RETURNS */}
        {type === 'returns' ? (
          <div className="space-y-6 rounded-[8px] border border-[#E5E7EB] bg-white p-6 sm:p-10">
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#1049EB]/25 bg-[#EEF3FE] text-[#1049EB]">
                <ArrowsCounterClockwise size={20} weight="regular" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0B1220]">30-Day Return Guarantee</h2>
                <p className="text-xs text-[#5E6675]">Hassle-free returns on eligible items</p>
              </div>
            </div>

            <div className="max-w-[65ch] space-y-4 text-sm leading-[1.65] text-[#374151]">
              <h3 className="text-base font-bold text-[#0B1220]">Eligibility Criteria</h3>
              <p>
                Items can be returned within 30 days of delivery if they arrive defective, damaged in transit, or missing parts. Returned items must remain unused in original packaging with all manuals and seals intact.
              </p>

              <h3 className="text-base font-bold text-[#0B1220]">How to Request a Return</h3>
              <ol className="list-decimal space-y-1.5 pl-5">
                <li>
                  Contact support on WhatsApp or email{' '}
                  <strong className="text-[#0B1220]">{supportEmail}</strong> with your Order ID and photo or video proof.
                </li>
                <li>Our team reviews your request within 24 hours and schedules pickup.</li>
                <li>
                  Once verified at our logistics hub, your refund or replacement is issued promptly.
                </li>
              </ol>

              <h3 className="text-base font-bold text-[#0B1220]">Refund Processing</h3>
              <p>
                Refunds are credited to your original payment account within 3-5 business days after inspection approval.
              </p>
            </div>
          </div>
        ) : null}

        {/* PRIVACY */}
        {type === 'privacy' ? (
          <div className="space-y-6 rounded-[8px] border border-[#E5E7EB] bg-white p-6 sm:p-10">
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]">
                <ShieldCheck size={20} weight="fill" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0B1220]">Privacy &amp; Data Security</h2>
                <p className="text-xs text-[#5E6675]">How we protect your personal information</p>
              </div>
            </div>

            <div className="max-w-[65ch] space-y-4 text-sm leading-[1.65] text-[#374151]">
              <h3 className="text-base font-bold text-[#0B1220]">Information We Collect</h3>
              <p>
                When you place an order or create a Noma account, we collect your name, email address, phone number, and Nigerian delivery destination solely to fulfill your orders.
              </p>
              <h3 className="text-base font-bold text-[#0B1220]">Payment Data Protection</h3>
              <p>
                Noma uses PCI-DSS compliant payment infrastructure. Raw card numbers and banking PINs are never stored on our servers.
              </p>
              <h3 className="text-base font-bold text-[#0B1220]">Your Rights</h3>
              <p>
                You may request updates or deletion of your personal profile anytime by contacting{' '}
                <strong className="text-[#0B1220]">{supportEmail}</strong>.
              </p>
            </div>
          </div>
        ) : null}

        {/* TERMS */}
        {type === 'terms' ? (
          <div className="space-y-6 rounded-[8px] border border-[#E5E7EB] bg-white p-6 sm:p-10">
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] text-[#0B1220]">
                <FileText size={20} weight="regular" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0B1220]">Terms of Service</h2>
                <p className="text-xs text-[#5E6675]">
                  Operating guidelines for shopping on Noma
                </p>
              </div>
            </div>

            <div className="max-w-[65ch] space-y-4 text-sm leading-[1.65] text-[#374151]">
              <h3 className="text-base font-bold text-[#0B1220]">Store Operations</h3>
              <p>
                Noma operates under {brand.legalEntity}. By accessing or placing an order on Noma, you agree to comply with our checkout terms, transparent pricing rules, and delivery policies.
              </p>
              <h3 className="text-base font-bold text-[#0B1220]">Pricing &amp; Availability</h3>
              <p>
                All prices listed are in Nigerian Naira (NGN). If an item is unexpectedly unavailable prior to dispatch, our team will notify you immediately for replacement or full refund.
              </p>
            </div>
          </div>
        ) : null}

        {/* DELIVERY */}
        {type === 'delivery' ? (
          <div className="space-y-6 rounded-[8px] border border-[#E5E7EB] bg-white p-6 sm:p-10">
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]">
                <Truck size={20} weight="regular" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0B1220]">
                  Delivery &amp; Shipping Guidelines
                </h2>
                <p className="text-xs text-[#5E6675]">Transparent dispatch across Nigeria</p>
              </div>
            </div>

            <div className="max-w-[65ch] space-y-4 text-sm leading-[1.65] text-[#374151]">
              <h3 className="text-base font-bold text-[#0B1220]">Delivery Timelines</h3>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  <strong className="text-[#0B1220]">Standard Delivery:</strong> 2-5 business days across Nigerian states.
                </li>
                <li>
                  <strong className="text-[#0B1220]">Express Delivery:</strong> 1-2 business days available in Lagos and selected corridors.
                </li>
              </ul>
              <h3 className="text-base font-bold text-[#0B1220]">Upfront Freight Calculation</h3>
              <p>
                Delivery fees are computed from destination state and parcel bulkiness directly at checkout so there are zero unexpected rider surcharges.
              </p>
            </div>
          </div>
        ) : null}

        {/* ALL-IN-ONE POLICIES */}
        {type === 'policies' ? (
          <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-6 sm:p-10">
            <div className="mb-6 flex gap-6 overflow-x-auto border-b border-[#E5E7EB]">
              {[
                { id: 'delivery', label: 'Delivery Policy' },
                { id: 'returns', label: 'Returns & Refunds' },
                { id: 'privacy', label: 'Privacy Policy' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`relative shrink-0 pb-3 text-sm font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'text-[#1049EB]'
                      : 'text-[#5E6675] hover:text-[#0B1220]'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id ? (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1049EB]" />
                  ) : null}
                </button>
              ))}
            </div>

            <div className="max-w-[65ch] space-y-3 text-sm leading-[1.65] text-[#374151]">
              {activeTab === 'delivery' ? (
                <>
                  <h2 className="text-base font-bold text-[#0B1220]">
                    Delivery Timelines &amp; Fees
                  </h2>
                  <p>
                    Customer-facing screens display final Naira pricing only. Your delivery fee is calculated and displayed upfront at checkout before you submit payment.
                  </p>
                  <p>
                    Standard deliveries arrive within 2-5 business days across Nigeria.
                  </p>
                </>
              ) : null}

              {activeTab === 'returns' ? (
                <>
                  <h2 className="text-base font-bold text-[#0B1220]">30-Day Return Guarantee</h2>
                  <p>
                    If you receive a defective item, you have 30 days from delivery to request a return or exchange. Items must remain in original packaging with accessories included.
                  </p>
                </>
              ) : null}

              {activeTab === 'privacy' ? (
                <>
                  <h2 className="text-base font-bold text-[#0B1220]">Data Protection</h2>
                  <p>
                    We collect your name, email address, phone number, and delivery destination solely for order fulfillment and customer support.
                  </p>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
