import { Link } from 'react-router-dom'
import { CreditCard, DownloadSimple, Eye, Storefront } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { EmptyState } from '../../design-system/components/EmptyState'
import type { Order } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

export function SupplierLedgerTable({ orders }: { orders: Order[] }) {
  const totalBaseOwed = orders.reduce((sum, o) => sum + (o.baseAmountOwed || 0), 0)

  const handleExportSchedule = () => {
    toast.success('Supplier payout schedule exported.')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Total Supplier Liability Summary */}
      <div className="flex flex-col justify-between gap-4 rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] p-4 sm:flex-row sm:items-center sm:p-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-[#FECACA] bg-white text-[#B91C1C]">
            <Storefront size={20} weight="regular" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#B91C1C]">
              Total Supplier Invoice Liability
            </span>
            <span className="font-mono tabular-nums text-xl font-bold text-[#0B1220] sm:text-2xl">
              {formatNaira(totalBaseOwed)}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleExportSchedule}
          className="inline-flex items-center justify-center gap-1.5 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
        >
          <DownloadSimple size={14} weight="regular" />
          <span>Export Payout Schedule</span>
        </button>
      </div>

      {/* 2-Column Cards Grid */}
      {orders.length === 0 ? (
        <EmptyState
          icon={<Storefront size={24} weight="regular" />}
          title="No Supplier Liabilities Outstanding"
          detail="Incoming order transactions will calculate base supplier wholesale costs here automatically."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {orders.map((o) => (
            <article
              key={o.id}
              className="flex flex-col justify-between rounded-[8px] border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#D1D5DB]"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                  <div>
                    <Link
                      to={`/admin/orders/${o.id}`}
                      className="font-mono text-sm font-bold text-[#0B1220] transition-colors hover:text-[#1049EB]"
                    >
                      {o.id}
                    </Link>
                    <span className="mt-0.5 block font-mono text-[11px] text-[#5E6675]">
                      Ref: {o.paymentRef || 'PSK-PENDING'}
                    </span>
                  </div>
                  <span className="rounded-[4px] border border-[#E5E7EB] bg-[#F6F7F9] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#374151]">
                    {o.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                      Customer
                    </span>
                    <span className="mt-0.5 truncate font-semibold text-[#0B1220]">
                      {o.customer}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                      Payment Channel
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 font-mono text-[11px] font-medium text-[#374151]">
                      <CreditCard size={13} weight="regular" className="text-[#5E6675]" />
                      <span>{o.paymentMethod || 'Card / Transfer'}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-[6px] border border-[#FECACA] bg-[#FEF2F2] p-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#B91C1C]">
                    Base Cost Payable
                  </span>
                  <span className="font-mono tabular-nums text-base font-bold text-[#B91C1C]">
                    {formatNaira(o.baseAmountOwed)}
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t border-[#E5E7EB] pt-3">
                <Link
                  to={`/admin/orders/${o.id}`}
                  className="flex w-full items-center justify-center gap-1.5 rounded-[6px] border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#0B1220] transition-colors hover:bg-[#0B1220] hover:text-white"
                >
                  <Eye size={14} weight="regular" />
                  <span>View Order Details</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
