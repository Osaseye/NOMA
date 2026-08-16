import { AdminTitle } from '../../components/admin/AdminTitle'
import { DashboardRevenueChart } from '../../features/admin-dashboard/DashboardCharts'
import { MonthlySummaryCards } from '../../features/admin-dashboard/MonthlySummaryCards'
import { NeedsAttention } from '../../features/admin-dashboard/NeedsAttention'
import { useProductStore } from '../../store/productStore'

export function DashboardPage() {
  const { orders, products } = useProductStore()

  return (
    <div className="flex flex-col gap-8 pb-12">
      <AdminTitle
        title="Monthly Executive Summary"
        detail="Supplier wholesale cost and profit markup margins stay strictly separated for maximum clarity."
      />
      <MonthlySummaryCards orders={orders} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <DashboardRevenueChart />
        <NeedsAttention products={products} />
      </div>
    </div>
  )
}
