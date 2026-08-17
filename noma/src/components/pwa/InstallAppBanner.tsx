import { useState, useEffect } from 'react'
import { HiArrowDownTray, HiXMark, HiShare, HiPlus } from 'react-icons/hi2'

export function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSTipModal, setShowIOSTipModal] = useState(false)

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const iosDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(iosDevice)

    // Check if already running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone
    if (isStandalone) {
      setShowBanner(false)
      return
    }

    // Android / Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // On iOS, show banner if not already installed and not dismissed in session
    if (iosDevice && !sessionStorage.getItem('noma_ios_pwa_dismissed')) {
      setShowBanner(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSTipModal(true)
      return
    }

    if (!deferredPrompt) return
    deferredPrompt.prompt()
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
      {/* Top Smart Banner */}
      <div className="bg-[#12203D] text-white px-2.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 shadow-md border-b border-white/10 text-xs font-['Outfit',sans-serif]">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <img src="/icon.png" alt="NOMA App" className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 object-contain" />
          <div className="min-w-0 flex-1">
            <span className="font-extrabold text-white text-[11px] sm:text-xs block leading-tight truncate">Install NOMA App</span>
            <span className="text-[10px] sm:text-[11px] text-gray-300 block truncate">Fast & offline access</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1 rounded-lg sm:rounded-xl bg-[#2F5FE3] px-2.5 py-1 sm:px-3.5 sm:py-1.5 font-extrabold text-white shadow-xs hover:bg-blue-600 transition-all text-[11px] sm:text-xs whitespace-nowrap"
          >
            <HiArrowDownTray size={14} /> {isIOS ? 'Install' : 'Install App'}
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 sm:p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors"
            title="Dismiss"
          >
            <HiXMark size={16} />
          </button>
        </div>
      </div>

      {/* iOS Installation Instructions Modal */}
      {showIOSTipModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl z-10 text-center font-['Outfit',sans-serif] animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2F5FE3] mb-3">
              <HiShare size={28} />
            </div>

            <h3 className="text-base font-extrabold text-[#12203D]">
              Install NOMA on iPhone
            </h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              To add NOMA to your home screen:
            </p>

            <ol className="text-left text-xs font-semibold text-gray-700 mt-4 space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2F5FE3] text-white font-bold text-xs">1</span>
                <span>Tap the <strong>Share</strong> button <HiShare className="inline text-[#2F5FE3]" size={15} /> at the bottom of Safari</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2F5FE3] text-white font-bold text-xs">2</span>
                <span>Scroll down and select <strong>Add to Home Screen</strong> <HiPlus className="inline text-emerald-600" size={15} /></span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSTipModal(false)}
              className="w-full rounded-xl bg-[#2F5FE3] py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-600 transition-all mt-5"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  )
}
