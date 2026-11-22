import { useEffect, useState } from 'react'
import { DownloadSimple, Plus, ShareNetwork, X } from '@phosphor-icons/react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallAppBanner() {
  const isIOS =
    typeof window !== 'undefined' &&
    /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
  const isStandalone =
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone))

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(
    () => isIOS && !isStandalone && !sessionStorage.getItem('noma_ios_pwa_dismissed'),
  )
  const [showIOSTipModal, setShowIOSTipModal] = useState(false)

  useEffect(() => {
    if (isStandalone) {
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [isStandalone])

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSTipModal(true)
      return
    }

    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowBanner(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    if (isIOS) {
      sessionStorage.setItem('noma_ios_pwa_dismissed', 'true')
    }
  }

  if (!showBanner) return null

  return (
    <>
      <div className="border-b border-white/10 bg-[#0B1220] text-white">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 md:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <img
              src="/icon.png"
              alt="Noma App"
              className="h-5 w-5 shrink-0 object-contain"
            />
            <span className="truncate text-[11px] font-medium text-white/95 sm:text-xs">
              Install Noma App for offline access
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-[6px] bg-[#1049EB] px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-[#0D3BC2]"
            >
              <DownloadSimple size={13} weight="regular" />
              <span>Install</span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss install banner"
              className="rounded-[6px] p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={15} weight="regular" />
            </button>
          </div>
        </div>
      </div>

      {showIOSTipModal ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B1220]/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-[10px] border border-[#E5E7EB] bg-white p-6 text-center shadow-[0_8px_24px_rgba(11,18,32,0.12)]">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-[#EEF3FE] text-[#1049EB]">
              <ShareNetwork size={22} weight="regular" />
            </div>

            <h3 className="text-base font-bold tracking-tight text-[#0B1220]">
              Install Noma on iPhone
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#5E6675]">
              Add Noma to your home screen for quick, offline-ready browsing.
            </p>

            <ol className="mt-4 space-y-2.5 rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-4 text-left text-xs font-medium text-[#374151]">
              <li className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] bg-[#0B1220] font-mono text-[11px] font-semibold text-white">
                  1
                </span>
                <span className="flex items-center gap-1">
                  Tap <strong className="text-[#0B1220]">Share</strong>
                  <ShareNetwork size={14} weight="regular" className="text-[#1049EB]" />
                  in Safari
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] bg-[#0B1220] font-mono text-[11px] font-semibold text-white">
                  2
                </span>
                <span className="flex items-center gap-1">
                  Select <strong className="text-[#0B1220]">Add to Home Screen</strong>
                  <Plus size={14} weight="regular" className="text-[#15803D]" />
                </span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSTipModal(false)}
              className="mt-5 w-full rounded-[6px] bg-[#0B1220] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1049EB]"
            >
              Got it
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
