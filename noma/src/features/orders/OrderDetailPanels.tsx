import { WhatsappLogo } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { brand } from '../../constants/brand'
import { useProductStore } from '../../store/productStore'
import type { Order, OrderStatus } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

const allStatuses: OrderStatus[] = [
  'placed',
  'processing',
  'packed',
  'dispatched',
  'delivered',
  'cancelled',
]

const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function OrderDetailPanels({ order }: { order: Order }) {
  const { updateOrderStatus } = useProductStore()

  const customerPhoneDigits = order.phone?.replace(/\D/g, '')
  const whatsappBaseDigits = brand.whatsappNumber.replace(/\D/g, '')
  const waTarget =
    customerPhoneDigits && customerPhoneDigits.length >= 10
      ? customerPhoneDigits.startsWith('0')
        ? `234${customerPhoneDigits.slice(1)}`
        : customerPhoneDigits
      : whatsappBaseDigits

  return (
    <div className="flex flex-col gap-8">
      {/* Top Row: Customer Info & Financial Split (Open Monochrome Sections) */}
      <div className="grid grid-cols-1 gap-8 border-b border-slate-200 pb-8 md:grid-cols-2">
        {/* Customer & Delivery */}
        <section className="flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Customer &amp; Delivery
              </h2>
              <span className="text-xs font-bold text-slate-950">{statusLabel(order.status)}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400">Customer</span>
                <p className="mt-0.5 font-semibold text-slate-950">{order.customer}</p>
              </div>
              <div>
                <span className="text-slate-400">Phone</span>
                <p className="mt-0.5 font-semibold text-slate-950">
                  {order.phone || 'Not provided'}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Delivery Address</span>
                <p className="mt-0.5 font-semibold text-slate-950">
                  {order.address
                    ? `${order.address}, ${order.city || ''} (${order.state || 'Lagos'})`
                    : 'Standard Delivery'}
                </p>
              </div>
              {order.paymentMethod ? (
                <div className="col-span-2">
                  <span className="text-slate-400">Payment Method</span>
                  <p className="mt-0.5 text-slate-700">{order.paymentMethod}</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`https://wa.me/${waTarget}?text=${encodeURIComponent(
                `Hello ${order.customer}, update on your Noma Order #${order.id}: Your order status is now *${statusLabel(order.status)}*. Track live progress here: ${window.location.origin}/orders?id=${encodeURIComponent(order.id)}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
            >
              <WhatsappLogo size={15} weight="fill" className="text-emerald-400" />
              <span>Send Status Update on WhatsApp</span>
            </a>
            {order.email ? (
              <a
                href={`mailto:${order.email}?subject=${encodeURIComponent(
                  `Noma Order #${order.id} Update: ${statusLabel(order.status)}`
                )}&body=${encodeURIComponent(
                  `Hello ${order.customer},\n\nYour Noma Order #${order.id} is now ${statusLabel(order.status)}.\n\nTrack your order live: ${window.location.origin}/orders?id=${encodeURIComponent(order.id)}\n\nThank you for shopping with Noma.`
                )}`}
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-900 transition-colors hover:border-slate-950"
              >
                <span>Email Update</span>
              </a>
            ) : null}
          </div>
        </section>

        {/* Financial Split & Status Control */}
        <section className="flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Financial Summary
              </h2>
              <span className="text-xs text-slate-500">
                Ref: {order.paymentRef || 'Manual'}
              </span>
            </div>

            <div className="mt-4 divide-y divide-slate-100 text-xs">
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500">Order Total Paid</span>
                <strong className="text-sm font-bold tabular-nums text-slate-950">
                  {formatNaira(order.total)}
                </strong>
              </div>
              {order.deliveryFee ? (
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500">
                    Delivery Fee ({order.deliveryMethod || 'Standard'})
                  </span>
                  <span className="font-semibold tabular-nums text-slate-700">
                    {formatNaira(order.deliveryFee)}
                  </span>
                </div>
              ) : null}
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500">Supplier Wholesale Cost</span>
                <span className="font-semibold tabular-nums text-slate-700">
                  {formatNaira(order.baseAmountOwed)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-semibold text-slate-900">Net Store Margin</span>
                <strong className="text-sm font-bold tabular-nums text-slate-950">
                  {formatNaira(order.markupEarned)}
                </strong>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="order-detail-status-select"
              className="mb-1.5 block text-xs font-medium text-slate-500"
            >
              Update Fulfillment Status
            </label>
            <select
              id="order-detail-status-select"
              value={order.status}
              onChange={(e) => {
                const nextStatus = e.target.value as OrderStatus
                updateOrderStatus(order.id, nextStatus)
                toast.success(`Order #${order.id} updated to ${statusLabel(nextStatus)}`)
              }}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-950 focus:border-slate-950 focus:outline-none"
            >
              {allStatuses.map((st) => (
                <option key={st} value={st}>
                  {statusLabel(st)}
                </option>
              ))}
            </select>
          </div>
        </section>
      </div>

      {/* Ordered Items List */}
      {order.items && order.items.length > 0 ? (
        <section>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Items ({order.items.length})
          </h2>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between gap-3 py-3.5 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-11 w-11 shrink-0 rounded-md bg-[#F4F4F5] object-contain p-1"
                    />
                  ) : null}
                  <div>
                    <h4 className="text-xs font-bold text-slate-950">{item.name}</h4>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span>
                        Qty: <strong className="text-slate-900">{item.quantity}</strong>
                      </span>
                      {item.size ? (
                        <span>
                          &bull; Size:{' '}
                          <strong className="text-slate-900">{item.size}</strong>
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs sm:justify-end">
                  <div>
                    <span className="block text-[10px] text-slate-400">Base Cost</span>
                    <span className="font-semibold tabular-nums text-slate-600">
                      {formatNaira(item.basePrice * item.quantity)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">Retail Price</span>
                    <span className="font-bold tabular-nums text-slate-950">
                      {formatNaira(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
