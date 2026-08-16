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
import { useMemo, useState } from 'react'
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

// Dynamic subcategories per category
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

  // Find dynamic active category metadata from admin store
  const activeCategory = useMemo(() => {
    if (!categoryId || categoryId === 'all') {
      return {
        id: 'all',
        label: 'All Products',
        merchandisingLine:
          "Explore Noma's full catalog of tested gadgets, kitchen appliances, and home essentials.",
      }
    }
    const cleanKey = categoryId.toLowerCase()
    return (
      categories.find(
        (c) => c.id.toLowerCase() === cleanKey || c.label.toLowerCase() === cleanKey
      ) || {
        id: categoryId,
        label: categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('-', ' '),
        merchandisingLine: 'Quality items curated with receipt-ready support.',
      }
    )
  }, [categoryId, categories])

  // Get active subcategories & hero image (Strictly uses admin set category image)
  const currentSubCategories = subCategoryMap[activeCategory.id] || subCategoryMap.default
  const currentHeroImage = useMemo(() => {
    if ((!categoryId || categoryId === 'all') && settings.allProductsBannerImage) {
      return settings.allProductsBannerImage
    }
    const adminSetCategory = categories.find(
      (c) => c.id.toLowerCase() === activeCategory.id.toLowerCase()
    )
    if (adminSetCategory?.image) {
      return adminSetCategory.image
    }
    return (activeCategory as any)?.image || categoryImages[activeCategory.id] || categoryImages.default
  }, [activeCategory, categoryId, categories, settings.allProductsBannerImage])

  // Dynamic filtering logic (Brand filter removed as requested)
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

      // Stock filter
      if (inStockOnly && p.stockQty <= 0) return false

      // Rating filter
      if (minRating !== null && p.rating < minRating) return false

      // Price filter
      if (p.finalPrice > maxPriceFilter) return false

      return true
    })
  }, [categoryId, inStockOnly, minRating, maxPriceFilter])

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

  const activeFilterCount = (inStockOnly ? 1 : 0) + (minRating !== null ? 1 : 0) + (maxPriceFilter < 2000000 ? 1 : 0)

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
        </nav>

        {/* Dynamic Hero Banner Section */}
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

              {/* Dynamic Sub-category Filter Pills */}
              <div className="mt-6 flex flex-wrap items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {currentSubCategories.map((sub) => {
                  const Icon = sub.icon
                  const isActive = activeSubCategory === sub.id
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubCategory(sub.id)}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-[#2F5FE3] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80 border border-gray-200/60'
                      }`}
                    >
                      <Icon size={14} strokeWidth={2.2} />
                      <span>{sub.label}</span>
                    </button>
                  )
                })}
              </div>
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
            onClick={() => setMobileFilterOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-[#12203D] shadow-xs active:bg-gray-50"
          >
            <Filter size={15} />
            <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </button>
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-[#12203D] shadow-xs active:bg-gray-50"
          >
            <SlidersHorizontal size={15} />
            <span>Sort: {activeSort?.label}</span>
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden w-64 shrink-0 md:block">
            <div className="sticky top-24 flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-[#12203D]">Filters</h3>
                <button
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-[#2F5FE3] hover:underline"
                >
                  Clear all
                </button>
              </div>

              {/* Dynamic Interactive Category List */}
              <div className="border-b border-gray-100 pb-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#12203D] uppercase tracking-wider">
                    Categories
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => navigate('/catalog')}
                    className={`flex items-center justify-between text-left text-xs font-bold rounded-lg px-2 py-1.5 transition-colors ${
                      !categoryId || categoryId === 'all'
                        ? 'bg-blue-50/70 text-[#2F5FE3]'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-gray-400 font-normal">{products.length}</span>
                  </button>
                  {categories.map((cat) => {
                    const isSelected = categoryId === cat.id
                    const catCount = products.filter(
                      (p) =>
                        p.category === cat.id ||
                        (cat.id === 'kitchen' && p.category === 'cooking') ||
                        (cat.id === 'home-essentials' && p.category === 'general') ||
                        (cat.id === 'outdoor' && p.category === 'bicycles')
                    ).length

                    return (
                      <button
                        key={cat.id}
                        onClick={() => navigate(`/category/${cat.id}`)}
                        className={`flex items-center justify-between text-left text-xs rounded-lg px-2 py-1.5 transition-colors ${
                          isSelected
                            ? 'bg-blue-50/80 font-bold text-[#2F5FE3]'
                            : 'text-gray-600 font-medium hover:bg-gray-50 hover:text-[#12203D]'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className="text-gray-400">{catCount}</span>
                      </button>
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
                  max="1500000"
                  step="10000"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="w-full accent-[#2F5FE3] cursor-pointer"
                />
                <div className="mt-1 flex justify-between text-[10px] text-gray-400 font-semibold">
                  <span>₦10,000</span>
                  <span>₦1,500,000+</span>
                </div>
              </div>

              {/* Interactive Availability */}
              <div className="border-b border-gray-100 pb-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#12203D] uppercase tracking-wider">
                    Availability
                  </span>
                </div>
                <label className="flex items-center justify-between cursor-pointer text-xs font-medium text-gray-700">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#2F5FE3] focus:ring-[#2F5FE3]"
                    />
                    <span>In Stock Only</span>
                  </div>
                </label>
              </div>

              {/* Interactive Customer Rating */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#12203D] uppercase tracking-wider">
                    Minimum Rating
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {[5, 4, 3].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => setMinRating(minRating === stars ? null : stars)}
                      className={`flex items-center justify-between rounded-lg p-1.5 text-xs text-left transition-colors ${
                        minRating === stars
                          ? 'bg-amber-50 font-bold text-amber-900 border border-amber-200'
                          : 'text-gray-700 hover:bg-gray-50'
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
                        <span className="ml-1 font-medium">{stars} Stars & Up</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Product Section */}
          <main className="flex-1">
            {/* Top Toolbar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#12203D]">{activeCategory.label}</h2>
                <p className="text-xs font-medium text-gray-500">{sortedProducts.length} items found</p>
              </div>

              {/* Sort Dropdown & View Mode Switcher */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="relative">
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-[#12203D] shadow-xs hover:border-gray-300"
                  >
                    <span className="text-gray-500 font-medium">Sort by:</span>
                    <span>{activeSort?.label}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSort(opt.value)
                            setSortOpen(false)
                          }}
                          className={`w-full px-4 py-2.5 text-left text-xs font-medium transition-colors hover:bg-gray-50 ${
                            sort === opt.value
                              ? 'bg-blue-50/70 font-bold text-[#2F5FE3]'
                              : 'text-gray-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* View Switchers */}
                <div className="flex items-center rounded-xl border border-gray-200 bg-white p-0.5 shadow-xs">
                  <button
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                    className={`rounded-lg p-1.5 transition-colors ${
                      viewMode === 'grid' ? 'bg-[#2F5FE3] text-white' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                    className={`rounded-lg p-1.5 transition-colors ${
                      viewMode === 'list' ? 'bg-[#2F5FE3] text-white' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Cards Grid */}
            {sortedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center">
                <p className="text-lg font-bold text-[#12203D]">No products match selected filters</p>
                <p className="mt-1 text-xs text-gray-500">Try adjusting your rating or price filters.</p>
                <button
                  onClick={resetAllFilters}
                  className="mt-4 rounded-xl bg-[#2F5FE3] px-5 py-2.5 text-xs font-bold text-white shadow-xs"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-5'
                    : 'flex flex-col gap-4'
                }
              >
                {sortedProducts.map((prod) => {
                  const isWish = isInWishlist(prod.id)
                  return (
                    <div
                      key={prod.id}
                      className={`group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-3.5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative ${
                        viewMode === 'list' ? 'sm:flex-row sm:items-center' : ''
                      }`}
                    >
                      {/* Top Badges & Wishlist */}
                      <div className="mb-2 flex items-center justify-between sm:w-full">
                        {prod.discountBadge ? (
                          <span className="rounded-md bg-[#E53E3E] px-2 py-0.5 text-[11px] font-black uppercase text-white shadow-2xs">
                            {prod.discountBadge}
                          </span>
                        ) : (
                          <span />
                        )}
                        <button
                          onClick={(e) => toggleWishlist(prod.id, e)}
                          aria-label="Wishlist"
                          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-colors"
                        >
                          <Heart
                            size={18}
                            className={isWish ? 'fill-red-500 text-red-500' : ''}
                          />
                        </button>
                      </div>

                      {/* Image */}
                      <Link
                        to={`/product/${prod.slug}`}
                        className={`relative mb-3 flex items-center justify-center overflow-hidden rounded-xl bg-white p-2 ${
                          viewMode === 'grid' ? 'h-36 sm:h-44 w-full' : 'h-32 w-32 shrink-0'
                        }`}
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>

                      {/* Content Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link to={`/product/${prod.slug}`}>
                            <h3 className="line-clamp-2 text-xs font-bold text-[#12203D] group-hover:text-[#2F5FE3] sm:text-sm leading-snug">
                              {prod.name}
                            </h3>
                          </Link>

                          {/* Rating */}
                          <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-gray-500">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <span className="font-bold text-[#12203D]">{prod.rating}</span>
                            <span>({prod.reviewsCount ?? 124})</span>
                          </div>

                          {/* Price */}
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-sm font-extrabold text-[#12203D] sm:text-base">
                              {formatNaira(prod.finalPrice)}
                            </span>
                            {prod.basePrice > prod.finalPrice && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatNaira(prod.basePrice)}
                              </span>
                            )}
                          </div>

                          {/* In stock tag */}
                          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span>In stock</span>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
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
              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2F5FE3] text-xs font-bold text-white shadow-xs">
                1
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50">
                3
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Unified Mobile Filter Drawer (Opens from LEFT matching main menu drawer) */}
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
                onClick={() => setMobileFilterOpen(false)}
                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              {/* Category selection */}
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-gray-400 tracking-wider">Categories</h4>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      navigate('/catalog')
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
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        navigate(`/category/${cat.id}`)
                        setMobileFilterOpen(false)
                      }}
                      className={`text-left text-xs py-2 px-3 rounded-lg ${
                        categoryId === cat.id
                          ? 'bg-blue-50 font-bold text-[#2F5FE3]'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
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
                  max="1500000"
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
                      </div>
                      <span>{stars} Stars & Up</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t pt-4">
              <button
                onClick={() => {
                  resetAllFilters()
                  setMobileFilterOpen(false)
                }}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 rounded-xl bg-[#2F5FE3] py-2.5 text-xs font-bold text-white shadow-xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
