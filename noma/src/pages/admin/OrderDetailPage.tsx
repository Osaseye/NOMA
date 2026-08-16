import { useParams } from 'react-router-dom'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { OrderDetailPanels } from '../../features/orders/OrderDetailPanels'
import { useProductStore } from '../../store/productStore'

export function OrderDetailPage() {
  const { orderId } = useParams()
  const { orders } = useProductStore()

  const order = orders.find((item) => item.id === orderId) ?? orders[0]

  return (
    <div className="flex flex-col gap-6">
      <AdminTitle
        title={`Fulfillment & Reconciliation: Order ${order?.id}`}
        detail="Manage customer delivery status, supplier invoice reconciliation, and profit markup breakdown."
      />
      {order ? (
        <OrderDetailPanels order={order} />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Order not found.
        </div>
      )}
    </div>
  )
}
