import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowRight,
  CaretRight,
  Heart,
  List,
  MagnifyingGlass,
  ShoppingBag,
  Truck,
  User,
  X,
} from '@phosphor-icons/react'
import { toCartLineEntries, useCartStore } from '../../store/cartStore'
import { useProductStore } from '../../store/productStore'
import { useUserStore } from '../../store/userStore'
import { formatNaira } from '../../utils/pricing'

const QUICK_SEARCH_CHIPS = ['Shoes', 'Sneakers', 'Men & Women Fashion', 'Smart TV', 'Air Fryer', 'Cookware']

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

  const totalItems = useMemo(
    () => toCartLineEntries(items).reduce((sum, entry) => sum + entry.quantity, 0),
    [items],
  )

  const prevTotalRef = useRef(totalItems)
  const [bagBumpDelta, setBagBumpDelta] = useState<{ id: number; delta: number } | null>(null)

  useEffect(() => {
    const diff = totalItems - prevTotalRef.current
    prevTotalRef.current = totalItems
    if (diff > 0) {
      const id = Date.now()
      const showTimer = window.setTimeout(() => setBagBumpDelta({ id, delta: diff }), 0)
      const hideTimer = window.setTimeout(() => {
        setBagBumpDelta((curr) => (curr?.id === id ? null : curr))
      }, 950)
      return () => {
        window.clearTimeout(showTimer)
        window.clearTimeout(hideTimer)
      }
    }
  }, [totalItems])

  const wishlistCount = useUserStore((state) => state.wishlistProductIds.length)
  const products = useProductStore((state) => state.products)
  const categories = useProductStore((state) => state.categories)

  useEffect(() => {
    if (!mobileMenuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileMenuOpen])

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
        setMobileMenuOpen(false)
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
    if (!q) return categories.slice(0, 6)
    return categories
      .filter((c) => c.label.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
      .slice(0, 6)
  }, [categories, searchQuery])

  // Build single-line carousel items (duplicated for seamless infinite auto-scroll)
  const carouselCategories = useMemo(() => {
    const base = [
      { id: 'all', label: 'All Products', href: '/catalog' },
      ...categories.map((cat) => ({
        id: cat.id,
        label: cat.label,
        href: `/category/${cat.id}`,
      })),
    ]
    return [...base, ...base]
  }, [categories])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setMobileMenuOpen(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white">
        {/* Main Wide Header Row (Reduced side margin: max-w-[1600px] px-3 sm:px-5 lg:px-6) */}
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-3 sm:px-5 lg:px-6">
          {/* Left: Hamburger + Noma Logo */}
          <div className="flex shrink-0 items-center gap-2.5">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-800 transition-colors hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <List size={22} weight="regular" />
            </button>

            <Link to="/" className="flex shrink-0 items-center">
              <img
                src="/logo.PNG"
                alt="Noma"
                className="h-8 w-auto object-contain sm:h-9"
              />
            </Link>
          </div>

          {/* Center: Wide Neutral Search Bar (No loud blue button) */}
          <div
            ref={searchContainerRef}
            className="relative hidden max-w-2xl flex-1 md:block"
          >
            <form onSubmit={handleSearch} className="relative flex w-full items-center">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search shoes, clothing, appliances, electronics..."
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSearchOpen(true)
                }}
                className="h-10 w-full rounded-full border border-slate-200 bg-[#F4F4F5] pl-4 pr-12 text-sm text-slate-900 placeholder:text-slate-500 transition-all focus:border-slate-900 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1 inline-flex h-8 w-9 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-slate-700"
              >
                <MagnifyingGlass size={15} weight="bold" />
              </button>
            </form>

            {/* Predictive Search Dropdown */}
            {searchOpen ? (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="grid grid-cols-1 divide-y divide-slate-100 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                  <div className="bg-slate-50/70 p-4 lg:col-span-5">
                    <p className="mb-2.5 text-xs font-semibold text-slate-500">
                      Popular Searches
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
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-950"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    <p className="mb-2 text-xs font-semibold text-slate-500">
                      Categories
                    </p>
                    <ul className="space-y-0.5">
                      {matchingCategories.map((cat) => (
                        <li key={cat.id}>
                          <Link
                            to={`/category/${cat.id}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-950"
                          >
                            <span className="truncate">{cat.label}</span>
                            <CaretRight size={12} className="text-slate-400" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 lg:col-span-7">
                    <div className="mb-2.5 flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-500">
                        {searchQuery.trim() ? 'Matching Products' : 'Trending Picks'}
                      </p>
                      {searchQuery.trim() ? (
                        <button
                          type="button"
                          onClick={() => {
                            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                            setSearchOpen(false)
                          }}
                          className="text-xs font-semibold text-slate-900 hover:underline"
                        >
                          See all &rarr;
                        </button>
                      ) : null}
                    </div>

                    {searchResults.length === 0 ? (
                      <p className="py-8 text-center text-xs text-slate-500">
                        No products matching &ldquo;{searchQuery}&rdquo;.
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {searchResults.map((item) => (
                          <Link
                            key={item.id}
                            to={`/product/${item.slug || item.id}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-slate-50"
                          >
                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100 p-1">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-slate-900">
                                {item.name}
                              </p>
                              <p className="text-[11px] capitalize text-slate-500">
                                {item.brand || item.category.replace(/-/g, ' ')}
                              </p>
                            </div>
                            <span className="shrink-0 text-xs font-bold tabular-nums text-slate-900">
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

          {/* Right: Clean Neutral Actions (Zero loud blue) */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              to="/wishlist"
              className="relative inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
              title="Saved Wishlist"
            >
              <Heart
                size={20}
                weight={wishlistCount > 0 ? 'fill' : 'regular'}
                className={wishlistCount > 0 ? 'text-rose-500' : ''}
              />
              <span className="hidden sm:inline">Wishlist</span>
              {wishlistCount > 0 ? (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>

            <Link
              to="/account"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
              title="Account"
            >
              <User size={20} weight="regular" />
              <span className="hidden lg:inline">Account</span>
            </Link>

            {/* Sleek Charcoal Bag Button (Opens Slide-Out Drawer on click; animates count on add) */}
            <motion.button
              type="button"
              onClick={openDrawer}
              animate={bagBumpDelta ? { scale: [1, 1.09, 0.97, 1] } : { scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative inline-flex h-10 items-center gap-2 rounded-full bg-slate-900 px-4 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag size={17} weight="regular" />
              <span className="hidden sm:inline">Bag</span>
              <motion.span
                key={totalItems}
                initial={{ scale: 0.7, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 520, damping: 24 }}
                className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FEB719] px-1.5 text-[11px] font-bold tabular-nums text-slate-950"
              >
                {totalItems}
              </motion.span>

              <AnimatePresence>
                {bagBumpDelta ? (
                  <motion.span
                    key={bagBumpDelta.id}
                    initial={{ opacity: 0, y: 6, scale: 0.75 }}
                    animate={{ opacity: 1, y: -22, scale: 1 }}
                    exit={{ opacity: 0, y: -32, scale: 0.85 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="pointer-events-none absolute -right-1 top-0 rounded-full bg-[#1049EB] px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white shadow-md"
                  >
                    +{bagBumpDelta.delta}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="border-t border-slate-100 bg-white px-3 py-2 md:hidden">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <MagnifyingGlass
              size={16}
              weight="regular"
              className="pointer-events-none absolute left-3.5 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search shoes, fashion, appliances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-full border border-slate-200 bg-[#F4F4F5] pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-500 focus:border-slate-900 focus:bg-white focus:outline-none"
            />
          </form>
        </div>

        {/* Automatic Single-Line Category Carousel Strip (Zero Scrollbar, Strictly 1 Line) */}
        <div className=" relative overflow-hidden border-t border-slate-100 bg-white">
          <div className="mx-auto max-w-[1600px] overflow-hidden">
            <nav
              aria-label="Store categories"
              className="animate-noma-carousel items-center gap-2 py-2 pl-3 sm:pl-5 lg:pl-6"
            >
              {carouselCategories.map((cat, idx) => {
                const isActive =
                  cat.href === '/catalog'
                    ? location.pathname === '/catalog'
                    : location.pathname === cat.href
                return (
                  <Link
                    key={`${cat.id}-${idx}`}
                    to={cat.href}
                    className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-900 font-semibold text-white'
                        : 'bg-[#F4F4F5] text-slate-700 hover:bg-slate-200 hover:text-slate-950'
                    }`}
                  >
                    {cat.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Solid Opaque Mobile Navigation Drawer */}
      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[100] flex lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-900/50 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative z-10 flex h-[100dvh] w-[85vw] max-w-xs flex-col bg-white shadow-2xl">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
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
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-5">
              <p className="mb-2 px-2 text-xs font-semibold text-slate-400">
                Shop Categories
              </p>
              <div className="space-y-1">
                <Link
                  to="/catalog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl bg-slate-100 px-3.5 py-3 text-sm font-semibold text-slate-900"
                >
                  <span>All Products</span>
                  <ArrowRight size={15} className="text-slate-500" />
                </Link>

                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                  >
                    <span className="truncate">{cat.label}</span>
                    <CaretRight size={15} className="text-slate-400" />
                  </Link>
                ))}
              </div>

              <div className="my-5 border-t border-slate-100" />

              <p className="mb-2 px-2 text-xs font-semibold text-slate-400">
                Your Account
              </p>
              <div className="space-y-1">
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Truck size={18} className="text-slate-600" />
                  <span>Track Your Order</span>
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-3">
                    <Heart size={18} className="text-rose-500" />
                    <span>Saved Wishlist</span>
                  </span>
                  {wishlistCount > 0 ? (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-800">
                      {wishlistCount}
                    </span>
                  ) : null}
                </Link>
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <User size={18} className="text-slate-600" />
                  <span>My Account</span>
                </Link>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-4">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  openDrawer()
                }}
                className="flex w-full items-center justify-between rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                <span className="flex items-center gap-2.5">
                  <ShoppingBag size={18} weight="regular" />
                  <span>View Shopping Bag</span>
                </span>
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
