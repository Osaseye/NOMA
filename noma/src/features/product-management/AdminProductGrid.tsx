import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiPencilSquare, HiTrash, HiMagnifyingGlass, HiPlus, HiSquares2X2, HiListBullet, HiSparkles, HiShoppingBag } from 'react-icons/hi2'
import type { Product } from '../../types/commerce'
import { formatNaira, getMarkupAmount } from '../../utils/pricing'
import { useProductStore } from '../../store/productStore'

export function AdminProductGrid({ products }: { products: Product[] }) {
  const { toggleStockStatus, deleteProduct } = useProductStore()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <HiMagnifyingGlass size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product title, brand..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="appliances">Home Appliances</option>
            <option value="cooking">Cooking Materials</option>
            <option value="phones">Phones & Tablets</option>
            <option value="bicycles">Bicycles</option>
            <option value="wines">Wines & Spirits</option>
            <option value="general">General Goods</option>
            <option value="clothing">Clothing</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setViewMode('grid')}
              title="Cards View (Default)"
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === 'grid' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <HiSquares2X2 size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === 'table' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <HiListBullet size={18} />
            </button>
          </div>

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
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center gap-3">
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
      ) : viewMode === 'grid' ? (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => {
            const markup = getMarkupAmount(p.finalPrice, p.basePrice)
            const inStock = p.stockQty > 0
            return (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="relative mb-3 h-44 w-full rounded-xl bg-slate-50 border p-2 flex items-center justify-center overflow-hidden">
                  <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                  <span
                    className={`absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase shadow-xs ${
                      inStock ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {inStock ? `${p.stockQty} In Stock` : 'Out of Stock'}
                  </span>
                  {p.badge && (
                    <span className="absolute top-2 right-2 rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-black uppercase text-white shadow-xs">
                      {p.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">{p.category}</span>
                    <span className="text-[10px] font-bold text-slate-500">{p.brand}</span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">{p.name}</h3>

                  <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Customer Price</span>
                      <span className="font-black text-slate-900">{formatNaira(p.finalPrice)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-bold text-emerald-600 uppercase">Profit Margin</span>
                      <span className="font-bold text-emerald-600 text-xs flex items-center gap-0.5">
                        <HiSparkles size={11} /> +{formatNaira(markup)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => toggleStockStatus(p.id)}
                    className={`rounded-xl px-3 py-2 text-[11px] font-extrabold ${
                      inStock ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {inStock ? 'In Stock' : 'Restock'}
                  </button>
                  <Link
                    to={`/admin/products/${p.id}/edit`}
                    className="flex-1 rounded-xl bg-slate-900 py-2 text-center text-xs font-bold text-white hover:bg-slate-800 flex items-center justify-center gap-1"
                  >
                    <HiPencilSquare size={14} /> Edit Details
                  </Link>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="rounded-xl border border-rose-200 p-2 text-rose-600 hover:bg-rose-50"
                  >
                    <HiTrash size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-extrabold uppercase text-slate-500 text-[10px] tracking-wider">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Base Cost</th>
                <th className="p-4">Final Price</th>
                <th className="p-4">Markup Profit</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((p) => {
                const markup = getMarkupAmount(p.finalPrice, p.basePrice)
                const inStock = p.stockQty > 0
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-contain bg-slate-50 border p-1" />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 line-clamp-1">{p.name}</span>
                          <span className="text-[10px] text-slate-400">ID: {p.id} • Brand: {p.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold uppercase text-slate-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-bold">{formatNaira(p.basePrice)}</td>
                    <td className="p-4 font-black text-slate-900">{formatNaira(p.finalPrice)}</td>
                    <td className="p-4 text-emerald-600 font-black flex items-center gap-1">
                      <HiSparkles size={13} /> {formatNaira(markup)}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleStockStatus(p.id)}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase transition-all ${
                          inStock
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {inStock ? `${p.stockQty} In Stock` : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${p.id}/edit`}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <HiPencilSquare size={16} />
                        </Link>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50"
                        >
                          <HiTrash size={16} />
                        </button>
                      </div>
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
