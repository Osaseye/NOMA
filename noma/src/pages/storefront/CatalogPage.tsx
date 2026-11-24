import {
  CaretDown,
  CaretLeft,
  CaretRight,
  Funnel,
  Heart,
  List,
  Plus,
  SlidersHorizontal,
  SquaresFour,
  Star,
  X,
} from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ProductCard } from '../../components/commerce/ProductCard'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useCartStore } from '../../store/cartStore'
import { useProductStore } from '../../store/productStore'
import { useUserStore } from '../../store/userStore'
import type { Product } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

const PAGE_SIZE = 12

const sortOptions = [
  { value: 'popular', label: 'Popularity' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
] as const

const subCategoryMap: Record<string, { id: string; label: string }[]> = {
  electronics: [
    { id: 'all', label: 'All Electronics' },
    { id: 'tvs', label: 'Smart TVs' },
    { id: 'audio', label: 'Audio & Sound' },
    { id: 'speakers', label: 'Speakers' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'gaming', label: 'Gaming' },
  ],
  kitchen: [
    { id: 'all', label: 'All Kitchen' },
    { id: 'cookware', label: 'Cookware' },
    { id: 'airfryers', label: 'Air Fryers' },
    { id: 'blenders', label: 'Blenders' },
  ],
  appliances: [
    { id: 'all', label: 'All Appliances' },
    { id: 'microwaves', label: 'Microwaves' },
    { id: 'refrigerators', label: 'Refrigerators' },
    { id: 'fans', label: 'Fans & Cooling' },
  ],
  phones: [
    { id: 'all', label: 'All Phones' },
    { id: 'smartphones', label: 'Smartphones' },
    { id: 'powerbanks', label: 'Power Banks' },
  ],
  default: [
    { id: 'all', label: 'All Items' },
    { id: 'featured', label: 'Featured' },
    { id: 'deals', label: 'Price Drops' },
  ],
}

function getVisiblePages(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'ellipsis', totalPages]
  }
  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }
  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages]
}

