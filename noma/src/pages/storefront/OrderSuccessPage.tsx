import { ArrowRight, CheckCircle, Package } from '@phosphor-icons/react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { brand } from '../../constants/brand'
import type { Order } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

interface OrderSuccessLocationState {
  order?: Order
}

export function OrderSuccessPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const state = (location.state as OrderSuccessLocationState | null) || null
  const savedOrder = state?.order
  const queryId = searchParams.get('id')?.trim() || ''
  const orderId = savedOrder?.id || queryId

  const itemCount = savedOrder?.items
    ? savedOrder.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-[#F6F7F9] px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center rounded-[10px] border border-[#E5E7EB] bg-white p-7 text-center sm:p-10">
          {/* Calm Semantic Confirmation Badge (zero animate-ping) */}
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[10px] border border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]">
            <CheckCircle size={34} weight="fill" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#0B1220] sm:text-3xl">
            Order Confirmed
          </h1>
          <p className="mt-2 max-w-[44ch] text-sm leading-[1.6] text-[#5E6675]">
            Thank you for shopping with {brand.name}. Your order has been recorded and queued for processing.
          </p>

          {/* Receipt Card */}
          <div className="my-7 w-full space-y-3 rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-5 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#1049EB]">
                <Package size={20} weight="regular" />
              </div>
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#5E6675]">
                  Order Reference
                </span>
                <span className="font-mono text-base font-bold text-[#0B1220]">
                  {orderId || 'Pending Assignment'}
                </span>
              </div>
            </div>

            {savedOrder ? (
              <div className="grid grid-cols-2 gap-3 border-t border-[#E5E7EB] pt-3 text-xs">
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#5E6675]">
                    Order Total
                  </span>
                  <strong className="font-mono text-sm font-bold text-[#0B1220]">
                    {formatNaira(savedOrder.total)}
                  </strong>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#5E6675]">
                    {itemCount > 0 ? 'Items / Destination' : 'Destination'}
                  </span>
                  <strong className="block truncate font-semibold text-[#0B1220]">
                    {itemCount > 0 ? `${itemCount} items - ` : ''}
                    {savedOrder.deliveryArea || 'Nigeria'}
                  </strong>
                </div>
              </div>
            ) : (
              <p className="border-t border-[#E5E7EB] pt-3 text-xs leading-relaxed text-[#5E6675]">
                Keep your order reference handy to monitor dispatch updates from your tracking page.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col gap-2.5">
            <Link
              to={orderId ? `/track-order?id=${encodeURIComponent(orderId)}` : '/track-order'}
              className="flex h-11 items-center justify-center gap-2 rounded-[6px] bg-[#0B1220] text-sm font-semibold text-white transition-colors hover:bg-[#1049EB]"
            >
              <span>Track Your Order</span>
            </Link>
            <Link
              to="/catalog"
              className="flex h-11 items-center justify-center gap-2 rounded-[6px] border border-[#E5E7EB] bg-white text-sm font-semibold text-[#0B1220] transition-colors hover:bg-[#F6F7F9]"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={15} weight="regular" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
