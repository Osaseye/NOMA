import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const baseInputClasses =
  'w-full rounded-[6px] border border-[#D1D5DB] bg-white px-3.5 py-2.5 text-sm text-[#0B1220] placeholder:text-[#5E6675]/70 transition-colors focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15 disabled:bg-[#F6F7F9] disabled:text-[#5E6675]'

export function Field({
  label,
  hint,
  error,
  className = '',
  children,
}: {
  label: string
  hint?: string
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
        {label}
      </span>
      {children}
      {error ? (
        <span className="text-xs font-medium text-[#B91C1C]">{error}</span>
      ) : hint ? (
        <span className="text-xs text-[#5E6675]">{hint}</span>
      ) : null}
    </label>
  )
}

export function TextInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${baseInputClasses} ${className}`} {...props} />
}

export function SelectInput({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${baseInputClasses} ${className}`} {...props} />
}

export function TextArea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${baseInputClasses} min-h-[96px] resize-y ${className}`} {...props} />
}
