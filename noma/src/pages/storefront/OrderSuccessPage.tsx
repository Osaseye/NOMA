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
    <div className="flex min-h-[75vh] items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-7 text-center shadow-2xs sm:p-10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#1049EB] text-white ring-4 ring-[#FEB719]/35">
            <CheckCircle size={28} weight="fill" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Order Confirmed
          </h1>
          <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-slate-500">
            Thank you for shopping with {brand.name}. Your order has been received and queued for dispatch.
          </p>

          {/* Receipt Card */}
          <div className="my-7 w-full space-y-3 rounded-2xl bg-[#F4F4F5] p-5 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#1049EB] shadow-2xs">
                <Package size={20} weight="regular" />
              </div>
              <div>
                <span className="block text-xs text-slate-500">Order Reference</span>
                <span className="text-base font-bold text-slate-900">
                  {orderId || 'Pending Assignment'}
                </span>
              </div>
            </div>

            {savedOrder ? (
              <div className="grid grid-cols-2 gap-3 border-t border-slate-200/80 pt-3 text-xs">
                <div>
                  <span className="block text-slate-500">Order Total</span>
                  <strong className="text-sm font-bold tabular-nums text-slate-900">
                    {formatNaira(savedOrder.total)}
                  </strong>
                </div>
                <div>
                  <span className="block text-slate-500">Destination</span>
                  <strong className="block truncate font-semibold text-slate-900">
                    {itemCount > 0 ? `${itemCount} items • ` : ''}
                    {savedOrder.deliveryArea || 'Nigeria'}
                  </strong>
                </div>
              </div>
            ) : (
              <p className="border-t border-slate-200/80 pt-3 text-xs leading-relaxed text-slate-500">
                Keep your order reference handy to monitor dispatch updates from your tracking page.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col gap-2.5">
            <Link
              to={orderId ? `/orders?id=${encodeURIComponent(orderId)}` : '/orders'}
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#1049EB] text-sm font-semibold text-white transition-colors hover:bg-[#0D3EC7]"
            >
              <span>Track Your Order</span>
            </Link>
            <Link
              to="/catalog"
              className="flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={15} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
