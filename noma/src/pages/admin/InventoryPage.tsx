import { AdminTitle } from '../../components/admin/AdminTitle'
import { InventoryTable } from '../../features/product-management/InventoryTable'
import { useProductStore } from '../../store/productStore'

export function InventoryPage() {
  const { products } = useProductStore()

  return (
    <div className="flex flex-col gap-6 pb-12">
      <AdminTitle
        title="Stock & Inventory Control"
        detail="Monitor warehouse stock health levels, low-stock notifications, and instant quantity restocking."
      />
      <InventoryTable products={products} />
    </div>
  )
}
