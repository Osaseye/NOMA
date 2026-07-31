import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ProductDetail } from '../../features/storefront/ProductDetail'
import { commerceService } from '../../services/commerceService'
import { useCartStore } from '../../store/cartStore'

export function ProductDetailPage() {
  const { slug } = useParams()
  const addItem = useCartStore((state) => state.addItem)
  const { data: product } = useQuery({ queryKey: ['product', slug], queryFn: () => commerceService.getProductBySlug(slug) })

  if (!product) return null

  const handleAddToCart = () => {
    addItem(product.id)
    toast.success('Added to cart!', {
      description: product.name,
      duration: 3000,
    })
  }

  return <ProductDetail product={product} onAddToCart={handleAddToCart} />
}

