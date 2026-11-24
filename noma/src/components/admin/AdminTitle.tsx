import type { ReactNode } from 'react'

export function AdminTitle({
  title,
  detail,
  action,
}: {
  title: string
  detail?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
          {title}
        </h1>
        {detail ? (
          <p className="mt-0.5 max-w-2xl text-xs text-slate-500">
            {detail}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  )
}
