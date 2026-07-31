import { AdminTitle } from '../../components/admin/AdminTitle'
import { CustomersTable } from '../../features/admin/CustomersTable'
import { customers } from '../../mock/commerce'

export function CustomersPage() {
  return (
    <>
      <AdminTitle title="Customers" detail="Repeat buyers, phone-first contact, and lifetime value for follow-up." />
      <CustomersTable customers={customers} />
    </>
  )
}
