import { Link } from 'react-router-dom'
import { HiExclamationTriangle, HiArrowRight, HiCheckCircle } from 'react-icons/hi2'
import type { Product } from '../../types/commerce'

export function NeedsAttention({ products }: { products: Product[] }) {
  const lowStock = products.filter((product) => product.stockQty < 10)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h2 className="font-['Outfit'] text-base font-black text-slate-900 flex items-center gap-2">
            <HiExclamationTriangle className="text-amber-500" size={18} /> Stock Needs Attention
          </h2>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black text-amber-800 uppercase">
            {lowStock.length} Low SKUs
          </span>
        </div>

        {lowStock.length === 0 ? (
          <div className="py-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <HiCheckCircle size={28} className="text-emerald-500" />
            <span className="text-xs font-bold text-slate-800">All Stock Levels Healthy</span>
            <span className="text-[11px] text-slate-400">No SKUs currently requiring restock attention.</span>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {lowStock.slice(0, 5).map((product) => (
              <div key={product.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-contain bg-slate-50 border p-1" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{product.name}</span>
                    <span className="text-[10px] text-amber-600 font-extrabold">{product.stockQty} units remaining</span>
                  </div>
                </div>
                <Link
                  to={`/admin/products/${product.id}/edit`}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
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
        className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
      >
        View Full Inventory Control <HiArrowRight size={14} />
      </Link>
    </div>
  )
}
