import type { ReactNode } from 'react'
import { Image as ImageIcon } from '@phosphor-icons/react'

interface ImagePlaceholderProps {
  label?: string
  aspectRatio?: string
  className?: string
  variant?: 'skeleton' | 'warm-canvas'
  icon?: ReactNode
}

export function ImagePlaceholder({
  label = 'Product Image',
  aspectRatio = 'aspect-square',
  className = '',
  variant = 'warm-canvas',
  icon,
}: ImagePlaceholderProps) {
  const surface =
    variant === 'skeleton'
      ? 'bg-[#EEF0F4] animate-pulse'
      : 'bg-[#F6F7F9]'

  return (
    <div
      className={`group relative flex w-full items-center justify-center overflow-hidden rounded-[6px] border border-[#E5E7EB] ${aspectRatio} ${surface} ${className}`}
    >
      <div className="flex flex-col items-center gap-1.5 text-[#5E6675]">
        {icon || <ImageIcon size={20} weight="regular" className="opacity-70" />}
        {label ? (
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#5E6675]">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default ImagePlaceholder
