import { AdminTitle } from '../../components/admin/AdminTitle'
import { ReportCards } from '../../features/admin-reports/ReportCards'

export function ReportsPage() {
  return (
    <div className="flex flex-col gap-6 pb-12">
      <AdminTitle
        title="Business Intelligence & Operational Reports"
        detail="Generate export-ready financial audit reports, inventory valuation tables, and category sales breakdowns."
      />
      <ReportCards />
    </div>
  )
}
