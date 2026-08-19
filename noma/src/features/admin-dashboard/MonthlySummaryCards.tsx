import { KpiCard } from '../../design-system/components/KpiCard'
import type { Order } from '../../types/commerce'
import { formatNaira, monthlySummary } from '../../utils/pricing'

export function MonthlySummaryCards({ orders }: { orders: Order[] }) {
  const summary = monthlySummary(orders)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <KpiCard label="Gross Sales Total" value={formatNaira(summary.totalSales)} tone="emerald" subtitle="All customer orders" />
      <KpiCard label="Owed to Supplier" value={formatNaira(summary.owedToSupplier)} tone="ink" subtitle="Wholesale cost" />
      <KpiCard label="Net Markup Earned" value={formatNaira(summary.markupEarned)} tone="gold" subtitle="Pure operator margin" />
      <KpiCard label="Fixed Allocation" value={formatNaira(summary.salary)} tone="blue" subtitle="Operations fund" />
    </div>
  )
}
