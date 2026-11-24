import { useState } from 'react'
import {
  Buildings,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Trash,
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { EmptyState } from '../../design-system/components/EmptyState'
import { KpiCard } from '../../design-system/components/KpiCard'
import { useProductStore } from '../../store/productStore'
import { useSupplierStore } from '../../store/supplierStore'
import { formatNaira } from '../../utils/pricing'

export function SuppliersPage() {
  const { suppliers, deleteSupplier } = useSupplierStore()
  const { products } = useProductStore()
  const [searchQuery, setSearchQuery] = useState('')

  const supplierStats = suppliers.map((sup) => {
    const sourcedProducts = products.filter(
      (p) => p.supplierId === sup.id || p.supplierName?.toLowerCase() === sup.name.toLowerCase()
    )
    const totalUnits = sourcedProducts.reduce((acc, p) => acc + (p.stockQty || 0), 0)
    const totalOwedBaseCost = sourcedProducts.reduce(
      (acc, p) => acc + (p.basePrice || 0) * (p.stockQty || 0),
      0
    )
    return {
      supplier: sup,
      sourcedProducts,
      totalUnits,
      totalOwedBaseCost,
    }
  })

  const totalPayableCostAcrossAll = supplierStats.reduce(
    (acc, s) => acc + s.totalOwedBaseCost,
    0
  )
  const linkedProductsCount = products.filter((p) => p.supplierId || p.supplierName).length

  const filteredStats = supplierStats.filter((s) => {
    const q = searchQuery.toLowerCase()
    return (
      s.supplier.name.toLowerCase().includes(q) ||
      s.supplier.contactPerson.toLowerCase().includes(q) ||
      s.supplier.phone.includes(searchQuery)
    )
  })

  return (
    <div className="flex flex-col gap-6 pb-12">
      <AdminTitle
        title="Suppliers"
        detail="Manage vendor partners, sourcing terms, and inventory base costs."
        action={
          <Link
            to="/admin/suppliers/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <Plus size={14} weight="bold" />
            <span>Add Supplier</span>
          </Link>
        }
      />

      {/* Open Monochrome Metrics Row */}
      <div className="grid grid-cols-3 border-b border-slate-200 pb-4">
        <KpiCard
          label="Active Suppliers"
          value={`${suppliers.length}`}
          subtitle="Vendor partners"
        />
        <KpiCard
          label="Inventory Base Cost"
          value={formatNaira(totalPayableCostAcrossAll)}
          subtitle="Sourcing valuation"
        />
        <KpiCard
          label="Linked SKUs"
          value={`${linkedProductsCount}`}
          subtitle="Assigned products"
        />
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="relative w-full max-w-md">
          <MagnifyingGlass
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search suppliers by company, contact, or phone..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-950 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none"
          />
        </div>
      </div>

      {/* Compact Single-Surface Suppliers Table */}
      {filteredStats.length === 0 ? (
        <EmptyState
          icon={<Buildings size={22} weight="regular" />}
          title={searchQuery ? 'No suppliers match your search' : 'No suppliers added yet'}
          detail="Add your sourcing partners to track inventory base costs and payables."
          action={
            !searchQuery ? (
              <Link
                to="/admin/suppliers/new"
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                <Plus size={14} weight="bold" />
                <span>Add First Supplier</span>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-2.5 pr-4">Supplier</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="hidden py-2.5 px-3 md:table-cell">Terms</th>
                <th className="py-2.5 px-3 text-right">SKUs</th>
                <th className="py-2.5 px-3 text-right">Sourcing Cost</th>
                <th className="py-2.5 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStats.map(
                ({ supplier, sourcedProducts, totalUnits, totalOwedBaseCost }) => (
                  <tr key={supplier.id} className="transition-colors hover:bg-[#F4F4F5]/50">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F4F4F5] text-xs font-bold text-slate-700">
                          {supplier.logo || supplier.image ? (
                            <img
                              src={supplier.logo || supplier.image}
                              alt={supplier.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            supplier.name.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/admin/suppliers/${supplier.id}/edit`}
                            className="font-bold text-slate-950 hover:underline"
                          >
                            {supplier.name}
                          </Link>
                          {supplier.address ? (
                            <div className="line-clamp-1 max-w-xs text-[11px] text-slate-400">
                              {supplier.address}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-900">
                        {supplier.contactPerson}
                      </div>
                      <div className="text-[11px] text-slate-500">{supplier.phone}</div>
                    </td>

                    <td className="hidden py-3.5 px-3 text-slate-600 md:table-cell">
                      {supplier.paymentTerms || 'Standard'}
                    </td>

                    <td className="py-3.5 px-3 text-right font-semibold tabular-nums text-slate-700">
                      {sourcedProducts.length} ({totalUnits} units)
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold tabular-nums text-slate-950">
                      {formatNaira(totalOwedBaseCost)}
                    </td>

                    <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/admin/suppliers/${supplier.id}/edit`}
                          className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-900 hover:border-slate-950"
                        >
                          <PencilSimple size={13} />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await deleteSupplier(supplier.id)
                              toast.success(`Supplier "${supplier.name}" deleted`)
                            } catch {
                              toast.error('Failed to delete supplier')
                            }
                          }}
                          aria-label={`Delete ${supplier.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:border-slate-950 hover:text-slate-950"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
