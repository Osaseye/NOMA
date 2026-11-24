import { useState } from 'react'
import { MagnifyingGlass, Package, PencilSimple, Plus, Trash } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useProductStore } from '../../store/productStore'
import type { Product } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

export function AdminProductGrid({ products }: { products: Product[] }) {
  const { deleteProduct, categories } = useProductStore()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filtered = products.filter((p) => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    return matchesCat && matchesSearch
  })

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Package size={24} weight="regular" />}
        title="No products in catalog"
        detail="Add your first product or use the Gemini AI Product Studio to generate clean studio photos and descriptions."
        action={
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={14} weight="bold" />
            <span>Add First Product</span>
          </Link>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Compact Search & Category Filter */}
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, brand, or category..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-950 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 focus:border-slate-950 focus:outline-none"
        >
          <option value="all">All Categories ({products.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Compact Single-Surface Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-2.5 pr-4">Product</th>
              <th className="hidden py-2.5 px-3 sm:table-cell">Category</th>
              <th className="hidden py-2.5 px-3 text-right md:table-cell">Base Cost</th>
              <th className="py-2.5 px-3 text-right">Retail Price</th>
              <th className="py-2.5 px-3 text-right">Stock</th>
              <th className="py-2.5 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((p) => {
              const stockQty = p.stockQty ?? 0
              return (
                <tr key={p.id} className="group transition-colors hover:bg-[#F4F4F5]/50">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-11 w-11 shrink-0 rounded-lg bg-[#F4F4F5] object-contain p-1"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/admin/products/${p.id}/edit`}
                          className="line-clamp-1 font-bold text-slate-950 hover:underline"
                        >
                          {p.name}
                        </Link>
                        <span className="text-[11px] text-slate-500">
                          {p.brand}
                          {p.supplierName ? ` • ${p.supplierName}` : ''}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="hidden py-3 px-3 capitalize text-slate-600 sm:table-cell">
                    {p.category}
                  </td>

                  <td className="hidden py-3 px-3 text-right font-medium tabular-nums text-slate-500 md:table-cell">
                    {formatNaira(p.basePrice)}
                  </td>

                  <td className="py-3 px-3 text-right font-bold tabular-nums text-slate-950">
                    {formatNaira(p.finalPrice)}
                  </td>

                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <span
                      className={`font-bold tabular-nums ${
                        stockQty === 0 ? 'text-slate-400 line-through' : 'text-slate-950'
                      }`}
                    >
                      {stockQty}
                    </span>
                  </td>

                  <td className="py-3 pl-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-900 transition-colors hover:border-slate-950"
                      >
                        <PencilSimple size={13} />
                        <span>Edit</span>
                      </Link>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await deleteProduct(p.id)
                            toast.success(`"${p.name}" removed`)
                          } catch {
                            toast.error('Failed to remove product.')
                          }
                        }}
                        aria-label={`Delete ${p.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition-colors hover:border-slate-950 hover:text-slate-950"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
