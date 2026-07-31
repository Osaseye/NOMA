import { AdminTitle } from '../../components/admin/AdminTitle'
import { DashboardRevenueChart } from '../../features/admin-dashboard/DashboardCharts'
import { MonthlySummaryCards } from '../../features/admin-dashboard/MonthlySummaryCards'
import { NeedsAttention } from '../../features/admin-dashboard/NeedsAttention'
import { orders, products } from '../../mock/commerce'

export function DashboardPage() {
  return (
    <>
      <AdminTitle title="Monthly summary" detail="Salary and markup stay visibly separate, exactly as the business model requires." />
      <MonthlySummaryCards orders={orders} />
      <div className="admin-grid">
        <DashboardRevenueChart />
        <NeedsAttention products={products} />
      </div>
    </>
  )
}
