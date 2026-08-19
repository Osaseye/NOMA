import { Link } from 'react-router-dom'
import { HiBuildingStorefront, HiCreditCard, HiEye } from 'react-icons/hi2'
import type { Order } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

export function SupplierLedgerTable({ orders }: { orders: Order[] }) {
  const totalBaseOwed = orders.reduce((sum, o) => sum + (o.baseAmountOwed || 0), 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Total Supplier Liability Summary */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-xs shrink-0">
            <HiBuildingStorefront size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-800">Total Supplier Invoice Liability</span>
            <span className="font-['Outfit'] font-black text-xl sm:text-2xl text-rose-900">{formatNaira(totalBaseOwed)}</span>
          </div>
        </div>
        <button
          onClick={() => alert('Supplier payout export initiated!')}
          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-all"
        >
          Export Payout Schedule
        </button>
      </div>

      {/* 2-Column Cards Grid */}
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center gap-2 shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-1">
            <HiBuildingStorefront size={28} />
          </div>
          <span className="font-bold text-sm text-slate-900">No Supplier Liabilities Outstanding</span>
          <span className="text-xs text-slate-400 max-w-sm">
            Supplier ledger is scrubbed clean for backend API integration. Incoming order transactions will calculate base supplier costs here.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <Link
                      to={`/admin/orders/${o.id}`}
                      className="font-black text-sm text-slate-900 hover:text-emerald-600 transition-colors"
                    >
                      {o.id}
                    </Link>
                    <span className="block text-[10px] font-mono text-slate-400 mt-0.5">
                      Ref: {o.paymentRef || 'PSK-88421'}
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-black uppercase text-slate-700">
                    {o.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Customer</span>
                    <span className="font-extrabold text-slate-900 truncate">{o.customer}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Payment Channel</span>
                    <span className="font-mono text-[11px] font-bold text-slate-600 flex items-center gap-1">
                      <HiCreditCard size={13} className="text-slate-400" /> Card / Transfer
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-rose-50/80 p-3 border border-rose-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-rose-800">Base Cost Payable</span>
                  <span className="text-base font-black text-rose-900">{formatNaira(o.baseAmountOwed)}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  to={`/admin/orders/${o.id}`}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-bold text-slate-700 hover:bg-slate-900 hover:text-white transition-all shadow-2xs"
                >
                  <HiEye size={14} /> View Order Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
