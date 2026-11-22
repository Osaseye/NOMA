import { WhatsappLogo } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { Button } from '../../design-system/components/Button'
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
    <aside className="rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
      <h2 className="border-b border-[#E5E7EB] pb-3.5 text-base font-bold tracking-tight text-[#0B1220]">
        Order summary
      </h2>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[#5E6675]">Items</span>
          <strong className="font-mono font-semibold text-[#0B1220]">
            {formatNaira(subtotal)}
          </strong>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-[#5E6675]">Delivery</span>
          <strong className="font-mono font-semibold text-[#0B1220]">
            {delivery > 0 ? formatNaira(delivery) : 'Calculated next'}
          </strong>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[#E5E7EB] pt-3.5">
          <span className="font-semibold text-[#0B1220]">Total</span>
          <strong className="font-mono text-lg font-bold text-[#0B1220]">
            {formatNaira(subtotal + delivery)}
          </strong>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <Button onClick={onAction} disabled={disabled} className="w-full">
          {action}
        </Button>

        <Link
          to={whatsappHref}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-semibold text-[#0B1220] transition-colors hover:bg-[#F6F7F9] sm:text-sm"
        >
          <WhatsappLogo size={16} weight="fill" className="text-[#15803D]" />
          <span>Continue on WhatsApp</span>
        </Link>
      </div>
    </aside>
  )
}
