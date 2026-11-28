import {
  ArrowsCounterClockwise,
  CaretRight,
  Clock,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash,
  Truck,
} from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { OrderSummary } from '../../components/commerce/OrderSummary'
import { ProductCard } from '../../components/commerce/ProductCard'
import { EmptyState } from '../../design-system/components/EmptyState'
import {
  estimateStateDeliveryFee,
  FREE_DELIVERY_THRESHOLD,
  toCartLineEntries,
  useCartStore,
} from '../../store/cartStore'
import { useProductStore } from '../../store/productStore'
import { formatNaira } from '../../utils/pricing'

const NIGERIAN_STATES = [
  'Lagos',
  'FCT - Abuja',
  'Ogun',
  'Oyo',
  'Rivers',
  'Delta',
  'Edo',
  'Enugu',
  'Anambra',
  'Kano',
  'Kaduna',
  'Akwa Ibom',
  'Cross River',
  'Imo',
  'Kwara',
  'Osun',
  'Ondo',
  'Ekiti',
  'Plateau',
  'Abia',
]

export function CartPage() {
  const navigate = useNavigate()
  const {
    items,
    setItemQuantity,
    removeLine,
    clearCart,
    deliveryState,
    setDeliveryState,
  } = useCartStore()
  const { products } = useProductStore()

  const [promoCode, setPromoCode] = useState('')
  const [showPromoInput, setShowPromoInput] = useState(false)

  const cartEntries = useMemo(() => toCartLineEntries(items), [items])

  const activeCartList = useMemo(() => {
    return cartEntries
      .map((entry) => {
        const product = products.find((p) => p.id === entry.productId)
        if (!product) return null
        return {
          ...entry,
          product,
        }
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
  }, [cartEntries, products])

  // Smart Related Products matching the space/categories of items in the bag
  const recommendedProducts = useMemo(() => {
    const SPACE_CLUSTERS: string[][] = [
      ['electronics', 'appliances', 'phones', 'power', 'solar'],
      ['kitchen', 'cooking', 'home-essentials', 'wines'],
      ['clothing', 'fashion', 'shoes'],
      ['outdoor', 'bicycles'],
    ]

    const inCartIds = new Set(activeCartList.map((entry) => entry.productId))
    const cartCategories = new Set(
      activeCartList.map((entry) => (entry.product.category || '').toLowerCase()),
    )
    const activeClusters = new Set<string>()
    cartCategories.forEach((cat) => {
      activeClusters.add(cat)
      const cluster = SPACE_CLUSTERS.find((c) => c.includes(cat))
      if (cluster) cluster.forEach((item) => activeClusters.add(item))
    })

    return products
      .filter((p) => !inCartIds.has(p.id))
      .map((p) => {
        const cat = (p.category || '').toLowerCase()
        let score = 0
        if (cartCategories.has(cat)) score += 80
        else if (activeClusters.has(cat)) score += 40
        else score += 10
        return { p, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((entry) => entry.p)
  }, [products, activeCartList])

  const itemCount = activeCartList.reduce((sum, entry) => sum + entry.quantity, 0)
  const subtotal = activeCartList.reduce(
    (sum, entry) => sum + entry.product.finalPrice * entry.quantity,
    0,
  )
  const hasBulkyItem = activeCartList.some((entry) => Boolean(entry.product.bulky))

  const deliveryEstimate = useMemo(
    () => estimateStateDeliveryFee(deliveryState, hasBulkyItem, subtotal),
    [deliveryState, hasBulkyItem, subtotal],
  )
  const deliveryFee = activeCartList.length > 0 ? deliveryEstimate.standardFee : 0
  const remainingForFreeShipping = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100))

  return (
    <div className="min-h-screen bg-white pb-24 pt-5 text-slate-900">
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        {/* Single Clean Header Bar */}
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
          <div>
            <nav className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">
              <Link to="/" className="hover:text-slate-900">
                Home
              </Link>
              <CaretRight size={11} />
              <span className="font-medium text-slate-800">Shopping Bag</span>
            </nav>
            <div className="flex items-baseline gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Shopping Bag
              </h1>
              <span className="text-xs font-medium text-slate-500">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            </div>
          </div>

          {activeCartList.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                clearCart()
                toast.info('Shopping bag cleared')
              }}
              className="self-start text-xs font-medium text-slate-400 transition-colors hover:text-rose-600 sm:self-auto"
            >
              Clear bag
            </button>
          ) : null}
        </div>

        {activeCartList.length === 0 ? (
          <div className="mb-14">
            <EmptyState
              icon={<ShoppingBag size={24} weight="regular" />}
              title="Your shopping bag is empty"
              detail="Explore shoes, fashion, kitchen appliances, and electronics with upfront nationwide delivery."
              action={
                <Link
                  to="/catalog"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Start Shopping
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mb-16 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Left 8 Cols: Bag Items & Delivery Estimator */}
            <div className="space-y-4 lg:col-span-8">
              {/* Free Shipping Progress Strip */}
              <div className="rounded-2xl bg-[#F4F4F5] p-4 sm:px-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} weight="fill" className="text-[#1049EB]" />
                    <span className="text-slate-600">Delivering to:</span>
                    <select
                      value={deliveryState}
                      onChange={(e) => setDeliveryState(e.target.value)}
                      aria-label="Select delivery state"
                      className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-900 focus:border-slate-900 focus:outline-none"
                    >
                      {NIGERIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <span className="text-xs text-slate-500">{deliveryEstimate.zoneLabel}</span>
                </div>

                {!hasBulkyItem ? (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      {deliveryEstimate.isFreeStandard ? (
                        <span className="font-semibold text-emerald-700">
                          You&apos;ve unlocked free standard delivery!
                        </span>
                      ) : (
                        <span className="text-slate-600">
                          Add{' '}
                          <strong className="font-bold text-slate-900">
                            {formatNaira(remainingForFreeShipping)}
                          </strong>{' '}
                          more for free standard delivery
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-slate-500">
                        {freeShippingProgress}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#1049EB] to-[#FEB719] transition-all duration-300"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Line Items Card */}
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-white">
                {activeCartList.map((entry) => {
                  const { product, quantity, size, key } = entry
                  return (
                    <div
                      key={key}
                      className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-5"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <Link
                          to={`/product/${product.slug || product.id}`}
                          className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F4F4F5] p-2 sm:h-24 sm:w-24"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        </Link>

                        <div className="min-w-0 flex-1 space-y-1">
                          <Link
                            to={`/product/${product.slug || product.id}`}
                            className="line-clamp-2 text-sm font-bold text-slate-900 transition-colors hover:underline sm:text-base"
                          >
                            {product.name}
                          </Link>

                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="capitalize text-slate-500">
                              {product.brand || product.category.replace(/-/g, ' ')}
                            </span>
                            {size ? (
                              <span className="rounded-md bg-[#F4F4F5] px-2 py-0.5 text-[11px] font-semibold text-slate-800">
                                Size: {size}
                              </span>
                            ) : null}
                            {product.bulky ? (
                              <span className="rounded-md bg-[#F4F4F5] px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                Bulky Item
                              </span>
                            ) : null}
                          </div>

                          <div className="text-xs font-medium text-slate-500">
                            {formatNaira(product.finalPrice)} each
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper & Line Total */}
                      <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 sm:justify-end sm:border-t-0 sm:pt-0">
                        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
                          <button
                            type="button"
                            onClick={() => setItemQuantity(key, quantity - 1)}
                            aria-label={`Decrease quantity for ${product.name}`}
                            className="flex h-8 w-8 items-center justify-center text-slate-600 hover:text-slate-950"
                          >
                            <Minus size={12} weight="bold" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold tabular-nums text-slate-900">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setItemQuantity(key, quantity + 1)}
                            aria-label={`Increase quantity for ${product.name}`}
                            className="flex h-8 w-8 items-center justify-center text-slate-600 hover:text-slate-950"
                          >
                            <Plus size={12} weight="bold" />
                          </button>
                        </div>

                        <strong className="min-w-[92px] text-right text-sm font-bold tabular-nums text-slate-900">
                          {formatNaira(product.finalPrice * quantity)}
                        </strong>

                        <button
                          type="button"
                          onClick={() => {
                            removeLine(key)
                            toast.info(`Removed ${product.name}`)
                          }}
                          aria-label={`Remove ${product.name}`}
                          className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-rose-600"
                        >
                          <Trash size={16} weight="regular" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right 4 Cols: Sticky Order Summary & Reassurance */}
            <div className="space-y-4 lg:sticky lg:top-24 lg:col-span-4">
              <OrderSummary
                subtotal={subtotal}
                delivery={deliveryFee}
                action="Proceed to Checkout"
                onAction={() => navigate('/checkout')}
                whatsappHref="/whatsapp-order"
              />

              {/* Promo Code Option */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                {!showPromoInput ? (
                  <button
                    type="button"
                    onClick={() => setShowPromoInput(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:underline"
                  >
                    <Tag size={14} weight="regular" />
                    <span>Have a promo code?</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 rounded-full border border-slate-200 bg-[#F4F4F5] px-3.5 py-1.5 text-xs uppercase text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!promoCode.trim()) {
                          toast.error('Enter a promo code first')
                          return
                        }
                        toast.info('No active discount applies to this code.')
                        setShowPromoInput(false)
                      }}
                      className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Clean Brand Reassurance */}
              <div className="space-y-2.5 rounded-2xl bg-[#F4F4F5] p-4 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-2.5">
                  <Truck size={15} weight="regular" className="shrink-0 text-[#1049EB]" />
                  <span>Delivery fee confirmed before you pay</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={15} weight="regular" className="shrink-0 text-[#1049EB]" />
                  <span>2–5 business days tracked nationwide dispatch</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ArrowsCounterClockwise
                    size={15}
                    weight="regular"
                    className="shrink-0 text-[#1049EB]"
                  />
                  <span>Easy return &amp; exchange eligibility</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={15} weight="regular" className="shrink-0 text-[#1049EB]" />
                  <span>Instant Bank Transfer &amp; Card checkout via Kora</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Smart Category-Matched Recommendations */}
        {recommendedProducts.length > 0 ? (
          <div className="border-t border-slate-200 pt-10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                You Might Also Like
              </h2>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:underline"
              >
                <span>See all</span>
                <CaretRight size={14} weight="bold" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
              {recommendedProducts.map((rec) => (
                <ProductCard key={rec.id} product={rec} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
