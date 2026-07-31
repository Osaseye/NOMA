import { Card } from '../../design-system/components/Card'
import type { Category } from '../../types/commerce'

export function CategoryMarkupGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="pricing-grid">
      {categories.map((category) => (
        <Card key={category.id}>
          <h2>{category.label}</h2>
          <strong>{category.defaultMarkupPercent}% default markup</strong>
          <p>{category.merchandisingLine}</p>
        </Card>
      ))}
    </div>
  )
}
