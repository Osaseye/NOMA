import { AdminTitle } from '../../components/admin/AdminTitle'
import { CategoryMarkupGrid } from '../../features/product-management/CategoryMarkupGrid'
import { useProductStore } from '../../store/productStore'

export function CategoriesPage() {
  const { categories } = useProductStore()

  return (
    <div className="flex flex-col gap-6 pb-12">
      <AdminTitle
        title="Category Markups & Merchandising Rules"
        detail="Set category pricing psychology guidelines, default profit markup percentages, and promotional sublines."
      />
      <CategoryMarkupGrid categories={categories} />
    </div>
  )
}
