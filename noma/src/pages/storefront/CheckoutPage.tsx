// CheckoutPage.tsx - Replicating checkout.png 100%
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  MapPin,
  Truck,
  Lock,
  Tag,
  Clock,
  RotateCcw,
  Headphones,
} from 'lucide-react'
import { toast } from 'sonner'
import { products } from '../../mock/commerce'
import { useCartStore } from '../../store/cartStore'
import { useUserStore } from '../../store/userStore'
import { formatNaira } from '../../utils/pricing'

// Sample items matching checkout.png design
const sampleCheckoutProducts = [
  {
    id: 'c1',
    name: 'Samsung 55" 4K UHD Smart TV',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
    finalPrice: 185000,
    subSpecs: '55 inch | 4K UHD | Smart TV',
  },
  {
    id: 'c2',
    name: 'Samsung Soundbar HW-T400',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
    finalPrice: 65000,
    subSpecs: '2.1 Channel | 150W',
  },
  {
    id: 'c3',
    name: 'LG XBOOM RN5 Party Speaker',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    finalPrice: 120000,
    subSpecs: '500W | Bluetooth | USB',
  },
]

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  const { profile, updateDefaultAddress } = useUserStore()

  // Form Fields Pre-filled from User Profile / Default Address
  const [fullName, setFullName] = useState(profile.defaultAddress.fullName || profile.name)
  const [phoneNumber, setPhoneNumber] = useState(profile.defaultAddress.phone || profile.phone)
  const [emailAddress, setEmailAddress] = useState(profile.defaultAddress.email || profile.email)
  const [state, setState] = useState(profile.defaultAddress.state || 'Oyo')
  const [city, setCity] = useState(profile.defaultAddress.city || 'Ibadan')
  const [neighborhood, setNeighborhood] = useState(profile.defaultAddress.neighborhood || 'Bodija')
  const [address, setAddress] = useState(profile.defaultAddress.address || '14 Favos Building, Bodija Main Road')
  const [additionalInfo, setAdditionalInfo] = useState(profile.defaultAddress.additionalInfo || '')
  const [saveAddress, setSaveAddress] = useState(true)

  // Delivery Method & Payment Method State
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'pod' | 'ussd' | 'other'>('card')

  // Card Form Details
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  // Map Cart Items or Fallback Sample Items
  const storeCartProducts = products.filter((p) => items[p.id])
  const checkoutItems =
    storeCartProducts.length > 0
      ? storeCartProducts.map((p) => ({
          id: p.id,
          name: p.name,
          image: p.image,
          finalPrice: p.finalPrice,
          subSpecs: `${p.category} | Premium`,
          qty: items[p.id],
        }))
      : sampleCheckoutProducts.map((p) => ({
          ...p,
          qty: 1,
        }))

  const itemCount = checkoutItems.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = checkoutItems.reduce((sum, i) => sum + i.finalPrice * i.qty, 0)
  const shippingFee = deliveryMethod === 'standard' ? 3500 : 6000
  const grandTotal = subtotal + shippingFee

  // Locate me action
  const handleUseCurrentLocation = () => {
    toast.info('Fetching current GPS location...')
    setTimeout(() => {
      setCity('Ibadan')
      setNeighborhood('Dugbe Commercial Area')
      setAddress('Plot 12 Dugbe Bypass')
      toast.success('Location set to Dugbe, Ibadan!')
    }, 1000)
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (saveAddress) {
      updateDefaultAddress({
        fullName,
        phone: phoneNumber,
        email: emailAddress,
        state,
        city,
        neighborhood,
        address,
        additionalInfo,
      })
    }

    clearCart()
    navigate('/order-success')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-['Outfit',sans-serif] text-[#12203D] selection:bg-[#2F5FE3] selection:text-white pb-24 pt-3 md:pt-5">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 lg:px-12">
        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200/60 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#12203D] sm:text-4xl">
              Checkout
            </h1>
            <p className="mt-1 text-xs md:text-sm font-medium text-gray-500">
              Complete your order in just a few steps
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-4 py-2 text-xs font-bold text-[#2F5FE3]">
            <ShieldCheck size={16} className="text-[#2F5FE3]" />
            <span>Your data is safe and secure</span>
          </div>
        </div>

        {/* Step Indicator Bar */}
        <div className="mb-10 flex items-center justify-between rounded-2xl bg-white p-4 border border-gray-100 shadow-2xs overflow-x-auto scrollbar-none text-xs font-bold">
          <div className="flex items-center gap-2 shrink-0 text-[#2F5FE3]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2F5FE3] text-white text-xs font-black">
              1
            </span>
            <span>Delivery Information</span>
          </div>
          <div className="h-0.5 w-8 sm:w-16 bg-gray-200 shrink-0" />
          <div className="flex items-center gap-2 shrink-0 text-gray-400">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 text-xs font-black">
              2
            </span>
            <span>Delivery Method</span>
          </div>
          <div className="h-0.5 w-8 sm:w-16 bg-gray-200 shrink-0" />
          <div className="flex items-center gap-2 shrink-0 text-gray-400">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 text-xs font-black">
              3
            </span>
            <span>Payment</span>
          </div>
          <div className="h-0.5 w-8 sm:w-16 bg-gray-200 shrink-0" />
          <div className="flex items-center gap-2 shrink-0 text-gray-400">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 text-xs font-black">
              4
            </span>
            <span>Review & Place Order</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="space-y-12">
          {/* Section 1: Delivery Information */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2F5FE3] text-white text-sm font-black">
                1
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-[#12203D]">Delivery Information</h2>
                <p className="text-xs text-gray-500">Enter the details of the person receiving this order.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#12203D] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-[#12203D] mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 font-bold text-gray-700">
                    🇳🇬 +234
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    placeholder="Enter phone number"
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#12203D] mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Enter email address (optional)"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-[#12203D] mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                >
                  <option value="Oyo">Oyo State</option>
                  <option value="Lagos">Lagos State</option>
                  <option value="Abuja">Abuja (FCT)</option>
                  <option value="Ogun">Ogun State</option>
                  <option value="Rivers">Rivers State</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#12203D] mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="Select city"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#12203D] mb-1.5">
                  Area / Neighbourhood <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  required
                  placeholder="E.g. Bodija, Dugbe, etc."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-[#12203D] mb-1.5">
                  House / Apartment / Building <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="House number, apartment, or building name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-[#12203D] mb-1.5">
                  Additional Address Info (Optional)
                </label>
                <input
                  type="text"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Landmark, gate code, floor number, etc."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Checkbox Save address */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <input
                type="checkbox"
                id="saveAddress"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
                className="h-4 w-4 rounded accent-[#2F5FE3]"
              />
              <label htmlFor="saveAddress" className="font-bold text-[#12203D]">
                Save this address for future use
              </label>
            </div>

            {/* Use My Current Location Container Card */}
            <div className="rounded-2xl border border-blue-100 bg-[#F0F4FF] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2F5FE3] shadow-xs">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#12203D]">Use My Current Location</h4>
                  <p className="text-[11px] text-gray-500">Allow access to your location for faster delivery</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="rounded-xl bg-white border border-gray-200 hover:border-[#2F5FE3] px-4 py-2 text-xs font-bold text-[#12203D] shadow-2xs hover:text-[#2F5FE3] transition-colors self-start sm:self-auto"
              >
                Use Current Location
              </button>
            </div>
          </div>

          {/* Section 2: Delivery Method */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2F5FE3] text-white text-sm font-black">
                2
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-[#12203D]">Delivery Method</h2>
                <p className="text-xs text-gray-500">Choose how you want your items to be delivered.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Option A: Standard Delivery */}
              <label
                className={`relative flex items-center justify-between rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                  deliveryMethod === 'standard'
                    ? 'border-[#2F5FE3] bg-blue-50/40 shadow-xs'
                    : 'border-gray-200/80 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="standard"
                    checked={deliveryMethod === 'standard'}
                    onChange={() => setDeliveryMethod('standard')}
                    className="h-4 w-4 accent-[#2F5FE3]"
                  />
                  <div className="flex items-center gap-3">
                    <Truck size={22} className="text-[#2F5FE3]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-[#12203D]">Standard Delivery</span>
                        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          Best value
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        2 – 5 business days • Reliable delivery to your doorstep.
                      </p>
                    </div>
                  </div>
                </div>
                <span className="text-base font-extrabold text-[#2F5FE3]">{formatNaira(3500)}</span>
              </label>

              {/* Option B: Express Delivery */}
              <label
                className={`relative flex items-center justify-between rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                  deliveryMethod === 'express'
                    ? 'border-[#2F5FE3] bg-blue-50/40 shadow-xs'
                    : 'border-gray-200/80 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="express"
                    checked={deliveryMethod === 'express'}
                    onChange={() => setDeliveryMethod('express')}
                    className="h-4 w-4 accent-[#2F5FE3]"
                  />
                  <div className="flex items-center gap-3">
                    <Truck size={22} className="text-amber-500" />
                    <div>
                      <span className="text-sm font-extrabold text-[#12203D]">Express Delivery</span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        1 – 2 business days • Faster delivery for urgent orders.
                      </p>
                    </div>
                  </div>
                </div>
                <span className="text-base font-extrabold text-[#12203D]">{formatNaira(6000)}</span>
              </label>
            </div>

            <div className="rounded-xl border border-blue-100 bg-[#F0F4FF] p-3 text-xs text-gray-700 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#2F5FE3]" />
              <span>Delivery fee is confirmed before you pay. No hidden charges.</span>
            </div>
          </div>

          {/* Section 3: Payment */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2F5FE3] text-white text-sm font-black">
                3
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-[#12203D]">Payment</h2>
                <p className="text-xs text-gray-500">Choose your preferred payment method.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Payment Methods Radio Options */}
              <div className="lg:col-span-5 space-y-3">
                {[
                  {
                    id: 'card',
                    title: 'Card (Debit/Credit)',
                    subtitle: 'VISA, MasterCard, Verve',
                    badge: null,
                  },
                  {
                    id: 'transfer',
                    title: 'Bank Transfer',
                    subtitle: 'Make payment directly to our bank account',
                    badge: null,
                  },
                  {
                    id: 'pod',
                    title: 'Pay on Delivery',
                    subtitle: 'Pay when your order is delivered to you',
                    badge: 'Available',
                  },
                  {
                    id: 'ussd',
                    title: 'USSD / Mobile Money',
                    subtitle: 'Pay securely with USSD or mobile money',
                    badge: null,
                  },
                  {
                    id: 'other',
                    title: 'Other Payment Methods',
                    subtitle: 'Paystack, Flutterwave and more',
                    badge: null,
                  },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex items-start justify-between rounded-2xl border-2 p-3.5 cursor-pointer transition-all ${
                      paymentMethod === pm.id
                        ? 'border-[#2F5FE3] bg-blue-50/40 shadow-xs'
                        : 'border-gray-200/80 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.id}
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id as any)}
                        className="mt-1 h-4 w-4 accent-[#2F5FE3]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-[#12203D]">{pm.title}</span>
                          {pm.badge && (
                            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                              {pm.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">{pm.subtitle}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Payment Input Form Box (Card selected) */}
              <div className="lg:col-span-7 rounded-2xl border border-gray-200 bg-gray-50/60 p-6 space-y-4">
                {paymentMethod === 'card' && (
                  <>
                    <h4 className="text-xs font-extrabold text-[#12203D] uppercase tracking-wider">
                      Credit or Debit Card Details
                    </h4>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-[#12203D] mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#12203D] mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Enter cardholder name"
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[#12203D] mb-1">Expiry Date</label>
                          <input
                            type="text"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            placeholder="MM / YY"
                            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[#12203D] mb-1">CVV</label>
                          <input
                            type="text"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            placeholder="123"
                            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3]"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod !== 'card' && (
                  <div className="py-8 text-center text-xs font-semibold text-gray-600">
                    You will receive instant payment instructions upon clicking Place Order.
                  </div>
                )}

                <div className="pt-2 flex items-center gap-2 text-[11px] font-medium text-gray-500">
                  <ShieldCheck size={16} className="text-[#2F5FE3]" />
                  <span>Your payment is secured with 256-bit SSL encryption.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Review & Place Order */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2F5FE3] text-white text-sm font-black">
                4
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-[#12203D]">Review & Place Order</h2>
                <p className="text-xs text-gray-500">Please review your order and confirm.</p>
              </div>
            </div>

            {/* Grid Layout: Items in Order Left + Summary Card Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Items in Order Left Box */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#12203D]">Items in your order ({itemCount})</h3>
                  <Link to="/cart" className="text-xs font-bold text-[#2F5FE3] hover:underline">
                    Edit Cart
                  </Link>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-4 divide-y divide-gray-100">
                  {checkoutItems.map((ci) => (
                    <div key={ci.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-3">
                      <div className="flex items-center gap-3">
                        <img src={ci.image} alt={ci.name} className="h-14 w-14 object-contain rounded-xl bg-gray-50 p-1" />
                        <div>
                          <h4 className="text-xs font-bold text-[#12203D] line-clamp-1">{ci.name}</h4>
                          <span className="text-[10px] text-gray-400">Qty: {ci.qty}</span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-[#12203D]">
                        {formatNaira(ci.finalPrice * ci.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Important Terms Amber Note */}
                <div className="rounded-2xl bg-amber-50/80 border border-amber-200/70 p-4 text-xs text-amber-900 font-medium leading-relaxed">
                  <span className="font-extrabold text-amber-950">Important Note: </span>
                  By placing this order, you agree to our{' '}
                  <a href="#" className="font-bold underline">Terms & Conditions</a> and{' '}
                  <a href="#" className="font-bold underline">Privacy Policy</a>.
                </div>
              </div>

              {/* Summary Card Right Box */}
              <div className="lg:col-span-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
                <h3 className="text-base font-extrabold text-[#12203D]">Order Summary</h3>

                <div className="space-y-2.5 text-xs text-gray-600 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-extrabold text-[#12203D]">{formatNaira(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-extrabold text-[#12203D]">{formatNaira(shippingFee)}</span>
                  </div>
                  <button type="button" className="text-xs font-bold text-[#2F5FE3] hover:underline flex items-center gap-1">
                    <Tag size={13} />
                    <span>Have a promo code?</span>
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-extrabold text-[#12203D]">Total</span>
                    <span className="text-2xl font-extrabold text-[#12203D]">
                      {formatNaira(grandTotal)}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">All prices are inclusive of taxes</p>
                </div>

                {/* Trust Points */}
                <div className="pt-2 space-y-2 text-[11px] font-semibold text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#2F5FE3]" />
                    <span>2 – 5 business days delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw size={14} className="text-[#2F5FE3]" />
                    <span>Easy 30-day returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#2F5FE3]" />
                    <span>Secure payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-[#2F5FE3]" />
                    <span>Delivery fee confirmed before you pay</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Submit Button */}
            <div className="pt-4 space-y-2">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2F5FE3] py-4 text-base font-extrabold text-white shadow-md hover:bg-[#254ec4] active:scale-[0.99] transition-all"
              >
                <Lock size={18} />
                <span>Place Order and Pay {formatNaira(grandTotal)}</span>
              </button>
              <p className="text-center text-xs font-medium text-gray-500">
                You won't be charged until you confirm this order on the next step.
              </p>
            </div>
          </div>
        </form>

        {/* Footer 4 Value Props Bar matching checkout.png */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-gray-200/80 text-xs font-medium text-gray-700">
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-gray-100 shadow-2xs">
            <Truck size={24} className="text-[#2F5FE3]" />
            <div>
              <h4 className="font-extrabold text-[#12203D]">Delivery Across Nigeria</h4>
              <p className="text-[11px] text-gray-400">Fast & reliable shipping</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-gray-100 shadow-2xs">
            <ShieldCheck size={24} className="text-emerald-600" />
            <div>
              <h4 className="font-extrabold text-[#12203D]">Secure Payments</h4>
              <p className="text-[11px] text-gray-400">100% safe & secure</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-gray-100 shadow-2xs">
            <RotateCcw size={24} className="text-amber-500" />
            <div>
              <h4 className="font-extrabold text-[#12203D]">30-Day Returns</h4>
              <p className="text-[11px] text-gray-400">Hassle-free returns</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-gray-100 shadow-2xs">
            <Headphones size={24} className="text-purple-600" />
            <div>
              <h4 className="font-extrabold text-[#12203D]">Customer Support</h4>
              <p className="text-[11px] text-gray-400">We're here to help</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
