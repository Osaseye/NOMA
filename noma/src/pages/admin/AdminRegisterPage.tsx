import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../../services/firebase/authService'
import { useAdminStore } from '../../store/adminStore'
import { toast } from 'sonner'
import { HiShieldCheck, HiEnvelope, HiLockClosed, HiUser, HiPhone } from 'react-icons/hi2'

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

      toast.success('Admin Account Created Successfully! Welcome to NOMA.')
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
    <div className="flex min-h-screen items-center justify-center bg-[#F4F6F9] p-4">
      <div className="w-full max-w-md rounded-3xl border-4 border-[#12203D] bg-white p-8 shadow-[10px_10px_0px_0px_#12203D]">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#12203D] bg-[#0066FF] text-white shadow-[4px_4px_0px_0px_#12203D]">
            <HiShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-[#12203D]">Admin Registration</h1>
          <p className="mt-1 text-xs font-bold text-gray-500">
            Create an official Administrator account for NOMA Backend
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-black text-[#12203D]">Full Name *</label>
            <div className="relative">
              <HiUser className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chief Operator"
                className="w-full rounded-xl border-2 border-[#12203D] bg-white py-2.5 pl-10 pr-4 text-sm font-bold text-[#12203D] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-black text-[#12203D]">Phone Number</label>
            <div className="relative">
              <HiPhone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08030006662"
                className="w-full rounded-xl border-2 border-[#12203D] bg-white py-2.5 pl-10 pr-4 text-sm font-bold text-[#12203D] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-black text-[#12203D]">Admin Email *</label>
            <div className="relative">
              <HiEnvelope className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@noma.ng"
                className="w-full rounded-xl border-2 border-[#12203D] bg-white py-2.5 pl-10 pr-4 text-sm font-bold text-[#12203D] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-black text-[#12203D]">Password *</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border-2 border-[#12203D] bg-white py-2.5 pl-10 pr-4 text-sm font-bold text-[#12203D] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-black text-[#12203D]">Confirm Password *</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border-2 border-[#12203D] bg-white py-2.5 pl-10 pr-4 text-sm font-bold text-[#12203D] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl border-2 border-[#12203D] bg-[#0066FF] py-3 text-sm font-black text-white shadow-[4px_4px_0px_0px_#12203D] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {loading ? 'Creating Admin Account...' : 'Register as Master Admin'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs font-bold text-gray-500">
          Already registered?{' '}
          <Link to="/admin/login" className="font-black text-[#0066FF] hover:underline">
            Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  )
}
