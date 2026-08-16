import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ProductDetail } from '../../features/storefront/ProductDetail'
import { commerceService } from '../../services/commerceService'
import { useCartStore } from '../../store/cartStore'
import { HiShoppingBag, HiArrowLeft } from 'react-icons/hi2'

export function ProductDetailPage() {
  const { slug } = useParams()
  const addItem = useCartStore((state) => state.addItem)
  const { data: product } = useQuery({ queryKey: ['product', slug], queryFn: () => commerceService.getProductBySlug(slug) })

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#F7F8FA]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
          <HiShoppingBag size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          The requested product is not available in the catalog or backend store database.
        </p>
        <Link
          to="/catalog"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800"
        >
          <HiArrowLeft size={16} /> Return to Products Catalog
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(product)
    toast.success('Added to cart!', {
      description: product.name,
      duration: 3000,
    })
  }

  return <ProductDetail product={product} onAddToCart={handleAddToCart} />
}
