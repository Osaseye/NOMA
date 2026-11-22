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
  ShieldCheck,
  SignIn,
  SignOut,
  User,
  UserPlus,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Field, SelectInput, TextInput } from '../../design-system/components/Field'
import { authService } from '../../services/firebase/authService'
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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Personal Information */}
      <div className="space-y-5 lg:col-span-5">
        <div className="space-y-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3.5 text-sm font-bold text-[#0B1220]">
            <User size={17} weight="regular" className="text-[#1049EB]" />
            <span>Personal Information</span>
          </div>

          <div className="space-y-4">
            <Field label="Full Name *">
              <TextInput
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Full name"
              />
            </Field>

            <Field label="Email Address *">
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@domain.com"
              />
            </Field>

            <Field label="Phone Number *">
              <div className="flex items-center gap-2">
                <span className="shrink-0 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-3 py-2.5 font-mono text-xs font-semibold text-[#0B1220]">
                  +234 (NG)
                </span>
                <TextInput
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="803 000 0000"
                  className="font-mono"
                />
              </div>
            </Field>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-[8px] border border-[#E5E7EB] bg-white p-4 text-xs text-[#374151]">
          <ShieldCheck size={18} weight="fill" className="mt-0.5 shrink-0 text-[#1049EB]" />
          <p className="leading-relaxed">
            Your saved details automatically populate Nigerian delivery fields at checkout and sync securely to your account.
          </p>
        </div>
      </div>

      {/* Default Delivery Address */}
      <div className="lg:col-span-7">
        <div className="space-y-5 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3.5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0B1220]">
              <MapPin size={17} weight="regular" className="text-[#1049EB]" />
              <span>Default Delivery Address</span>
            </div>
            <span className="rounded-[4px] border border-[#1049EB]/25 bg-[#EEF3FE] px-2.5 py-0.5 text-[10px] font-semibold text-[#1049EB]">
              Auto-fills checkout
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="State *">
              <SelectInput
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
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
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                required
                placeholder="Ibadan, Ikeja, Lekki..."
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Area / Neighbourhood *">
                <TextInput
                  type="text"
                  value={addressForm.neighborhood}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, neighborhood: e.target.value })
                  }
                  required
                  placeholder="Bodija, Victoria Island, Wuse 2..."
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Street / House / Apartment *">
                <TextInput
                  type="text"
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  required
                  placeholder="House number, building name, street"
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Additional Info (Optional)">
                <TextInput
                  type="text"
                  value={addressForm.additionalInfo || ''}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, additionalInfo: e.target.value })
                  }
                  placeholder="Nearest landmark, gate code, floor number"
                />
              </Field>
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#0B1220] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1049EB]"
          >
            {isSaved ? (
              <>
                <CheckCircle size={17} weight="fill" />
                <span>Default Delivery Info Saved</span>
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
        regPhone.trim()
      )
      syncFromFirebaseUser(user, createdDoc)
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
      toast.info('Signed out. Now browsing as guest.')
    }
  }

  const profileInitial = (profile.name || profile.email || 'N').trim().charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-[#F6F7F9] pb-24 pt-4 text-[#0B1220]">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-[#5E6675]">
          <Link to="/" className="transition-colors hover:text-[#1049EB]">
            Home
          </Link>
          <CaretRight size={12} weight="regular" />
          <span className="font-semibold text-[#0B1220]">Account &amp; Settings</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8 border-b border-[#E5E7EB] pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-[#0B1220] sm:text-3xl">
            My Account
          </h1>
          <p className="mt-1 text-xs text-[#5E6675] sm:text-sm">
            {profile.isGuest
              ? 'Sign in or create an account to save Nigerian delivery addresses and order history.'
              : 'Manage your personal profile and default Nigerian delivery destination.'}
          </p>
        </div>

        {profile.isGuest ? (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Left 6 Cols: 4 Flat Benefit Cards */}
            <div className="space-y-4 lg:col-span-6">
              <h2 className="flex items-center gap-2 text-base font-bold text-[#0B1220]">
                <ShieldCheck size={18} weight="fill" className="text-[#1049EB]" />
                <span>Why Sign In to Noma</span>
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: Package,
                    title: 'Order History & Tracking',
                    detail: 'Inspect past purchases, payment refs, and live dispatch updates.',
                  },
                  {
                    icon: MapPin,
                    title: 'Saved Delivery Addresses',
                    detail: 'Store your Nigerian state, city, and landmark for faster checkout.',
                  },
                  {
                    icon: Heart,
                    title: 'Wishlist Synchronization',
                    detail: 'Keep saved products synced cleanly across mobile and desktop.',
                  },
                  {
                    icon: Lock,
                    title: 'Account Security',
                    detail: 'Protected Firebase authentication with email or Google sign-in.',
                  },
                ].map((benefit) => (
                  <div
                    key={benefit.title}
                    className="space-y-2 rounded-[8px] border border-[#E5E7EB] bg-white p-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] text-[#1049EB]">
                      <benefit.icon size={18} weight="regular" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0B1220]">{benefit.title}</h3>
                    <p className="text-xs leading-relaxed text-[#5E6675]">{benefit.detail}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-4 text-xs">
                <div>
                  <strong className="block text-[#0B1220]">Placed an order as a guest?</strong>
                  <span className="text-[#5E6675]">Track any order by ID or payment reference.</span>
                </div>
                <Link
                  to="/orders"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-[6px] bg-[#0B1220] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1049EB]"
                >
                  <span>Track Order</span>
                  <ArrowRight size={13} weight="regular" />
                </Link>
              </div>
            </div>

            {/* Right 6 Cols: Firebase Auth Card */}
            <div className="lg:col-span-6">
              <div className="space-y-5 rounded-[10px] border border-[#E5E7EB] bg-white p-6 sm:p-8">
                {/* Tabs */}
                <div className="grid grid-cols-2 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] p-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('signin')
                      setAuthError(null)
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-[4px] py-2 transition-colors ${
                      authTab === 'signin'
                        ? 'bg-white font-bold text-[#0B1220]'
                        : 'text-[#5E6675] hover:text-[#0B1220]'
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
                    className={`flex items-center justify-center gap-1.5 rounded-[4px] py-2 transition-colors ${
                      authTab === 'register'
                        ? 'bg-white font-bold text-[#0B1220]'
                        : 'text-[#5E6675] hover:text-[#0B1220]'
                    }`}
                  >
                    <UserPlus size={15} weight="regular" />
                    <span>Create Account</span>
                  </button>
                </div>

                {authError ? (
                  <div className="rounded-[6px] border border-[#FECACA] bg-[#FEF2F2] px-3.5 py-2.5 text-xs font-medium text-[#B91C1C]">
                    {authError}
                  </div>
                ) : null}

                {authTab === 'signin' ? (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <Field label="Email Address *">
                      <TextInput
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        placeholder="you@domain.com"
                      />
                    </Field>

                    <Field label="Password *">
                      <TextInput
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                      />
                    </Field>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#0B1220] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1049EB] disabled:opacity-60"
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
                    <Field label="Full Name *">
                      <TextInput
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                        placeholder="Your full name"
                      />
                    </Field>

                    <Field label="Email Address *">
                      <TextInput
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                        placeholder="you@domain.com"
                      />
                    </Field>

                    <Field label="Phone Number">
                      <div className="flex items-center gap-2">
                        <span className="shrink-0 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-3 py-2.5 font-mono text-xs font-semibold text-[#0B1220]">
                          +234 (NG)
                        </span>
                        <TextInput
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="803 000 0000"
                          className="font-mono"
                        />
                      </div>
                    </Field>

                    <Field label="Create Password *">
                      <TextInput
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="At least 6 characters"
                      />
                    </Field>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#0B1220] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1049EB] disabled:opacity-60"
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
                  <span className="flex-1 border-t border-[#E5E7EB]" />
                  <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#5E6675]">
                    or
                  </span>
                  <span className="flex-1 border-t border-[#E5E7EB]" />
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleGoogleSignIn}
                  className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#E5E7EB] bg-white py-2.5 text-xs font-semibold text-[#0B1220] transition-colors hover:bg-[#F6F7F9] disabled:opacity-60"
                >
                  <GoogleLogo size={16} weight="bold" className="text-[#1049EB]" />
                  <span>Continue with Google</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Signed-In Header Card */}
            <div className="flex flex-col items-start justify-between gap-5 rounded-[8px] border border-[#E5E7EB] bg-white p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[8px] bg-[#0B1220] font-mono text-xl font-bold text-white">
                  {profileInitial}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-[#0B1220]">
                      {profile.name || 'Noma Customer'}
                    </h2>
                    <span className="rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 text-[10px] font-semibold text-[#15803D]">
                      Signed In
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#5E6675]">
                    {profile.email}
                    {profile.phone ? ` - ${profile.phone}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  to="/orders"
                  className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-4 py-2 text-xs font-semibold text-[#0B1220] transition-colors hover:bg-[#EEF0F4]"
                >
                  <Package size={15} weight="regular" className="text-[#1049EB]" />
                  <span>My Orders</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-2 text-xs font-semibold text-[#B91C1C] transition-colors hover:bg-[#FEE2E2]"
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
