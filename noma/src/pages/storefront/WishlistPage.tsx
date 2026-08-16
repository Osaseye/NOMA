// WishlistPage.tsx - Personal & Public Shareable Wishlist Support
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  HiChevronRight,
  HiHeart,
  HiShoppingBag,
  HiPlus,
  HiShare,
  HiBell,
  HiStar,
  HiUser,
} from 'react-icons/hi2'
import { toast } from 'sonner'
import { useProductStore } from '../../store/productStore'
import { useCartStore } from '../../store/cartStore'
import { useUserStore } from '../../store/userStore'
import { formatNaira } from '../../utils/pricing'

export function WishlistPage() {
  const [searchParams] = useSearchParams()
  const addItem = useCartStore((s) => s.addItem)
  const { products } = useProductStore()
  const { wishlistProductIds, toggleWishlist, profile } = useUserStore()

  // Check if viewing a shared wishlist via URL query parameters (e.g. /wishlist?shared=true&items=p1,p2&owner=Segun)
  const isSharedMode = searchParams.get('shared') === 'true' || searchParams.has('items')
  const sharedOwnerName = searchParams.get('owner') || 'A Noma Shopper'
  const sharedItemIds = useMemo(() => {
    const rawItems = searchParams.get('items')
    return rawItems ? rawItems.split(',').map((s) => s.trim()) : []
  }, [searchParams])

  // Determine active product list depending on personal vs shared view mode
  const displayedProducts = useMemo(() => {
    if (isSharedMode) {
      return products.filter((p) => sharedItemIds.includes(p.id))
    }
    return products.filter((p) => wishlistProductIds.includes(p.id))
  }, [isSharedMode, products, sharedItemIds, wishlistProductIds])

  const handleMoveAllToCart = () => {
    displayedProducts.forEach((product) => {
      addItem(product.id)
    })
    toast.success(`Added all ${displayedProducts.length} items to your cart!`)
  }

  const handleShareWishlist = () => {
    if (wishlistedProducts.length === 0) return
    const ownerName = profile?.name ? profile.name.split(' ')[0] : 'Segun'
    const itemIdsStr = wishlistedProducts.map((p) => p.id).join(',')
    const shareableUrl = `${window.location.origin}/wishlist?shared=true&owner=${encodeURIComponent(
      ownerName
    )}&items=${itemIdsStr}`

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl)
      toast.success('Shareable wishlist link copied to clipboard!', {
        description: 'Anyone with this link can view your curated wishlist items.',
      })
    } else {
      toast.info(`Wishlist URL: ${shareableUrl}`)
    }
  }

  const wishlistedProducts = products.filter((p) => wishlistProductIds.includes(p.id))

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-['Outfit',sans-serif] text-[#12203D] selection:bg-[#2F5FE3] selection:text-white pb-24 pt-3 md:pt-5">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 lg:px-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-gray-500">
          <Link to="/" className="hover:text-[#2F5FE3] transition-colors">
            Home
          </Link>
          <HiChevronRight size={12} className="text-gray-400" />
          <span className="font-bold text-[#12203D]">
            {isSharedMode ? `${sharedOwnerName}'s Shared Wishlist` : 'My Wishlist'}
          </span>
        </nav>

        {/* PUBLIC SHARED WISHLIST CALLOUT BANNER */}
        {isSharedMode && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#12203D] to-[#2F5FE3] p-4 text-white shadow-md flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-xs">
                <HiUser size={22} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold flex items-center gap-2">
                  <span>{sharedOwnerName}'s Curated Wishlist</span>
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 text-[10px] font-black text-emerald-300 uppercase">
                    Public Shared Selection
                  </span>
                </h3>
                <p className="text-xs text-blue-100 font-medium mt-0.5">
                  Browse items chosen by {sharedOwnerName}. Add them to your cart or save them to your own wishlist.
                </p>
              </div>
            </div>

            <Link
              to="/catalog"
              className="rounded-xl bg-white px-4 py-2 text-xs font-black text-[#12203D] hover:bg-blue-50 transition-colors shrink-0"
            >
              Explore Catalog →
            </Link>
          </div>
        )}

        {/* Page Header Bar */}
        <div className="mb-6 border-b border-gray-200/60 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#12203D] sm:text-4xl flex items-center gap-3">
              <span>{isSharedMode ? `${sharedOwnerName}'s Wishlist` : 'My Wishlist'}</span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-extrabold text-[#2F5FE3]">
                {displayedProducts.length}
              </span>
            </h1>
            <p className="mt-1 text-xs md:text-sm font-medium text-gray-500">
              {isSharedMode
                ? `Curated items shared directly by ${sharedOwnerName}`
                : "Items you've saved for later"}
            </p>
          </div>

          {displayedProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleMoveAllToCart}
                className="flex items-center gap-2 rounded-xl bg-[#2F5FE3] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#254ec4] transition-all"
              >
                <HiShoppingBag size={15} />
                <span>Add all to cart</span>
              </button>
              
              {!isSharedMode && (
                <button
                  onClick={handleShareWishlist}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-[#12203D] hover:border-gray-300 transition-all"
                >
                  <HiShare size={15} />
                  <span>Share wishlist link</span>
                </button>
              )}
            </div>
          )}
        </div>

        {displayedProducts.length === 0 ? (
          /* Empty Wishlist State */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white py-24 text-center px-4">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
              <HiHeart size={36} />
            </div>
            <h2 className="text-2xl font-extrabold text-[#12203D]">
              {isSharedMode ? 'No Items in Shared Wishlist' : 'Your Wishlist is Empty'}
            </h2>
            <p className="mt-2 mb-6 text-xs text-gray-500 max-w-md font-medium">
              {isSharedMode
                ? 'This shared wishlist link does not contain active catalog items.'
                : 'Tap the heart icon on any product to save items you love here for later.'}
            </p>
            <Link
              to="/catalog"
              className="rounded-2xl bg-[#2F5FE3] px-8 py-3.5 text-xs font-bold text-white shadow-xs hover:bg-[#254ec4] transition-all"
            >
              Explore Products Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Wishlisted Items Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {displayedProducts.map((product) => {
                const inPersonalWishlist = wishlistProductIds.includes(product.id)
                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-3.5 shadow-2xs hover:border-gray-200 hover:shadow-md transition-all"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 p-2">
                      {product.discountBadge && (
                        <span className="absolute left-2 top-2 z-10 rounded bg-[#E53E3E] px-1.5 py-0.5 text-[9px] font-black text-white">
                          {product.discountBadge}
                        </span>
                      )}

                      {/* Heart Button */}
                      <button
                        onClick={() => {
                          toggleWishlist(product.id)
                          toast.info(
                            inPersonalWishlist
                              ? `Removed ${product.name} from your wishlist`
                              : `Saved ${product.name} to your wishlist`
                          )
                        }}
                        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-2xs transition-colors hover:scale-105"
                        aria-label="Toggle wishlist"
                      >
                        <HiHeart
                          size={15}
                          className={inPersonalWishlist ? 'text-[#2F5FE3]' : 'text-gray-300'}
                        />
                      </button>

                      <Link to={`/product/${product.slug || product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>
                    </div>

                    {/* Product Details */}
                    <div className="mt-3 flex flex-col gap-1">
                      <Link
                        to={`/product/${product.slug || product.id}`}
                        className="text-xs font-bold text-[#12203D] hover:text-[#2F5FE3] line-clamp-2 transition-colors"
                      >
                        {product.name}
                      </Link>

                      {/* Price */}
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-sm font-extrabold text-[#12203D]">
                          {formatNaira(product.finalPrice)}
                        </span>
                      </div>

                      {/* Rating & Stock */}
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <HiStar size={10} className="text-amber-400" />
                          {product.rating || 4.8}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold">● In stock</span>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => {
                          addItem(product.id)
                          toast.success(`Added ${product.name} to your cart`)
                        }}
                        className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border border-blue-200 bg-blue-50/70 py-2 text-xs font-bold text-[#2F5FE3] hover:bg-[#2F5FE3] hover:text-white transition-all active:scale-98"
                      >
                        <HiPlus size={13} />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Price Drop Alert Banner Card */}
            {!isSharedMode && (
              <div className="rounded-3xl border border-blue-100 bg-[#F0F4FF] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2F5FE3] shadow-xs">
                    <HiBell size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#12203D]">Price drop alert</h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      We'll notify you if any item in your wishlist goes on sale.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toast.success('Price drop alerts enabled!')}
                  className="rounded-xl bg-white border border-gray-200 hover:border-[#2F5FE3] px-5 py-2.5 text-xs font-bold text-[#12203D] shadow-2xs hover:text-[#2F5FE3] transition-colors self-start sm:self-auto"
                >
                  Manage alerts
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
