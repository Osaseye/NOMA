import type { Order } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

export function OrderDetailPanels({ order }: { order: Order }) {
  return (
    <section className="admin-grid">
      <div className="ds-card"><h2>Customer</h2><p>{order.customer}</p><p>{order.phone}</p><p>{order.deliveryArea}</p></div>
      <div className="ds-card"><h2>Money split</h2><p>Total {formatNaira(order.total)}</p><p>Supplier owed {formatNaira(order.baseAmountOwed)}</p><p>Markup kept {formatNaira(order.markupEarned)}</p></div>
    </section>
  )
}
