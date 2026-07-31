import { AdminTitle } from '../../components/admin/AdminTitle'
import { EmptyState } from '../../design-system/components/EmptyState'

export function SettingsPage() {
  return (
    <>
      <AdminTitle title="Settings & access" detail="Low-frequency controls stay out of the daily operator flow." />
      <div className="policy-grid">
        <EmptyState title="Operator access" detail="Single-user admin with no public sign-up path." />
        <EmptyState title="Payments" detail="Paystack and Flutterwave configured as pending CAC approval." />
        <EmptyState title="Logistics" detail="GIG Logistics-style estimates mocked for frontend handoff." />
      </div>
    </>
  )
}
