import { useParams } from 'react-router-dom'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { ProductEditorForm } from '../../features/product-management/ProductEditorForm'
import { products } from '../../mock/commerce'

export function ProductEditorPage() {
  const { productId } = useParams()
  const product = products.find((item) => item.id === productId) ?? products[0]

  return (
    <>
      <AdminTitle title={`Edit ${product.name}`} detail="Base price and markup are visible only in this authenticated operator surface." />
      <ProductEditorForm product={product} />
    </>
  )
}
