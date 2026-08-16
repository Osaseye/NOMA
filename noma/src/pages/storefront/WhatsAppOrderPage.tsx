import { HiChatBubbleLeftEllipsis, HiPhone, HiShieldCheck, HiArrowRight } from 'react-icons/hi2'
import { brand } from '../../constants/brand'
import { WhatsAppFlow } from '../../features/storefront/WhatsAppFlow'

export function WhatsAppOrderPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] font-['Outfit',sans-serif]">
      {/* Hero Banner */}
      <div className="bg-[#12203D] py-16 text-center text-white md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-8 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-300">
            <HiChatBubbleLeftEllipsis size={16} /> Instant WhatsApp Shopping
          </span>
          <h1 className="text-[2rem] font-extrabold tracking-tight md:text-[3rem]">
            Chat, Order & Track on WhatsApp
          </h1>
          <p className="text-[15px] font-medium leading-relaxed text-white/70 md:text-[17px]">
            Prefer speaking directly with a human? Place your order, check live stock, or get personalized product advice via WhatsApp.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 lg:px-12 space-y-12">
        {/* Flow Component */}
        <WhatsAppFlow />

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200/80">
          <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-xs space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <HiShieldCheck size={22} />
            </div>
            <h4 className="text-base font-extrabold text-[#12203D]">Zero Misunderstanding</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Send voice notes, photos, or exact specifications directly to our representatives.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-xs space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2F5FE3]">
              <HiPhone size={22} />
            </div>
            <h4 className="text-base font-extrabold text-[#12203D]">Real-Time Agent Assistance</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Available Monday to Saturday (8:00 AM - 8:00 PM WAT) with average 2-minute responses.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-xs space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <HiChatBubbleLeftEllipsis size={22} />
            </div>
            <h4 className="text-base font-extrabold text-[#12203D]">Custom Quotations</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Buying for an office or multi-item bulk order? Get an immediate discounted quote.
            </p>
          </div>
        </div>

        {/* Floating Quick Action Banner */}
        <div className="rounded-3xl bg-[#12203D] p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-extrabold">Ready to order via chat?</h3>
            <p className="text-xs text-white/70 font-medium">
              Click below to launch WhatsApp with your pre-filled inquiry.
            </p>
          </div>
          <a
            href={brand.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-extrabold text-white shadow-md hover:bg-emerald-700 transition-all shrink-0 active:scale-[0.98]"
          >
            <span>Open WhatsApp Support</span>
            <HiArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  )
}
