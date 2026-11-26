import { useState } from 'react'
import { ArrowUpRight, MagnifyingGlass, ShoppingBag, Trash, WhatsappLogo } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { brand } from '../../constants/brand'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useProductStore } from '../../store/productStore'
import type { Order, OrderStatus } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

const allStatuses: OrderStatus[] = [
  'placed',
  'processing',
  'packed',
  'dispatched',
  'delivered',
  'cancelled',
]

const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function OrdersTable({ orders }: { orders: Order[] }) {
  const { updateOrderStatus, deleteOrder } = useProductStore()
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.customer.toLowerCase().includes(q) ||
      (order.phone && order.phone.includes(searchQuery)) ||
      (order.state && order.state.toLowerCase().includes(q))
    return matchesStatus && matchesSearch
  })

  const whatsappBaseDigits = brand.whatsappNumber.replace(/\D/g, '')

  return (
    <div className="flex flex-col gap-4">
      {/* Compact Toolbar: Filter Pills + Search */}
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 lg:flex-row lg:items-center">
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
          {['All', ...allStatuses].map((status) => {
            const isActive = statusFilter === status
            const count =
              status === 'All'
                ? orders.length
                : orders.filter((o) => o.status === status).length
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-500 hover:bg-[#F4F4F5] hover:text-slate-950'
                }`}
              >
                {statusLabel(status)} ({count})
              </button>
            )
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <MagnifyingGlass
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID, customer, phone..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-950 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none"
          />
        </div>
      </div>

      {/* Single-Layer Compact Orders Table */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag size={22} weight="regular" />}
          title="No orders found"
          detail={
            orders.length === 0
              ? 'Customer orders placed at checkout will appear here.'
              : 'No orders match your current filter.'
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-2.5 pr-4">Order</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="hidden py-2.5 px-3 md:table-cell">Destination</th>
                <th className="py-2.5 px-3 text-right">Total</th>
                <th className="hidden py-2.5 px-3 text-right sm:table-cell">Margin</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.map((order) => {
                const customerPhoneDigits = order.phone?.replace(/\D/g, '')
                const waTarget =
                  customerPhoneDigits && customerPhoneDigits.length >= 10
                    ? customerPhoneDigits.startsWith('0')
                      ? `234${customerPhoneDigits.slice(1)}`
                      : customerPhoneDigits
                    : whatsappBaseDigits

                return (
                  <tr
                    key={order.id}
                    className="group transition-colors hover:bg-[#F4F4F5]/50"
                  >
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="font-bold text-slate-950 hover:underline"
                      >
                        #{order.id}
                      </Link>
                      <div className="text-[11px] text-slate-400">
                        {order.items?.length || 1} {order.items?.length === 1 ? 'item' : 'items'}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-950">{order.customer}</div>
                      <div className="text-[11px] text-slate-500">
                        {order.phone || 'No phone'}
                      </div>
                    </td>

                    <td className="hidden py-3 px-3 md:table-cell">
                      <div className="font-medium text-slate-800">
                        {order.state || 'Lagos'}
                      </div>
                      <div className="max-w-[200px] truncate text-[11px] text-slate-400">
                        {order.address || 'Standard delivery'}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-bold tabular-nums text-slate-950 whitespace-nowrap">
                      {formatNaira(order.total)}
                    </td>

                    <td className="hidden py-3 px-3 text-right font-semibold tabular-nums text-slate-600 whitespace-nowrap sm:table-cell">
                      {formatNaira(order.markupEarned)}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <select
                        aria-label={`Status for order ${order.id}`}
                        value={order.status}
                        onChange={(e) => {
                          const next = e.target.value as OrderStatus
                          updateOrderStatus(order.id, next)
                          toast.success(`Order #${order.id} marked as ${statusLabel(next)}`)
                        }}
                        className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-900 focus:border-slate-950 focus:outline-none"
                      >
                        {allStatuses.map((st) => (
                          <option key={st} value={st}>
                            {statusLabel(st)}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 pl-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={`https://wa.me/${waTarget}?text=${encodeURIComponent(
                            `Hello ${order.customer}, regarding your Noma Order #${order.id} (${formatNaira(order.total)})...`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp Customer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:border-slate-950 hover:text-slate-950"
                        >
                          <WhatsappLogo size={15} weight="regular" />
                        </a>
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="inline-flex h-8 items-center gap-1 rounded-md bg-slate-950 px-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-slate-800"
                        >
                          <span>View</span>
                          <ArrowUpRight size={12} />
                        </Link>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!window.confirm(`Permanently delete order #${order.id}?`)) return
                            try {
                              await deleteOrder(order.id)
                              toast.success(`Deleted order #${order.id}`)
                            } catch {
                              toast.error('Failed to delete order.')
                            }
                          }}
                          title="Delete Order"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash size={14} weight="regular" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
