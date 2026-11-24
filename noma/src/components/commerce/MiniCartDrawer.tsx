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

  // Close on Escape and lock body scroll while open
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
          className="fixed inset-0 z-50 flex justify-end"
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
            className="fixed inset-0 bg-[#09090B]/35 backdrop-blur-[2px]"
            onClick={closeDrawer}
          />

          {/* Slide-Out Architectural Panel */}
          <motion.aside
            initial={reduceMotion ? { x: 0 } : { x: '100%' }}
            animate={{ x: 0 }}
            exit={reduceMotion ? { x: 0 } : { x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full w-full max-w-[440px] flex-col border-l border-[#E4E4E7] bg-white text-[#09090B]"
          >
            {/* Top Architectural Header Bar (Exposed 1px Grid) */}
            <div className="grid grid-cols-12 border-b border-[#E4E4E7]">
              <div className="col-span-9 flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#09090B]">
                    Shopping Bag
                  </span>
                  <span className="border border-[#E4E4E7] bg-[#F4F4F5] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#09090B]">
                    {String(totalCount).padStart(2, '0')}
                  </span>
                </div>

                {cartLines.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      clearCart()
                      toast.info('Shopping bag cleared')
                    }}
                    className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#71717A] transition-colors hover:text-[#B91C1C]"
                  >
                    Clear All
                  </button>
                ) : null}
              </div>

              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close shopping bag"
                className="col-span-3 flex items-center justify-center border-l border-[#E4E4E7] bg-white py-4 text-xs font-semibold uppercase tracking-widest text-[#09090B] transition-colors hover:bg-[#F4F4F5]"
              >
                <X size={16} weight="regular" />
              </button>
            </div>

            {/* Free Delivery / Express Threshold Bar + State Selector */}
            <div className="border-b border-[#E4E4E7] bg-[#F4F4F5]/70 px-5 py-3">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-[#09090B]">
                  <MapPin size={13} weight="regular" className="text-[#1049EB]" />
                  <span className="font-medium text-[#71717A]">Deliver to:</span>
                  <select
                    value={deliveryState}
                    onChange={(e) => setDeliveryState(e.target.value)}
                    aria-label="Select delivery state"
                    className="cursor-pointer border-b border-[#09090B]/30 bg-transparent py-0.5 font-mono text-[11px] font-semibold text-[#09090B] focus:border-[#1049EB] focus:outline-none"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="font-mono text-[10px] text-[#71717A]">
                  {deliveryEstimate.zoneLabel.split('(')[1]?.replace(')', '') || '2 - 5 Days'}
                </span>
              </div>

              {/* Threshold progress bar */}
              {!hasBulkyItem ? (
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    {deliveryEstimate.isFreeStandard ? (
                      <span className="font-medium text-[#15803D]">
                        Complimentary standard delivery unlocked
                      </span>
                    ) : (
                      <span className="text-[#52525B]">
                        Add{' '}
                        <strong className="font-mono font-semibold text-[#09090B]">
                          {formatNaira(remainingForFreeShipping)}
                        </strong>{' '}
                        for free standard delivery
                      </span>
                    )}
                    <span className="font-mono text-[10px] text-[#71717A]">
                      {freeShippingProgress}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 w-full overflow-hidden bg-[#E4E4E7]">
                    <div
                      className="h-full bg-[#09090B] transition-all duration-300"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#B45309]">
                  <Truck size={13} weight="regular" />
                  <span>Includes bulky freight handling ({formatNaira(deliveryEstimate.standardFee)})</span>
                </div>
              )}
            </div>

            {/* Bag Items Body */}
            {cartLines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center border border-[#E4E4E7] bg-[#F4F4F5] text-[#71717A]">
                  <ShoppingBag size={22} weight="regular" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#09090B]">
                  Your Bag is Empty
                </p>
                <p className="mt-1.5 max-w-[240px] text-xs leading-relaxed text-[#71717A]">
                  Explore curated electronics, kitchen hardware, and solar power systems with upfront Naira delivery pricing.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer()
                    navigate('/catalog')
                  }}
                  className="mt-6 inline-flex items-center gap-2 bg-[#09090B] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#1049EB]"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight size={14} weight="regular" />
                </button>
              </div>
            ) : (
              <div className="flex-1 divide-y divide-[#E4E4E7] overflow-y-auto">
                {cartLines.map((line) => (
                  <div
                    key={line.key}
                    className="grid grid-cols-12 gap-3.5 p-4 transition-colors hover:bg-[#F4F4F5]/40 sm:px-5"
                  >
                    {/* Thumbnail Well */}
                    <Link
                      to={`/product/${line.product.slug || line.product.id}`}
                      onClick={closeDrawer}
                      className="col-span-3 flex aspect-square items-center justify-center border border-[#E4E4E7] bg-[#F4F4F5] p-2"
                    >
                      <img
                        src={line.product.image}
                        alt={line.product.name}
                        className="h-full w-full object-contain"
                      />
                    </Link>

                    {/* Item Details */}
                    <div className="col-span-9 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="block font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
                            {line.product.brand || line.product.category.replace(/-/g, ' ')}
                          </span>
                          <Link
                            to={`/product/${line.product.slug || line.product.id}`}
                            onClick={closeDrawer}
                            className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-[#09090B] hover:text-[#1049EB]"
                          >
                            {line.product.name}
                          </Link>
                          {line.size ? (
                            <span className="mt-1 inline-block border border-[#E4E4E7] bg-[#F4F4F5] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#09090B]">
                              SIZE: {line.size}
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
                          className="p-1 text-[#71717A] transition-colors hover:text-[#B91C1C]"
                        >
                          <Trash size={14} weight="regular" />
                        </button>
                      </div>

                      {/* Stepper & Line Subtotal */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-[#E4E4E7] bg-white">
                          <button
                            type="button"
                            onClick={() => setItemQuantity(line.key, line.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="flex h-7 w-7 items-center justify-center text-[#52525B] transition-colors hover:bg-[#F4F4F5] hover:text-[#09090B]"
                          >
                            <Minus size={11} weight="regular" />
                          </button>
                          <span className="min-w-[28px] border-x border-[#E4E4E7] px-1.5 text-center font-mono text-[11px] font-semibold text-[#09090B]">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setItemQuantity(line.key, line.quantity + 1)}
                            aria-label="Increase quantity"
                            className="flex h-7 w-7 items-center justify-center text-[#52525B] transition-colors hover:bg-[#F4F4F5] hover:text-[#09090B]"
                          >
                            <Plus size={11} weight="regular" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="block font-mono text-xs font-bold text-[#09090B]">
                            {formatNaira(line.lineTotal)}
                          </span>
                          {line.quantity > 1 ? (
                            <span className="block font-mono text-[10px] text-[#71717A]">
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

            {/* Sticky Bottom Concierge Summary & Actions */}
            {cartLines.length > 0 ? (
              <div className="border-t border-[#E4E4E7] bg-white">
                {/* Breakdown Grid */}
                <div className="space-y-2 border-b border-[#E4E4E7] bg-[#F4F4F5]/50 px-5 py-3.5 text-xs">
                  <div className="flex items-center justify-between text-[#52525B]">
                    <span>Subtotal ({totalCount} items)</span>
                    <span className="font-mono font-semibold text-[#09090B]">
                      {formatNaira(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#52525B]">
                    <span>Estimated Delivery ({deliveryState})</span>
                    <span className="font-mono font-semibold text-[#09090B]">
                      {deliveryEstimate.isFreeStandard ? 'FREE' : formatNaira(deliveryEstimate.standardFee)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-[#E4E4E7] pt-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                      Estimated Total
                    </span>
                    <span className="font-mono text-base font-bold text-[#09090B]">
                      {formatNaira(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 sm:px-5">
                  <button
                    type="button"
                    onClick={() => {
                      closeDrawer()
                      navigate('/checkout')
                    }}
                    className="flex w-full items-center justify-center gap-2 bg-[#09090B] py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#1049EB]"
                  >
                    <Lock size={14} weight="regular" />
                    <span>Proceed to Checkout</span>
                  </button>

                  <div className="mt-2 grid grid-cols-2 gap-px border border-[#E4E4E7] bg-[#E4E4E7]">
                    <Link
                      to="/cart"
                      onClick={closeDrawer}
                      className="flex items-center justify-center bg-white py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#09090B] transition-colors hover:bg-[#F4F4F5]"
                    >
                      View Full Bag
                    </Link>
                    <a
                      href={whatsappOrderHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-white py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#09090B] transition-colors hover:bg-[#F4F4F5]"
                    >
                      <WhatsappLogo size={14} weight="fill" className="text-[#15803D]" />
                      <span>WhatsApp Order</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
