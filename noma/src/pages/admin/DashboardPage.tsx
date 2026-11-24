import { Plus } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { DashboardCharts } from '../../features/admin-dashboard/DashboardCharts'
import { MonthlySummaryCards } from '../../features/admin-dashboard/MonthlySummaryCards'
import { NeedsAttention } from '../../features/admin-dashboard/NeedsAttention'
import { useProductStore } from '../../store/productStore'

export function DashboardPage() {
  const { products, orders } = useProductStore()

  return (
    <div className="flex flex-col gap-8 pb-12">
      <AdminTitle
        title="Dashboard"
        detail="Overview of sales, orders, and inventory."
        action={
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <Plus size={14} weight="bold" />
            <span>Add Product</span>
          </Link>
        }
      />

      <MonthlySummaryCards orders={orders} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <DashboardCharts orders={orders} />
        </div>
        <div className="lg:col-span-4">
          <NeedsAttention products={products} orders={orders} />
        </div>
      </div>
    </div>
  )
}
