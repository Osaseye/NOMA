import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Heart, Plus, Star } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Product } from '../../types/commerce'
import { useCartStore } from '../../store/cartStore'
import { useUserStore } from '../../store/userStore'
import { formatNaira } from '../../utils/pricing'

interface ProductCardProps {
  product: Product
  index?: number
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const [added, setAdded] = useState(false)
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)
  const openDrawer = useCartStore((state) => state.openDrawer)
  const toggleWishlist = useUserStore((state) => state.toggleWishlist)
  const isWishlisted = useUserStore((state) => state.isInWishlist(product.id))

  const retailCompareAt =
    typeof product.compareAtPrice === 'number' && product.compareAtPrice > product.finalPrice
      ? product.compareAtPrice
      : undefined

  const discountPercent = retailCompareAt
    ? Math.round(((retailCompareAt - product.finalPrice) / retailCompareAt) * 100)
    : 0

  const isOutOfStock = product.stockQty <= 0
  const hasSizes = Boolean(product.sizes && product.sizes.length > 0)

  const secondaryImage =
    product.images && product.images.length > 1
      ? product.images.find((img) => img && img !== product.image && !img.includes('unsplash.com'))
      : undefined

  const primarySpec =
    product.specs && product.specs.length > 0
      ? product.specs[0]
      : product.subCategory || product.brand || product.category

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return

    if (hasSizes) {
      toast.info('Select a size option to add to bag')
      navigate(`/product/${product.slug || product.id}`)
      return
    }

    addItem(product.id)
    setAdded(true)
    openDrawer()
    window.setTimeout(() => setAdded(false), 1200)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist')
  }

  return (
    <Link
      to={`/product/${product.slug || product.id}`}
      className="group relative flex flex-col justify-between bg-white p-4 transition-colors duration-200 hover:bg-[#FAFAFA] sm:p-5"
    >
      <div>
        {/* Cell Top Technical Meta Bar */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            {typeof index === 'number' ? (
              <span className="font-mono text-[10px] font-medium text-[#71717A]">
                {String(index + 1).padStart(2, '0')} /
              </span>
            ) : null}
            <span className="truncate font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#71717A]">
              {product.brand || product.category.replace(/-/g, ' ')}
            </span>
          </div>

          <button
            type="button"
            onClick={handleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`inline-flex h-7 w-7 shrink-0 items-center justify-center border transition-colors ${
              isWishlisted
                ? 'border-[#09090B] bg-[#09090B] text-white'
                : 'border-[#E4E4E7] bg-white text-[#71717A] hover:border-[#09090B] hover:text-[#09090B]'
            }`}
          >
            <Heart size={13} weight={isWishlisted ? 'fill' : 'regular'} />
          </button>
        </div>

        {/* 4:5 Concrete Studio Image Well with 2nd-Image Hover Swap */}
        <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#E4E4E7] bg-[#F4F4F5]">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-contain p-5 mix-blend-multiply transition-all duration-500 ${
              secondaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
            }`}
          />
          {secondaryImage ? (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain p-5 mix-blend-multiply opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
          ) : null}

          {/* Top-Left Architectural Badge */}
          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1">
            {isOutOfStock ? (
              <span className="bg-[#09090B] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
                SOLD OUT
              </span>
            ) : discountPercent > 0 ? (
              <span className="bg-[#FEB719] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#09090B]">
                -{discountPercent}%
              </span>
            ) : product.discountBadge ? (
              <span className="bg-[#FEB719] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#09090B]">
                {product.discountBadge}
              </span>
            ) : product.badge ? (
              <span className="border border-[#09090B] bg-white px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#09090B]">
                {product.badge}
              </span>
            ) : null}
          </div>

          {/* Slide-Up Quick Add Bar on Desktop + Always-Accessible Trigger on Mobile */}
          {!isOutOfStock ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className={`absolute inset-x-0 bottom-0 flex h-10 items-center justify-center gap-1.5 border-t font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                added
                  ? 'translate-y-0 border-[#16A34A] bg-[#16A34A] text-white opacity-100'
                  : 'border-[#09090B] bg-[#09090B]/95 text-white hover:border-[#1049EB] hover:bg-[#1049EB] md:translate-y-full md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100'
              }`}
            >
              {added ? (
                <>
                  <Check size={13} weight="bold" />
                  <span>ADDED TO BAG</span>
                </>
              ) : (
                <>
                  <Plus size={13} weight="bold" />
                  <span>{hasSizes ? 'SELECT SIZE' : 'ADD TO BAG'}</span>
                </>
              )}
            </button>
          ) : null}
        </div>

        {/* Title & Technical Spec Line */}
        <div className="mt-3.5">
          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-[#09090B] transition-colors group-hover:text-[#1049EB]">
            {product.name}
          </h3>
          {primarySpec ? (
            <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
              {primarySpec}
            </p>
          ) : null}
        </div>
      </div>

      {/* Bottom Price & Rating Row */}
      <div className="mt-3 flex items-baseline justify-between gap-2 border-t border-[#E4E4E7] pt-2.5">
        <div className="flex flex-wrap items-baseline gap-1.5">
          <span className="font-mono text-sm font-bold tabular-nums text-[#09090B]">
            {formatNaira(product.finalPrice)}
          </span>
          {retailCompareAt ? (
            <span className="font-mono text-[11px] tabular-nums text-[#71717A] line-through">
              {formatNaira(retailCompareAt)}
            </span>
          ) : null}
        </div>

        {typeof product.rating === 'number' && product.rating > 0 ? (
          <div className="flex shrink-0 items-center gap-1">
            <Star size={11} weight="fill" className="text-[#FEB719]" />
            <span className="font-mono text-[10px] font-medium tabular-nums text-[#71717A]">
              {product.rating.toFixed(1)}
            </span>
          </div>
        ) : null}
      </div>
    </Link>
  )
}
