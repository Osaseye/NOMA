import {
  ArrowRight,
  CaretRight,
  ChatCircleDots,
  Phone,
  ShieldCheck,
  WhatsappLogo,
} from '@phosphor-icons/react'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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
        initialProduct.finalPrice,
      )}). Please confirm availability and delivery fee.`
    : 'Hello Noma! I would like assistance placing an order.'

  const directWhatsappUrl = `${baseWhatsappUrl}?text=${encodeURIComponent(prefilledText)}`

  return (
    <div className="min-h-screen bg-white pb-20 pt-5 text-slate-900">
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        <div className="mb-8 border-b border-slate-200 pb-4">
          <nav className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900">
              Home
            </Link>
            <CaretRight size={11} />
            <span className="font-medium text-slate-800">WhatsApp Concierge</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Chat, Order &amp; Request Bulk Pricing on WhatsApp
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-slate-500 sm:text-sm">
            Confirm live stock, request wholesale shoe bale quotes, or place a direct doorstep order via WhatsApp.
          </p>
        </div>

        <div className="mx-auto max-w-5xl space-y-12 py-4">
          <WhatsAppFlow initialProduct={initialProduct} whatsappHref={directWhatsappUrl} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2 rounded-2xl bg-[#F4F4F5] p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-900 shadow-2xs">
                <ShieldCheck size={19} weight="regular" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Verified Order Clarity</h2>
              <p className="text-xs leading-relaxed text-slate-500">
                Confirm sizes, quantities, and shipping costs with photos before paying.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl bg-[#F4F4F5] p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-900 shadow-2xs">
                <Phone size={19} weight="regular" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Direct Desk Support</h2>
              <p className="text-xs leading-relaxed text-slate-500">
                Mon – Sat (8:00 AM – 8:00 PM WAT) on{' '}
                <span className="font-semibold text-slate-900">{supportPhone}</span>.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl bg-[#F4F4F5] p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-900 shadow-2xs">
                <ChatCircleDots size={19} weight="regular" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Wholesale &amp; Bulk Quotes</h2>
              <p className="text-xs leading-relaxed text-slate-500">
                Ordering footwear bales, clothing, or catering supplies in bulk? Request wholesale pricing.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-slate-900 p-6 text-white sm:p-8 md:flex-row">
            <div className="space-y-1 text-center md:text-left">
              <h2 className="text-lg font-bold text-white">Ready to start your order via chat?</h2>
              <p className="text-xs text-white/75">
                Launch WhatsApp with your selected inquiry pre-filled for immediate assistance.
              </p>
            </div>
            <a
              href={directWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold text-slate-950 transition-colors hover:bg-slate-100"
            >
              <WhatsappLogo size={17} weight="fill" className="text-emerald-600" />
              <span>Open WhatsApp Chat</span>
              <ArrowRight size={14} weight="bold" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
