import { Lock, WhatsappLogo } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { formatNaira } from '../../utils/pricing'

export function OrderSummary({
  subtotal,
  delivery,
  action,
  onAction,
  whatsappHref = '/whatsapp-order',
  disabled = false,
}: {
  subtotal: number
  delivery: number
  action: string
  onAction: () => void
  whatsappHref?: string
  disabled?: boolean
}) {
  return (
    <aside className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
      <h2 className="border-b border-slate-100 pb-3.5 text-base font-bold tracking-tight text-slate-900">
        Order Summary
      </h2>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">Items Subtotal</span>
          <strong className="font-semibold tabular-nums text-slate-900">
            {formatNaira(subtotal)}
          </strong>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">Estimated Delivery</span>
          <strong className="font-semibold tabular-nums text-slate-900">
            {delivery === 0 ? 'Free' : formatNaira(delivery)}
          </strong>
        </div>

        <div className="flex items-baseline justify-between gap-4 border-t border-slate-100 pt-3.5">
          <span className="text-sm font-bold text-slate-900">Estimated Total</span>
          <strong className="text-xl font-bold tabular-nums text-slate-900">
            {formatNaira(subtotal + delivery)}
          </strong>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onAction}
          disabled={disabled}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
        >
          <Lock size={15} weight="bold" />
          <span>{action}</span>
        </button>

        <Link
          to={whatsappHref}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-[#F4F4F5] px-4 py-3 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-200"
        >
          <WhatsappLogo size={16} weight="fill" className="text-emerald-600" />
          <span>Continue on WhatsApp</span>
        </Link>
      </div>
    </aside>
  )
}
