import { useParams } from 'react-router-dom'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { ProductEditorForm } from '../../features/product-management/ProductEditorForm'
import { useProductStore } from '../../store/productStore'

export function ProductEditorPage() {
  const { productId } = useParams()
  const { products } = useProductStore()

  const isNew = !productId || productId === 'new'
  const product = isNew ? undefined : products.find((item) => item.id === productId)

  return (
    <div className="flex flex-col gap-6">
      <AdminTitle
        title={isNew ? 'Create New Storefront Product' : `Edit Product: ${product?.name || productId}`}
        detail="Supplier base costs and profit markup margins remain visible only to authenticated operators."
      />
      <ProductEditorForm product={product} />
    </div>
  )
}
