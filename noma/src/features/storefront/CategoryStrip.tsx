import { Bike, Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Category } from '../../types/commerce'

export function CategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <section className="category-strip" aria-label="Shop by category">
      {categories.map((category) => (
        <Link key={category.id} to={`/category/${category.id}`}>
          {category.id === 'bicycles' ? <Bike size={22} /> : <Store size={22} />}
          <span>{category.label}</span>
        </Link>
      ))}
    </section>
  )
}
