import { useState } from 'react'
import {
  CheckCircle,
  Cube,
  Minus,
  Plus,
  Warning,
  XCircle,
} from '@phosphor-icons/react'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useProductStore } from '../../store/productStore'
import type { Product } from '../../types/commerce'

export function InventoryTable({ products }: { products: Product[] }) {
  const { updateStockQuantity } = useProductStore()
  const [filterHealth, setFilterHealth] = useState<'all' | 'low' | 'out' | 'healthy'>('all')

  const totalSKUs = products.length
  const lowStockProducts = products.filter((p) => p.stockQty > 0 && p.stockQty < 10)
  const outOfStockProducts = products.filter((p) => p.stockQty === 0)
  const healthyProducts = products.filter((p) => p.stockQty >= 10)

  const filtered = products.filter((p) => {
    if (filterHealth === 'low') return p.stockQty > 0 && p.stockQty < 10
    if (filterHealth === 'out') return p.stockQty === 0
    if (filterHealth === 'healthy') return p.stockQty >= 10
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Clickable Health Threshold Tiles */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => setFilterHealth('all')}
          className={`relative overflow-hidden rounded-[8px] border bg-white p-4 text-left transition-colors sm:p-5 ${
            filterHealth === 'all'
              ? 'border-[#1049EB] bg-[#EEF3FE]/40 ring-1 ring-[#1049EB]'
              : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
          }`}
        >
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-[#0B1220]" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
              Catalog SKUs
            </span>
            <Cube size={16} weight="regular" className="text-[#0B1220]" />
          </div>
          <div className="mt-2 font-mono tabular-nums text-2xl font-bold text-[#0B1220]">
            {totalSKUs}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilterHealth('healthy')}
          className={`relative overflow-hidden rounded-[8px] border bg-white p-4 text-left transition-colors sm:p-5 ${
            filterHealth === 'healthy'
              ? 'border-[#1049EB] bg-[#EEF3FE]/40 ring-1 ring-[#1049EB]'
              : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
          }`}
        >
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-[#15803D]" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
              Healthy (10+)
            </span>
            <CheckCircle size={16} weight="regular" className="text-[#15803D]" />
          </div>
          <div className="mt-2 font-mono tabular-nums text-2xl font-bold text-[#15803D]">
            {healthyProducts.length}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilterHealth('low')}
          className={`relative overflow-hidden rounded-[8px] border bg-white p-4 text-left transition-colors sm:p-5 ${
            filterHealth === 'low'
              ? 'border-[#1049EB] bg-[#EEF3FE]/40 ring-1 ring-[#1049EB]'
              : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
          }`}
        >
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-[#FEB719]" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
              Low Alert (&lt;10)
            </span>
            <Warning size={16} weight="regular" className="text-[#B45309]" />
          </div>
          <div className="mt-2 font-mono tabular-nums text-2xl font-bold text-[#B45309]">
            {lowStockProducts.length}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilterHealth('out')}
          className={`relative overflow-hidden rounded-[8px] border bg-white p-4 text-left transition-colors sm:p-5 ${
            filterHealth === 'out'
              ? 'border-[#1049EB] bg-[#EEF3FE]/40 ring-1 ring-[#1049EB]'
              : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
          }`}
        >
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-[#B91C1C]" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
              Out of Stock
            </span>
            <XCircle size={16} weight="regular" className="text-[#B91C1C]" />
          </div>
          <div className="mt-2 font-mono tabular-nums text-2xl font-bold text-[#B91C1C]">
            {outOfStockProducts.length}
          </div>
        </button>
      </div>

      {/* Stock Adjustment Cards Grid or Empty State */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Cube size={24} weight="regular" />}
          title="No Inventory SKUs Found"
          detail="Warehouse stock levels for the selected health threshold will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((p) => {
            const isOut = p.stockQty === 0
            const isLow = p.stockQty > 0 && p.stockQty < 10

            return (
              <article
                key={p.id}
                className="flex flex-col justify-between rounded-[8px] border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#D1D5DB]"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] p-1.5">
                    <img
                      src={p.image || '/images/catalog-banner-all.png'}
                      alt={p.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-[4px] border border-[#E5E7EB] bg-[#F6F7F9] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#374151]">
                        {p.category}
                      </span>
                      {isOut ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-[4px] border border-[#FECACA] bg-[#FEF2F2] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#B91C1C]">
                          <XCircle size={12} weight="regular" />
                          <span>Out of Stock</span>
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-[4px] border border-[#FDE68A] bg-[#FFFBEB] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#B45309]">
                          <Warning size={12} weight="regular" />
                          <span>Low Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#15803D]">
                          <CheckCircle size={12} weight="regular" />
                          <span>Healthy</span>
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1.5 line-clamp-2 text-xs font-bold leading-snug text-[#0B1220] sm:text-sm">
                      {p.name}
                    </h3>
                    <span className="mt-0.5 block font-mono text-[11px] text-[#5E6675]">
                      ID: {p.id}
                    </span>
                  </div>
                </div>

                {/* Stock Controls Row */}
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#E5E7EB] pt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                      Stock:
                    </span>
                    <input
                      type="number"
                      min={0}
                      aria-label={`Stock quantity for ${p.name}`}
                      value={p.stockQty}
                      onChange={(e) => updateStockQuantity(p.id, Math.max(0, Number(e.target.value) || 0))}
                      className="w-20 rounded-[6px] border border-[#D1D5DB] bg-white px-2.5 py-1 text-center font-mono tabular-nums text-xs font-bold text-[#0B1220] focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateStockQuantity(p.id, Math.max(0, p.stockQty - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#374151] transition-colors hover:bg-[#F6F7F9] hover:text-[#0B1220]"
                      title="Subtract 1"
                    >
                      <Minus size={14} weight="regular" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStockQuantity(p.id, p.stockQty + 5)}
                      className="inline-flex h-8 items-center gap-1 rounded-[6px] bg-[#0B1220] px-3 font-mono text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
                    >
                      <Plus size={13} weight="regular" />
                      <span>+5 Restock</span>
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
