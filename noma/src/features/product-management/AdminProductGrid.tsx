import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MagnifyingGlass,
  PencilSimple,
  Plus,
  ShoppingBag,
  Trash,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useProductStore } from '../../store/productStore'
import type { Product } from '../../types/commerce'
import { formatNaira, getMarkupAmount } from '../../utils/pricing'

export function AdminProductGrid({ products }: { products: Product[] }) {
  const { toggleStockStatus, deleteProduct, categories } = useProductStore()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      p.id.toLowerCase().includes(q)
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (product: Product) => {
    try {
      await deleteProduct(product.id)
      toast.success(`Removed "${product.name}" from catalog.`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete product.'
      toast.error(message)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Controls Bar */}
      <div className="flex flex-col gap-3 rounded-[8px] border border-[#E5E7EB] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3 sm:flex-nowrap">
          <div className="relative min-w-[200px] max-w-xs flex-1">
            <MagnifyingGlass
              size={16}
              weight="regular"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5E6675]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brand, or ID..."
              className="w-full rounded-[6px] border border-[#D1D5DB] bg-white py-2 pl-9 pr-3.5 text-xs text-[#0B1220] placeholder:text-[#5E6675]/70 transition-colors focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
            />
          </div>

          <select
            aria-label="Filter products by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-[6px] border border-[#D1D5DB] bg-white px-3 py-2 text-xs font-semibold text-[#0B1220] transition-colors focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
        >
          <Plus size={15} weight="regular" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Empty State or Cards Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag size={24} weight="regular" />}
          title="No Products in Catalog"
          detail="Create products manually or adjust your search and category filters."
          action={
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E293B]"
            >
              <Plus size={15} weight="regular" />
              <span>Add Product</span>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => {
            const markup = getMarkupAmount(p.finalPrice, p.basePrice)
            const inStock = p.stockQty > 0
            return (
              <article
                key={p.id}
                className="flex flex-col justify-between rounded-[8px] border border-[#E5E7EB] bg-white p-3.5 transition-colors hover:border-[#D1D5DB] sm:p-4"
              >
                <div>
                  <div className="relative mb-3 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] p-2">
                    <img
                      src={p.image || '/images/catalog-banner-all.png'}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain"
                    />
                    <span
                      className={`absolute left-2 top-2 rounded-[4px] border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                        inStock
                          ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]'
                          : 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'
                      }`}
                    >
                      {inStock ? `${p.stockQty} In Stock` : 'Out of Stock'}
                    </span>
                    {p.badge ? (
                      <span className="absolute right-2 top-2 hidden rounded-[4px] bg-[#0B1220] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-white sm:inline-block">
                        {p.badge}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[11px] font-medium uppercase tracking-wider text-[#5E6675]">
                      {p.category}
                    </span>
                    {p.brand ? (
                      <span className="truncate text-[11px] font-medium text-[#5E6675]">
                        {p.brand}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-1 line-clamp-2 text-xs font-bold leading-snug text-[#0B1220] sm:text-sm">
                    {p.name}
                  </h3>

                  <div className="mt-3 flex flex-col justify-between gap-1.5 border-t border-[#E5E7EB] pt-2.5 sm:flex-row sm:items-end">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#5E6675]">
                        Retail
                      </span>
                      <div className="flex flex-wrap items-baseline gap-1.5">
                        <span className="font-mono tabular-nums text-xs font-bold text-[#0B1220] sm:text-sm">
                          {formatNaira(p.finalPrice)}
                        </span>
                        {p.compareAtPrice && p.compareAtPrice > p.finalPrice ? (
                          <span className="font-mono tabular-nums text-[10px] text-[#5E6675] line-through">
                            {formatNaira(p.compareAtPrice)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#15803D]">
                        Markup
                      </span>
                      <span className="font-mono tabular-nums text-[11px] font-semibold text-[#15803D] sm:text-xs">
                        +{formatNaira(markup)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => toggleStockStatus(p.id)}
                    className={`rounded-[6px] border px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                      inStock
                        ? 'border-[#E5E7EB] bg-[#F6F7F9] text-[#374151] hover:bg-[#EEF0F4]'
                        : 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D] hover:bg-[#DCFCE7]'
                    }`}
                  >
                    {inStock ? 'Mark Out' : 'Restock'}
                  </button>
                  <Link
                    to={`/admin/products/${p.id}/edit`}
                    className="flex flex-1 items-center justify-center gap-1 rounded-[6px] bg-[#0B1220] py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#1E293B]"
                  >
                    <PencilSimple size={13} weight="regular" />
                    <span>Edit</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(p)}
                    aria-label={`Delete ${p.name}`}
                    className="flex items-center justify-center rounded-[6px] border border-[#FECACA] bg-[#FEF2F2] p-1.5 text-[#B91C1C] transition-colors hover:bg-[#FEE2E2]"
                  >
                    <Trash size={14} weight="regular" />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
