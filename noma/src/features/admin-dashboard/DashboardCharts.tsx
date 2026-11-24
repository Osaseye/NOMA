import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { RevenueAreaChart } from '../../components/admin/RevenueChart'
import type { Order } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

export function DashboardCharts({ orders }: { orders: Order[] }) {
  const recentOrders = orders.slice(0, 6)

  return (
    <div className="flex flex-col gap-8">
      {/* Revenue Trajectory — Open Minimal Section */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-950">Revenue Trajectory</h2>
            <p className="text-xs text-slate-500">Order volume over time (NGN)</p>
          </div>
          <Link
            to="/admin/revenue"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-950"
          >
            <span>Analytics</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        <RevenueAreaChart orders={orders} />
      </section>

      {/* Recent Orders Compact Table */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-950">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-950"
          >
            <span>View all</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="border-y border-slate-200 py-8 text-center text-xs text-slate-400">
            No orders placed yet.
          </p>
        ) : (
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/admin/orders/${order.id}`}
                className="flex items-center justify-between gap-4 py-3 text-xs transition-colors hover:bg-[#F4F4F5]/60 px-2 -mx-2 rounded-lg"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="font-bold text-slate-950">#{order.id}</span>
                  <span className="truncate font-medium text-slate-700">{order.customer}</span>
                  <span className="hidden text-slate-400 sm:inline">
                    {order.state || 'Lagos'}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <span className="text-[11px] font-medium text-slate-500">{order.status}</span>
                  <strong className="min-w-[80px] text-right font-bold tabular-nums text-slate-950">
                    {formatNaira(order.total)}
                  </strong>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
