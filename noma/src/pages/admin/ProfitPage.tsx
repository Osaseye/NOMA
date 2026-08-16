import { ProfitBarChart } from '../../components/admin/RevenueChart'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { ProfitSummary } from '../../features/admin-reports/ProfitSummary'
import { useProductStore } from '../../store/productStore'

export function ProfitPage() {
  const { orders } = useProductStore()

  return (
    <div className="flex flex-col gap-8 pb-12">
      <AdminTitle
        title="Operator Profit & Margin Reconciliation"
        detail="Keep supplier cost separate from earned markup margins to preserve true business take-home income."
      />
      <ProfitSummary orders={orders} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
        <h2 className="font-['Outfit'] font-black text-base text-slate-900">Daily Profit Margin Distribution</h2>
        <ProfitBarChart />
      </div>
    </div>
  )
}
