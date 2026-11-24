import { ArrowUpRight } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/commerce/ProductCard'
import { useProductStore } from '../../store/productStore'

export function TrendingNow() {
  const { products, categories } = useProductStore()
  const [activeTab, setActiveTab] = useState('all')

  const filterTabs = [
    { id: 'all', label: 'ALL UNITS' },
    ...categories.slice(0, 5).map((cat) => ({
      id: cat.id,
      label: cat.label.toUpperCase(),
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
    <section className="border-b border-[#E4E4E7] bg-white">
      <div className="mx-auto max-w-[1600px] border-x border-[#E4E4E7]">
        {/* Architectural Exposed Section Header Bar */}
        <div className="flex flex-col justify-between border-b border-[#E4E4E7] lg:flex-row lg:items-stretch">
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1049EB]">
                01 / CURATED MATRIX
              </span>
              <h2 className="mt-0.5 text-xl font-bold tracking-tight text-[#09090B] sm:text-2xl">
                Trending Hardware
              </h2>
            </div>

            <Link
              to="/catalog"
              className="inline-flex items-center gap-1 border border-[#E4E4E7] bg-[#FAFAFA] px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#09090B] transition-colors hover:border-[#09090B] lg:hidden"
            >
              <span>VIEW ALL</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Exposed Filter Tabs + View All Cell */}
          <div className="flex items-stretch divide-x divide-[#E4E4E7] overflow-x-auto border-t border-[#E4E4E7] lg:border-l lg:border-t-0">
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative shrink-0 px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors sm:px-5 ${
                    isActive
                      ? 'bg-[#09090B] text-white'
                      : 'bg-white text-[#52525B] hover:bg-[#FAFAFA] hover:text-[#09090B]'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}

            <Link
              to="/catalog"
              className="hidden items-center gap-1.5 bg-[#FAFAFA] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#09090B] transition-colors hover:bg-[#1049EB] hover:text-white lg:inline-flex"
            >
              <span>ALL CATALOG</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* 4-Column Exposed 1px Hairline Product Matrix (Zero Floating Gaps) */}
        <div className="grid grid-cols-2 gap-px bg-[#E4E4E7] md:grid-cols-3 lg:grid-cols-4">
          {displayProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}
