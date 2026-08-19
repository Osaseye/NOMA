import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiPencilSquare, HiTrash, HiMagnifyingGlass, HiPlus, HiSparkles, HiShoppingBag } from 'react-icons/hi2'
import type { Product } from '../../types/commerce'
import { formatNaira, getMarkupAmount } from '../../utils/pricing'
import { useProductStore } from '../../store/productStore'

export function AdminProductGrid({ products }: { products: Product[] }) {
  const { toggleStockStatus, deleteProduct, categories } = useProductStore()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase())) ||
      p.id.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-1 flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <HiMagnifyingGlass size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brand..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/new"
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700 transition-all"
          >
            <HiPlus size={16} /> Add Product Card
          </Link>
        </div>
      </div>

      {/* Empty State Check */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-1">
            <HiShoppingBag size={28} />
          </div>
          <span className="font-bold text-sm text-slate-900">No Products in Catalog</span>
          <span className="text-xs text-slate-400 max-w-sm">
            Product catalog is scrubbed clean for backend API integration. Create products manually or sync from your backend database.
          </span>
          <Link
            to="/admin/products/new"
            className="mt-2 flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700"
          >
            <HiPlus size={16} /> Add Product Card
          </Link>
        </div>
      ) : (
        /* 2-COLUMN ON MOBILE / RESPONSIVE CARDS VIEW */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filtered.map((p) => {
            const markup = getMarkupAmount(p.finalPrice, p.basePrice)
            const inStock = p.stockQty > 0
            return (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="relative mb-2 sm:mb-3 h-32 sm:h-44 w-full rounded-xl bg-slate-50 border p-1.5 sm:p-2 flex items-center justify-center overflow-hidden">
                  <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                  <span
                    className={`absolute top-1.5 left-1.5 rounded-full px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase shadow-xs ${
                      inStock ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {inStock ? `${p.stockQty} In Stock` : 'Out of Stock'}
                  </span>
                  {p.badge && (
                    <span className="absolute top-1.5 right-1.5 rounded-full bg-slate-900 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black uppercase text-white shadow-xs hidden sm:inline-block">
                      {p.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-400 truncate">{p.category}</span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 truncate">{p.brand}</span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">{p.name}</h3>

                  <div className="mt-1.5 sm:mt-2 flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 pt-1.5 sm:pt-2 text-xs gap-1">
                    <div className="flex flex-col">
                      <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase">Price</span>
                      <span className="font-black text-slate-900 text-xs sm:text-sm">{formatNaira(p.finalPrice)}</span>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <span className="text-[8px] sm:text-[9px] font-bold text-emerald-600 uppercase">Margin</span>
                      <span className="font-bold text-emerald-600 text-[11px] sm:text-xs flex items-center gap-0.5">
                        <HiSparkles size={10} /> +{formatNaira(markup)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => toggleStockStatus(p.id)}
                    className={`rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-extrabold ${
                      inStock ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {inStock ? 'In Stock' : 'Restock'}
                  </button>
                  <Link
                    to={`/admin/products/${p.id}/edit`}
                    className="flex-1 rounded-xl bg-slate-900 py-1.5 sm:py-2 text-center text-[10px] sm:text-xs font-bold text-white hover:bg-slate-800 flex items-center justify-center gap-1"
                  >
                    <HiPencilSquare size={13} /> Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="rounded-xl border border-rose-200 p-1.5 sm:p-2 text-rose-600 hover:bg-rose-50"
                  >
                    <HiTrash size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
