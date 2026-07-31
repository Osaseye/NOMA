import { Card } from '../../design-system/components/Card'
import type { Product } from '../../types/commerce'

export function NeedsAttention({ products }: { products: Product[] }) {
  const lowStock = products.filter((product) => product.stockQty < 10)

  return (
    <Card>
      <h2>Needs attention</h2>
      {lowStock.map((product) => <p key={product.id}>{product.name} has {product.stockQty} left</p>)}
    </Card>
  )
}
