import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CaretRight,
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

const QUICK_SEARCH_CHIPS = ['Shoes', 'Sneakers', 'Smart TV', 'Air Fryer', 'Soundbar', 'Cookware']

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

  const totalItems = useMemo(
    () => toCartLineEntries(items).reduce((sum, entry) => sum + entry.quantity, 0),
    [items],
  )

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
        {/* Main Breathable Header Row */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6 lg:px-8">
          {/* Left: Hamburger + Brand Logo */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 transition-colors hover:bg-slate-50 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <List size={20} weight="regular" />
            </button>

            <Link to="/" className="flex shrink-0 items-center">
              <img
                src="/logo.PNG"
                alt="Noma"
                className="h-8 w-auto object-contain sm:h-9"
              />
            </Link>
          </div>

          {/* Center: Clean Spacious Search Bar (Desktop & Tablet) */}
          <div
            ref={searchContainerRef}
            className="relative hidden max-w-xl flex-1 md:block"
          >
            <form onSubmit={handleSearch} className="relative flex w-full items-center">
              <MagnifyingGlass
                size={17}
                weight="regular"
                className="pointer-events-none absolute left-4 text-slate-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search shoes, fashion, electronics, kitchen & more..."
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSearchOpen(true)
                }}
                className="h-11 w-full rounded-full border border-slate-200 bg-slate-50/80 pl-11 pr-20 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-[#1049EB] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1049EB]/10"
              />
              <button
                type="submit"
                className="absolute right-1.5 inline-flex h-8 items-center rounded-full bg-[#1049EB] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#0D3BC2]"
              >
                Search
              </button>
            </form>

            {/* Clean Predictive Search Dropdown */}
            {searchOpen ? (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="grid grid-cols-1 divide-y divide-slate-100 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                  {/* Left: Popular Searches & Categories */}
                  <div className="bg-slate-50/60 p-4 lg:col-span-5">
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
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-[#1049EB] hover:text-[#1049EB]"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    <p className="mb-2 text-xs font-semibold text-slate-500">
                      Categories
                    </p>
                    <ul className="space-y-1">
                      {matchingCategories.map((cat) => (
                        <li key={cat.id}>
                          <Link
                            to={`/category/${cat.id}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-white hover:text-[#1049EB]"
                          >
                            <span>{cat.label}</span>
                            <CaretRight size={13} className="text-slate-400" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Matching Products */}
                  <div className="p-4 lg:col-span-7">
                    <div className="mb-2.5 flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-500">
                        {searchQuery.trim() ? 'Matching Products' : 'Popular Picks'}
                      </p>
                      {searchQuery.trim() ? (
                        <button
                          type="button"
                          onClick={() => {
                            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                            setSearchOpen(false)
                          }}
                          className="text-xs font-semibold text-[#1049EB] hover:underline"
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

          {/* Right: Clean Uncluttered Utility Actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              to="/orders"
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:inline-flex"
            >
              <Truck size={17} weight="regular" />
              <span>Track Order</span>
            </Link>

            <Link
              to="/wishlist"
              className="relative inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
              title="Saved Wishlist"
            >
              <Heart
                size={19}
                weight={wishlistCount > 0 ? 'fill' : 'regular'}
                className={wishlistCount > 0 ? 'text-rose-500' : ''}
              />
              <span className="hidden sm:inline">Saved</span>
              {wishlistCount > 0 ? (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1.5 text-[11px] font-bold text-slate-800">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>

            <Link
              to="/account"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:inline-flex"
              title="My Account"
            >
              <User size={19} weight="regular" />
            </Link>

            {/* Clean Cobalt Bag Button (Triggers Slide-Out Drawer) */}
            <button
              type="button"
              onClick={openDrawer}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#1049EB] px-4 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#0D3BC2]"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag size={17} weight="bold" />
              <span className="hidden sm:inline">Bag</span>
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-[11px] font-bold tabular-nums text-white">
                {totalItems}
              </span>
            </button>
          </div>
        </div>

        {/* Clean Secondary Category Strip (Desktop) — Breathable & Dynamic */}
        <div className="hidden border-t border-slate-100 bg-slate-50/70 lg:block">
          <div className="mx-auto flex h-11 max-w-7xl items-center justify-between px-8">
            <nav className="flex items-center gap-1 overflow-x-auto">
              <Link
                to="/catalog"
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  location.pathname === '/catalog'
                    ? 'bg-[#1049EB] text-white'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                All Categories
              </Link>
              {categories.map((cat) => {
                const isActive = location.pathname === `/category/${cat.id}`
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#1049EB] text-white'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    {cat.label}
                  </Link>
                )
              })}
            </nav>

            <button
              type="button"
              onClick={openDrawer}
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-[#1049EB]"
            >
              <MapPin size={14} weight="fill" className="text-[#1049EB]" />
              <span>Delivering to:</span>
              <strong className="font-semibold text-slate-800">{deliveryState}</strong>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="border-t border-slate-100 bg-white px-4 py-2.5 md:hidden">
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
              className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1049EB] focus:bg-white focus:outline-none"
            />
          </form>
        </div>
      </header>

      {/* Solid Opaque Mobile Navigation Drawer (Rendered OUTSIDE header so backdrop-blur never makes it transparent!) */}
      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[100] flex lg:hidden" role="dialog" aria-modal="true">
          {/* Darkened Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* 100% Solid White Sidebar Panel */}
          <div className="relative z-10 flex h-[100dvh] w-[85vw] max-w-xs flex-col bg-white shadow-2xl">
            {/* Drawer Header */}
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

            {/* Scrollable Categories List */}
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <p className="mb-2 px-2 text-xs font-semibold text-slate-400">
                Shop Categories
              </p>
              <div className="space-y-1">
                <Link
                  to="/catalog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-[#EEF3FE] hover:text-[#1049EB]"
                >
                  <span>All Products</span>
                  <ArrowRight size={15} className="text-slate-400" />
                </Link>

                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    <span>{cat.label}</span>
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
                  <Truck size={18} className="text-[#1049EB]" />
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
                  <User size={18} className="text-slate-500" />
                  <span>My Account</span>
                </Link>
              </div>
            </div>

            {/* Drawer Footer CTA */}
            <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-4">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  openDrawer()
                }}
                className="flex w-full items-center justify-between rounded-xl bg-[#1049EB] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0D3BC2]"
              >
                <span className="flex items-center gap-2.5">
                  <ShoppingBag size={18} weight="bold" />
                  <span>View Shopping Bag</span>
                </span>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold">
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
