import type { ReactNode } from 'react'
import { Package } from '@phosphor-icons/react'

type EmptyStateProps = {
  title: string
  detail: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  detail,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-[8px] border border-dashed border-[#D1D5DB] bg-white px-6 py-10 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] text-[#5E6675]">
        {icon ?? <Package size={24} weight="regular" />}
      </div>
      <div className="space-y-1">
        <strong className="block text-sm font-bold tracking-tight text-[#0B1220] sm:text-base">
          {title}
        </strong>
        <p className="mx-auto max-w-md text-xs leading-relaxed text-[#5E6675] sm:text-[13px]">
          {detail}
        </p>
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}
