import { KpiCard } from '../../design-system/components/KpiCard'
import type { Order } from '../../types/commerce'
import { formatNaira, monthlySummary } from '../../utils/pricing'

export function ProfitSummary({ orders }: { orders: Order[] }) {
  const summary = monthlySummary(orders)
  const marginRate =
    summary.totalSales > 0
      ? Math.round((summary.markupEarned / summary.totalSales) * 100)
      : 0

  return (
    <div className="grid grid-cols-2 border-b border-slate-200 pb-4 sm:grid-cols-4">
      <KpiCard
        label="Net Profit Margin"
        value={formatNaira(summary.markupEarned)}
        subtitle="Earned store markup"
      />
      <KpiCard
        label="Supplier Cost"
        value={formatNaira(summary.owedToSupplier)}
        subtitle="Wholesale payables"
      />
      <KpiCard
        label="Gross Store Sales"
        value={formatNaira(summary.totalSales)}
        subtitle="Total order volume"
      />
      <KpiCard
        label="Average Margin Rate"
        value={`${marginRate}%`}
        subtitle="Markup to gross sales"
      />
    </div>
  )
}
