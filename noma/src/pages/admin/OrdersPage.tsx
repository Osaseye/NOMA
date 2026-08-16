import { AdminTitle } from '../../components/admin/AdminTitle'
import { OrdersTable } from '../../features/orders/OrdersTable'
import { useProductStore } from '../../store/productStore'

export function OrdersPage() {
  const { orders } = useProductStore()

  return (
    <div className="flex flex-col gap-6 pb-12">
      <AdminTitle
        title="Orders & Shipping Logistics"
        detail="Track real-time order status, customer delivery locations, payment references, and net markup revenue."
      />
      <OrdersTable orders={orders} />
    </div>
  )
}
