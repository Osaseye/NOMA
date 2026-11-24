import { useState } from 'react'
import { MagnifyingGlass, Plus, Star, Trash, X } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { EmptyState } from '../../design-system/components/EmptyState'
import { KpiCard } from '../../design-system/components/KpiCard'
import { useProductStore } from '../../store/productStore'

export function ReviewsPage() {
  const { products, reviews, addReview, updateReviewStatus, deleteReview } = useProductStore()

  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProductId, setSelectedProductId] = useState<string>('all')

  const [showAddForm, setShowAddForm] = useState(false)
  const [targetProductId, setTargetProductId] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [rating, setRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewComment, setReviewComment] = useState('')

  const effectiveTargetProductId = targetProductId || products[0]?.id || ''

  const filteredReviews = reviews.filter((r) => {
    if (activeTab !== 'all' && r.status !== activeTab) return false
    if (selectedProductId !== 'all' && r.productId !== selectedProductId) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchAuthor = r.author.toLowerCase().includes(q)
      const matchProduct = r.productName?.toLowerCase().includes(q)
      const matchComment = r.comment.toLowerCase().includes(q)
      if (!matchAuthor && !matchProduct && !matchComment) return false
    }
    return true
  })

  const totalCount = reviews.length
  const approvedCount = reviews.filter((r) => r.status === 'approved').length
  const pendingCount = reviews.filter((r) => r.status === 'pending').length
  const avgScore =
    approvedCount > 0
      ? (
          reviews
            .filter((r) => r.status === 'approved')
            .reduce((acc, r) => acc + r.rating, 0) / approvedCount
        ).toFixed(1)
      : '5.0'

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!effectiveTargetProductId || !authorName.trim() || !reviewComment.trim()) return

    const productObj = products.find((p) => p.id === effectiveTargetProductId)

    addReview({
      productId: effectiveTargetProductId,
      productName: productObj?.name || 'Product',
      author: authorName.trim(),
      rating,
      title: reviewTitle.trim() || undefined,
      comment: reviewComment.trim(),
      verifiedPurchase: true,
      status: 'approved',
    })

    setAuthorName('')
    setReviewTitle('')
    setReviewComment('')
    setRating(5)
    setShowAddForm(false)
    toast.success('Review published.')
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      <AdminTitle
        title="Reviews"
        detail="Moderate product ratings and customer testimonials."
        action={
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={14} weight="bold" />
            <span>Add Review</span>
          </button>
        }
      />

      {/* Open Monochrome Metrics Row */}
      <div className="grid grid-cols-2 border-b border-slate-200 pb-4 sm:grid-cols-4">
        <KpiCard label="Total Reviews" value={`${totalCount}`} subtitle="All submissions" />
        <KpiCard label="Published" value={`${approvedCount}`} subtitle="Visible on store" />
        <KpiCard label="Pending" value={`${pendingCount}`} subtitle="Awaiting review" />
        <KpiCard label="Average Score" value={`${avgScore} / 5`} subtitle="Approved ratings" />
      </div>

      {/* Inline Add Review Drawer */}
      {showAddForm ? (
        <form
          onSubmit={handleCreateReview}
          className="space-y-4 border-b border-slate-200 pb-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950">
              New Verified Review
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-950"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600">Product *</label>
              <select
                required
                value={effectiveTargetProductId}
                onChange={(e) => setTargetProductId(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
              >
                {products.length === 0 ? (
                  <option value="">No products available</option>
                ) : (
                  products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Customer *</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Adebayo O."
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Rating *</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-950 focus:border-slate-950 focus:outline-none"
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="mb-1 block text-xs font-medium text-slate-600">Comment *</label>
              <input
                type="text"
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Customer feedback..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-950"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!effectiveTargetProductId}
              className="rounded-lg bg-slate-950 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              Publish
            </button>
          </div>
        </form>
      ) : null}

      {/* Filter Toolbar */}
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 lg:flex-row lg:items-center">
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'approved', 'pending', 'rejected'] as const).map((tab) => {
            const isActive = activeTab === tab
            const count =
              tab === 'all' ? reviews.length : reviews.filter((r) => r.status === tab).length
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                  isActive
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-500 hover:bg-[#F4F4F5] hover:text-slate-950'
                }`}
              >
                {tab} ({count})
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlass
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search author or comment..."
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-950 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none"
            />
          </div>

          <select
            aria-label="Filter reviews by product"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 focus:border-slate-950 focus:outline-none"
          >
            <option value="all">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Compact Single-Layer Reviews List */}
      {filteredReviews.length === 0 ? (
        <EmptyState
          icon={<Star size={22} weight="regular" />}
          title="No reviews found"
          detail="Customer reviews submitted on product pages appear here for moderation."
        />
      ) : (
        <div className="divide-y divide-slate-200">
          {filteredReviews.map((rev) => {
            const productMatch = products.find((p) => p.id === rev.productId)
            return (
              <div
                key={rev.id}
                className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-slate-950">{rev.author}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="font-semibold tabular-nums text-slate-900">
                      {rev.rating} / 5 ★
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="truncate font-medium text-slate-600">
                      {productMatch?.name || rev.productName || rev.productId}
                    </span>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600">{rev.comment}</p>
                </div>

                <div className="flex shrink-0 items-center gap-2 text-xs">
                  <span className="text-[11px] font-semibold capitalize text-slate-400">
                    {rev.status}
                  </span>
                  {rev.status !== 'approved' ? (
                    <button
                      type="button"
                      onClick={() => {
                        updateReviewStatus(rev.id, 'approved')
                        toast.success('Review approved')
                      }}
                      className="rounded-md bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
                    >
                      Approve
                    </button>
                  ) : null}
                  {rev.status !== 'rejected' ? (
                    <button
                      type="button"
                      onClick={() => {
                        updateReviewStatus(rev.id, 'rejected')
                        toast.info('Review hidden')
                      }}
                      className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-slate-950"
                    >
                      Hide
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      deleteReview(rev.id)
                      toast.success('Review deleted')
                    }}
                    aria-label="Delete review"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:border-slate-950 hover:text-slate-950"
                  >
                    <Trash size={13} />
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
