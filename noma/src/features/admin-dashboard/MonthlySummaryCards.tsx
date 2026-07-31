import { KpiCard } from '../../design-system/components/KpiCard'
import type { Order } from '../../types/commerce'
import { formatNaira, monthlySummary } from '../../utils/pricing'

export function MonthlySummaryCards({ orders }: { orders: Order[] }) {
  const summary = monthlySummary(orders)

  return (
    <div className="kpi-grid">
      <KpiCard label="Total sales" value={formatNaira(summary.totalSales)} />
      <KpiCard label="Owed to supplier" value={formatNaira(summary.owedToSupplier)} tone="ink" />
      <KpiCard label="Markup earned" value={formatNaira(summary.markupEarned)} tone="gold" />
      <KpiCard label="Fixed salary" value={formatNaira(summary.salary)} />
    </div>
  )
}
