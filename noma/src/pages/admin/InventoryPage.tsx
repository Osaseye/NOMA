import { Plus } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { InventoryTable } from '../../features/product-management/InventoryTable'
import { useProductStore } from '../../store/productStore'

export function InventoryPage() {
  const { products } = useProductStore()

  return (
    <div className="flex flex-col gap-5 pb-12">
      <AdminTitle
        title="Inventory"
        detail="Adjust unit counts and monitor stock thresholds."
        action={
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={14} weight="bold" />
            <span>Add Product</span>
          </Link>
        }
      />
      <InventoryTable products={products} />
    </div>
  )
}
