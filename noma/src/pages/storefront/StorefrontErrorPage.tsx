import { ArrowRight, ArrowUpRight, MagnifyingGlass } from '@phosphor-icons/react'
import { useState } from 'react'
import { isRouteErrorResponse, Link, useNavigate, useRouteError } from 'react-router-dom'
import { MiniCartDrawer } from '../../components/commerce/MiniCartDrawer'
import { ProductCard } from '../../components/commerce/ProductCard'
import { StoreFooter } from '../../components/layout/StoreFooter'
import { StoreHeader } from '../../components/layout/StoreHeader'
import { useProductStore } from '../../store/productStore'

const QUICK_DESTINATIONS = [
  {
    title: 'Shoes & Fashion',
    subtitle: 'Single pairs & wholesale bales',
    href: '/category/clothing',
    image: '/images/cat-clothing.png',
  },
  {
    title: 'Kitchen & Catering',
    subtitle: 'Cookware, air fryers & blenders',
    href: '/category/kitchen',
    image: '/images/editorial-kitchen.png',
  },
  {
    title: 'Smart Electronics',
    subtitle: '4K TVs, audio & home tech',
    href: '/category/electronics',
    image: '/images/editorial-smart.png',
  },
  {
    title: 'Power & Appliances',
    subtitle: 'Inverters, cooling & refrigerators',
    href: '/category/appliances',
    image: '/images/editorial-power.png',
  },
]

export function StorefrontErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const products = useProductStore((state) => state.products)
  const featuredProducts = products.slice(0, 4)

  const is404 = !error || (isRouteErrorResponse(error) && error.status === 404)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white text-slate-900">
      <StoreHeader />
      <MiniCartDrawer />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1600px] px-3 py-12 sm:px-5 sm:py-16 lg:px-6">
          {/* Open Editorial 404 Hero Split */}
          <div className="grid grid-cols-1 items-end justify-between gap-8 border-b border-slate-200 pb-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1049EB]">
                {is404 ? 'Error 404 — Page Not Found' : 'Unexpected Error'}
              </span>
              <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl">
                {is404
                  ? "We couldn't find that page, but your next favorite item is right here."
                  : 'Something interrupted this page.'}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
                The link may have changed or been moved. Search across our footwear, fashion, kitchen, and electronics catalog below or jump straight into a department.
              </p>

              {/* Inline Search Bar + Primary Links */}
              <form
                onSubmit={handleSearch}
                className="mt-7 flex max-w-lg items-center gap-2"
              >
                <div className="relative flex-1">
                  <MagnifyingGlass
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search shoes, clothing, air fryers, TVs..."
                    className="h-12 w-full rounded-full border border-slate-200 bg-[#F4F4F5] pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1049EB] focus:bg-white focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[#1049EB] px-6 text-xs font-semibold text-white transition-colors hover:bg-[#0D3EC7] sm:text-sm"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-[#1049EB] px-6 py-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#0D3EC7] sm:text-sm"
              >
                <span>Back to Homepage</span>
                <ArrowRight size={15} weight="bold" />
              </Link>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-xs font-semibold text-slate-900 transition-colors hover:bg-[#F4F4F5] sm:text-sm"
              >
                <span>Explore Full Catalog</span>
              </Link>
              <Link
                to="/support"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3.5 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-950 sm:text-sm"
              >
                <span>Help Center</span>
              </Link>
            </div>
          </div>

          {/* Full-Bleed Visual Department Tiles */}
          <div className="py-12">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Explore Departments
              </h2>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-950 hover:underline"
              >
                <span>All categories</span>
                <ArrowUpRight size={13} weight="bold" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {QUICK_DESTINATIONS.map((dept) => (
                <Link
                  key={dept.title}
                  to={dept.href}
                  className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-900"
                >
                  <img
                    src={dept.image}
                    alt={dept.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 sm:p-5">
                    <div>
                      <h3 className="text-sm font-bold text-white sm:text-base">{dept.title}</h3>
                      <p className="mt-0.5 text-[11px] text-white/75">{dept.subtitle}</p>
                    </div>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-950">
                      <ArrowUpRight size={14} weight="bold" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Trending Picks Section so 404 converts into shopping */}
          {featuredProducts.length > 0 ? (
            <div className="border-t border-slate-200 pt-10">
              <h2 className="mb-5 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Popular Right Now
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
