import { ProductCard } from '../../components/commerce/ProductCard'
import { SectionTitle } from '../../design-system/components/SectionTitle'
import type { Product } from '../../types/commerce'

export function ProductGridSection({ title, detail, products }: { title: string; detail: string; products: Product[] }) {
  return (
    <section className="section">
      <SectionTitle title={title} detail={detail} />
      <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    </section>
  )
}
