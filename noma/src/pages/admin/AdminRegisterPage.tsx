import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowRight,
  Envelope,
  Key,
  Phone,
  ShieldCheck,
  SpinnerGap,
  User,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { authService } from '../../services/firebase/authService'
import { useAdminStore } from '../../store/adminStore'

export function AdminRegisterPage() {
  const navigate = useNavigate()
  const { login } = useAdminStore()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password) {
      toast.error('Please fill in all required fields')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const { user, profile } = await authService.registerAdmin(email, password, name, phone)

      login(user.email || email)
      useAdminStore.setState({
        isLoggedIn: true,
        operatorUser: {
          name: profile.name,
          email: profile.email,
          role: 'Master Admin',
        },
      })

      toast.success('Admin account created. Welcome to Noma Operations.')
      navigate('/admin')
    } catch (err: unknown) {
      const error = err as { message?: string }
      console.error('Admin registration error:', error)
      toast.error(error.message || 'Failed to create admin account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F7F9] p-4 font-sans text-[#0B1220]">
      <div className="w-full max-w-md rounded-[10px] border border-[#E5E7EB] bg-white p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-2">
            <img
              src="/icon.png"
              alt="Noma"
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/fav.png'
              }}
            />
          </div>

          <span className="mb-2 rounded-[4px] bg-[#EEF3FE] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#1049EB]">
            Operator Provisioning
          </span>

          <h1 className="text-2xl font-bold tracking-tight text-[#0B1220]">
            Admin Registration
          </h1>
          <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-[#5E6675]">
            Create an administrator account for Noma store operations and reconciliation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-reg-name"
              className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]"
            >
              Full Name *
            </label>
            <div className="relative flex items-center">
              <User
                size={16}
                weight="regular"
                className="pointer-events-none absolute left-3.5 text-[#5E6675]"
              />
              <input
                id="admin-reg-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chief Operator"
                className="w-full rounded-[6px] border border-[#D1D5DB] bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#0B1220] placeholder:text-[#5E6675]/60 transition-colors focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-reg-phone"
              className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]"
            >
              Phone Number
            </label>
            <div className="relative flex items-center">
              <Phone
                size={16}
                weight="regular"
                className="pointer-events-none absolute left-3.5 text-[#5E6675]"
              />
              <input
                id="admin-reg-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08030006662"
                className="w-full rounded-[6px] border border-[#D1D5DB] bg-white py-2.5 pl-10 pr-3.5 font-mono text-sm text-[#0B1220] placeholder:text-[#5E6675]/60 transition-colors focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-reg-email"
              className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]"
            >
              Admin Email *
            </label>
            <div className="relative flex items-center">
              <Envelope
                size={16}
                weight="regular"
                className="pointer-events-none absolute left-3.5 text-[#5E6675]"
              />
              <input
                id="admin-reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shopnoma.com"
                className="w-full rounded-[6px] border border-[#D1D5DB] bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#0B1220] placeholder:text-[#5E6675]/60 transition-colors focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-reg-password"
              className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]"
            >
              Password *
            </label>
            <div className="relative flex items-center">
              <Key
                size={16}
                weight="regular"
                className="pointer-events-none absolute left-3.5 text-[#5E6675]"
              />
              <input
                id="admin-reg-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-[6px] border border-[#D1D5DB] bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#0B1220] placeholder:text-[#5E6675]/60 transition-colors focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-reg-confirm"
              className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]"
            >
              Confirm Password *
            </label>
            <div className="relative flex items-center">
              <Key
                size={16}
                weight="regular"
                className="pointer-events-none absolute left-3.5 text-[#5E6675]"
              />
              <input
                id="admin-reg-confirm"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-[6px] border border-[#D1D5DB] bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#0B1220] placeholder:text-[#5E6675]/60 transition-colors focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-[6px] bg-[#0B1220] text-sm font-semibold text-white transition-colors hover:bg-[#1E293B] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <>
                <SpinnerGap size={16} weight="regular" className="animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register as Master Admin</span>
                <ArrowRight size={15} weight="regular" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#5E6675]">
          Already registered?{' '}
          <Link to="/admin/login" className="font-semibold text-[#1049EB] hover:underline">
            Back to Admin Login
          </Link>
        </div>

        <div className="mt-6 flex w-full items-center justify-center gap-2 border-t border-[#E5E7EB] pt-5 font-mono text-[11px] uppercase tracking-wider text-[#5E6675]">
          <ShieldCheck size={15} weight="regular" className="text-[#15803D]" />
          <span>Protected Operator Environment</span>
        </div>
      </div>
    </main>
  )
}
