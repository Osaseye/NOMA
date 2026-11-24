import { useState } from 'react'
import { MagnifyingGlass, Minus, Plus, Warehouse } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { EmptyState } from '../../design-system/components/EmptyState'
import { KpiCard } from '../../design-system/components/KpiCard'
import { useProductStore } from '../../store/productStore'
import type { Product } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

export function InventoryTable({ products }: { products: Product[] }) {
  const { updateStockQuantity, toggleStockStatus } = useProductStore()
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState<'all' | 'healthy' | 'low' | 'out'>('all')

  const totalSkus = products.length
  const totalUnits = products.reduce((acc, p) => acc + (p.stockQty ?? 0), 0)
  const lowStockCount = products.filter(
    (p) => (p.stockQty ?? 0) > 0 && (p.stockQty ?? 0) <= 5
  ).length
  const outOfStockCount = products.filter((p) => (p.stockQty ?? 0) === 0).length

  const filtered = products.filter((p) => {
    const qty = p.stockQty ?? 0
    if (stockFilter === 'healthy' && qty <= 5) return false
    if (stockFilter === 'low' && (qty === 0 || qty > 5)) return false
    if (stockFilter === 'out' && qty > 0) return false

    if (search) {
      const q = search.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Open Monochrome Metrics Row — Zero Colored Stripes */}
      <div className="grid grid-cols-2 border-b border-slate-200 pb-4 sm:grid-cols-4">
        <KpiCard label="Total SKUs" value={`${totalSkus}`} subtitle="Active catalog items" />
        <KpiCard label="Total Units" value={`${totalUnits}`} subtitle="Combined stock count" />
        <KpiCard label="Low Stock" value={`${lowStockCount}`} subtitle="5 or fewer units" />
        <KpiCard label="Out of Stock" value={`${outOfStockCount}`} subtitle="0 units available" />
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center">
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
          {(
            [
              { id: 'all', label: 'All', count: totalSkus },
              {
                id: 'healthy',
                label: 'In Stock',
                count: totalSkus - lowStockCount - outOfStockCount,
              },
              { id: 'low', label: 'Low Stock', count: lowStockCount },
              { id: 'out', label: 'Out of Stock', count: outOfStockCount },
            ] as const
          ).map((tab) => {
            const active = stockFilter === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStockFilter(tab.id)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-500 hover:bg-[#F4F4F5] hover:text-slate-950'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            )
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <MagnifyingGlass
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter inventory by name or category..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-950 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none"
          />
        </div>
      </div>

      {/* Compact Single-Surface Inventory Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Warehouse size={22} weight="regular" />}
          title="No matching inventory items"
          detail="Try clearing your search or selecting another stock filter."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-2.5 pr-4">Item</th>
                <th className="hidden py-2.5 px-3 sm:table-cell">Category</th>
                <th className="hidden py-2.5 px-3 text-right md:table-cell">Retail Price</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Quantity</th>
                <th className="py-2.5 pl-3 text-right">Quick Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((p) => {
                const stockQty = p.stockQty ?? 0
                const statusText =
                  stockQty === 0 ? 'Out of stock' : stockQty <= 5 ? 'Low stock' : 'In stock'

                return (
                  <tr key={p.id} className="transition-colors hover:bg-[#F4F4F5]/50">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 shrink-0 rounded-lg bg-[#F4F4F5] object-contain p-1"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="line-clamp-1 font-bold text-slate-950 hover:underline"
                          >
                            {p.name}
                          </Link>
                          <span className="text-[11px] text-slate-400">{p.brand}</span>
                        </div>
                      </div>
                    </td>

                    <td className="hidden py-3 px-3 capitalize text-slate-600 sm:table-cell">
                      {p.category}
                    </td>

                    <td className="hidden py-3 px-3 text-right font-semibold tabular-nums text-slate-900 md:table-cell">
                      {formatNaira(p.finalPrice)}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[11px] font-semibold ${
                          stockQty === 0
                            ? 'text-slate-400'
                            : stockQty <= 5
                            ? 'text-slate-700 underline decoration-slate-400 underline-offset-4'
                            : 'text-slate-900'
                        }`}
                      >
                        {statusText}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="mx-auto flex w-fit items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateStockQuantity(p.id, Math.max(0, stockQty - 1))}
                          aria-label={`Decrease stock for ${p.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:border-slate-950"
                        >
                          <Minus size={12} />
                        </button>
                        <input
                          type="number"
                          aria-label={`Stock quantity for ${p.name}`}
                          min={0}
                          value={stockQty}
                          onChange={(e) =>
                            updateStockQuantity(p.id, Math.max(0, Number(e.target.value)))
                          }
                          className="h-7 w-14 rounded-md border border-slate-200 bg-white text-center text-xs font-bold tabular-nums text-slate-950 focus:border-slate-950 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateStockQuantity(p.id, stockQty + 1)}
                          aria-label={`Increase stock for ${p.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:border-slate-950"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </td>

                    <td className="py-3 pl-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          toggleStockStatus(p.id)
                          toast.info(
                            stockQty > 0
                              ? `"${p.name}" marked out of stock`
                              : `"${p.name}" restocked to 10 units`
                          )
                        }}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950"
                      >
                        {stockQty > 0 ? 'Set 0' : 'Restock +10'}
                      </button>
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
