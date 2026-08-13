import { CreditCard, Lock, MapPin, Smartphone, Truck, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { products } from '../../mock/commerce'
import { useCartStore } from '../../store/cartStore'
import { formatNaira } from '../../utils/pricing'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  
  const cartProducts = products.filter((p) => items[p.id])
  const subtotal = cartProducts.reduce((sum, p) => sum + p.finalPrice * items[p.id], 0)
  const deliveryFee = cartProducts.length > 0 ? 6500 : 0
  const total = subtotal + deliveryFee

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    paymentMethod: 'card' as 'card' | 'transfer' | 'pod',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    receiptId: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    if (!formData.address) newErrors.address = 'Address is required'
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.state) newErrors.state = 'State is required'

    if (formData.paymentMethod === 'card') {
      const cleanCard = formData.cardNumber.replace(/\D/g, '')
      if (cleanCard.length < 15 || cleanCard.length > 19) newErrors.cardNumber = 'Invalid card number'
      if (!formData.cardExpiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) newErrors.cardExpiry = 'Invalid format (MM/YY)'
      if (formData.cardCvv.length < 3 || formData.cardCvv.length > 4) newErrors.cardCvv = 'Invalid CVV'
    } else if (formData.paymentMethod === 'transfer') {
      if (!formData.receiptId) newErrors.receiptId = 'Receipt ID or reference is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      toast.success('Order processing...', { description: 'Please wait while we confirm your details.', duration: 2000 })
      // Simulate API call
      setTimeout(() => {
        clearCart()
        navigate('/order-success')
      }, 1500)
    } else {
      // Scroll to top to see errors
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Redirect if cart is empty
  if (cartProducts.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F9F6] text-[#12203D]">
        <h1 className="mb-4 text-3xl font-black uppercase">Checkout Unavailable</h1>
        <p className="mb-8 font-medium">Your cart is completely empty.</p>
        <button onClick={() => navigate('/catalog')} className="border-4 border-[#12203D] bg-[#12203D] px-8 py-4 font-black uppercase text-white shadow-[4px_4px_0_0_#12203D] hover:-translate-y-1 hover:bg-white hover:text-[#12203D] transition-all">
          Go to Catalog
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F9F6] selection:bg-[#12203D] selection:text-white">
      <div className="h-[88px]" />

      <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8 lg:px-12">
        <h1 className="mb-10 border-b-4 border-[#12203D] pb-6 font-['Outfit'] text-[3rem] font-black leading-none tracking-tighter text-[#12203D] md:text-[5rem]">
          CHECKOUT
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_450px]">
          {/* Left Column: Form Sections */}
          <div className="flex flex-col gap-12">
            
            {/* Section 1: Contact Info */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b-4 border-[#12203D] pb-2 text-[20px] font-black uppercase tracking-widest text-[#12203D]">
                <User size={24} strokeWidth={3} />
                <h2>Contact Details</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-black uppercase tracking-widest text-[#12203D]">First Name</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`rounded-xl border-2 bg-white p-4 font-bold text-[#12203D] outline-none transition-all focus:border-[#2F5FE3] ${errors.firstName ? 'border-[#F44336]' : 'border-[#12203D]'}`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <span className="text-[11px] font-bold text-[#F44336] uppercase">{errors.firstName}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-black uppercase tracking-widest text-[#12203D]">Last Name</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`rounded-xl border-2 bg-white p-4 font-bold text-[#12203D] outline-none transition-all focus:border-[#2F5FE3] ${errors.lastName ? 'border-[#F44336]' : 'border-[#12203D]'}`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <span className="text-[11px] font-bold text-[#F44336] uppercase">{errors.lastName}</span>}
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[12px] font-black uppercase tracking-widest text-[#12203D]">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`rounded-xl border-2 bg-white p-4 font-bold text-[#12203D] outline-none transition-all focus:border-[#2F5FE3] ${errors.email ? 'border-[#F44336]' : 'border-[#12203D]'}`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <span className="text-[11px] font-bold text-[#F44336] uppercase">{errors.email}</span>}
                </div>
              </div>
            </div>

            {/* Section 2: Shipping */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b-4 border-[#12203D] pb-2 text-[20px] font-black uppercase tracking-widest text-[#12203D]">
                <MapPin size={24} strokeWidth={3} />
                <h2>Shipping Address</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[12px] font-black uppercase tracking-widest text-[#12203D]">Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`rounded-xl border-2 bg-white p-4 font-bold text-[#12203D] outline-none transition-all focus:border-[#2F5FE3] ${errors.phone ? 'border-[#F44336]' : 'border-[#12203D]'}`}
                    placeholder="e.g. 08012345678"
                  />
                  {errors.phone && <span className="text-[11px] font-bold text-[#F44336] uppercase">{errors.phone}</span>}
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[12px] font-black uppercase tracking-widest text-[#12203D]">Street Address</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`rounded-xl border-2 bg-white p-4 font-bold text-[#12203D] outline-none transition-all focus:border-[#2F5FE3] ${errors.address ? 'border-[#F44336]' : 'border-[#12203D]'}`}
                    placeholder="Full street address"
                  />
                  {errors.address && <span className="text-[11px] font-bold text-[#F44336] uppercase">{errors.address}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-black uppercase tracking-widest text-[#12203D]">City</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`rounded-xl border-2 bg-white p-4 font-bold text-[#12203D] outline-none transition-all focus:border-[#2F5FE3] ${errors.city ? 'border-[#F44336]' : 'border-[#12203D]'}`}
                    placeholder="e.g. Ikeja"
                  />
                  {errors.city && <span className="text-[11px] font-bold text-[#F44336] uppercase">{errors.city}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-black uppercase tracking-widest text-[#12203D]">State</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`rounded-xl border-2 bg-white p-4 font-bold text-[#12203D] outline-none transition-all focus:border-[#2F5FE3] ${errors.state ? 'border-[#F44336]' : 'border-[#12203D]'}`}
                  >
                    <option value="">Select State</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Rivers">Rivers</option>
                    <option value="Ogun">Ogun</option>
                  </select>
                  {errors.state && <span className="text-[11px] font-bold text-[#F44336] uppercase">{errors.state}</span>}
                </div>
              </div>
            </div>

            {/* Section 3: Payment */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b-4 border-[#12203D] pb-2 text-[20px] font-black uppercase tracking-widest text-[#12203D]">
                <CreditCard size={24} strokeWidth={3} />
                <h2>Payment Method</h2>
              </div>
              
              <div className="flex flex-col gap-4">
                {/* Method Toggles */}
                <label className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all ${formData.paymentMethod === 'card' ? 'border-[#2F5FE3] bg-[#EEF2FF] shadow-[4px_4px_0_0_#2F5FE3]' : 'border-[#12203D] bg-white hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#12203D]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${formData.paymentMethod === 'card' ? 'border-[#2F5FE3]' : 'border-[#12203D]'}`}>
                      {formData.paymentMethod === 'card' && <div className="h-3 w-3 rounded-full bg-[#2F5FE3]" />}
                    </div>
                    <span className="font-black uppercase tracking-widest text-[#12203D]">Credit / Debit Card</span>
                  </div>
                  <CreditCard size={24} className={formData.paymentMethod === 'card' ? 'text-[#2F5FE3]' : 'text-[#12203D]/30'} />
                </label>

                {/* Card Fields */}
                {formData.paymentMethod === 'card' && (
                  <div className="grid grid-cols-1 gap-6 border-x-4 border-b-4 border-[#2F5FE3] bg-white p-6 md:grid-cols-2 mt(-4)">
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[12px] font-black uppercase tracking-widest text-[#12203D]">Card Number</label>
                      <input
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                          setFormData({ ...formData, cardNumber: val });
                        }}
                        maxLength={19}
                        className={`border-4 bg-[#F9F9F6] p-4 font-bold text-[#12203D] outline-none transition-all focus:border-[#2F5FE3] ${errors.cardNumber ? 'border-[#F44336]' : 'border-[#12203D]'}`}
                        placeholder="0000 0000 0000 0000"
                      />
                      {errors.cardNumber && <span className="text-[11px] font-bold text-[#F44336] uppercase">{errors.cardNumber}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-black uppercase tracking-widest text-[#12203D]">Expiry (MM/YY)</label>
                      <input
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                          setFormData({ ...formData, cardExpiry: val });
                        }}
                        maxLength={5}
                        className={`border-4 bg-[#F9F9F6] p-4 font-bold text-[#12203D] outline-none transition-all focus:border-[#2F5FE3] ${errors.cardExpiry ? 'border-[#F44336]' : 'border-[#12203D]'}`}
                        placeholder="MM/YY"
                      />
                      {errors.cardExpiry && <span className="text-[11px] font-bold text-[#F44336] uppercase">{errors.cardExpiry}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-black uppercase tracking-widest text-[#12203D]">CVV</label>
                      <input
                        name="cardCvv"
                        type="password"
                        value={formData.cardCvv}
                        onChange={handleInputChange}
                        maxLength={4}
                        className={`border-4 bg-[#F9F9F6] p-4 font-bold text-[#12203D] outline-none transition-all focus:border-[#2F5FE3] ${errors.cardCvv ? 'border-[#F44336]' : 'border-[#12203D]'}`}
                        placeholder="123"
                      />
                      {errors.cardCvv && <span className="text-[11px] font-bold text-[#F44336] uppercase">{errors.cardCvv}</span>}
                    </div>
                  </div>
                )}

                <label className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all ${formData.paymentMethod === 'transfer' ? 'border-[#2F5FE3] bg-[#EEF2FF] shadow-[4px_4px_0_0_#2F5FE3]' : 'border-[#12203D] bg-white hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#12203D]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${formData.paymentMethod === 'transfer' ? 'border-[#2F5FE3]' : 'border-[#12203D]'}`}>
                      {formData.paymentMethod === 'transfer' && <div className="h-3 w-3 rounded-full bg-[#2F5FE3]" />}
                    </div>
                    <span className="font-black uppercase tracking-widest text-[#12203D]">Bank Transfer</span>
                  </div>
                  <Smartphone size={24} className={formData.paymentMethod === 'transfer' ? 'text-[#2F5FE3]' : 'text-[#12203D]/30'} />
                </label>

                {/* Transfer Fields */}
                {formData.paymentMethod === 'transfer' && (
                  <div className="flex flex-col gap-6 border-x-4 border-b-4 border-[#2F5FE3] bg-white p-6">
                    <div className="border-2 border-[#12203D] bg-[#F7F8FA] p-4">
                      <p className="mb-2 text-[12px] font-black uppercase tracking-widest text-[#12203D]/60">Transfer to:</p>
                      <p className="text-[18px] font-black text-[#12203D]">NOMA STORES LTD</p>
                      <p className="text-[24px] font-black text-[#2F5FE3]">0123456789</p>
                      <p className="text-[14px] font-bold text-[#12203D]">GTBank</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-black uppercase tracking-widest text-[#12203D]">Transaction Ref / Sender Name</label>
                      <input
                        name="receiptId"
                        value={formData.receiptId}
                        onChange={handleInputChange}
                        className={`border-4 bg-[#F9F9F6] p-4 font-bold text-[#12203D] outline-none transition-all focus:border-[#2F5FE3] ${errors.receiptId ? 'border-[#F44336]' : 'border-[#12203D]'}`}
                        placeholder="e.g. TR-9901 or John Doe"
                      />
                      {errors.receiptId && <span className="text-[11px] font-bold text-[#F44336] uppercase">{errors.receiptId}</span>}
                    </div>
                  </div>
                )}

                <label className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all ${formData.paymentMethod === 'pod' ? 'border-[#2F5FE3] bg-[#EEF2FF] shadow-[4px_4px_0_0_#2F5FE3]' : 'border-[#12203D] bg-white hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#12203D]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${formData.paymentMethod === 'pod' ? 'border-[#2F5FE3]' : 'border-[#12203D]'}`}>
                      {formData.paymentMethod === 'pod' && <div className="h-3 w-3 rounded-full bg-[#2F5FE3]" />}
                    </div>
                    <span className="font-black uppercase tracking-widest text-[#12203D]">Pay on Delivery</span>
                  </div>
                  <Truck size={24} className={formData.paymentMethod === 'pod' ? 'text-[#2F5FE3]' : 'text-[#12203D]/30'} />
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Submit */}
          <div className="sticky top-28 h-fit rounded-3xl border-2 border-[#12203D] bg-white p-8 shadow-[6px_6px_0_0_#12203D]">
            <h2 className="mb-6 border-b-4 border-[#12203D] pb-4 font-['Outfit'] text-[2rem] font-black leading-none tracking-tight text-[#12203D]">
              ORDER SUMMARY
            </h2>

            {/* Item Mini-List */}
            <div className="mb-6 flex max-h-64 flex-col gap-4 overflow-y-auto pr-2">
              {cartProducts.map(p => (
                <div key={p.id} className="flex gap-4 border-2 border-[#12203D]/10 p-2">
                  <div className="h-16 w-16 bg-[#F7F8FA] border-2 border-[#12203D]/10 shrink-0">
                    <img src={p.image} className="h-full w-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="line-clamp-1 text-[13px] font-bold text-[#12203D]">{p.name}</h4>
                    <span className="text-[12px] font-bold text-[#12203D]/50">Qty: {items[p.id]}</span>
                    <span className="text-[14px] font-black text-[#12203D]">{formatNaira(p.finalPrice * items[p.id])}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 text-[14px] font-black uppercase tracking-widest">
              <div className="flex items-end justify-between text-[#12203D]/70">
                <span>Subtotal</span>
                <span className="text-[16px] text-[#12203D]">{formatNaira(subtotal)}</span>
              </div>
              <div className="flex items-end justify-between text-[#12203D]/70">
                <span>Delivery</span>
                <span className="text-[16px] text-[#12203D]">{formatNaira(deliveryFee)}</span>
              </div>
            </div>

            <div className="my-6 border-t-4 border-[#12203D]" />

            <div className="mb-8 flex items-end justify-between font-black uppercase tracking-widest text-[#12203D]">
              <span className="text-[18px]">Total</span>
              <span className="text-[32px] leading-none tracking-tight">{formatNaira(total)}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#12203D] bg-[#10B981] text-[15px] font-black uppercase tracking-widest text-white shadow-[4px_4px_0_0_#12203D] transition-all hover:translate-y-1 hover:shadow-none active:bg-[#059669] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_#12203D]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-4 border-white border-t-transparent" />
                  Processing...
                </div>
              ) : (
                <>
                  <Lock size={18} strokeWidth={3} /> Place Order
                </>
              )}
            </button>
            <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-[#12203D]/40">
              Secured by Paystack / Flutterwave
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
