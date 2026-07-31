import { AdminTitle } from '../../components/admin/AdminTitle'
import { InventoryTable } from '../../features/product-management/InventoryTable'
import { products } from '../../mock/commerce'

export function InventoryPage() {
  return (
    <>
      <AdminTitle title="Inventory" detail="Stock health, category coverage, and low-stock states." />
      <InventoryTable products={products} />
    </>
  )
}
