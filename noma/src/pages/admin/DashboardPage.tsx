import { AdminTitle } from '../../components/admin/AdminTitle'
import { DashboardRevenueChart } from '../../features/admin-dashboard/DashboardCharts'
import { MonthlySummaryCards } from '../../features/admin-dashboard/MonthlySummaryCards'
import { NeedsAttention } from '../../features/admin-dashboard/NeedsAttention'
import { orders, products } from '../../mock/commerce'

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <AdminTitle title="Monthly summary" detail="Salary and markup stay visibly separate, exactly as the business model requires." />
      <MonthlySummaryCards orders={orders} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <DashboardRevenueChart />
        <NeedsAttention products={products} />
      </div>
    </div>
  )
}
