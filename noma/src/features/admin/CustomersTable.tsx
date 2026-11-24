import { useState } from 'react'
import { MagnifyingGlass, Trash, User, WhatsappLogo } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { brand } from '../../constants/brand'
import { EmptyState } from '../../design-system/components/EmptyState'
import { KpiCard } from '../../design-system/components/KpiCard'
import { useProductStore } from '../../store/productStore'
import type { Customer } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const { setCustomers } = useProductStore()
  const [filterType, setFilterType] = useState<'all' | 'registered' | 'guest'>('all')
  const [search, setSearch] = useState('')
  const [dismissedIds, setDismissedIds] = useState<string[]>([])

  const visibleCustomers = customers.filter((c) => !dismissedIds.includes(c.id))
  const registeredCustomers = visibleCustomers.filter((c) => !c.isGuest)
  const guestCustomers = visibleCustomers.filter((c) => c.isGuest)

  const filtered = visibleCustomers.filter((c) => {
    if (filterType === 'registered' && c.isGuest) return false
    if (filterType === 'guest' && !c.isGuest) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        c.phone.includes(search)
      )
    }
    return true
  })

  const whatsappBaseDigits = brand.whatsappNumber.replace(/\D/g, '')

  const handleDeleteUser = (user: Customer) => {
    setDismissedIds((prev) => [...prev, user.id])
    setCustomers(customers.filter((c) => c.id !== user.id))
    toast.success(`Removed "${user.name}"`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Open Monochrome Metrics Row */}
      <div className="grid grid-cols-3 border-b border-slate-200 pb-4">
        <KpiCard
          label="Total Users"
          value={`${visibleCustomers.length}`}
          subtitle="All shoppers"
        />
        <KpiCard
          label="Registered"
          value={`${registeredCustomers.length}`}
          subtitle="Account holders"
        />
        <KpiCard
          label="Guests"
          value={`${guestCustomers.length}`}
          subtitle="Guest checkouts"
        />
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1.5">
          {(
            [
              { key: 'all', label: 'All', count: visibleCustomers.length },
              { key: 'registered', label: 'Registered', count: registeredCustomers.length },
              { key: 'guest', label: 'Guest', count: guestCustomers.length },
            ] as const
          ).map((tab) => {
            const isActive = filterType === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilterType(tab.key)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-500 hover:bg-[#F4F4F5] hover:text-slate-950'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            )
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <MagnifyingGlass
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, or phone..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-950 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none"
          />
        </div>
      </div>

      {/* Compact Single-Layer Users Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<User size={22} weight="regular" />}
          title="No user records found"
          detail="Shopper signups and completed storefront checkouts populate this directory automatically."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-2.5 pr-4">User</th>
                <th className="py-2.5 px-3">Phone</th>
                <th className="hidden py-2.5 px-3 sm:table-cell">Type</th>
                <th className="py-2.5 px-3 text-right">Orders</th>
                <th className="py-2.5 px-3 text-right">Lifetime Spend</th>
                <th className="py-2.5 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((c) => {
                const customerPhoneDigits = c.phone?.replace(/\D/g, '')
                const waTarget =
                  customerPhoneDigits && customerPhoneDigits.length >= 10
                    ? customerPhoneDigits.startsWith('0')
                      ? `234${customerPhoneDigits.slice(1)}`
                      : customerPhoneDigits
                    : whatsappBaseDigits

                return (
                  <tr key={c.id} className="transition-colors hover:bg-[#F4F4F5]/50">
                    <td className="py-3 pr-4">
                      <div className="font-bold text-slate-950">{c.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {c.email || 'No email on file'}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">
                      {c.phone}
                    </td>

                    <td className="hidden py-3 px-3 sm:table-cell">
                      <span className="text-[11px] font-medium text-slate-500">
                        {c.isGuest ? 'Guest' : 'Account'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-semibold tabular-nums text-slate-700">
                      {c.orders}
                    </td>

                    <td className="py-3 px-3 text-right font-bold tabular-nums text-slate-950">
                      {formatNaira(c.lifetimeValue)}
                    </td>

                    <td className="py-3 pl-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={`https://wa.me/${waTarget}?text=${encodeURIComponent(
                            `Hello ${c.name}, thank you for shopping with Noma.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Message on WhatsApp"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-slate-950 hover:text-slate-950"
                        >
                          <WhatsappLogo size={14} />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(c)}
                          title="Remove user record"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:border-slate-950 hover:text-slate-950"
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
      )}
    </div>
  )
}
