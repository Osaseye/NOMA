import {
  ArrowLeft,
  ArrowsCounterClockwise,
  CircleNotch,
  Clock,
  Headset,
  Lock,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { EmptyState } from '../../design-system/components/EmptyState'
import { Field, SelectInput, TextInput } from '../../design-system/components/Field'
import { toCartLineEntries, useCartStore } from '../../store/cartStore'
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

function computeLocalDeliveryEstimate(stateParam: string, bulky: boolean): DeliveryEstimate {
  const normalized = stateParam.trim().toLowerCase()
  let baseFee = 7500
  let zone = 'Nationwide Interstate'
  let etaDays = '3-5 business days'

  if (!normalized || normalized === 'lagos') {
    baseFee = 3500
    zone = normalized === 'lagos' ? 'Lagos Metro' : 'Standard Metro Estimate'
    etaDays = normalized === 'lagos' ? '1-2 business days' : '2-5 business days'
  } else if (normalized === 'ogun' || normalized === 'oyo') {
    baseFee = 4500
    zone = 'Southwest Corridor'
    etaDays = '2-3 business days'
  } else if (
    normalized === 'fct - abuja' ||
    normalized === 'abuja' ||
    normalized === 'fct' ||
    normalized === 'rivers'
  ) {
    baseFee = 6000
    zone = 'Major Hub Express'
    etaDays = '2-4 business days'
  }

  const standardFee = baseFee + (bulky ? 4000 : 0)
  const expressFee = Math.round(standardFee * 1.5)
  return { standardFee, expressFee, etaDays, zone }
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
  const { items, clearCart } = useCartStore()
  const { products } = useProductStore()
  const { profile, updateDefaultAddress } = useUserStore()

  const [fullName, setFullName] = useState(profile.defaultAddress.fullName || profile.name || '')
  const [phoneNumber, setPhoneNumber] = useState(
    profile.defaultAddress.phone || profile.phone || ''
  )
  const [emailAddress, setEmailAddress] = useState(
    profile.defaultAddress.email || profile.email || ''
  )
  const [state, setState] = useState(profile.defaultAddress.state || '')
  const [city, setCity] = useState(profile.defaultAddress.city || '')
  const [neighborhood, setNeighborhood] = useState(profile.defaultAddress.neighborhood || '')
  const [address, setAddress] = useState(profile.defaultAddress.address || '')
  const [additionalInfo, setAdditionalInfo] = useState(
    profile.defaultAddress.additionalInfo || ''
  )
  const [saveAddress, setSaveAddress] = useState(true)

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard')
  const [paymentMethod, setPaymentMethod] = useState<
    'card' | 'transfer' | 'pod' | 'ussd' | 'other'
  >('card')

  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
  const localFallback = useMemo(
    () => computeLocalDeliveryEstimate(state, hasBulkyItem),
    [state, hasBulkyItem]
  )
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
          { signal: controller.signal }
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
              standardFee: json.standardFee,
              expressFee: json.expressFee,
              etaDays: json.etaDays,
              zone: json.zone,
            },
          })
        }
      } catch {
        // Fallback to local Nigerian zone table silently when Worker is unavailable in local dev
      } finally {
        if (!controller.signal.aborted) {
          setEstimatingDelivery(false)
        }
      }
    }

    fetchEstimate()
    return () => controller.abort()
  }, [state, hasBulkyItem])

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
          `GPS coordinates captured (${latitude.toFixed(3)}, ${longitude.toFixed(3)}). Complete your street and landmark below.`
        )
      },
      () => {
        toast.error('Unable to retrieve location. Please fill in your address manually.')
      },
      { timeout: 10000 }
    )
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (checkoutItems.length === 0) {
      toast.error('Your cart is empty. Add items before checking out.')
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

      // Compute supplier cost & operator markup strictly inside payload (never rendered)
      const baseAmountOwed = orderItems.reduce(
        (sum, item) => sum + item.basePrice * item.quantity,
        0
      )
      const markupEarned = orderItems.reduce(
        (sum, item) => sum + Math.max(0, item.unitPrice - item.basePrice) * item.quantity,
        0
      )

      const deliveryArea = [neighborhood.trim(), city.trim(), state].filter(Boolean).join(', ')
      const paymentRef = buildPaymentRef(paymentMethod)

      const savedOrder = await useProductStore.getState().addOrder({
        id: '',
        customer: fullName.trim(),
        phone: phoneNumber.trim(),
        ...(emailAddress.trim() ? { email: emailAddress.trim() } : {}),
        status: 'placed',
        total: grandTotal,
        deliveryFee: shippingFee,
        deliveryArea,
        baseAmountOwed,
        markupEarned,
        paymentRef,
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
      toast.success(`Order ${savedOrder.id} confirmed!`)
      navigate(`/order-success?id=${encodeURIComponent(savedOrder.id)}`, {
        state: { order: savedOrder },
      })
    } catch (err) {
      console.error('Order submission failed:', err)
      toast.error('Could not submit your order. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F6F7F9] px-4 py-16">
        <div className="w-full max-w-md">
          <EmptyState
            icon={<ShoppingBag size={24} weight="regular" />}
            title="Your Cart is Empty"
            detail="Add products to your cart before proceeding to checkout."
            action={
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 rounded-[6px] bg-[#0B1220] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1049EB]"
              >
                <ArrowLeft size={14} weight="regular" />
                <span>Explore Catalog</span>
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] pb-24 pt-4 text-[#0B1220]">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#E5E7EB] pb-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0B1220] sm:text-3xl">
              Checkout
            </h1>
            <p className="mt-1 text-xs text-[#5E6675] sm:text-sm">
              Confirm Nigerian delivery details and fee upfront before placing your order.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-[6px] border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs font-semibold text-[#0B1220]">
            <ShieldCheck size={16} weight="fill" className="text-[#1049EB]" />
            <span>Encrypted checkout</span>
          </div>
        </div>

        {/* 4-Step Mono Progress Header */}
        <div className="mb-8 flex items-center justify-between gap-4 overflow-x-auto rounded-[8px] border border-[#E5E7EB] bg-white px-4 py-3 text-xs font-semibold [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            { num: '01', label: 'Delivery Info', active: true },
            { num: '02', label: 'Delivery Method', active: Boolean(state) },
            { num: '03', label: 'Payment', active: true },
            { num: '04', label: 'Review & Pay', active: true },
          ].map((step, idx) => (
            <div key={step.num} className="flex shrink-0 items-center gap-2">
              {idx > 0 ? <span className="mr-2 hidden h-px w-6 bg-[#E5E7EB] sm:inline-block" /> : null}
              <span
                className={`rounded-[4px] px-1.5 py-0.5 font-mono text-[11px] font-bold ${
                  step.active
                    ? 'bg-[#EEF3FE] text-[#1049EB]'
                    : 'bg-[#F6F7F9] text-[#5E6675]'
                }`}
              >
                {step.num}
              </span>
              <span className={step.active ? 'text-[#0B1220]' : 'text-[#5E6675]'}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* 7/5 Sticky Desktop Split */}
        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Left 7 Cols: Delivery Info + Delivery Method + Payment */}
            <div className="space-y-6 lg:col-span-7">
              {/* Section 01: Delivery Information */}
              <section className="space-y-5 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
                <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
                  <span className="rounded-[4px] bg-[#0B1220] px-2 py-1 font-mono text-xs font-bold text-white">
                    01
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#0B1220]">Delivery Information</h2>
                    <p className="text-xs text-[#5E6675]">
                      Recipient contact and destination across Nigeria.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Full Name *">
                    <TextInput
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Recipient full name"
                    />
                  </Field>

                  <Field label="Phone Number *">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-3 py-2.5 font-mono text-xs font-semibold text-[#0B1220]">
                        +234 (NG)
                      </span>
                      <TextInput
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        placeholder="803 000 0000"
                        className="font-mono"
                      />
                    </div>
                  </Field>

                  <div className="sm:col-span-2">
                    <Field label="Email Address (for receipt)">
                      <TextInput
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="you@domain.com"
                      />
                    </Field>
                  </div>

                  <Field label="State *">
                    <SelectInput
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    >
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>

                  <Field label="City / LGA *">
                    <TextInput
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="Ikeja, Lekki, Ibadan, Wuse..."
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <Field label="Area / Neighbourhood *">
                      <TextInput
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        required
                        placeholder="Estate, district, or neighbourhood"
                      />
                    </Field>
                  </div>

                  <Field label="Street / House / Building *">
                    <TextInput
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="Street number and building name"
                    />
                  </Field>

                  <Field label="Landmark / Gate Code (Optional)">
                    <TextInput
                      type="text"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Nearest landmark or gate instruction"
                    />
                  </Field>
                </div>

                <div className="flex flex-col justify-between gap-3 border-t border-[#E5E7EB] pt-4 sm:flex-row sm:items-center">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#0B1220]">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="h-4 w-4 rounded-[4px] accent-[#1049EB]"
                    />
                    <span>Save this address for future checkouts</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="inline-flex items-center gap-1.5 self-start rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-3 py-1.5 text-xs font-semibold text-[#0B1220] transition-colors hover:border-[#1049EB] hover:text-[#1049EB] sm:self-auto"
                  >
                    <MapPin size={14} weight="regular" className="text-[#1049EB]" />
                    <span>Capture GPS coordinates</span>
                  </button>
                </div>
              </section>

              {/* Section 02: Delivery Method */}
              <section className="space-y-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-[4px] bg-[#0B1220] px-2 py-1 font-mono text-xs font-bold text-white">
                      02
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-[#0B1220]">Delivery Method</h2>
                      <p className="text-xs text-[#5E6675]">
                        Zone: <strong className="text-[#0B1220]">{deliveryEstimate.zone}</strong>
                        {hasBulkyItem ? ' (includes heavy freight handling)' : ''}
                      </p>
                    </div>
                  </div>
                  {estimatingDelivery ? (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#1049EB]">
                      <CircleNotch size={13} className="animate-spin" />
                      <span>Updating...</span>
                    </span>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <label
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-[8px] border p-4 transition-colors ${
                      deliveryMethod === 'standard'
                        ? 'border-[#1049EB] bg-[#EEF3FE]/50'
                        : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="standard"
                        checked={deliveryMethod === 'standard'}
                        onChange={() => setDeliveryMethod('standard')}
                        className="h-4 w-4 accent-[#1049EB]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#0B1220]">
                            Standard Delivery
                          </span>
                          <span className="rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 text-[10px] font-semibold text-[#15803D]">
                            Best value
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[#5E6675]">
                          {deliveryEstimate.etaDays} : Reliable doorstep dispatch
                        </p>
                      </div>
                    </div>
                    <strong className="font-mono text-sm font-bold text-[#0B1220]">
                      {formatNaira(deliveryEstimate.standardFee)}
                    </strong>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-[8px] border p-4 transition-colors ${
                      deliveryMethod === 'express'
                        ? 'border-[#1049EB] bg-[#EEF3FE]/50'
                        : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="express"
                        checked={deliveryMethod === 'express'}
                        onChange={() => setDeliveryMethod('express')}
                        className="h-4 w-4 accent-[#1049EB]"
                      />
                      <div>
                        <span className="text-sm font-bold text-[#0B1220]">
                          Express Priority Dispatch
                        </span>
                        <p className="mt-0.5 text-xs text-[#5E6675]">
                          Priority routing for urgent deliveries
                        </p>
                      </div>
                    </div>
                    <strong className="font-mono text-sm font-bold text-[#0B1220]">
                      {formatNaira(deliveryEstimate.expressFee)}
                    </strong>
                  </label>
                </div>
              </section>

              {/* Section 03: Payment Method */}
              <section className="space-y-5 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
                <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
                  <span className="rounded-[4px] bg-[#0B1220] px-2 py-1 font-mono text-xs font-bold text-white">
                    03
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#0B1220]">Payment Method</h2>
                    <p className="text-xs text-[#5E6675]">
                      Select how you want to complete payment.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {[
                    {
                      id: 'card',
                      title: 'Card (Debit / Credit)',
                      subtitle: 'Verve, Mastercard, Visa',
                      badge: null,
                    },
                    {
                      id: 'transfer',
                      title: 'Bank Transfer',
                      subtitle: 'Instant Naira account transfer',
                      badge: null,
                    },
                    {
                      id: 'pod',
                      title: 'Pay on Delivery',
                      subtitle: 'Pay upon courier arrival',
                      badge: 'Selected areas',
                    },
                    {
                      id: 'ussd',
                      title: 'USSD / Mobile Money',
                      subtitle: 'Dial bank code directly',
                      badge: null,
                    },
                    {
                      id: 'other',
                      title: 'Paystack / Flutterwave',
                      subtitle: 'Gateway checkout redirect',
                      badge: null,
                    },
                  ].map((pm) => (
                    <label
                      key={pm.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-[8px] border p-3.5 transition-colors ${
                        paymentMethod === pm.id
                          ? 'border-[#1049EB] bg-[#EEF3FE]/50'
                          : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.id}
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id as typeof paymentMethod)}
                        className="mt-1 h-4 w-4 accent-[#1049EB]"
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-bold text-[#0B1220]">{pm.title}</span>
                          {pm.badge ? (
                            <span className="rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] px-1.5 py-0.5 text-[9px] font-semibold text-[#15803D]">
                              {pm.badge}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 text-[11px] text-[#5E6675]">{pm.subtitle}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'card' ? (
                  <div className="space-y-4 rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-4 sm:p-5">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                      Card Details
                    </span>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Field label="Card Number">
                          <TextInput
                            type="text"
                            inputMode="numeric"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="0000 0000 0000 0000"
                            className="font-mono"
                          />
                        </Field>
                      </div>
                      <div className="sm:col-span-2">
                        <Field label="Cardholder Name">
                          <TextInput
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="Name on card"
                          />
                        </Field>
                      </div>
                      <Field label="Expiry">
                        <TextInput
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM / YY"
                          className="font-mono"
                        />
                      </Field>
                      <Field label="CVV">
                        <TextInput
                          type="password"
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="000"
                          className="font-mono"
                        />
                      </Field>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] p-4 text-xs text-[#374151]">
                    Payment confirmation instructions and your Noma reference number will be issued immediately once your order is placed.
                  </div>
                )}
              </section>
            </div>

            {/* Right 5 Cols: Sticky Order Review + Totals + CTA */}
            <aside className="space-y-4 lg:sticky lg:top-24 lg:col-span-5">
              <div className="space-y-5 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-[4px] bg-[#0B1220] px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">
                      04
                    </span>
                    <h2 className="text-base font-bold text-[#0B1220]">
                      Order Review (<span className="font-mono">{itemCount}</span>)
                    </h2>
                  </div>
                  <Link
                    to="/cart"
                    className="text-xs font-semibold text-[#1049EB] hover:underline"
                  >
                    Edit Cart
                  </Link>
                </div>

                {/* Line Items */}
                <div className="max-h-72 divide-y divide-[#E5E7EB] overflow-y-auto pr-1">
                  {checkoutItems.map((ci) => (
                    <div
                      key={ci.lineKey}
                      className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={ci.image}
                          alt={ci.name}
                          className="h-12 w-12 shrink-0 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] object-contain p-1"
                        />
                        <div className="min-w-0">
                          <h3 className="line-clamp-1 text-xs font-bold text-[#0B1220]">
                            {ci.name}
                          </h3>
                          <div className="mt-0.5 flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#5E6675]">
                            <span>Qty: {ci.quantity}</span>
                            {ci.size ? <span>Size: {ci.size}</span> : null}
                          </div>
                        </div>
                      </div>
                      <strong className="shrink-0 font-mono text-xs font-bold text-[#0B1220]">
                        {formatNaira(ci.unitPrice * ci.quantity)}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2.5 border-t border-[#E5E7EB] pt-4 text-xs">
                  <div className="flex items-center justify-between text-[#5E6675]">
                    <span>Subtotal</span>
                    <strong className="font-mono font-semibold text-[#0B1220]">
                      {formatNaira(subtotal)}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-[#5E6675]">
                    <span>
                      Delivery ({deliveryMethod === 'express' ? 'Express' : 'Standard'})
                    </span>
                    <strong className="font-mono font-semibold text-[#0B1220]">
                      {formatNaira(shippingFee)}
                    </strong>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-[#E5E7EB] pt-3">
                    <span className="text-sm font-bold text-[#0B1220]">Total</span>
                    <strong className="font-mono text-xl font-bold text-[#0B1220]">
                      {formatNaira(grandTotal)}
                    </strong>
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="space-y-2.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#0B1220] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1049EB] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <CircleNotch size={17} className="animate-spin" />
                        <span>Submitting Order...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={16} weight="regular" />
                        <span>Place Order and Pay {formatNaira(grandTotal)}</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-[#5E6675]">
                    By placing this order, you agree to Noma&apos;s{' '}
                    <Link to="/terms" className="font-semibold text-[#0B1220] underline">
                      Terms
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="font-semibold text-[#0B1220] underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 rounded-[8px] border border-[#E5E7EB] bg-white p-4 text-[11px] font-semibold text-[#374151]">
                <div className="flex items-center gap-2">
                  <Truck size={15} weight="regular" className="shrink-0 text-[#1049EB]" />
                  <span>Nationwide Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={15} weight="regular" className="shrink-0 text-[#1049EB]" />
                  <span>{deliveryEstimate.etaDays}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowsCounterClockwise
                    size={15}
                    weight="regular"
                    className="shrink-0 text-[#1049EB]"
                  />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headset size={15} weight="regular" className="shrink-0 text-[#1049EB]" />
                  <span>WhatsApp Desk Support</span>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  )
}
