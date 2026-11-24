import {
  ArrowRight,
  CaretRight,
  Heart,
  ShareNetwork,
  ShoppingBag,
  User,
} from '@phosphor-icons/react'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ProductCard } from '../../components/commerce/ProductCard'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useCartStore } from '../../store/cartStore'
import { useProductStore } from '../../store/productStore'
import { useUserStore } from '../../store/userStore'

export function WishlistPage() {
  const [searchParams] = useSearchParams()
  const addItem = useCartStore((s) => s.addItem)
  const openDrawer = useCartStore((s) => s.openDrawer)
  const { products } = useProductStore()
  const { wishlistProductIds, profile } = useUserStore()

  const isSharedMode = searchParams.get('shared') === 'true' || searchParams.has('items')
  const sharedOwnerName = searchParams.get('owner') || 'A Noma Shopper'
  const sharedItemIds = useMemo(() => {
    const rawItems = searchParams.get('items')
    return rawItems ? rawItems.split(',').map((s) => s.trim()) : []
  }, [searchParams])

  const displayedProducts = useMemo(() => {
    if (isSharedMode) {
      return products.filter((p) => sharedItemIds.includes(p.id))
    }
    return products.filter((p) => wishlistProductIds.includes(p.id))
  }, [isSharedMode, products, sharedItemIds, wishlistProductIds])

  const wishlistedProducts = products.filter((p) => wishlistProductIds.includes(p.id))

  const handleMoveAllToCart = () => {
    let addedCount = 0
    displayedProducts.forEach((product) => {
      if (product.stockQty <= 0) return
      if (product.sizes && product.sizes.length > 0) {
        const availableSize = product.sizes.find((s) => s.stockQty > 0)
        if (availableSize) {
          addItem(product.id, availableSize.size, 1)
          addedCount += 1
        }
        return
      }
      addItem(product.id, undefined, 1)
      addedCount += 1
    })

    if (addedCount > 0) {
      openDrawer()
    } else {
      toast.info('No in-stock items could be added automatically.')
    }
  }

  const handleShareWishlist = async () => {
    if (wishlistedProducts.length === 0) {
      toast.info('Save products to your wishlist before sharing.')
      return
    }
    const ownerName = profile.name ? profile.name.trim().split(' ')[0] : 'My'
    const itemIdsStr = wishlistedProducts.map((p) => p.id).join(',')
    const shareableUrl = `${window.location.origin}/wishlist?shared=true&owner=${encodeURIComponent(
      ownerName === 'My' ? 'Noma Shopper' : ownerName,
    )}&items=${encodeURIComponent(itemIdsStr)}`

    const shareTitle = `${ownerName === 'My' ? 'My' : `${ownerName}'s`} Wishlist on NOMA`
    const shareText = `Browse ${wishlistedProducts.length} saved items on NOMA.`

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareableUrl,
        })
        return
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl)
      toast.success('Shareable wishlist link copied to clipboard.')
    } else {
      toast.info(`Wishlist URL: ${shareableUrl}`)
    }
  }

  const pageTitle = isSharedMode
    ? `${sharedOwnerName}'s Wishlist | NOMA Nigeria`
    : 'Saved Wishlist | NOMA Marketplace'
  const metaDescription = isSharedMode
    ? `Explore ${displayedProducts.length} products chosen by ${sharedOwnerName} on NOMA.`
    : 'Manage your saved favorite products on NOMA Marketplace.'
  const ogImage = displayedProducts[0]?.image || '/icon.png'
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '/wishlist'

  return (
    <div className="min-h-screen pb-24 pt-5 text-slate-900">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NOMA Marketplace" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={currentUrl} />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Clean Friendly Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="transition-colors hover:text-[#1049EB]">
            Home
          </Link>
          <CaretRight size={12} weight="regular" />
          <span className="font-semibold text-slate-900">
            {isSharedMode ? `${sharedOwnerName}'s Wishlist` : 'Saved Wishlist'}
          </span>
        </nav>

        {/* Shared Wishlist Banner */}
        {isSharedMode ? (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#1049EB] p-5 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                <User size={19} weight="bold" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  {sharedOwnerName}&apos;s Shared Wishlist
                </h2>
                <p className="mt-0.5 text-xs text-white/80">
                  Add items from this shared list directly to your bag.
                </p>
              </div>
            </div>

            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-100"
            >
              <span>Browse All Products</span>
              <ArrowRight size={13} weight="bold" />
            </Link>
          </div>
        ) : null}

        {/* Page Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {isSharedMode ? `${sharedOwnerName}'s Wishlist` : 'Saved Wishlist'}
              </h1>
              <span className="rounded-full bg-[#EEF3FE] px-3 py-0.5 text-xs font-bold text-[#1049EB]">
                {displayedProducts.length}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              {isSharedMode
                ? `Items saved and shared by ${sharedOwnerName}.`
                : 'Keep track of your favorite shoes, fashion, and home items.'}
            </p>
          </div>

          {displayedProducts.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleMoveAllToCart}
                className="inline-flex items-center gap-2 rounded-full bg-[#1049EB] px-5 py-2.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#0D3BC2]"
              >
                <ShoppingBag size={15} weight="bold" />
                <span>Add All to Bag</span>
              </button>

              {!isSharedMode ? (
                <button
                  type="button"
                  onClick={handleShareWishlist}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <ShareNetwork size={15} weight="regular" />
                  <span>Share Wishlist</span>
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        {displayedProducts.length === 0 ? (
          <EmptyState
            icon={<Heart size={24} weight="regular" />}
            title={isSharedMode ? 'No items in this shared wishlist' : 'Your wishlist is empty'}
            detail={
              isSharedMode
                ? 'This shared wishlist link does not contain any active products.'
                : 'Tap the heart icon on any product card to save your favorite items here.'
            }
            action={
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center rounded-full bg-[#1049EB] px-6 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#0D3BC2]"
              >
                Start Shopping
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
