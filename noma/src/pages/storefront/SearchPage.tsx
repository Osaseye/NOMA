import { Funnel, MagnifyingGlass, X } from '@phosphor-icons/react'
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
    <div className="min-h-screen bg-white pb-24 text-[#09090B]">
      <div className="mx-auto max-w-[1600px] border-x border-[#E4E4E7]">
        {/* Architectural Breadcrumb Bar */}
        <div className="flex items-center justify-between border-b border-[#E4E4E7] bg-[#FAFAFA] px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-[#71717A] sm:px-8">
          <nav className="flex items-center gap-2">
            <Link to="/" className="transition-colors hover:text-[#09090B]">
              INDEX
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#09090B]">
              SEARCH {query ? `"${query.toUpperCase()}"` : 'CATALOG'}
            </span>
          </nav>
          <span>{searchResults.length} MATCHING UNITS</span>
        </div>

        {/* Search Header Block */}
        <div className="border-b border-[#E4E4E7] p-6 sm:p-10">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1049EB]">
            QUERY INDEX
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#09090B] sm:text-4xl">
            {query ? `Search Results for "${query}"` : 'Full Catalog Query'}
          </h1>
        </div>

        {/* Top Horizontal Filter & Sort Bar */}
        <div className="border-b border-[#E4E4E7] bg-white">
          <div className="flex flex-wrap items-stretch justify-between">
            <div className="flex items-stretch divide-x divide-[#E4E4E7] overflow-x-auto">
              <button
                type="button"
                onClick={() => setFiltersOpen((prev) => !prev)}
                className={`flex shrink-0 items-center gap-2 px-5 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                  filtersOpen || activeFilterCount > 0
                    ? 'bg-[#09090B] text-white'
                    : 'bg-[#FAFAFA] text-[#09090B] hover:bg-[#F4F4F5]'
                }`}
              >
                <Funnel size={14} weight="regular" />
                <span>FILTERS</span>
                {activeFilterCount > 0 ? (
                  <span className="bg-[#FEB719] px-1.5 font-mono text-[10px] font-bold text-[#09090B]">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>

              {dynamicCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategory((prev) => (prev === cat.id ? null : cat.id))
                  }
                  className={`shrink-0 px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#FAFAFA] text-[#1049EB]'
                      : 'bg-white text-[#52525B] hover:bg-[#FAFAFA] hover:text-[#09090B]'
                  }`}
                >
                  {cat.label} [{cat.count}]
                </button>
              ))}
            </div>

            <div className="flex items-center border-t border-[#E4E4E7] px-5 py-3 sm:border-l sm:border-t-0">
              <label
                htmlFor="search-sort"
                className="mr-2 font-mono text-[11px] uppercase tracking-wider text-[#71717A]"
              >
                SORT:
              </label>
              <select
                id="search-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-transparent font-mono text-xs font-semibold uppercase text-[#09090B] focus:outline-none"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {filtersOpen ? (
            <div className="grid grid-cols-1 divide-y divide-[#E4E4E7] border-t border-[#E4E4E7] bg-[#FAFAFA] md:grid-cols-3 md:divide-x md:divide-y-0">
              {/* Brands */}
              <div className="p-5">
                <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                  01 / BRANDS
                </span>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {dynamicBrands.map((b) => {
                    const active = selectedBrands.includes(b)
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => toggleBrand(b)}
                        className={`border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase transition-colors ${
                          active
                            ? 'border-[#09090B] bg-[#09090B] text-white'
                            : 'border-[#E4E4E7] bg-white text-[#09090B] hover:border-[#09090B]'
                        }`}
                      >
                        {b}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="p-5">
                <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                  02 / PRICE RANGE (NGN)
                </span>
                <div className="mt-2.5 flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="₦ MIN"
                    className="w-full border border-[#E4E4E7] bg-white px-3 py-1.5 font-mono text-xs text-[#09090B] focus:border-[#09090B] focus:outline-none"
                  />
                  <span className="text-[#71717A]">-</span>
                  <input
                    type="number"
                    min={0}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="₦ MAX"
                    className="w-full border border-[#E4E4E7] bg-white px-3 py-1.5 font-mono text-xs text-[#09090B] focus:border-[#09090B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Availability & Reset */}
              <div className="flex flex-col justify-between p-5">
                <div>
                  <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                    03 / STOCK STATUS
                  </span>
                  <label className="mt-2.5 inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#09090B]">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="h-4 w-4 accent-[#09090B]"
                    />
                    <span>In-Stock Units Only</span>
                  </label>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#E4E4E7] pt-3">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#1049EB] hover:underline"
                  >
                    CLEAR ALL
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#09090B]"
                  >
                    <span>CLOSE</span>
                    <X size={13} />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Full-Width 4-Column Exposed 1px Results Grid */}
        {searchResults.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={<MagnifyingGlass size={24} weight="regular" />}
              title={`No results found${query ? ` for "${query}"` : ''}`}
              detail="Try checking spelling or resetting active filters to explore the full catalog."
              action={
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="bg-[#09090B] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#1049EB]"
                >
                  Reset Filters
                </button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-px border-b border-[#E4E4E7] bg-[#E4E4E7] md:grid-cols-3 lg:grid-cols-4">
            {searchResults.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
