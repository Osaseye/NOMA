import {
  ArrowLeft,
  ArrowsCounterClockwise,
  CaretRight,
  Check,
  CircleNotch,
  Clock,
  Copy,
  Headset,
  Lock,
  MapPin,
  ShoppingBag,
  Truck,
} from '@phosphor-icons/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { EmptyState } from '../../design-system/components/EmptyState'
import {
  koraService,
  type KoraBankTransferAccount,
} from '../../services/payments/koraService'
import {
  estimateStateDeliveryFee,
  toCartLineEntries,
  useCartStore,
} from '../../store/cartStore'
import { useAdminStore } from '../../store/adminStore'
import { useProductStore } from '../../store/productStore'
import { useUserStore } from '../../store/userStore'
import type { OrderItem } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT - Abuja',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
]

interface DeliveryEstimate {
  standardFee: number
  expressFee: number
  etaDays: string
  zone: string
}

function buildPaymentRef(method: string): string {
  const prefix =
    method === 'pod'
      ? 'POD'
      : method === 'transfer'
        ? 'TRF'
        : method === 'ussd'
          ? 'USS'
          : 'PSK'
  const suffix = Date.now().toString().slice(-6)
  return `${prefix}-${suffix}`
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCart, deliveryState, setDeliveryState } = useCartStore()
  const { settings } = useAdminStore()
  const { products } = useProductStore()

  const activeDeliveryStates = useMemo(() => {
    if (Array.isArray(settings.deliveryStates) && settings.deliveryStates.length > 0) {
      const enabled = settings.deliveryStates.filter((s) => s.enabled).map((s) => s.name)
      if (enabled.length > 0) return enabled
    }
    return NIGERIAN_STATES
  }, [settings.deliveryStates])
  const { profile, updateDefaultAddress } = useUserStore()

  const [fullName, setFullName] = useState(profile.defaultAddress.fullName || profile.name || '')
  const [phoneNumber, setPhoneNumber] = useState(
    profile.defaultAddress.phone || profile.phone || '',
  )
  const [emailAddress, setEmailAddress] = useState(
    profile.defaultAddress.email || profile.email || '',
  )
  const [state, setState] = useState(
    profile.defaultAddress.state || deliveryState || 'Lagos',
  )
  const [city, setCity] = useState(profile.defaultAddress.city || '')
  const [neighborhood, setNeighborhood] = useState(profile.defaultAddress.neighborhood || '')
  const [address, setAddress] = useState(profile.defaultAddress.address || '')
  const [additionalInfo, setAdditionalInfo] = useState(
    profile.defaultAddress.additionalInfo || '',
  )
  const [saveAddress, setSaveAddress] = useState(true)

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard')
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'pod'>('transfer')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Live Kora Bank Transfer Payment State
  const [koraTransfer, setKoraTransfer] = useState<KoraBankTransferAccount | null>(null)
  const [verifyingKora, setVerifyingKora] = useState(false)

  const cartEntries = useMemo(() => toCartLineEntries(items), [items])

  const checkoutItems = useMemo(() => {
    return cartEntries
      .map((entry) => {
        const product = products.find((p) => p.id === entry.productId)
        if (!product) return null
        return {
          lineKey: entry.key,
          productId: product.id,
          slug: product.slug || product.id,
          name: product.name,
          image: product.image || (Array.isArray(product.images) && product.images[0]) || '',
          unitPrice: product.finalPrice,
          basePrice: product.basePrice,
          quantity: entry.quantity,
          bulky: Boolean(product.bulky),
          ...(entry.size ? { size: entry.size } : {}),
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
  }, [cartEntries, products])

  const hasBulkyItem = checkoutItems.some((item) => item.bulky)
  const itemCount = checkoutItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = checkoutItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  const [remoteEstimate, setRemoteEstimate] = useState<{
    key: string
    data: DeliveryEstimate
  } | null>(null)
  const [estimatingDelivery, setEstimatingDelivery] = useState(false)

  const estimateKey = `${state}::${hasBulkyItem ? '1' : '0'}`
  const localFallback = useMemo<DeliveryEstimate>(() => {
    const est = estimateStateDeliveryFee(state || 'Lagos', hasBulkyItem, subtotal)
    return {
      standardFee: est.standardFee,
      expressFee: est.expressFee,
      etaDays: est.zoneLabel.split('(')[1]?.replace(')', '') || '2–5 business days',
      zone: est.zoneLabel.split('(')[0]?.trim() || 'Nationwide Delivery',
    }
  }, [state, hasBulkyItem, subtotal])

  const deliveryEstimate =
    remoteEstimate && remoteEstimate.key === estimateKey ? remoteEstimate.data : localFallback

  useEffect(() => {
    if (!state.trim()) {
      return
    }
    const controller = new AbortController()
    const currentKey = `${state}::${hasBulkyItem ? '1' : '0'}`

    const fetchEstimate = async () => {
      setEstimatingDelivery(true)
      try {
        const res = await fetch(
          `/api/delivery-estimate?state=${encodeURIComponent(state)}&bulky=${String(hasBulkyItem)}`,
          { signal: controller.signal },
        )
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const json = (await res.json()) as Partial<DeliveryEstimate>
        if (
          typeof json.standardFee === 'number' &&
          typeof json.expressFee === 'number' &&
          typeof json.etaDays === 'string' &&
          typeof json.zone === 'string'
        ) {
          setRemoteEstimate({
            key: currentKey,
            data: {
              standardFee: localFallback.standardFee === 0 ? 0 : json.standardFee,
              expressFee: json.expressFee,
              etaDays: json.etaDays,
              zone: json.zone,
            },
          })
        }
      } catch {
        // Fallback to local Nigerian zone table silently
      } finally {
        if (!controller.signal.aborted) {
          setEstimatingDelivery(false)
        }
      }
    }

    fetchEstimate()
    return () => controller.abort()
  }, [state, hasBulkyItem, localFallback.standardFee])

  const shippingFee =
    deliveryMethod === 'express' ? deliveryEstimate.expressFee : deliveryEstimate.standardFee
  const grandTotal = subtotal + shippingFee

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.')
      return
    }

    toast.info('Requesting device location...')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        toast.success(
          `GPS coordinates captured (${latitude.toFixed(3)}, ${longitude.toFixed(3)}). Complete your street and landmark below.`,
        )
      },
      () => {
        toast.error('Unable to retrieve location. Please fill in your address manually.')
      },
      { timeout: 10000 },
    )
  }

  const finalizeAndSaveOrder = useCallback(
    async (confirmedPaymentRef: string, orderStatus: 'placed' | 'processing' = 'placed') => {
      if (saveAddress) {
        updateDefaultAddress({
          fullName: fullName.trim(),
          phone: phoneNumber.trim(),
          email: emailAddress.trim(),
          state,
          city: city.trim(),
          neighborhood: neighborhood.trim(),
          address: address.trim(),
          additionalInfo: additionalInfo.trim(),
        })
      }

      const orderItems: OrderItem[] = checkoutItems.map((item) => ({
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        image: item.image,
        unitPrice: item.unitPrice,
        basePrice: item.basePrice,
        quantity: item.quantity,
        ...(item.size ? { size: item.size } : {}),
      }))

      const baseAmountOwed = orderItems.reduce(
        (sum, item) => sum + item.basePrice * item.quantity,
        0,
      )
      const markupEarned = orderItems.reduce(
        (sum, item) => sum + Math.max(0, item.unitPrice - item.basePrice) * item.quantity,
        0,
      )

      const deliveryArea = [neighborhood.trim(), city.trim(), state].filter(Boolean).join(', ')

      const savedOrder = await useProductStore.getState().addOrder({
        id: '',
        customer: fullName.trim(),
        phone: phoneNumber.trim(),
        ...(emailAddress.trim() ? { email: emailAddress.trim() } : {}),
        status: orderStatus,
        total: grandTotal,
        deliveryFee: shippingFee,
        deliveryArea,
        baseAmountOwed,
        markupEarned,
        paymentRef: confirmedPaymentRef,
        items: orderItems,
        deliveryMethod,
        paymentMethod,
        address: address.trim(),
        city: city.trim(),
        state,
        neighborhood: neighborhood.trim(),
        createdAt: new Date().toISOString(),
        ...(profile.uid ? { userId: profile.uid } : {}),
      })

      clearCart()
      setKoraTransfer(null)

      // Persist order ID locally so guest "Track Your Order" always shows recent orders immediately
      try {
        const raw = localStorage.getItem('noma_recent_order_ids')
        const existing: string[] = raw ? JSON.parse(raw) : []
        const updated = Array.from(new Set([savedOrder.id, ...existing])).slice(0, 20)
        localStorage.setItem('noma_recent_order_ids', JSON.stringify(updated))
      } catch {
        // Ignore storage errors
      }

      toast.success(`Order ${savedOrder.id} confirmed!`)
      navigate(`/order-success?id=${encodeURIComponent(savedOrder.id)}`, {
        state: { order: savedOrder },
      })
    },
    [
      address,
      checkoutItems,
      city,
      clearCart,
      deliveryMethod,
      emailAddress,
      fullName,
      grandTotal,
      navigate,
      neighborhood,
      paymentMethod,
      phoneNumber,
      profile.uid,
      saveAddress,
      shippingFee,
      state,
      additionalInfo,
      updateDefaultAddress,
    ]
  )

  const handleVerifyKoraTransfer = useCallback(
    async (silent = false) => {
      if (!koraTransfer || verifyingKora) return
      setVerifyingKora(true)
      try {
        const res = await koraService.verifyCharge(koraTransfer.reference)
        if (res.paid) {
          toast.success('Bank transfer confirmed via Kora!')
          await finalizeAndSaveOrder(koraTransfer.reference, 'processing')
        } else if (!silent) {
          toast.info('Transfer not detected yet. Please wait a few seconds after sending and tap Verify again.')
        }
      } catch {
        if (!silent) {
          toast.error('Could not reach payment verification service. Try again shortly.')
        }
      } finally {
        setVerifyingKora(false)
      }
    },
    [finalizeAndSaveOrder, koraTransfer, verifyingKora]
  )

  // Auto-poll Kora every 5 seconds while the virtual bank account screen is open
  useEffect(() => {
    if (!koraTransfer) return
    const timer = window.setInterval(() => {
      handleVerifyKoraTransfer(true)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [koraTransfer, handleVerifyKoraTransfer])

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (checkoutItems.length === 0) {
      toast.error('Your bag is empty. Add items before checking out.')
      return
    }

    if (
      !fullName.trim() ||
      !phoneNumber.trim() ||
      !state ||
      !city.trim() ||
      !neighborhood.trim() ||
      !address.trim()
    ) {
      toast.error('Please complete all required delivery fields.')
      return
    }

    setIsSubmitting(true)
    try {
      const effectiveMethod = settings.payOnDeliveryEnabled ? paymentMethod : 'transfer'

      // Live Kora Bank Transfer flow (generates one-time bank & account number via Cloudflare Worker)
      if (effectiveMethod === 'transfer') {
        const ref = `NMA-KORA-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`
        const account = await koraService.initiateBankTransfer({
          amount: grandTotal,
          customerName: fullName.trim(),
          customerEmail: emailAddress.trim() || undefined,
          reference: ref,
          narration: `Noma Order for ${fullName.trim()}`,
        })
        setKoraTransfer(account)
        toast.success('Transfer account ready! Send the exact amount to complete your order.')
        return
      }

      const paymentRef = buildPaymentRef(effectiveMethod)
      await finalizeAndSaveOrder(paymentRef, 'placed')
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Could not submit your order. Please check your connection and try again.'
      console.error('Order submission failed:', err)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-white px-4 py-16">
        <div className="w-full max-w-md">
          <EmptyState
            icon={<ShoppingBag size={24} weight="regular" />}
            title="Your bag is empty"
            detail="Add products to your bag before proceeding to checkout."
            action={
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              >
                <ArrowLeft size={14} weight="bold" />
                <span>Explore Catalog</span>
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  const inputClass =
    'h-11 w-full rounded-xl border border-slate-200 bg-[#F4F4F5]/70 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:bg-white focus:outline-none'

  return (
    <div className="min-h-screen bg-white pb-24 pt-5 text-slate-900">
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        {/* Single Clean Header Bar */}
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
          <div>
            <nav className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">
              <Link to="/" className="hover:text-slate-900">
                Home
              </Link>
              <CaretRight size={11} />
              <Link to="/cart" className="hover:text-slate-900">
                Bag
              </Link>
              <CaretRight size={11} />
              <span className="font-medium text-slate-800">Checkout</span>
            </nav>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Checkout
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <Lock size={14} weight="bold" className="text-slate-800" />
            <span>Secure Checkout • Delivery Confirmed Before Payment</span>
          </div>
        </div>

        {/* 7/5 Sticky Desktop Split */}
        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Left 7 Cols: Delivery Info + Shipping Speed + Payment Method */}
            <div className="space-y-6 lg:col-span-7">
              {/* Step 1: Delivery Address */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
                <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                      1. Delivery Address
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Where should we deliver your order?
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F4F5] px-3.5 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-200"
                  >
                    <MapPin size={13} weight="fill" />
                    <span>Use GPS</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Recipient full name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Phone Number *
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F4F4F5] px-3 text-xs font-semibold text-slate-800">
                        <svg
                          viewBox="0 0 30 20"
                          aria-hidden="true"
                          className="h-3 w-4.5 rounded-[2px] border border-slate-300"
                        >
                          <rect width="10" height="20" x="0" y="0" fill="#008751" />
                          <rect width="10" height="20" x="10" y="0" fill="#FFFFFF" />
                          <rect width="10" height="20" x="20" y="0" fill="#008751" />
                        </svg>
                        <span>+234</span>
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        placeholder="803 000 0000"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Email Address (Optional, for order receipt)
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="you@domain.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      State *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value)
                        setDeliveryState(e.target.value)
                      }}
                      required
                      className={inputClass}
                    >
                      <option value="">Select state</option>
                      {activeDeliveryStates.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      City / LGA *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="Ikeja, Lekki, Ibadan, Wuse..."
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Area / Neighbourhood *
                    </label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      required
                      placeholder="Estate, district, or neighbourhood"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Street / House / Building *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="House number and street name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Nearest Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Landmark or gate instruction"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <label className="inline-flex cursor-pointer items-center gap-2.5 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="h-4 w-4 rounded accent-slate-900"
                    />
                    <span>Save this address for future orders</span>
                  </label>
                </div>
              </section>

              {/* Step 2: Delivery Speed */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                      2. Delivery Speed
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Destination Zone: <strong className="text-slate-800">{deliveryEstimate.zone}</strong>
                    </p>
                  </div>
                  {estimatingDelivery ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <CircleNotch size={13} className="animate-spin" />
                      <span>Updating...</span>
                    </span>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    {
                      id: 'standard' as const,
                      title: 'Standard Delivery',
                      subtitle: deliveryEstimate.etaDays,
                      fee: deliveryEstimate.standardFee,
                    },
                    {
                      id: 'express' as const,
                      title: 'Express Priority',
                      subtitle: 'Priority dispatch routing',
                      fee: deliveryEstimate.expressFee,
                    },
                  ].map((option) => {
                    const isSelected = deliveryMethod === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setDeliveryMethod(option.id)}
                        className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-[#F4F4F5]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{option.title}</span>
                            {isSelected ? (
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-white">
                                <Check size={10} weight="bold" />
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 text-xs text-slate-500">{option.subtitle}</p>
                        </div>
                        <strong className="text-sm font-bold tabular-nums text-slate-900">
                          {option.fee === 0 ? 'Free' : formatNaira(option.fee)}
                        </strong>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Step 3: Payment Method */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
                <div className="mb-4 border-b border-slate-100 pb-4">
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                    3. Payment Option
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Choose your preferred payment method.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    {
                      id: 'transfer',
                      title: 'Instant Bank Transfer (Kora)',
                      subtitle: 'Pay via one-time Naira account number with instant verification',
                    },
                    ...(settings.payOnDeliveryEnabled
                      ? [
                          {
                            id: 'pod',
                            title: 'Pay on Delivery',
                            subtitle: 'Pay when your order arrives',
                          },
                        ]
                      : []),
                  ].map((pm) => {
                    const effectiveMethod = settings.payOnDeliveryEnabled ? paymentMethod : 'transfer'
                    const isSelected = effectiveMethod === pm.id
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as typeof paymentMethod)}
                        className={`flex items-start justify-between rounded-xl border p-4 text-left transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-[#F4F4F5]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <span className="text-sm font-bold text-slate-900">{pm.title}</span>
                          <p className="mt-0.5 text-xs text-slate-500">{pm.subtitle}</p>
                        </div>
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected ? <Check size={11} weight="bold" /> : null}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-4 rounded-xl bg-[#F4F4F5] p-4 text-xs leading-relaxed text-slate-600">
                  {(settings.payOnDeliveryEnabled ? paymentMethod : 'transfer') === 'transfer'
                    ? 'Tap Pay Now to generate a one-time Kora bank account number. Once your transfer lands, your order is confirmed automatically.'
                    : 'Your order will be queued for dispatch and you will pay the rider upon delivery.'}
                </div>
              </section>
            </div>

            {/* Right 5 Cols: Sticky Order Summary & Place Order CTA */}
            <aside className="space-y-4 lg:sticky lg:top-24 lg:col-span-5">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-base font-bold text-slate-900">
                    Order Summary ({itemCount})
                  </h2>
                  <Link
                    to="/cart"
                    className="text-xs font-semibold text-slate-600 hover:text-slate-950 hover:underline"
                  >
                    Edit Bag
                  </Link>
                </div>

                {/* Line Items */}
                <div className="no-scrollbar max-h-72 divide-y divide-slate-100 overflow-y-auto py-2">
                  {checkoutItems.map((ci) => (
                    <div
                      key={ci.lineKey}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={ci.image}
                          alt={ci.name}
                          className="h-12 w-12 shrink-0 rounded-xl bg-[#F4F4F5] object-contain p-1.5"
                        />
                        <div className="min-w-0">
                          <h3 className="line-clamp-1 text-xs font-bold text-slate-900">
                            {ci.name}
                          </h3>
                          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span>Qty: {ci.quantity}</span>
                            {ci.size ? <span>• Size: {ci.size}</span> : null}
                          </div>
                        </div>
                      </div>
                      <strong className="shrink-0 text-xs font-bold tabular-nums text-slate-900">
                        {formatNaira(ci.unitPrice * ci.quantity)}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Subtotal</span>
                    <strong className="font-semibold tabular-nums text-slate-900">
                      {formatNaira(subtotal)}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span>
                      Delivery ({deliveryMethod === 'express' ? 'Express' : 'Standard'} to{' '}
                      {state || 'Lagos'})
                    </span>
                    <strong className="font-semibold tabular-nums text-slate-900">
                      {shippingFee === 0 ? 'Free' : formatNaira(shippingFee)}
                    </strong>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-slate-100 pt-3">
                    <span className="text-sm font-bold text-slate-900">Total to Pay</span>
                    <strong className="text-xl font-bold tabular-nums text-slate-900">
                      {formatNaira(grandTotal)}
                    </strong>
                  </div>
                </div>

                {/* Place Order CTA */}
                <div className="mt-6 space-y-2.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <CircleNotch size={17} className="animate-spin" />
                        <span>
                          {(settings.payOnDeliveryEnabled ? paymentMethod : 'transfer') === 'transfer'
                            ? 'Generating Transfer Account...'
                            : 'Placing Order...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock size={16} weight="bold" />
                        <span>
                          {(settings.payOnDeliveryEnabled ? paymentMethod : 'transfer') === 'transfer'
                            ? `Pay Now • ${formatNaira(grandTotal)}`
                            : `Place Order (POD) • ${formatNaira(grandTotal)}`}
                        </span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-400">
                    By placing this order, you agree to Noma&apos;s{' '}
                    <Link to="/terms" className="font-medium text-slate-700 underline">
                      Terms &amp; Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>

              {/* Clean Monochrome Assurances */}
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-[#F4F4F5] p-4 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  <Truck size={15} weight="regular" className="shrink-0 text-slate-800" />
                  <span>Nationwide Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={15} weight="regular" className="shrink-0 text-slate-800" />
                  <span>{deliveryEstimate.etaDays}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowsCounterClockwise
                    size={15}
                    weight="regular"
                    className="shrink-0 text-slate-800"
                  />
                  <span>Easy Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headset size={15} weight="regular" className="shrink-0 text-slate-800" />
                  <span>WhatsApp Support</span>
                </div>
              </div>
            </aside>
          </div>
        </form>

        {/* Focused Full-Screen Kora Bank Transfer Payment Modal */}
        {koraTransfer ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Kora Instant Bank Transfer
                  </span>
                  <h2 className="mt-1 text-lg font-bold text-slate-950">
                    Transfer {formatNaira(koraTransfer.amountExpected || koraTransfer.amount)}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Send the exact amount to this one-time virtual account from any Nigerian bank app.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setKoraTransfer(null)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-950"
                >
                  Cancel
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {koraTransfer.checkoutUrl ? (
                  <div className="space-y-3">
                    <div className="rounded-xl bg-[#F4F4F5] p-4 text-xs leading-relaxed text-slate-600">
                      Click below to open Kora&apos;s secure Bank Transfer window, copy the one-time bank account number, and complete your transfer. This page will automatically confirm your order as soon as Kora receives your transfer.
                    </div>
                    <a
                      href={koraTransfer.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                      <Lock size={14} weight="bold" />
                      <span>Open Kora Bank Transfer Window ({formatNaira(koraTransfer.amountExpected || koraTransfer.amount)})</span>
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-[#F4F4F5] p-3.5">
                        <span className="block text-[11px] text-slate-500">Bank Name</span>
                        <strong className="mt-0.5 block text-sm font-bold text-slate-950">
                          {koraTransfer.bankName}
                        </strong>
                      </div>
                      <div className="rounded-xl bg-[#F4F4F5] p-3.5">
                        <span className="block text-[11px] text-slate-500">Account Name</span>
                        <strong className="mt-0.5 block text-sm font-bold text-slate-950">
                          {koraTransfer.accountName}
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-900 bg-white p-4">
                      <div>
                        <span className="block text-[11px] text-slate-500">Account Number</span>
                        <strong className="mt-0.5 block font-mono text-xl font-bold tracking-wider text-slate-950">
                          {koraTransfer.accountNumber}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(koraTransfer.accountNumber)
                          toast.success('Account number copied!')
                        }}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-950 px-3.5 text-xs font-semibold text-white hover:bg-slate-800"
                      >
                        <Copy size={13} />
                        <span>Copy</span>
                      </button>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between rounded-xl bg-[#F4F4F5] p-3.5">
                  <div>
                    <span className="block text-[11px] text-slate-500">Exact Amount to Send</span>
                    <strong className="mt-0.5 block text-base font-bold tabular-nums text-slate-950">
                      {formatNaira(koraTransfer.amountExpected || koraTransfer.amount)}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        String(koraTransfer.amountExpected || koraTransfer.amount)
                      )
                      toast.success('Amount copied!')
                    }}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 hover:border-slate-950"
                  >
                    <Copy size={13} />
                    <span>Copy</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  Reference: <span className="font-mono text-slate-600">{koraTransfer.reference}</span>
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  disabled={verifyingKora}
                  onClick={() => handleVerifyKoraTransfer(false)}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-slate-950 bg-white px-5 text-xs font-semibold text-slate-950 transition-colors hover:bg-slate-950 hover:text-white disabled:opacity-50"
                >
                  {verifyingKora ? (
                    <>
                      <CircleNotch size={15} className="animate-spin" />
                      <span>Verifying Transfer with Kora...</span>
                    </>
                  ) : (
                    <span>I&apos;ve Sent the Transfer — Verify Payment</span>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <CircleNotch size={12} className="animate-spin text-slate-700" />
                  <span>Automatically checking Kora webhook every 5 seconds...</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
