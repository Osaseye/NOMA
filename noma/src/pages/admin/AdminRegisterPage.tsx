import { useState } from 'react'
import { ArrowRight, Eye, EyeSlash, SpinnerGap } from '@phosphor-icons/react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authService } from '../../services/firebase/authService'
import { useAdminStore } from '../../store/adminStore'

const ADMIN_SECRET_CODE = import.meta.env.VITE_ADMIN_SECRET_CODE || 'NOMA-ADMIN-2025'

export function AdminRegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [secretCode, setSecretCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword || !secretCode) {
      setError('Please complete all fields.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (secretCode.trim() !== ADMIN_SECRET_CODE) {
      setError('Invalid authorization key.')
      toast.error('Invalid admin authorization key.')
      return
    }

    setLoading(true)
    try {
      const { user, profile } = await authService.registerAdmin(email, password, name, '')
      useAdminStore.setState({
        isLoggedIn: true,
        operatorUser: {
          name: profile.name || name,
          email: user.email || email,
          role: 'Master Admin',
        },
      })
      toast.success('Admin account created.')
      navigate('/admin')
    } catch (err: unknown) {
      console.error('Admin Registration Error:', err)
      const firebaseError = err as { code?: string; message?: string }
      if (firebaseError.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Sign in instead.')
      } else {
        setError(firebaseError.message || 'Failed to register admin account.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-white px-5 py-10 text-slate-900">
      <div className="mx-auto w-full max-w-[440px]">
        {/* Brand Header — Floating directly on screen */}
        <div className="mb-7 flex flex-col items-start">
          <Link to="/" className="mb-5 inline-flex items-center gap-2.5">
            <img
              src="/icon.png"
              alt="Noma"
              className="h-9 w-9 object-contain"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = '/logo.PNG'
              }}
            />
            <span className="text-lg font-bold tracking-tight text-slate-950">Noma Admin</span>
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Create admin account</h1>
          <p className="mt-1 text-xs text-slate-500">
            Set up an administrator profile for Noma.
          </p>
        </div>

        {/* Compact 2-Column Floating Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error ? (
            <p className="text-xs font-medium text-rose-600">{error}</p>
          ) : null}

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reg-full-name"
                className="mb-1 block text-xs font-medium text-slate-600"
              >
                Full name
              </label>
              <input
                id="reg-full-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adebola Glory"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="reg-work-email"
                className="mb-1 block text-xs font-medium text-slate-600"
              >
                Work email
              </label>
              <input
                id="reg-work-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shopnoma.com"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reg-password"
                className="mb-1 block text-xs font-medium text-slate-600"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-950 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeSlash size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-confirm-password"
                className="mb-1 block text-xs font-medium text-slate-600"
              >
                Confirm password
              </label>
              <input
                id="reg-confirm-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-secret-code"
              className="mb-1 block text-xs font-medium text-slate-600"
            >
              Authorization key
            </label>
            <input
              id="reg-secret-code"
              type="password"
              required
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              placeholder="Enter admin key"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? (
              <>
                <SpinnerGap size={15} className="animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Admin Account</span>
                <ArrowRight size={14} weight="bold" />
              </>
            )}
          </button>
        </form>

        {/* Minimal Footer Links */}
        <div className="mt-7 flex items-center justify-between text-xs text-slate-500">
          <Link to="/admin/login" className="font-medium text-slate-900 hover:underline">
            Sign in instead
          </Link>
          <Link to="/" className="hover:text-slate-900">
            Back to store
          </Link>
        </div>
      </div>
    </div>
  )
}
