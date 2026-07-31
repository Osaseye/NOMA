import { AdminTitle } from '../../components/admin/AdminTitle'
import { SupplierLedgerTable } from '../../features/admin-reports/SupplierLedgerTable'
import { orders } from '../../mock/commerce'

export function SuppliersPage() {
  return (
    <>
      <AdminTitle title="Supplier tracking" detail="Off-platform supplier reconciliation from order-level base amounts." />
      <SupplierLedgerTable orders={orders} />
    </>
  )
}
