import { RevenueAreaChart } from '../../components/admin/RevenueChart'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { KpiCard } from '../../design-system/components/KpiCard'
import { useProductStore } from '../../store/productStore'
import { formatNaira, monthlySummary } from '../../utils/pricing'

export function RevenuePage() {
  const { orders } = useProductStore()
  const summary = monthlySummary(orders)
  const averageOrderValue =
    orders.length > 0 ? Math.round(summary.totalSales / orders.length) : 0

  return (
    <div className="flex flex-col gap-8 pb-12">
      <AdminTitle
        title="Revenue"
        detail="Gross sales volume, average order values, and earned store margin."
      />

      <div className="grid grid-cols-2 border-b border-slate-200 pb-4 sm:grid-cols-4">
        <KpiCard
          label="Gross Sales"
          value={formatNaira(summary.totalSales)}
          subtitle="All processed payments"
        />
        <KpiCard
          label="Average Order Value"
          value={formatNaira(averageOrderValue)}
          subtitle="Per checkout"
        />
        <KpiCard
          label="Total Orders"
          value={`${orders.length}`}
          subtitle="Recorded orders"
        />
        <KpiCard
          label="Net Margin"
          value={formatNaira(summary.markupEarned)}
          subtitle="Store profit"
        />
      </div>

      <section>
        <div className="mb-3">
          <h2 className="text-sm font-bold text-slate-950">Gross Sales Trajectory (NGN)</h2>
          <p className="text-xs text-slate-500">
            Aggregated chronologically from order records
          </p>
        </div>
        <RevenueAreaChart orders={orders} />
      </section>
    </div>
  )
}
