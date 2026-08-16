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
      {/* Account Type Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setFilterType('all')}
          className={`rounded-2xl border p-5 text-left transition-all ${
            filterType === 'all'
              ? 'border-slate-900 bg-slate-900 text-white shadow-md'
              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider opacity-70">Total Customers Directory</span>
          <div className="mt-2 font-['Outfit'] font-black text-3xl">{customers.length}</div>
          <span className="mt-1 block text-[11px] font-medium opacity-80">All shoppers processed</span>
        </button>

        <button
          onClick={() => setFilterType('registered')}
          className={`rounded-2xl border p-5 text-left transition-all ${
            filterType === 'registered'
              ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider opacity-70">Registered Account Users</span>
            <HiUserPlus size={20} />
          </div>
          <div className="mt-2 font-['Outfit'] font-black text-3xl">{registeredCustomers.length}</div>
          <span className="mt-1 block text-[11px] font-medium opacity-80">Signed-up Noma accounts</span>
        </button>

        <button
          onClick={() => setFilterType('guest')}
          className={`rounded-2xl border p-5 text-left transition-all ${
            filterType === 'guest'
              ? 'border-amber-500 bg-amber-500 text-white shadow-md'
              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider opacity-70">Guest Checkout Orders</span>
            <HiUserMinus size={20} />
          </div>
          <div className="mt-2 font-['Outfit'] font-black text-3xl">{guestCustomers.length}</div>
          <span className="mt-1 block text-[11px] font-medium opacity-80">One-time guest order users</span>
        </button>
      </div>

      {/* Directory Table or Empty State */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                filterType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({customers.length})
            </button>
            <button
              onClick={() => setFilterType('registered')}
              className={`rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                filterType === 'registered' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Registered Accounts ({registeredCustomers.length})
            </button>
            <button
              onClick={() => setFilterType('guest')}
              className={`rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                filterType === 'guest' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Guest Checkout ({guestCustomers.length})
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-1">
              <HiUser size={28} />
            </div>
            <span className="font-bold text-sm text-slate-900">No Customer Records Found</span>
            <span className="text-xs text-slate-400 max-w-sm">
              Customer directory is scrubbed clean for backend API integration. Incoming shopper signups and checkouts will populate here.
            </span>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-extrabold uppercase text-slate-500 text-[10px] tracking-wider">
                <th className="p-4">Customer Name</th>
                <th className="p-4">Account Type</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Orders Count</th>
                <th className="p-4">Lifetime Spend Value</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${
                          c.isGuest ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {c.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{c.name}</span>
                        <span className="text-[10px] text-slate-400">{c.email || 'No email provided'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {c.isGuest ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase text-amber-800">
                        <HiUserMinus size={13} /> Guest Checkout
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-800">
                        <HiUserPlus size={13} /> Registered Account
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <HiPhone size={13} className="text-slate-400" /> {c.phone}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase text-slate-700">
                      <HiShoppingBag size={12} /> {c.orders} Orders
                    </span>
                  </td>
                  <td className="p-4 font-black text-emerald-700">{formatNaira(c.lifetimeValue)}</td>
                  <td className="p-4 text-right">
                    <a
                      href={`https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(c.name)},%20thank%20you%20for%20shopping%20with%20Noma!`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                    >
                      <HiPhone size={13} /> Chat on WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
