import {
  ArrowRight,
  ArrowUpRight,
  CaretRight,
  Check,
  MagnifyingGlass,
  Minus,
  Plus,
  WhatsappLogo,
} from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { brand } from '../../constants/brand'
import { emailService } from '../../services/email/emailService'
import { useAdminStore } from '../../store/adminStore'
import { useFeedbackStore } from '../../store/feedbackStore'

export type StaticPageType =
  | 'about'
  | 'support'
  | 'contact'
  | 'faq'
  | 'returns'
  | 'privacy'
  | 'terms'
  | 'delivery'
  | 'policies'

const HELP_FAQS = [
  {
    category: 'wholesale',
    q: 'Can I buy shoes, sneakers, or clothing in bulk / wholesale bales?',
    a: 'Yes. Noma supplies both individual retail shoppers and bulk resellers across Nigeria. You can order single pairs directly on the website or tap "Wholesale & Bulk Desk" to request bale pricing and custom quantity discounts via WhatsApp.',
  },
  {
    category: 'delivery',
    q: 'How are delivery fees and timelines calculated across Nigerian states?',
    a: 'Your delivery fee is calculated upfront based on your selected state in the top bar or checkout. Orders over ₦250,000 qualify for free standard delivery on non-bulky items. Lagos deliveries arrive in 1–2 business days, Southwest & Abuja in 2–3 business days, and other states in 3–5 business days.',
  },
  {
    category: 'payment',
    q: 'Is Pay on Delivery (POD) available?',
    a: 'Yes. Pay on Delivery is supported for verified addresses in eligible metro zones including Lagos and Abuja. You can also pay securely via Naira Bank Transfer, Debit/Credit Card, or USSD.',
  },
  {
    category: 'delivery',
    q: 'How do I track my package after ordering?',
    a: 'Every order receives a unique Noma reference (e.g. NMA-123456). Enter your Order ID on the Track Order page or in the quick tracker on this page to view real-time dispatch milestones from Placed to Delivered.',
  },
  {
    category: 'returns',
    q: 'What is your return and exchange policy for footwear, fashion, and appliances?',
    a: 'We offer a 30-day return and size-exchange window on unused items in their original packaging with tags and accessories intact. If an item arrives damaged or incorrect, contact our team within 48 hours for priority pickup and replacement.',
  },
  {
    category: 'wholesale',
    q: 'Do you supply catering equipment and kitchen appliances in bulk?',
    a: 'Yes. We supply commercial blenders, air fryers, cookware sets, and catering hardware for restaurants, hotels, events, and homes with consolidated freight rates.',
  },
]

const DELIVERY_ZONES = [
  { zone: 'Lagos Metro (Island & Mainland)', eta: '1 – 2 business days', baseRate: '₦3,500' },
  { zone: 'Southwest (Ogun, Oyo, Osun, Ondo)', eta: '2 – 3 business days', baseRate: '₦4,500' },
  { zone: 'FCT Abuja & Rivers (Port Harcourt)', eta: '2 – 4 business days', baseRate: '₦6,000' },
  { zone: 'All Other Nigerian States', eta: '3 – 5 business days', baseRate: '₦7,500' },
]

