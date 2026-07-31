import { RevenueAreaChart } from '../../components/admin/RevenueChart'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { Card } from '../../design-system/components/Card'

export function RevenuePage() {
  return (
    <>
      <AdminTitle title="Revenue tracking" detail="Sales volume, average order value, and category demand." />
      <Card className="chart-card"><RevenueAreaChart /></Card>
    </>
  )
}
