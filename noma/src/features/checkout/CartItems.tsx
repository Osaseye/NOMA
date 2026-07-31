import { Minus, Plus } from 'lucide-react'
import { EmptyState } from '../../design-system/components/EmptyState'
import type { Product } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

export function CartItems({
  products,
  quantities,
  onAdd,
  onRemove,
}: {
  products: Product[]
  quantities: Record<string, number>
  onAdd: (productId: string) => void
  onRemove: (productId: string) => void
}) {
  if (!products.length) {
    return <EmptyState title="Your cart is empty" detail="Browse the catalog or send Noma a WhatsApp message for product help." />
  }

  return (
    <>
      {products.map((product) => (
        <article className="cart-row" key={product.id}>
          <img src={product.image} alt={product.name} />
          <div><strong>{product.name}</strong><span>{formatNaira(product.finalPrice)}</span></div>
          <div className="stepper">
            <button type="button" onClick={() => onRemove(product.id)} aria-label={`Remove one ${product.name}`}><Minus size={15} /></button>
            <span>{quantities[product.id]}</span>
            <button type="button" onClick={() => onAdd(product.id)} aria-label={`Add one ${product.name}`}><Plus size={15} /></button>
          </div>
        </article>
      ))}
    </>
  )
}
