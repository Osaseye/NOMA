import { Outlet } from 'react-router-dom'
import { FloatingWhatsApp } from '../components/layout/FloatingWhatsApp'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { ScrollToTop } from '../components/ui/ScrollToTop'
import { useAdminStore } from '../store/adminStore'

export function StorefrontLayout() {
  const { settings } = useAdminStore()
  const announcementText = settings.announcementText?.replace(/[—–]/g, '-').trim()
  const showAnnouncement = Boolean(settings.announcementActive && announcementText)

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white text-[#0B1220]">
      <ScrollToTop />

      {showAnnouncement ? (
        <div className="border-b border-white/10 bg-[#0B1220] text-white">
          <div className="mx-auto flex h-8 max-w-7xl items-center justify-center px-4 text-center">
            <p className="truncate text-[11px] font-medium tracking-wide text-white/95">
              {announcementText}
            </p>
          </div>
        </div>
      ) : null}

      <StoreHeader />

      <main className="flex-1">
        <Outlet />
      </main>

      <StoreFooter />
      <FloatingWhatsApp />
    </div>
  )
}
