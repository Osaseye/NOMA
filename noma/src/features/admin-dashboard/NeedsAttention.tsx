import { ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import type { Order, Product } from '../../types/commerce'

export function NeedsAttention({
  products,
  orders = [],
}: {
  products: Product[]
  orders?: Order[]
}) {
  const lowStock = products.filter((p) => (p.stockQty ?? 0) <= 5)
  const pendingOrders = orders.filter(
    (o) => o.status === 'placed' || o.status === 'processing'
  )

  return (
    <div className="flex flex-col gap-8">
      {/* Action summary */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-950">Pending Dispatch</h2>
          <span className="text-xs font-bold tabular-nums text-slate-500">
            {pendingOrders.length}
          </span>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {pendingOrders.length === 0 ? (
            <p className="py-6 text-xs text-slate-400">All orders dispatched.</p>
          ) : (
            pendingOrders.slice(0, 4).map((o) => (
              <Link
                key={o.id}
                to={`/admin/orders/${o.id}`}
                className="flex items-center justify-between gap-2 py-2.5 text-xs hover:text-slate-600"
              >
                <div className="min-w-0">
                  <span className="font-bold text-slate-950">#{o.id}</span>
                  <span className="ml-2 truncate text-slate-500">{o.customer}</span>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-slate-500">
                  {o.status}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Low Stock Watchlist */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-950">Inventory Watchlist</h2>
            <p className="text-xs text-slate-500">Items with 5 or fewer units</p>
          </div>
          <Link
            to="/admin/inventory"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-950"
          >
            <span>Restock</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {lowStock.length === 0 ? (
            <p className="py-6 text-xs text-slate-400">
              All products have healthy stock levels.
            </p>
          ) : (
            lowStock.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 py-2.5 text-xs"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-8 w-8 shrink-0 rounded-md bg-[#F4F4F5] object-contain p-0.5"
                  />
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-950">{item.name}</div>
                    <div className="text-[11px] capitalize text-slate-400">{item.category}</div>
                  </div>
                </div>
                <span className="shrink-0 font-bold tabular-nums text-slate-950">
                  {item.stockQty ?? 0} left
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
