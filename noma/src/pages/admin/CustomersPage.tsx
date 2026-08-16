import { AdminTitle } from '../../components/admin/AdminTitle'
import { CustomersTable } from '../../features/admin/CustomersTable'
import { useProductStore } from '../../store/productStore'

export function CustomersPage() {
  const { customers } = useProductStore()

  return (
    <div className="flex flex-col gap-6 pb-12">
      <AdminTitle
        title="Customer CRM & Accounts Directory"
        detail="Segmented customer directory separating signed-up registered Noma accounts from one-time guest checkout orders."
      />
      <CustomersTable customers={customers} />
    </div>
  )
}
