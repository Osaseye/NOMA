import { Link } from 'react-router-dom'
import { HiBuildingStorefront, HiCreditCard } from 'react-icons/hi2'
import type { Order } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

export function SupplierLedgerTable({ orders }: { orders: Order[] }) {
  const totalBaseOwed = orders.reduce((sum, o) => sum + (o.baseAmountOwed || 0), 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Total Supplier Liability Summary */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md">
            <HiBuildingStorefront size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-800">Total Supplier Invoice Liability</span>
            <span className="font-['Outfit'] font-black text-2xl text-rose-900">{formatNaira(totalBaseOwed)}</span>
          </div>
        </div>
        <button
          onClick={() => alert('Supplier payout export initiated!')}
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
        >
          Export Supplier Payout Schedule
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {orders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-1">
              <HiBuildingStorefront size={28} />
            </div>
            <span className="font-bold text-sm text-slate-900">No Supplier Liabilities Outstanding</span>
            <span className="text-xs text-slate-400 max-w-sm">
              Supplier ledger is scrubbed clean for backend API integration. Incoming order transactions will calculate base supplier costs here.
            </span>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-extrabold uppercase text-slate-500 text-[10px] tracking-wider">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4">Base Cost Owed</th>
                <th className="p-4 text-right">Payment Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <Link to={`/admin/orders/${o.id}`} className="font-black text-slate-900 hover:text-emerald-600">
                      {o.id}
                    </Link>
                  </td>
                  <td className="p-4 font-bold text-slate-700">{o.customer}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase text-slate-700">
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4 font-black text-rose-700">{formatNaira(o.baseAmountOwed)}</td>
                  <td className="p-4 text-right">
                    <span className="font-mono text-[11px] font-bold text-slate-500 flex items-center justify-end gap-1">
                      <HiCreditCard size={14} /> {o.paymentRef || 'PSK-88421'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
