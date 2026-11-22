import {
  ChatCircleDots,
  CheckCircle,
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
      step: '01',
      title: 'Share Product or Cart',
      desc: 'Select any item in the catalog or tap Order on WhatsApp to pre-fill your product details.',
      icon: ShoppingBag,
    },
    {
      step: '02',
      title: 'Confirm Stock & Delivery',
      desc: 'A Noma representative verifies live availability and confirms your exact Nigerian delivery fee.',
      icon: ChatCircleDots,
    },
    {
      step: '03',
      title: 'Pay & Track Dispatch',
      desc: 'Complete payment by transfer or Pay on Delivery and receive your NMA tracking reference.',
      icon: Truck,
    },
  ]

  const sampleProductName = initialProduct ? initialProduct.name : 'Double Door Refrigerator'
  const samplePriceText = initialProduct ? formatNaira(initialProduct.finalPrice) : '₦345,000'
  const targetUrl = whatsappHref || brand.whatsapp

  return (
    <div className="w-full space-y-10">
      {/* 3-Step Flow */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {steps.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.step}
              className="flex flex-col justify-between rounded-[8px] border border-[#E5E7EB] bg-white p-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] text-[#1049EB]">
                    <Icon size={20} weight="regular" />
                  </div>
                  <span className="font-mono text-sm font-bold text-[#1049EB]">{s.step}</span>
                </div>
                <h3 className="text-base font-bold text-[#0B1220]">{s.title}</h3>
                <p className="text-xs leading-relaxed text-[#5E6675]">{s.desc}</p>
              </div>

              <div className="mt-5 flex items-center gap-1.5 border-t border-[#E5E7EB] pt-3.5 text-xs font-semibold text-[#15803D]">
                <CheckCircle size={15} weight="fill" />
                <span>Human verified</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Simulated Chat Preview Card */}
      <div className="mx-auto max-w-xl space-y-5 rounded-[10px] border border-[#E5E7EB] bg-white p-5 sm:p-7">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#0B1220] text-white">
              <WhatsappLogo size={20} weight="fill" className="text-[#25D366]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B1220]">{brand.name} WhatsApp Desk</h3>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                <span className="h-1.5 w-1.5 rounded-[2px] bg-[#15803D]" />
                <span>Customer Support Active</span>
              </div>
            </div>
          </div>

          <span className="rounded-[4px] border border-[#E5E7EB] bg-[#F6F7F9] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#5E6675]">
            WAT 08:00-20:00
          </span>
        </div>

        {/* Message Bubbles */}
        <div className="space-y-3 rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-4">
          <div className="ml-auto max-w-[88%] rounded-[8px] bg-[#0B1220] p-3.5 text-xs text-white">
            <p className="leading-relaxed">
              Hello Noma, I would like to order <strong>{sampleProductName}</strong> (
              <span className="font-mono">{samplePriceText}</span>) for delivery to Ikeja, Lagos.
            </p>
            <div className="mt-1.5 flex items-center justify-end gap-1 font-mono text-[10px] text-white/65">
              <span>Just now</span>
              <Checks size={13} weight="regular" className="text-[#25D366]" />
            </div>
          </div>

          <div className="mr-auto max-w-[88%] space-y-1.5 rounded-[8px] border border-[#E5E7EB] bg-white p-3.5 text-xs text-[#0B1220]">
            <p className="font-semibold text-[#15803D]">
              Hello! That item is available in our Lagos hub.
            </p>
            <p className="leading-relaxed text-[#374151]">
              Standard delivery to Ikeja is <span className="font-mono font-semibold">₦3,500</span>{' '}
              (1-2 business days). Would you prefer Bank Transfer or Pay on Delivery?
            </p>
            <span className="block text-right font-mono text-[10px] text-[#5E6675]">
              Noma Desk - Online
            </span>
          </div>
        </div>

        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#0B1220] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1049EB]"
        >
          <PaperPlaneTilt size={17} weight="regular" />
          <span>Start WhatsApp Chat Now</span>
        </a>
      </div>
    </div>
  )
}
