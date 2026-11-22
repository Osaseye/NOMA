import {
  ArrowsCounterClockwise,
  CaretRight,
  Clock,
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
import { toCartLineEntries, useCartStore } from '../../store/cartStore'
import { useProductStore } from '../../store/productStore'
import { formatNaira } from '../../utils/pricing'

const PREVIEW_STATES = [
  { label: 'Lagos', standardFee: 3500, eta: '1-2 business days' },
  { label: 'Ogun', standardFee: 4500, eta: '2-3 business days' },
  { label: 'Oyo', standardFee: 4500, eta: '2-3 business days' },
  { label: 'FCT - Abuja', standardFee: 6000, eta: '2-4 business days' },
  { label: 'Rivers', standardFee: 6000, eta: '2-4 business days' },
  { label: 'Other Nigerian States', standardFee: 7500, eta: '3-5 business days' },
]

export function CartPage() {
  const navigate = useNavigate()
  const { items, setItemQuantity, removeLine } = useCartStore()
  const { products } = useProductStore()

  const [previewState, setPreviewState] = useState('Lagos')
  const [changingLocation, setChangingLocation] = useState(false)
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

  const recommendedProducts = useMemo(() => {
    const inCartIds = new Set(activeCartList.map((entry) => entry.productId))
    return products.filter((p) => !inCartIds.has(p.id)).slice(0, 4)
  }, [products, activeCartList])

  const itemCount = activeCartList.reduce((sum, entry) => sum + entry.quantity, 0)
  const subtotal = activeCartList.reduce(
    (sum, entry) => sum + entry.product.finalPrice * entry.quantity,
    0
  )
  const hasBulkyItem = activeCartList.some((entry) => Boolean(entry.product.bulky))

  const selectedEstimate =
    PREVIEW_STATES.find((s) => s.label === previewState) || PREVIEW_STATES[0]
  const deliveryFee =
    activeCartList.length > 0 ? selectedEstimate.standardFee + (hasBulkyItem ? 4000 : 0) : 0

  return (
    <div className="min-h-screen bg-[#F6F7F9] pb-24 pt-4 text-[#0B1220]">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-[#5E6675]">
          <Link to="/" className="transition-colors hover:text-[#1049EB]">
            Home
          </Link>
          <CaretRight size={12} weight="regular" />
          <span className="font-semibold text-[#0B1220]">Cart</span>
        </nav>

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#E5E7EB] pb-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0B1220] sm:text-3xl">
              Your Cart (<span className="font-mono">{itemCount}</span>)
            </h1>
            <p className="mt-1 text-xs text-[#5E6675] sm:text-sm">
              Review selected items, sizes, and delivery estimate before checkout.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-[6px] border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs font-semibold text-[#0B1220]">
            <ShieldCheck size={16} weight="fill" className="text-[#1049EB]" />
            <span>Upfront pricing &amp; verified checkout</span>
          </div>
        </div>

        {activeCartList.length === 0 ? (
          <div className="mb-14">
            <EmptyState
              icon={<ShoppingBag size={24} weight="regular" />}
              title="Your Shopping Cart is Empty"
              detail="Explore the Noma catalog for verified electronics, kitchen hardware, and home appliances."
              action={
                <Link
                  to="/catalog"
                  className="inline-flex items-center justify-center rounded-[6px] bg-[#0B1220] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1049EB]"
                >
                  Start Shopping
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mb-16 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Left 7 Cols: Line Items & Nigerian Delivery Preview */}
            <div className="space-y-4 lg:col-span-7">
              <div className="divide-y divide-[#E5E7EB] rounded-[8px] border border-[#E5E7EB] bg-white">
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
                          className="h-20 w-20 shrink-0 overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] p-2 sm:h-24 sm:w-24"
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
                            className="line-clamp-2 text-sm font-bold text-[#0B1220] transition-colors hover:text-[#1049EB] sm:text-base"
                          >
                            {product.name}
                          </Link>

                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="capitalize text-[#5E6675]">
                              {product.brand || product.category.replace(/-/g, ' ')}
                            </span>
                            {size ? (
                              <span className="rounded-[4px] border border-[#1049EB]/25 bg-[#EEF3FE] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#1049EB]">
                                Size: {size}
                              </span>
                            ) : null}
                            {product.bulky ? (
                              <span className="rounded-[4px] border border-[#FDE68A] bg-[#FFFBEB] px-2 py-0.5 text-[10px] font-semibold text-[#B45309]">
                                Heavy Freight
                              </span>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                            <span className="h-1.5 w-1.5 rounded-[2px] bg-[#15803D]" />
                            <span>In stock</span>
                          </div>
                        </div>
                      </div>

                      {/* Controls & Line Price */}
                      <div className="flex items-center justify-between gap-4 border-t border-[#E5E7EB] pt-3 sm:justify-end sm:border-t-0 sm:pt-0">
                        <div className="hidden text-right md:block">
                          <span className="font-mono text-xs text-[#5E6675]">
                            {formatNaira(product.finalPrice)} each
                          </span>
                        </div>

                        <div className="flex items-center rounded-[6px] border border-[#E5E7EB] bg-white">
                          <button
                            type="button"
                            onClick={() => setItemQuantity(key, quantity - 1)}
                            aria-label={`Decrease quantity for ${product.name}`}
                            className="p-2 text-[#5E6675] hover:text-[#0B1220]"
                          >
                            <Minus size={13} weight="regular" />
                          </button>
                          <span className="w-8 text-center font-mono text-xs font-bold text-[#0B1220]">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setItemQuantity(key, quantity + 1)}
                            aria-label={`Increase quantity for ${product.name}`}
                            className="p-2 text-[#5E6675] hover:text-[#0B1220]"
                          >
                            <Plus size={13} weight="regular" />
                          </button>
                        </div>

                        <strong className="min-w-[84px] text-right font-mono text-sm font-bold text-[#0B1220]">
                          {formatNaira(product.finalPrice * quantity)}
                        </strong>

                        <button
                          type="button"
                          onClick={() => {
                            removeLine(key)
                            toast.info(`Removed ${product.name} from cart`)
                          }}
                          aria-label={`Remove ${product.name}`}
                          className="rounded-[6px] p-2 text-[#5E6675] transition-colors hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                        >
                          <Trash size={16} weight="regular" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Delivery Fee Preview Strip */}
              <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs">
                    <Truck size={18} weight="regular" className="text-[#1049EB]" />
                    <div>
                      <span className="font-semibold text-[#0B1220]">
                        Estimated delivery to {previewState}:{' '}
                      </span>
                      <strong className="font-mono text-[#0B1220]">
                        {formatNaira(deliveryFee)}
                      </strong>
                      <span className="ml-1.5 text-[#5E6675]">({selectedEstimate.eta})</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setChangingLocation((prev) => !prev)}
                    className="text-xs font-semibold text-[#1049EB] hover:underline"
                  >
                    {changingLocation ? 'Done' : 'Change state'}
                  </button>
                </div>

                {changingLocation ? (
                  <div className="mt-3 flex items-center gap-2 border-t border-[#E5E7EB] pt-3">
                    <label htmlFor="cart-preview-state" className="text-xs font-medium text-[#5E6675]">
                      Destination:
                    </label>
                    <select
                      id="cart-preview-state"
                      value={previewState}
                      onChange={(e) => {
                        setPreviewState(e.target.value)
                        setChangingLocation(false)
                      }}
                      className="flex-1 rounded-[6px] border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-semibold text-[#0B1220] focus:border-[#1049EB] focus:outline-none"
                    >
                      {PREVIEW_STATES.map((st) => (
                        <option key={st.label} value={st.label}>
                          {st.label} ({formatNaira(st.standardFee + (hasBulkyItem ? 4000 : 0))})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Right 5 Cols: Sticky OrderSummary & Reassurance */}
            <div className="space-y-4 lg:sticky lg:top-24 lg:col-span-5">
              <OrderSummary
                subtotal={subtotal}
                delivery={deliveryFee}
                action="Proceed to Checkout"
                onAction={() => navigate('/checkout')}
                whatsappHref="/whatsapp-order"
              />

              {/* Promo Code Option */}
              <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-4">
                {!showPromoInput ? (
                  <button
                    type="button"
                    onClick={() => setShowPromoInput(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1049EB] hover:underline"
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
                      className="flex-1 rounded-[6px] border border-[#D1D5DB] bg-white px-3 py-1.5 font-mono text-xs uppercase text-[#0B1220] focus:border-[#1049EB] focus:outline-none"
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
                      className="rounded-[6px] bg-[#0B1220] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1E293B]"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Trust Reassurance */}
              <div className="space-y-2.5 rounded-[8px] border border-[#E5E7EB] bg-white p-4 text-xs font-medium text-[#374151]">
                <div className="flex items-center gap-2.5">
                  <Truck size={15} weight="regular" className="shrink-0 text-[#1049EB]" />
                  <span>Delivery fee confirmed before you pay</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={15} weight="regular" className="shrink-0 text-[#1049EB]" />
                  <span>2-5 business days tracked nationwide dispatch</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ArrowsCounterClockwise
                    size={15}
                    weight="regular"
                    className="shrink-0 text-[#1049EB]"
                  />
                  <span>30-day return eligibility on verified condition</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={15} weight="fill" className="shrink-0 text-[#1049EB]" />
                  <span>Card, transfer, USSD &amp; Pay on Delivery supported</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendedProducts.length > 0 ? (
          <div className="border-t border-[#E5E7EB] pt-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-[#0B1220] md:text-2xl">
                You might also like
              </h2>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1049EB] hover:underline"
              >
                <span>View all</span>
                <CaretRight size={14} weight="regular" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
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
