import { MessageCircle } from 'lucide-react'
import { Button } from '../../design-system/components/Button'
import { formatNaira } from '../../utils/pricing'

export function OrderSummary({
  subtotal,
  delivery,
  action,
  onAction,
}: {
  subtotal: number
  delivery: number
  action: string
  onAction: () => void
}) {
  return (
    <aside className="summary-card">
      <h2>Order summary</h2>
      <div><span>Items</span><strong>{formatNaira(subtotal)}</strong></div>
      <div><span>Delivery</span><strong>{delivery ? formatNaira(delivery) : 'Calculated next'}</strong></div>
      <div className="total"><span>Total</span><strong>{formatNaira(subtotal + delivery)}</strong></div>
      <Button onClick={onAction}>{action}</Button>
      <Button variant="ghost"><MessageCircle size={18} /> Continue on WhatsApp</Button>
    </aside>
  )
}
