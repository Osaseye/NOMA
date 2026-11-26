import { useMemo } from 'react'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { CustomersTable } from '../../features/admin/CustomersTable'
import { useProductStore } from '../../store/productStore'
import type { Customer } from '../../types/commerce'

export function CustomersPage() {
  const { customers, orders } = useProductStore()

  const mergedCustomers = useMemo<Customer[]>(() => {
    const map = new Map<string, Customer>()

    for (const c of customers) {
      map.set(c.id, c)
    }

    if (customers.length === 0 && orders.length > 0) {
      for (const order of orders) {
        if (order.status === 'cancelled') continue
        const key = order.userId || order.phone || order.email || order.customer
        const existing = map.get(key)
        if (existing) {
          existing.orders += 1
          existing.lifetimeValue += Number(order.total) || 0
          if (!existing.email && order.email) {
            existing.email = order.email
          }
        } else {
          map.set(key, {
            id: key,
            name: order.customer || 'Shopper',
            phone: order.phone || 'Not provided',
            email: order.email,
            lifetimeValue: Number(order.total) || 0,
            orders: 1,
            isGuest: !order.userId,
          })
        }
      }
    }

    return Array.from(map.values())
  }, [customers, orders])

  return (
    <div className="flex flex-col gap-5 pb-12">
      <AdminTitle
        title="Users"
        detail="Registered accounts and guest checkout profiles."
      />
      <CustomersTable customers={mergedCustomers} />
    </div>
  )
}
