import { PencilSimple, Plus, Tag, Trash } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useProductStore } from '../../store/productStore'
import type { Category } from '../../types/commerce'

export function CategoryMarkupGrid({ categories }: { categories: Category[] }) {
  const { deleteCategory, products } = useProductStore()

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={<Tag size={22} weight="regular" />}
        title="No categories created yet"
        detail="Create your first category to organize products and default markup percentages."
        action={
          <Link
            to="/admin/categories/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={14} weight="bold" />
            <span>Create Category</span>
          </Link>
        }
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <th className="py-2.5 pr-4">Category</th>
            <th className="hidden py-2.5 px-3 md:table-cell">Subcategories</th>
            <th className="py-2.5 px-3 text-right">Products</th>
            <th className="py-2.5 px-3 text-right">Default Markup</th>
            <th className="py-2.5 pl-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {categories.map((cat) => {
            const productCount = products.filter((p) => p.category === cat.id).length
            const subs = cat.subcategories || []

            return (
              <tr key={cat.id} className="transition-colors hover:bg-[#F4F4F5]/50">
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="h-10 w-10 shrink-0 rounded-lg bg-[#F4F4F5] object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F4F5] font-bold text-slate-600">
                        {cat.label[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <Link
                        to={`/admin/categories/${cat.id}/edit`}
                        className="font-bold text-slate-950 hover:underline"
                      >
                        {cat.label}
                      </Link>
                      <div className="line-clamp-1 max-w-xs text-[11px] text-slate-400">
                        {cat.merchandisingLine}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="hidden py-3.5 px-3 md:table-cell">
                  {subs.length === 0 ? (
                    <span className="text-slate-400">None</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {subs.slice(0, 4).map((s) => (
                        <span
                          key={s.id}
                          className="rounded-md bg-[#F4F4F5] px-2 py-0.5 text-[11px] font-medium text-slate-700"
                        >
                          {s.label}
                        </span>
                      ))}
                      {subs.length > 4 ? (
                        <span className="text-[11px] text-slate-400">
                          +{subs.length - 4} more
                        </span>
                      ) : null}
                    </div>
                  )}
                </td>

                <td className="py-3.5 px-3 text-right font-semibold tabular-nums text-slate-700">
                  {productCount}
                </td>

                <td className="py-3.5 px-3 text-right font-bold tabular-nums text-slate-950">
                  +{cat.defaultMarkupPercent}%
                </td>

                <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5">
                    <Link
                      to={`/admin/categories/${cat.id}/edit`}
                      className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-900 transition-colors hover:border-slate-950"
                    >
                      <PencilSimple size={13} />
                      <span>Edit</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        deleteCategory(cat.id)
                        toast.success(`Category "${cat.label}" removed`)
                      }}
                      aria-label={`Delete ${cat.label}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition-colors hover:border-slate-950 hover:text-slate-950"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
