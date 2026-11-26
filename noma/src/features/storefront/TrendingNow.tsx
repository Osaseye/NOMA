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
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        {/* Clean Section Header & Scrollbar-Free Pill Tabs */}
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Trending Now
          </h2>

          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#1049EB] text-white'
                      : 'bg-[#F4F4F5] text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Wide 4-Column Product Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-2.5 text-xs font-semibold text-slate-900 transition-colors hover:border-[#1049EB] hover:bg-[#1049EB] hover:text-white"
          >
            <span>View All Products</span>
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  )
}
