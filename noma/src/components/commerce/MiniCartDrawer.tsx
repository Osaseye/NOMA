import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  Lock,
  Minus,
  Plus,
  ShoppingBag,
  Trash,
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
    const msg = `Hello Noma, I would like to place an order:\n\n${summaryLines.join('\n')}\n\nDelivery State: ${deliveryState}\nSubtotal: ${formatNaira(subtotal)}`
    return `${whatsappBaseUrl}?text=${encodeURIComponent(msg)}`
  }, [cartLines, deliveryState, subtotal, whatsappBaseUrl])

  return (
    <AnimatePresence>
      {isDrawerOpen ? (
        <div
          className="fixed inset-0 z-[100] flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Bag Drawer"
        >
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.36, ease: 'easeOut' }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px]"
            onClick={closeDrawer}
          />

          <motion.aside
            initial={reduceMotion ? { x: 0 } : { x: '100%' }}
            animate={{ x: 0 }}
            exit={reduceMotion ? { x: 0 } : { x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-[100dvh] w-full max-w-[400px] flex-col bg-white text-slate-900 shadow-2xl"
          >
            {/* Minimal Airy Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold tracking-tight text-slate-950">Your Bag</h2>
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FEB719] px-1.5 text-[11px] font-bold tabular-nums text-slate-950">
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
                    Clear
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close shopping bag"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
                >
                  <X size={17} weight="bold" />
                </button>
              </div>
            </div>

            {/* Slim 1-Line Free Delivery Progress (Zero Bulky Grey Box) */}
            {cartLines.length > 0 && !hasBulkyItem ? (
              <div className="border-b border-slate-100 px-6 py-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  {deliveryEstimate.isFreeStandard ? (
                    <span className="font-semibold text-emerald-700">
                      Free standard delivery unlocked
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      Add{' '}
                      <strong className="font-semibold tabular-nums text-slate-900">
                        {formatNaira(remainingForFreeShipping)}
                      </strong>{' '}
                      for free delivery
                    </span>
                  )}
                  <span className="font-semibold tabular-nums text-slate-400">
                    {freeShippingProgress}%
                  </span>
                </div>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1049EB] to-[#FEB719] transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : null}

            {/* Spacious Bag Items List */}
            {cartLines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-400">
                  <ShoppingBag size={22} weight="regular" />
                </div>
                <p className="text-base font-bold text-slate-950">Your bag is empty</p>
                <p className="mt-1 max-w-[230px] text-xs leading-relaxed text-slate-500">
                  Explore shoes, fashion, home appliances, and everyday essentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer()
                    navigate('/catalog')
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1049EB] px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0D3EC7]"
                >
                  <span>Start Shopping</span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              </div>
            ) : (
              <div className="no-scrollbar flex-1 divide-y divide-slate-100 overflow-y-auto px-6">
                {cartLines.map((line) => (
                  <div key={line.key} className="flex items-start gap-4 py-4">
                    <Link
                      to={`/product/${line.product.slug || line.product.id}`}
                      onClick={closeDrawer}
                      className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F4F4F5] p-1.5"
                    >
                      <img
                        src={line.product.image}
                        alt={line.product.name}
                        className="h-full w-full object-contain mix-blend-multiply"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            to={`/product/${line.product.slug || line.product.id}`}
                            onClick={closeDrawer}
                            className="line-clamp-2 text-xs font-semibold leading-snug text-slate-900 hover:text-[#1049EB]"
                          >
                            {line.product.name}
                          </Link>
                          {line.size ? (
                            <span className="mt-0.5 block text-[11px] text-slate-400">
                              Size {line.size}
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
                          className="shrink-0 rounded-full p-1 text-slate-300 transition-colors hover:text-rose-600"
                        >
                          <Trash size={14} weight="regular" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
                          <button
                            type="button"
                            onClick={() => setItemQuantity(line.key, line.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="flex h-6 w-7 items-center justify-center text-slate-500 transition-colors hover:text-slate-950"
                          >
                            <Minus size={10} weight="bold" />
                          </button>
                          <span className="min-w-[22px] text-center text-xs font-bold tabular-nums text-slate-900">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setItemQuantity(line.key, line.quantity + 1)}
                            aria-label="Increase quantity"
                            className="flex h-6 w-7 items-center justify-center text-slate-500 transition-colors hover:text-slate-950"
                          >
                            <Plus size={10} weight="bold" />
                          </button>
                        </div>

                        <span className="text-sm font-bold tabular-nums text-slate-950">
                          {formatNaira(line.lineTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Slim, Clean Bottom Checkout Bar */}
            {cartLines.length > 0 ? (
              <div className="border-t border-slate-100 bg-white px-6 py-4">
                <div className="mb-3.5 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500">Subtotal</span>
                    <span className="ml-1.5 text-[11px] text-slate-400">
                      • Delivery at checkout
                    </span>
                  </div>
                  <span className="text-lg font-extrabold tracking-tight tabular-nums text-slate-950">
                    {formatNaira(subtotal)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    closeDrawer()
                    navigate('/checkout')
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1049EB] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0D3EC7]"
                >
                  <Lock size={15} weight="bold" />
                  <span>Checkout</span>
                </button>

                <div className="mt-3 flex items-center justify-center gap-4 text-xs font-medium text-slate-500">
                  <Link
                    to="/cart"
                    onClick={closeDrawer}
                    className="transition-colors hover:text-slate-950 hover:underline"
                  >
                    View full bag
                  </Link>
                  <span className="text-slate-200">|</span>
                  <a
                    href={whatsappOrderHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 transition-colors hover:text-emerald-700"
                  >
                    <WhatsappLogo size={14} weight="fill" className="text-emerald-600" />
                    <span>WhatsApp order</span>
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
