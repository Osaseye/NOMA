import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { SpinnerGap } from '@phosphor-icons/react'
import { authService } from '../../services/firebase/authService'
import { useAdminStore } from '../../store/adminStore'

export function AdminProtectedRoute() {
  const { isLoggedIn, operatorUser, login, logout } = useAdminStore()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const unsubscribe = authService.subscribeAuthState((authUser, profile) => {
      if (authUser && profile?.role === 'admin') {
        login(authUser.email || 'admin@shopnoma.com')
        useAdminStore.setState({
          isLoggedIn: true,
          operatorUser: {
            name: profile.name || 'Admin User',
            email: profile.email || authUser.email || '',
            role: 'Master Admin',
          },
        })
      } else if (authUser && profile && profile.role !== 'admin') {
        logout()
      } else if (!authUser) {
        logout()
      }
      setCheckingAuth(false)
    })

    return () => unsubscribe()
  }, [login, logout])

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F7F9] p-4 font-sans text-[#0B1220]">
        <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-[10px] border border-[#E5E7EB] bg-white p-8 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-2">
            <img
              src="/icon.png"
              alt="Noma"
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/fav.png'
              }}
            />
          </div>
          <SpinnerGap size={24} weight="regular" className="animate-spin text-[#1049EB]" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#0B1220]">Verifying Operator Credentials</p>
            <p className="font-mono text-[11px] text-[#5E6675]">Checking administrator session...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn || !operatorUser) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
