import { RevenueAreaChart } from '../../components/admin/RevenueChart'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { KpiCard } from '../../design-system/components/KpiCard'
import { useProductStore } from '../../store/productStore'
import { formatNaira, monthlySummary } from '../../utils/pricing'

export function RevenuePage() {
  const { orders } = useProductStore()
  const summary = monthlySummary(orders)

  return (
    <div className="flex flex-col gap-8 pb-12">
      <AdminTitle
        title="Gross Sales & Revenue Analytics"
        detail="Monitor customer sales volume, average order values, and category revenue performance."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard label="Gross Store Sales" value={formatNaira(summary.totalSales)} tone="emerald" subtitle="All processed payments" />
        <KpiCard label="Average Order Value" value={formatNaira(Math.round(summary.totalSales / (orders.length || 1)))} tone="blue" subtitle="Per completed checkout" />
        <KpiCard label="Total Orders" value={`${orders.length} Orders`} tone="gold" subtitle="Fulfilled this month" />
        <KpiCard label="Net Store Margin" value={formatNaira(summary.markupEarned)} tone="ink" subtitle="Operator markup profit" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
        <h2 className="font-['Outfit'] font-black text-base text-slate-900">Gross Sales Trajectory (Naira)</h2>
        <RevenueAreaChart />
      </div>
    </div>
  )
}
