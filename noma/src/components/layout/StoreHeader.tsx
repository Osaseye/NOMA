import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  CaretDown,
  Heart,
  List,
  MagnifyingGlass,
  MapPin,
  ShoppingBag,
  Truck,
  User,
  X,
} from '@phosphor-icons/react'
import { toCartLineEntries, useCartStore } from '../../store/cartStore'
import { useProductStore } from '../../store/productStore'
import { useUserStore } from '../../store/userStore'
import { formatNaira } from '../../utils/pricing'

const QUICK_SEARCH_CHIPS = ['Smart TV', 'Inverter AC', 'Power Station', 'Air Fryer', 'Soundbar']

const NIGERIAN_STATES = [
  'Lagos',
  'FCT - Abuja',
  'Oyo',
  'Ogun',
  'Rivers',
  'Edo',
  'Delta',
  'Enugu',
  'Anambra',
  'Kano',
  'Kaduna',
  'Akwa Ibom',
  'Cross River',
  'Imo',
  'Kwara',
  'Osun',
  'Ondo',
  'Ekiti',
  'Plateau',
  'Abia',
]

const EXPOSED_DEPARTMENTS = [
  { label: 'ALL CATALOG', href: '/catalog' },
  { label: 'ELECTRONICS', href: '/category/electronics' },
  { label: 'APPLIANCES', href: '/category/appliances' },
  { label: 'KITCHEN', href: '/category/kitchen' },
  { label: 'PHONES', href: '/category/phones' },
]

