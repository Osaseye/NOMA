import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'cobalt' | 'secondary' | 'ghost' | 'text'
export type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#0B1220] text-white border border-transparent hover:bg-[#1E293B]',
  cobalt: 'bg-[#1049EB] text-white border border-transparent hover:bg-[#0D3BC2]',
  secondary: 'bg-white text-[#0B1220] border border-[#E5E7EB] hover:bg-[#F6F7F9] hover:border-[#D1D5DB]',
  ghost: 'bg-transparent text-[#5E6675] border border-transparent hover:text-[#0B1220] hover:bg-[#F6F7F9]',
  text: 'bg-transparent text-[#1049EB] border border-transparent hover:text-[#0D3BC2] hover:underline px-0',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-xs sm:text-sm',
  lg: 'px-5 py-3 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-[6px] font-semibold whitespace-nowrap transition-colors active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1049EB]/20 ${variantClasses[variant]} ${variant === 'text' ? '' : sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
