import { MessageCircle, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-card-body">
        <span className="badge">{product.badge}</span>
        <h3>{product.name}</h3>
        <div className="product-meta">
          <strong>{formatNaira(product.finalPrice)}</strong>
          <span><Star size={14} fill="currentColor" /> {product.rating}</span>
        </div>
        {product.bulky && <p className="delivery-note">Delivery calculated by location.</p>}
        <a className="chat-link" href={`/whatsapp-order?product=${product.slug}`}><MessageCircle size={16} /> Chat about this</a>
      </div>
    </article>
  )
}
