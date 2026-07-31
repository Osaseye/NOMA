import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/commerce/ProductCard'
import type { Product } from '../../types/commerce'

export function AdminProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="inventory-grid">
      {products.map((product) => (
        <div key={product.id}>
          <ProductCard product={product} />
          <Link className="edit-link" to={`/admin/products/${product.id}/edit`}>Edit product</Link>
        </div>
      ))}
    </div>
  )
}
