import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowRight,
  Envelope,
  Key,
  LockKey,
  ShieldCheck,
  SpinnerGap,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { authService } from '../../services/firebase/authService'
import { useAdminStore } from '../../store/adminStore'

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAdminStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    setIsSubmitting(true)
    try {
      const user = await authService.loginWithEmail(email, password)
      const profile = await authService.getUserProfile(user.uid)

      if (profile && profile.role !== 'admin') {
        toast.error('Access Denied: Account is not authorized as an administrator.')
        await authService.logout()
        return
      }

      login(user.email || email)
      useAdminStore.setState({
        isLoggedIn: true,
        operatorUser: {
          name: profile?.name || 'Master Admin',
          email: user.email || email,
          role: 'Master Admin',
        },
      })
      toast.success('Welcome back to Noma Operations.')
      navigate('/admin')
    } catch (err: unknown) {
      const error = err as { message?: string }
      console.error('Login error:', error)
      toast.error(error.message || 'Invalid admin credentials')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F7F9] p-4 font-sans text-[#0B1220]">
      <div className="w-full max-w-md rounded-[10px] border border-[#E5E7EB] bg-white p-8">
        {/* Brand Header */}
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
            Restricted Operator Access
          </span>

          <h1 className="text-2xl font-bold tracking-tight text-[#0B1220]">
            NOMA Operator Portal
          </h1>
          <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-[#5E6675]">
            Authorized personnel sign-in for store operations, fulfillment, and catalog control.
          </p>
        </div>

        <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-login-email"
              className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]"
            >
              Operator Email
            </label>
            <div className="relative flex items-center">
              <Envelope
                size={16}
                weight="regular"
                className="pointer-events-none absolute left-3.5 text-[#5E6675]"
              />
              <input
                id="admin-login-email"
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
              htmlFor="admin-login-password"
              className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]"
            >
              Operator Password
            </label>
            <div className="relative flex items-center">
              <Key
                size={16}
                weight="regular"
                className="pointer-events-none absolute left-3.5 text-[#5E6675]"
              />
              <input
                id="admin-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-[6px] border border-[#D1D5DB] bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#0B1220] placeholder:text-[#5E6675]/60 transition-colors focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-[6px] bg-[#0B1220] text-sm font-semibold text-white transition-colors hover:bg-[#1E293B] active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <SpinnerGap size={16} weight="regular" className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <LockKey size={16} weight="regular" />
                <span>Sign In to Dashboard</span>
                <ArrowRight size={15} weight="regular" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#5E6675]">
          Need an operator account?{' '}
          <Link to="/admin/register" className="font-semibold text-[#1049EB] hover:underline">
            Register Admin Account
          </Link>
        </div>

        <div className="mt-6 flex w-full items-center justify-center gap-2 border-t border-[#E5E7EB] pt-5 font-mono text-[11px] uppercase tracking-wider text-[#5E6675]">
          <ShieldCheck size={15} weight="regular" className="text-[#15803D]" />
          <span>Protected Operator Environment</span>
        </div>
      </div>
    </div>
  )
}
