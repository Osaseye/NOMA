import { DataRow, DataTable } from '../../components/admin/DataTable'
import type { Order } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

export function SupplierLedgerTable({ orders }: { orders: Order[] }) {
  return (
    <DataTable>
      {orders.map((order) => (
        <DataRow key={order.id}>
          <strong>{order.id}</strong>
          <span>{order.customer}</span>
          <span>{order.status}</span>
          <em>{formatNaira(order.baseAmountOwed)} owed</em>
        </DataRow>
      ))}
    </DataTable>
  )
}
