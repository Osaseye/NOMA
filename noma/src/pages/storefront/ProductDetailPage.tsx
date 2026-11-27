import { ArrowLeft, ShoppingBag } from '@phosphor-icons/react'
import { useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../../design-system/components/EmptyState'
import { ProductDetail } from '../../features/storefront/ProductDetail'
import { useCartStore } from '../../store/cartStore'
import { useProductStore } from '../../store/productStore'
import { formatNaira } from '../../utils/pricing'

export function ProductDetailPage() {
  const { slug } = useParams()
  const addItem = useCartStore((state) => state.addItem)
  const products = useProductStore((state) => state.products)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const product = useMemo(() => {
    if (!slug) return undefined
    return products.find((p) => p.slug === slug || p.id === slug)
  }, [products, slug])

  if (!product && products.length === 0) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] pb-24 pt-6">
        <div className="mx-auto w-full max-w-7xl animate-pulse px-4 md:px-8">
          <div className="mb-6 h-4 w-48 rounded-[4px] bg-[#EEF0F4]" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="h-[420px] rounded-[8px] border border-[#E5E7EB] bg-[#EEF0F4] lg:col-span-7" />
            <div className="flex flex-col gap-4 lg:col-span-5">
              <div className="h-5 w-28 rounded-[4px] bg-[#EEF0F4]" />
              <div className="h-9 w-3/4 rounded-[6px] bg-[#EEF0F4]" />
              <div className="h-4 w-1/3 rounded-[4px] bg-[#EEF0F4]" />
              <div className="h-28 w-full rounded-[8px] bg-[#EEF0F4]" />
              <div className="h-12 w-full rounded-[6px] bg-[#EEF0F4]" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F6F7F9] px-4 py-16">
        <Helmet>
          <title>Product Not Found | NOMA Marketplace</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="w-full max-w-md">
          <EmptyState
            icon={<ShoppingBag size={24} weight="regular" />}
            title="Product Not Found"
            detail="The requested item is unavailable or may have been removed from the catalog."
            action={
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 rounded-[6px] bg-[#0B1220] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
              >
                <ArrowLeft size={14} weight="regular" />
                <span>Return to Catalog</span>
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  const handleAddToCart = (selectedSize?: string, quantity = 1) => {
    addItem(product.id, selectedSize, quantity)
  }

  const pageTitle = `${product.name} - ${formatNaira(product.finalPrice)} | NOMA Nigeria`
  const metaDescription = product.description
    ? product.description.replace(/<[^>]*>/g, '').slice(0, 160)
    : `Buy ${product.name} at ${formatNaira(product.finalPrice)} on NOMA with transparent nationwide delivery.`
  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `https://shopnoma.com.ng/product/${product.slug}`
  const ogImage = product.image || 'https://shopnoma.com.ng/images/og-noma-share.jpg'

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={metaDescription} />

        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="NOMA Marketplace" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={currentUrl} />
        <meta property="product:price:amount" content={String(product.finalPrice)} />
        <meta property="product:price:currency" content="NGN" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <ProductDetail key={product.id} product={product} onAddToCart={handleAddToCart} />
    </>
  )
}
