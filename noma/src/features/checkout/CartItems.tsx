import { Minus, Plus } from '@phosphor-icons/react'
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
    return (
      <EmptyState
        title="Your cart is empty"
        detail="Browse the catalog or send Noma a WhatsApp message for product assistance."
      />
    )
  }

  return (
    <div className="divide-y divide-[#E5E7EB] rounded-[8px] border border-[#E5E7EB] bg-white">
      {products.map((product) => (
        <article
          key={product.id}
          className="flex items-center justify-between gap-4 p-4"
        >
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="h-16 w-16 shrink-0 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] object-contain p-1.5"
            />
            <div className="min-w-0">
              <strong className="block truncate text-sm font-semibold text-[#0B1220]">
                {product.name}
              </strong>
              <span className="font-mono text-xs font-medium text-[#5E6675]">
                {formatNaira(product.finalPrice)}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center rounded-[6px] border border-[#E5E7EB] bg-white">
            <button
              type="button"
              onClick={() => onRemove(product.id)}
              aria-label={`Remove one ${product.name}`}
              className="p-2 text-[#5E6675] hover:text-[#0B1220]"
            >
              <Minus size={14} weight="regular" />
            </button>
            <span className="w-8 text-center font-mono text-xs font-bold text-[#0B1220]">
              {quantities[product.id] ?? 0}
            </span>
            <button
              type="button"
              onClick={() => onAdd(product.id)}
              aria-label={`Add one ${product.name}`}
              className="p-2 text-[#5E6675] hover:text-[#0B1220]"
            >
              <Plus size={14} weight="regular" />
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
