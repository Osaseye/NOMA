import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CaretRight,
  Clock,
  Heart,
  House,
  List,
  MagnifyingGlass,
  ShoppingBag,
  SquaresFour,
  Star,
  Tag,
  User,
  WhatsappLogo,
  X,
} from '@phosphor-icons/react'
import { brand } from '../../constants/brand'
import { useAdminStore } from '../../store/adminStore'
import { useCartStore } from '../../store/cartStore'
import { useProductStore } from '../../store/productStore'
import { formatNaira } from '../../utils/pricing'
import { InstallAppBanner } from '../pwa/InstallAppBanner'

export function StoreHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { products, categories } = useProductStore()
  const { settings } = useAdminStore()
  const count = Object.values(useCartStore((state) => state.items)).reduce(
    (sum, quantity) => sum + quantity,
    0,
  )

  const [menuOpenedPath, setMenuOpenedPath] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpenedPath, setDropdownOpenedPath] = useState<string | null>(null)

  const mobileMenuOpen = menuOpenedPath === location.pathname
  const isDropdownOpen = dropdownOpenedPath === location.pathname
  const setMobileMenuOpen = useCallback(
    (open: boolean | ((prev: boolean) => boolean)) => {
      setMenuOpenedPath((prevPath) => {
        const prevOpen = prevPath === location.pathname
        const nextOpen = typeof open === 'function' ? open(prevOpen) : open
        return nextOpen ? location.pathname : null
      })
    },
    [location.pathname],
  )
  const setIsDropdownOpen = useCallback(
    (open: boolean) => {
      setDropdownOpenedPath(open ? location.pathname : null)
    },
    [location.pathname],
  )

  const searchContainerRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const desktopInputRef = useRef<HTMLInputElement>(null)

  const whatsappDigits = settings.whatsappNumber?.replace(/\D/g, '')
  const whatsappUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : brand.whatsapp

  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return { products: [], categories: [] }

    const matchedProducts = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)),
      )
      .slice(0, 5)

    const matchedCategories = categories
      .filter(
        (c) => c.label.toLowerCase().includes(q) || c.id.toLowerCase().includes(q),
      )
      .slice(0, 3)

    return { products: matchedProducts, categories: matchedCategories }
  }, [searchQuery, products, categories])

  // Keyboard "/" focuses desktop search; Escape closes dropdown
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false)
        setMobileMenuOpen(false)
        desktopInputRef.current?.blur()
        return
      }

      if (
        event.key === '/' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        const target = event.target as HTMLElement | null
        const tag = target?.tagName?.toLowerCase()
        if (tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable) {
          return
        }
        event.preventDefault()
        desktopInputRef.current?.focus()
        setIsDropdownOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setIsDropdownOpen, setMobileMenuOpen])

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const insideDesktop = searchContainerRef.current?.contains(target)
      const insideMobile = mobileSearchRef.current?.contains(target)
      if (!insideDesktop && !insideMobile) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setIsDropdownOpen])

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
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

  const isNavActive = (path: string) => {
    if (path === '/catalog') {
      return location.pathname.startsWith('/catalog') || location.pathname.startsWith('/category')
    }
    return location.pathname === path
  }

  return (
    <>
      <InstallAppBanner />

      <header className="sticky top-0 left-0 z-40 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          {/* Desktop & Mobile Top Row */}
          <div className="flex h-16 items-center justify-between gap-3 md:gap-6">
            {/* Mobile Left: Menu + Logo */}
            <div className="flex items-center gap-2.5 md:gap-0">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#0B1220] transition-colors hover:bg-[#F6F7F9] md:hidden"
                aria-label="Toggle navigation menu"
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                {mobileMenuOpen ? (
                  <X size={18} weight="regular" />
                ) : (
                  <List size={18} weight="regular" />
                )}
              </button>

              <Link to="/" className="flex shrink-0 items-center">
                <img
                  src="/logo.PNG"
                  alt="Noma"
                  className="h-8 w-auto object-contain md:h-9"
                />
              </Link>
            </div>

            {/* Desktop Center: Flat Search Bar */}
            <div
              className="relative hidden max-w-xl flex-1 md:block"
              ref={searchContainerRef}
            >
              <form role="search" onSubmit={handleSearchSubmit} className="relative w-full">
                <MagnifyingGlass
                  size={16}
                  weight="regular"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5E6675]"
                />
                <input
                  ref={desktopInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setIsDropdownOpen(true)
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Search products, brands, categories..."
                  aria-label="Search products"
                  className="h-10 w-full rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] pl-10 pr-14 text-sm text-[#0B1220] placeholder:text-[#5E6675] transition-colors focus:border-[#1049EB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
                />

                {searchQuery ? (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      setSearchQuery('')
                      setIsDropdownOpen(false)
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[4px] p-1 text-[#5E6675] hover:bg-[#EEF0F4] hover:text-[#0B1220]"
                  >
                    <X size={14} weight="regular" />
                  </button>
                ) : (
                  <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center rounded-[4px] border border-[#E5E7EB] bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#5E6675] lg:inline-flex">
                    /
                  </kbd>
                )}
              </form>

              {/* Live Dropdown */}
              {isDropdownOpen && searchQuery.trim().length > 0 ? (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white shadow-[0_8px_24px_rgba(11,18,32,0.08)]">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#F6F7F9] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#5E6675]">
                    <span>Results for "{searchQuery}"</span>
                    <span className="font-mono">{searchResults.products.length} items</span>
                  </div>

                  {searchResults.categories.length > 0 ? (
                    <div className="border-b border-[#E5E7EB] bg-[#F6F7F9]/50 px-3.5 py-2.5">
                      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#1049EB]">
                        Categories
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {searchResults.categories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/category/${cat.id}`}
                            onClick={() => setIsDropdownOpen(false)}
                            className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs font-semibold text-[#0B1220] transition-colors hover:border-[#1049EB] hover:bg-[#EEF3FE] hover:text-[#1049EB]"
                          >
                            <Tag size={12} weight="regular" className="text-[#1049EB]" />
                            <span>{cat.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {searchResults.products.length > 0 ? (
                    <div className="max-h-[360px] divide-y divide-[#E5E7EB] overflow-y-auto">
                      {searchResults.products.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.slug || product.id}`}
                          onClick={() => setIsDropdownOpen(false)}
                          className="group flex items-center gap-3 p-3 transition-colors hover:bg-[#F6F7F9]"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-11 w-11 shrink-0 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] object-contain p-1"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-xs font-semibold text-[#0B1220] group-hover:text-[#1049EB]">
                              {product.name}
                            </h4>
                            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#5E6675]">
                              <span className="font-mono font-bold text-[#0B1220]">
                                {formatNaira(product.finalPrice)}
                              </span>
                              <span>:</span>
                              <span className="capitalize">{product.category.replace(/-/g, ' ')}</span>
                              <span className="inline-flex items-center gap-0.5 font-mono text-[#0B1220]">
                                <Star size={11} weight="fill" className="text-[#FEB719]" />
                                {(product.rating || 4.8).toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <ArrowRight
                            size={14}
                            weight="regular"
                            className="shrink-0 text-[#5E6675] transition-transform group-hover:translate-x-0.5 group-hover:text-[#1049EB]"
                          />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-5 text-center text-xs text-[#5E6675]">
                      No products found matching "<strong className="text-[#0B1220]">{searchQuery}</strong>".
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="flex w-full items-center justify-center gap-1.5 bg-[#0B1220] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1049EB]"
                  >
                    <span>View all search results</span>
                    <ArrowRight size={13} weight="regular" />
                  </button>
                </div>
              ) : null}
            </div>

            {/* Desktop Right: Single-Row Navigation */}
            <nav className="hidden items-center gap-1 md:flex lg:gap-1.5" aria-label="Primary">
              <Link
                to="/catalog"
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-[6px] px-2.5 py-2 text-xs font-semibold transition-colors ${
                  isNavActive('/catalog')
                    ? 'bg-[#EEF3FE] text-[#1049EB]'
                    : 'text-[#374151] hover:bg-[#F6F7F9] hover:text-[#0B1220]'
                }`}
              >
                <SquaresFour size={16} weight="regular" />
                <span>Categories</span>
              </Link>

              <Link
                to="/orders"
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-[6px] px-2.5 py-2 text-xs font-semibold transition-colors ${
                  isNavActive('/orders') || isNavActive('/track-order')
                    ? 'bg-[#EEF3FE] text-[#1049EB]'
                    : 'text-[#374151] hover:bg-[#F6F7F9] hover:text-[#0B1220]'
                }`}
              >
                <Clock size={16} weight="regular" />
                <span>Track Order</span>
              </Link>

              <Link
                to="/wishlist"
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-[6px] px-2.5 py-2 text-xs font-semibold transition-colors ${
                  isNavActive('/wishlist')
                    ? 'bg-[#EEF3FE] text-[#1049EB]'
                    : 'text-[#374151] hover:bg-[#F6F7F9] hover:text-[#0B1220]'
                }`}
              >
                <Heart size={16} weight="regular" />
                <span>Wishlist</span>
              </Link>

              <Link
                to="/account"
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-[6px] px-2.5 py-2 text-xs font-semibold transition-colors ${
                  isNavActive('/account')
                    ? 'bg-[#EEF3FE] text-[#1049EB]'
                    : 'text-[#374151] hover:bg-[#F6F7F9] hover:text-[#0B1220]'
                }`}
              >
                <User size={16} weight="regular" />
                <span>Account</span>
              </Link>

              <Link
                to="/cart"
                className={`ml-1 inline-flex items-center gap-2 whitespace-nowrap rounded-[6px] border px-3 py-2 text-xs font-semibold transition-colors ${
                  isNavActive('/cart')
                    ? 'border-[#1049EB] bg-[#EEF3FE] text-[#1049EB]'
                    : 'border-[#E5E7EB] bg-white text-[#0B1220] hover:border-[#D1D5DB] hover:bg-[#F6F7F9]'
                }`}
              >
                <ShoppingBag size={16} weight="regular" />
                <span>Cart</span>
                <span className="inline-flex min-w-[20px] items-center justify-center rounded-[4px] bg-[#1049EB] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                  {count}
                </span>
              </Link>
            </nav>

            {/* Mobile Right: Account & Cart */}
            <div className="flex items-center gap-1.5 md:hidden">
              <Link
                to="/account"
                aria-label="Account"
                className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#0B1220] hover:bg-[#F6F7F9]"
              >
                <User size={18} weight="regular" />
              </Link>
              <Link
                to="/cart"
                aria-label="Shopping cart"
                className="inline-flex h-9 items-center gap-1.5 rounded-[6px] border border-[#E5E7EB] bg-white px-2.5 text-[#0B1220] hover:bg-[#F6F7F9]"
              >
                <ShoppingBag size={18} weight="regular" />
                <span className="inline-flex min-w-[18px] items-center justify-center rounded-[4px] bg-[#1049EB] px-1 py-0.5 font-mono text-[10px] font-bold text-white">
                  {count}
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar Row (Clean - No Category Strip) */}
          <div className="relative pb-3 md:hidden" ref={mobileSearchRef}>
            <form role="search" onSubmit={handleSearchSubmit} className="relative w-full">
              <MagnifyingGlass
                size={15}
                weight="regular"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5E6675]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsDropdownOpen(true)
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Search products, brands..."
                aria-label="Search products"
                className="h-10 w-full rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] pl-9 pr-9 text-xs text-[#0B1220] placeholder:text-[#5E6675] focus:border-[#1049EB] focus:bg-white focus:outline-none"
              />
              {searchQuery ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchQuery('')
                    setIsDropdownOpen(false)
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[4px] p-1 text-[#5E6675]"
                >
                  <X size={14} weight="regular" />
                </button>
              ) : null}
            </form>

            {isDropdownOpen && searchQuery.trim().length > 0 ? (
              <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white shadow-[0_8px_24px_rgba(11,18,32,0.08)]">
                {searchResults.products.length > 0 ? (
                  <div className="max-h-[280px] divide-y divide-[#E5E7EB] overflow-y-auto">
                    {searchResults.products.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug || product.id}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 p-2.5 hover:bg-[#F6F7F9]"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 shrink-0 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] object-contain p-1"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-xs font-semibold text-[#0B1220]">
                            {product.name}
                          </h4>
                          <span className="font-mono text-[11px] font-bold text-[#1049EB]">
                            {formatNaira(product.finalPrice)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-[#5E6675]">
                    No matching products.
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Slide-Over Mobile Drawer */}
        {mobileMenuOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-[#0B1220]/45 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />

            <aside className="absolute bottom-0 left-0 top-0 z-10 flex w-[85%] max-w-[320px] flex-col rounded-r-[10px] border-r border-[#E5E7EB] bg-white">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#F6F7F9] px-4 py-3.5">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center"
                >
                  <img src="/logo.PNG" alt="Noma" className="h-7 w-auto object-contain" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#5E6675] hover:text-[#0B1220]"
                >
                  <X size={16} weight="regular" />
                </button>
              </div>

              {/* Account Quick Link (Neutral Architectural Surface) */}
              <div className="px-4 pt-4">
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-3.5 transition-colors hover:border-[#D1D5DB]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#0B1220]">
                      <User size={18} weight="regular" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0B1220]">Account &amp; Settings</div>
                      <div className="text-[11px] text-[#5E6675]">Manage saved delivery info</div>
                    </div>
                  </div>
                  <CaretRight size={15} weight="regular" className="text-[#5E6675]" />
                </Link>
              </div>

              {/* Primary Drawer Links */}
              <div className="flex-1 space-y-5 overflow-y-auto p-4">
                <div className="space-y-1">
                  <span className="block px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#5E6675]">
                    Navigation
                  </span>

                  {[
                    { to: '/', label: 'Home', icon: House, active: location.pathname === '/' },
                    {
                      to: '/catalog',
                      label: 'Shop Categories',
                      icon: SquaresFour,
                      active: isNavActive('/catalog'),
                    },
                    {
                      to: '/orders',
                      label: 'Track Order',
                      icon: Clock,
                      active: isNavActive('/orders'),
                    },
                    {
                      to: '/wishlist',
                      label: 'Wishlist',
                      icon: Heart,
                      active: isNavActive('/wishlist'),
                    },
                    {
                      to: '/account',
                      label: 'Account',
                      icon: User,
                      active: isNavActive('/account'),
                    },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-[6px] px-3 py-2.5 text-sm font-semibold transition-colors ${
                        item.active
                          ? 'bg-[#EEF3FE] text-[#1049EB]'
                          : 'text-[#0B1220] hover:bg-[#F6F7F9]'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon
                          size={18}
                          weight="regular"
                          className={item.active ? 'text-[#1049EB]' : 'text-[#5E6675]'}
                        />
                        <span>{item.label}</span>
                      </span>
                      <CaretRight size={14} weight="regular" className="text-[#5E6675]" />
                    </Link>
                  ))}

                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-[6px] px-3 py-2.5 text-sm font-semibold transition-colors ${
                      isNavActive('/cart')
                        ? 'bg-[#EEF3FE] text-[#1049EB]'
                        : 'text-[#0B1220] hover:bg-[#F6F7F9]'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <ShoppingBag
                        size={18}
                        weight="regular"
                        className={isNavActive('/cart') ? 'text-[#1049EB]' : 'text-[#5E6675]'}
                      />
                      <span>Shopping Cart</span>
                    </span>
                    <span className="rounded-[4px] bg-[#1049EB] px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                      {count}
                    </span>
                  </Link>
                </div>

                {/* Store Categories */}
                <div className="space-y-2 border-t border-[#E5E7EB] pt-4">
                  <span className="block px-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#5E6675]">
                    Categories ({categories.length})
                  </span>
                  {categories.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          to={`/category/${c.id}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-2.5 py-2 text-xs font-medium text-[#0B1220] transition-colors hover:border-[#1049EB] hover:bg-[#EEF3FE] hover:text-[#1049EB]"
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#1049EB]" />
                          <span className="truncate">{c.label}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="px-2.5 text-xs text-[#5E6675]">No categories available yet.</p>
                  )}
                </div>
              </div>

              {/* Drawer Footer Support */}
              <div className="border-t border-[#E5E7EB] bg-[#F6F7F9] p-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-[6px] bg-[#0B1220] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1049EB]"
                >
                  <WhatsappLogo size={16} weight="fill" className="text-[#25D366]" />
                  <span>Need Support? Chat on WhatsApp</span>
                </a>
              </div>
            </aside>
          </div>
        ) : null}
      </header>
    </>
  )
}
