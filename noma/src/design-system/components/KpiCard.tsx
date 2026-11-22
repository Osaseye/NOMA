import type { ReactNode } from 'react'
import { Bank, Sparkle, Storefront, TrendUp } from '@phosphor-icons/react'

export type KpiTone = 'ink' | 'cobalt' | 'amber' | 'success' | 'blue' | 'gold' | 'emerald'
type NormalizedTone = 'ink' | 'cobalt' | 'amber' | 'success'

const normalizeTone = (tone: KpiTone): NormalizedTone => {
  switch (tone) {
    case 'blue':
    case 'cobalt':
      return 'cobalt'
    case 'gold':
    case 'amber':
      return 'amber'
    case 'emerald':
    case 'success':
      return 'success'
    case 'ink':
    default:
      return 'ink'
  }
}

const toneMeta: Record<
  NormalizedTone,
  {
    bar: string
    iconBox: string
    Icon: typeof TrendUp
  }
> = {
  ink: {
    bar: 'bg-[#0B1220]',
    iconBox: 'bg-[#F6F7F9] border-[#E5E7EB] text-[#0B1220]',
    Icon: Storefront,
  },
  cobalt: {
    bar: 'bg-[#1049EB]',
    iconBox: 'bg-[#EEF3FE] border-[#1049EB]/20 text-[#1049EB]',
    Icon: TrendUp,
  },
  amber: {
    bar: 'bg-[#FEB719]',
    iconBox: 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]',
    Icon: Sparkle,
  },
  success: {
    bar: 'bg-[#15803D]',
    iconBox: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]',
    Icon: Bank,
  },
}

export function KpiCard({
  label,
  value,
  tone = 'cobalt',
  subtitle,
  icon,
}: {
  label: string
  value: string
  tone?: KpiTone
  subtitle?: string
  icon?: ReactNode
}) {
  const normalized = normalizeTone(tone)
  const meta = toneMeta[normalized]
  const DefaultIcon = meta.Icon

  return (
    <article className="relative overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white p-4 sm:p-5 transition-colors hover:border-[#D1D5DB]">
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[2px] ${meta.bar}`} />
      <div className="flex items-center justify-between gap-2">
        <span className="line-clamp-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
          {label}
        </span>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border ${meta.iconBox}`}
        >
          {icon ?? <DefaultIcon size={16} weight="regular" />}
        </div>
      </div>
      <strong className="mt-3 block truncate font-mono tabular-nums text-xl font-bold tracking-tight text-[#0B1220] sm:text-2xl">
        {value}
      </strong>
      {subtitle ? (
        <span className="mt-1 block line-clamp-1 text-xs text-[#5E6675]">{subtitle}</span>
      ) : null}
    </article>
  )
}
