import { Outlet } from 'react-router-dom'
import { MiniCartDrawer } from '../components/commerce/MiniCartDrawer'
import { FloatingWhatsApp } from '../components/layout/FloatingWhatsApp'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { ScrollToTop } from '../components/ui/ScrollToTop'
import { useAdminStore } from '../store/adminStore'

export function StorefrontLayout() {
  const { settings } = useAdminStore()
  const rawText = settings.announcementText?.trim() || ''
  const announcementText = /firebase/i.test(rawText)
    ? 'Nationwide delivery across Nigeria • Retail & bulk orders available'
    : rawText.replace(/[—–]/g, '-')
  const showAnnouncement = Boolean(settings.announcementActive && announcementText)

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F8FAFC] text-[#0F172A]">
      <ScrollToTop />

      {showAnnouncement ? (
        <div className="bg-[#1049EB] text-white">
          <div className="mx-auto flex min-h-9 max-w-7xl items-center justify-center px-4 py-1.5 text-center text-xs font-medium sm:px-6">
            <p className="truncate">{announcementText}</p>
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
