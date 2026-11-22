import { ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/commerce/ProductCard'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useProductStore } from '../../store/productStore'

export function NewArrivals() {
  const { products } = useProductStore()
  const latestProducts = [...products].reverse().slice(0, 4)

  return (
    <section className="border-b border-[#E5E7EB] bg-white py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0B1220] md:text-[1.75rem]">
            New Arrivals
          </h2>
          <Link
            to="/catalog?sort=newest"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1049EB] hover:underline"
          >
            <span>Explore Collection</span>
            <ArrowRight size={14} weight="regular" />
          </Link>
        </div>

        {latestProducts.length === 0 ? (
          <EmptyState
            title="New arrivals coming soon"
            detail="Newly added store items will appear here automatically."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
