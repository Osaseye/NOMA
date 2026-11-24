import { Outlet } from 'react-router-dom'
import { MiniCartDrawer } from '../components/commerce/MiniCartDrawer'
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
    <div className="flex min-h-[100dvh] flex-col bg-white text-[#09090B]">
      <ScrollToTop />

      {showAnnouncement ? (
        <div className="border-b border-[#E4E4E7] bg-[#09090B] text-white">
          <div className="mx-auto flex h-8 max-w-[1600px] items-center justify-between px-4 text-[11px] md:px-8">
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-white/60 sm:inline">
              NOMA / NG
            </span>
            <p className="truncate font-mono text-[11px] tracking-wide text-white/95">
              {announcementText}
            </p>
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-[#FEB719] sm:inline">
              VERIFIED ESCROW &amp; POD
            </span>
          </div>
        </div>
      ) : null}

      <StoreHeader />
      <MiniCartDrawer />

      <main className="flex-1">
        <Outlet />
      </main>

      <StoreFooter />
      <FloatingWhatsApp />
    </div>
  )
}
