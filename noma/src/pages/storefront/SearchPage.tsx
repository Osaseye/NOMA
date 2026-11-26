import { CaretRight, Funnel, MagnifyingGlass, X } from '@phosphor-icons/react'
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
  const [minPrice, setMinPrice] = useState<number | ''>('')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'newest'>(
    'relevance',
  )
  const [filtersOpen, setFiltersOpen] = useState(false)

  const dynamicCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const count = products.filter(
          (p) =>
            p.category?.toLowerCase() === cat.id?.toLowerCase() ||
            p.category?.toLowerCase() === cat.label?.toLowerCase(),
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
    return Array.from(brandSet)
  }, [products])

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
            p.name.toLowerCase().includes(b.toLowerCase()),
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
  }

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b],
    )
  }

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    selectedBrands.length +
    (minPrice !== '' ? 1 : 0) +
    (maxPrice !== '' ? 1 : 0) +
    (inStockOnly ? 1 : 0)

  return (
    <div className="min-h-screen pb-24 pt-5 text-slate-900">
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        {/* ONE Single Unified Search Header & Filter Bar */}
        <div className="mb-6 border-b border-slate-200 pb-4">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div>
                <nav className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <Link to="/" className="hover:text-slate-900">
                    Home
                  </Link>
                  <CaretRight size={11} />
                  <span className="font-medium text-slate-800">Search</span>
                </nav>
                <div className="flex items-baseline gap-2.5">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {query ? `"${query}"` : 'All Products'}
                  </h1>
                  <span className="text-xs font-medium text-slate-500">
                    ({searchResults.length})
                  </span>
                </div>
              </div>

              <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
                {dynamicCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setSelectedCategory((prev) => (prev === cat.id ? null : cat.id))
                    }
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-[#1049EB] text-white'
                        : 'bg-[#F4F4F5] text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {cat.label} ({cat.count})
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 self-start lg:self-end">
              <button
                type="button"
                onClick={() => setFiltersOpen((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  filtersOpen || activeFilterCount > 0
                    ? 'bg-[#1049EB] text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Funnel size={14} weight="regular" />
                <span>Filter</span>
                {activeFilterCount > 0 ? (
                  <span className="rounded-full bg-[#FEB719] px-1.5 text-[10px] font-bold text-slate-950">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>

              <div className="flex items-center gap-2 text-xs">
                <select
                  id="search-sort"
                  aria-label="Sort search results"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 focus:border-[#1049EB] focus:outline-none"
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </div>

          {filtersOpen ? (
            <div className="mt-4 grid grid-cols-1 gap-6 rounded-2xl bg-[#F4F4F5] p-5 md:grid-cols-3">
              <div>
                <span className="block text-xs font-semibold text-slate-600">Brands</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {dynamicBrands.map((b) => {
                    const active = selectedBrands.includes(b)
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => toggleBrand(b)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          active
                            ? 'border-[#1049EB] bg-[#1049EB] font-semibold text-white'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {b}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-600">
                  Price Range (₦)
                </span>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Min ₦"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs tabular-nums text-slate-900 focus:border-[#1049EB] focus:outline-none"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    min={0}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Max ₦"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs tabular-nums text-slate-900 focus:border-[#1049EB] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <span className="block text-xs font-semibold text-slate-600">Availability</span>
                  <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="h-4 w-4 rounded accent-[#1049EB]"
                    />
                    <span>Show in-stock items only</span>
                  </label>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-2">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-xs font-semibold text-slate-700 hover:underline"
                  >
                    Clear all
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900"
                  >
                    <span>Done</span>
                    <X size={13} />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Wide 4-Column Results Grid */}
        {searchResults.length === 0 ? (
          <EmptyState
            icon={<MagnifyingGlass size={24} weight="regular" className="text-[#1049EB]" />}
            title={`No results found${query ? ` for "${query}"` : ''}`}
            detail="Try checking spelling or resetting active filters to explore the full catalog."
            action={
              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-full bg-[#1049EB] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0D3EC7]"
              >
                Reset Filters
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
