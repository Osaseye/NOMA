import { HiArrowRight, HiCheckCircle, HiCube } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import { brand } from '../../constants/brand'

export function OrderSuccessPage() {
  const orderId = `NMA-${Math.floor(Math.random() * 9000) + 1000}`

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
      <div className="w-full max-w-lg px-4 py-12 md:px-8">
        <div className="flex flex-col items-center rounded-3xl bg-white p-8 text-center shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] md:p-12">
          
          {/* Success Icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping rounded-full bg-[#10B981]/20" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#E8F5EB]">
              <HiCheckCircle size={48} className="text-[#10B981]" />
            </div>
          </div>

          <h1 className="mb-2 text-[28px] font-extrabold tracking-tight text-[#12203D]">
            Order Confirmed!
          </h1>
          <p className="mb-8 text-[15px] font-medium text-[#12203D]/60">
            Thank you for shopping with {brand.name}. Your order has been successfully placed.
          </p>

          <div className="mb-10 w-full rounded-2xl bg-[#F7F8FA] p-5 border border-black/5 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <HiCube size={20} className="text-[#2F5FE3]" />
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#12203D]/50">Order Number</span>
                <span className="text-[17px] font-extrabold text-[#12203D]">{orderId}</span>
              </div>
            </div>
            <p className="text-[13px] font-medium leading-relaxed text-[#12203D]/60">
              We'll send you an email confirmation shortly. Our team is getting your items ready for delivery.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <Link
              to="/track-order"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#2F5FE3] text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(47,95,227,0.3)] transition-all hover:bg-[#2348C0] active:scale-[0.98]"
            >
              Track Your Order
            </Link>
            <Link
              to="/catalog"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-black/5 bg-transparent text-[15px] font-bold text-[#12203D] transition-all hover:bg-[#F7F8FA] active:scale-[0.98]"
            >
              Continue Shopping <HiArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
