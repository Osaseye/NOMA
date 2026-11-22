import {
  ArrowRight,
  Bell,
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
      toast.success(`Added ${addedCount} available items to your cart.`)
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
      ownerName === 'My' ? 'Noma Shopper' : ownerName
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
    : 'My Wishlist | NOMA Marketplace'
  const metaDescription = isSharedMode
    ? `Explore ${displayedProducts.length} curated products chosen by ${sharedOwnerName} on NOMA.`
    : 'Manage your saved favorite products on NOMA Marketplace.'
  const ogImage = displayedProducts[0]?.image || '/icon.png'
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '/wishlist'

  return (
    <div className="min-h-screen bg-[#F6F7F9] pb-24 pt-4 text-[#0B1220]">
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

      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-[#5E6675]">
          <Link to="/" className="transition-colors hover:text-[#1049EB]">
            Home
          </Link>
          <CaretRight size={12} weight="regular" />
          <span className="font-semibold text-[#0B1220]">
            {isSharedMode ? `${sharedOwnerName}'s Shared Wishlist` : 'My Wishlist'}
          </span>
        </nav>

        {/* Flat Obsidian Shared Wishlist Banner */}
        {isSharedMode ? (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[8px] border border-[#0B1220] bg-[#0B1220] p-4 text-white sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-white/15 bg-white/10 text-white">
                <User size={19} weight="regular" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-bold text-white">
                    {sharedOwnerName}&apos;s Curated Wishlist
                  </h2>
                  <span className="rounded-[4px] border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Shared Selection
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-white/75">
                  Add items from this shared collection to your cart or personal wishlist.
                </p>
              </div>
            </div>

            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 rounded-[6px] bg-white px-4 py-2 text-xs font-semibold text-[#0B1220] transition-colors hover:bg-[#F6F7F9]"
            >
              <span>Explore Catalog</span>
              <ArrowRight size={13} weight="regular" />
            </Link>
          </div>
        ) : null}

        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#E5E7EB] pb-5 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-[#0B1220] sm:text-3xl">
                {isSharedMode ? `${sharedOwnerName}'s Wishlist` : 'My Wishlist'}
              </h1>
              <span className="rounded-[4px] border border-[#E5E7EB] bg-white px-2.5 py-0.5 font-mono text-xs font-bold text-[#1049EB]">
                {displayedProducts.length}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#5E6675] sm:text-sm">
              {isSharedMode
                ? `Curated products shared by ${sharedOwnerName}.`
                : 'Products saved for comparison or quick checkout.'}
            </p>
          </div>

          {displayedProducts.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleMoveAllToCart}
                className="inline-flex items-center gap-2 rounded-[6px] bg-[#0B1220] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1049EB]"
              >
                <ShoppingBag size={15} weight="regular" />
                <span>Add all to cart</span>
              </button>

              {!isSharedMode ? (
                <button
                  type="button"
                  onClick={handleShareWishlist}
                  className="inline-flex items-center gap-2 rounded-[6px] border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-semibold text-[#0B1220] transition-colors hover:bg-[#EEF0F4]"
                >
                  <ShareNetwork size={15} weight="regular" />
                  <span>Share link</span>
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        {displayedProducts.length === 0 ? (
          <EmptyState
            icon={<Heart size={24} weight="regular" />}
            title={isSharedMode ? 'No Items in Shared Wishlist' : 'Your Wishlist is Empty'}
            detail={
              isSharedMode
                ? 'This shared wishlist link does not reference any active catalog items.'
                : 'Tap the heart icon on any product card to save items here for later.'
            }
            action={
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center rounded-[6px] bg-[#0B1220] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1049EB]"
              >
                Explore Catalog
              </Link>
            }
          />
        ) : (
          <div className="space-y-8">
            {/* Canonical ProductCard Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Price Drop Alert Row */}
            {!isSharedMode ? (
              <div className="flex flex-col items-start justify-between gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-[#EEF3FE] text-[#1049EB]">
                    <Bell size={19} weight="regular" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1220]">Price drop alert</h3>
                    <p className="text-xs text-[#5E6675]">
                      Receive updates when any saved item receives a daily Naira discount.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toast.success('Price drop notifications enabled.')}
                  className="rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-4 py-2 text-xs font-semibold text-[#0B1220] transition-colors hover:border-[#1049EB] hover:text-[#1049EB]"
                >
                  Enable Alerts
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
