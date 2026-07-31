import { EmptyState } from '../../design-system/components/EmptyState'

export function ReportCards() {
  return (
    <div className="policy-grid">
      <EmptyState title="Monthly summary" detail="Sales, supplier owed, markup earned, salary, and net income." />
      <EmptyState title="Category performance" detail="AOV and conversion patterns across Noma's six retail categories." />
      <EmptyState title="WhatsApp handoff" detail="Product-aware chat exits from PDP, cart, and checkout." />
    </div>
  )
}
