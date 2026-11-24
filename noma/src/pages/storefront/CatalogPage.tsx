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
import { useAdminStore } from '../../store/adminStore'
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

const LOCAL_CATEGORY_BANNERS: Record<string, string> = {
  electronics: '/images/cat-electronics.png',
  appliances: '/images/cat-appliances.png',
  kitchen: '/images/cat-kitchen.png',
  cooking: '/images/cat-kitchen.png',
  phones: '/images/cat-phones.png',
  power: '/images/cat-power.png',
  solar: '/images/cat-power.png',
  living: '/images/cat-living.png',
  'home-essentials': '/images/cat-living.png',
  bicycles: '/images/cat-living.png',
  outdoor: '/images/cat-living.png',
  clothing: '/images/cat-living.png',
  general: '/images/cat-living.png',
  default: '/images/catalog-banner-all.png',
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
  const { settings } = useAdminStore()
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
          "Explore Noma's architectural index of verified electronics, kitchen appliances, and home power systems.",
      }
    }
    const cleanKey = categoryId.toLowerCase()
    return (
      categories.find(
        (c) => c.id.toLowerCase() === cleanKey || c.label.toLowerCase() === cleanKey,
      ) || {
        id: categoryId,
        label: categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/-/g, ' '),
        merchandisingLine:
          'Quality hardware curated with transparent Naira pricing and receipt-ready support.',
      }
    )
  }, [categoryId, categories])

  const currentHeroImage = useMemo(() => {
    if (!categoryId || categoryId === 'all') {
      if (
        settings.allProductsBannerImage &&
        !settings.allProductsBannerImage.includes('unsplash.com')
      ) {
        return settings.allProductsBannerImage
      }
      return '/images/catalog-banner-all.png'
    }
    const adminSetCategory = categories.find(
      (c) => c.id.toLowerCase() === activeCategory.id.toLowerCase(),
    )
    if (adminSetCategory?.image && !adminSetCategory.image.includes('unsplash.com')) {
      return adminSetCategory.image
    }
    return LOCAL_CATEGORY_BANNERS[activeCategory.id.toLowerCase()] || LOCAL_CATEGORY_BANNERS.default
  }, [activeCategory, categoryId, categories, settings.allProductsBannerImage])

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
    <div className="min-h-screen bg-white pb-20 text-[#09090B]">
      <div className="mx-auto max-w-[1600px] border-x border-[#E4E4E7]">
        {/* Architectural Breadcrumb Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E4E7] bg-[#FAFAFA] px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-[#71717A] sm:px-8">
          <nav className="flex items-center gap-2">
            <Link to="/" className="transition-colors hover:text-[#09090B]">
              INDEX
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#09090B]">{activeCategory.label}</span>
            {activeSubCategory !== 'all' ? (
              <>
                <span>/</span>
                <span className="font-semibold text-[#1049EB]">{activeSubCategory}</span>
              </>
            ) : null}
          </nav>

          <span>Showing {sortedProducts.length} Units</span>
        </div>

        {/* Exposed 1px Split Header Banner */}
        <div className="grid grid-cols-1 divide-y divide-[#E4E4E7] border-b border-[#E4E4E7] md:grid-cols-12 md:divide-x md:divide-y-0">
          <div className="flex flex-col justify-between p-6 sm:p-10 md:col-span-7 lg:col-span-8">
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1049EB]">
                DEPARTMENT / {activeCategory.id.toUpperCase()}
              </span>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#09090B] sm:text-4xl">
                {activeCategory.label}
              </h1>
              <p className="mt-3 max-w-[60ch] text-xs leading-relaxed text-[#52525B] sm:text-sm">
                {(activeCategory.merchandisingLine || '').replace(/[—–]/g, '-')}
              </p>
            </div>

            {/* Horizontal Department Switcher Pills */}
            <div className="mt-6 flex flex-wrap gap-1.5 border-t border-[#E4E4E7] pt-4">
              <button
                type="button"
                onClick={() => {
                  navigate('/catalog')
                  setActiveSubCategory('all')
                  setCurrentPage(1)
                }}
                className={`px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                  !categoryId || categoryId === 'all'
                    ? 'bg-[#09090B] text-white'
                    : 'border border-[#E4E4E7] bg-[#FAFAFA] text-[#52525B] hover:border-[#09090B] hover:text-[#09090B]'
                }`}
              >
                ALL [{products.length}]
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
                    className={`px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                      isSelected
                        ? 'bg-[#09090B] text-white'
                        : 'border border-[#E4E4E7] bg-[#FAFAFA] text-[#52525B] hover:border-[#09090B] hover:text-[#09090B]'
                    }`}
                  >
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-[#F4F4F5] p-4 sm:p-6 md:col-span-5 lg:col-span-4">
            <div className="aspect-[16/10] w-full overflow-hidden border border-[#E4E4E7] bg-white">
              <img
                src={currentHeroImage}
                alt={activeCategory.label}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Layout B Top Horizontal Filter & Sort Bar */}
        <div className="border-b border-[#E4E4E7] bg-white">
          <div className="flex flex-wrap items-stretch justify-between divide-y divide-[#E4E4E7] lg:divide-y-0">
            {/* Left: Toggle Filters Drawer/Bar + Subcategory Tabs */}
            <div className="flex w-full flex-wrap items-stretch divide-x divide-[#E4E4E7] overflow-x-auto lg:w-auto">
              <button
                type="button"
                onClick={() => setFiltersPanelOpen((prev) => !prev)}
                className={`flex shrink-0 items-center gap-2 px-5 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                  filtersPanelOpen || activeFilterCount > 0
                    ? 'bg-[#09090B] text-white'
                    : 'bg-[#FAFAFA] text-[#09090B] hover:bg-[#F4F4F5]'
                }`}
              >
                <Funnel size={14} weight="regular" />
                <span>FILTERS</span>
                {activeFilterCount > 0 ? (
                  <span className="bg-[#FEB719] px-1.5 py-0.2 font-mono text-[10px] font-bold text-[#09090B]">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveSubCategory('all')
                  setCurrentPage(1)
                }}
                className={`shrink-0 px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                  activeSubCategory === 'all'
                    ? 'bg-[#FAFAFA] text-[#1049EB]'
                    : 'bg-white text-[#52525B] hover:bg-[#FAFAFA] hover:text-[#09090B]'
                }`}
              >
                ALL {activeCategory.label}
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
                    className={`shrink-0 px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                      isSubActive
                        ? 'bg-[#FAFAFA] text-[#1049EB]'
                        : 'bg-white text-[#52525B] hover:bg-[#FAFAFA] hover:text-[#09090B]'
                    }`}
                  >
                    {sub.label}
                  </button>
                )
              })}
            </div>

            {/* Right: Item Count + Sort Dropdown + Grid/List Mode */}
            <div className="flex w-full items-stretch justify-between divide-x divide-[#E4E4E7] border-t border-[#E4E4E7] lg:w-auto lg:border-l lg:border-t-0">
              <div className="flex items-center px-4 py-3 font-mono text-[11px] text-[#71717A]">
                {sortedProducts.length} UNITS
              </div>

              <div className="relative flex items-stretch">
                <button
                  type="button"
                  onClick={() => setSortOpen((prev) => !prev)}
                  className="flex items-center gap-2 bg-white px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#09090B] hover:bg-[#FAFAFA]"
                >
                  <SlidersHorizontal size={14} weight="regular" />
                  <span>SORT: {activeSort?.label}</span>
                  <CaretDown size={12} weight="regular" className="text-[#71717A]" />
                </button>

                {sortOpen ? (
                  <div className="absolute right-0 top-full z-30 -mt-px w-52 divide-y divide-[#E4E4E7] border border-[#09090B] bg-white shadow-xl">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSort(opt.value)
                          setCurrentPage(1)
                          setSortOpen(false)
                        }}
                        className={`w-full px-4 py-2.5 text-left font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                          sort === opt.value
                            ? 'bg-[#09090B] text-white'
                            : 'text-[#09090B] hover:bg-[#FAFAFA]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex items-stretch divide-x divide-[#E4E4E7]">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  className={`flex items-center justify-center px-3.5 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[#09090B] text-white'
                      : 'bg-white text-[#71717A] hover:text-[#09090B]'
                  }`}
                >
                  <SquaresFour size={16} weight="regular" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  className={`flex items-center justify-center px-3.5 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-[#09090B] text-white'
                      : 'bg-white text-[#71717A] hover:text-[#09090B]'
                  }`}
                >
                  <List size={16} weight="regular" />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Horizontal Filter Matrix Panel */}
          {filtersPanelOpen ? (
            <div className="grid grid-cols-1 divide-y divide-[#E4E4E7] border-t border-[#E4E4E7] bg-[#FAFAFA] md:grid-cols-3 md:divide-x md:divide-y-0">
              {/* Price Ceiling */}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                    01 / MAX PRICE CEILING
                  </span>
                  <strong className="font-mono text-xs font-bold text-[#09090B]">
                    UP TO {formatNaira(maxPriceFilter)}
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
                  className="mt-3 w-full accent-[#09090B]"
                />
              </div>

              {/* Minimum Rating */}
              <div className="p-5">
                <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                  02 / MINIMUM RATING
                </span>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {[5, 4, 3].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => {
                        setMinRating((prev) => (prev === stars ? null : stars))
                        setCurrentPage(1)
                      }}
                      className={`inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                        minRating === stars
                          ? 'border-[#09090B] bg-[#09090B] text-white'
                          : 'border-[#E4E4E7] bg-white text-[#09090B] hover:border-[#09090B]'
                      }`}
                    >
                      <Star size={12} weight="fill" className="text-[#FEB719]" />
                      <span>{stars}.0+</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability & Reset */}
              <div className="flex flex-col justify-between p-5">
                <div>
                  <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                    03 / AVAILABILITY
                  </span>
                  <label className="mt-2.5 inline-flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-[#09090B]">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => {
                        setInStockOnly(e.target.checked)
                        setCurrentPage(1)
                      }}
                      className="h-4 w-4 accent-[#09090B]"
                    />
                    <span>Show In-Stock Units Only</span>
                  </label>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#E4E4E7] pt-3">
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#1049EB] hover:underline"
                  >
                    RESET ALL FILTERS
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltersPanelOpen(false)}
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#09090B]"
                  >
                    <span>CLOSE</span>
                    <X size={13} />
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Active Filter Chips Bar */}
          {activeFilterCount > 0 ? (
            <div className="flex flex-wrap items-center gap-2 border-t border-[#E4E4E7] bg-[#FAFAFA] px-5 py-2.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
                ACTIVE:
              </span>
              {activeSubCategory !== 'all' ? (
                <button
                  type="button"
                  onClick={() => setActiveSubCategory('all')}
                  className="inline-flex items-center gap-1.5 border border-[#09090B] bg-white px-2.5 py-1 font-mono text-[10px] font-semibold uppercase text-[#09090B]"
                >
                  <span>SUB: {activeSubCategory}</span>
                  <X size={11} />
                </button>
              ) : null}
              {inStockOnly ? (
                <button
                  type="button"
                  onClick={() => setInStockOnly(false)}
                  className="inline-flex items-center gap-1.5 border border-[#09090B] bg-white px-2.5 py-1 font-mono text-[10px] font-semibold uppercase text-[#09090B]"
                >
                  <span>IN STOCK ONLY</span>
                  <X size={11} />
                </button>
              ) : null}
              {minRating !== null ? (
                <button
                  type="button"
                  onClick={() => setMinRating(null)}
                  className="inline-flex items-center gap-1.5 border border-[#09090B] bg-white px-2.5 py-1 font-mono text-[10px] font-semibold uppercase text-[#09090B]"
                >
                  <span>{minRating}+ STARS</span>
                  <X size={11} />
                </button>
              ) : null}
              {maxPriceFilter < 2000000 ? (
                <button
                  type="button"
                  onClick={() => setMaxPriceFilter(2000000)}
                  className="inline-flex items-center gap-1.5 border border-[#09090B] bg-white px-2.5 py-1 font-mono text-[10px] font-semibold uppercase text-[#09090B]"
                >
                  <span>MAX {formatNaira(maxPriceFilter)}</span>
                  <X size={11} />
                </button>
              ) : null}
              <button
                type="button"
                onClick={resetAllFilters}
                className="ml-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#1049EB] hover:underline"
              >
                CLEAR ALL
              </button>
            </div>
          ) : null}
        </div>

        {/* Full-Width 4-Column Exposed 1px Product Matrix */}
        {paginatedProducts.length === 0 ? (
          <div className="p-12">
            <EmptyState
              title="No products match your selected filters"
              detail="Try clearing your price ceiling, rating, or stock filter to view more items."
              action={
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="bg-[#09090B] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#1049EB]"
                >
                  Clear All Filters
                </button>
              }
            />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-px border-b border-[#E4E4E7] bg-[#E4E4E7] md:grid-cols-3 lg:grid-cols-4">
            {paginatedProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                index={(currentPage - 1) * PAGE_SIZE + idx}
              />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-[#E4E4E7] border-b border-[#E4E4E7]">
            {paginatedProducts.map((product, idx) => {
              const wishlisted = isInWishlist(product.id)
              const hasDiscount = Boolean(
                product.compareAtPrice && product.compareAtPrice > product.finalPrice,
              )
              const outOfStock = product.stockQty <= 0
              const hasSizes = Boolean(product.sizes && product.sizes.length > 0)

              return (
                <article
                  key={product.id}
                  className="flex flex-col gap-5 bg-white p-5 transition-colors hover:bg-[#FAFAFA] sm:flex-row sm:items-center sm:px-8"
                >
                  <Link
                    to={`/product/${product.slug || product.id}`}
                    className="relative flex h-36 w-full shrink-0 items-center justify-center overflow-hidden border border-[#E4E4E7] bg-[#F4F4F5] p-4 sm:h-32 sm:w-40"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-contain mix-blend-multiply"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
                          {String((currentPage - 1) * PAGE_SIZE + idx + 1).padStart(2, '0')} /{' '}
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
                          className={`flex h-8 w-8 items-center justify-center border ${
                            wishlisted
                              ? 'border-[#09090B] bg-[#09090B] text-white'
                              : 'border-[#E4E4E7] bg-white text-[#71717A]'
                          }`}
                        >
                          <Heart size={14} weight={wishlisted ? 'fill' : 'regular'} />
                        </button>
                      </div>

                      <Link to={`/product/${product.slug || product.id}`}>
                        <h3 className="mt-1 text-base font-bold text-[#09090B] hover:text-[#1049EB]">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="mt-1 line-clamp-2 text-xs text-[#52525B]">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E4E7] pt-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-baseline gap-2">
                          <strong className="font-mono text-base font-bold tabular-nums text-[#09090B]">
                            {formatNaira(product.finalPrice)}
                          </strong>
                          {hasDiscount && product.compareAtPrice ? (
                            <span className="font-mono text-xs tabular-nums text-[#71717A] line-through">
                              {formatNaira(product.compareAtPrice)}
                            </span>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-1 text-xs">
                          <Star size={12} weight="fill" className="text-[#FEB719]" />
                          <span className="font-mono font-semibold text-[#09090B]">
                            {(product.rating || 4.8).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={outOfStock}
                        onClick={() => handleListQuickAdd(product)}
                        className={`inline-flex items-center gap-1.5 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                          outOfStock
                            ? 'cursor-not-allowed border border-[#E4E4E7] bg-[#F4F4F5] text-[#71717A]'
                            : 'bg-[#09090B] text-white hover:bg-[#1049EB]'
                        }`}
                      >
                        <Plus size={13} weight="bold" />
                        <span>
                          {outOfStock ? 'SOLD OUT' : hasSizes ? 'SELECT SIZE' : 'ADD TO BAG'}
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* Exposed Architectural Pagination Bar */}
        {totalPages > 1 ? (
          <nav
            aria-label="Catalog pagination"
            className="flex items-center justify-between bg-[#FAFAFA] px-5 py-4 sm:px-8"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-[#71717A]">
              PAGE {currentPage} OF {totalPages}
            </span>

            <div className="flex items-center gap-px border border-[#E4E4E7] bg-[#E4E4E7]">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                aria-label="Previous page"
                className="flex h-9 w-9 items-center justify-center bg-white text-[#09090B] transition-colors hover:bg-[#FAFAFA] disabled:pointer-events-none disabled:opacity-40"
              >
                <CaretLeft size={14} weight="regular" />
              </button>

              {visiblePages.map((entry, idx) =>
                entry === 'ellipsis' ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="flex h-9 items-center bg-white px-2 font-mono text-xs text-[#71717A]"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={entry}
                    type="button"
                    onClick={() => setCurrentPage(entry)}
                    aria-current={entry === currentPage ? 'page' : undefined}
                    className={`flex h-9 min-w-[36px] items-center justify-center px-2 font-mono text-xs font-semibold transition-colors ${
                      entry === currentPage
                        ? 'bg-[#09090B] text-white'
                        : 'bg-white text-[#09090B] hover:bg-[#FAFAFA]'
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
                className="flex h-9 w-9 items-center justify-center bg-white text-[#09090B] transition-colors hover:bg-[#FAFAFA] disabled:pointer-events-none disabled:opacity-40"
              >
                <CaretRight size={14} weight="regular" />
              </button>
            </div>
          </nav>
        ) : null}
      </div>
    </div>
  )
}
