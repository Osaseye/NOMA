import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Gamepad2,
  Heart,
  Home,
  LayoutGrid,
  List,
  Plug,
  Radio,
  SlidersHorizontal,
  ShoppingCart,
  Star,
  Tv,
  Volume2,
  X,
} from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useProductStore } from '../../store/productStore'
import { useAdminStore } from '../../store/adminStore'
import { useCartStore } from '../../store/cartStore'
import { useUserStore } from '../../store/userStore'
import { formatNaira } from '../../utils/pricing'

const sortOptions = [
  { value: 'popular', label: 'Popularity' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

// Fallback subcategories if category has none defined
const subCategoryMap: Record<string, { id: string; label: string; icon: any }[]> = {
  electronics: [
    { id: 'all', label: 'All Electronics', icon: LayoutGrid },
    { id: 'tvs', label: 'TVs', icon: Tv },
    { id: 'audio', label: 'Audio & Sound', icon: Volume2 },
    { id: 'speakers', label: 'Speakers', icon: Radio },
    { id: 'accessories', label: 'Accessories', icon: Plug },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  ],
  kitchen: [
    { id: 'all', label: 'All Kitchen', icon: LayoutGrid },
    { id: 'cookware', label: 'Cookware', icon: Plug },
    { id: 'airfryers', label: 'Air Fryers', icon: Volume2 },
    { id: 'blenders', label: 'Blenders', icon: Radio },
  ],
  appliances: [
    { id: 'all', label: 'All Appliances', icon: LayoutGrid },
    { id: 'microwaves', label: 'Microwaves', icon: Tv },
    { id: 'refrigerators', label: 'Refrigerators', icon: Volume2 },
    { id: 'fans', label: 'Fans & Cooling', icon: Radio },
  ],
  phones: [
    { id: 'all', label: 'All Phones', icon: LayoutGrid },
    { id: 'smartphones', label: 'Smartphones', icon: Tv },
    { id: 'powerbanks', label: 'Power Banks', icon: Plug },
  ],
  default: [
    { id: 'all', label: 'All Items', icon: LayoutGrid },
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'deals', label: 'Special Deals', icon: Volume2 },
  ],
}

// Category hero imagery
const categoryImages: Record<string, string> = {
  electronics:
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1000&q=80',
  kitchen:
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80',
  appliances:
    'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=1000&q=80',
  phones:
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
  'home-essentials':
    'https://images.unsplash.com/photo-1556741533-411cf82e4e2d?auto=format&fit=crop&w=1000&q=80',
  outdoor:
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80',
  wines:
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80',
  clothing:
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=80',
  default:
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1000&q=80',
}

export function CatalogPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const { products, categories } = useProductStore()
  const { settings } = useAdminStore()
  const addItem = useCartStore((s) => s.addItem)
  const { isInWishlist, toggleWishlist: toggleWishlistStore } = useUserStore()

  const [sort, setSort] = useState('popular')
  const [sortOpen, setSortOpen] = useState(false)
  const [activeSubCategory, setActiveSubCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [minRating, setMinRating] = useState<number | null>(null)
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(2000000)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Track expanded categories in the left sidebar tree
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([])

  // Automatically expand active category when URL changes
  useEffect(() => {
    if (categoryId && !expandedCategoryIds.includes(categoryId)) {
      setExpandedCategoryIds((prev) => [...prev, categoryId])
    }
  }, [categoryId])

  const toggleCategoryExpand = (catId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    )
  }

  // Find dynamic active category metadata from store
  const activeCategory = useMemo(() => {
    if (!categoryId || categoryId === 'all') {
      return {
        id: 'all',
        label: 'All Products',
        merchandisingLine:
          "Explore Noma's full catalog of tested gadgets, kitchen appliances, and home essentials.",
      }
    }
    const cleanKey = (categoryId || '').toLowerCase()
    return (
      categories.find(
        (c) => c?.id?.toLowerCase() === cleanKey || c?.label?.toLowerCase() === cleanKey
      ) || {
        id: categoryId,
        label: categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('-', ' ') : 'All Products',
        merchandisingLine: 'Quality items curated with receipt-ready support.',
      }
    )
  }, [categoryId, categories])

  const currentHeroImage = useMemo(() => {
    if ((!categoryId || categoryId === 'all') && settings.allProductsBannerImage) {
      return settings.allProductsBannerImage
    }
    const adminSetCategory = categories.find(
      (c) => c?.id?.toLowerCase() === activeCategory?.id?.toLowerCase()
    )
    if (adminSetCategory?.image) {
      return adminSetCategory.image
    }
    return (activeCategory as any)?.image || categoryImages[activeCategory.id] || categoryImages.default
  }, [activeCategory, categoryId, categories, settings.allProductsBannerImage])

  // Get active category subcategories for the horizontal overflow strip
  const activeCategorySubcategories = useMemo(() => {
    const adminCat = categories.find(
      (c) => c?.id?.toLowerCase() === activeCategory?.id?.toLowerCase() || c?.label?.toLowerCase() === activeCategory?.label?.toLowerCase()
    )
    if (adminCat?.subcategories && adminCat.subcategories.length > 0) {
      return adminCat.subcategories
    }
    return subCategoryMap[activeCategory.id] || []
  }, [activeCategory, categories])

  // Dynamic filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (categoryId && categoryId !== 'all') {
        const matchesCat =
          p.category === categoryId ||
          (categoryId === 'kitchen' && p.category === 'cooking') ||
          (categoryId === 'cooking' && p.category === 'kitchen') ||
          (categoryId === 'home-essentials' && p.category === 'general') ||
          (categoryId === 'outdoor' && p.category === 'bicycles')
        if (!matchesCat) return false
      }

      // Subcategory filter
      if (activeSubCategory && activeSubCategory !== 'all') {
        const cleanSub = activeSubCategory.toLowerCase()
        const matchesSub =
          p.subCategory?.toLowerCase() === cleanSub ||
          p.subcategory?.toLowerCase() === cleanSub ||
          (p.specs && p.specs.some((spec) => spec.toLowerCase().includes(cleanSub))) ||
          p.name.toLowerCase().includes(cleanSub)
        if (!matchesSub) return false
      }

      // Stock filter
      if (inStockOnly && p.stockQty <= 0) return false

      // Rating filter
      if (minRating !== null && p.rating < minRating) return false

      // Price filter
      if (p.finalPrice > maxPriceFilter) return false

      return true
    })
  }, [categoryId, activeSubCategory, inStockOnly, minRating, maxPriceFilter, products])

  // Sorted product list
  const sortedProducts = useMemo(() => {
    let result = [...filteredProducts]
    if (sort === 'price-asc') result.sort((a, b) => a.finalPrice - b.finalPrice)
    if (sort === 'price-desc') result.sort((a, b) => b.finalPrice - a.finalPrice)
    if (sort === 'newest') result.reverse()
    return result
  }, [filteredProducts, sort])

  const activeSort = sortOptions.find((s) => s.value === sort)

  const resetAllFilters = () => {
    setInStockOnly(false)
    setMinRating(null)
    setMaxPriceFilter(2000000)
    setActiveSubCategory('all')
  }

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const currentlyIn = isInWishlist(id)
    toggleWishlistStore(id)
    toast.success(!currentlyIn ? 'Saved to wishlist' : 'Removed from wishlist')
  }

  const activeFilterCount =
    (inStockOnly ? 1 : 0) +
    (minRating !== null ? 1 : 0) +
    (maxPriceFilter < 2000000 ? 1 : 0) +
    (activeSubCategory !== 'all' ? 1 : 0)

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-['Outfit',sans-serif] text-[#12203D] selection:bg-[#2F5FE3] selection:text-white pb-20 pt-2 md:pt-4">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-2 md:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-gray-500">
          <Link to="/" className="flex items-center gap-1 hover:text-[#2F5FE3]">
            <Home size={13} /> Home
          </Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="font-semibold text-[#12203D]">{activeCategory.label}</span>
          {activeSubCategory !== 'all' && (
            <>
              <ChevronRight size={12} className="text-gray-400" />
              <span className="font-bold text-[#2F5FE3]">{activeSubCategory}</span>
            </>
          )}
        </nav>

        {/* Clean Hero Banner Section */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-white p-6 md:p-8 shadow-xs border border-gray-100">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
            {/* Title & Description */}
            <div className="md:col-span-7 lg:col-span-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#12203D] sm:text-4xl md:text-5xl">
                {activeCategory.label}
              </h1>
              <p className="mt-3 max-w-xl text-sm font-normal leading-relaxed text-gray-600 md:text-base">
                {activeCategory.merchandisingLine}
              </p>
            </div>

            {/* Banner Image Showcase Right */}
            <div className="relative flex items-center justify-center md:col-span-5 lg:col-span-4">
              <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-50 md:h-52">
                <img
                  src={currentHeroImage}
                  alt={activeCategory.label}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter & Sort Bar */}
        <div className="mb-6 flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-[#12203D] shadow-xs active:bg-gray-50"
          >
            <Filter size={15} />
            <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </button>
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-[#12203D] shadow-xs active:bg-gray-50"
          >
            <SlidersHorizontal size={15} />
            <span>Sort: {activeSort?.label}</span>
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col gap-8 md:flex-row min-w-0 w-full overflow-x-hidden">
          {/* Desktop Left Filter Sidebar with Glitch-Free Expandable Category Tree */}
          <aside className="hidden w-64 shrink-0 md:block">
            <div className="sticky top-24 flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-[#12203D]">Filters</h3>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-[#2F5FE3] hover:underline"
                >
                  Clear all
                </button>
              </div>

              {/* Dynamic Expandable Category & Subcategory Tree */}
              <div className="border-b border-gray-100 pb-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#12203D] uppercase tracking-wider">
                    Categories
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/catalog')
                      setActiveSubCategory('all')
                    }}
                    className={`flex items-center justify-between text-left text-xs font-bold rounded-lg px-2.5 py-2 transition-colors ${
                      !categoryId || categoryId === 'all'
                        ? 'bg-blue-50/80 text-[#2F5FE3]'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-gray-400 font-normal">{products.length}</span>
                  </button>

                  {categories.map((cat) => {
                    const isSelected = categoryId === cat.id
                    const isExpanded = expandedCategoryIds.includes(cat.id)
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
                        <div className="flex items-center justify-between text-left text-xs rounded-lg px-2 py-1.5 transition-colors group hover:bg-gray-50">
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            {hasSubs ? (
                              <button
                                type="button"
                                onClick={(e) => toggleCategoryExpand(cat.id, e)}
                                className="p-1 text-gray-400 hover:text-[#2F5FE3] rounded-md hover:bg-blue-50 transition-colors shrink-0"
                                aria-label={isExpanded ? "Collapse category" : "Expand category"}
                              >
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                            ) : (
                              <span className="w-4 shrink-0" />
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                navigate(`/category/${cat.id}`)
                                setActiveSubCategory('all')
                              }}
                              className={`text-left truncate font-semibold transition-colors flex-1 ${
                                isSelected
                                  ? 'font-extrabold text-[#2F5FE3]'
                                  : 'text-gray-700 group-hover:text-[#12203D]'
                              }`}
                            >
                              {cat.label}
                            </button>
                          </div>
                          <span className="text-gray-400 text-[11px] font-normal shrink-0 ml-1">{catCount}</span>
                        </div>

                        {/* Collapsible Nested Subcategories List */}
                        {hasSubs && isExpanded && (
                          <div className="ml-5 pl-2.5 border-l-2 border-blue-100 flex flex-col gap-1 my-1">
                            <button
                              type="button"
                              onClick={() => setActiveSubCategory('all')}
                              className={`text-left text-[11px] py-1 px-2 rounded-md transition-colors ${
                                isSelected && activeSubCategory === 'all'
                                  ? 'font-bold text-[#2F5FE3] bg-blue-50/70'
                                  : 'text-gray-500 hover:text-[#12203D] hover:bg-gray-50'
                              }`}
                            >
                              All {cat.label}
                            </button>
                            {catSubs.map((sub) => {
                              const isSubActive = activeSubCategory === sub.id || activeSubCategory === sub.label
                              return (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onClick={() => {
                                    if (!isSelected) {
                                      navigate(`/category/${cat.id}`)
                                    }
                                    setActiveSubCategory(sub.id)
                                  }}
                                  className={`text-left text-[11px] py-1 px-2 rounded-md transition-colors flex items-center justify-between ${
                                    isSubActive
                                      ? 'font-bold text-[#2F5FE3] bg-blue-50'
                                      : 'text-gray-600 hover:text-[#12203D] hover:bg-gray-50'
                                  }`}
                                >
                                  <span className="truncate">{sub.label}</span>
                                  {sub.ageGroup && (
                                    <span className="text-[9px] font-medium text-gray-400 bg-gray-100 px-1 rounded">
                                      {sub.ageGroup}
                                    </span>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Interactive Price Range */}
              <div className="border-b border-gray-100 pb-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#12203D] uppercase tracking-wider">
                    Price Range
                  </span>
                </div>
                <p className="mb-3 text-xs font-bold text-[#2F5FE3]">
                  Up to {formatNaira(maxPriceFilter)}
                </p>
                <input
                  type="range"
                  min="10000"
                  max="2000000"
                  step="10000"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="w-full accent-[#2F5FE3]"
                />
              </div>

              {/* In Stock Only Checkbox */}
              <div className="border-b border-gray-100 pb-4">
                <label className="flex cursor-pointer items-center justify-between text-xs font-medium text-gray-700">
                  <span>In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#2F5FE3] focus:ring-[#2F5FE3]"
                  />
                </label>
              </div>

              {/* Star Rating Filter */}
              <div>
                <span className="mb-3 block text-xs font-bold text-[#12203D] uppercase tracking-wider">
                  Rating
                </span>
                <div className="flex flex-col gap-2">
                  {[5, 4, 3].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setMinRating(minRating === stars ? null : stars)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                        minRating === stars
                          ? 'bg-amber-50 font-bold text-amber-900 border border-amber-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            size={13}
                            className={
                              idx < stars ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                            }
                          />
                        ))}
                        <span className="ml-1">& Up</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Product Grid Display */}
          <main className="flex-1 min-w-0 w-full">
            {/* Header & Controls Bar with Horizontal Subcategories Overflow Strip */}
            <div className="mb-6 flex flex-col gap-3 border-b border-gray-200/60 pb-4 min-w-0 w-full overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 min-w-0 w-full">
                {/* Horizontal Scrollable Subcategories Overflow Strip (Scrollbars Hidden) */}
                <div className="flex items-center gap-2 min-w-0 flex-1 w-full overflow-x-auto pb-1 pt-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <button
                    type="button"
                    onClick={() => setActiveSubCategory('all')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all shrink-0 ${
                      activeSubCategory === 'all'
                        ? 'bg-[#2F5FE3] text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    All {activeCategory.label}
                  </button>

                  {activeCategorySubcategories.map((sub: any) => {
                    const subId = typeof sub === 'string' ? sub : sub.id
                    const subLabel = typeof sub === 'string' ? sub : sub.label
                    const isSubActive = activeSubCategory === subId || activeSubCategory === subLabel

                    return (
                      <button
                        key={subId}
                        type="button"
                        onClick={() => setActiveSubCategory(subId)}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all shrink-0 ${
                          isSubActive
                            ? 'bg-[#2F5FE3] text-white shadow-xs'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {subLabel}
                      </button>
                    )
                  })}
                </div>

                {/* Right: Items Count, Sort Dropdown & Grid Mode Toggle */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-xs text-gray-500 font-semibold shrink-0">
                    {sortedProducts.length} items found
                  </span>

                  {/* Sort Dropdown */}
                  <div className="relative hidden md:block">
                    <button
                      type="button"
                      onClick={() => setSortOpen(!sortOpen)}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-[#12203D] shadow-2xs hover:bg-gray-50"
                    >
                      <span>Sort: <strong className="text-[#2F5FE3]">{activeSort?.label}</strong></span>
                      <ChevronDown size={14} className="text-gray-400" />
                    </button>

                    {sortOpen && (
                      <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setSort(opt.value)
                              setSortOpen(false)
                            }}
                            className={`w-full px-4 py-2.5 text-left text-xs font-semibold transition-colors ${
                              sort === opt.value
                                ? 'bg-blue-50 text-[#2F5FE3]'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Grid / List Mode Selector */}
                  <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`rounded-lg p-1.5 transition-colors ${
                        viewMode === 'grid' ? 'bg-[#2F5FE3] text-white' : 'text-gray-400 hover:text-gray-600'
                      }`}
                      aria-label="Grid view"
                    >
                      <LayoutGrid size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`rounded-lg p-1.5 transition-colors ${
                        viewMode === 'list' ? 'bg-[#2F5FE3] text-white' : 'text-gray-400 hover:text-gray-600'
                      }`}
                      aria-label="List view"
                    >
                      <List size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid / List Showcase */}
            {sortedProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center flex flex-col items-center justify-center gap-3">
                <h3 className="text-base font-bold text-[#12203D]">No products match selected filters</h3>
                <p className="text-xs text-gray-500 max-w-sm">
                  Try adjusting your rating, subcategory, or price filters to explore more items.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="mt-2 rounded-xl bg-[#2F5FE3] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#254ec4]"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 md:gap-6'
                    : 'flex flex-col gap-4'
                }
              >
                {sortedProducts.map((prod) => {
                  const inWish = isInWishlist(prod.id)

                  return (
                    <div
                      key={prod.id}
                      className={`group relative flex overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-lg ${
                        viewMode === 'grid' ? 'flex-col justify-between p-4' : 'flex-row items-center gap-6 p-4'
                      }`}
                    >
                      {/* Product Image */}
                      <Link
                        to={`/product/${prod.slug || prod.id}`}
                        className={`relative overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center ${
                          viewMode === 'grid' ? 'h-48 w-full mb-3' : 'h-36 w-36 shrink-0'
                        }`}
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Badges */}
                        {prod.badge && (
                          <span className="absolute top-2 left-2 rounded-full bg-[#12203D] px-2.5 py-0.5 text-[9px] font-bold text-white">
                            {prod.badge}
                          </span>
                        )}
                        {prod.discountBadge && (
                          <span className="absolute top-2 right-2 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-bold text-white">
                            {prod.discountBadge}
                          </span>
                        )}

                        {/* Wishlist Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleWishlist(prod.id, e)}
                          className={`absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-transform active:scale-90 ${
                            inWish ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                          }`}
                          aria-label="Wishlist"
                        >
                          <Heart size={15} className={inWish ? 'fill-red-500' : ''} />
                        </button>
                      </Link>

                      {/* Product Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {prod.brand || 'Noma'}
                          </span>
                          <Link to={`/product/${prod.slug || prod.id}`}>
                            <h3 className="mt-0.5 text-xs font-bold text-[#12203D] line-clamp-2 hover:text-[#2F5FE3] transition-colors md:text-sm">
                              {prod.name}
                            </h3>
                          </Link>

                          {/* Rating & Stock */}
                          <div className="mt-2 flex items-center gap-2 text-[11px]">
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star size={12} className="fill-amber-400" />
                              <span>{prod.rating || 4.8}</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500">({prod.reviewsCount || 12})</span>
                          </div>
                        </div>

                        {/* Pricing Row */}
                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="text-sm font-extrabold text-[#12203D] md:text-base">
                            {formatNaira(prod.finalPrice)}
                          </span>
                          {prod.basePrice > prod.finalPrice && (
                            <span className="text-xs text-gray-400 line-through font-medium">
                              {formatNaira(prod.basePrice)}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          type="button"
                          onClick={() => {
                            addItem(prod.id)
                            toast.success('Added to cart', { description: prod.name })
                          }}
                          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#2F5FE3] bg-white py-2 text-xs font-bold text-[#2F5FE3] transition-colors hover:bg-[#2F5FE3] hover:text-white active:scale-[0.98] sm:bg-[#2F5FE3] sm:text-white sm:hover:bg-[#254ec4]"
                        >
                          <ShoppingCart size={14} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pagination Controls */}
            <div className="mt-10 flex items-center justify-center gap-2">
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2F5FE3] text-xs font-bold text-white shadow-xs">
                1
              </button>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50">
                3
              </button>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Unified Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="relative mr-auto flex h-full w-[85%] max-w-xs flex-col bg-white p-5 shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-[#12203D]">Filter Products</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              {/* Category Tree selection */}
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-gray-400 tracking-wider">Categories</h4>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/catalog')
                      setActiveSubCategory('all')
                      setMobileFilterOpen(false)
                    }}
                    className={`text-left text-xs py-2 px-3 rounded-lg font-bold ${
                      !categoryId || categoryId === 'all'
                        ? 'bg-blue-50 text-[#2F5FE3]'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => {
                    const isSelected = categoryId === cat.id
                    const catSubs = cat.subcategories || []
                    const hasSubs = catSubs.length > 0
                    const isExpanded = expandedCategoryIds.includes(cat.id)

                    return (
                      <div key={cat.id} className="flex flex-col">
                        <div className="flex items-center justify-between text-left text-xs py-2 px-3 rounded-lg">
                          <button
                            type="button"
                            onClick={() => {
                              navigate(`/category/${cat.id}`)
                              setActiveSubCategory('all')
                              setMobileFilterOpen(false)
                            }}
                            className={`text-left font-semibold flex-1 ${
                              isSelected ? 'font-bold text-[#2F5FE3]' : 'text-gray-700'
                            }`}
                          >
                            {cat.label}
                          </button>
                          {hasSubs && (
                            <button
                              type="button"
                              onClick={(e) => toggleCategoryExpand(cat.id, e)}
                              className="p-1 text-gray-400 shrink-0 ml-1"
                            >
                              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                          )}
                        </div>

                        {/* Mobile Subcategories Dropdown */}
                        {hasSubs && isExpanded && (
                          <div className="ml-4 pl-2 border-l-2 border-blue-100 flex flex-col gap-1 my-1">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSubCategory('all')
                                setMobileFilterOpen(false)
                              }}
                              className={`text-left text-[11px] py-1 px-2 rounded-md ${
                                isSelected && activeSubCategory === 'all'
                                  ? 'font-bold text-[#2F5FE3] bg-blue-50'
                                  : 'text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              All {cat.label}
                            </button>
                            {catSubs.map((sub) => (
                              <button
                                type="button"
                                key={sub.id}
                                onClick={() => {
                                  if (!isSelected) {
                                    navigate(`/category/${cat.id}`)
                                  }
                                  setActiveSubCategory(sub.id)
                                  setMobileFilterOpen(false)
                                }}
                                className={`text-left text-[11px] py-1 px-2 rounded-md ${
                                  activeSubCategory === sub.id || activeSubCategory === sub.label
                                    ? 'font-bold text-[#2F5FE3] bg-blue-50'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                {sub.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-gray-400 tracking-wider">Price Range</h4>
                <p className="mb-2 text-xs font-bold text-[#2F5FE3]">
                  Up to {formatNaira(maxPriceFilter)}
                </p>
                <input
                  type="range"
                  min="10000"
                  max="2000000"
                  step="10000"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="w-full accent-[#2F5FE3]"
                />
              </div>

              {/* Availability */}
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-gray-400 tracking-wider">Availability</h4>
                <label className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#2F5FE3]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Minimum Rating */}
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-gray-400 tracking-wider">Rating</h4>
                <div className="flex flex-col gap-2">
                  {[5, 4, 3].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setMinRating(minRating === stars ? null : stars)}
                      className={`flex items-center gap-2 text-xs p-2 rounded-lg ${
                        minRating === stars ? 'bg-amber-50 font-bold text-amber-900' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            size={12}
                            className={
                              idx < stars ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                            }
                          />
                        ))}
                        <span className="ml-1">& Up</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
