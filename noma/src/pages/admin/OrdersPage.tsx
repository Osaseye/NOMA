import { AdminTitle } from '../../components/admin/AdminTitle'
import { OrdersTable } from '../../features/orders/OrdersTable'
import { useProductStore } from '../../store/productStore'

export function OrdersPage() {
  const { orders } = useProductStore()

  return (
    <div className="flex flex-col gap-5 pb-12">
      <AdminTitle
        title="Orders"
        detail="Track customer orders, delivery destinations, and fulfillment status."
      />
      <OrdersTable orders={orders} />
    </div>
  )
}
