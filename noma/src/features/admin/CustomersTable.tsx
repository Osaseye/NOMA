import { useState } from 'react'
import { HiPhone, HiShoppingBag, HiUser, HiUserPlus, HiUserMinus } from 'react-icons/hi2'
import type { Customer } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'
import { brand } from '../../constants/brand'

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const [filterType, setFilterType] = useState<'all' | 'registered' | 'guest'>('all')

  const registeredCustomers = customers.filter((c) => !c.isGuest)
  const guestCustomers = customers.filter((c) => c.isGuest)

  const filtered = customers.filter((c) => {
    if (filterType === 'registered') return !c.isGuest
    if (filterType === 'guest') return Boolean(c.isGuest)
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Account Type Summary Metric Cards - 2 Column Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <button
          onClick={() => setFilterType('all')}
          className={`rounded-2xl border p-3.5 sm:p-5 text-left transition-all ${
            filterType === 'all'
              ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider opacity-70">Total Customers</span>
          <div className="mt-2 font-['Outfit'] font-black text-xl sm:text-3xl">{customers.length}</div>
          <span className="mt-1 block text-[10px] font-medium opacity-80 truncate">All shoppers</span>
        </button>

        <button
          onClick={() => setFilterType('registered')}
          className={`rounded-2xl border p-3.5 sm:p-5 text-left transition-all ${
            filterType === 'registered'
              ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider opacity-70">Registered</span>
            <HiUserPlus size={16} className="hidden sm:block" />
          </div>
          <div className="mt-2 font-['Outfit'] font-black text-xl sm:text-3xl">{registeredCustomers.length}</div>
          <span className="mt-1 block text-[10px] font-medium opacity-80 truncate">Signed-up accounts</span>
        </button>

        <button
          onClick={() => setFilterType('guest')}
          className={`col-span-2 lg:col-span-1 rounded-2xl border p-3.5 sm:p-5 text-left transition-all ${
            filterType === 'guest'
              ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider opacity-70">Guest Checkouts</span>
            <HiUserMinus size={16} className="hidden sm:block" />
          </div>
          <div className="mt-2 font-['Outfit'] font-black text-xl sm:text-3xl">{guestCustomers.length}</div>
          <span className="mt-1 block text-[10px] font-medium opacity-80 truncate">One-time guest users</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilterType('all')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
            filterType === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All ({customers.length})
        </button>
        <button
          onClick={() => setFilterType('registered')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
            filterType === 'registered' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Registered ({registeredCustomers.length})
        </button>
        <button
          onClick={() => setFilterType('guest')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
            filterType === 'guest' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Guest ({guestCustomers.length})
        </button>
      </div>

      {/* Directory 2-Column Cards Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center gap-2 shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-1">
            <HiUser size={28} />
          </div>
          <span className="font-bold text-sm text-slate-900">No Customer Records Found</span>
          <span className="text-xs text-slate-400 max-w-sm">
            Customer directory is scrubbed clean for backend API integration. Incoming shopper signups and checkouts will populate here.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-3">
                {/* Header: Avatar, Name, Email, Badge */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                        c.isGuest ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {c.name ? c.name[0].toUpperCase() : 'U'}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{c.name}</h3>
                      <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {c.email || 'No email registered'}
                      </span>
                    </div>
                  </div>

                  {c.isGuest ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[9px] font-black uppercase text-amber-800 shrink-0">
                      <HiUserMinus size={11} /> Guest
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[9px] font-black uppercase text-emerald-800 shrink-0">
                      <HiUserPlus size={11} /> Account
                    </span>
                  )}
                </div>

                {/* Info Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Phone Number</span>
                    <span className="font-bold text-slate-700 flex items-center gap-1 mt-0.5">
                      <HiPhone size={12} className="text-slate-400 shrink-0" /> {c.phone}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Orders Completed</span>
                    <span className="font-bold text-slate-700 flex items-center gap-1 mt-0.5">
                      <HiShoppingBag size={12} className="text-slate-400 shrink-0" /> {c.orders} Orders
                    </span>
                  </div>
                </div>

                {/* Spend value pill */}
                <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Lifetime Spend Value</span>
                  <span className="text-base font-black text-emerald-700">{formatNaira(c.lifetimeValue)}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <a
                  href={`https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(c.name)},%20thank%20you%20for%20shopping%20with%20Noma!`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 px-3 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-95 transition-all"
                >
                  <HiPhone size={13} /> Chat on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
