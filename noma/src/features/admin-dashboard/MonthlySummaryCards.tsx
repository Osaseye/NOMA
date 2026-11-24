import { KpiCard } from '../../design-system/components/KpiCard'
import type { Order } from '../../types/commerce'
import { formatNaira, monthlySummary } from '../../utils/pricing'

export function MonthlySummaryCards({ orders }: { orders: Order[] }) {
  const summary = monthlySummary(orders)

  return (
    <div className="grid grid-cols-2 border-b border-slate-200 pb-4 sm:grid-cols-4">
      <KpiCard
        label="Gross Sales"
        value={formatNaira(summary.totalSales)}
        subtitle="Total order volume"
      />
      <KpiCard
        label="Supplier Cost"
        value={formatNaira(summary.owedToSupplier)}
        subtitle="Wholesale base cost"
      />
      <KpiCard
        label="Net Profit"
        value={formatNaira(summary.markupEarned)}
        subtitle="Earned store margin"
      />
      <KpiCard
        label="Total Orders"
        value={`${orders.length}`}
        subtitle="All recorded orders"
      />
    </div>
  )
}
