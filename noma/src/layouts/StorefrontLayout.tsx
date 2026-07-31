import { Outlet } from 'react-router-dom'
import { FloatingWhatsApp } from '../components/layout/FloatingWhatsApp'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { ScrollToTop } from '../components/ui/ScrollToTop'

export function StorefrontLayout() {
  return (
    <div className="app">
      <ScrollToTop />
      <StoreHeader />
      <Outlet />
      <StoreFooter />
      <FloatingWhatsApp />
    </div>
  )
}

