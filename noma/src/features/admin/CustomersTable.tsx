import { useState } from 'react'
import {
  ShoppingBag,
  User,
  UserMinus,
  UserPlus,
  Users,
  WhatsappLogo,
  Phone,
} from '@phosphor-icons/react'
import { brand } from '../../constants/brand'
import { EmptyState } from '../../design-system/components/EmptyState'
import type { Customer } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const [filterType, setFilterType] = useState<'all' | 'registered' | 'guest'>('all')

  const registeredCustomers = customers.filter((c) => !c.isGuest)
  const guestCustomers = customers.filter((c) => c.isGuest)

  const filtered = customers.filter((c) => {
    if (filterType === 'registered') return !c.isGuest
    if (filterType === 'guest') return Boolean(c.isGuest)
    return true
  })

  const whatsappBaseDigits = brand.whatsappNumber.replace(/\D/g, '')

  return (
    <div className="flex flex-col gap-6">
      {/* Clickable Summary Filter Tiles */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`relative overflow-hidden rounded-[8px] border bg-white p-4 text-left transition-colors sm:p-5 ${
            filterType === 'all'
              ? 'border-[#1049EB] bg-[#EEF3FE]/40 ring-1 ring-[#1049EB]'
              : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
          }`}
        >
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-[#0B1220]" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
              Total Customers
            </span>
            <Users size={16} weight="regular" className="text-[#0B1220]" />
          </div>
          <div className="mt-2 font-mono tabular-nums text-2xl font-bold text-[#0B1220]">
            {customers.length}
          </div>
          <span className="mt-1 block truncate text-xs text-[#5E6675]">All shoppers</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterType('registered')}
          className={`relative overflow-hidden rounded-[8px] border bg-white p-4 text-left transition-colors sm:p-5 ${
            filterType === 'registered'
              ? 'border-[#1049EB] bg-[#EEF3FE]/40 ring-1 ring-[#1049EB]'
              : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
          }`}
        >
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-[#15803D]" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
              Registered Accounts
            </span>
            <UserPlus size={16} weight="regular" className="text-[#15803D]" />
          </div>
          <div className="mt-2 font-mono tabular-nums text-2xl font-bold text-[#0B1220]">
            {registeredCustomers.length}
          </div>
          <span className="mt-1 block truncate text-xs text-[#5E6675]">Signed-up shoppers</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterType('guest')}
          className={`relative col-span-2 overflow-hidden rounded-[8px] border bg-white p-4 text-left transition-colors sm:p-5 lg:col-span-1 ${
            filterType === 'guest'
              ? 'border-[#1049EB] bg-[#EEF3FE]/40 ring-1 ring-[#1049EB]'
              : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
          }`}
        >
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-[#FEB719]" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
              Guest Checkouts
            </span>
            <UserMinus size={16} weight="regular" className="text-[#B45309]" />
          </div>
          <div className="mt-2 font-mono tabular-nums text-2xl font-bold text-[#0B1220]">
            {guestCustomers.length}
          </div>
          <span className="mt-1 block truncate text-xs text-[#5E6675]">One-time checkouts</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E7EB] pb-3">
        {(
          [
            { key: 'all', label: 'All', count: customers.length },
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
              className={`rounded-[6px] px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-[#0B1220] text-white'
                  : 'border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F6F7F9] hover:text-[#0B1220]'
              }`}
            >
              {tab.label}{' '}
              <span className={`font-mono ${isActive ? 'text-white/80' : 'text-[#5E6675]'}`}>
                ({tab.count})
              </span>
            </button>
          )
        })}
      </div>

      {/* Directory 2-Column Cards Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<User size={24} weight="regular" />}
          title="No Customer Records Found"
          detail="Incoming shopper signups and completed storefront checkouts will populate this directory automatically."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((c) => {
            const customerPhoneDigits = c.phone?.replace(/\D/g, '')
            const waTarget =
              customerPhoneDigits && customerPhoneDigits.length >= 10
                ? customerPhoneDigits.startsWith('0')
                  ? `234${customerPhoneDigits.slice(1)}`
                  : customerPhoneDigits
                : whatsappBaseDigits
            return (
              <article
                key={c.id}
                className="flex flex-col justify-between rounded-[8px] border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#D1D5DB]"
              >
                <div className="flex flex-col gap-3.5">
                  {/* Header: Avatar, Name, Email, Badge */}
                  <div className="flex items-start justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border font-mono text-sm font-bold ${
                          c.isGuest
                            ? 'border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]'
                            : 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]'
                        }`}
                      >
                        {c.name ? c.name[0].toUpperCase() : 'U'}
                      </div>
                      <div className="flex min-w-0 flex-col">
                        <h3 className="truncate text-sm font-bold text-[#0B1220]">{c.name}</h3>
                        <span className="truncate text-xs text-[#5E6675]">
                          {c.email || 'No email registered'}
                        </span>
                      </div>
                    </div>

                    {c.isGuest ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-[4px] border border-[#FDE68A] bg-[#FFFBEB] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#B45309]">
                        <UserMinus size={11} weight="regular" />
                        <span>Guest</span>
                      </span>
                    ) : (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#15803D]">
                        <UserPlus size={11} weight="regular" />
                        <span>Account</span>
                      </span>
                    )}
                  </div>

                  {/* Info Stats */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                        Phone Number
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 font-mono font-semibold text-[#0B1220]">
                        <Phone size={12} weight="regular" className="shrink-0 text-[#5E6675]" />
                        <span className="truncate">{c.phone}</span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                        Orders Completed
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 font-mono tabular-nums font-semibold text-[#0B1220]">
                        <ShoppingBag size={12} weight="regular" className="shrink-0 text-[#5E6675]" />
                        <span>{c.orders} Orders</span>
                      </span>
                    </div>
                  </div>

                  {/* Spend value */}
                  <div className="flex items-center justify-between rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] p-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                      Lifetime Spend
                    </span>
                    <span className="font-mono tabular-nums text-base font-bold text-[#15803D]">
                      {formatNaira(c.lifetimeValue)}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 border-t border-[#E5E7EB] pt-3">
                  <a
                    href={`https://wa.me/${waTarget}?text=${encodeURIComponent(
                      `Hello ${c.name}, thank you for shopping with Noma.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#0B1220] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1049EB]"
                  >
                    <WhatsappLogo size={15} weight="fill" className="text-[#25D366]" />
                    <span>Message on WhatsApp</span>
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
