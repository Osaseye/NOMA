import { Link } from 'react-router-dom'
import type { Category } from '../../types/commerce'

export function CategoryFilters({ categories, activeId }: { categories: Category[]; activeId?: string }) {
  return (
    <div className="catalog-tools">
      {categories.map((category) => (
        <Link className={category.id === activeId ? 'active' : ''} key={category.id} to={`/category/${category.id}`}>
          {category.label}
        </Link>
      ))}
    </div>
  )
}
