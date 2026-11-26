import {
  ArrowLeft,
  ArrowUpRight,
  CalendarBlank,
  CaretRight,
  Check,
  CheckCircle,
  CircleNotch,
  Clock,
  CreditCard,
  EnvelopeSimple,
  MapPin,
  Package,
  Phone,
  Receipt,
  SealCheck,
  Truck,
  User,
  WarningCircle,
  WhatsappLogo,
} from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { brand } from '../../constants/brand'
import { orderService } from '../../services/firebase/orderService'
import { useAdminStore } from '../../store/adminStore'
import { useProductStore } from '../../store/productStore'
import type { Order, OrderStatus } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

interface FulfillmentStep {
  key: Exclude<OrderStatus, 'cancelled'>
  label: string
  completedDetail: string
  activeDetail: string
  upcomingDetail: string
  icon: typeof Clock
}

const FULFILLMENT_STEPS: FulfillmentStep[] = [
  {
    key: 'placed',
    label: 'Placed',
    completedDetail: 'Order received and confirmed in our system.',
    activeDetail: 'We have received your order and queued it for our fulfillment team.',
    upcomingDetail: 'Order confirmation & receipt generation.',
    icon: Receipt,
  },
  {
    key: 'processing',
    label: 'Processing',
    completedDetail: 'Inventory verified and items allocated for your order.',
    activeDetail: 'Our team is verifying stock and preparing your items for packing.',
    upcomingDetail: 'Stock verification and item preparation by our warehouse team.',
    icon: Clock,
  },
  {
    key: 'packed',
    label: 'Packed',
    completedDetail: 'Quality-checked, sealed, and labeled for dispatch.',
    activeDetail: 'Your items are being inspected, securely wrapped, and labeled for pickup.',
    upcomingDetail: 'Quality check, protective packaging, and dispatch labeling.',
    icon: Package,
  },
  {
    key: 'dispatched',
    label: 'Dispatched',
    completedDetail: 'Handed off to our delivery partner and moved through transit.',
    activeDetail: 'Your package is on the road with our courier heading to your address.',
    upcomingDetail: 'Rider pickup & live dispatch notification.',
    icon: Truck,
  },
  {
    key: 'delivered',
    label: 'Delivered',
    completedDetail: 'Package delivered and signed off at your destination.',
    activeDetail: 'Your order has been delivered to your doorstep.',
    upcomingDetail: 'Delivered to your doorstep.',
    icon: CheckCircle,
  },
]

const STATUS_INDEX: Record<Exclude<OrderStatus, 'cancelled'>, number> = {
  placed: 0,
  processing: 1,
  packed: 2,
  dispatched: 3,
  delivered: 4,
}

function getStatusHeadline(status: OrderStatus): {
  title: string
  subtitle: string
  badgeLabel: string
} {
  switch (status) {
    case 'placed':
      return {
        title: 'Order Placed & Confirmed',
        subtitle: 'Your order is in our queue. Our fulfillment team will begin processing it shortly.',
        badgeLabel: 'Placed',
      }
    case 'processing':
      return {
        title: 'Currently Being Processed',
        subtitle: 'Our team is verifying your items and getting everything ready for packing.',
        badgeLabel: 'Processing',
      }
    case 'packed':
      return {
        title: 'Packed & Ready for Dispatch',
        subtitle: 'Your order has passed quality checks, is securely sealed, and awaits courier pickup.',
        badgeLabel: 'Packed',
      }
    case 'dispatched':
      return {
        title: 'Out for Delivery',
        subtitle: 'Your package has left our facility and is on its way to your delivery address.',
        badgeLabel: 'Dispatched',
      }
    case 'delivered':
      return {
        title: 'Delivered Successfully',
        subtitle: 'Your order has been delivered. Thank you for shopping with Noma!',
        badgeLabel: 'Delivered',
      }
    case 'cancelled':
      return {
        title: 'Order Cancelled',
        subtitle: 'This order has been cancelled and will not be dispatched.',
        badgeLabel: 'Cancelled',
      }
  }
}

