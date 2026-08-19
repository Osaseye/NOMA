import { useState } from 'react'
import { HiExclamationTriangle, HiCheckCircle, HiXCircle, HiMinus, HiPlus, HiCube } from 'react-icons/hi2'
import type { Product } from '../../types/commerce'
import { useProductStore } from '../../store/productStore'

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
      {/* Metric Cards Summary - 2 Column Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => setFilterHealth('all')}
          className={`rounded-2xl border p-3.5 sm:p-5 text-left transition-all ${
            filterHealth === 'all'
              ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider opacity-70">Catalog SKUs</span>
          <div className="mt-2 font-['Outfit'] font-black text-xl sm:text-3xl">{totalSKUs}</div>
        </button>

        <button
          onClick={() => setFilterHealth('healthy')}
          className={`rounded-2xl border p-3.5 sm:p-5 text-left transition-all ${
            filterHealth === 'healthy'
              ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider opacity-70">Healthy (10+)</span>
          <div className="mt-2 font-['Outfit'] font-black text-xl sm:text-3xl text-emerald-600 group-hover:text-white flex items-center justify-between">
            <span>{healthyProducts.length}</span>
            <HiCheckCircle size={20} className="hidden sm:block" />
          </div>
        </button>

        <button
          onClick={() => setFilterHealth('low')}
          className={`rounded-2xl border p-3.5 sm:p-5 text-left transition-all ${
            filterHealth === 'low'
              ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider opacity-70">Low Alert (&lt;10)</span>
          <div className="mt-2 font-['Outfit'] font-black text-xl sm:text-3xl text-amber-600 flex items-center justify-between">
            <span>{lowStockProducts.length}</span>
            <HiExclamationTriangle size={20} className="hidden sm:block" />
          </div>
        </button>

        <button
          onClick={() => setFilterHealth('out')}
          className={`rounded-2xl border p-3.5 sm:p-5 text-left transition-all ${
            filterHealth === 'out'
              ? 'border-rose-600 bg-rose-600 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider opacity-70">Out of Stock</span>
          <div className="mt-2 font-['Outfit'] font-black text-xl sm:text-3xl text-rose-600 flex items-center justify-between">
            <span>{outOfStockProducts.length}</span>
            <HiXCircle size={20} className="hidden sm:block" />
          </div>
        </button>
      </div>

      {/* Stock Adjustment Cards Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center gap-2 shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-1">
            <HiCube size={28} />
          </div>
          <span className="font-bold text-sm text-slate-900">No Inventory SKUs Tracked</span>
          <span className="text-xs text-slate-400 max-w-sm">
            Warehouse stock inventory is scrubbed clean for backend API integration. Product additions will monitor stock health here.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p) => {
            const isOut = p.stockQty === 0
            const isLow = p.stockQty > 0 && p.stockQty < 10

            return (
              <div
                key={p.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start gap-3.5">
                  <div className="h-16 w-16 shrink-0 rounded-xl bg-slate-50 border border-slate-100 p-1.5 flex items-center justify-center overflow-hidden">
                    <img src={p.image} alt={p.name} className="h-full w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold uppercase text-slate-700">
                        {p.category}
                      </span>
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-black uppercase text-rose-800 shrink-0">
                          <HiXCircle size={12} /> Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-black uppercase text-amber-800 shrink-0">
                          <HiExclamationTriangle size={12} /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-800 shrink-0">
                          <HiCheckCircle size={12} /> Healthy
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-xs text-slate-900 mt-1 line-clamp-2 leading-snug">
                      {p.name}
                    </h3>
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">ID: {p.id}</span>
                  </div>
                </div>

                {/* Stock Controls Row */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Stock:</span>
                    <input
                      type="number"
                      value={p.stockQty}
                      onChange={(e) => updateStockQuantity(p.id, Number(e.target.value))}
                      className="w-16 rounded-xl border border-slate-300 py-1 px-2 font-black text-slate-900 outline-none focus:border-emerald-500 text-center text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateStockQuantity(p.id, p.stockQty - 1)}
                      className="rounded-xl border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
                      title="Subtract 1"
                    >
                      <HiMinus size={13} />
                    </button>
                    <button
                      onClick={() => updateStockQuantity(p.id, p.stockQty + 5)}
                      className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-95 transition-all"
                    >
                      <HiPlus size={13} /> +5 Restock
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
