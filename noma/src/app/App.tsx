import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { HelmetProvider } from 'react-helmet-async'
import { PageLoader } from '../components/ui/PageLoader'
import { router } from '../routes/router'
import { useProductStore } from '../store/productStore'
import { useAdminStore } from '../store/adminStore'

const queryClient = new QueryClient()

export default function App() {
  useEffect(() => {
    const unsubProducts = useProductStore.getState().initFirebaseListeners()
    const unsubSettings = useAdminStore.getState().initSettingsListener()

    return () => {
      unsubProducts()
      unsubSettings()
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
          expand={false}
          toastOptions={{
            style: {
              fontFamily: 'Outfit, Inter, sans-serif',
              fontWeight: '700',
              borderRadius: '16px',
              border: '2px solid #12203D',
              boxShadow: '4px 4px 0px 0px #12203D',
            },
            classNames: {
              title: 'text-[14px] font-black tracking-tight',
              description: 'text-[12px] font-medium',
            },
          }}
        />
      </QueryClientProvider>
    </HelmetProvider>
  )
}
