import { Heart, ShoppingBag, Star } from '@phosphor-icons/react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useCartStore } from '../../store/cartStore'
import { useUserStore } from '../../store/userStore'
import type { Product } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'
import { ImagePlaceholder } from '../ui/ImagePlaceholder'

export function ProductCard({
  product,
  showQuickAdd = true,
  onQuickAdd,
  className = '',
}: {
  product: Product
  showQuickAdd?: boolean
  onQuickAdd?: (product: Product) => void
  className?: string
}) {
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)
  const wishlisted = useUserStore((state) => state.wishlistProductIds.includes(product.id))
  const toggleWishlist = useUserStore((state) => state.toggleWishlist)

  const productHref = `/product/${product.slug || product.id}`
  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.finalPrice)
  const discountPercent = hasDiscount && product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.finalPrice) / product.compareAtPrice) * 100)
    : 0
  const hasSizes = Boolean(product.sizes && product.sizes.length > 0)
  const outOfStock = product.stockQty <= 0
  const lowStock = !outOfStock && product.stockQty < 5

  const handleToggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
    toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist')
  }

  const handleQuickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock) return

    if (onQuickAdd) {
      onQuickAdd(product)
      return
    }

    if (hasSizes) {
      toast.info('Select a size option to add to cart')
      navigate(productHref)
      return
    }

    addItem(product.id)
    toast.success(`${product.name} added to cart`)
  }

  return (
    <article
      className={`group flex flex-col justify-between rounded-[8px] border border-[#E5E7EB] bg-white p-3.5 transition-colors hover:border-[#0B1220]/30 ${className}`}
    >
      <div>
        {/* Media well */}
        <Link
          to={productHref}
          aria-label={`View ${product.name}`}
          className="relative block aspect-[4/3] overflow-hidden rounded-[6px] bg-[#F6F7F9] p-3"
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <ImagePlaceholder aspectRatio="h-full w-full" label="" className="border-0" />
          )}

          {/* Max 1 top-left micro badge */}
          {discountPercent > 0 ? (
            <span className="absolute left-2.5 top-2.5 rounded-[4px] bg-[#B91C1C] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
              -{discountPercent}%
            </span>
          ) : product.discountBadge ? (
            <span className="absolute left-2.5 top-2.5 rounded-[4px] bg-[#B91C1C] px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {product.discountBadge}
            </span>
          ) : product.badge ? (
            <span className="absolute left-2.5 top-2.5 rounded-[4px] bg-[#0B1220] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              {product.badge}
            </span>
          ) : null}

          {/* Top-right Wishlist toggle */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            className="absolute right-2.5 top-2.5 flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#5E6675] transition-colors hover:border-[#0B1220]/30 hover:text-[#0B1220]"
          >
            <Heart
              size={15}
              weight={wishlisted ? 'fill' : 'regular'}
              className={wishlisted ? 'text-[#B91C1C]' : 'text-[#5E6675]'}
            />
          </button>
        </Link>

        {/* Meta */}
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-medium uppercase tracking-wider text-[#5E6675]">
              {product.brand || product.category.replace(/-/g, ' ')}
            </span>
            {outOfStock ? (
              <span className="shrink-0 rounded-[4px] border border-[#FECACA] bg-[#FEF2F2] px-1.5 py-0.5 text-[10px] font-semibold text-[#B91C1C]">
                Out of stock
              </span>
            ) : lowStock ? (
              <span className="shrink-0 rounded-[4px] border border-[#FDE68A] bg-[#FFFBEB] px-1.5 py-0.5 text-[10px] font-semibold text-[#B45309]">
                Low stock
              </span>
            ) : null}
          </div>

          <Link to={productHref} className="mt-1 block">
            <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-[#0B1220] transition-colors group-hover:text-[#1049EB]">
              {product.name}
            </h3>
          </Link>

          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <Star size={13} weight="fill" className="shrink-0 text-[#FEB719]" />
            <span className="font-mono font-semibold text-[#0B1220]">
              {(product.rating || 4.8).toFixed(1)}
            </span>
            {typeof product.reviewsCount === 'number' && product.reviewsCount > 0 ? (
              <span className="font-mono text-[11px] text-[#5E6675]">
                ({product.reviewsCount})
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Price & Action */}
      <div className="mt-3 border-t border-[#E5E7EB] pt-3">
        <div className="flex flex-wrap items-baseline gap-2">
          <strong className="font-mono text-sm font-bold tracking-tight text-[#0B1220] sm:text-[15px]">
            {formatNaira(product.finalPrice)}
          </strong>
          {hasDiscount && product.compareAtPrice ? (
            <span className="font-mono text-xs text-[#5E6675] line-through">
              {formatNaira(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        {showQuickAdd ? (
          <button
            type="button"
            disabled={outOfStock}
            onClick={handleQuickAdd}
            className={`mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-[6px] px-3 py-2 text-xs font-semibold transition-colors active:scale-[0.98] ${
              outOfStock
                ? 'cursor-not-allowed border border-[#E5E7EB] bg-[#F6F7F9] text-[#5E6675]'
                : 'bg-[#0B1220] text-white hover:bg-[#1049EB]'
            }`}
          >
            <ShoppingBag size={14} weight="regular" />
            <span>
              {outOfStock ? 'Unavailable' : hasSizes ? 'Select Option' : 'Add to Cart'}
            </span>
          </button>
        ) : null}
      </div>
    </article>
  )
}
