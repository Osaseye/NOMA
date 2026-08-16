import { Link } from 'react-router-dom'
import {
  HiCheckCircle,
  HiTruck,
  HiUser,
  HiPhone,
  HiMapPin,
  HiSparkles,
  HiPrinter,
  HiArrowLeft,
  HiCreditCard,
  HiShoppingBag,
} from 'react-icons/hi2'
import type { Order, OrderStatus } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'
import { useProductStore } from '../../store/productStore'

export function OrderDetailPanels({ order }: { order: Order }) {
  const { updateOrderStatus, products } = useProductStore()

  // Sample items for display
  const sampleItems = products.slice(0, 2)

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'placed', label: 'Order Placed', desc: 'Customer completed payment via Paystack' },
    { key: 'processing', label: 'Processing & Packing', desc: 'Fulfillment center preparing package' },
    { key: 'dispatched', label: 'Dispatched for Delivery', desc: 'Handed to GIG Logistics / Rider' },
    { key: 'delivered', label: 'Delivered', desc: 'Customer confirmed receipt' },
  ]

  const getCurrentStepIndex = () => {
    switch (order.status) {
      case 'placed':
        return 0
      case 'processing':
        return 1
      case 'dispatched':
        return 2
      case 'delivered':
        return 3
      default:
        return 0
    }
  }

  const currentIdx = getCurrentStepIndex()

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/admin/orders"
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <HiArrowLeft size={16} /> Back to All Orders
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <HiPrinter size={16} /> Print Receipt
          </button>
          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold uppercase text-white outline-none cursor-pointer hover:bg-emerald-700"
          >
            <option value="placed">Set Status: Placed</option>
            <option value="processing">Set Status: Processing</option>
            <option value="dispatched">Set Status: Dispatched</option>
            <option value="delivered">Set Status: Delivered</option>
            <option value="cancelled">Set Status: Cancelled</option>
          </select>
        </div>
      </div>

      {/* Progress Step Timeline */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Fulfillment Stage Tracker
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => {
            const isDone = idx <= currentIdx
            const isCurrent = idx === currentIdx
            return (
              <div
                key={step.key}
                className={`relative flex flex-col gap-2 rounded-xl border p-4 transition-all ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                    : isDone
                    ? 'border-slate-200 bg-slate-50'
                    : 'border-slate-200 bg-white opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-400">Step {idx + 1}</span>
                  {isDone && <HiCheckCircle className="text-emerald-600" size={18} />}
                </div>
                <h4 className="text-xs font-black text-slate-900">{step.label}</h4>
                <p className="text-[11px] text-slate-500">{step.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer & Shipping info */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Itemized Order Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <HiShoppingBag size={16} className="text-emerald-600" /> Purchased Line Items
            </h3>
            <div className="divide-y divide-slate-100">
              {sampleItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-contain border p-1 bg-slate-50" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">{item.name}</span>
                      <span className="text-[10px] text-slate-400">Qty: 1 • Supplier: {item.brand}</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-900">{formatNaira(item.finalPrice)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4 flex flex-col gap-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">{formatNaira(order.total - order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee ({order.deliveryArea})</span>
                <span className="font-bold">{formatNaira(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2 mt-1">
                <span>Total Amount Paid</span>
                <span className="text-emerald-700">{formatNaira(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <HiUser size={16} className="text-emerald-600" /> Customer & Delivery Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Customer Name</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <HiUser size={14} className="text-slate-400" /> {order.customer}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Phone Number</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <HiPhone size={14} className="text-slate-400" /> {order.phone}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Destination Area</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <HiMapPin size={14} className="text-slate-400" /> {order.deliveryArea}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Money Reconciliation */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <HiSparkles size={16} className="text-emerald-600" /> Supplier & Profit Reconciliation
            </h3>

            <div className="flex flex-col gap-3">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Gross Total Received</span>
                <span className="font-['Outfit'] font-black text-xl text-slate-900">{formatNaira(order.total)}</span>
              </div>

              <div className="rounded-xl bg-rose-50 p-4 border border-rose-200 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-rose-800">Base Cost Owed to Supplier</span>
                <span className="font-['Outfit'] font-black text-xl text-rose-900">{formatNaira(order.baseAmountOwed)}</span>
              </div>

              <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-emerald-800">Net Operator Profit Kept</span>
                <span className="font-['Outfit'] font-black text-2xl text-emerald-900">{formatNaira(order.markupEarned)}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5"><HiCreditCard size={15} /> Payment Reference</span>
                <span className="font-mono font-bold text-slate-900">{order.paymentRef || 'PSK-88421'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5"><HiTruck size={15} /> Delivery Partner</span>
                <span className="font-bold text-slate-900">GIG Logistics Express</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