const LEGAL_SECTIONS = [
  {
    id: 'overview',
    number: '01',
    title: 'Marketplace Overview & Operator Identity',
    body: [
      `Noma Marketplace ("Noma") is operated under ${brand.legalEntity} in Nigeria. These Terms of Service govern all retail purchases, wholesale/bulk inquiries, account registrations, and deliveries made through our platform.`,
      'By browsing, creating an account, or placing an order on Noma, you agree to these terms, our upfront Naira pricing rules, and our nationwide delivery guidelines.',
    ],
  },
  {
    id: 'orders',
    number: '02',
    title: 'Retail Purchases & Wholesale Bulk Orders',
    body: [
      'Noma fulfills both single-unit retail orders (across footwear, clothing, kitchenware, electronics, and home appliances) and bulk wholesale orders (including footwear bales and catering/office equipment).',
      'For size-specific products such as shoes and apparel, shoppers must select an available size variant prior to checkout. Bulk bale orders confirmed through our WhatsApp Wholesale Desk receive an itemized pro-forma invoice and tracking reference before dispatch.',
    ],
  },
  {
    id: 'pricing',
    number: '03',
    title: 'Naira Pricing, Taxes & Payment Settlement',
    body: [
      'All prices on Noma are stated in Nigerian Naira (₦ / NGN). The checkout total always shows your item subtotal plus the exact state delivery fee before you confirm payment—with zero hidden rider surcharges.',
      'We accept Naira Bank Transfers, Verve/Mastercard/Visa cards, USSD, and Pay on Delivery (POD) in eligible metro locations. Orders paid via bank transfer are queued for dispatch immediately upon transfer confirmation.',
    ],
  },
  {
    id: 'shipping',
    number: '04',
    title: 'Nationwide Delivery, Inspection & Risk of Loss',
    body: [
      'Orders are dispatched from our fulfillment hubs to all 36 states and the FCT. Estimated transit times range from 1–2 business days in Lagos to 2–5 business days interstate.',
      'Upon doorstep arrival, recipients are encouraged to verify outer package integrity. Risk of loss transfers to the recipient upon signed delivery confirmation.',
    ],
  },
  {
    id: 'returns',
    number: '05',
    title: '30-Day Returns, Size Exchanges & Warranty',
    body: [
      'Unused footwear, clothing, and household items in original packaging with factory tags/seals intact may be returned or exchanged within 30 days of delivery.',
      'Electronics and major home appliances carry a 1-year distributor warranty against manufacturing defects. Approved refunds are credited back to your original Nigerian bank account or payment method within 3–5 business days of return inspection.',
    ],
  },
  {
    id: 'privacy',
    number: '06',
    title: 'Privacy, Data Protection & Account Security',
    body: [
      'We collect only the personal details required to process and deliver your order: your name, phone number, email address, and Nigerian delivery address.',
      'Your contact data is never sold to third-party marketers. Card transactions are processed over encrypted channels, and raw card numbers or PINs are never stored on Noma servers. You may request profile updates or account deletion at any time by emailing our support desk.',
    ],
  },
]

