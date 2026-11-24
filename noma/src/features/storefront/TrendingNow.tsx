import { ArrowRight } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/commerce/ProductCard'
import { useProductStore } from '../../store/productStore'

export function TrendingNow() {
  const { products, categories } = useProductStore()
  const [activeTab, setActiveTab] = useState('all')

  const filterTabs = [
    { id: 'all', label: 'All' },
    ...categories.slice(0, 6).map((cat) => ({
      id: cat.id,
      label: cat.label,
    })),
  ]

  const filteredProducts =
    activeTab === 'all'
      ? products
      : products.filter(
          (p) =>
            p.category === activeTab ||
            p.subCategory === activeTab ||
            (activeTab === 'kitchen' && p.category === 'cooking') ||
            (activeTab === 'cooking' && p.category === 'kitchen'),
        )

  const displayProducts = (filteredProducts.length > 0 ? filteredProducts : products).slice(0, 8)

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Clean Section Header & Pill Tabs */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Trending Now
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Popular picks across footwear, fashion, home, and electronics
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#1049EB] text-white shadow-2xs'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Breathable 4-Column Rounded Card Grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-semibold text-slate-800 shadow-2xs transition-colors hover:border-[#1049EB] hover:text-[#1049EB]"
          >
            <span>View All Products</span>
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  )
}
