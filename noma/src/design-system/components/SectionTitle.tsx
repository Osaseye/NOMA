import type { ReactNode } from 'react'

export function SectionTitle({
  eyebrow,
  title,
  detail,
  action,
  as = 'h2',
  className = '',
}: {
  eyebrow?: string
  title: string
  detail?: string
  action?: ReactNode
  as?: 'h1' | 'h2'
  className?: string
}) {
  const Heading = as

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div>
        {eyebrow ? (
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#1049EB]">
            {eyebrow}
          </span>
        ) : null}
        <Heading className="text-2xl font-bold leading-tight tracking-tight text-[#0B1220] md:text-[1.75rem]">
          {title}
        </Heading>
        {detail ? (
          <p className="mt-1.5 max-w-[65ch] text-sm leading-[1.6] text-[#374151] md:text-[15px]">
            {detail}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
