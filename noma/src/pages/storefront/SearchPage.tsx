import { CaretRight, MagnifyingGlass, SlidersHorizontal, X } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductCard } from '../../components/commerce/ProductCard'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useProductStore } from '../../store/productStore'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { products, categories } = useProductStore()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [brandSearch, setBrandSearch] = useState('')
  const [minPrice, setMinPrice] = useState<number | ''>('')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'newest'>('relevance')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const dynamicCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const count = products.filter(
          (p) =>
            p.category?.toLowerCase() === cat.id?.toLowerCase() ||
            p.category?.toLowerCase() === cat.label?.toLowerCase()
        ).length
        return {
          id: cat.id,
          label: cat.label,
          count,
        }
      })
      .filter((cat) => cat.count > 0)
  }, [categories, products])

  const dynamicBrands = useMemo(() => {
    const brandSet = new Set<string>()
    products.forEach((p) => {
      if (p.brand && p.brand.trim() !== '') {
        brandSet.add(p.brand.trim())
      }
    })
    const list = Array.from(brandSet)
    if (brandSearch.trim()) {
      return list.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()))
    }
    return list
  }, [products, brandSearch])

  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim()

    const filtered = products.filter((p) => {
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))

      if (!matchQuery) return false

      if (selectedCategory) {
        const catMatch =
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          p.subCategory?.toLowerCase() === selectedCategory.toLowerCase()
        if (!catMatch) return false
      }

      if (selectedBrands.length > 0) {
        const brandMatch = selectedBrands.some(
          (b) =>
            p.brand?.toLowerCase() === b.toLowerCase() ||
            p.name.toLowerCase().includes(b.toLowerCase())
        )
        if (!brandMatch) return false
      }

      if (minPrice !== '' && p.finalPrice < Number(minPrice)) return false
      if (maxPrice !== '' && p.finalPrice > Number(maxPrice)) return false
      if (inStockOnly && p.stockQty <= 0) return false

      return true
    })

    if (sortBy === 'price-low') {
      return [...filtered].sort((a, b) => a.finalPrice - b.finalPrice)
    }
    if (sortBy === 'price-high') {
      return [...filtered].sort((a, b) => b.finalPrice - a.finalPrice)
    }
    if (sortBy === 'newest') {
      return [...filtered].reverse()
    }

    if (q) {
      return [...filtered].sort((a, b) => {
        const score = (item: typeof a) => {
          const nameLower = item.name.toLowerCase()
          if (nameLower.startsWith(q)) return 3
          if (nameLower.includes(q)) return 2
          if (item.brand?.toLowerCase().includes(q)) return 1
          return 0
        }
        return score(b) - score(a)
      })
    }

    return filtered
  }, [products, query, selectedCategory, selectedBrands, minPrice, maxPrice, inStockOnly, sortBy])

  const handleClearAll = () => {
    setSelectedCategory(null)
    setSelectedBrands([])
    setMinPrice('')
    setMaxPrice('')
    setInStockOnly(false)
    setBrandSearch('')
  }

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] pb-24 pt-4 text-[#0B1220]">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-6 space-y-1">
          <nav className="flex items-center gap-2 text-xs font-medium text-[#5E6675]">
            <Link to="/" className="transition-colors hover:text-[#1049EB]">
              Home
            </Link>
            <CaretRight size={12} weight="regular" />
            <span className="font-semibold text-[#0B1220]">
              Search {query ? `"${query}"` : 'Catalog'}
            </span>
          </nav>

          <h1 className="text-2xl font-bold tracking-tight text-[#0B1220] sm:text-3xl">
            Search Results {query ? `for "${query}"` : ''}
          </h1>
        </div>

        {/* Results Info & Sort Bar */}
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#E5E7EB] pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-2 rounded-[6px] border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs font-semibold text-[#0B1220] lg:hidden"
            >
              <SlidersHorizontal size={14} weight="regular" />
              <span>Filter</span>
            </button>
            <span className="text-sm font-semibold text-[#0B1220]">
              <span className="font-mono">{searchResults.length}</span>{' '}
              {searchResults.length === 1 ? 'result' : 'results'}{' '}
              {query ? `for "${query}"` : 'in catalog'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-[#5E6675]">
            <label htmlFor="search-sort">Sort by:</label>
            <select
              id="search-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-[6px] border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#0B1220] focus:border-[#1049EB] focus:outline-none"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Main Split: 240px Sidebar + Results */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <aside
            className={
              mobileFilterOpen
                ? 'fixed inset-0 z-50 overflow-y-auto bg-white p-6 lg:static lg:z-auto lg:w-[240px] lg:shrink-0 lg:bg-transparent lg:p-0'
                : 'hidden lg:block lg:w-[240px] lg:shrink-0'
            }
          >
            <div className="space-y-5 rounded-[8px] border border-[#E5E7EB] bg-white p-4">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <h2 className="text-sm font-bold text-[#0B1220]">Filters</h2>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-xs font-semibold text-[#1049EB] hover:underline"
                  >
                    Clear all
                  </button>
                  {mobileFilterOpen ? (
                    <button
                      type="button"
                      onClick={() => setMobileFilterOpen(false)}
                      aria-label="Close filters"
                      className="rounded-[6px] p-1 text-[#5E6675] hover:text-[#0B1220] lg:hidden"
                    >
                      <X size={18} weight="regular" />
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Categories */}
              {dynamicCategories.length > 0 ? (
                <div className="space-y-2.5 border-b border-[#E5E7EB] pb-4">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                    Categories
                  </h3>
                  <div className="space-y-1.5 text-xs font-medium text-[#374151]">
                    {dynamicCategories.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex cursor-pointer items-center justify-between hover:text-[#1049EB]"
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCategory === cat.id}
                            onChange={() =>
                              setSelectedCategory((prev) => (prev === cat.id ? null : cat.id))
                            }
                            className="rounded-[4px] accent-[#1049EB]"
                          />
                          <span>{cat.label}</span>
                        </span>
                        <span className="font-mono text-[11px] text-[#5E6675]">({cat.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Brands */}
              {dynamicBrands.length > 0 ? (
                <div className="space-y-2.5 border-b border-[#E5E7EB] pb-4">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                    Brand
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      placeholder="Filter brand"
                      className="w-full rounded-[6px] border border-[#D1D5DB] bg-[#F6F7F9] py-1.5 pl-8 pr-3 text-xs text-[#0B1220] focus:border-[#1049EB] focus:bg-white focus:outline-none"
                    />
                    <MagnifyingGlass
                      size={13}
                      weight="regular"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5E6675]"
                    />
                  </div>

                  <div className="max-h-40 space-y-1.5 overflow-y-auto text-xs font-medium text-[#374151]">
                    {dynamicBrands.map((b) => (
                      <label
                        key={b}
                        className="flex cursor-pointer items-center gap-2 hover:text-[#1049EB]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(b)}
                          onChange={() => toggleBrand(b)}
                          className="rounded-[4px] accent-[#1049EB]"
                        />
                        <span>{b}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Price Range (Mono NGN inputs) */}
              <div className="space-y-2.5 border-b border-[#E5E7EB] pb-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Price Range (NGN)
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1">
                    <span className="mb-1 block font-mono text-[10px] font-semibold text-[#5E6675]">
                      ₦ min
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                      placeholder="0"
                      className="w-full rounded-[6px] border border-[#D1D5DB] bg-white px-2.5 py-1.5 font-mono text-xs font-semibold text-[#0B1220] focus:border-[#1049EB] focus:outline-none"
                    />
                  </div>
                  <span className="mt-4 text-[#5E6675]">-</span>
                  <div className="flex-1">
                    <span className="mb-1 block font-mono text-[10px] font-semibold text-[#5E6675]">
                      ₦ max
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                      placeholder="Any"
                      className="w-full rounded-[6px] border border-[#D1D5DB] bg-white px-2.5 py-1.5 font-mono text-xs font-semibold text-[#0B1220] focus:border-[#1049EB] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Availability
                </h3>
                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[#374151]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded-[4px] accent-[#1049EB]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {mobileFilterOpen ? (
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full rounded-[6px] bg-[#0B1220] py-2.5 text-xs font-semibold text-white lg:hidden"
                >
                  Show {searchResults.length} results
                </button>
              ) : null}
            </div>
          </aside>

          {/* Right Results Grid */}
          <div className="min-w-0 flex-1">
            {searchResults.length === 0 ? (
              <EmptyState
                icon={<MagnifyingGlass size={24} weight="regular" />}
                title={`No results found${query ? ` for "${query}"` : ''}`}
                detail="Try checking spelling or resetting active filters to explore the full catalog."
                action={
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
                  >
                    Reset Filters
                  </button>
                }
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
