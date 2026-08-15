import React from 'react';
import { FaRegImage } from 'react-icons/fa';

interface ImagePlaceholderProps {
  label?: string;
  aspectRatio?: string;
  className?: string;
  variant?: 'skeleton' | 'warm-canvas';
  icon?: React.ReactNode;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  label = 'Product Image',
  aspectRatio = 'aspect-square',
  className = '',
  variant = 'warm-canvas',
  icon,
}) => {
  if (variant === 'warm-canvas') {
    return (
      <div
        className={`relative w-full ${aspectRatio} bg-[#EAE8E3] rounded-xl overflow-hidden flex items-center justify-center border border-[#DCD9D0]/60 group ${className}`}
      >
        <div className="flex flex-col items-center gap-1 text-[#8A8477] transition-transform duration-300 group-hover:scale-105">
          {icon || <FaRegImage className="text-xl opacity-70" />}
          {label && (
            <span className="text-[8px] font-bold tracking-wider uppercase">
              {label}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspectRatio} bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-xl overflow-hidden flex items-center justify-center border border-gray-200/60 group ${className}`}
    >
      <div className="flex flex-col items-center gap-1 text-gray-400/70 transition-transform duration-300 group-hover:scale-105">
        {icon || <FaRegImage className="text-xl opacity-60" />}
        {label && (
          <span className="text-[8px] font-bold tracking-wider uppercase">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default ImagePlaceholder;
