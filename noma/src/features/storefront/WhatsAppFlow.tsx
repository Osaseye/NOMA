import {
  HiChatBubbleLeftEllipsis,
  HiCheckCircle,
  HiShoppingBag,
  HiTruck,
  HiPaperAirplane,
} from 'react-icons/hi2'
import { brand } from '../../constants/brand'

export function WhatsAppFlow() {
  const steps = [
    {
      step: '01',
      title: 'Share Product or Cart',
      desc: 'Browse Noma, tap "Buy on WhatsApp", and your items + preferences are instantly pre-filled in a chat message.',
      icon: HiShoppingBag,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      step: '02',
      title: 'Instant Support & Stock Check',
      desc: 'Our dedicated agent confirms real-time stock, answers your questions, and validates your delivery area.',
      icon: HiChatBubbleLeftEllipsis,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      step: '03',
      title: 'Flexible Payment & Tracking',
      desc: 'Pay safely via bank transfer or Pay on Delivery. Receive your official Noma Tracking ID directly on WhatsApp!',
      icon: HiTruck,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
  ]

  return (
    <div className="w-full space-y-12">
      {/* Visual Step-by-Step Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, idx) => {
          const Icon = s.icon
          return (
            <div
              key={idx}
              className="relative flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${s.color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-2xl font-black text-gray-200">{s.step}</span>
                </div>
                <h4 className="text-lg font-extrabold text-[#12203D]">{s.title}</h4>
                <p className="text-xs leading-relaxed font-medium text-gray-500">{s.desc}</p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-extrabold text-emerald-600">
                <span>Fast & Secure</span>
                <HiCheckCircle size={16} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Interactive WhatsApp Chat Preview Box */}
      <div className="mx-auto max-w-xl rounded-3xl border border-emerald-200 bg-gradient-to-b from-[#E7F7EE] to-[#F2FBF6] p-6 shadow-md md:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-emerald-200/60 pb-4">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-black text-lg shadow-sm">
              N
            </div>
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-[#12203D]">{brand.name} WhatsApp Desk</h4>
            <p className="text-xs font-semibold text-emerald-700">Official Customer Support • Online</p>
          </div>
        </div>

        {/* Chat Bubble Simulation */}
        <div className="space-y-3">
          {/* Customer Message */}
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-xs bg-emerald-600 p-4 text-xs text-white shadow-xs">
            <p className="font-medium">
              Hello Noma! I would like to order the <strong>Double Door Refrigerator (NMA-REF-09)</strong> delivered to Ikeja, Lagos.
            </p>
            <span className="mt-1 block text-[10px] text-emerald-200 text-right">Just now • ✓✓</span>
          </div>

          {/* Agent Reply */}
          <div className="mr-auto max-w-[85%] rounded-2xl rounded-tl-xs bg-white p-4 text-xs text-[#12203D] shadow-xs border border-gray-100 space-y-2">
            <p className="font-semibold text-emerald-800">
              Welcome to Noma! 👋 We have that item in stock in our Lagos warehouse.
            </p>
            <p className="text-gray-600">
              Delivery to Ikeja is ₦3,500 (1-2 business days). Would you prefer Pay on Delivery or Direct Transfer?
            </p>
            <span className="block text-[10px] text-gray-400 text-right">Agent • Just now</span>
          </div>
        </div>

        {/* CTA Bar inside chat box */}
        <a
          href={brand.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 py-4 text-sm font-extrabold text-white shadow-lg hover:bg-emerald-700 transition-all active:scale-[0.99]"
        >
          <HiPaperAirplane size={18} className="rotate-45" />
          <span>Start WhatsApp Chat Now</span>
        </a>
      </div>
    </div>
  )
}
