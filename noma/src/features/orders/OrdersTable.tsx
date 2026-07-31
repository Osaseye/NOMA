import { Link } from 'react-router-dom'
import { DataRow, DataTable } from '../../components/admin/DataTable'
import type { Order } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

export function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <DataTable>
      {orders.map((order) => (
        <DataRow key={order.id}>
          <Link to={`/admin/orders/${order.id}`}>{order.id}</Link>
          <span>{order.customer}</span>
          <span>{order.deliveryArea}</span>
          <b>{order.status}</b>
          <em>{formatNaira(order.total)}</em>
        </DataRow>
      ))}
    </DataTable>
  )
}
