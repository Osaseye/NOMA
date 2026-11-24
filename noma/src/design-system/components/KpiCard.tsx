import type { ReactNode } from 'react'

export type KpiTone = 'ink' | 'cobalt' | 'amber' | 'success' | 'blue' | 'gold' | 'emerald'

export function KpiCard({
  label,
  value,
  subtitle,
  icon,
}: {
  label: string
  value: string
  tone?: KpiTone
  subtitle?: string
  icon?: ReactNode
}) {
  return (
    <article className="flex flex-col justify-between border-b border-slate-200 py-3 sm:border-b-0 sm:border-r sm:px-5 sm:py-2 first:sm:pl-0 last:border-b-0 last:sm:border-r-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500">
          {label}
        </span>
        {icon ? <div className="text-slate-400">{icon}</div> : null}
      </div>
      <strong className="mt-1.5 block truncate text-2xl font-bold tracking-tight tabular-nums text-slate-950 sm:text-[26px]">
        {value}
      </strong>
      {subtitle ? (
        <span className="mt-0.5 block truncate text-[11px] text-slate-400">{subtitle}</span>
      ) : null}
    </article>
  )
}
