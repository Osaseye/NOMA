import { ArrowLeft, ShoppingBag } from '@phosphor-icons/react'
import { useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../../design-system/components/EmptyState'
import { ProductDetail } from '../../features/storefront/ProductDetail'
import { useCartStore } from '../../store/cartStore'
import { useProductStore } from '../../store/productStore'
import { formatNaira } from '../../utils/pricing'

const SITE_URL = 'https://shopnoma.com.ng'
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-noma-share.jpg`

function toShareImageUrl(url: string | undefined, productSlugOrId: string): string {
  if (!url) return DEFAULT_OG_IMAGE
  if (url.startsWith('data:image/')) {
    return `${SITE_URL}/api/og-product?slug=${encodeURIComponent(productSlugOrId)}&image=1`
  }
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

export function ProductDetailPage() {
  const { slug } = useParams()
  const addItem = useCartStore((state) => state.addItem)
  const products = useProductStore((state) => state.products)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const product = useMemo(() => {
    if (!slug) return undefined
    let decoded = slug
    try {
      decoded = decodeURIComponent(slug)
    } catch {
      // Keep raw slug
    }
    const clean = decoded.trim()
    const lower = clean.toLowerCase()
    const trimmedHyphen = lower.replace(/-+$/, '')

    return (
      products.find((p) => p.slug === clean || p.id === clean) ||
      products.find(
        (p) =>
          p.slug?.toLowerCase() === lower ||
          p.id.toLowerCase() === lower ||
          (trimmedHyphen.length > 0 && p.slug?.toLowerCase().replace(/-+$/, '') === trimmedHyphen),
      )
    )
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
          <title>Product Not Found | Shop Noma</title>
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

  const pageTitle = `${product.name} — ${formatNaira(product.finalPrice)} | Shop Noma`
  const metaDescription = product.description
    ? product.description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160)
    : `Buy ${product.name} at ${formatNaira(product.finalPrice)} on Shop Noma with fast nationwide delivery across Nigeria.`
  const productSlugOrId = product.slug || product.id
  const canonicalUrl = `${SITE_URL}/product/${encodeURIComponent(productSlugOrId)}`
  const ogImage = toShareImageUrl(product.image, productSlugOrId)
  const jsonLdImages =
    Array.isArray(product.images) && product.images.length > 0
      ? Array.from(new Set(product.images.map((img) => toShareImageUrl(img, productSlugOrId))))
      : [ogImage]

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: jsonLdImages,
    description: metaDescription,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Shop Noma',
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'NGN',
      price: String(product.finalPrice),
      availability:
        product.stockQty > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.rating > 0 && (product.reviewsCount ?? 0) > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: String(product.rating),
            reviewCount: String(product.reviewsCount ?? 0),
          },
        }
      : {}),
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Shop Noma" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:secure_url" content={ogImage} />
        <meta property="og:image:alt" content={product.name} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="product:price:amount" content={String(product.finalPrice)} />
        <meta property="product:price:currency" content="NGN" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />

        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
      </Helmet>

      <ProductDetail key={product.id} product={product} onAddToCart={handleAddToCart} />
    </>
  )
}
