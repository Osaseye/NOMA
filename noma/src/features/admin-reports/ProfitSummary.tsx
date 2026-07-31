import { KpiCard } from '../../design-system/components/KpiCard'
import type { Order } from '../../types/commerce'
import { formatNaira, monthlySummary } from '../../utils/pricing'

export function ProfitSummary({ orders }: { orders: Order[] }) {
  const summary = monthlySummary(orders)

  return (
    <div className="kpi-grid">
      <KpiCard label="Markup earned" value={formatNaira(summary.markupEarned)} tone="gold" />
      <KpiCard label="Salary" value={formatNaira(summary.salary)} />
      <KpiCard label="Net income" value={formatNaira(summary.netIncome)} tone="ink" />
    </div>
  )
}
