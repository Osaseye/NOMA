import {
  ArrowRight,
  Bell,
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
    ? `${sharedOwnerName}'s Curated Wishlist | NOMA Nigeria`
    : 'Saved Wishlist | NOMA Marketplace'
  const metaDescription = isSharedMode
    ? `Explore ${displayedProducts.length} curated products chosen by ${sharedOwnerName} on NOMA.`
    : 'Manage your saved favorite products on NOMA Marketplace.'
  const ogImage = displayedProducts[0]?.image || '/icon.png'
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '/wishlist'

  return (
    <div className="min-h-screen bg-white pb-24 text-[#09090B]">
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

      <div className="mx-auto max-w-[1600px] border-x border-[#E4E4E7]">
        {/* Architectural Breadcrumb Strip */}
        <div className="flex items-center justify-between border-b border-[#E4E4E7] bg-[#FAFAFA] px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-[#71717A] sm:px-8">
          <nav className="flex items-center gap-2">
            <Link to="/" className="transition-colors hover:text-[#09090B]">
              INDEX
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#09090B]">
              {isSharedMode ? `${sharedOwnerName.toUpperCase()}'S WISHLIST` : 'SAVED WISHLIST'}
            </span>
          </nav>
          <span>[{displayedProducts.length} SAVED]</span>
        </div>

        {/* Shared Wishlist Banner */}
        {isSharedMode ? (
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4E4E7] bg-[#09090B] px-6 py-4 text-white sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/20 bg-white/10 text-white">
                <User size={18} weight="regular" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-bold text-white">
                    {sharedOwnerName}&apos;s Curated Wishlist
                  </h2>
                  <span className="border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#FEB719]">
                    SHARED SELECTION
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-white/75">
                  Add items from this shared collection to your bag or personal wishlist.
                </p>
              </div>
            </div>

            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 bg-white px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#09090B] transition-colors hover:bg-[#FAFAFA]"
            >
              <span>Explore Catalog</span>
              <ArrowRight size={13} weight="regular" />
            </Link>
          </div>
        ) : null}

        {/* Page Header Bar */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#E4E4E7] p-6 sm:p-10 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1049EB]">
              ARCHIVE / SAVED HARDWARE
            </span>
            <div className="mt-1 flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-[#09090B] sm:text-4xl">
                {isSharedMode ? `${sharedOwnerName}'s Wishlist` : 'Saved Wishlist'}
              </h1>
              <span className="border border-[#E4E4E7] bg-[#F4F4F5] px-2.5 py-0.5 font-mono text-xs font-bold text-[#09090B]">
                {String(displayedProducts.length).padStart(2, '0')}
              </span>
            </div>
            <p className="mt-2 text-xs text-[#52525B] sm:text-sm">
              {isSharedMode
                ? `Curated products shared by ${sharedOwnerName}.`
                : 'Hardware saved for specification comparison or instant bag transfer.'}
            </p>
          </div>

          {displayedProducts.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleMoveAllToCart}
                className="inline-flex items-center gap-2 bg-[#09090B] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#1049EB]"
              >
                <ShoppingBag size={15} weight="regular" />
                <span>Add All to Bag</span>
              </button>

              {!isSharedMode ? (
                <button
                  type="button"
                  onClick={handleShareWishlist}
                  className="inline-flex items-center gap-2 border border-[#E4E4E7] bg-white px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#09090B] transition-colors hover:border-[#09090B] hover:bg-[#FAFAFA]"
                >
                  <ShareNetwork size={15} weight="regular" />
                  <span>Share Link</span>
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        {displayedProducts.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={<Heart size={24} weight="regular" />}
              title={isSharedMode ? 'No Items in Shared Wishlist' : 'Your Wishlist is Empty'}
              detail={
                isSharedMode
                  ? 'This shared wishlist link does not reference any active catalog items.'
                  : 'Tap the heart icon on any product cell to archive hardware here for later.'
              }
              action={
                <Link
                  to="/catalog"
                  className="inline-flex items-center justify-center bg-[#09090B] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#1049EB]"
                >
                  Explore Catalog
                </Link>
              }
            />
          </div>
        ) : (
          <>
            {/* 4-Column Exposed 1px Product Matrix */}
            <div className="grid grid-cols-2 gap-px border-b border-[#E4E4E7] bg-[#E4E4E7] md:grid-cols-3 lg:grid-cols-4">
              {displayedProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>

            {/* Price Drop Alert Row */}
            {!isSharedMode ? (
              <div className="flex flex-col items-start justify-between gap-4 border-b border-[#E4E4E7] bg-[#FAFAFA] p-6 sm:flex-row sm:items-center sm:px-10">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#E4E4E7] bg-white text-[#1049EB]">
                    <Bell size={19} weight="regular" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                      Price Drop Dispatch Alerts
                    </h3>
                    <p className="mt-0.5 text-xs text-[#52525B]">
                      Receive instant updates when any saved unit receives a daily Naira price drop.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toast.success('Price drop notifications enabled.')}
                  className="border border-[#09090B] bg-white px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#09090B] transition-colors hover:bg-[#09090B] hover:text-white"
                >
                  Enable Alerts
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
