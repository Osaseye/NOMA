import { useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'
import { ProductDetail } from '../../features/storefront/ProductDetail'
import { useProductStore } from '../../store/productStore'
import { useCartStore } from '../../store/cartStore'
import { HiShoppingBag, HiArrowLeft } from 'react-icons/hi2'
import { formatNaira } from '../../utils/pricing'

export function ProductDetailPage() {
  const { slug } = useParams()
  const addItem = useCartStore((state) => state.addItem)
  const products = useProductStore((state) => state.products)

  // Scroll to top on navigation to a new product
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // Direct synchronous matching by slug or by ID (0ms instant render)
  const product = useMemo(() => {
    if (!slug) return undefined
    return products.find((p) => p.slug === slug || p.id === slug)
  }, [products, slug])

  // While store data is initializing from Firestore or cache, show loading skeleton (never flash "Product Not Found")
  if (!product && products.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] font-['Outfit',sans-serif] pb-24 pt-4">
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 lg:px-12 animate-pulse">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 w-48 bg-slate-200 rounded-lg mb-6" />

          {/* Main Grid Skeleton */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 mb-12">
            {/* Gallery Skeleton */}
            <div className="lg:col-span-7 h-[420px] rounded-3xl bg-slate-200" />

            {/* Info Skeleton */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="h-5 w-24 bg-slate-200 rounded-full" />
              <div className="h-8 w-3/4 bg-slate-200 rounded-xl" />
              <div className="h-4 w-1/3 bg-slate-200 rounded-lg" />
              <div className="h-24 w-full bg-slate-200 rounded-2xl" />
              <div className="h-12 w-full bg-slate-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#F7F8FA]">
        <Helmet>
          <title>Product Not Found | NOMA Marketplace</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
          <HiShoppingBag size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          The requested product is not available in the catalog or backend store database.
        </p>
        <Link
          to="/catalog"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800"
        >
          <HiArrowLeft size={16} /> Return to Products Catalog
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(product.id)
    toast.success('Added to cart!', {
      description: product.name,
      duration: 3000,
    })
  }

  const pageTitle = `${product.name} — ${formatNaira(product.finalPrice)} | NOMA Nigeria`
  const metaDescription = product.description
    ? product.description.replace(/<[^>]*>/g, '').slice(0, 160)
    : `Buy ${product.name} at ${formatNaira(product.finalPrice)} on NOMA. Fast delivery nationwide across Nigeria.`
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://noma-africa.vercel.app/product/${product.slug}`
  const ogImage = product.image || 'https://noma-africa.vercel.app/pwa-512x512.png'

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={metaDescription} />
        
        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="NOMA Marketplace" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={currentUrl} />
        <meta property="product:price:amount" content={String(product.finalPrice)} />
        <meta property="product:price:currency" content="NGN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <ProductDetail product={product} onAddToCart={handleAddToCart} />
    </>
  )
}

