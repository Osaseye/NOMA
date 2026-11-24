import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  Lock,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Trash,
  Truck,
  WhatsappLogo,
  X,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { brand } from '../../constants/brand'
import { useAdminStore } from '../../store/adminStore'
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
  'Oyo',
  'Ogun',
  'Rivers',
  'Edo',
  'Delta',
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

export function MiniCartDrawer() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    setItemQuantity,
    removeLine,
    clearCart,
    deliveryState,
    setDeliveryState,
  } = useCartStore()
  const { products } = useProductStore()
  const { settings } = useAdminStore()

  const whatsappDigits = settings.whatsappNumber?.replace(/\D/g, '')
  const whatsappBaseUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : brand.whatsapp

  const cartLines = useMemo(() => {
    const entries = toCartLineEntries(items)
    return entries
      .map((entry) => {
        const product = products.find((p) => p.id === entry.productId)
        if (!product) return null
        return {
          ...entry,
          product,
          lineTotal: product.finalPrice * entry.quantity,
        }
      })
      .filter((line): line is NonNullable<typeof line> => line !== null)
  }, [items, products])

  const totalCount = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.quantity, 0),
    [cartLines],
  )
  const subtotal = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.lineTotal, 0),
    [cartLines],
  )
  const hasBulkyItem = useMemo(
    () => cartLines.some((line) => Boolean(line.product.bulky)),
    [cartLines],
  )

  const deliveryEstimate = useMemo(
    () => estimateStateDeliveryFee(deliveryState, hasBulkyItem, subtotal),
    [deliveryState, hasBulkyItem, subtotal],
  )

  const grandTotal = subtotal + (cartLines.length > 0 ? deliveryEstimate.standardFee : 0)
  const remainingForFreeShipping = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100))

  useEffect(() => {
    if (!isDrawerOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDrawer()
      }
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDrawerOpen, closeDrawer])

  const whatsappOrderHref = useMemo(() => {
    if (cartLines.length === 0) return whatsappBaseUrl
    const summaryLines = cartLines.map(
      (l, idx) =>
        `${idx + 1}. ${l.product.name}${l.size ? ` (Size: ${l.size})` : ''} x${l.quantity} - ${formatNaira(l.lineTotal)}`,
    )
    const msg = `Hello Noma, I would like to place an order:\n\n${summaryLines.join('\n')}\n\nDelivery State: ${deliveryState}\nSubtotal: ${formatNaira(subtotal)}\nEstimated Total: ${formatNaira(grandTotal)}`
    return `${whatsappBaseUrl}?text=${encodeURIComponent(msg)}`
  }, [cartLines, deliveryState, grandTotal, subtotal, whatsappBaseUrl])

  return (
    <AnimatePresence>
      {isDrawerOpen ? (
        <div
          className="fixed inset-0 z-[100] flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Bag Drawer"
        >
          {/* Dimmed Backdrop */}
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/50"
            onClick={closeDrawer}
          />

          {/* 100% Solid White Slide-Out Drawer Panel */}
          <motion.aside
            initial={reduceMotion ? { x: 0 } : { x: '100%' }}
            animate={{ x: 0 }}
            exit={reduceMotion ? { x: 0 } : { x: '100%' }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-[100dvh] w-full max-w-md flex-col bg-white text-slate-900 shadow-2xl"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={20} weight="bold" className="text-[#1049EB]" />
                <h2 className="text-base font-bold text-slate-900">Your Bag</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                  {totalCount}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {cartLines.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      clearCart()
                      toast.info('Shopping bag cleared')
                    }}
                    className="text-xs font-medium text-slate-400 transition-colors hover:text-rose-600"
                  >
                    Clear all
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close shopping bag"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                >
                  <X size={16} weight="bold" />
                </button>
              </div>
            </div>

            {/* Delivery State & Free Shipping Progress */}
            <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} weight="fill" className="text-[#1049EB]" />
                  <span className="text-slate-500">Deliver to:</span>
                  <select
                    value={deliveryState}
                    onChange={(e) => setDeliveryState(e.target.value)}
                    aria-label="Select delivery state"
                    className="cursor-pointer rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-800 focus:border-[#1049EB] focus:outline-none"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-[11px] font-medium text-slate-500">
                  {deliveryEstimate.zoneLabel.split('(')[1]?.replace(')', '') || '2 - 5 Days'}
                </span>
              </div>

              {!hasBulkyItem ? (
                <div className="mt-2.5">
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
                        more for free delivery
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-slate-500">
                      {freeShippingProgress}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-[#1049EB] transition-all duration-300"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-700">
                  <Truck size={14} weight="regular" />
                  <span>Bulky delivery rate applies ({formatNaira(deliveryEstimate.standardFee)})</span>
                </div>
              )}
            </div>

            {/* Bag Items Body */}
            {cartLines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <ShoppingBag size={26} weight="regular" />
                </div>
                <p className="text-base font-bold text-slate-900">Your bag is empty</p>
                <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-slate-500">
                  Browse shoes, fashion, home appliances, and everyday essentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer()
                    navigate('/catalog')
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1049EB] px-6 py-3 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#0D3BC2]"
                >
                  <span>Start Shopping</span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              </div>
            ) : (
              <div className="flex-1 divide-y divide-slate-100 overflow-y-auto px-5">
                {cartLines.map((line) => (
                  <div key={line.key} className="flex gap-3.5 py-4">
                    <Link
                      to={`/product/${line.product.slug || line.product.id}`}
                      onClick={closeDrawer}
                      className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/70 bg-slate-50 p-2"
                    >
                      <img
                        src={line.product.image}
                        alt={line.product.name}
                        className="h-full w-full object-contain"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            to={`/product/${line.product.slug || line.product.id}`}
                            onClick={closeDrawer}
                            className="line-clamp-2 text-xs font-semibold leading-snug text-slate-900 hover:text-[#1049EB]"
                          >
                            {line.product.name}
                          </Link>
                          {line.size ? (
                            <span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                              Size: {line.size}
                            </span>
                          ) : null}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            removeLine(line.key)
                            toast.info(`Removed ${line.product.name}`)
                          }}
                          aria-label={`Remove ${line.product.name}`}
                          className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash size={15} weight="regular" />
                        </button>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
                          <button
                            type="button"
                            onClick={() => setItemQuantity(line.key, line.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="flex h-7 w-7 items-center justify-center text-slate-600 transition-colors hover:bg-slate-50"
                          >
                            <Minus size={11} weight="bold" />
                          </button>
                          <span className="min-w-[28px] px-1.5 text-center text-xs font-bold tabular-nums text-slate-900">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setItemQuantity(line.key, line.quantity + 1)}
                            aria-label="Increase quantity"
                            className="flex h-7 w-7 items-center justify-center text-slate-600 transition-colors hover:bg-slate-50"
                          >
                            <Plus size={11} weight="bold" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="block text-xs font-bold tabular-nums text-slate-900">
                            {formatNaira(line.lineTotal)}
                          </span>
                          {line.quantity > 1 ? (
                            <span className="block text-[10px] tabular-nums text-slate-400">
                              {formatNaira(line.product.finalPrice)} each
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sticky Bottom Summary & Actions */}
            {cartLines.length > 0 ? (
              <div className="border-t border-slate-200 bg-white p-5">
                <div className="mb-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Subtotal ({totalCount} items)</span>
                    <span className="font-semibold tabular-nums text-slate-800">
                      {formatNaira(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Delivery ({deliveryState})</span>
                    <span className="font-semibold tabular-nums text-slate-800">
                      {deliveryEstimate.isFreeStandard
                        ? 'Free'
                        : formatNaira(deliveryEstimate.standardFee)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-slate-100 pt-2.5">
                    <span className="text-sm font-bold text-slate-900">Estimated Total</span>
                    <span className="text-lg font-bold tabular-nums text-slate-900">
                      {formatNaira(grandTotal)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    closeDrawer()
                    navigate('/checkout')
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1049EB] py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0D3BC2]"
                >
                  <Lock size={16} weight="bold" />
                  <span>Proceed to Checkout</span>
                </button>

                <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                  <Link
                    to="/cart"
                    onClick={closeDrawer}
                    className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    View Full Bag
                  </Link>
                  <a
                    href={whatsappOrderHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 py-2.5 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                  >
                    <WhatsappLogo size={16} weight="fill" className="text-emerald-600" />
                    <span>WhatsApp Order</span>
                  </a>
                </div>
              </div>
            ) : null}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
