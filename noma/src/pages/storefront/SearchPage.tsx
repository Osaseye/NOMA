// SearchPage.tsx - Replicating Search Results Page from ChatGPT Image Aug 14, 2026, 09_34_22 PM.png Section 1
import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  ChevronRight,
  Search,
  X,
  SlidersHorizontal,
  Heart,
  Plus,
  Star,
} from 'lucide-react'
import { toast } from 'sonner'
import { products } from '../../mock/commerce'
import { useCartStore } from '../../store/cartStore'
import { useUserStore } from '../../store/userStore'
import { formatNaira } from '../../utils/pricing'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || 'blender'
  const [query, setQuery] = useState(initialQuery)

  const addItem = useCartStore((s) => s.addItem)
  const { toggleWishlist, isInWishlist } = useUserStore()

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [brandSearch, setBrandSearch] = useState('')
  const [minPrice, setMinPrice] = useState<number | ''>(5000)
  const [maxPrice, setMaxPrice] = useState<number | ''>(150000)
  const [inStockOnly, setInStockOnly] = useState(true)
  const [sortBy, setSortBy] = useState('relevance')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Live Real-Time Filtering matching search bar input
  const searchResults = useMemo(() => {
    return products.filter((p) => {
      // Query match (name, description, category, or specs)
      const q = query.toLowerCase().trim()
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))

      if (!matchQuery) return false

      // Category filter
      if (selectedCategory && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        const brandMatch = selectedBrands.some((b) => p.name.toLowerCase().includes(b.toLowerCase()))
        if (!brandMatch) return false
      }

      // Price filter
      if (minPrice !== '' && p.finalPrice < Number(minPrice)) return false
      if (maxPrice !== '' && p.finalPrice > Number(maxPrice)) return false

      // Availability
      if (inStockOnly && p.stockQty <= 0) return false

      return true
    })
  }, [query, selectedCategory, selectedBrands, minPrice, maxPrice, inStockOnly])

  const handleQueryChange = (newQ: string) => {
    setQuery(newQ)
    setSearchParams({ q: newQ }, { replace: true })
  }

  const handleClearAll = () => {
    setSelectedCategory(null)
    setSelectedBrands([])
    setMinPrice(5000)
    setMaxPrice(150000)
    setInStockOnly(false)
  }

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b],
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-['Outfit',sans-serif] text-[#12203D] selection:bg-[#2F5FE3] selection:text-white pb-24 pt-3 md:pt-5">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 lg:px-12">
        {/* Search Header Banner */}
        <div className="mb-6 space-y-3">
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Link to="/" className="hover:text-[#2F5FE3] transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="font-bold text-[#12203D]">
              Search results for "{query || 'all products'}"
            </span>
          </nav>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#12203D]">Search Results</h1>

          {/* Interactive Search Bar Input */}
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search for products, brands, categories..."
              className="w-full rounded-2xl border border-gray-200 bg-white pl-4 pr-24 py-3.5 text-sm font-semibold text-[#12203D] shadow-xs outline-none focus:border-[#2F5FE3] focus:ring-4 focus:ring-[#2F5FE3]/10 transition-all"
            />
            {query && (
              <button
                onClick={() => handleQueryChange('')}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={18} />
              </button>
            )}
            <button
              onClick={() => setSearchParams({ q: query })}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[#2F5FE3] p-2.5 text-white hover:bg-[#254ec4] transition-colors"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Results Info & Sort Bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-[#12203D] lg:hidden"
            >
              <SlidersHorizontal size={14} />
              <span>Filter</span>
            </button>
            <span className="text-sm font-extrabold text-[#12203D]">
              {searchResults.length} results for "{query || 'all'}"
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 font-bold text-[#12203D] outline-none focus:border-[#2F5FE3]"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Main Grid: Sidebar Left + Results Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Filters Sidebar */}
          <aside
            className={`lg:col-span-3 space-y-6 ${
              mobileFilterOpen
                ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto block'
                : 'hidden lg:block'
            }`}
          >
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-extrabold text-[#12203D]">Filters</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClearAll}
                    className="text-xs font-bold text-[#2F5FE3] hover:underline"
                  >
                    Clear all
                  </button>
                  {mobileFilterOpen && (
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="text-gray-500 hover:text-black p-1 lg:hidden"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-[#12203D]">Categories</h4>
                <div className="space-y-1.5 text-xs font-medium text-gray-600">
                  <label className="flex items-center justify-between cursor-pointer hover:text-[#2F5FE3]">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategory === 'Kitchen Appliances'}
                        onChange={() =>
                          setSelectedCategory((prev) =>
                            prev === 'Kitchen Appliances' ? null : 'Kitchen Appliances',
                          )
                        }
                        className="rounded accent-[#2F5FE3]"
                      />
                      <span>Kitchen Appliances</span>
                    </span>
                    <span className="text-[10px] text-gray-400">(24)</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer hover:text-[#2F5FE3]">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategory === 'Home Appliances'}
                        onChange={() =>
                          setSelectedCategory((prev) =>
                            prev === 'Home Appliances' ? null : 'Home Appliances',
                          )
                        }
                        className="rounded accent-[#2F5FE3]"
                      />
                      <span>Home Appliances</span>
                    </span>
                    <span className="text-[10px] text-gray-400">(3)</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer hover:text-[#2F5FE3]">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategory === 'Electronics'}
                        onChange={() =>
                          setSelectedCategory((prev) =>
                            prev === 'Electronics' ? null : 'Electronics',
                          )
                        }
                        className="rounded accent-[#2F5FE3]"
                      />
                      <span>Electronics</span>
                    </span>
                    <span className="text-[10px] text-gray-400">(1)</span>
                  </label>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="space-y-2.5 border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-[#12203D]">Brand</h4>
                <div className="relative">
                  <input
                    type="text"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    placeholder="Search brand"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#2F5FE3]"
                  />
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                <div className="space-y-1.5 text-xs font-medium text-gray-600 max-h-40 overflow-y-auto">
                  {['Binatone', 'Philips', 'Ninja', 'Kenwood', 'Moulinex'].map((b) => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer hover:text-[#2F5FE3]">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={() => toggleBrand(b)}
                        className="rounded accent-[#2F5FE3]"
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2.5 border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-[#12203D]">Price Range</h4>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-gray-400">₦ min</span>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-2.5 py-1.5 font-bold text-[#12203D]"
                    />
                  </div>
                  <span className="text-gray-400 mt-4">-</span>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-gray-400">₦ max</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-2.5 py-1.5 font-bold text-[#12203D]"
                    />
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-[#12203D]">Availability</h4>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded accent-[#2F5FE3]"
                  />
                  <span>In Stock</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-9">
            {searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center">
                <Search size={40} className="text-gray-300 mb-3" />
                <h3 className="text-xl font-extrabold text-[#12203D]">No results found for "{query}"</h3>
                <p className="mt-1 text-xs text-gray-500 max-w-sm">
                  Try checking for spelling errors or searching with more generic terms.
                </p>
                <button
                  onClick={handleClearAll}
                  className="mt-4 rounded-xl bg-[#2F5FE3] px-5 py-2.5 text-xs font-bold text-white shadow-2xs"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {searchResults.map((product) => {
                  const wishlisted = isInWishlist(product.id)
                  return (
                    <div
                      key={product.id}
                      className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-3.5 shadow-2xs hover:border-gray-200 hover:shadow-md transition-all"
                    >
                      {/* Top Badges & Wishlist Button */}
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 p-2">
                        {product.discountBadge && (
                          <span className="absolute left-2 top-2 z-10 rounded bg-[#E53E3E] px-1.5 py-0.5 text-[9px] font-black text-white">
                            {product.discountBadge}
                          </span>
                        )}
                        <button
                          onClick={() => {
                            toggleWishlist(product.id)
                            toast.info(!wishlisted ? 'Saved to wishlist' : 'Removed from wishlist')
                          }}
                          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-2xs transition-colors hover:scale-105"
                          aria-label="Wishlist"
                        >
                          <Heart
                            size={15}
                            className={wishlisted ? 'fill-[#2F5FE3] text-[#2F5FE3]' : 'text-gray-400'}
                          />
                        </button>

                        <Link to={`/product/${product.slug || product.id}`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </Link>
                      </div>

                      {/* Product Content */}
                      <div className="mt-3 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {product.category}
                        </span>
                        <Link
                          to={`/product/${product.slug || product.id}`}
                          className="text-xs font-bold text-[#12203D] hover:text-[#2F5FE3] line-clamp-2 transition-colors"
                        >
                          {product.name}
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center gap-1 text-[11px] font-medium text-amber-500 mt-0.5">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span className="font-extrabold text-[#12203D]">{product.rating}</span>
                          <span className="text-gray-400 text-[10px]">({product.reviewsCount})</span>
                        </div>

                        {/* Price */}
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-sm font-extrabold text-[#12203D]">
                            {formatNaira(product.finalPrice)}
                          </span>
                          {product.basePrice && product.basePrice > product.finalPrice && (
                            <span className="text-[10px] text-gray-400 line-through">
                              {formatNaira(product.basePrice)}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => {
                            addItem(product.id)
                            toast.success(`Added ${product.name} to cart`)
                          }}
                          className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl border border-blue-200 bg-blue-50/70 py-2 text-xs font-bold text-[#2F5FE3] hover:bg-[#2F5FE3] hover:text-white transition-all active:scale-98"
                        >
                          <Plus size={13} strokeWidth={2.5} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
