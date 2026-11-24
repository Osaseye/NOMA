import { Plus } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { CategoryMarkupGrid } from '../../features/product-management/CategoryMarkupGrid'
import { useProductStore } from '../../store/productStore'

export function CategoriesPage() {
  const { categories } = useProductStore()

  return (
    <div className="flex flex-col gap-5 pb-12">
      <AdminTitle
        title="Categories & Markups"
        detail="Manage product departments, subcategories, and default markup percentages."
        action={
          <Link
            to="/admin/categories/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <Plus size={14} weight="bold" />
            <span>Add Category</span>
          </Link>
        }
      />
      <CategoryMarkupGrid categories={categories} />
    </div>
  )
}
