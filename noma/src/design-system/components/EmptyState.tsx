import { Package } from 'lucide-react'

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="empty-state">
      <Package size={28} />
      <strong>{title}</strong>
      <p>{detail}</p>
    </div>
  )
}
