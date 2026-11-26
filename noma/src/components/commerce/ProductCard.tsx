import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Heart, Plus, Star } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import { toast } from 'sonner'
import type { Product } from '../../types/commerce'
import { useCartStore } from '../../store/cartStore'
import { useUserStore } from '../../store/userStore'
import { formatNaira } from '../../utils/pricing'

const MotionLink = motion.create(Link)
const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface ProductCardProps {
  product: Product
  index?: number
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [added, setAdded] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)
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
    window.setTimeout(() => setAdded(false), 1200)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist')
  }

  return (
    <MotionLink
      to={`/product/${product.slug || product.id}`}
      whileHover={prefersReducedMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
      className="group relative flex h-full flex-col justify-between rounded-2xl border border-slate-200/70 bg-white p-3 transition-[border-color,box-shadow] duration-200 hover:border-slate-300 hover:shadow-md sm:p-4"
    >
      <div>
        {/* Soft Rounded Product Image Well */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F4F4F5]">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-contain p-4 mix-blend-multiply transition-all duration-500 ${
              secondaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
            }`}
          />
          {secondaryImage ? (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain p-4 mix-blend-multiply opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
          ) : null}

          {/* Top-Left Neutral Badge */}
          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1">
            {isOutOfStock ? (
              <span className="rounded-full bg-slate-900/90 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                Out of Stock
              </span>
            ) : discountPercent > 0 ? (
              <span className="rounded-full bg-[#1049EB] px-2.5 py-0.5 text-[11px] font-bold text-white">
                -{discountPercent}%
              </span>
            ) : product.discountBadge ? (
              <span className="rounded-full bg-[#1049EB] px-2.5 py-0.5 text-[11px] font-bold text-white">
                {product.discountBadge}
              </span>
            ) : product.badge ? (
              <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-semibold text-slate-800 shadow-2xs ring-1 ring-slate-200/60">
                {product.badge}
              </span>
            ) : null}
          </div>

          {/* Top-Right Wishlist Button */}
          <motion.button
            type="button"
            onClick={handleWishlist}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              isWishlisted
                ? 'bg-white text-rose-500 shadow-2xs'
                : 'bg-white/90 text-slate-500 shadow-2xs hover:bg-white hover:text-rose-500'
            }`}
          >
            <Heart size={15} weight={isWishlisted ? 'fill' : 'regular'} />
          </motion.button>
        </div>

        {/* Category & Product Title */}
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-medium capitalize text-slate-400">
              {product.brand || product.category.replace(/-/g, ' ')}
            </span>
            {typeof product.rating === 'number' && product.rating > 0 ? (
              <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-slate-600">
                <Star size={12} weight="fill" className="text-[#FEB719]" />
                {product.rating.toFixed(1)}
              </span>
            ) : null}
          </div>

          <h3 className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-slate-900 transition-colors group-hover:text-slate-700 sm:text-sm">
            {product.name}
          </h3>
        </div>
      </div>

      {/* Price & Add Button */}
      <div className="mt-3.5 flex items-center justify-between gap-2 pt-2">
        <div className="min-w-0">
          <span className="block text-sm font-bold tabular-nums text-slate-900 sm:text-base">
            {formatNaira(product.finalPrice)}
          </span>
          {retailCompareAt ? (
            <span className="block text-[11px] tabular-nums text-slate-400 line-through">
              {formatNaira(retailCompareAt)}
            </span>
          ) : null}
        </div>

        {!isOutOfStock ? (
          <motion.button
            type="button"
            onClick={handleAddToCart}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
            className={`inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-full px-3.5 text-xs font-semibold transition-colors ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-white hover:bg-[#1049EB]'
            }`}
          >
            {added ? (
              <>
                <Check size={12} weight="bold" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus size={12} weight="bold" />
                <span>{hasSizes ? 'Options' : 'Add'}</span>
              </>
            )}
          </motion.button>
        ) : null}
      </div>
    </MotionLink>
  )
}
