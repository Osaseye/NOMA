import type { ReactNode } from 'react'

export function AdminTitle({
  title,
  detail,
  action,
}: {
  title: string
  detail: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-[#E5E7EB] pb-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1049EB]">
          NOMA OPERATIONS
        </span>
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-[#0B1220] sm:text-[1.75rem]">
          {title}
        </h1>
        <p className="max-w-2xl text-xs leading-relaxed text-[#5E6675] sm:text-sm">
          {detail}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
