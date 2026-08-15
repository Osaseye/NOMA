// AccountPage.tsx - Account & Default Delivery Settings
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  User,
  MapPin,
  Package,
  Heart,
  Save,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { useUserStore } from '../../store/userStore'

export function AccountPage() {
  const { profile, updateProfile, updateDefaultAddress } = useUserStore()

  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [phone, setPhone] = useState(profile.phone)

  // Delivery Address Form State
  const [addressForm, setAddressForm] = useState(profile.defaultAddress)
  const [isSaved, setIsSaved] = useState(false)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({ name, email, phone })
    updateDefaultAddress(addressForm)
    setIsSaved(true)
    toast.success('Default delivery & account information saved successfully!')
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-['Outfit',sans-serif] text-[#12203D] selection:bg-[#2F5FE3] selection:text-white pb-24 pt-3 md:pt-5">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-gray-500">
          <Link to="/" className="hover:text-[#2F5FE3] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="font-bold text-[#12203D]">Account & Delivery Settings</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8 border-b border-gray-200/60 pb-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#12203D] sm:text-4xl">
            Account & Settings
          </h1>
          <p className="mt-1 text-xs md:text-sm font-medium text-gray-500">
            Manage your personal profile and default delivery information for fast checkout.
          </p>
        </div>

        {/* Top Account Overview Banner */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#12203D] to-[#2F5FE3] p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xs text-2xl font-black text-white border border-white/20">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold">{profile.name}</h2>
                <span className="rounded-full bg-amber-400/20 border border-amber-300/40 px-2.5 py-0.5 text-[10px] font-bold text-amber-200">
                  Guest User
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
              <Package size={16} />
              <span>Track Orders</span>
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-4 py-2.5 text-xs font-bold text-white transition-colors"
            >
              <Heart size={16} />
              <span>Wishlist</span>
            </Link>
          </div>
        </div>

        {/* Main Settings Form */}
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Personal Profile Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4 text-base font-extrabold text-[#12203D]">
                <User size={18} className="text-[#2F5FE3]" />
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
              <ShieldCheck size={18} className="text-[#2F5FE3] shrink-0 mt-0.5" />
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
                  <MapPin size={18} className="text-[#2F5FE3]" />
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
                      <CheckCircle2 size={18} />
                      <span>Default Delivery Info Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save Default Delivery Information</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
