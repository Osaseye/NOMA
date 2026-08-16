// AccountPage.tsx - Account & Default Delivery Settings with Guest Empty State
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiChevronRight,
  HiUser,
  HiMapPin,
  HiCube,
  HiHeart,
  HiBookmark,
  HiCheckCircle,
  HiShieldCheck,
  HiArrowRightOnRectangle,
  HiUserPlus,
  HiArrowLeftOnRectangle,
  HiSparkles,
  HiLockClosed,
  HiArrowRight,
} from 'react-icons/hi2'
import { toast } from 'sonner'
import { useUserStore } from '../../store/userStore'

export function AccountPage() {
  const { profile, updateProfile, updateDefaultAddress, login, logout } = useUserStore()

  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [phone, setPhone] = useState(profile.phone)

  // Delivery Address Form State
  const [addressForm, setAddressForm] = useState(profile.defaultAddress)
  const [isSaved, setIsSaved] = useState(false)

  // Auth Tab State for Guest Mode ('signin' | 'register')
  const [authTab, setAuthTab] = useState<'signin' | 'register'>('signin')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({ name, email, phone })
    updateDefaultAddress(addressForm)
    setIsSaved(true)
    toast.success('Default delivery & account information saved successfully!')
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail) {
      toast.error('Please enter your email address.')
      return
    }
    login({ email: loginEmail, name: loginEmail.split('@')[0] || 'User' })
    toast.success('Successfully signed in!')
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!regEmail || !regName) {
      toast.error('Please fill in your name and email.')
      return
    }
    login({ name: regName, email: regEmail, phone: regPhone })
    toast.success('Account created successfully! Welcome to NOMA.')
  }


  const handleLogout = () => {
    logout()
    toast.info('Signed out. You are now browsing as a Guest.')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-['Outfit',sans-serif] text-[#12203D] selection:bg-[#2F5FE3] selection:text-white pb-24 pt-3 md:pt-5">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-gray-500">
          <Link to="/" className="hover:text-[#2F5FE3] transition-colors">
            Home
          </Link>
          <HiChevronRight size={12} className="text-gray-400" />
          <span className="font-bold text-[#12203D]">Account & Settings</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8 border-b border-gray-200/60 pb-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#12203D] sm:text-4xl">
            My Account
          </h1>
          <p className="mt-1 text-xs md:text-sm font-medium text-gray-500">
            {profile.isGuest
              ? 'Sign in or create an account to unlock order history, saved addresses, and faster checkout.'
              : 'Manage your personal profile and default delivery information.'}
          </p>
        </div>

        {/* IF GUEST USER: DISPLAY EMPTY STATE & SIGN IN / REGISTER FORM */}
        {profile.isGuest ? (
          <div className="space-y-8">
            {/* Top Guest Notice Hero */}
            <div className="rounded-3xl bg-gradient-to-r from-[#12203D] via-[#1A2C54] to-[#2F5FE3] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 max-w-2xl space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-200 backdrop-blur-xs">
                  <HiSparkles size={14} /> Guest User Mode
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  Sign in to unlock full account access & order history
                </h2>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
                  You are currently browsing as a guest. Create an account or sign in to save default delivery addresses, track package status live, and view order receipts anytime.
                </p>
              </div>
            </div>

            {/* Main Grid: Value Proposition Cards (Left) + Interactive Auth Box (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Account Benefits Showcase */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-lg font-extrabold text-[#12203D] flex items-center gap-2">
                  <HiShieldCheck size={20} className="text-[#2F5FE3]" />
                  <span>Why Sign In to NOMA?</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Benefit 1 */}
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-2 hover:border-blue-200 transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2F5FE3]">
                      <HiCube size={20} />
                    </div>
                    <h4 className="text-sm font-extrabold text-[#12203D]">Order History & Tracking</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      Access all your past purchases, download invoices, and track live shipping status automatically.
                    </p>
                  </div>

                  {/* Benefit 2 */}
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-2 hover:border-blue-200 transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <HiMapPin size={20} />
                    </div>
                    <h4 className="text-sm font-extrabold text-[#12203D]">Saved Delivery Addresses</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      Save default home & work locations for instant 1-click checkout on future orders.
                    </p>
                  </div>

                  {/* Benefit 3 */}
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-2 hover:border-blue-200 transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                      <HiHeart size={20} />
                    </div>
                    <h4 className="text-sm font-extrabold text-[#12203D]">Wishlist Synchronization</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      Save your favorite products and access your wishlist seamlessly across all your devices.
                    </p>
                  </div>

                  {/* Benefit 4 */}
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-2 hover:border-blue-200 transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <HiLockClosed size={20} />
                    </div>
                    <h4 className="text-sm font-extrabold text-[#12203D]">Account Security</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      Keep your personal information safe and receive exclusive member offers & discount drops.
                    </p>
                  </div>
                </div>

                {/* Quick Track Order Link for Guests */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 text-xs flex items-center justify-between gap-4">
                  <div>
                    <span className="font-extrabold text-[#12203D] block">Already placed an order as guest?</span>
                    <span className="text-gray-600">Track your order instantly using your order number.</span>
                  </div>
                  <Link
                    to="/orders"
                    className="shrink-0 flex items-center gap-1.5 rounded-xl bg-[#2F5FE3] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#254ec4] transition-colors"
                  >
                    <span>Track Order</span>
                    <HiArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Sign In / Register Card */}
              <div className="lg:col-span-6 space-y-4">
                <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                  {/* Auth Switcher Tabs */}
                  <div className="grid grid-cols-2 rounded-2xl bg-gray-100/80 p-1 text-xs font-bold">
                    <button
                      onClick={() => setAuthTab('signin')}
                      className={`flex items-center justify-center gap-2 rounded-xl py-2.5 transition-all ${
                        authTab === 'signin'
                          ? 'bg-white text-[#2F5FE3] shadow-xs font-extrabold'
                          : 'text-gray-500 hover:text-[#12203D]'
                      }`}
                    >
                      <HiArrowRightOnRectangle size={16} />
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => setAuthTab('register')}
                      className={`flex items-center justify-center gap-2 rounded-xl py-2.5 transition-all ${
                        authTab === 'register'
                          ? 'bg-white text-[#2F5FE3] shadow-xs font-extrabold'
                          : 'text-gray-500 hover:text-[#12203D]'
                      }`}
                    >
                      <HiUserPlus size={16} />
                      <span>Create Account</span>
                    </button>
                  </div>

                  {/* SIGN IN FORM */}
                  {authTab === 'signin' && (
                    <form onSubmit={handleSignIn} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-[#12203D] mb-1.5">Email Address</label>
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="adebayo@example.com"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-3 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#12203D] mb-1.5">Password</label>
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-3 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-2xl bg-[#2F5FE3] py-3.5 text-xs font-extrabold text-white shadow-xs hover:bg-[#254ec4] active:scale-[0.99] transition-all"
                      >
                        Sign In to Account
                      </button>
                    </form>
                  )}

                  {/* CREATE ACCOUNT FORM */}
                  {authTab === 'register' && (
                    <form onSubmit={handleRegister} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-[#12203D] mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Adebayo Ogunlesi"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-3 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#12203D] mb-1.5">Email Address</label>
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="adebayo@example.com"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-3 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#12203D] mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="08012345678"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-3 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#12203D] mb-1.5">Create Password</label>
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-3 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-2xl bg-[#2F5FE3] py-3.5 text-xs font-extrabold text-white shadow-xs hover:bg-[#254ec4] active:scale-[0.99] transition-all"
                      >
                        Create NOMA Account
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* IF SIGNED IN USER: DISPLAY FULL PROFILE & DEFAULT DELIVERY SETTINGS */
          <div className="space-y-8">
            {/* Signed-in User Overview Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-[#12203D] to-[#2F5FE3] p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xs text-2xl font-black text-white border border-white/20">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold">{profile.name}</h2>
                    <span className="rounded-full bg-emerald-400/20 border border-emerald-300/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-200">
                      Signed In
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 mt-1">{profile.email} • {profile.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/orders"
                  className="flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-4 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  <HiCube size={16} />
                  <span>My Orders</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl bg-red-500/20 border border-red-400/30 hover:bg-red-500/30 px-4 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  <HiArrowLeftOnRectangle size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Main Settings Form */}
            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Column: Personal Profile Details */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-4 text-base font-extrabold text-[#12203D]">
                    <HiUser size={18} className="text-[#2F5FE3]" />
                    <span>Personal Information</span>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#12203D] mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Enter full name"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#12203D] mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter email address"
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
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          placeholder="8012345678"
                          className="flex-1 rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-gray-700 flex items-start gap-3">
                  <HiShieldCheck size={18} className="text-[#2F5FE3] shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">
                    Your saved information is stored safely on your device. You can checkout instantly without filling details again!
                  </p>
                </div>
              </div>

              {/* Right Column: Default Delivery Address Form */}
              <div className="lg:col-span-7 space-y-6">
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 text-base font-extrabold text-[#12203D]">
                    <div className="flex items-center gap-2">
                      <HiMapPin size={18} className="text-[#2F5FE3]" />
                      <span>Default Delivery & Shipping Address</span>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-[#2F5FE3]">
                      Auto-fills Checkout
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#12203D] mb-1.5">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
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
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                        placeholder="E.g. Ibadan, Ikeja, Lekki"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-[#12203D] mb-1.5">
                        Area / Neighbourhood <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.neighborhood}
                        onChange={(e) => setAddressForm({ ...addressForm, neighborhood: e.target.value })}
                        required
                        placeholder="E.g. Bodija, Dugbe, Victoria Island"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-[#12203D] mb-1.5">
                        House / Apartment / Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.address}
                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                        required
                        placeholder="House number, building name, street"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-[#12203D] mb-1.5">
                        Additional Address Info (Optional)
                      </label>
                      <input
                        type="text"
                        value={addressForm.additionalInfo || ''}
                        onChange={(e) => setAddressForm({ ...addressForm, additionalInfo: e.target.value })}
                        placeholder="Landmark, gate code, floor number, etc."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 font-medium text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Save Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2F5FE3] py-4 text-sm font-extrabold text-white shadow-xs hover:bg-[#254ec4] active:scale-[0.99] transition-all"
                    >
                      {isSaved ? (
                        <>
                          <HiCheckCircle size={18} />
                          <span>Default Delivery Info Saved!</span>
                        </>
                      ) : (
                        <>
                          <HiBookmark size={18} />
                          <span>Save Default Delivery Information</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
