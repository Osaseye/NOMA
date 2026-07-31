import { ProfitBarChart } from '../../components/admin/RevenueChart'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { ProfitSummary } from '../../features/admin-reports/ProfitSummary'
import { orders } from '../../mock/commerce'

export function ProfitPage() {
  return (
    <>
      <AdminTitle title="Profit tracking" detail="Markup and salary are separate income streams, then rolled into true operator income." />
      <ProfitSummary orders={orders} />
      <section className="ds-card chart-card"><ProfitBarChart /></section>
    </>
  )
}