export function CatalogPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const { products, categories } = useProductStore()
  const addItem = useCartStore((s) => s.addItem)
  const openDrawer = useCartStore((s) => s.openDrawer)
  const { isInWishlist, toggleWishlist } = useUserStore()

  const activeCategoryKey = categoryId || 'all'

  const [sort, setSort] = useState<'popular' | 'newest' | 'price-asc' | 'price-desc'>('popular')
  const [sortOpen, setSortOpen] = useState(false)
  const [activeSubCategory, setActiveSubCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [minRating, setMinRating] = useState<number | null>(null)
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(2000000)
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false)
  const [pageState, setPageState] = useState<{ categoryKey: string; page: number }>({
    categoryKey: activeCategoryKey,
    page: 1,
  })

  const setCurrentPage = (nextPage: number) => {
    setPageState({ categoryKey: activeCategoryKey, page: nextPage })
  }

  const activeCategory = useMemo(() => {
    if (!categoryId || categoryId === 'all') {
      return {
        id: 'all',
        label: 'All Products',
        merchandisingLine:
          'Browse shoes (retail & bulk), fashion, kitchen essentials, and home electronics.',
      }
    }
    const cleanKey = categoryId.toLowerCase()
    return (
      categories.find(
        (c) => c.id.toLowerCase() === cleanKey || c.label.toLowerCase() === cleanKey,
      ) || {
        id: categoryId,
        label: categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/-/g, ' '),
        merchandisingLine: 'Quality items with fast delivery across Nigeria.',
      }
    )
  }, [categoryId, categories])

  const activeCategorySubcategories = useMemo(() => {
    const adminCat = categories.find(
      (c) =>
        c.id.toLowerCase() === activeCategory.id.toLowerCase() ||
        c.label.toLowerCase() === activeCategory.label.toLowerCase(),
    )
    if (adminCat?.subcategories && adminCat.subcategories.length > 0) {
      return adminCat.subcategories
    }
    return subCategoryMap[activeCategory.id] || []
  }, [activeCategory, categories])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryId && categoryId !== 'all') {
        const matchesCat =
          p.category === categoryId ||
          (categoryId === 'kitchen' && p.category === 'cooking') ||
          (categoryId === 'cooking' && p.category === 'kitchen') ||
          (categoryId === 'home-essentials' && p.category === 'general') ||
          (categoryId === 'outdoor' && p.category === 'bicycles')
        if (!matchesCat) return false
      }

      if (activeSubCategory && activeSubCategory !== 'all') {
        const cleanSub = activeSubCategory.toLowerCase()
        const matchesSub =
          p.subCategory?.toLowerCase() === cleanSub ||
          p.subcategory?.toLowerCase() === cleanSub ||
          (p.specs && p.specs.some((spec) => spec.toLowerCase().includes(cleanSub))) ||
          p.name.toLowerCase().includes(cleanSub)
        if (!matchesSub) return false
      }

      if (inStockOnly && p.stockQty <= 0) return false
      if (minRating !== null && p.rating < minRating) return false
      if (p.finalPrice > maxPriceFilter) return false

      return true
    })
  }, [categoryId, activeSubCategory, inStockOnly, minRating, maxPriceFilter, products])

  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts]
    if (sort === 'price-asc') result.sort((a, b) => a.finalPrice - b.finalPrice)
    if (sort === 'price-desc') result.sort((a, b) => b.finalPrice - a.finalPrice)
    if (sort === 'newest') result.reverse()
    return result
  }, [filteredProducts, sort])

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE))
  const rawPage = pageState.categoryKey === activeCategoryKey ? pageState.page : 1
  const currentPage = Math.min(Math.max(1, rawPage), totalPages)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return sortedProducts.slice(start, start + PAGE_SIZE)
  }, [sortedProducts, currentPage])

  const visiblePages = useMemo(
    () => getVisiblePages(currentPage, totalPages),
    [currentPage, totalPages],
  )

  const activeSort = sortOptions.find((s) => s.value === sort)

  const resetAllFilters = () => {
    setInStockOnly(false)
    setMinRating(null)
    setMaxPriceFilter(2000000)
    setActiveSubCategory('all')
    setCurrentPage(1)
  }

  const handleListQuickAdd = (product: Product) => {
    if (product.stockQty <= 0) return
    if (product.sizes && product.sizes.length > 0) {
      toast.info('Select a size option to add to bag')
      navigate(`/product/${product.slug || product.id}`)
      return
    }
    addItem(product.id)
    openDrawer()
  }

  const activeFilterCount =
    (inStockOnly ? 1 : 0) +
    (minRating !== null ? 1 : 0) +
    (maxPriceFilter < 2000000 ? 1 : 0) +
    (activeSubCategory !== 'all' ? 1 : 0)

  return (
    <div className="min-h-screen pb-20 pt-5 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Clean Friendly Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="transition-colors hover:text-[#1049EB]">
            Home
          </Link>
          <CaretRight size={12} weight="regular" />
          <span className="font-semibold text-slate-900">{activeCategory.label}</span>
          {activeSubCategory !== 'all' ? (
            <>
              <CaretRight size={12} weight="regular" />
              <span className="font-semibold capitalize text-[#1049EB]">{activeSubCategory}</span>
            </>
          ) : null}
        </nav>

        {/* Clean Header & Category Pills */}
        <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {activeCategory.label}
              </h1>
              <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">
                {(activeCategory.merchandisingLine || '').replace(/[—–]/g, '-')}
              </p>
            </div>
            <span className="shrink-0 text-xs font-semibold text-slate-500">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          {/* Department Switcher Pills */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-4 pb-1">
            <button
              type="button"
              onClick={() => {
                navigate('/catalog')
                setActiveSubCategory('all')
                setCurrentPage(1)
              }}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                !categoryId || categoryId === 'all'
                  ? 'bg-[#1049EB] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All ({products.length})
            </button>
            {categories.map((cat) => {
              const isSelected = categoryId === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    navigate(`/category/${cat.id}`)
                    setActiveSubCategory('all')
                    setCurrentPage(1)
                  }}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-[#1049EB] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Top Horizontal Filter & Sort Toolbar */}
        <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: Filter Button + Subcategory Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersPanelOpen((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  filtersPanelOpen || activeFilterCount > 0
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Funnel size={14} weight="bold" />
                <span>Filters</span>
                {activeFilterCount > 0 ? (
                  <span className="rounded-full bg-[#FEB719] px-1.5 py-0.2 text-[10px] font-bold text-slate-950">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>

              {activeCategorySubcategories.length > 0 ? (
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubCategory('all')
                      setCurrentPage(1)
                    }}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      activeSubCategory === 'all'
                        ? 'bg-[#EEF3FE] font-semibold text-[#1049EB]'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All
                  </button>
                  {activeCategorySubcategories.map((sub) => {
                    const isSubActive =
                      activeSubCategory === sub.id || activeSubCategory === sub.label
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          setActiveSubCategory(sub.id)
                          setCurrentPage(1)
                        }}
                        className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                          isSubActive
                            ? 'bg-[#EEF3FE] font-semibold text-[#1049EB]'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {sub.label}
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>

            {/* Right: Sort Dropdown + View Toggle */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <SlidersHorizontal size={14} weight="regular" />
                  <span>Sort: {activeSort?.label}</span>
                  <CaretDown size={12} weight="regular" className="text-slate-400" />
                </button>

                {sortOpen ? (
                  <div className="absolute right-0 top-full z-30 mt-1.5 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSort(opt.value)
                          setCurrentPage(1)
                          setSortOpen(false)
                        }}
                        className={`w-full px-4 py-2 text-left text-xs font-medium transition-colors ${
                          sort === opt.value
                            ? 'bg-[#EEF3FE] font-semibold text-[#1049EB]'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="hidden items-center rounded-full border border-slate-200 bg-slate-50 p-0.5 sm:flex">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  className={`rounded-full p-1.5 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <SquaresFour size={15} weight="regular" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  className={`rounded-full p-1.5 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <List size={15} weight="regular" />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Filter Options */}
          {filtersPanelOpen ? (
            <div className="mt-4 grid grid-cols-1 gap-6 border-t border-slate-100 pt-4 md:grid-cols-3">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Max Price</span>
                  <strong className="font-bold text-slate-900">
                    Up to {formatNaira(maxPriceFilter)}
                  </strong>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={2000000}
                  step={10000}
                  value={maxPriceFilter}
                  onChange={(e) => {
                    setMaxPriceFilter(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  aria-label="Maximum price filter"
                  className="mt-3 w-full accent-[#1049EB]"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-600">Minimum Rating</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[5, 4, 3].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => {
                        setMinRating((prev) => (prev === stars ? null : stars))
                        setCurrentPage(1)
                      }}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                        minRating === stars
                          ? 'border-[#1049EB] bg-[#EEF3FE] text-[#1049EB]'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Star size={12} weight="fill" className="text-[#FEB719]" />
                      <span>{stars}.0 &amp; up</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <span className="block text-xs font-semibold text-slate-600">Availability</span>
                  <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => {
                        setInStockOnly(e.target.checked)
                        setCurrentPage(1)
                      }}
                      className="h-4 w-4 rounded accent-[#1049EB]"
                    />
                    <span>Show in-stock items only</span>
                  </label>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2">
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-xs font-semibold text-[#1049EB] hover:underline"
                  >
                    Reset all
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltersPanelOpen(false)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    <span>Done</span>
                    <X size={13} />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Breathable 4-Column Product Grid */}
        {paginatedProducts.length === 0 ? (
          <EmptyState
            title="No products match your filters"
            detail="Try clearing your price or stock filters to see more products."
            action={
              <button
                type="button"
                onClick={resetAllFilters}
                className="rounded-full bg-[#1049EB] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0D3BC2]"
              >
                Reset Filters
              </button>
            }
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-3.5">
            {paginatedProducts.map((product) => {
              const wishlisted = isInWishlist(product.id)
              const hasDiscount = Boolean(
                product.compareAtPrice && product.compareAtPrice > product.finalPrice,
              )
              const outOfStock = product.stockQty <= 0
              const hasSizes = Boolean(product.sizes && product.sizes.length > 0)

              return (
                <article
                  key={product.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-shadow hover:shadow-md sm:flex-row sm:items-center"
                >
                  <Link
                    to={`/product/${product.slug || product.id}`}
                    className="relative flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100/80 p-4 sm:h-32 sm:w-40"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium capitalize text-slate-400">
                          {product.brand || product.category.replace(/-/g, ' ')}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            toggleWishlist(product.id)
                            toast.success(
                              wishlisted ? 'Removed from wishlist' : 'Saved to wishlist',
                            )
                          }}
                          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            wishlisted
                              ? 'bg-rose-50 text-rose-500'
                              : 'bg-slate-100 text-slate-500 hover:text-rose-500'
                          }`}
                        >
                          <Heart size={15} weight={wishlisted ? 'fill' : 'regular'} />
                        </button>
                      </div>

                      <Link to={`/product/${product.slug || product.id}`}>
                        <h3 className="mt-1 text-base font-bold text-slate-900 hover:text-[#1049EB]">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-baseline gap-2">
                          <strong className="text-base font-bold tabular-nums text-slate-900">
                            {formatNaira(product.finalPrice)}
                          </strong>
                          {hasDiscount && product.compareAtPrice ? (
                            <span className="text-xs tabular-nums text-slate-400 line-through">
                              {formatNaira(product.compareAtPrice)}
                            </span>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-1 text-xs">
                          <Star size={13} weight="fill" className="text-[#FEB719]" />
                          <span className="font-semibold text-slate-700">
                            {(product.rating || 4.8).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={outOfStock}
                        onClick={() => handleListQuickAdd(product)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                          outOfStock
                            ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                            : 'bg-slate-900 text-white hover:bg-[#1049EB]'
                        }`}
                      >
                        <Plus size={13} weight="bold" />
                        <span>{outOfStock ? 'Out of Stock' : hasSizes ? 'Options' : 'Add to Bag'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* Clean Rounded Pagination */}
        {totalPages > 1 ? (
          <nav
            aria-label="Catalog pagination"
            className="mt-10 flex items-center justify-center gap-1.5"
          >
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
            >
              <CaretLeft size={14} weight="bold" />
            </button>

            {visiblePages.map((entry, idx) =>
              entry === 'ellipsis' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-xs text-slate-400">
                  ...
                </span>
              ) : (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setCurrentPage(entry)}
                  aria-current={entry === currentPage ? 'page' : undefined}
                  className={`flex h-9 min-w-[36px] items-center justify-center rounded-xl px-2.5 text-xs font-semibold transition-colors ${
                    entry === currentPage
                      ? 'bg-[#1049EB] text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {entry}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              aria-label="Next page"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
            >
              <CaretRight size={14} weight="bold" />
            </button>
          </nav>
        ) : null}
      </div>
    </div>
  )
}
