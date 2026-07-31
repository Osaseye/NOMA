import { AdminTitle } from '../../components/admin/AdminTitle'
import { AdminProductGrid } from '../../features/product-management/AdminProductGrid'
import { products } from '../../mock/commerce'

export function ProductsPage() {
  return (
    <>
      <AdminTitle title="Products" detail="Customer-facing product cards plus operator edit access." />
      <AdminProductGrid products={products} />
    </>
  )
}
