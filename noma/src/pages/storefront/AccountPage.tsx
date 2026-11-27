import {
  ArrowRight,
  BookmarkSimple,
  CaretRight,
  CheckCircle,
  CircleNotch,
  GoogleLogo,
  Heart,
  Lock,
  MapPin,
  Package,
  SignIn,
  SignOut,
  User,
  UserPlus,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { authService } from '../../services/firebase/authService'
import { emailService } from '../../services/email/emailService'
import { useUserStore, type DeliveryAddress, type UserProfile } from '../../store/userStore'

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

function formatAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code || ''
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please verify your credentials.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing.'
    default:
      return err instanceof Error ? err.message : 'Authentication failed. Please try again.'
  }
}

const inputClass =
  'h-11 w-full rounded-xl border border-slate-200 bg-[#F4F4F5]/70 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#1049EB] focus:bg-white focus:outline-none'

function SignedInProfileForm({
  profile,
  onSaveProfile,
  onSaveDefaultAddress,
}: {
  profile: UserProfile
  onSaveProfile: (updates: Partial<UserProfile>) => void
  onSaveDefaultAddress: (address: Partial<DeliveryAddress>) => void
}) {
  const [name, setName] = useState(profile.name || '')
  const [email, setEmail] = useState(profile.email || '')
  const [phone, setPhone] = useState(profile.phone || '')
  const [addressForm, setAddressForm] = useState<DeliveryAddress>(profile.defaultAddress)
  const [isSaved, setIsSaved] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSaveProfile({ name: name.trim(), email: email.trim(), phone: phone.trim() })
    onSaveDefaultAddress({
      ...addressForm,
      fullName: name.trim() || addressForm.fullName,
      email: email.trim() || addressForm.email,
      phone: phone.trim() || addressForm.phone,
    })
    setIsSaved(true)
    toast.success('Account and default delivery details saved.')
    window.setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Personal Information */}
      <div className="space-y-5 lg:col-span-5">
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 text-sm font-bold text-slate-900">
            <User size={17} weight="regular" className="text-[#1049EB]" />
            <span>Personal Information</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Full name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@domain.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Phone Number *
              </label>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F4F4F5] px-3 text-xs font-semibold text-slate-800">
                  +234
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="803 000 0000"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Default Delivery Address */}
      <div className="lg:col-span-7">
        <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <MapPin size={17} weight="regular" className="text-[#1049EB]" />
              <span>Default Delivery Address</span>
            </div>
            <span className="rounded-full bg-[#F4F4F5] px-3 py-0.5 text-[11px] font-medium text-slate-600">
              Auto-fills checkout
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">State *</label>
              <select
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                required
                className={inputClass}
              >
                <option value="">Select state</option>
                {NIGERIAN_STATES.map((st) => (
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
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                required
                placeholder="Ikeja, Lekki, Ibadan..."
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Area / Neighbourhood *
              </label>
              <input
                type="text"
                value={addressForm.neighborhood}
                onChange={(e) => setAddressForm({ ...addressForm, neighborhood: e.target.value })}
                required
                placeholder="Victoria Island, Bodija, Wuse 2..."
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Street / House / Apartment *
              </label>
              <input
                type="text"
                value={addressForm.address}
                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                required
                placeholder="House number, building name, street"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Nearest Landmark (Optional)
              </label>
              <input
                type="text"
                value={addressForm.additionalInfo || ''}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, additionalInfo: e.target.value })
                }
                placeholder="Nearest landmark or gate instruction"
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1049EB] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0D3EC7]"
          >
            {isSaved ? (
              <>
                <CheckCircle size={17} weight="fill" />
                <span>Saved Successfully</span>
              </>
            ) : (
              <>
                <BookmarkSimple size={17} weight="regular" />
                <span>Save Account &amp; Address</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

export function AccountPage() {
  const { profile, updateProfile, updateDefaultAddress, syncFromFirebaseUser, logout } =
    useUserStore()

  const [authTab, setAuthTab] = useState<'signin' | 'register'>('signin')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!loginEmail.trim() || !loginPassword) {
      setAuthError('Enter both your email address and password.')
      return
    }

    setAuthError(null)
    setIsSubmitting(true)
    try {
      const user = await authService.loginWithEmail(loginEmail.trim(), loginPassword)
      const userDoc = await authService.getUserProfile(user.uid)
      syncFromFirebaseUser(user, userDoc)
      toast.success('Signed in to your Noma account')
    } catch (err) {
      const msg = formatAuthError(err)
      setAuthError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setAuthError('Please complete your name, email, and password.')
      return
    }

    setAuthError(null)
    setIsSubmitting(true)
    try {
      const { user, profile: createdDoc } = await authService.registerCustomer(
        regEmail.trim(),
        regPassword,
        regName.trim(),
        regPhone.trim(),
      )
      syncFromFirebaseUser(user, createdDoc)
      void emailService.sendCustomerWelcomeEmail(regEmail.trim(), regName.trim())
      toast.success('Account created successfully. Welcome to Noma.')
    } catch (err) {
      const msg = formatAuthError(err)
      setAuthError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (isSubmitting) return
    setAuthError(null)
    setIsSubmitting(true)
    try {
      const user = await authService.loginWithGoogle()
      const userDoc = await authService.getUserProfile(user.uid)
      syncFromFirebaseUser(user, userDoc)
      toast.success('Signed in with Google')
    } catch (err) {
      const msg = formatAuthError(err)
      setAuthError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.warn('Sign out notice:', err)
    } finally {
      logout()
      toast.info('Signed out.')
    }
  }

  const profileInitial = (profile.name || profile.email || 'N').trim().charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-white pb-24 pt-5 text-slate-900">
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        {/* Single Clean Header Bar */}
        <div className="mb-8 border-b border-slate-200 pb-4">
          <nav className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900">
              Home
            </Link>
            <CaretRight size={11} />
            <span className="font-medium text-slate-800">Account</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Account
          </h1>
        </div>

        {profile.isGuest ? (
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Left 6 Cols: Auth Form Card */}
            <div className="lg:col-span-7">
              <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8">
                <div className="grid grid-cols-2 rounded-full bg-[#F4F4F5] p-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('signin')
                      setAuthError(null)
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-full py-2.5 transition-colors ${
                      authTab === 'signin'
                        ? 'bg-[#1049EB] text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <SignIn size={15} weight="regular" />
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('register')
                      setAuthError(null)
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-full py-2.5 transition-colors ${
                      authTab === 'register'
                        ? 'bg-[#1049EB] text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UserPlus size={15} weight="regular" />
                    <span>Create Account</span>
                  </button>
                </div>

                {authError ? (
                  <div className="rounded-xl border border-slate-300 bg-[#F4F4F5] px-4 py-3 text-xs font-medium text-slate-900">
                    {authError}
                  </div>
                ) : null}

                {authTab === 'signin' ? (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        placeholder="you@domain.com"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Password *
                      </label>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        className={inputClass}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1049EB] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0D3EC7] disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <CircleNotch size={16} className="animate-spin" />
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                        placeholder="Your full name"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                        placeholder="you@domain.com"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-11 shrink-0 items-center rounded-xl border border-slate-200 bg-[#F4F4F5] px-3 text-xs font-semibold text-slate-800">
                          +234
                        </span>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="803 000 0000"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Create Password *
                      </label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="At least 6 characters"
                        className={inputClass}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1049EB] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0D3EC7] disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <CircleNotch size={16} className="animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <span>Create Noma Account</span>
                      )}
                    </button>
                  </form>
                )}

                <div className="relative flex items-center py-1">
                  <span className="flex-1 border-t border-slate-200" />
                  <span className="px-3 text-xs text-slate-400">or</span>
                  <span className="flex-1 border-t border-slate-200" />
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleGoogleSignIn}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 disabled:opacity-60"
                >
                  <GoogleLogo size={16} weight="bold" className="text-slate-900" />
                  <span>Continue with Google</span>
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Clean Monochrome Benefits & Guest Order Tracker Link */}
            <div className="space-y-4 lg:col-span-5">
              <div className="space-y-4 rounded-2xl bg-[#F4F4F5] p-6">
                <h2 className="text-base font-bold text-slate-900">Member Benefits</h2>
                <div className="space-y-3.5 text-xs">
                  {[
                    {
                      icon: Package,
                      title: 'Order History & Live Tracking',
                      detail: 'View past purchases, payment references, and delivery status.',
                    },
                    {
                      icon: MapPin,
                      title: '1-Tap Saved Nigerian Address',
                      detail: 'Auto-fill your state, city, and street at checkout.',
                    },
                    {
                      icon: Heart,
                      title: 'Synced Saved Wishlist',
                      detail: 'Keep your favorite shoes, fashion, and home items saved across devices.',
                    },
                    {
                      icon: Lock,
                      title: 'Fast & Secure Checkout',
                      detail: 'Protected sign-in with email or Google.',
                    },
                  ].map((b) => (
                    <div key={b.title} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#1049EB] shadow-2xs">
                        <b.icon size={16} weight="regular" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{b.title}</h3>
                        <p className="mt-0.5 leading-relaxed text-slate-500">{b.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 text-xs">
                <div>
                  <strong className="block text-slate-900">Checked out as a guest?</strong>
                  <span className="text-slate-500">Track any order using your Order ID.</span>
                </div>
                <Link
                  to="/orders"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#1049EB] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0D3EC7]"
                >
                  <span>Track Order</span>
                  <ArrowRight size={13} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Signed-In Header Card (Zero Colored Containers) */}
            <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-slate-200/80 bg-white p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1049EB] text-xl font-bold text-white ring-2 ring-[#FEB719]/40">
                  {profileInitial}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      {profile.name || 'Noma Customer'}
                    </h2>
                    <span className="rounded-full bg-[#F4F4F5] px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                      Active Account
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {profile.email}
                    {profile.phone ? ` • ${profile.phone}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  to="/orders"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F4F5] px-4 py-2 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-200"
                >
                  <Package size={15} weight="regular" />
                  <span>My Orders</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
                >
                  <SignOut size={15} weight="regular" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            <SignedInProfileForm
              key={profile.uid || profile.email || 'signed-in'}
              profile={profile}
              onSaveProfile={updateProfile}
              onSaveDefaultAddress={updateDefaultAddress}
            />
          </div>
        )}
      </div>
    </div>
  )
}
