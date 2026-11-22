import { useState } from 'react'
import {
  CheckCircle,
  MagnifyingGlass,
  Plus,
  Star,
  Trash,
  X,
  XCircle,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { EmptyState } from '../../design-system/components/EmptyState'
import { KpiCard } from '../../design-system/components/KpiCard'
import { useProductStore } from '../../store/productStore'

const inputClass =
  'w-full rounded-[6px] border border-[#D1D5DB] bg-white p-2.5 text-xs font-medium text-[#0B1220] placeholder:text-[#5E6675]/70 transition-colors focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15'

export function ReviewsPage() {
  const { products, reviews, addReview, updateReviewStatus, deleteReview } = useProductStore()

  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProductId, setSelectedProductId] = useState<string>('all')

  const [showAddModal, setShowAddModal] = useState(false)
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

  const handleCreateCuratedReview = (e: React.FormEvent) => {
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
    setShowAddModal(false)
    toast.success('Verified review published.')
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      <AdminTitle
        title="Product Reviews & Testimonials"
        detail="Moderate customer product ratings, approve pending submissions, and curate verified buyer feedback."
        action={
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
          >
            <Plus size={15} weight="regular" />
            <span>Add Curated Review</span>
          </button>
        }
      />

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard
          label="Total Reviews"
          value={`${totalCount}`}
          tone="cobalt"
          subtitle="All catalog submissions"
        />
        <KpiCard
          label="Published"
          value={`${approvedCount}`}
          tone="success"
          subtitle="Live on storefront"
        />
        <KpiCard
          label="Pending"
          value={`${pendingCount}`}
          tone="amber"
          subtitle="Awaiting moderation"
        />
        <KpiCard
          label="Satisfaction"
          value={`${avgScore} / 5`}
          tone="ink"
          subtitle="Approved average score"
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E7EB] pb-3">
        {(['all', 'approved', 'pending', 'rejected'] as const).map((tab) => {
          const isActive = activeTab === tab
          const count =
            tab === 'all' ? reviews.length : reviews.filter((r) => r.status === tab).length
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-[6px] px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                isActive
                  ? 'bg-[#0B1220] text-white'
                  : 'border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F6F7F9] hover:text-[#0B1220]'
              }`}
            >
              {tab === 'all' ? 'All Reviews' : tab}{' '}
              <span className={`font-mono ${isActive ? 'text-white/80' : 'text-[#5E6675]'}`}>
                ({count})
              </span>
            </button>
          )
        })}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <div className="relative w-full flex-1">
          <MagnifyingGlass
            size={16}
            weight="regular"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5E6675]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews by customer name, product, or comment..."
            className="w-full rounded-[6px] border border-[#D1D5DB] bg-white py-2 pl-9 pr-4 text-xs text-[#0B1220] placeholder:text-[#5E6675]/70 focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
          />
        </div>

        <select
          aria-label="Filter reviews by product"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="w-full rounded-[6px] border border-[#D1D5DB] bg-white p-2 text-xs font-semibold text-[#0B1220] focus:border-[#1049EB] focus:outline-none sm:w-64"
        >
          <option value="all">All Products</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add Review Panel */}
      {showAddModal ? (
        <form
          onSubmit={handleCreateCuratedReview}
          className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6"
        >
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.06em] text-[#0B1220]">
              Curate Verified Product Review
            </h3>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="rounded-[6px] p-1 text-[#5E6675] hover:bg-[#F6F7F9] hover:text-[#0B1220]"
            >
              <X size={16} weight="regular" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                Target Product *
              </label>
              <select
                required
                value={effectiveTargetProductId}
                onChange={(e) => setTargetProductId(e.target.value)}
                className={inputClass}
              >
                {products.length === 0 ? (
                  <option value="">No products found. Add products first.</option>
                ) : (
                  products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                Customer Author Name *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Adebayo O."
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                Star Rating (1 - 5) *
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className={`${inputClass} font-mono font-semibold`}
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                Review Headline
              </label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Solid build quality and fast Lagos delivery"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                Review Comment *
              </label>
              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write authentic customer testimonial..."
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 border-t border-[#E5E7EB] pt-3">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="rounded-[6px] border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#374151] hover:bg-[#F6F7F9]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!effectiveTargetProductId}
              className="rounded-[6px] bg-[#0B1220] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B] disabled:opacity-50"
            >
              Publish Verified Review
            </button>
          </div>
        </form>
      ) : null}

      {/* Reviews Cards List */}
      {filteredReviews.length === 0 ? (
        <EmptyState
          icon={<Star size={24} weight="regular" />}
          title="No Product Reviews Found"
          detail="Customer reviews submitted on product pages or curated by operators appear here for moderation."
          action={
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E293B]"
            >
              <Plus size={15} weight="regular" />
              <span>Add First Review</span>
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredReviews.map((rev) => {
            const productMatch = products.find((p) => p.id === rev.productId)
            return (
              <article
                key={rev.id}
                className="flex flex-col justify-between gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#D1D5DB]"
              >
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-[#0B1220]">{rev.author}</span>
                    {rev.verifiedPurchase ? (
                      <span className="rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#15803D]">
                        Verified
                      </span>
                    ) : null}
                    <span className="font-mono text-[11px] text-[#5E6675]">- {rev.date}</span>
                  </div>

                  <span className="inline-block max-w-full truncate rounded-[4px] border border-[#E5E7EB] bg-[#F6F7F9] px-2 py-0.5 text-[11px] font-medium text-[#374151]">
                    Product: {productMatch?.name || rev.productName || rev.productId}
                  </span>

                  <div className="flex items-center gap-2 pt-0.5">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          weight={star <= rev.rating ? 'fill' : 'regular'}
                          className={star <= rev.rating ? 'text-[#FEB719]' : 'text-[#D1D5DB]'}
                        />
                      ))}
                    </div>
                    {rev.title ? (
                      <h5 className="truncate text-xs font-bold text-[#0B1220]">{rev.title}</h5>
                    ) : null}
                  </div>

                  <p className="line-clamp-3 text-xs leading-relaxed text-[#374151]">
                    {rev.comment}
                  </p>
                </div>

                {/* Status Badge & Moderator Actions */}
                <div className="flex items-center justify-between gap-2 border-t border-[#E5E7EB] pt-3">
                  <span
                    className={`rounded-[4px] border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                      rev.status === 'approved'
                        ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]'
                        : rev.status === 'pending'
                        ? 'border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]'
                        : 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'
                    }`}
                  >
                    {rev.status}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {rev.status !== 'approved' ? (
                      <button
                        type="button"
                        onClick={() => {
                          updateReviewStatus(rev.id, 'approved')
                          toast.success('Review approved.')
                        }}
                        className="inline-flex items-center gap-1 rounded-[6px] border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-1 text-[11px] font-semibold text-[#15803D] transition-colors hover:bg-[#15803D] hover:text-white"
                      >
                        <CheckCircle size={13} weight="regular" />
                        <span>Approve</span>
                      </button>
                    ) : null}
                    {rev.status !== 'rejected' ? (
                      <button
                        type="button"
                        onClick={() => {
                          updateReviewStatus(rev.id, 'rejected')
                          toast.info('Review hidden from storefront.')
                        }}
                        className="inline-flex items-center gap-1 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-2.5 py-1 text-[11px] font-semibold text-[#374151] transition-colors hover:bg-[#EEF0F4]"
                      >
                        <XCircle size={13} weight="regular" />
                        <span>Hide</span>
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        deleteReview(rev.id)
                        toast.success('Review deleted.')
                      }}
                      aria-label="Delete review"
                      className="rounded-[6px] border border-[#FECACA] bg-[#FEF2F2] p-1.5 text-[#B91C1C] transition-colors hover:bg-[#B91C1C] hover:text-white"
                    >
                      <Trash size={13} weight="regular" />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
