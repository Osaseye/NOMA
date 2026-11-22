import { ProductCard } from '../../components/commerce/ProductCard'
import { SectionTitle } from '../../design-system/components/SectionTitle'
import type { Product } from '../../types/commerce'

export function ProductGridSection({
  title,
  detail,
  products,
}: {
  title: string
  detail: string
  products: Product[]
}) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl space-y-6 px-4 md:px-8">
        <SectionTitle title={title} detail={detail} />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
