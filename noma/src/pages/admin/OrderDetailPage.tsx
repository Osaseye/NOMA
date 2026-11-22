import { Link, useParams } from 'react-router-dom'
import { ClipboardText } from '@phosphor-icons/react'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { EmptyState } from '../../design-system/components/EmptyState'
import { OrderDetailPanels } from '../../features/orders/OrderDetailPanels'
import { useProductStore } from '../../store/productStore'

export function OrderDetailPage() {
  const { orderId } = useParams()
  const { orders } = useProductStore()

  const order = orderId ? orders.find((item) => item.id === orderId) : orders[0]

  return (
    <div className="flex flex-col gap-6 pb-12">
      <AdminTitle
        title={`Fulfillment & Reconciliation: Order ${order?.id || orderId || ''}`}
        detail="Manage customer delivery status, supplier invoice reconciliation, and itemized markup breakdown."
      />
      {order ? (
        <OrderDetailPanels order={order} />
      ) : (
        <EmptyState
          icon={<ClipboardText size={24} weight="regular" />}
          title="Order not found"
          detail="This order ID does not exist in the current workspace records."
          action={
            <Link
              to="/admin/orders"
              className="inline-flex items-center rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E293B]"
            >
              Return to Orders
            </Link>
          }
        />
      )}
    </div>
  )
}
