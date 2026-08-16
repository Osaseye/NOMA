import { AdminTitle } from '../../components/admin/AdminTitle'
import { AdminProductGrid } from '../../features/product-management/AdminProductGrid'
import { useProductStore } from '../../store/productStore'

export function ProductsPage() {
  const { products } = useProductStore()

  return (
    <div className="flex flex-col gap-6 pb-12">
      <AdminTitle
        title="Product Inventory Catalog"
        detail="Manage storefront products, prices, stock levels, markups, and promotional badges."
      />
      <AdminProductGrid products={products} />
    </div>
  )
}
