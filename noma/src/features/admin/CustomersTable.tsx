import { DataRow, DataTable } from '../../components/admin/DataTable'
import type { Customer } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

export function CustomersTable({ customers }: { customers: Customer[] }) {
  return (
    <DataTable>
      {customers.map((customer) => (
        <DataRow key={customer.id}>
          <strong>{customer.name}</strong>
          <span>{customer.phone}</span>
          <span>{customer.orders} orders</span>
          <em>{formatNaira(customer.lifetimeValue)}</em>
        </DataRow>
      ))}
    </DataTable>
  )
}
