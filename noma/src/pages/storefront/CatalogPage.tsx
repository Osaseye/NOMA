import { ChevronDown, ChevronRight, Home, Search, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { categories, products } from '../../mock/commerce'
import { useCartStore } from '../../store/cartStore'
import { formatNaira } from '../../utils/pricing'

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

export function CatalogPage() {
  const { categoryId } = useParams()
  const addItem = useCartStore((s) => s.addItem)
  const [sort, setSort] = useState('popular')
  const [sortOpen, setSortOpen] = useState(false)

  const activeCategory = categories.find((c) => c.id === categoryId)

  let filtered = categoryId
    ? products.filter((p) => p.category === categoryId)
    : [...products]

  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.finalPrice - b.finalPrice)
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.finalPrice - a.finalPrice)

  const activeSort = sortOptions.find((s) => s.value === sort)

  return (
    <div className="min-h-screen bg-[#F9F9F6] selection:bg-[#12203D] selection:text-white">
      {/* Top spacer for absolute header */}
      <div className="h-[88px]" />

      <div className="mx-auto w-full max-w-[1600px] px-4 py-8 md:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#12203D]/60">
          <Link to="/" className="flex items-center gap-1 hover:text-[#12203D]">
            <Home size={14} strokeWidth={2.5} /> HOME
          </Link>
          <ChevronRight size={14} strokeWidth={3} />
          <span className="text-[#12203D]">{activeCategory?.label ?? 'CATALOG'}</span>
        </nav>

        {/* Page title & Filter */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 border-b-4 border-[#12203D] pb-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-['Outfit'] text-[3rem] font-black leading-none tracking-tighter text-[#12203D] md:text-[5rem]">
              {activeCategory?.label ? activeCategory.label.toUpperCase() : 'ALL PRODUCTS'}
            </h1>
            {activeCategory?.merchandisingLine && (
              <p className="mt-2 text-[14px] font-bold text-[#12203D]/60">
                {activeCategory.merchandisingLine}
              </p>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex w-full items-center justify-between gap-4 rounded-2xl border-2 border-[#12203D] bg-white px-6 py-4 text-[13px] font-black uppercase tracking-widest text-[#12203D] shadow-[4px_4px_0_0_#12203D] transition-transform active:translate-y-1 active:shadow-none md:w-auto"
            >
              {activeSort?.label}
              <ChevronDown size={18} strokeWidth={3} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-full rounded-2xl border-2 border-[#12203D] bg-white shadow-[4px_4px_0_0_#12203D] md:w-56 overflow-hidden">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false) }}
                    className={`flex w-full items-center border-b-2 border-[#12203D]/10 px-5 py-4 text-left text-[12px] font-black uppercase tracking-widest transition-colors last:border-0 hover:bg-[#12203D] hover:text-white ${sort === opt.value ? 'bg-[#F7F8FA] text-[#12203D]' : 'text-[#12203D]/70'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category filters */}
        <div className="mb-12 flex flex-wrap gap-3">
          <Link
            to="/catalog"
            className={`rounded-full border-2 border-[#12203D] px-6 py-3 text-[12px] font-black uppercase tracking-widest transition-all ${!categoryId ? 'bg-[#12203D] text-white shadow-[4px_4px_0_0_#12203D]' : 'bg-white text-[#12203D] hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#12203D]'}`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className={`rounded-full border-2 border-[#12203D] px-6 py-3 text-[12px] font-black uppercase tracking-widest transition-all ${categoryId === cat.id ? 'bg-[#12203D] text-white shadow-[4px_4px_0_0_#12203D]' : 'bg-white text-[#12203D] hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#12203D]'}`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-4 border-dashed border-[#12203D]/20 py-32 text-center">
            <Search size={64} className="mb-6 text-[#12203D]/20" strokeWidth={1.5} />
            <h3 className="mb-2 text-2xl font-black text-[#12203D]">NOTHING FOUND</h3>
            <p className="mb-8 font-medium text-[#12203D]/50">We couldn't find any products in this category.</p>
            <Link to="/catalog" className="rounded-full border-2 border-[#12203D] bg-[#12203D] px-8 py-4 text-[13px] font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-[#12203D] hover:shadow-[4px_4px_0_0_#12203D]">
              Clear Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col rounded-3xl border-2 border-[#12203D] bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#12203D] overflow-hidden"
              >
                {/* Image Section */}
                <Link to={`/product/${product.slug}`} className="relative flex aspect-square items-center justify-center border-b-2 border-[#12203D] bg-[#F7F8FA] p-6 overflow-hidden">
                  {product.badge && (
                    <div className="absolute left-0 top-0 z-10 rounded-br-2xl border-b-2 border-r-2 border-[#12203D] bg-[#10B981] px-3 py-1.5 text-[10px] font-black uppercase text-white">
                      {product.badge}
                    </div>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>

                {/* Details Section */}
                <div className="flex flex-1 flex-col p-5">
                  <Link to={`/product/${product.slug}`} className="mb-4">
                    <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-[#12203D] transition-colors group-hover:text-[#2F5FE3]">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black tracking-tight text-[#12203D]">
                        {formatNaira(product.finalPrice)}
                      </span>
                      {product.basePrice > product.finalPrice && (
                        <span className="text-[13px] font-bold text-[#12203D]/40 line-through">
                          {formatNaira(product.basePrice)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        addItem(product.id)
                        toast.success('Added to cart!', { description: product.name, duration: 2500 })
                      }}
                      aria-label={`Add ${product.name} to cart`}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#12203D] bg-white text-[#12203D] shadow-[4px_4px_0_0_#12203D] transition-all hover:translate-y-1 hover:shadow-none active:bg-[#12203D] active:text-white"
                    >
                      <Truck size={20} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
