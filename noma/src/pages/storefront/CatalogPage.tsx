import {
  CaretDown,
  CaretLeft,
  CaretRight,
  Funnel,
  Heart,
  House,
  List,
  ShoppingBag,
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
  const { isInWishlist, toggleWishlist } = useUserStore()

  const activeCategoryKey = categoryId || 'all'

  const [sort, setSort] = useState<'popular' | 'newest' | 'price-asc' | 'price-desc'>('popular')
  const [sortOpen, setSortOpen] = useState(false)
  const [activeSubCategory, setActiveSubCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [minRating, setMinRating] = useState<number | null>(null)
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(2000000)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({})
  const [pageState, setPageState] = useState<{ categoryKey: string; page: number }>({
    categoryKey: activeCategoryKey,
    page: 1,
  })

  const setCurrentPage = (nextPage: number) => {
    setPageState({ categoryKey: activeCategoryKey, page: nextPage })
  }

  const toggleCategoryExpand = (catId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedMap((prev) => {
      const current = prev[catId] ?? catId === categoryId
      return { ...prev, [catId]: !current }
    })
  }

  const activeCategory = useMemo(() => {
    if (!categoryId || categoryId === 'all') {
      return {
        id: 'all',
        label: 'All Products',
        merchandisingLine:
          "Explore Noma's catalog of verified electronics, kitchen appliances, and home essentials.",
      }
    }
    const cleanKey = categoryId.toLowerCase()
    return (
      categories.find(
        (c) => c.id.toLowerCase() === cleanKey || c.label.toLowerCase() === cleanKey
      ) || {
        id: categoryId,
        label: categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/-/g, ' '),
        merchandisingLine: 'Quality items curated with transparent pricing and receipt-ready support.',
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
      (c) => c.id.toLowerCase() === activeCategory.id.toLowerCase()
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
        c.label.toLowerCase() === activeCategory.label.toLowerCase()
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
    [currentPage, totalPages]
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
      toast.info('Select a size option to add to cart')
      navigate(`/product/${product.slug || product.id}`)
      return
    }
    addItem(product.id)
    toast.success(`${product.name} added to cart`)
  }

  const activeFilterCount =
    (inStockOnly ? 1 : 0) +
    (minRating !== null ? 1 : 0) +
    (maxPriceFilter < 2000000 ? 1 : 0) +
    (activeSubCategory !== 'all' ? 1 : 0)

  return (
    <div className="min-h-screen bg-[#F6F7F9] pb-20 pt-4 text-[#0B1220]">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-[#5E6675]">
          <Link to="/" className="inline-flex items-center gap-1 transition-colors hover:text-[#1049EB]">
            <House size={13} weight="regular" />
            <span>Home</span>
          </Link>
          <CaretRight size={12} weight="regular" className="text-[#5E6675]" />
          <span className="font-semibold text-[#0B1220]">{activeCategory.label}</span>
          {activeSubCategory !== 'all' ? (
            <>
              <CaretRight size={12} weight="regular" className="text-[#5E6675]" />
              <span className="font-semibold text-[#1049EB]">{activeSubCategory}</span>
            </>
          ) : null}
        </nav>

        {/* Compact Split Header Banner */}
        <div className="mb-8 overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
            <div className="md:col-span-7 lg:col-span-8">
              <h1 className="text-2xl font-bold tracking-tight text-[#0B1220] sm:text-3xl md:text-[2.25rem]">
                {activeCategory.label}
              </h1>
              <p className="mt-2 max-w-[60ch] text-sm leading-[1.6] text-[#374151]">
                {(activeCategory.merchandisingLine || '').replace(/[—–]/g, '-')}
              </p>
            </div>

            <div className="md:col-span-5 lg:col-span-4">
              <div className="aspect-[16/10] w-full overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9]">
                <img
                  src={currentHeroImage}
                  alt={activeCategory.label}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter & Sort Bar */}
        <div className="mb-5 flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-[6px] border border-[#E5E7EB] bg-white py-2.5 text-xs font-semibold text-[#0B1220] hover:bg-[#EEF0F4]"
          >
            <Funnel size={15} weight="regular" />
            <span>
              Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
            </span>
          </button>

          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => setSortOpen((prev) => !prev)}
              className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#E5E7EB] bg-white py-2.5 text-xs font-semibold text-[#0B1220] hover:bg-[#EEF0F4]"
            >
              <SlidersHorizontal size={15} weight="regular" />
              <span className="truncate">{activeSort?.label}</span>
            </button>

            {sortOpen ? (
              <div className="absolute right-0 top-full z-30 mt-1.5 w-full overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white shadow-[0_8px_24px_rgba(11,18,32,0.08)]">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSort(opt.value)
                      setCurrentPage(1)
                      setSortOpen(false)
                    }}
                    className={`w-full px-3.5 py-2.5 text-left text-xs font-semibold transition-colors ${
                      sort === opt.value
                        ? 'bg-[#EEF3FE] text-[#1049EB]'
                        : 'text-[#374151] hover:bg-[#F6F7F9]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Main Content Layout: 240px Sticky Left Rail + Results */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {/* Desktop 240px Filter Sidebar */}
          <aside className="hidden w-[240px] shrink-0 md:block">
            <div className="sticky top-24 space-y-5 rounded-[8px] border border-[#E5E7EB] bg-white p-4">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <h2 className="text-sm font-bold text-[#0B1220]">Filters</h2>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-semibold text-[#1049EB] hover:underline"
                >
                  Clear all
                </button>
              </div>

              {/* Category Tree */}
              <div className="border-b border-[#E5E7EB] pb-4">
                <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Categories
                </span>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/catalog')
                      setActiveSubCategory('all')
                      setCurrentPage(1)
                    }}
                    className={`flex items-center justify-between rounded-[6px] px-2.5 py-1.5 text-left text-xs font-semibold transition-colors ${
                      !categoryId || categoryId === 'all'
                        ? 'bg-[#EEF3FE] text-[#1049EB]'
                        : 'text-[#374151] hover:bg-[#F6F7F9]'
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="font-mono text-[11px] text-[#5E6675]">{products.length}</span>
                  </button>

                  {categories.map((cat) => {
                    const isSelected = categoryId === cat.id
                    const isExpanded = expandedMap[cat.id] ?? isSelected
                    const catSubs = cat.subcategories || []
                    const hasSubs = catSubs.length > 0
                    const catCount = products.filter(
                      (p) =>
                        p.category === cat.id ||
                        (cat.id === 'kitchen' && p.category === 'cooking') ||
                        (cat.id === 'home-essentials' && p.category === 'general') ||
                        (cat.id === 'outdoor' && p.category === 'bicycles')
                    ).length

                    return (
                      <div key={cat.id} className="flex flex-col">
                        <div className="flex items-center justify-between rounded-[6px] px-1.5 py-1 hover:bg-[#F6F7F9]">
                          <div className="flex min-w-0 flex-1 items-center gap-1">
                            {hasSubs ? (
                              <button
                                type="button"
                                onClick={(e) => toggleCategoryExpand(cat.id, e)}
                                className="rounded-[4px] p-1 text-[#5E6675] hover:bg-[#EEF3FE] hover:text-[#1049EB]"
                                aria-label={isExpanded ? 'Collapse category' : 'Expand category'}
                              >
                                {isExpanded ? (
                                  <CaretDown size={13} weight="regular" />
                                ) : (
                                  <CaretRight size={13} weight="regular" />
                                )}
                              </button>
                            ) : (
                              <span className="w-5 shrink-0" />
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                navigate(`/category/${cat.id}`)
                                setActiveSubCategory('all')
                                setCurrentPage(1)
                              }}
                              className={`flex-1 truncate text-left text-xs transition-colors ${
                                isSelected
                                  ? 'font-bold text-[#1049EB]'
                                  : 'font-medium text-[#374151] hover:text-[#0B1220]'
                              }`}
                            >
                              {cat.label}
                            </button>
                          </div>
                          <span className="ml-1 shrink-0 font-mono text-[11px] text-[#5E6675]">
                            {catCount}
                          </span>
                        </div>

                        {hasSubs && isExpanded ? (
                          <div className="my-1 ml-5 flex flex-col gap-0.5 border-l border-[#E5E7EB] pl-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSubCategory('all')
                                setCurrentPage(1)
                              }}
                              className={`rounded-[4px] px-2 py-1 text-left text-[11px] transition-colors ${
                                isSelected && activeSubCategory === 'all'
                                  ? 'bg-[#EEF3FE] font-semibold text-[#1049EB]'
                                  : 'text-[#5E6675] hover:bg-[#F6F7F9] hover:text-[#0B1220]'
                              }`}
                            >
                              All {cat.label}
                            </button>
                            {catSubs.map((sub) => {
                              const isSubActive =
                                activeSubCategory === sub.id || activeSubCategory === sub.label
                              return (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onClick={() => {
                                    if (!isSelected) {
                                      navigate(`/category/${cat.id}`)
                                    }
                                    setActiveSubCategory(sub.id)
                                    setCurrentPage(1)
                                  }}
                                  className={`flex items-center justify-between rounded-[4px] px-2 py-1 text-left text-[11px] transition-colors ${
                                    isSubActive
                                      ? 'bg-[#EEF3FE] font-semibold text-[#1049EB]'
                                      : 'text-[#5E6675] hover:bg-[#F6F7F9] hover:text-[#0B1220]'
                                  }`}
                                >
                                  <span className="truncate">{sub.label}</span>
                                </button>
                              )
                            })}
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="border-b border-[#E5E7EB] pb-4">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Max Price
                </span>
                <p className="mb-2.5 font-mono text-xs font-bold text-[#0B1220]">
                  Up to {formatNaira(maxPriceFilter)}
                </p>
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
                  className="w-full accent-[#1049EB]"
                />
              </div>

              {/* In Stock Only */}
              <div className="border-b border-[#E5E7EB] pb-4">
                <label className="flex cursor-pointer items-center justify-between text-xs font-medium text-[#374151]">
                  <span>In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked)
                      setCurrentPage(1)
                    }}
                    className="h-4 w-4 rounded-[4px] border-[#D1D5DB] accent-[#1049EB]"
                  />
                </label>
              </div>

              {/* Minimum Rating */}
              <div>
                <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Minimum Rating
                </span>
                <div className="flex flex-col gap-1.5">
                  {[5, 4, 3].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => {
                        setMinRating((prev) => (prev === stars ? null : stars))
                        setCurrentPage(1)
                      }}
                      className={`flex items-center justify-between rounded-[6px] border px-2.5 py-2 text-xs transition-colors ${
                        minRating === stars
                          ? 'border-[#FDE68A] bg-[#FFFBEB] font-semibold text-[#B45309]'
                          : 'border-transparent text-[#374151] hover:bg-[#F6F7F9]'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            size={13}
                            weight="fill"
                            className={idx < stars ? 'text-[#FEB719]' : 'text-[#E5E7EB]'}
                          />
                        ))}
                        <span className="ml-1 font-mono text-[11px]">&amp; Up</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Product Display Column */}
          <div className="min-w-0 flex-1">
            {/* Horizontal Subcategory Chips & Sort / View Toolbar */}
            <div className="mb-6 flex flex-col gap-3 border-b border-[#E5E7EB] pb-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubCategory('all')
                      setCurrentPage(1)
                    }}
                    className={`shrink-0 rounded-[6px] px-3 py-1.5 text-xs font-semibold transition-colors ${
                      activeSubCategory === 'all'
                        ? 'bg-[#0B1220] text-white'
                        : 'border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#EEF0F4]'
                    }`}
                  >
                    All {activeCategory.label}
                  </button>

                  {activeCategorySubcategories.map((sub) => {
                    const subId = sub.id
                    const subLabel = sub.label
                    const isSubActive =
                      activeSubCategory === subId || activeSubCategory === subLabel

                    return (
                      <button
                        key={subId}
                        type="button"
                        onClick={() => {
                          setActiveSubCategory(subId)
                          setCurrentPage(1)
                        }}
                        className={`shrink-0 rounded-[6px] px-3 py-1.5 text-xs font-semibold transition-colors ${
                          isSubActive
                            ? 'border border-[#1049EB]/30 bg-[#EEF3FE] text-[#1049EB]'
                            : 'border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#EEF0F4]'
                        }`}
                      >
                        {subLabel}
                      </button>
                    )
                  })}
                </div>

                {/* Count, Sort & Grid/List Toggle */}
                <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                  <span className="font-mono text-xs font-medium text-[#5E6675]">
                    {sortedProducts.length} items
                  </span>

                  <div className="relative hidden md:block">
                    <button
                      type="button"
                      onClick={() => setSortOpen((prev) => !prev)}
                      className="flex items-center gap-2 rounded-[6px] border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#0B1220] hover:border-[#D1D5DB]"
                    >
                      <span className="text-[#5E6675]">Sort:</span>
                      <strong className="text-[#0B1220]">{activeSort?.label}</strong>
                      <CaretDown size={13} weight="regular" className="text-[#5E6675]" />
                    </button>

                    {sortOpen ? (
                      <div className="absolute right-0 top-full z-20 mt-1.5 w-48 overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white shadow-[0_8px_24px_rgba(11,18,32,0.08)]">
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setSort(opt.value)
                              setCurrentPage(1)
                              setSortOpen(false)
                            }}
                            className={`w-full px-3.5 py-2.5 text-left text-xs font-semibold transition-colors ${
                              sort === opt.value
                                ? 'bg-[#EEF3FE] text-[#1049EB]'
                                : 'text-[#374151] hover:bg-[#F6F7F9]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-1 rounded-[6px] border border-[#E5E7EB] bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid view"
                      className={`rounded-[4px] p-1.5 transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-[#0B1220] text-white'
                          : 'text-[#5E6675] hover:text-[#0B1220]'
                      }`}
                    >
                      <SquaresFour size={15} weight="regular" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                      className={`rounded-[4px] p-1.5 transition-colors ${
                        viewMode === 'list'
                          ? 'bg-[#0B1220] text-white'
                          : 'text-[#5E6675] hover:text-[#0B1220]'
                      }`}
                    >
                      <List size={15} weight="regular" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid or List */}
            {paginatedProducts.length === 0 ? (
              <EmptyState
                title="No products match your selected filters"
                detail="Try clearing your price ceiling, rating, or stock filter to view more items."
                action={
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
                  >
                    Clear All Filters
                  </button>
                }
              />
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {paginatedProducts.map((product) => {
                  const wishlisted = isInWishlist(product.id)
                  const hasDiscount = Boolean(
                    product.compareAtPrice && product.compareAtPrice > product.finalPrice
                  )
                  const outOfStock = product.stockQty <= 0
                  const hasSizes = Boolean(product.sizes && product.sizes.length > 0)

                  return (
                    <article
                      key={product.id}
                      className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-4 transition-colors hover:border-[#0B1220]/30 sm:flex-row sm:items-center"
                    >
                      <Link
                        to={`/product/${product.slug || product.id}`}
                        className="relative flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-[#F6F7F9] p-3 sm:h-32 sm:w-40"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                        {product.badge ? (
                          <span className="absolute left-2 top-2 rounded-[4px] bg-[#0B1220] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                            {product.badge}
                          </span>
                        ) : null}
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-medium uppercase tracking-wider text-[#5E6675]">
                              {product.brand || product.category.replace(/-/g, ' ')}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                toggleWishlist(product.id)
                                toast.success(
                                  wishlisted ? 'Removed from wishlist' : 'Saved to wishlist'
                                )
                              }}
                              aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                              className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#5E6675] hover:border-[#0B1220]/30"
                            >
                              <Heart
                                size={15}
                                weight={wishlisted ? 'fill' : 'regular'}
                                className={wishlisted ? 'text-[#B91C1C]' : 'text-[#5E6675]'}
                              />
                            </button>
                          </div>

                          <Link to={`/product/${product.slug || product.id}`}>
                            <h3 className="mt-1 text-base font-semibold text-[#0B1220] hover:text-[#1049EB]">
                              {product.name}
                            </h3>
                          </Link>

                          <p className="mt-1 line-clamp-2 text-xs text-[#5E6675]">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E7EB] pt-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-baseline gap-2">
                              <strong className="font-mono text-base font-bold text-[#0B1220]">
                                {formatNaira(product.finalPrice)}
                              </strong>
                              {hasDiscount && product.compareAtPrice ? (
                                <span className="font-mono text-xs text-[#5E6675] line-through">
                                  {formatNaira(product.compareAtPrice)}
                                </span>
                              ) : null}
                            </div>

                            <div className="flex items-center gap-1 text-xs">
                              <Star size={13} weight="fill" className="text-[#FEB719]" />
                              <span className="font-mono font-semibold text-[#0B1220]">
                                {(product.rating || 4.8).toFixed(1)}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={outOfStock}
                            onClick={() => handleListQuickAdd(product)}
                            className={`inline-flex items-center gap-1.5 rounded-[6px] px-4 py-2 text-xs font-semibold transition-colors ${
                              outOfStock
                                ? 'cursor-not-allowed border border-[#E5E7EB] bg-[#F6F7F9] text-[#5E6675]'
                                : 'bg-[#0B1220] text-white hover:bg-[#1049EB]'
                            }`}
                          >
                            <ShoppingBag size={14} weight="regular" />
                            <span>
                              {outOfStock
                                ? 'Unavailable'
                                : hasSizes
                                  ? 'Select Option'
                                  : 'Add to Cart'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}

            {/* Working Pagination */}
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
                  className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#0B1220] transition-colors hover:bg-[#F6F7F9] disabled:pointer-events-none disabled:opacity-40"
                >
                  <CaretLeft size={15} weight="regular" />
                </button>

                {visiblePages.map((entry, idx) =>
                  entry === 'ellipsis' ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-1.5 font-mono text-xs text-[#5E6675]"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={entry}
                      type="button"
                      onClick={() => setCurrentPage(entry)}
                      aria-current={entry === currentPage ? 'page' : undefined}
                      className={`flex h-9 min-w-[36px] items-center justify-center rounded-[6px] border px-2 font-mono text-xs font-semibold transition-colors ${
                        entry === currentPage
                          ? 'border-[#0B1220] bg-[#0B1220] text-white'
                          : 'border-[#E5E7EB] bg-white text-[#0B1220] hover:bg-[#F6F7F9]'
                      }`}
                    >
                      {entry}
                    </button>
                  )
                )}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  aria-label="Next page"
                  className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#0B1220] transition-colors hover:bg-[#F6F7F9] disabled:pointer-events-none disabled:opacity-40"
                >
                  <CaretRight size={15} weight="regular" />
                </button>
              </nav>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-[#0B1220]/45 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="relative z-10 mr-auto flex h-full w-[85%] max-w-xs flex-col rounded-r-[10px] border-r border-[#E5E7EB] bg-white p-5">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="text-sm font-bold text-[#0B1220]">Filter Products</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close filters"
                className="rounded-[6px] p-1 text-[#5E6675] hover:bg-[#F6F7F9] hover:text-[#0B1220]"
              >
                <X size={18} weight="regular" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto py-4">
              <div>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#5E6675]">
                  Categories
                </h4>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/catalog')
                      setActiveSubCategory('all')
                      setCurrentPage(1)
                      setMobileFilterOpen(false)
                    }}
                    className={`rounded-[6px] px-3 py-2 text-left text-xs font-semibold ${
                      !categoryId || categoryId === 'all'
                        ? 'bg-[#EEF3FE] text-[#1049EB]'
                        : 'text-[#374151] hover:bg-[#F6F7F9]'
                    }`}
                  >
                    All Categories
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
                          setMobileFilterOpen(false)
                        }}
                        className={`rounded-[6px] px-3 py-2 text-left text-xs font-semibold ${
                          isSelected
                            ? 'bg-[#EEF3FE] text-[#1049EB]'
                            : 'text-[#374151] hover:bg-[#F6F7F9]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#5E6675]">
                  Max Price
                </h4>
                <p className="mb-2 font-mono text-xs font-bold text-[#0B1220]">
                  Up to {formatNaira(maxPriceFilter)}
                </p>
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
                  className="w-full accent-[#1049EB]"
                />
              </div>

              <div>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#5E6675]">
                  Availability
                </h4>
                <label className="flex items-center gap-2.5 text-xs font-medium text-[#374151]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked)
                      setCurrentPage(1)
                    }}
                    className="h-4 w-4 rounded-[4px] border-[#D1D5DB] accent-[#1049EB]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              <div>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#5E6675]">
                  Rating
                </h4>
                <div className="flex flex-col gap-1.5">
                  {[5, 4, 3].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => {
                        setMinRating((prev) => (prev === stars ? null : stars))
                        setCurrentPage(1)
                      }}
                      className={`flex items-center gap-2 rounded-[6px] p-2 text-xs ${
                        minRating === stars
                          ? 'border border-[#FDE68A] bg-[#FFFBEB] font-semibold text-[#B45309]'
                          : 'text-[#374151] hover:bg-[#F6F7F9]'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            size={12}
                            weight="fill"
                            className={idx < stars ? 'text-[#FEB719]' : 'text-[#E5E7EB]'}
                          />
                        ))}
                        <span className="ml-1 font-mono text-[11px]">&amp; Up</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 border-t border-[#E5E7EB] pt-3">
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex-1 rounded-[6px] border border-[#E5E7EB] bg-white py-2.5 text-xs font-semibold text-[#0B1220]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 rounded-[6px] bg-[#0B1220] py-2.5 text-xs font-semibold text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
