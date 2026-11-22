import { Link } from 'react-router-dom'
import type { Category } from '../../types/commerce'

export function CategoryFilters({
  categories,
  activeId,
}: {
  categories: Category[]
  activeId?: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((category) => {
        const isActive = category.id === activeId
        return (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className={`rounded-[6px] border px-3 py-1.5 text-xs font-semibold transition-colors ${
              isActive
                ? 'border-[#0B1220] bg-[#0B1220] text-white'
                : 'border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F6F7F9] hover:text-[#0B1220]'
            }`}
          >
            {category.label}
          </Link>
        )
      })}
    </div>
  )
}
