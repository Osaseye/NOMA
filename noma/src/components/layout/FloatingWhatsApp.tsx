import { useLocation } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { brand } from '../../constants/brand'

export function FloatingWhatsApp() {
  const location = useLocation()

  // Do not render the floating bubble on the dedicated WhatsApp order page
  if (location.pathname === '/whatsapp-order') {
    return null
  }

  return (
    <a
      href={brand.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Noma on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-emerald-600 px-4 py-3 text-xs font-extrabold text-white shadow-2xl hover:bg-emerald-500 transition-all hover:scale-105 active:scale-95 group border-2 border-white/20"
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
      </span>
      <FaWhatsapp size={22} className="shrink-0 text-white" />
      <span className="hidden md:inline font-bold tracking-wide">Chat on WhatsApp</span>
    </a>
  )
}
