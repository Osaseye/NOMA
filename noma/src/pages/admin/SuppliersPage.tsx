import { AdminTitle } from '../../components/admin/AdminTitle'
import { SupplierLedgerTable } from '../../features/admin-reports/SupplierLedgerTable'
import { useProductStore } from '../../store/productStore'

export function SuppliersPage() {
  const { orders } = useProductStore()

  return (
    <div className="flex flex-col gap-6 pb-12">
      <AdminTitle
        title="Supplier Invoice Ledger & Reconciliation"
        detail="Track base cost obligations owed to off-platform suppliers from customer order checkouts."
      />
      <SupplierLedgerTable orders={orders} />
    </div>
  )
}
