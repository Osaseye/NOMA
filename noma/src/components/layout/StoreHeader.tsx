// StoreHeader.tsx
import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  HiOutlineSquares2X2,
  HiOutlineClock,
  HiOutlineShoppingBag,
  HiOutlineMagnifyingGlass,
  HiChevronRight,
  HiOutlineHome,
  HiOutlinePhone,
  HiOutlineHeart,
  HiOutlineUser,
  HiXMark,
  HiTag,
  HiStar,
} from 'react-icons/hi2'
import { FiMenu, FiX } from 'react-icons/fi'
import { ImagePlaceholder } from '../ui/ImagePlaceholder'
import { useCartStore } from '../../store/cartStore'
import { useProductStore } from '../../store/productStore'
import { formatNaira } from '../../utils/pricing'

export function StoreHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { products, categories } = useProductStore()
  const count = Object.values(useCartStore((state) => state.items)).reduce(
    (sum, quantity) => sum + quantity,
    0,
  )
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Character-by-character search state
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Character-by-character live matching
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return { products: [], categories: [] }

    const matchedProducts = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      )
      .slice(0, 5)

    const matchedCategories = categories
      .filter(
        (c) => c.label.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
      )
      .slice(0, 3)

    return { products: matchedProducts, categories: matchedCategories }
  }, [searchQuery, products, categories])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile drawer and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setIsDropdownOpen(false)
  }, [location.pathname])

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsDropdownOpen(false)
    }
  }

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-white border-b border-gray-100/70 shadow-2xs">
      {/* Main Navigation Container */}
      <div className="max-w-7xl mx-auto px-4 py-3 md:px-8 md:py-4">
        {/* Desktop & Mobile Main Row */}
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Mobile Left: Hamburger Menu Button */}
          <button
            className="p-1.5 text-[#12203D] hover:bg-gray-100 rounded-xl transition-transform active:scale-95 focus:outline-none md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <FiX className="text-2xl font-light stroke-[1.5]" />
            ) : (
              <FiMenu className="text-2xl font-light stroke-[1.5]" />
            )}
          </button>

          {/* Noma Official Logo */}
          <Link to="/" className="flex shrink-0 items-center">
            <img
              src="/logo.PNG"
              alt="Noma - Everything You Need"
              className="h-8 md:h-11 w-auto object-contain transition-transform hover:scale-102"
            />
          </Link>

          {/* Desktop Center: Live Character-by-Character Search Bar */}
          <div className="hidden flex-1 max-w-2xl mx-auto md:block relative" ref={searchContainerRef}>
            <form role="search" onSubmit={handleSearchSubmit} className="relative w-full">
              <HiOutlineMagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none stroke-[1.8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsDropdownOpen(true)
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Search for products, brands, categories..."
                className="w-full rounded-full bg-white pl-12 pr-10 py-3 text-[14px] font-medium text-[#12203D] placeholder:text-gray-400/80 outline-none shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 focus:border-[#2F5FE3] focus:ring-4 focus:ring-[#2F5FE3]/10 transition-all"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setIsDropdownOpen(false)
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <HiXMark size={16} />
                </button>
              )}
            </form>

            {/* Instant Character-by-Character Live Search Results Dropdown */}
            {isDropdownOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in duration-150">
                <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <span>Live Search Results for "{searchQuery}"</span>
                  <span>{searchResults.products.length} Products</span>
                </div>

                {searchResults.categories.length > 0 && (
                  <div className="p-3 border-b border-gray-100 bg-blue-50/30">
                    <span className="text-[10px] font-extrabold uppercase text-[#2F5FE3] tracking-wider block mb-2">
                      Matching Categories
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {searchResults.categories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/category/${cat.id}`}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-1.5 rounded-xl bg-white border border-blue-100 px-3 py-1.5 text-xs font-bold text-[#12203D] hover:bg-[#2F5FE3] hover:text-white transition-colors"
                        >
                          <HiTag size={12} className="text-[#2F5FE3]" />
                          <span>{cat.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.products.length > 0 ? (
                  <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto">
                    {searchResults.products.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug || product.id}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3.5 p-3 hover:bg-blue-50/50 transition-colors group"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-xl object-contain bg-gray-50 p-1 border border-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#12203D] group-hover:text-[#2F5FE3] truncate transition-colors">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-500 font-medium">
                            <span className="font-extrabold text-[#12203D]">
                              {formatNaira(product.finalPrice)}
                            </span>
                            <span>•</span>
                            <span className="capitalize">{product.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                              <HiStar size={10} className="text-amber-400" />
                              {product.rating || 4.8}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-[#2F5FE3] group-hover:translate-x-0.5 transition-transform shrink-0">
                          View →
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-gray-500 font-medium">
                    No products found matching "<span className="font-bold text-[#12203D]">{searchQuery}</span>".
                  </div>
                )}

                <button
                  onClick={handleSearchSubmit}
                  className="w-full py-3 bg-[#12203D] text-white text-xs font-extrabold tracking-wider hover:bg-[#2F5FE3] transition-colors text-center block"
                >
                  View All Search Results →
                </button>
              </div>
            )}
          </div>

          {/* Desktop Right: Refined Navigation Icons */}
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            <Link
              to="/catalog"
              className="flex flex-col items-center gap-1 text-[11px] font-medium text-gray-700 hover:text-[#2F5FE3] transition-colors group"
            >
              <HiOutlineSquares2X2 className="text-2xl text-gray-700 group-hover:text-[#2F5FE3] stroke-[1.5] transition-colors" />
              <span>Categories</span>
            </Link>

            <Link
              to="/orders"
              className="flex flex-col items-center gap-1 text-[11px] font-medium text-gray-700 hover:text-[#2F5FE3] transition-colors group"
            >
              <HiOutlineClock className="text-2xl text-gray-700 group-hover:text-[#2F5FE3] stroke-[1.5] transition-colors" />
              <span>Track Order</span>
            </Link>

            <Link
              to="/wishlist"
              className="flex flex-col items-center gap-1 text-[11px] font-medium text-gray-700 hover:text-[#2F5FE3] transition-colors group"
            >
              <HiOutlineHeart className="text-2xl text-gray-700 group-hover:text-[#2F5FE3] stroke-[1.5] transition-colors" />
              <span>Wishlist</span>
            </Link>

            <Link
              to="/account"
              className="flex flex-col items-center gap-1 text-[11px] font-medium text-gray-700 hover:text-[#2F5FE3] transition-colors group"
            >
              <HiOutlineUser className="text-2xl text-gray-700 group-hover:text-[#2F5FE3] stroke-[1.5] transition-colors" />
              <span>Account</span>
            </Link>

            <Link
              to="/cart"
              className="relative flex flex-col items-center gap-1 text-[11px] font-medium text-gray-700 hover:text-[#2F5FE3] transition-colors group"
            >
              <div className="relative">
                <HiOutlineShoppingBag className="text-2xl text-gray-700 group-hover:text-[#2F5FE3] stroke-[1.5] transition-colors" />
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#2F5FE3] text-[9px] font-bold text-white shadow-xs">
                  {count > 0 ? count : 0}
                </span>
              </div>
              <span>Cart</span>
            </Link>
          </nav>

          {/* Mobile Right: Cart & Account Icons */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/account"
              className="p-1.5 text-[#12203D] hover:bg-gray-100 rounded-xl transition-transform active:scale-95"
              aria-label="Account"
            >
              <HiOutlineUser className="text-2.5xl stroke-[1.5]" />
            </Link>
            <Link
              to="/cart"
              className="relative p-1.5 text-[#12203D] hover:bg-gray-100 rounded-xl transition-transform active:scale-95"
              aria-label="Cart"
            >
              <HiOutlineShoppingBag className="text-2.5xl stroke-[1.5]" />
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#2F5FE3] text-[9px] font-bold text-white shadow-xs">
                {count > 0 ? count : 0}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile View: Search Bar Row */}
        <div className="mt-3 md:hidden relative">
          <form role="search" onSubmit={handleSearchSubmit} className="relative w-full">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none stroke-[1.8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsDropdownOpen(true)
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search products, brands..."
              className="w-full rounded-full bg-white pl-10 pr-4 py-2.5 text-[12px] font-medium text-[#12203D] placeholder:text-gray-400 outline-none shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-gray-100/90 focus:border-[#2F5FE3]"
            />
          </form>

          {/* Mobile Character-by-Character Search Results Dropdown */}
          {isDropdownOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
              {searchResults.products.length > 0 ? (
                <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                  {searchResults.products.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug || product.id}`}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 hover:bg-blue-50/50 transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-contain bg-gray-50 p-1 border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#12203D] truncate">
                          {product.name}
                        </h4>
                        <div className="text-[10px] font-extrabold text-[#2F5FE3]">
                          {formatNaira(product.finalPrice)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-gray-500 font-medium">
                  No matching products.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile View: Mini Category Strip (ONLY VISIBLE ON HOME PAGE) */}
        {location.pathname === '/' && (
          <div className="mt-3.5 pt-2 border-t border-gray-100/60 md:hidden">
            {categories.length > 0 ? (
              <div className="grid grid-cols-5 gap-2">
                {categories.slice(0, 5).map((c) => (
                  <Link
                    key={c.id}
                    to={`/category/${c.id}`}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.label}
                        className="h-11 w-11 rounded-2xl object-cover shadow-2xs border border-gray-200 transition-transform active:scale-95 group-hover:scale-105"
                      />
                    ) : (
                      <ImagePlaceholder
                        label=""
                        aspectRatio="h-11 w-11"
                        variant="warm-canvas"
                        className="rounded-2xl shadow-2xs border border-[#DCD9D0]/60 transition-transform active:scale-95 group-hover:scale-105"
                      />
                    )}
                    <span className="text-[10px] font-semibold text-[#12203D] tracking-tight text-center truncate max-w-full">
                      {c.label}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-2.5 px-3 rounded-xl bg-gray-50/80 border border-dashed border-gray-200 text-center">
                <span className="text-[11px] font-semibold text-gray-400">
                  No categories uploaded yet
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upgraded Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            {/* Drawer Brand Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-[#F8F9FB]">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <img src="/logo.PNG" alt="Noma logo" className="h-8 w-auto object-contain" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-gray-500 hover:text-[#12203D] hover:bg-gray-200/60 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <FiX className="text-xl stroke-[2]" />
              </button>
            </div>

            {/* Quick Welcome Banner */}
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="mx-4 mt-4 rounded-2xl bg-gradient-to-r from-[#2F5FE3] to-[#1d47bd] p-4 text-white shadow-xs block hover:opacity-95 transition-opacity"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs text-white">
                    <HiOutlineUser className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Account & Settings</h4>
                    <p className="text-[11px] text-blue-100 opacity-90">Set default delivery info</p>
                  </div>
                </div>
                <HiChevronRight className="text-white text-base opacity-80" />
              </div>
            </Link>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Primary Navigation */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-3">
                  Menu Navigation
                </span>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14px] font-bold transition-colors ${
                    location.pathname === '/' ? 'bg-blue-50/80 text-[#2F5FE3]' : 'text-[#12203D] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <HiOutlineHome className="text-lg text-[#2F5FE3]" />
                    <span>Home</span>
                  </div>
                  <HiChevronRight className="text-gray-300 text-base" />
                </Link>

                <Link
                  to="/catalog"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14px] font-bold transition-colors ${
                    location.pathname.startsWith('/catalog') || location.pathname.startsWith('/category')
                      ? 'bg-blue-50/80 text-[#2F5FE3]'
                      : 'text-[#12203D] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <HiOutlineSquares2X2 className="text-lg text-[#2F5FE3]" />
                    <span>Shop Categories</span>
                  </div>
                  <HiChevronRight className="text-gray-300 text-base" />
                </Link>

                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14px] font-bold transition-colors ${
                    location.pathname === '/account' ? 'bg-blue-50/80 text-[#2F5FE3]' : 'text-[#12203D] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <HiOutlineUser className="text-lg text-[#2F5FE3]" />
                    <span>Account & Settings</span>
                  </div>
                  <HiChevronRight className="text-gray-300 text-base" />
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14px] font-bold transition-colors ${
                    location.pathname === '/orders' ? 'bg-blue-50/80 text-[#2F5FE3]' : 'text-[#12203D] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <HiOutlineClock className="text-lg text-[#2F5FE3]" />
                    <span>Track Order</span>
                  </div>
                  <HiChevronRight className="text-gray-300 text-base" />
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14px] font-bold transition-colors ${
                    location.pathname === '/wishlist' ? 'bg-blue-50/80 text-[#2F5FE3]' : 'text-[#12203D] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <HiOutlineHeart className="text-lg text-[#2F5FE3]" />
                    <span>Wishlist</span>
                  </div>
                  <HiChevronRight className="text-gray-300 text-base" />
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14px] font-bold transition-colors ${
                    location.pathname === '/cart' ? 'bg-blue-50/80 text-[#2F5FE3]' : 'text-[#12203D] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <HiOutlineShoppingBag className="text-lg text-[#2F5FE3]" />
                    <span>Shopping Cart</span>
                  </div>
                  <span className="rounded-full bg-[#2F5FE3] px-2 py-0.5 text-[10px] font-extrabold text-white">
                    {count}
                  </span>
                </Link>
              </div>

              {/* Dynamic Categories Grid in Mobile Drawer */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-3">
                  Browse Store Categories ({categories.length})
                </span>
                {categories.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 px-1">
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        to={`/category/${c.id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl bg-gray-50 p-2.5 text-[12px] font-semibold text-[#12203D] hover:bg-blue-50/70 hover:text-[#2F5FE3] transition-colors"
                      >
                        <span className="h-2 w-2 rounded-full bg-[#2F5FE3]" />
                        <span className="truncate">{c.label}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="px-3 text-xs text-gray-400 italic">No categories uploaded yet.</p>
                )}
              </div>
            </div>

            {/* Drawer Footer Support */}
            <div className="p-4 border-t border-gray-100 bg-[#F8F9FB]">
              <a
                href="https://wa.me/2348030006662"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 px-4 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition-colors"
              >
                <HiOutlinePhone className="text-base" />
                <span>Need Support? Chat with Us</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}