function formatOrderDate(raw?: string): string {
  if (!raw) return 'Recently placed'
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return raw
  return parsed.toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatPaymentMethod(method?: string): string {
  if (!method) return 'Online Payment'
  const clean = method.replace(/[_-]+/g, ' ').trim()
  return clean.replace(/\b\w/g, (char) => char.toUpperCase())
}

function buildWhatsAppSupportUrl(rawNumber: string, orderId: string): string {
  const digits = rawNumber.replace(/[^\d]/g, '') || brand.whatsappNumber
  const text = encodeURIComponent(
    `Hello ${brand.name} Support, I need assistance with my order ${orderId}.`,
  )
  return `https://wa.me/${digits}?text=${text}`
}

export function CustomerOrderDetailPage() {
  const { orderId: rawOrderId = '' } = useParams<{ orderId: string }>()
  const decodedOrderId = useMemo(() => decodeURIComponent(rawOrderId).trim(), [rawOrderId])

  const storeOrders = useProductStore((s) => s.orders)
  const settingsWhatsapp = useAdminStore((s) => s.settings.whatsappNumber)

  const memoryOrder = useMemo(() => {
    if (!decodedOrderId) return null
    const target = decodedOrderId.toUpperCase()
    return (
      storeOrders.find(
        (o) =>
          o.id.toUpperCase() === target ||
          (o.paymentRef && o.paymentRef.toUpperCase() === target),
      ) ?? null
    )
  }, [storeOrders, decodedOrderId])

  const [remoteLookup, setRemoteLookup] = useState<{
    queryId: string
    order: Order | null
  } | null>(null)

  useEffect(() => {
    if (!decodedOrderId || memoryOrder) return

    let active = true

    const loadOrder = async () => {
      try {
        let found = await orderService.getOrderById(decodedOrderId)
        if (!found && decodedOrderId !== decodedOrderId.toUpperCase()) {
          found = await orderService.getOrderById(decodedOrderId.toUpperCase())
        }
        if (!active) return
        setRemoteLookup({ queryId: decodedOrderId, order: found })
      } catch {
        if (!active) return
        setRemoteLookup({ queryId: decodedOrderId, order: null })
      }
    }

    void loadOrder()

    return () => {
      active = false
    }
  }, [decodedOrderId, memoryOrder])

  const hasResolvedRemote = remoteLookup?.queryId === decodedOrderId
  const order = memoryOrder ?? (hasResolvedRemote ? remoteLookup.order : null)
  const isLoading = Boolean(decodedOrderId) && !memoryOrder && !hasResolvedRemote
  const notFound = !decodedOrderId || (!memoryOrder && hasResolvedRemote && !remoteLookup.order)

  const whatsappUrl = buildWhatsAppSupportUrl(
    settingsWhatsapp || brand.whatsappNumber,
    order?.id || decodedOrderId || 'Order',
  )

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-white px-4 py-16 text-slate-900">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-slate-200/80 bg-[#F4F4F5] p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1049EB] shadow-2xs">
            <CircleNotch size={24} weight="bold" className="animate-spin" />
          </div>
          <h1 className="mt-4 text-base font-bold text-slate-900">Loading order details</h1>
          <p className="mt-1 text-xs text-slate-500">
            Fetching live fulfillment status for {decodedOrderId || 'your order'}...
          </p>
        </div>
      </div>
    )
  }

  if (notFound || !order) {
    return (
      <div className="min-h-[70vh] bg-white px-4 py-16 text-slate-900">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-slate-200/80 bg-[#F4F4F5] p-8 text-center sm:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-800 shadow-2xs">
            <WarningCircle size={24} weight="regular" />
          </div>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900">Order Not Found</h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            We couldn&apos;t find an order matching{' '}
            <span className="font-semibold text-slate-800">{decodedOrderId || 'that reference'}</span>.
            Double-check the order ID or return to your orders list.
          </p>
          <div className="mt-6 flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link
              to="/orders"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#1049EB] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#0D3EC7]"
            >
              <ArrowLeft size={14} weight="bold" />
              <span>Back to Orders</span>
            </Link>
            <Link
              to="/catalog"
              className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isCancelled = order.status === 'cancelled'
  const isDelivered = order.status === 'delivered'
  const activeStepIndex =
    order.status === 'cancelled' ? -1 : (STATUS_INDEX[order.status] ?? 0)
  const statusCopy = getStatusHeadline(order.status)
  const nextStep =
    !isCancelled && activeStepIndex < FULFILLMENT_STEPS.length - 1
      ? FULFILLMENT_STEPS[activeStepIndex + 1]
      : null

  const items = Array.isArray(order.items) ? order.items : []
  const itemsSubtotal =
    items.length > 0
      ? items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
      : Math.max(0, order.total - (order.deliveryFee || 0))
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  const addressParts = Array.from(
    new Set(
      [order.address, order.neighborhood, order.city, order.state || order.deliveryArea]
        .map((part) => part?.trim())
        .filter((part): part is string => Boolean(part)),
    ),
  )

  return (
    <div className="min-h-screen bg-white pb-24 pt-5 text-slate-900">
      <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-5 lg:px-6">
        {/* Top Navigation & Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-6 border-b border-slate-200 pb-5"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/orders"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F4F5] px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-950"
            >
              <ArrowLeft size={14} weight="bold" />
              <span>Back to Orders</span>
            </Link>

            <nav className="flex items-center gap-1.5 text-xs text-slate-500">
              <Link to="/" className="hover:text-slate-900">
                Home
              </Link>
              <CaretRight size={11} />
              <Link to="/orders" className="hover:text-slate-900">
                Orders
              </Link>
              <CaretRight size={11} />
              <span className="font-medium text-slate-800">{order.id}</span>
            </nav>
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-medium text-slate-500">Order Details</span>
              <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Order {order.id}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <CalendarBlank size={14} weight="regular" />
                  <span>{formatOrderDate(order.createdAt)}</span>
                </span>
                {order.paymentRef ? (
                  <span>
                    Ref: <strong className="font-semibold text-slate-700">{order.paymentRef}</strong>
                  </span>
                ) : null}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-left sm:text-right">
                <span className="block text-[11px] font-medium text-slate-500">Grand Total</span>
                <strong className="text-xl font-bold tabular-nums text-slate-900">
                  {formatNaira(order.total)}
                </strong>
              </div>
            </div>
          </div>
        </motion.div>

        {/* HERO CENTERPIECE: Current Status & Future Status Progression */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          aria-label="Order fulfillment status"
          className="mb-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs"
        >
          {/* Current Status Banner */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 bg-[#F4F4F5] p-5 sm:p-7 lg:flex-row lg:items-center">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                {isCancelled ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1 text-xs font-semibold text-white">
                    <WarningCircle size={14} weight="fill" className="text-[#FEB719]" />
                    <span>{statusCopy.badgeLabel}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#1049EB] px-3.5 py-1 text-xs font-semibold text-white">
                    <span className="relative flex h-2 w-2">
                      {!isDelivered ? (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FEB719] opacity-80" />
                      ) : null}
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FEB719]" />
                    </span>
                    <span>Current Status: {statusCopy.badgeLabel}</span>
                  </span>
                )}

                {!isCancelled ? (
                  <span className="text-xs font-medium text-slate-500">
                    Step {activeStepIndex + 1} of {FULFILLMENT_STEPS.length}
                  </span>
                ) : null}
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {statusCopy.title}
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
                {statusCopy.subtitle}
              </p>
            </div>

            {nextStep ? (
              <div className="shrink-0 rounded-xl border border-slate-200/80 bg-white px-4 py-3 lg:max-w-xs">
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Up Next
                </span>
                <p className="mt-0.5 text-sm font-bold text-slate-900">{nextStep.label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  {nextStep.upcomingDetail}
                </p>
              </div>
            ) : isDelivered ? (
              <div className="flex shrink-0 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1049EB] text-white">
                  <SealCheck size={18} weight="fill" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900">Fulfillment Complete</span>
                  <span className="block text-[11px] text-slate-500">All 5 stages finished</span>
                </div>
              </div>
            ) : null}
          </div>

          {/* 5-Step Fulfillment Journey or Cancelled Notice */}
          <div className="p-5 sm:p-7">
            {isCancelled ? (
              <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-[#F4F4F5] p-5 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 shadow-2xs">
                    <WarningCircle size={20} weight="regular" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      This order was cancelled
                    </h3>
                    <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-600">
                      If you didn&apos;t request this cancellation or need help with a refund or
                      replacement order, reach out to our support team on WhatsApp with your order ID.
                    </p>
                  </div>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-[#1049EB] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#0D3EC7]"
                >
                  <WhatsappLogo size={16} weight="fill" />
                  <span>Contact Support</span>
                </a>
              </div>
            ) : (
              <div>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Fulfillment Journey
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#1049EB]" />
                      Completed
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full border-2 border-[#1049EB] bg-[#FEB719]" />
                      In Progress
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full border border-slate-300 bg-white" />
                      Upcoming
                    </span>
                  </div>
                </div>

                {/* Desktop Horizontal 5-Step Progression */}
                <div className="hidden lg:block">
                  <div className="relative grid grid-cols-5 gap-4">
                    {/* Connecting Track Line */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-[10%] right-[10%] top-5 h-0.5 bg-slate-200"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-[10%] top-5 h-0.5 bg-[#1049EB] transition-all duration-500"
                      style={{
                        width: `${(activeStepIndex / (FULFILLMENT_STEPS.length - 1)) * 80}%`,
                      }}
                    />

                    {FULFILLMENT_STEPS.map((step, index) => {
                      const isCompleted = isDelivered ? true : index < activeStepIndex
                      const isCurrent = !isDelivered && index === activeStepIndex
                      const IconComponent = step.icon

                      const stateLabel = isCompleted
                        ? 'Completed'
                        : isCurrent
                          ? 'In Progress'
                          : 'Upcoming'

                      const description = isCompleted
                        ? step.completedDetail
                        : isCurrent
                          ? step.activeDetail
                          : step.upcomingDetail

                      return (
                        <div key={step.key} className="relative flex flex-col items-center text-center">
                          {/* Step Node */}
                          <div
                            className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                              isCompleted
                                ? 'bg-[#1049EB] text-white shadow-xs'
                                : isCurrent
                                  ? 'border-2 border-[#1049EB] bg-white text-[#1049EB] ring-4 ring-[#FEB719]/30'
                                  : 'border border-slate-300 bg-white text-slate-400'
                            }`}
                          >
                            {isCompleted ? (
                              <Check size={18} weight="bold" />
                            ) : isCurrent ? (
                              <span className="relative flex h-3 w-3">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FEB719] opacity-75" />
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-[#FEB719]" />
                              </span>
                            ) : (
                              <IconComponent size={17} weight="regular" />
                            )}
                          </div>

                          {/* Step Card */}
                          <div
                            className={`mt-4 flex w-full flex-1 flex-col items-center rounded-xl border p-3.5 transition-colors ${
                              isCurrent
                                ? 'border-[#1049EB] bg-[#F4F4F5]'
                                : isCompleted
                                  ? 'border-slate-200/80 bg-white'
                                  : 'border-slate-200/70 bg-white'
                            }`}
                          >
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                isCompleted
                                  ? 'bg-[#1049EB] text-white'
                                  : isCurrent
                                    ? 'bg-[#FEB719] text-slate-950'
                                    : 'bg-[#F4F4F5] text-slate-500'
                              }`}
                            >
                              {stateLabel}
                            </span>

                            <h4
                              className={`mt-2 text-sm font-bold ${
                                isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-500'
                              }`}
                            >
                              {step.label}
                            </h4>

                            <p
                              className={`mt-1 text-xs leading-relaxed ${
                                isCompleted || isCurrent ? 'text-slate-600' : 'text-slate-400'
                              }`}
                            >
                              {description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Mobile & Tablet Vertical 5-Step Timeline */}
                <div className="space-y-0 lg:hidden">
                  {FULFILLMENT_STEPS.map((step, index) => {
                    const isCompleted = isDelivered ? true : index < activeStepIndex
                    const isCurrent = !isDelivered && index === activeStepIndex
                    const isLast = index === FULFILLMENT_STEPS.length - 1
                    const IconComponent = step.icon

                    const stateLabel = isCompleted
                      ? 'Completed'
                      : isCurrent
                        ? 'In Progress'
                        : 'Upcoming'

                    const description = isCompleted
                      ? step.completedDetail
                      : isCurrent
                        ? step.activeDetail
                        : step.upcomingDetail

                    return (
                      <div key={step.key} className="relative flex gap-4 pb-5 last:pb-0">
                        {!isLast ? (
                          <div
                            aria-hidden="true"
                            className={`absolute left-5 top-10 h-[calc(100%-2.5rem)] w-0.5 -translate-x-1/2 ${
                              isCompleted ? 'bg-[#1049EB]' : 'bg-slate-200'
                            }`}
                          />
                        ) : null}

                        <div
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            isCompleted
                              ? 'bg-[#1049EB] text-white'
                              : isCurrent
                                ? 'border-2 border-[#1049EB] bg-white text-[#1049EB] ring-4 ring-[#FEB719]/30'
                                : 'border border-slate-300 bg-white text-slate-400'
                          }`}
                        >
                          {isCompleted ? (
                            <Check size={17} weight="bold" />
                          ) : isCurrent ? (
                            <span className="relative flex h-3 w-3">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FEB719] opacity-75" />
                              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#FEB719]" />
                            </span>
                          ) : (
                            <IconComponent size={16} weight="regular" />
                          )}
                        </div>

                        <div
                          className={`flex-1 rounded-xl border p-3.5 ${
                            isCurrent
                              ? 'border-[#1049EB] bg-[#F4F4F5]'
                              : 'border-slate-200/80 bg-white'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4
                              className={`text-sm font-bold ${
                                isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-500'
                              }`}
                            >
                              {step.label}
                            </h4>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                isCompleted
                                  ? 'bg-[#1049EB] text-white'
                                  : isCurrent
                                    ? 'bg-[#FEB719] text-slate-950'
                                    : 'bg-[#F4F4F5] text-slate-500'
                              }`}
                            >
                              {stateLabel}
                            </span>
                          </div>
                          <p
                            className={`mt-1 text-xs leading-relaxed ${
                              isCompleted || isCurrent ? 'text-slate-600' : 'text-slate-400'
                            }`}
                          >
                            {description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* FULL ORDER DETAILS: 2-Column on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Items in Your Order */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            aria-label="Items in your order"
            className="lg:col-span-7 xl:col-span-8"
          >
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Items in Your Order</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {totalQuantity > 0
                      ? `${totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'} in this shipment`
                      : 'Order line items'}
                  </p>
                </div>
                <Package size={18} weight="regular" className="text-slate-400" />
              </div>

              {items.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {items.map((item, idx) => {
                    const lineTotal = item.unitPrice * item.quantity
                    const productPath = item.slug ? `/product/${item.slug}` : null

                    return (
                      <div
                        key={`${item.productId}-${item.size || 'std'}-${idx}`}
                        className="flex flex-col gap-4 py-4 first:pt-1 last:pb-1 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          {item.image ? (
                            productPath ? (
                              <Link
                                to={productPath}
                                className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F4F4F5] p-1.5 transition-opacity hover:opacity-85 sm:h-20 sm:w-20"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-contain"
                                />
                              </Link>
                            ) : (
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F4F4F5] p-1.5 sm:h-20 sm:w-20">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-contain"
                                />
                              </div>
                            )
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#F4F4F5] text-slate-400 sm:h-20 sm:w-20">
                              <Package size={22} weight="regular" />
                            </div>
                          )}

                          <div className="min-w-0 space-y-1">
                            {productPath ? (
                              <Link
                                to={productPath}
                                className="group inline-flex items-center gap-1 text-sm font-bold text-slate-900 transition-colors hover:text-[#1049EB]"
                              >
                                <span className="line-clamp-2">{item.name}</span>
                                <ArrowUpRight
                                  size={14}
                                  weight="bold"
                                  className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                                />
                              </Link>
                            ) : (
                              <p className="line-clamp-2 text-sm font-bold text-slate-900">
                                {item.name}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                              <span className="rounded-full bg-[#F4F4F5] px-2.5 py-0.5 font-medium text-slate-700">
                                Qty {item.quantity}
                              </span>
                              {item.size ? (
                                <span className="rounded-full bg-[#F4F4F5] px-2.5 py-0.5 font-medium text-slate-700">
                                  Size {item.size}
                                </span>
                              ) : null}
                              <span className="tabular-nums text-slate-500">
                                {formatNaira(item.unitPrice)} each
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-2 sm:block sm:border-t-0 sm:pt-0 sm:text-right">
                          <span className="text-xs text-slate-400 sm:hidden">Line Total</span>
                          <strong className="text-sm font-bold tabular-nums text-slate-900 sm:text-base">
                            {formatNaira(lineTotal)}
                          </strong>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-xl bg-[#F4F4F5] p-6 text-center text-xs text-slate-500">
                  Itemized product details are not available for this legacy order.
                </div>
              )}
            </div>
          </motion.section>

          {/* Right Column: Order Summary, Delivery Details, Need Help */}
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="space-y-5 lg:col-span-5 xl:col-span-4"
          >
            {/* Order Summary */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">Order Summary</h2>
                <CreditCard size={18} weight="regular" className="text-slate-400" />
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold tabular-nums text-slate-900">
                    {formatNaira(itemsSubtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold tabular-nums text-slate-900">
                    {order.deliveryFee > 0 ? formatNaira(order.deliveryFee) : 'Free'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                  <span className="font-bold text-slate-900">Grand Total</span>
                  <strong className="text-lg font-bold tabular-nums text-slate-900">
                    {formatNaira(order.total)}
                  </strong>
                </div>
              </div>

              <div className="mt-4 space-y-2 rounded-xl bg-[#F4F4F5] p-3.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">Payment Method</span>
                  <span className="font-semibold text-slate-900">
                    {formatPaymentMethod(order.paymentMethod)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">Payment Reference</span>
                  <span className="truncate font-mono text-[11px] font-semibold text-slate-900">
                    {order.paymentRef || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">Date Placed</span>
                  <span className="text-right font-semibold text-slate-900">
                    {formatOrderDate(order.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">Delivery Details</h2>
                <MapPin size={18} weight="regular" className="text-slate-400" />
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <User size={15} weight="regular" className="mt-0.5 shrink-0 text-slate-400" />
                  <div>
                    <span className="block text-[11px] text-slate-500">Recipient</span>
                    <strong className="font-semibold text-slate-900">{order.customer}</strong>
                  </div>
                </div>

                {order.phone ? (
                  <div className="flex items-start gap-2.5">
                    <Phone size={15} weight="regular" className="mt-0.5 shrink-0 text-slate-400" />
                    <div>
                      <span className="block text-[11px] text-slate-500">Phone</span>
                      <span className="font-medium text-slate-800">{order.phone}</span>
                    </div>
                  </div>
                ) : null}

                {order.email ? (
                  <div className="flex items-start gap-2.5">
                    <EnvelopeSimple
                      size={15}
                      weight="regular"
                      className="mt-0.5 shrink-0 text-slate-400"
                    />
                    <div className="min-w-0">
                      <span className="block text-[11px] text-slate-500">Email</span>
                      <span className="block truncate font-medium text-slate-800">
                        {order.email}
                      </span>
                    </div>
                  </div>
                ) : null}

                <div className="flex items-start gap-2.5">
                  <MapPin size={15} weight="regular" className="mt-0.5 shrink-0 text-slate-400" />
                  <div>
                    <span className="block text-[11px] text-slate-500">Shipping Address</span>
                    <p className="font-medium leading-relaxed text-slate-800">
                      {addressParts.length > 0 ? addressParts.join(', ') : 'Nigeria'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 border-t border-slate-100 pt-3">
                  <Truck size={15} weight="regular" className="mt-0.5 shrink-0 text-slate-400" />
                  <div>
                    <span className="block text-[11px] text-slate-500">Delivery Speed</span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
                      {order.deliveryMethod === 'express'
                        ? 'Express Delivery'
                        : 'Standard Delivery'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help? Card */}
            <div className="rounded-2xl bg-[#F4F4F5] p-5 sm:p-6">
              <h3 className="text-sm font-bold text-slate-900">Need help with this order?</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Chat directly with our support team on WhatsApp for delivery updates, address
                changes, or questions about your items.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#1049EB] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#0D3EC7]"
              >
                <WhatsappLogo size={16} weight="fill" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  )
}
