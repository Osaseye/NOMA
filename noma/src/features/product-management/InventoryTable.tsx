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
      {/* Metric Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setFilterHealth('all')}
          className={`rounded-2xl border p-5 text-left transition-all ${
            filterHealth === 'all'
              ? 'border-slate-900 bg-slate-900 text-white shadow-md'
              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider opacity-70">Total Catalog SKUs</span>
          <div className="mt-2 font-['Outfit'] font-black text-3xl">{totalSKUs}</div>
        </button>

        <button
          onClick={() => setFilterHealth('healthy')}
          className={`rounded-2xl border p-5 text-left transition-all ${
            filterHealth === 'healthy'
              ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider opacity-70">Healthy Stock (10+)</span>
          <div className="mt-2 font-['Outfit'] font-black text-3xl text-emerald-600 group-hover:text-white flex items-center justify-between">
            <span>{healthyProducts.length}</span>
            <HiCheckCircle size={24} />
          </div>
        </button>

        <button
          onClick={() => setFilterHealth('low')}
          className={`rounded-2xl border p-5 text-left transition-all ${
            filterHealth === 'low'
              ? 'border-amber-500 bg-amber-500 text-white shadow-md'
              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider opacity-70">Low Stock Alert (&lt;10)</span>
          <div className="mt-2 font-['Outfit'] font-black text-3xl text-amber-600 flex items-center justify-between">
            <span>{lowStockProducts.length}</span>
            <HiExclamationTriangle size={24} />
          </div>
        </button>

        <button
          onClick={() => setFilterHealth('out')}
          className={`rounded-2xl border p-5 text-left transition-all ${
            filterHealth === 'out'
              ? 'border-rose-600 bg-rose-600 text-white shadow-md'
              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider opacity-70">Out of Stock</span>
          <div className="mt-2 font-['Outfit'] font-black text-3xl text-rose-600 flex items-center justify-between">
            <span>{outOfStockProducts.length}</span>
            <HiXCircle size={24} />
          </div>
        </button>
      </div>

      {/* Stock Adjustment Table or Empty State */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-1">
              <HiCube size={28} />
            </div>
            <span className="font-bold text-sm text-slate-900">No Inventory SKUs Tracked</span>
            <span className="text-xs text-slate-400 max-w-sm">
              Warehouse stock inventory is scrubbed clean for backend API integration. Product additions will monitor stock health here.
            </span>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-extrabold uppercase text-slate-500 text-[10px] tracking-wider">
                <th className="p-4">Product SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Stock Health</th>
                <th className="p-4">Available Quantity</th>
                <th className="p-4 text-right">Quick Restock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((p) => {
                const isOut = p.stockQty === 0
                const isLow = p.stockQty > 0 && p.stockQty < 10

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-contain bg-slate-50 border p-1" />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{p.name}</span>
                          <span className="text-[10px] text-slate-400">ID: {p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold uppercase text-slate-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-black uppercase text-rose-800">
                          <HiXCircle size={13} /> Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase text-amber-800">
                          <HiExclamationTriangle size={13} /> Low Stock Alert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-800">
                          <HiCheckCircle size={13} /> Healthy Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={p.stockQty}
                        onChange={(e) => updateStockQuantity(p.id, Number(e.target.value))}
                        className="w-20 rounded-xl border border-slate-300 p-2 font-black text-slate-900 outline-none focus:border-emerald-500 text-center"
                      />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => updateStockQuantity(p.id, p.stockQty - 1)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                          title="Subtract 1"
                        >
                          <HiMinus size={14} />
                        </button>
                        <button
                          onClick={() => updateStockQuantity(p.id, p.stockQty + 5)}
                          className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                        >
                          <HiPlus size={14} /> Restock +5
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
