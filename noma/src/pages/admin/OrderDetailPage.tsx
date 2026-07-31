import { useParams } from 'react-router-dom'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { OrderDetailPanels } from '../../features/orders/OrderDetailPanels'
import { orders } from '../../mock/commerce'

export function OrderDetailPage() {
  const { orderId } = useParams()
  const order = orders.find((item) => item.id === orderId) ?? orders[0]

  return (
    <>
      <AdminTitle title={`Order ${order.id}`} detail="Payment, delivery, and supplier reconciliation for this order." />
      <OrderDetailPanels order={order} />
    </>
  )
}
