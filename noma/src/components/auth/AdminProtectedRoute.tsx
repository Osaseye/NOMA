import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { authService } from '../../services/firebase/authService'
import { useAdminStore } from '../../store/adminStore'
import { Loader2 } from 'lucide-react'

export function AdminProtectedRoute() {
  const { isLoggedIn, operatorUser, login, logout } = useAdminStore()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const unsubscribe = authService.subscribeAuthState((authUser, profile) => {
      if (authUser && profile?.role === 'admin') {
        login(authUser.email || 'admin@noma.ng')
        useAdminStore.setState({
          isLoggedIn: true,
          operatorUser: {
            name: profile.name || 'Admin User',
            email: profile.email,
            role: 'Master Admin',
          },
        })
      } else if (authUser && !profile) {
        // Auth user exists but profile might still be loading or created via fallback
        // Check if admin store was already logged in
      } else {
        logout()
      }
      setCheckingAuth(false)
    })

    return () => unsubscribe()
  }, [login, logout])

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6F9]">
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-[#12203D] bg-white p-8 shadow-[6px_6px_0px_0px_#12203D]">
          <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
          <p className="font-bold text-[#12203D]">Verifying Admin Credentials...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn || !operatorUser) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