export function StaticInfoPage({ type }: { type: StaticPageType }) {
  const navigate = useNavigate()
  const { settings } = useAdminStore()

  const [faqQuery, setFaqQuery] = useState('')
  const [faqCategory, setFaqCategory] = useState<'all' | 'delivery' | 'wholesale' | 'payment' | 'returns'>('all')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [trackingInput, setTrackingInput] = useState('')
  const [activeLegalSection, setActiveLegalSection] = useState<string>('overview')

  // Feedback form state
  const submitFeedback = useFeedbackStore((state) => state.submitFeedback)
  const [fbName, setFbName] = useState('')
  const [fbPhone, setFbPhone] = useState('')
  const [fbEmail, setFbEmail] = useState('')
  const [fbTopic, setFbTopic] = useState('Wholesale & Bulk Inquiry')
  const [fbMessage, setFbMessage] = useState('')
  const [fbSubmitting, setFbSubmitting] = useState(false)
  const [fbSent, setFbSent] = useState(false)

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fbName.trim() || !fbMessage.trim()) return
    setFbSubmitting(true)
    try {
      await submitFeedback({
        name: fbName.trim(),
        phone: fbPhone.trim() || undefined,
        email: fbEmail.trim() || undefined,
        topic: fbTopic,
        message: fbMessage.trim(),
      })
      void emailService.sendSupportAlertEmail(
        {
          senderName: fbName.trim(),
          senderEmail: fbEmail.trim() || undefined,
          senderPhone: fbPhone.trim() || undefined,
          subject: fbTopic,
          message: fbMessage.trim(),
        },
        settings.supportEmail || brand.supportEmail || brand.email,
      )
      setFbName('')
      setFbPhone('')
      setFbEmail('')
      setFbMessage('')
      setFbSent(true)
      toast.success('Thank you! Your message has been sent to our team.')
      setTimeout(() => setFbSent(false), 5000)
    } finally {
      setFbSubmitting(false)
    }
  }

  const supportPhone = settings.supportPhone || brand.phone
  const supportEmail = settings.supportEmail || brand.supportEmail || brand.email
  const whatsappDigits = (settings.whatsappNumber || brand.whatsappNumber).replace(/\D/g, '')
  const whatsappUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : brand.whatsapp

  const normalizedView: 'about' | 'support' | 'legal' = useMemo(() => {
    if (type === 'about') return 'about'
    if (type === 'terms' || type === 'privacy' || type === 'policies') return 'legal'
    return 'support'
  }, [type])

  const filteredFaqs = useMemo(() => {
    const q = faqQuery.trim().toLowerCase()
    return HELP_FAQS.filter((item) => {
      if (faqCategory !== 'all' && item.category !== faqCategory) return false
      if (!q) return true
      return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    })
  }, [faqCategory, faqQuery])

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingInput.trim()) {
      navigate(`/orders?id=${encodeURIComponent(trackingInput.trim().toUpperCase())}`)
    }
  }

  /* ============================================================================
   * VIEW 1: ABOUT NOMA (Editorial Magazine Story — Zero Basic Boxy Cards)
   * ========================================================================== */
  if (normalizedView === 'about') {
    return (
      <div className="min-h-screen bg-white pb-24 pt-4 text-slate-900">
        <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900">
              Home
            </Link>
            <CaretRight size={11} />
            <span className="font-medium text-slate-900">About Noma</span>
          </nav>

          {/* Full-Bleed Editorial Masthead */}
          <div className="relative h-[380px] w-full overflow-hidden rounded-2xl bg-slate-950 sm:h-[460px] lg:h-[520px]">
            <img
              src="/images/cat-clothing.png"
              alt="About Noma Marketplace"
              className="h-full w-full object-cover object-center opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />

            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 lg:p-16">
              <div className="max-w-3xl">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#FEB719]">
                  Our Story &bull; {brand.legalEntity}
                </span>
                <h1 className="mt-3 text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                  Built for how Nigeria shops — from single pairs to wholesale bales &amp; modern home essentials.
                </h1>
              </div>
            </div>
          </div>

          {/* Open Editorial Manifesto & Metrics Strip (No Card Containers) */}
          <div className="grid grid-cols-1 gap-10 border-b border-slate-200 py-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-2xl font-bold leading-snug tracking-tight text-slate-900 sm:text-3xl">
                One trusted marketplace for your wardrobe, your kitchen, and your business.
              </h2>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base lg:col-span-7">
              <p>
                Noma started with a simple observation: whether you are buying a fresh pair of sneakers, restocking wholesale footwear bales for your boutique, equipping a catering kitchen, or upgrading your living room with a 4K display, online shopping in Nigeria should never feel like a gamble.
              </p>
              <p>
                We eliminated hidden rider markups by building live state-by-state delivery estimation directly into the top bar and shopping bag—so you know your exact landing cost in Lagos, Abuja, Port Harcourt, or anywhere across all 36 states before you pay.
              </p>
            </div>
          </div>

          {/* Open Typography Key Figures */}
          <div className="grid grid-cols-2 gap-8 border-b border-slate-200 py-12 md:grid-cols-4">
            <div>
              <span className="block text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                36 + FCT
              </span>
              <span className="mt-1 block text-xs font-medium text-slate-500 sm:text-sm">
                States covered with tracked doorstep delivery
              </span>
            </div>
            <div>
              <span className="block text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Retail &amp; Bulk
              </span>
              <span className="mt-1 block text-xs font-medium text-slate-500 sm:text-sm">
                Single units for homes &amp; wholesale bales for resellers
              </span>
            </div>
            <div>
              <span className="block text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                24 – 48 hrs
              </span>
              <span className="mt-1 block text-xs font-medium text-slate-500 sm:text-sm">
                Express metro dispatch across Lagos &amp; Abuja
              </span>
            </div>
            <div>
              <span className="block text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                100% Upfront
              </span>
              <span className="mt-1 block text-xs font-medium text-slate-500 sm:text-sm">
                Transparent Naira pricing with zero surprise fees
              </span>
            </div>
          </div>

          {/* 3-Column Visual Pillars */}
          <div className="py-14">
            <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                What We Specialize In
              </h2>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1049EB] hover:text-[#0D3EC7] hover:underline sm:text-sm"
              >
                <span>Browse all products</span>
                <ArrowUpRight size={15} weight="bold" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Footwear & Contemporary Fashion',
                  desc: 'Sneakers, leather shoes, and everyday apparel available in single pairs for retail shoppers or wholesale bales for resellers.',
                  image: '/images/cat-clothing.png',
                  href: '/category/clothing',
                },
                {
                  title: 'Kitchen, Cookware & Catering',
                  desc: 'Heavy-duty blenders, digital air fryers, stainless cookware, and catering supplies built for daily performance.',
                  image: '/images/editorial-kitchen.png',
                  href: '/category/kitchen',
                },
                {
                  title: 'Smart Living, Power & Appliances',
                  desc: '4K smart TVs, acoustic soundbars, energy-saving refrigerators, and lithium backup power systems.',
                  image: '/images/hero-living-desktop.png',
                  href: '/category/electronics',
                },
              ].map((item) => (
                <Link key={item.title} to={item.href} className="group block">
                  <div className="aspect-[16/11] w-full overflow-hidden rounded-2xl bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:underline sm:text-lg">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                        {item.desc}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={18}
                      weight="bold"
                      className="mt-1 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-900"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Editorial CTA Strip */}
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-slate-950 p-8 text-white sm:p-12 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ready to shop or request a wholesale quote?
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-white/75 sm:text-sm">
                Explore our live catalog online or speak directly with our team on WhatsApp for bulk orders.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 rounded-full bg-[#1049EB] px-7 py-3.5 text-xs font-bold text-white transition-colors hover:bg-[#0D3EC7] sm:text-sm"
              >
                <span>Start Shopping</span>
                <ArrowRight size={15} weight="bold" />
              </Link>
              <a
                href={`${whatsappUrl}?text=${encodeURIComponent('Hello Noma, I would like to inquire about wholesale/bulk or retail orders.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 sm:text-sm"
              >
                <WhatsappLogo size={17} weight="fill" className="text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ============================================================================
   * VIEW 2: TERMS, PRIVACY & POLICIES (Open Editorial Legal Reader — Zero Cards)
   * ========================================================================== */
  if (normalizedView === 'legal') {
    return (
      <div className="min-h-screen bg-white pb-24 pt-5 text-slate-900">
        <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
          {/* Header Masthead */}
          <div className="border-b border-slate-200 pb-8">
            <nav className="mb-2 flex items-center gap-1.5 text-xs text-slate-500">
              <Link to="/" className="hover:text-slate-900">
                Home
              </Link>
              <CaretRight size={11} />
              <span className="font-medium text-slate-900">Terms &amp; Privacy</span>
            </nav>

            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                  Terms of Service &amp; Privacy Policy
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  Clear operating guidelines covering retail and bulk orders, Naira payments, nationwide delivery, 30-day returns, and customer data privacy.
                </p>
              </div>
              <span className="text-xs font-medium text-slate-400">
                Operated by {brand.legalEntity} &bull; Updated 2026
              </span>
            </div>
          </div>

          {/* 2-Column Editorial Reader: Sticky Index on Left, Open Prose on Right */}
          <div className="grid grid-cols-1 gap-10 pt-10 lg:grid-cols-12">
            {/* Left 4 Cols: Sticky Section Directory */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sections
                  </span>
                  <nav className="mt-3 flex flex-col space-y-1 border-l border-slate-200 pl-3">
                    {LEGAL_SECTIONS.map((sec) => {
                      const isActive = activeLegalSection === sec.id
                      return (
                        <a
                          key={sec.id}
                          href={`#${sec.id}`}
                          onClick={() => setActiveLegalSection(sec.id)}
                          className={`py-1.5 text-xs transition-colors sm:text-sm ${
                            isActive
                              ? 'font-bold text-[#1049EB]'
                              : 'font-medium text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {sec.number}. {sec.title}
                        </a>
                      )
                    })}
                  </nav>
                </div>

                <div className="border-t border-slate-200 pt-5 text-xs text-slate-500">
                  <p className="font-semibold text-slate-900">Have a question about our terms?</p>
                  <p className="mt-1">
                    Reach our team directly at{' '}
                    <a href={`mailto:${supportEmail}`} className="font-semibold text-slate-900 underline">
                      {supportEmail}
                    </a>{' '}
                    or visit the{' '}
                    <Link to="/support" className="font-semibold text-slate-900 underline">
                      Help Center
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </aside>

            {/* Right 8 Cols: Open Editorial Sections (Zero Boxy Cards) */}
            <div className="divide-y divide-slate-200 lg:col-span-8">
              {LEGAL_SECTIONS.map((sec) => (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="scroll-mt-28 py-8 first:pt-0 last:pb-0"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-bold text-[#1049EB]">{sec.number}</span>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      {sec.title}
                    </h2>
                  </div>

                  <div className="mt-4 max-w-3xl space-y-3.5 pl-6 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {sec.body.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ============================================================================
   * VIEW 3: HELP & SUPPORT CENTER (/support, /help, /contact, /faq, /returns, /delivery-policy)
   * ========================================================================== */
  return (
    <div className="min-h-screen bg-white pb-24 pt-5 text-slate-900">
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        {/* Open Editorial Masthead with Instant Help Search */}
        <div className="border-b border-slate-200 pb-10">
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900">
              Home
            </Link>
            <CaretRight size={11} />
            <span className="font-medium text-slate-900">Help &amp; Support</span>
          </nav>

          <div className="grid grid-cols-1 items-end justify-between gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                How can we help you today?
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
                Find instant answers on Nigerian state delivery rates, wholesale shoe bale orders, returns, and payment options—or chat directly with our team.
              </p>
            </div>

            {/* Search Input for Help Topics */}
            <div className="lg:col-span-5">
              <div className="relative">
                <MagnifyingGlass
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={faqQuery}
                  onChange={(e) => setFaqQuery(e.target.value)}
                  placeholder="Search help topics (e.g. bulk shoes, Lagos delivery, returns)..."
                  className="h-12 w-full rounded-full border border-slate-200 bg-[#F4F4F5] pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1049EB] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main 12-Col Split: Left 7 Cols Open FAQ + Delivery Table | Right 5 Cols Live Order Tracker & Direct Desk */}
        <div className="grid grid-cols-1 gap-12 pt-10 lg:grid-cols-12">
          {/* Left 7 Cols: Topic Filter Pills + Open Hairline Accordion + State Delivery Schedule */}
          <div className="space-y-12 lg:col-span-7">
            <div>
              {/* Topic Filter Pills */}
              <div className="no-scrollbar mb-6 flex items-center gap-2 overflow-x-auto">
                {[
                  { id: 'all', label: 'All Topics' },
                  { id: 'wholesale', label: 'Wholesale & Bulk' },
                  { id: 'delivery', label: 'Delivery & States' },
                  { id: 'payment', label: 'Payment & POD' },
                  { id: 'returns', label: 'Returns & Exchanges' },
                ].map((tab) => {
                  const isActive = faqCategory === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFaqCategory(tab.id as typeof faqCategory)}
                      className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#1049EB] text-white'
                          : 'bg-[#F4F4F5] text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              {/* Open Hairline FAQ Accordion (No Boxy Card Container) */}
              <div className="divide-y divide-slate-200 border-y border-slate-200">
                {filteredFaqs.length === 0 ? (
                  <p className="py-8 text-sm text-slate-500">
                    No matching questions found. Try another keyword or message us on WhatsApp.
                  </p>
                ) : (
                  filteredFaqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx
                    return (
                      <div key={faq.q}>
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-bold text-slate-900 transition-colors hover:text-slate-600 sm:text-base"
                        >
                          <span>{faq.q}</span>
                          {isOpen ? (
                            <Minus size={16} weight="bold" className="shrink-0 text-[#1049EB]" />
                          ) : (
                            <Plus size={16} weight="bold" className="shrink-0 text-slate-400" />
                          )}
                        </button>
                        {isOpen ? (
                          <div className="pb-5 pr-8 text-sm leading-relaxed text-slate-600">
                            {faq.a}
                          </div>
                        ) : null}
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Open Delivery Corridors Reference Table */}
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Nationwide Delivery Zones &amp; Timelines
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Standard delivery is free on non-bulky orders over ₦250,000.
              </p>

              <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200 text-xs sm:text-sm">
                {DELIVERY_ZONES.map((z) => (
                  <div
                    key={z.zone}
                    className="flex flex-wrap items-center justify-between gap-2 py-3.5"
                  >
                    <span className="font-semibold text-slate-900">{z.zone}</span>
                    <div className="flex items-center gap-6">
                      <span className="text-slate-500">{z.eta}</span>
                      <strong className="min-w-[64px] text-right font-bold tabular-nums text-slate-900">
                        {z.baseRate}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Instant Order Lookup & Direct Human Channels */}
          <div className="space-y-8 lg:col-span-5">
            {/* Instant Order Tracker */}
            <div className="rounded-2xl bg-[#F4F4F5] p-6 sm:p-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1049EB]">
                Live Dispatch Lookup
              </span>
              <h2 className="mt-1.5 text-xl font-bold text-slate-900">
                Track an existing order
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Enter your Noma Order ID (e.g. NMA-123456) to check your package status immediately.
              </p>

              <form onSubmit={handleQuickTrack} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Enter Order ID..."
                  className="h-11 flex-1 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold uppercase text-slate-900 placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:border-[#1049EB] focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#1049EB] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#0D3EC7]"
                >
                  <span>Track</span>
                  <ArrowRight size={13} weight="bold" />
                </button>
              </form>
            </div>

            {/* Direct Contact Channels (Open Hairline List) */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Speak with Our Team
              </h2>

              <div className="divide-y divide-slate-200 border-y border-slate-200">
                <div className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">WhatsApp Concierge &amp; Bulk Desk</h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Fastest response for order help &amp; wholesale shoe quotes
                    </p>
                  </div>
                  <a
                    href={`${whatsappUrl}?text=${encodeURIComponent('Hello Noma Support, I need assistance.')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    <WhatsappLogo size={15} weight="fill" className="text-emerald-400" />
                    <span>Chat Now</span>
                  </a>
                </div>

                <div className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Phone Support</h3>
                    <p className="mt-0.5 text-xs text-slate-500">Mon – Sat, 8:00 AM – 8:00 PM WAT</p>
                  </div>
                  <a
                    href={`tel:${supportPhone.replace(/\s+/g, '')}`}
                    className="text-sm font-bold text-slate-900 hover:underline"
                  >
                    {supportPhone}
                  </a>
                </div>

                <div className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Email Desk</h3>
                    <p className="mt-0.5 text-xs text-slate-500">For receipts, supplier &amp; corporate inquiries</p>
                  </div>
                  <a
                    href={`mailto:${supportEmail}`}
                    className="text-sm font-bold text-slate-900 hover:underline"
                  >
                    {supportEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* Send Feedback / Inquiry Form (Syncs directly to Admin /admin/feedback) */}
            <div className="pt-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Send a Message or Feedback
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Have a question, wholesale shoe bale request, or feedback? Send it directly to our team.
              </p>

              <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    value={fbName}
                    onChange={(e) => setFbName(e.target.value)}
                    placeholder="Your name *"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={fbPhone}
                    onChange={(e) => setFbPhone(e.target.value)}
                    placeholder="Phone / WhatsApp number"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="email"
                    value={fbEmail}
                    onChange={(e) => setFbEmail(e.target.value)}
                    placeholder="Email address (optional)"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                  />
                  <select
                    value={fbTopic}
                    onChange={(e) => setFbTopic(e.target.value)}
                    aria-label="Inquiry topic"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-900 focus:border-slate-900 focus:outline-none"
                  >
                    <option value="Wholesale & Bulk Inquiry">Wholesale &amp; Bulk Inquiry</option>
                    <option value="Order Delivery Support">Order Delivery Support</option>
                    <option value="Returns & Size Exchange">Returns &amp; Size Exchange</option>
                    <option value="Store Feedback">Store Feedback</option>
                  </select>
                </div>

                <textarea
                  rows={3}
                  required
                  value={fbMessage}
                  onChange={(e) => setFbMessage(e.target.value)}
                  placeholder="How can we help you? *"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                />

                <div className="flex items-center justify-between gap-3">
                  {fbSent ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1049EB]">
                      <Check size={14} weight="bold" />
                      <span>Sent to Noma Support</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      Replies within 1 business hour
                    </span>
                  )}

                  <button
                    type="submit"
                    disabled={fbSubmitting}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#1049EB] px-6 text-xs font-semibold text-white transition-colors hover:bg-[#0D3EC7] disabled:opacity-50"
                  >
                    <span>{fbSubmitting ? 'Sending...' : 'Send Message'}</span>
                    <ArrowRight size={13} weight="bold" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
