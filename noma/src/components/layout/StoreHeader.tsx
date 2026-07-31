// StoreHeader.tsx
import { LayoutGrid, Menu, User, Search, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'

export function StoreHeader() {
  const navigate = useNavigate()
  const count = Object.values(useCartStore((state) => state.items)).reduce(
    (sum, quantity) => sum + quantity,
    0,
  )
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      {/* Main header row */}
      <div className="flex flex-wrap items-center justify-between gap-y-4 px-4 py-4 md:px-8 lg:px-12 md:flex-nowrap">
        {/* Left side: Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile: hamburger */}
          <button
            className="shrink-0 text-[#12203D] md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img src="/logo.PNG" alt="Noma logo" className="h-20 w-32 object-contain" />
          </Link>
        </div>

        {/* Center: Search bar */}
        <div className="order-last flex w-full justify-center md:order-none md:w-auto md:flex-1 md:px-12">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              const q = new FormData(e.currentTarget).get('q')
              navigate(`/search?q=${encodeURIComponent(String(q ?? ''))}`)
            }}
            className="flex w-full max-w-2xl items-center gap-3 rounded-full bg-white px-5 py-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition-shadow focus-within:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)]"
          >
            <Search size={18} className="shrink-0 text-[#12203D]/40" strokeWidth={2.5} />
            <input
              name="q"
              placeholder="Search products,brands,categories..."
              className="w-full bg-transparent text-[15px] font-medium text-[#12203D] outline-none placeholder:text-[#12203D]/40"
            />
          </form>
        </div>

        {/* Right side: Desktop nav */}
        <nav className="hidden items-center rounded-full border border-black/5 bg-white/80 px-2 py-1.5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] backdrop-blur-md md:flex" aria-label="Primary">
          {/* Categories - Blue hover, translate up animation */}
          <Link
            to="/catalog"
            className="group flex flex-col items-center gap-0.5 rounded-full px-5 py-2 text-[12px] font-bold text-[#12203D]/70 transition-all duration-300 hover:bg-[#F0F4FF] hover:text-[#2F5FE3]"
          >
            <LayoutGrid size={20} strokeWidth={2.2} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
            Categories
          </Link>
          
          <div className="h-8 w-px bg-black/5" />
          
          {/* My Orders - Orange hover, rotate animation */}
          <Link
            to="/orders"
            className="group flex flex-col items-center gap-0.5 rounded-full px-5 py-2 text-[12px] font-bold text-[#12203D]/70 transition-all duration-300 hover:bg-[#FFF4E5] hover:text-[#F5A623]"
          >
            <User size={20} strokeWidth={2.2} className="transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
            My Orders
          </Link>
          
          <div className="h-8 w-px bg-black/5" />
          
          {/* Cart - Green hover, bounce/scale animation */}
          <Link
            to="/cart"
            className="group relative flex flex-col items-center gap-0.5 rounded-full px-5 py-2 text-[12px] font-bold text-[#12203D]/70 transition-all duration-300 hover:bg-[#E8F5EB] hover:text-[#10B981]"
          >
            <span className="relative">
              <ShoppingBag size={20} strokeWidth={2.2} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
              {count > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#10B981] text-[10px] font-extrabold text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#059669]">
                  {count}
                </span>
              )}
            </span>
            Cart
          </Link>
        </nav>

        {/* Mobile: cart icon */}
        <Link to="/cart" className="relative shrink-0 md:hidden" aria-label="Cart">
          <ShoppingBag size={24} strokeWidth={2.5} className="text-[#12203D]" />
          {count > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#2F5FE3] text-[9px] font-bold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile: quick category icon strip */}
      <div className="flex gap-3 overflow-x-auto border-t border-black/5 px-4 py-3 md:hidden">
        {quickCategories.map((c) => (
          <Link
            key={c.label}
            to={c.href}
            className="flex min-w-[56px] shrink-0 flex-col items-center gap-1"
          >
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[#F7F8FA]">
              {c.image ? (
                <img src={c.image} alt={c.label} className="h-8 w-8 object-contain" />
              ) : (
                <c.icon size={20} className="text-[#12203D]/70" />
              )}
            </span>
            <span className="text-center text-[10px] font-bold leading-tight text-[#12203D]/70">
              {c.label}
            </span>
          </Link>
        ))}
      </div>
    </header>
  )
}

import { Grid2x2, Refrigerator, Smartphone, Tv } from 'lucide-react'

const quickCategories = [
  { label: 'Electronics', href: '/category/electronics', image: '/products/category-electronics.png', icon: Tv },
  { label: 'Kitchen', href: '/category/kitchen', image: '/products/category-kitchen.png', icon: Refrigerator },
  { label: 'Appliances', href: '/category/appliances', image: '/products/category-appliances.png', icon: Refrigerator },
  { label: 'Phones', href: '/category/phones', image: '/products/category-phones.png', icon: Smartphone },
  { label: 'More', href: '/catalog', image: null, icon: Grid2x2 },
]