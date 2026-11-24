import { ProfitBarChart } from '../../components/admin/RevenueChart'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { ProfitSummary } from '../../features/admin-reports/ProfitSummary'
import { useProductStore } from '../../store/productStore'

export function ProfitPage() {
  const { orders } = useProductStore()

  return (
    <div className="flex flex-col gap-8 pb-12">
      <AdminTitle
        title="Profit & Margin"
        detail="Reconcile supplier wholesale costs against earned retail markup margins."
      />
      <ProfitSummary orders={orders} />
      <section>
        <div className="mb-3">
          <h2 className="text-sm font-bold text-slate-950">
            Profit Margin Distribution (NGN)
          </h2>
          <p className="text-xs text-slate-500">Net markup earned per order</p>
        </div>
        <ProfitBarChart orders={orders} />
      </section>
    </div>
  )
}
