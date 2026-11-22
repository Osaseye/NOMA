import { ProfitBarChart } from '../../components/admin/RevenueChart'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { ProfitSummary } from '../../features/admin-reports/ProfitSummary'
import { useProductStore } from '../../store/productStore'

export function ProfitPage() {
  const { orders } = useProductStore()

  return (
    <div className="flex flex-col gap-6 pb-12">
      <AdminTitle
        title="Operator Profit & Margin Reconciliation"
        detail="Keep supplier cost separate from earned markup margins to preserve accurate business take-home income."
      />
      <ProfitSummary orders={orders} />
      <section className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <div className="border-b border-[#E5E7EB] pb-4">
          <h2 className="text-base font-bold tracking-tight text-[#0B1220]">
            Daily Profit Margin Distribution
          </h2>
          <p className="mt-0.5 text-xs text-[#5E6675]">
            Net operator markup per day (NGN)
          </p>
        </div>
        <ProfitBarChart orders={orders} />
      </section>
    </div>
  )
}
