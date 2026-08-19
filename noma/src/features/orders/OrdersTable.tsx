import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiEye, HiSparkles, HiPhone, HiMapPin, HiClipboardDocumentList } from 'react-icons/hi2'
import type { Order, OrderStatus } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'
import { useProductStore } from '../../store/productStore'

export function OrdersTable({ orders }: { orders: Order[] }) {
  const { updateOrderStatus } = useProductStore()
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredOrders = orders.filter((o) => filterStatus === 'all' || o.status === filterStatus)

  const statusBadges: Record<OrderStatus, { bg: string; text: string }> = {
    placed: { bg: 'bg-amber-100', text: 'text-amber-800' },
    processing: { bg: 'bg-sky-100', text: 'text-sky-800' },
    packed: { bg: 'bg-blue-100', text: 'text-blue-800' },
    dispatched: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    delivered: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {['all', 'placed', 'packed', 'dispatched', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
              filterStatus === status
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {status} ({status === 'all' ? orders.length : orders.filter((o) => o.status === status).length})
          </button>
        ))}
      </div>

      {/* Orders 2-Column Cards Grid */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center gap-2 shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-1">
            <HiClipboardDocumentList size={28} />
          </div>
          <span className="font-bold text-sm text-slate-900">No Orders Processed Yet</span>
          <span className="text-xs text-slate-400 max-w-sm">
            Customer checkouts from the storefront or backend API sync will populate live orders here.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((o) => (
            <div
              key={o.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-3">
                {/* Header: ID, Ref, Status Dropdown */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <Link
                      to={`/admin/orders/${o.id}`}
                      className="font-black text-sm text-slate-900 hover:text-emerald-600 transition-colors"
                    >
                      {o.id}
                    </Link>
                    <span className="block text-[10px] font-mono text-slate-400 mt-0.5">
                      Ref: {o.paymentRef || 'PSK-ONLINE'}
                    </span>
                  </div>
                  <select
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase outline-none cursor-pointer ${
                      statusBadges[o.status]?.bg || 'bg-slate-100'
                    } ${statusBadges[o.status]?.text || 'text-slate-800'}`}
                  >
                    <option value="placed">Placed</option>
                    <option value="packed">Packed</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                {/* Customer & Delivery Information */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Customer</span>
                    <span className="font-extrabold text-slate-900 truncate">{o.customer}</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <HiPhone size={11} className="text-slate-400 shrink-0" /> {o.phone}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Delivery Area</span>
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <HiMapPin size={13} className="text-slate-400 shrink-0" /> {o.deliveryArea}
                    </span>
                  </div>
                </div>

                {/* Financial Details Row */}
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50/80 p-3 border border-slate-100">
                  <div>
                    <span className="block text-[9px] font-bold uppercase text-slate-400">Total Charged</span>
                    <span className="text-base font-black text-slate-900">{formatNaira(o.total)}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase text-emerald-600">Markup Profit</span>
                    <span className="text-base font-black text-emerald-600 flex items-center gap-0.5">
                      <HiSparkles size={13} /> {formatNaira(o.markupEarned || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  to={`/admin/orders/${o.id}`}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-bold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-2xs"
                >
                  <HiEye size={14} /> View Complete Order Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
