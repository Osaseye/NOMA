import { AdminTitle } from '../../components/admin/AdminTitle'
import { OrdersTable } from '../../features/orders/OrdersTable'
import { orders } from '../../mock/commerce'

export function OrdersPage() {
  return (
    <>
      <AdminTitle title="Orders & delivery" detail="The same status language appears in customer tracking and admin operations." />
      <OrdersTable orders={orders} />
    </>
  )
}
