import { RevenueAreaChart } from '../../components/admin/RevenueChart'
import { Card } from '../../design-system/components/Card'

export function DashboardRevenueChart() {
  return (
    <Card className="chart-card">
      <h2>Revenue rhythm</h2>
      <RevenueAreaChart />
    </Card>
  )
}
