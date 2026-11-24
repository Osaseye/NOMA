import { useState } from 'react'
import { ArrowRight, Eye, EyeSlash, SpinnerGap } from '@phosphor-icons/react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authService } from '../../services/firebase/authService'
import { useAdminStore } from '../../store/adminStore'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Enter your email and password.')
      return
    }

    setLoading(true)
    try {
      const user = await authService.loginWithEmail(email, password)
      const profile = await authService.getUserProfile(user.uid)

      if (profile && profile.role !== 'admin') {
        await authService.logout()
        setError('Access denied. Administrator privileges required.')
        toast.error('Access denied: Administrator privileges required.')
        return
      }

      useAdminStore.setState({
        isLoggedIn: true,
        operatorUser: {
          name: profile?.name || 'Master Admin',
          email: user.email || email,
          role: 'Master Admin',
        },
      })
      toast.success(`Welcome back, ${profile?.name || 'Admin'}`)
      navigate('/admin')
    } catch (err: unknown) {
      console.error('Admin Login Error:', err)
      const firebaseError = err as { code?: string; message?: string }
      if (
        firebaseError.code === 'auth/invalid-credential' ||
        firebaseError.code === 'auth/user-not-found' ||
        firebaseError.code === 'auth/wrong-password'
      ) {
        setError('Invalid email or password.')
      } else {
        setError(firebaseError.message || 'Authentication failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-white px-5 py-10 text-slate-900">
      <div className="mx-auto w-full max-w-[360px]">
        {/* Brand Header — Floating directly on the white screen */}
        <div className="mb-8 flex flex-col items-start">
          <Link to="/" className="mb-6 inline-flex items-center gap-2.5">
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

          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Sign in</h1>
          <p className="mt-1 text-xs text-slate-500">
            Enter your administrator credentials to continue.
          </p>
        </div>

        {/* Form — Open & Floating, Zero Card Borders */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <p className="text-xs font-medium text-rose-600">{error}</p>
          ) : null}

          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Email address
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@shopnoma.com"
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-950 placeholder:text-slate-400 transition-colors focus:border-slate-950 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-3.5 pr-10 text-sm text-slate-950 placeholder:text-slate-400 transition-colors focus:border-slate-950 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? (
              <>
                <SpinnerGap size={15} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Continue to Admin</span>
                <ArrowRight size={14} weight="bold" />
              </>
            )}
          </button>
        </form>

        {/* Minimal Footer Links */}
        <div className="mt-8 flex items-center justify-between text-xs text-slate-500">
          <Link to="/admin/register" className="font-medium text-slate-900 hover:underline">
            Create admin account
          </Link>
          <Link to="/" className="hover:text-slate-900">
            Back to store
          </Link>
        </div>
      </div>
    </div>
  )
}
