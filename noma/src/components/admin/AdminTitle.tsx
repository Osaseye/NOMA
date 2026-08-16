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
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
          NOMA OPERATOR CONTROL
        </span>
        <h1 className="font-['Outfit'] text-2xl md:text-3xl font-black leading-tight tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="text-xs md:text-sm font-medium text-slate-500 max-w-2xl">{detail}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
