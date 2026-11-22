import {
  ArrowRight,
  ChatCircleDots,
  Phone,
  ShieldCheck,
  WhatsappLogo,
} from '@phosphor-icons/react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { brand } from '../../constants/brand'
import { WhatsAppFlow } from '../../features/storefront/WhatsAppFlow'
import { useAdminStore } from '../../store/adminStore'
import { useProductStore } from '../../store/productStore'
import { formatNaira } from '../../utils/pricing'

export function WhatsAppOrderPage() {
  const [searchParams] = useSearchParams()
  const productParam = searchParams.get('product')?.trim() || ''

  const { products } = useProductStore()
  const { settings } = useAdminStore()

  const initialProduct = useMemo(() => {
    if (!productParam) return undefined
    return products.find((p) => p.slug === productParam || p.id === productParam)
  }, [products, productParam])

  const whatsappDigits = (settings.whatsappNumber || brand.whatsappNumber).replace(/\D/g, '')
  const baseWhatsappUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : brand.whatsapp
  const supportPhone = settings.supportPhone || brand.phone

  const prefilledText = initialProduct
    ? `Hello Noma! I would like to order ${initialProduct.name} (${formatNaira(
        initialProduct.finalPrice
      )}). Please confirm availability and delivery fee.`
    : 'Hello Noma! I would like assistance placing an order.'

  const directWhatsappUrl = `${baseWhatsappUrl}?text=${encodeURIComponent(prefilledText)}`

  return (
    <div className="min-h-screen bg-[#F6F7F9] pb-20 text-[#0B1220]">
      {/* Architectural Light Header */}
      <div className="border-b border-[#E5E7EB] bg-white py-14 text-center md:py-16">
        <div className="mx-auto max-w-3xl space-y-3 px-4 md:px-8">
          <span className="inline-flex items-center gap-2 rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#15803D]">
            <WhatsappLogo size={14} weight="fill" />
            <span>Direct WhatsApp Desk</span>
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-[#0B1220] md:text-4xl">
            Chat, Order &amp; Track on WhatsApp
          </h1>

          <p className="mx-auto max-w-[58ch] text-sm leading-[1.6] text-[#374151] md:text-[15px]">
            Prefer speaking directly with a specialist? Confirm stock, verify delivery rates by state, or place an order directly in WhatsApp.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 md:px-8">
        <WhatsAppFlow initialProduct={initialProduct} whatsappHref={directWhatsappUrl} />

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 gap-4 border-t border-[#E5E7EB] pt-10 md:grid-cols-3">
          <div className="space-y-2 rounded-[8px] border border-[#E5E7EB] bg-white p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]">
              <ShieldCheck size={19} weight="fill" />
            </div>
            <h2 className="text-sm font-bold text-[#0B1220]">Verified Order Clarity</h2>
            <p className="text-xs leading-relaxed text-[#5E6675]">
              Confirm exact model numbers, dimensions, and shipping cost with photos before paying.
            </p>
          </div>

          <div className="space-y-2 rounded-[8px] border border-[#E5E7EB] bg-white p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#1049EB]/25 bg-[#EEF3FE] text-[#1049EB]">
              <Phone size={19} weight="regular" />
            </div>
            <h2 className="text-sm font-bold text-[#0B1220]">Real-Time Desk Support</h2>
            <p className="text-xs leading-relaxed text-[#5E6675]">
              Mon - Sat (8:00 AM - 8:00 PM WAT) on{' '}
              <span className="font-mono font-semibold text-[#0B1220]">{supportPhone}</span>.
            </p>
          </div>

          <div className="space-y-2 rounded-[8px] border border-[#E5E7EB] bg-white p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] text-[#0B1220]">
              <ChatCircleDots size={19} weight="regular" />
            </div>
            <h2 className="text-sm font-bold text-[#0B1220]">Bulk &amp; Office Quotes</h2>
            <p className="text-xs leading-relaxed text-[#5E6675]">
              Furnishing an office or ordering multi-item appliances? Request consolidated pricing.
            </p>
          </div>
        </div>

        {/* Bottom Obsidian Action Strip */}
        <div className="flex flex-col items-center justify-between gap-6 rounded-[10px] border border-[#0B1220] bg-[#0B1220] p-6 text-white sm:p-8 md:flex-row">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-lg font-bold text-white">Ready to start your order via chat?</h2>
            <p className="text-xs text-white/75">
              Launch WhatsApp with your selected inquiry pre-filled for immediate desk assistance.
            </p>
          </div>
          <a
            href={directWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-[6px] bg-white px-5 py-3 text-xs font-semibold text-[#0B1220] transition-colors hover:bg-[#F6F7F9]"
          >
            <WhatsappLogo size={17} weight="fill" className="text-[#15803D]" />
            <span>Open WhatsApp Support</span>
            <ArrowRight size={14} weight="regular" />
          </a>
        </div>
      </div>
    </div>
  )
}
