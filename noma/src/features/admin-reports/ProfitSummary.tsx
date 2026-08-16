import { KpiCard } from '../../design-system/components/KpiCard'
import type { Order } from '../../types/commerce'
import { formatNaira, monthlySummary } from '../../utils/pricing'

export function ProfitSummary({ orders }: { orders: Order[] }) {
  const summary = monthlySummary(orders)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <KpiCard label="Net Markup Margin" value={formatNaira(summary.markupEarned)} tone="gold" subtitle="Pure operator margin" />
      <KpiCard label="Fixed Operator Allocation" value={formatNaira(summary.salary)} tone="blue" subtitle="Guaranteed salary pool" />
      <KpiCard label="Combined Take-Home Income" value={formatNaira(summary.netIncome)} tone="emerald" subtitle="Total net business payout" />
    </div>
  )
}
