import { useState } from 'react'
import { ChatCenteredText, MagnifyingGlass, Trash, WhatsappLogo } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { brand } from '../../constants/brand'
import { EmptyState } from '../../design-system/components/EmptyState'
import { KpiCard } from '../../design-system/components/KpiCard'
import { useFeedbackStore } from '../../store/feedbackStore'

export function FeedbackPage() {
  const { items, markStatus, deleteFeedback } = useFeedbackStore()
  const [filter, setFilter] = useState<'all' | 'new' | 'resolved'>('all')
  const [search, setSearch] = useState('')

  const newCount = items.filter((i) => i.status === 'new').length
  const resolvedCount = items.filter((i) => i.status === 'resolved').length

  const filtered = items.filter((i) => {
    if (filter !== 'all' && i.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        i.name.toLowerCase().includes(q) ||
        i.message.toLowerCase().includes(q) ||
        i.topic.toLowerCase().includes(q) ||
        (i.email && i.email.toLowerCase().includes(q)) ||
        (i.phone && i.phone.includes(search))
      )
    }
    return true
  })

  const whatsappBaseDigits = brand.whatsappNumber.replace(/\D/g, '')

  return (
    <div className="flex flex-col gap-6 pb-12">
      <AdminTitle
        title="Feedback"
        detail="Customer messages, wholesale inquiries, and support requests submitted via the Help & Contact form."
      />

      {/* Open Monochrome Metrics */}
      <div className="grid grid-cols-3 border-b border-slate-200 pb-4">
        <KpiCard label="Total Messages" value={`${items.length}`} subtitle="All submissions" />
        <KpiCard label="Open / Unread" value={`${newCount}`} subtitle="Awaiting response" />
        <KpiCard label="Resolved" value={`${resolvedCount}`} subtitle="Completed inquiries" />
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1.5">
          {(
            [
              { id: 'all', label: 'All', count: items.length },
              { id: 'new', label: 'Open', count: newCount },
              { id: 'resolved', label: 'Resolved', count: resolvedCount },
            ] as const
          ).map((tab) => {
            const active = filter === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  active
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
            placeholder="Search feedback..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-950 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none"
          />
        </div>
      </div>

      {/* Single-Layer Compact Feedback List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<ChatCenteredText size={22} weight="regular" />}
          title="No feedback messages"
          detail="When shoppers submit inquiries or feedback on the Help & Support page, they appear here."
        />
      ) : (
        <div className="divide-y divide-slate-200">
          {filtered.map((item) => {
            const phoneDigits = item.phone?.replace(/\D/g, '')
            const waTarget =
              phoneDigits && phoneDigits.length >= 10
                ? phoneDigits.startsWith('0')
                  ? `234${phoneDigits.slice(1)}`
                  : phoneDigits
                : whatsappBaseDigits

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-start"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-slate-950">{item.name}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="font-semibold text-slate-700">{item.topic}</span>
                    {item.phone ? (
                      <>
                        <span className="text-slate-400">&bull;</span>
                        <span className="text-slate-500">{item.phone}</span>
                      </>
                    ) : null}
                    {item.email ? (
                      <>
                        <span className="text-slate-400">&bull;</span>
                        <span className="text-slate-500">{item.email}</span>
                      </>
                    ) : null}
                    <span className="text-[11px] text-slate-400">{item.createdAt}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700">{item.message}</p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {item.phone ? (
                    <a
                      href={`https://wa.me/${waTarget}?text=${encodeURIComponent(
                        `Hello ${item.name}, thank you for contacting Noma regarding "${item.topic}".`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Reply on WhatsApp"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-slate-950 hover:text-slate-950"
                    >
                      <WhatsappLogo size={14} />
                    </a>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => {
                      const next = item.status === 'new' ? 'resolved' : 'new'
                      markStatus(item.id, next)
                      toast.success(
                        next === 'resolved'
                          ? 'Marked as resolved'
                          : 'Reopened feedback'
                      )
                    }}
                    className={`h-8 rounded-md px-2.5 text-[11px] font-semibold transition-colors ${
                      item.status === 'new'
                        ? 'bg-slate-950 text-white hover:bg-slate-800'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-950'
                    }`}
                  >
                    {item.status === 'new' ? 'Mark Resolved' : 'Resolved'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      deleteFeedback(item.id)
                      toast.success('Feedback removed')
                    }}
                    aria-label="Delete feedback"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:border-slate-950 hover:text-slate-950"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
