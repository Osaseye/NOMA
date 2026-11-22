import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  surface?: 'canvas' | 'surface'
}

const paddingClasses = {
  none: '',
  sm: 'p-3.5 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
}

export function Card({
  children,
  className = '',
  padding = 'md',
  surface = 'canvas',
}: CardProps) {
  const bg = surface === 'surface' ? 'bg-[#F6F7F9]' : 'bg-white'
  return (
    <section
      className={`rounded-[8px] border border-[#E5E7EB] ${bg} ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </section>
  )
}
