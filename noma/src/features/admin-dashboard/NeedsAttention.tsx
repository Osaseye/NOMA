import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Warning } from '@phosphor-icons/react'
import type { Product } from '../../types/commerce'

export function NeedsAttention({ products }: { products: Product[] }) {
  const lowStock = [...products]
    .filter((product) => product.stockQty < 10)
    .sort((a, b) => a.stockQty - b.stockQty)

  return (
    <section className="flex flex-col justify-between rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
      <div>
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
          <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-[#0B1220]">
            <Warning size={18} weight="regular" className="text-[#B45309]" />
            <span>Stock Needs Attention</span>
          </h2>
          <span className="rounded-[4px] border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-0.5 font-mono tabular-nums text-[11px] font-semibold text-[#B45309]">
            {lowStock.length} Low SKUs
          </span>
        </div>

        {lowStock.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]">
              <CheckCircle size={20} weight="regular" />
            </div>
            <span className="text-xs font-bold text-[#0B1220]">All Stock Levels Healthy</span>
            <span className="text-[11px] text-[#5E6675]">
              No SKUs currently require restock attention.
            </span>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#E5E7EB]">
            {lowStock.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-10 w-10 shrink-0 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] object-contain p-1"
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="line-clamp-1 text-xs font-semibold text-[#0B1220]">
                      {product.name}
                    </span>
                    <span
                      className={`font-mono tabular-nums text-[11px] font-medium ${
                        product.stockQty === 0 ? 'text-[#B91C1C]' : 'text-[#B45309]'
                      }`}
                    >
                      {product.stockQty} units remaining
                    </span>
                  </div>
                </div>
                <Link
                  to={`/admin/products/${product.id}/edit`}
                  className="shrink-0 rounded-[6px] border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#0B1220] transition-colors hover:bg-[#F6F7F9]"
                >
                  Restock
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link
        to="/admin/inventory"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] py-2.5 text-xs font-semibold text-[#0B1220] transition-colors hover:bg-[#EEF0F4]"
      >
        <span>View Full Inventory Control</span>
        <ArrowRight size={14} weight="regular" />
      </Link>
    </section>
  )
}
