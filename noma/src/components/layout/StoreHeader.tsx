// StoreHeader.tsx
import { useState, useEffect } from 'react'
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
} from 'react-icons/hi2'
import { FiMenu, FiX } from 'react-icons/fi'
import { ImagePlaceholder } from '../ui/ImagePlaceholder'
import { useCartStore } from '../../store/cartStore'

export function StoreHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const count = Object.values(useCartStore((state) => state.items)).reduce(
    (sum, quantity) => sum + quantity,
    0,
  )
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false)
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

          {/* Desktop Center: Search Bar with Soft Shadow */}
          <div className="hidden flex-1 max-w-2xl mx-auto md:block">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault()
                const q = new FormData(e.currentTarget).get('q')
                if (q) {
                  navigate(`/search?q=${encodeURIComponent(String(q))}`)
                }
              }}
              className="relative w-full"
            >
              <HiOutlineMagnifyingGlass
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none stroke-[1.8]"
              />
              <input
                name="q"
                type="text"
                placeholder="Search for products, brands, categories..."
                className="w-full rounded-full bg-white pl-12 pr-6 py-3 text-[14px] font-medium text-[#12203D] placeholder:text-gray-400/80 outline-none shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 focus:border-[#2F5FE3] focus:ring-4 focus:ring-[#2F5FE3]/10 transition-all"
              />
            </form>
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
        <div className="mt-3 md:hidden">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              const q = new FormData(e.currentTarget).get('q')
              if (q) {
                navigate(`/search?q=${encodeURIComponent(String(q))}`)
                setMobileMenuOpen(false)
              }
            }}
            className="relative w-full"
          >
            <HiOutlineMagnifyingGlass
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none stroke-[1.8]"
            />
            <input
              name="q"
              type="text"
              placeholder="Search products, brands..."
              className="w-full rounded-full bg-white pl-10 pr-4 py-2.5 text-[12px] font-medium text-[#12203D] placeholder:text-gray-400 outline-none shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-gray-100/90 focus:border-[#2F5FE3]"
            />
          </form>
        </div>

        {/* Mobile View: Mini Category Strip (ONLY VISIBLE ON HOME PAGE) */}
        {location.pathname === '/' && (
          <div className="mt-3.5 grid grid-cols-5 gap-2 md:hidden pt-2 border-t border-gray-100/60">
            {quickCategories.slice(0, 5).map((c) => (
              <Link
                key={c.label}
                to={c.href}
                className="flex flex-col items-center gap-1.5 group"
              >
                <ImagePlaceholder
                  label=""
                  aspectRatio="h-11 w-11"
                  variant="warm-canvas"
                  className="rounded-2xl shadow-2xs border border-[#DCD9D0]/60 transition-transform active:scale-95 group-hover:scale-105"
                />
                <span className="text-[10px] font-semibold text-[#12203D] tracking-tight text-center truncate max-w-full">
                  {c.label}
                </span>
              </Link>
            ))}
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

              {/* Categories Grid */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-3">
                  Browse Categories
                </span>
                <div className="grid grid-cols-2 gap-2 px-1">
                  {quickCategories.map((c) => (
                    <Link
                      key={c.label}
                      to={c.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl bg-gray-50 p-2.5 text-[12px] font-semibold text-[#12203D] hover:bg-blue-50/70 hover:text-[#2F5FE3] transition-colors"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#2F5FE3]" />
                      <span className="truncate">{c.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Support */}
            <div className="p-4 border-t border-gray-100 bg-[#F8F9FB]">
              <a
                href="https://wa.me/2348000000000"
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

const quickCategories = [
  { label: 'Electronics', href: '/category/electronics' },
  { label: 'Kitchen & Dining', href: '/category/kitchen' },
  { label: 'Home Appliances', href: '/category/appliances' },
  { label: 'Phones & Tablets', href: '/category/phones' },
  { label: 'Home Essentials', href: '/category/home-essentials' },
  { label: 'Outdoor & Mobility', href: '/category/outdoor' },
]