export const StoreHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()
  const location = useLocation()

  const items = useCartStore((state) => state.items)
  const openDrawer = useCartStore((state) => state.openDrawer)
  const deliveryState = useCartStore((state) => state.deliveryState)
  const setDeliveryState = useCartStore((state) => state.setDeliveryState)

  const totalItems = useMemo(
    () => toCartLineEntries(items).reduce((sum, entry) => sum + entry.quantity, 0),
    [items],
  )

  const wishlistCount = useUserStore((state) => state.wishlistProductIds.length)
  const products = useProductStore((state) => state.products)
  const categories = useProductStore((state) => state.categories)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        event.preventDefault()
        searchInputRef.current?.focus()
        setSearchOpen(true)
      } else if (event.key === 'Escape') {
        setSearchOpen(false)
        searchInputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) {
      return products.slice(0, 4)
    }
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)),
      )
      .slice(0, 5)
  }, [products, searchQuery])

  const matchingCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return categories.slice(0, 5)
    return categories
      .filter((c) => c.label.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
      .slice(0, 5)
  }, [categories, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E4E4E7] bg-white/95 backdrop-blur-md">
      {/* Primary Exposed 1px Architectural Bar */}
      <div className="mx-auto flex h-16 max-w-[1600px] items-stretch justify-between border-x border-[#E4E4E7]">
        {/* Cell 1: Mobile Menu Trigger + Untouched Brand Logo */}
        <div className="flex shrink-0 items-center border-r border-[#E4E4E7] px-4 sm:px-6">
          <button
            type="button"
            className="mr-3 inline-flex h-9 w-9 items-center justify-center border border-[#E4E4E7] text-[#09090B] transition-colors hover:bg-[#F4F4F5] lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={18} weight="regular" /> : <List size={18} weight="regular" />}
          </button>

          <Link to="/" className="flex shrink-0 items-center">
            <img
              src="/logo.PNG"
              alt="Noma Store"
              className="h-8 w-auto object-contain sm:h-9"
            />
          </Link>
        </div>

        {/* Cell 2: Exposed Department Links (Desktop) */}
        <nav className="hidden xl:flex items-stretch divide-x divide-[#E4E4E7] border-r border-[#E4E4E7]">
          {EXPOSED_DEPARTMENTS.map((dept) => {
            const isActive =
              dept.href === '/catalog'
                ? location.pathname === '/catalog'
                : location.pathname === dept.href
            return (
              <Link
                key={dept.label}
                to={dept.href}
                className={`relative flex items-center px-4 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  isActive
                    ? 'bg-[#FAFAFA] text-[#09090B]'
                    : 'text-[#52525B] hover:bg-[#FAFAFA] hover:text-[#09090B]'
                }`}
              >
                {dept.label}
                {isActive ? (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#1049EB]" />
                ) : null}
              </Link>
            )
          })}
        </nav>

        {/* Cell 3: Architectural Command Search Cell */}
        <div
          ref={searchContainerRef}
          className="relative hidden md:flex flex-1 items-stretch border-r border-[#E4E4E7]"
        >
          <form onSubmit={handleSearch} className="relative flex w-full items-center">
            <MagnifyingGlass
              size={15}
              weight="regular"
              className="pointer-events-none ml-4 shrink-0 text-[#71717A]"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search appliances, SKU, brand..."
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSearchOpen(true)
              }}
              className="h-full w-full bg-transparent pl-3 pr-12 text-xs text-[#09090B] placeholder:text-[#71717A] focus:bg-[#FAFAFA] focus:outline-none"
            />
            <kbd className="pointer-events-none mr-4 hidden sm:inline-flex h-5 items-center border border-[#E4E4E7] bg-[#F4F4F5] px-1.5 font-mono text-[10px] font-medium text-[#71717A]">
              /
            </kbd>
          </form>

          {/* 2-Column Predictive Command Palette Dropdown */}
          {searchOpen ? (
            <div className="absolute left-0 right-0 top-full z-50 -mt-px border border-[#09090B] bg-white shadow-2xl">
              <div className="grid grid-cols-1 divide-y divide-[#E4E4E7] lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                {/* Left Column: Quick Searches & Categories */}
                <div className="bg-[#FAFAFA] p-4 lg:col-span-5">
                  <p className="mb-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                    INDEX / QUERIES
                  </p>
                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {QUICK_SEARCH_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setSearchQuery(chip)
                          navigate(`/search?q=${encodeURIComponent(chip)}`)
                          setSearchOpen(false)
                        }}
                        className="border border-[#E4E4E7] bg-white px-2.5 py-1 text-[11px] font-medium text-[#09090B] transition-colors hover:border-[#09090B]"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                    DEPARTMENTS
                  </p>
                  <ul className="space-y-0.5">
                    {matchingCategories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          to={`/category/${cat.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center justify-between px-2 py-1.5 text-xs font-medium text-[#09090B] transition-colors hover:bg-white"
                        >
                          <span>{cat.label}</span>
                          <ArrowUpRight size={13} className="text-[#71717A]" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Column: Live Matching Products */}
                <div className="p-4 lg:col-span-7">
                  <div className="mb-2.5 flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                      {searchQuery.trim() ? 'MATCHING HARDWARE' : 'CURATED HIGHLIGHTS'}
                    </p>
                    {searchQuery.trim() ? (
                      <button
                        type="button"
                        onClick={() => {
                          navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                          setSearchOpen(false)
                        }}
                        className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#1049EB] hover:underline"
                      >
                        VIEW ALL &rarr;
                      </button>
                    ) : null}
                  </div>

                  {searchResults.length === 0 ? (
                    <p className="py-8 text-center text-xs text-[#71717A]">
                      No products matching &ldquo;{searchQuery}&rdquo;.
                    </p>
                  ) : (
                    <div className="divide-y divide-[#E4E4E7] border-t border-[#E4E4E7]">
                      {searchResults.map((item) => (
                        <Link
                          key={item.id}
                          to={`/product/${item.slug || item.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 py-2.5 transition-colors hover:bg-[#FAFAFA]"
                        >
                          <div className="h-11 w-11 shrink-0 overflow-hidden border border-[#E4E4E7] bg-[#F4F4F5] p-1">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-contain mix-blend-multiply"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-[#09090B]">
                              {item.name}
                            </p>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
                              {item.brand || item.category}
                            </p>
                          </div>
                          <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-[#09090B]">
                            {formatNaira(item.finalPrice)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Cell 4: Nigerian State Delivery Estimator Trigger (Desktop) */}
        <div className="hidden lg:flex items-center border-r border-[#E4E4E7] bg-[#FAFAFA] px-3.5">
          <MapPin size={13} weight="bold" className="mr-1.5 shrink-0 text-[#1049EB]" />
          <div className="relative flex items-center">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
              STATE:
            </span>
            <select
              aria-label="Delivery state"
              value={deliveryState}
              onChange={(e) => setDeliveryState(e.target.value)}
              className="cursor-pointer appearance-none bg-transparent pr-4 font-mono text-[11px] font-semibold uppercase text-[#09090B] focus:outline-none"
            >
              {NIGERIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <CaretDown
              size={11}
              className="pointer-events-none absolute right-0 text-[#71717A]"
            />
          </div>
        </div>

        {/* Cell 5: Right Utility Cells (Track, Wishlist, Account, Slide-Out Bag Drawer Trigger) */}
        <div className="flex items-stretch divide-x divide-[#E4E4E7]">
          <Link
            to="/orders"
            className="hidden sm:flex items-center gap-1.5 px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#52525B] transition-colors hover:bg-[#FAFAFA] hover:text-[#09090B]"
            title="Track Order"
          >
            <Truck size={16} weight="regular" />
            <span className="hidden 2xl:inline">Track</span>
          </Link>

          <Link
            to="/wishlist"
            className="relative flex items-center gap-1.5 px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#52525B] transition-colors hover:bg-[#FAFAFA] hover:text-[#09090B]"
            title="Saved Items"
          >
            <Heart size={16} weight={wishlistCount > 0 ? 'fill' : 'regular'} />
            {wishlistCount > 0 ? (
              <span className="font-mono text-[10px] font-semibold tabular-nums text-[#09090B]">
                [{wishlistCount}]
              </span>
            ) : null}
          </Link>

          <Link
            to="/account"
            className="hidden sm:flex items-center gap-1.5 px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#52525B] transition-colors hover:bg-[#FAFAFA] hover:text-[#09090B]"
            title="Account"
          >
            <User size={16} weight="regular" />
          </Link>

          {/* Slide-Out Mini-Cart Bag Trigger */}
          <button
            type="button"
            onClick={openDrawer}
            className="flex items-center gap-2 bg-[#09090B] px-4 sm:px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#1049EB]"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag size={16} weight="regular" />
            <span className="hidden sm:inline">BAG</span>
            <span className="font-mono text-[11px] font-semibold tabular-nums text-[#FEB719]">
              [{totalItems}]
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Strip (Exposed 1px Sub-Row) */}
      <div className="border-t border-[#E4E4E7] bg-white px-4 py-2 md:hidden">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <MagnifyingGlass
            size={15}
            weight="regular"
            className="pointer-events-none absolute left-3 text-[#71717A]"
          />
          <input
            type="text"
            placeholder="Search appliances, electronics, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full border border-[#E4E4E7] bg-[#F4F4F5] pl-9 pr-3 text-xs text-[#09090B] placeholder:text-[#71717A] focus:border-[#1049EB] focus:bg-white focus:outline-none"
          />
        </form>
      </div>

      {/* Mobile Exposed-Grid Drawer */}
      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex w-full max-w-xs flex-col justify-between border-r border-[#E4E4E7] bg-white">
            <div>
              <div className="flex h-16 items-center justify-between border-b border-[#E4E4E7] px-5">
                <img src="/logo.PNG" alt="Noma" className="h-7 w-auto object-contain" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center border border-[#E4E4E7] text-[#09090B]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Mobile Delivery State Selector */}
              <div className="flex items-center justify-between border-b border-[#E4E4E7] bg-[#FAFAFA] px-5 py-3">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
                  DELIVER TO STATE
                </span>
                <select
                  value={deliveryState}
                  onChange={(e) => setDeliveryState(e.target.value)}
                  className="border border-[#E4E4E7] bg-white px-2 py-1 font-mono text-xs font-semibold text-[#09090B]"
                >
                  {NIGERIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="divide-y divide-[#E4E4E7] border-b border-[#E4E4E7]">
                <div className="bg-[#F4F4F5] px-5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                  01 / DEPARTMENTS
                </div>
                <Link
                  to="/catalog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#09090B] hover:bg-[#FAFAFA]"
                >
                  <span>ALL CATALOG</span>
                  <ArrowUpRight size={14} className="text-[#71717A]" />
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#52525B] hover:bg-[#FAFAFA] hover:text-[#09090B]"
                  >
                    <span>{cat.label}</span>
                    <ArrowUpRight size={14} className="text-[#71717A]" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="divide-y divide-[#E4E4E7] border-t border-[#E4E4E7]">
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#09090B]"
              >
                <Truck size={16} /> Track Order
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#09090B]"
              >
                <Heart size={16} /> Saved Wishlist [{wishlistCount}]
              </Link>
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#09090B]"
              >
                <User size={16} /> Account
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  openDrawer()
                }}
                className="flex w-full items-center justify-between bg-[#09090B] px-5 py-3.5 text-xs font-semibold uppercase tracking-widest text-white"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag size={16} /> Open Shopping Bag
                </span>
                <span className="font-mono text-[#FEB719]">[{totalItems}]</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
