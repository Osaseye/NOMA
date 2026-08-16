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
    packed: { bg: 'bg-blue-100', text: 'text-blue-800' },
    dispatched: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    delivered: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
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
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {status} ({status === 'all' ? orders.length : orders.filter((o) => o.status === status).length})
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-1">
              <HiClipboardDocumentList size={28} />
            </div>
            <span className="font-bold text-sm text-slate-900">No Orders Processed Yet</span>
            <span className="text-xs text-slate-400 max-w-sm">
              Customer checkouts from the storefront or backend API sync will populate live orders here.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 font-extrabold uppercase text-slate-500 text-[10px] tracking-wider">
                  <th className="p-4">Order ID & Ref</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Delivery Area</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Markup Earned</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <Link to={`/admin/orders/${o.id}`} className="font-black text-slate-900 hover:text-emerald-600">
                          {o.id}
                        </Link>
                        <span className="text-[10px] text-slate-400 font-mono">{o.paymentRef || 'PSK-ONLINE'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{o.customer}</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <HiPhone size={11} /> {o.phone}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-slate-700 font-bold">
                        <HiMapPin size={13} className="text-slate-400" /> {o.deliveryArea}
                      </span>
                    </td>
                    <td className="p-4 font-black text-slate-900">{formatNaira(o.total)}</td>
                    <td className="p-4 text-emerald-600 font-black flex items-center gap-1">
                      <HiSparkles size={13} /> {formatNaira(o.markupEarned || 0)}
                    </td>
                    <td className="p-4">
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
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <HiEye size={14} /> View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
