import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiLockClosed, HiShieldCheck, HiEnvelope, HiKey, HiArrowRight } from 'react-icons/hi2'
import { useAdminStore } from '../../store/adminStore'

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAdminStore()
  const [email, setEmail] = useState('operator@noma.ng')
  const [password, setPassword] = useState('password123')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      login(email)
      setIsSubmitting(false)
      navigate('/admin')
    }, 400)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4 text-slate-900 font-sans">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-2xl shadow-emerald-950/20 text-center flex flex-col items-center">
        {/* Brand Icon Header */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 shadow-inner">
          <img src="/icon.PNG" alt="Noma Logo" className="h-10 w-10 object-contain" />
        </div>

        <span className="mb-1 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/20">
          Restricted Operator Access
        </span>

        <h1 className="font-['Outfit'] text-3xl font-black tracking-tight text-white mb-2">
          NOMA Operator Portal
        </h1>
        <p className="text-xs font-medium text-slate-400 mb-8 max-w-xs leading-relaxed">
          Authorized personnel sign-in for store operations, fulfillment, and content management.
        </p>

        <form className="w-full flex flex-col gap-4 text-left" onSubmit={handleSubmit}>
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
                placeholder="operator@noma.ng"
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
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              'Authenticating...'
            ) : (
              <>
                <HiLockClosed size={18} /> Enter Operator Dashboard <HiArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-t border-slate-900 pt-6 w-full justify-center">
          <HiShieldCheck size={16} className="text-emerald-500" /> Protected Operator Environment
        </div>
      </div>
    </div>
  )
}
