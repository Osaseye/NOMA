import { RevenueAreaChart } from '../../components/admin/RevenueChart'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { KpiCard } from '../../design-system/components/KpiCard'
import { useProductStore } from '../../store/productStore'
import { formatNaira, monthlySummary } from '../../utils/pricing'

export function RevenuePage() {
  const { orders } = useProductStore()
  const summary = monthlySummary(orders)
  const averageOrderValue = orders.length > 0 ? Math.round(summary.totalSales / orders.length) : 0

  return (
    <div className="flex flex-col gap-6 pb-12">
      <AdminTitle
        title="Gross Sales & Revenue Analytics"
        detail="Monitor customer sales volume, average order values, and operator margin performance."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard
          label="Gross Store Sales"
          value={formatNaira(summary.totalSales)}
          tone="cobalt"
          subtitle="All processed payments"
        />
        <KpiCard
          label="Average Order Value"
          value={formatNaira(averageOrderValue)}
          tone="ink"
          subtitle="Per completed checkout"
        />
        <KpiCard
          label="Total Orders"
          value={`${orders.length}`}
          tone="amber"
          subtitle="Recorded orders"
        />
        <KpiCard
          label="Net Store Margin"
          value={formatNaira(summary.markupEarned)}
          tone="success"
          subtitle="Operator markup profit"
        />
      </div>

      <section className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <div className="border-b border-[#E5E7EB] pb-4">
          <h2 className="text-base font-bold tracking-tight text-[#0B1220]">
            Gross Sales Trajectory (NGN)
          </h2>
          <p className="mt-0.5 text-xs text-[#5E6675]">
            Aggregated chronologically from live order records
          </p>
        </div>
        <RevenueAreaChart orders={orders} />
      </section>
    </div>
  )
}
