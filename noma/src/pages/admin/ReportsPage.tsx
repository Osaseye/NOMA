import { AdminTitle } from '../../components/admin/AdminTitle'
import { ReportCards } from '../../features/admin-reports/ReportCards'

export function ReportsPage() {
  return (
    <div className="flex flex-col gap-5 pb-12">
      <AdminTitle
        title="Reports"
        detail="Export financial ledgers, inventory valuations, and user directories as CSV."
      />
      <ReportCards />
    </div>
  )
}
