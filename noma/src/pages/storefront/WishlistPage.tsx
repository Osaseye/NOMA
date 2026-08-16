// WishlistPage.tsx - Replicating Section 2 of ChatGPT Image Aug 14, 2026, 09_34_22 PM.png
import { Link } from 'react-router-dom'
import {
  HiChevronRight,
  HiHeart,
  HiShoppingBag,
  HiPlus,
  HiShare,
  HiBell,
  HiStar,
} from 'react-icons/hi2'
import { toast } from 'sonner'
import { useProductStore } from '../../store/productStore'
import { useCartStore } from '../../store/cartStore'
import { useUserStore } from '../../store/userStore'
import { formatNaira } from '../../utils/pricing'

export function WishlistPage() {
  const addItem = useCartStore((s) => s.addItem)
  const { products } = useProductStore()
  const { wishlistProductIds, toggleWishlist } = useUserStore()

  // Filter products in wishlist
  const wishlistedProducts = products.filter((p) => wishlistProductIds.includes(p.id))

  const handleMoveAllToCart = () => {
    wishlistedProducts.forEach((product) => {
      addItem(product)
    })
    toast.success(`Moved all ${wishlistedProducts.length} items to cart!`)
  }

  const handleShareWishlist = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Wishlist link copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-['Outfit',sans-serif] text-[#12203D] selection:bg-[#2F5FE3] selection:text-white pb-24 pt-3 md:pt-5">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 lg:px-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-gray-500">
          <Link to="/" className="hover:text-[#2F5FE3] transition-colors">
            Home
          </Link>
          <HiChevronRight size={12} className="text-gray-400" />
          <span className="font-bold text-[#12203D]">Wishlist</span>
        </nav>

        {/* Page Header */}
        <div className="mb-6 border-b border-gray-200/60 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#12203D] sm:text-4xl flex items-center gap-3">
              <span>My Wishlist</span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-extrabold text-[#2F5FE3]">
                {wishlistedProducts.length}
              </span>
            </h1>
            <p className="mt-1 text-xs md:text-sm font-medium text-gray-500">
              Items you've saved for later
            </p>
          </div>

          {wishlistedProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleMoveAllToCart}
                className="flex items-center gap-2 rounded-xl bg-[#2F5FE3] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#254ec4] transition-all"
              >
                <HiShoppingBag size={15} />
                <span>Move all to cart</span>
              </button>
              <button
                onClick={handleShareWishlist}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-[#12203D] hover:border-gray-300 transition-all"
              >
                <HiShare size={15} />
                <span>Share wishlist</span>
              </button>
            </div>
          )}
        </div>

        {wishlistedProducts.length === 0 ? (
          /* Empty Wishlist State */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white py-24 text-center px-4">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
              <HiHeart size={36} />
            </div>
            <h2 className="text-2xl font-extrabold text-[#12203D]">Your Wishlist is Empty</h2>
            <p className="mt-2 mb-6 text-xs text-gray-500 max-w-md">
              Tap the heart icon on any product to save items you love here for later.
            </p>
            <Link
              to="/catalog"
              className="rounded-2xl bg-[#2F5FE3] px-8 py-3.5 text-xs font-bold text-white shadow-xs hover:bg-[#254ec4] transition-all"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Wishlisted Items Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {wishlistedProducts.map((product) => (
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

                    {/* Solid Blue Heart Button */}
                    <button
                      onClick={() => {
                        toggleWishlist(product.id)
                        toast.info(`Removed ${product.name} from wishlist`)
                      }}
                      className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-2xs transition-colors hover:scale-105"
                      aria-label="Remove from wishlist"
                    >
                      <HiHeart size={15} className="text-[#2F5FE3]" />
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
                        {product.rating}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold">● In stock</span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => {
                        addItem(product)
                        toast.success(`Added ${product.name} to cart`)
                      }}
                      className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border border-blue-200 bg-blue-50/70 py-2 text-xs font-bold text-[#2F5FE3] hover:bg-[#2F5FE3] hover:text-white transition-all active:scale-98"
                    >
                      <HiPlus size={13} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Drop Alert Banner Card */}
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
          </div>
        )}
      </div>
    </div>
  )
}
