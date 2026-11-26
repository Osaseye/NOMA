import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { HelmetProvider } from 'react-helmet-async'
import { PageLoader } from '../components/ui/PageLoader'
import { router } from '../routes/router'
import { authService } from '../services/firebase/authService'
import { useProductStore } from '../store/productStore'
import { useAdminStore } from '../store/adminStore'
import { useUserStore } from '../store/userStore'

const queryClient = new QueryClient()

export default function App() {
  useEffect(() => {
    const unsubProducts = useProductStore.getState().initFirebaseListeners()
    const unsubSettings = useAdminStore.getState().initSettingsListener()
    const unsubAuth = authService.subscribeAuthState((authUser, userDoc) => {
      useUserStore.getState().syncFromFirebaseUser(authUser, userDoc)
      if (!authUser) {
        useProductStore.getState().subscribeOrdersForUser(null)
      } else if (!userDoc || userDoc.role !== 'admin') {
        useProductStore.getState().subscribeOrdersForUser(authUser.uid)
      }
    })

    return () => {
      unsubProducts()
      unsubSettings()
      unsubAuth()
    }
  }, [])

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <PageLoader />
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          expand={false}
          toastOptions={{
            style: {
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: '600',
              color: '#0B1220',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 8px 24px rgba(11, 18, 32, 0.08)',
            },
            classNames: {
              title: 'text-[13px] font-semibold tracking-tight text-[#0B1220]',
              description: 'text-[12px] font-normal text-[#5E6675]',
              closeButton:
                '!bg-white !border !border-slate-200 !text-slate-600 hover:!bg-slate-100 hover:!text-slate-950 transition-colors',
            },
          }}
        />
      </QueryClientProvider>
    </HelmetProvider>
  )
}
