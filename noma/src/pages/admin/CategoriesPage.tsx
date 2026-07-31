import { AdminTitle } from '../../components/admin/AdminTitle'
import { CategoryMarkupGrid } from '../../features/product-management/CategoryMarkupGrid'
import { categories } from '../../mock/commerce'

export function CategoriesPage() {
  return (
    <>
      <AdminTitle title="Categories" detail="Default markups reflect the pricing psychology in the PRD." />
      <CategoryMarkupGrid categories={categories} />
    </>
  )
}
