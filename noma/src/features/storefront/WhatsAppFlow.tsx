import {
  ChatCircleDots,
  Checks,
  PaperPlaneTilt,
  ShoppingBag,
  Truck,
  WhatsappLogo,
} from '@phosphor-icons/react'
import { brand } from '../../constants/brand'
import type { Product } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

export function WhatsAppFlow({
  initialProduct,
  whatsappHref,
}: {
  initialProduct?: Product
  whatsappHref?: string
}) {
  const steps = [
    {
      step: '1',
      title: 'Share Product or Inquiry',
      desc: 'Select any item in the store or tap Order on WhatsApp to pre-fill your product details.',
      icon: ShoppingBag,
    },
    {
      step: '2',
      title: 'Confirm Stock & Delivery',
      desc: 'A Noma specialist verifies live availability, bulk discounts, and your exact Nigerian delivery fee.',
      icon: ChatCircleDots,
    },
    {
      step: '3',
      title: 'Pay & Track Dispatch',
      desc: 'Complete payment by transfer or Pay on Delivery and receive your tracking reference.',
      icon: Truck,
    },
  ]

  const sampleProductName = initialProduct ? initialProduct.name : 'Classic Footwear & Home Bundle'
  const samplePriceText = initialProduct ? formatNaira(initialProduct.finalPrice) : '₦85,000'
  const targetUrl = whatsappHref || brand.whatsapp

  return (
    <div className="w-full space-y-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {steps.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.step}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F4F5] text-slate-900">
                    <Icon size={20} weight="regular" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">Step {s.step}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Simulated Chat Preview Card */}
      <div className="mx-auto max-w-xl space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-7">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <WhatsappLogo size={20} weight="fill" className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{brand.name} WhatsApp Desk</h3>
              <p className="text-xs text-slate-500">Online • Fast Response</p>
            </div>
          </div>

          <span className="rounded-full bg-[#F4F4F5] px-3 py-1 text-[11px] font-medium text-slate-600">
            08:00 – 20:00 WAT
          </span>
        </div>

        <div className="space-y-3 rounded-2xl bg-[#F4F4F5] p-4">
          <div className="ml-auto max-w-[88%] rounded-2xl bg-slate-900 p-3.5 text-xs text-white">
            <p className="leading-relaxed">
              Hello Noma, I would like to order <strong>{sampleProductName}</strong> (
              <span className="tabular-nums">{samplePriceText}</span>) for delivery to Lagos.
            </p>
            <div className="mt-1.5 flex items-center justify-end gap-1 text-[10px] text-white/65">
              <span>Just now</span>
              <Checks size={13} weight="regular" className="text-emerald-400" />
            </div>
          </div>

          <div className="mr-auto max-w-[88%] space-y-1.5 rounded-2xl bg-white p-3.5 text-xs text-slate-900 shadow-2xs">
            <p className="font-semibold text-slate-900">
              Hello! That item is in stock and ready for dispatch.
            </p>
            <p className="leading-relaxed text-slate-600">
              Standard delivery to Lagos is <strong className="tabular-nums">₦3,500</strong> (1–2 business days). Would you prefer Bank Transfer or Pay on Delivery?
            </p>
          </div>
        </div>

        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          <PaperPlaneTilt size={17} weight="regular" />
          <span>Start WhatsApp Chat Now</span>
        </a>
      </div>
    </div>
  )
}
