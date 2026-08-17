import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HiLockClosed, HiShieldCheck, HiEnvelope, HiKey, HiArrowRight } from 'react-icons/hi2'
import { authService } from '../../services/firebase/authService'
import { useAdminStore } from '../../store/adminStore'
import { toast } from 'sonner'

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
      toast.success('Welcome back, Admin!')
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
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4 font-sans text-slate-900">
      <div className="flex w-full max-w-md flex-col items-center overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-8 text-center shadow-2xl shadow-emerald-950/20">
        {/* Brand Icon Header */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 shadow-inner">
          <img src="/icon.PNG" alt="Noma Logo" className="h-10 w-10 object-contain" />
        </div>

        <span className="mb-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400">
          Restricted Operator Access
        </span>

        <h1 className="mb-2 font-['Outfit'] text-3xl font-black tracking-tight text-white">
          NOMA Operator Portal
        </h1>
        <p className="mb-6 max-w-xs text-xs font-medium leading-relaxed text-slate-400">
          Authorized personnel sign-in for store operations, fulfillment, and content management.
        </p>

        <form className="flex w-full flex-col gap-4 text-left" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-300">
              Email Address
            </label>
            <div className="relative flex items-center">
              <HiEnvelope className="absolute left-3.5 text-slate-500" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@noma.ng"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-10 pr-4 text-sm font-bold text-white placeholder-slate-600 outline-none transition-all focus:border-emerald-500 focus:bg-slate-900/90"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-300">
              Operator Password
            </label>
            <div className="relative flex items-center">
              <HiKey className="absolute left-3.5 text-slate-500" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-10 pr-4 text-sm font-bold text-white placeholder-slate-600 outline-none transition-all focus:border-emerald-500 focus:bg-slate-900/90"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-500 active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              'Authenticating...'
            ) : (
              <>
                <HiLockClosed size={18} /> Sign In to Dashboard <HiArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-xs font-bold text-slate-400">
          Need an Admin Account?{' '}
          <Link to="/admin/register" className="font-black text-emerald-400 hover:underline">
            Register Admin Account
          </Link>
        </div>

        <div className="mt-8 flex w-full items-center justify-center gap-2 border-t border-slate-900 pt-6 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <HiShieldCheck size={16} className="text-emerald-500" /> Protected Operator Environment
        </div>
      </div>
    </div>
  )
}
