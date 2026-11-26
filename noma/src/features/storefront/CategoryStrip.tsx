import { Bicycle, Storefront } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import type { Category } from '../../types/commerce'

export function CategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <section
      className="flex flex-wrap items-center gap-2.5 border-y border-[#E5E7EB] bg-white px-4 py-4 md:px-8"
      aria-label="Shop by category"
    >
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className="inline-flex items-center gap-2 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-3 py-2 text-xs font-semibold text-[#0B1220] transition-colors hover:border-[#1049EB] hover:bg-white hover:text-[#1049EB]"
        >
          {category.id === 'bicycles' ? (
            <Bicycle size={16} weight="regular" className="text-[#1049EB]" />
          ) : (
            <Storefront size={16} weight="regular" className="text-[#1049EB]" />
          )}
          <span>{category.label}</span>
        </Link>
      ))}
    </section>
  )
}
