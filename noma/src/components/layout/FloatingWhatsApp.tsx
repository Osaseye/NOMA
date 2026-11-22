import { WhatsappLogo } from '@phosphor-icons/react'
import { useLocation } from 'react-router-dom'
import { brand } from '../../constants/brand'
import { useAdminStore } from '../../store/adminStore'

export function FloatingWhatsApp() {
  const location = useLocation()
  const { settings } = useAdminStore()

  if (location.pathname === '/whatsapp-order' || location.pathname.startsWith('/admin')) {
    return null
  }

  const whatsappDigits = settings.whatsappNumber?.replace(/\D/g, '')
  const whatsappUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : brand.whatsapp

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Noma on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-[8px] border border-white/15 bg-[#0B1220] px-3.5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1049EB] active:scale-[0.98]"
    >
      <WhatsappLogo size={18} weight="fill" className="shrink-0 text-[#25D366]" />
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#22C55E]" aria-hidden="true" />
      <span className="hidden tracking-tight md:inline">WhatsApp Desk</span>
    </a>
  )
}
