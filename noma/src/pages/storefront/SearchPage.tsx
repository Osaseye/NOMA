import { Search, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { products } from '../../mock/commerce'
import { formatNaira } from '../../utils/pricing'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const initialQ = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQ)

  const results = initialQ
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(initialQ.toLowerCase()) ||
          p.category.toLowerCase().includes(initialQ.toLowerCase())
      )
    : []

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="h-[88px]" />
      <div className="w-full px-4 py-8 md:px-8 lg:px-12">
        {/* Search bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            navigate(`/search?q=${encodeURIComponent(query)}`)
          }}
          className="mb-8 flex w-full max-w-2xl items-center gap-3 rounded-full bg-white px-5 py-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition focus-within:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)]"
        >
          <Search size={20} className="shrink-0 text-[#12203D]/40" strokeWidth={2.5} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, categories..."
            className="w-full bg-transparent text-[15px] font-medium text-[#12203D] outline-none placeholder:text-[#12203D]/40"
            autoFocus
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-[#2F5FE3] px-5 py-2 text-[13px] font-bold text-white hover:bg-[#2348C0]"
          >
            Search
          </button>
        </form>

        {initialQ && (
          <p className="mb-6 text-[14px] font-medium text-[#12203D]/60">
            {results.length > 0
              ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${initialQ}"`
              : `No results for "${initialQ}"`}
          </p>
        )}

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {results.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_4px_16px_-8px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]"
              >
                <Link to={`/product/${product.slug}`} className="flex h-[160px] items-center justify-center p-4 md:h-[200px]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-[#12203D]/80 hover:text-[#2F5FE3]">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[15px] font-extrabold text-[#12203D]">
                      {formatNaira(product.finalPrice)}
                    </span>
                    <button
                      onClick={() => addItem(product.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F5FE3] hover:bg-[#2F5FE3] hover:text-white"
                    >
                      <Truck size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : initialQ ? (
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#EEF2FF]">
              <Search size={40} className="text-[#2F5FE3]" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-[#12203D]">No results found</h2>
            <p className="text-[14px] text-[#12203D]/55">Try a different search term or browse our categories</p>
            <Link to="/catalog" className="mt-2 rounded-full bg-[#2F5FE3] px-8 py-3 text-[14px] font-bold text-white">
              Browse All Products
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}
