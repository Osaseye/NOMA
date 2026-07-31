import { AdminTitle } from '../../components/admin/AdminTitle'
import { ReportCards } from '../../features/admin-reports/ReportCards'

export function ReportsPage() {
  return (
    <>
      <AdminTitle title="Reports" detail="Export-ready summaries for operator income, supplier amounts, orders, and product performance." />
      <ReportCards />
    </>
  )
}
