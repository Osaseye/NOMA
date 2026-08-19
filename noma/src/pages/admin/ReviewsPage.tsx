import { useState } from 'react'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { useProductStore } from '../../store/productStore'
import {
  HiStar,
  HiCheckCircle,
  HiXCircle,
  HiTrash,
  HiPlus,
  HiMagnifyingGlass,
  HiChatBubbleBottomCenterText,
  HiSparkles,
  HiFunnel,
} from 'react-icons/hi2'

export function ReviewsPage() {
  const { products, reviews, addReview, updateReviewStatus, deleteReview } = useProductStore()

  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProductId, setSelectedProductId] = useState<string>('all')

  // New Admin Curated Review Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [targetProductId, setTargetProductId] = useState(products[0]?.id || '')
  const [authorName, setAuthorName] = useState('')
  const [rating, setRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewComment, setReviewComment] = useState('')

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

  // Metrics
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
    if (!targetProductId || !authorName || !reviewComment) return

    const productObj = products.find((p) => p.id === targetProductId)

    addReview({
      productId: targetProductId,
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
  }

  return (
    <div className="flex flex-col gap-8 pb-12 font-['Outfit',sans-serif]">
      <AdminTitle
        title="Product Reviews & Customer Testimonials Management"
        detail="Moderate customer product ratings, approve pending customer reviews, or curate verified feedback to boost store conversion."
      />

      {/* Top Metrics Row - 2 Column Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Total Reviews</span>
            <HiChatBubbleBottomCenterText size={18} className="text-blue-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{totalCount}</div>
          <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 block truncate">Catalog products</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Published</span>
            <HiCheckCircle size={18} className="text-emerald-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">{approvedCount}</div>
          <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 block truncate">Live on store</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Pending</span>
            <HiFunnel size={18} className="text-amber-500 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600">{pendingCount}</div>
          <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 block truncate">Needs review</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Satisfaction</span>
            <HiStar size={18} className="text-amber-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1">
            <span>{avgScore}</span>
            <span className="text-xs text-amber-500">★</span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 block truncate">5-star rating</span>
        </div>
      </div>

      {/* Control Header & Add Review Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
          {(['all', 'approved', 'pending', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 uppercase tracking-wider transition-all capitalize ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-xs font-black'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab === 'all' ? 'All Reviews' : tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700 transition-all shrink-0"
        >
          <HiPlus size={16} />
          <span>Add Curated Product Review</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews by customer name, product, or comment..."
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
          />
          <HiMagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="w-full sm:w-64 rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
        >
          <option value="all">All Products</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <form onSubmit={handleCreateCuratedReview} className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 flex flex-col gap-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <h3 className="text-xs font-extrabold uppercase text-emerald-900 flex items-center gap-2">
              <HiSparkles className="text-emerald-600" size={16} />
              <span>Curate Verified Product Review</span>
            </h3>
            <button type="button" onClick={() => setShowAddModal(false)} className="text-xs text-slate-400 hover:text-slate-700">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-600">Select Target Product *</label>
              <select
                required
                value={targetProductId}
                onChange={(e) => setTargetProductId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold bg-white mt-1"
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
              <label className="text-[11px] font-bold uppercase text-slate-600">Customer Author Name *</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Chief Adebayo O."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold mt-1"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-600">Star Rating (1 - 5) *</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold bg-white mt-1 text-amber-600"
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★☆</option>
                <option value={3}>3 Stars ★★★☆☆</option>
                <option value={2}>2 Stars ★★☆☆☆</option>
                <option value={1}>1 Star ★☆☆☆☆</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-600">Review Headline / Summary</label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Excellent packaging & swift delivery!"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-bold uppercase text-slate-600">Detailed Review Comment *</label>
              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write authentic customer testimonial body..."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700"
            >
              Publish Verified Review
            </button>
          </div>
        </form>
      )}

      {/* Reviews Cards List or Empty State - 2 Column Format */}
      {filteredReviews.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-1">
            <HiStar size={28} />
          </div>
          <h4 className="font-extrabold text-base text-slate-900">No Product Reviews Found</h4>
          <p className="text-xs text-slate-400 max-w-sm font-medium">
            Customer reviews submitted from product detail pages or curated by operators will appear here for moderation.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700"
          >
            <HiPlus size={16} /> Add First Product Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((rev) => {
            const productMatch = products.find((p) => p.id === rev.productId)
            return (
              <div
                key={rev.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between gap-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-black text-slate-900">{rev.author}</span>
                    {rev.verifiedPurchase && (
                      <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[9px] font-extrabold uppercase">
                        Verified
                      </span>
                    )}
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-bold">{rev.date}</span>
                  </div>

                  <span className="inline-block rounded-lg bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-bold truncate max-w-full">
                    Target: {productMatch?.name || rev.productName || rev.productId}
                  </span>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <HiStar
                          key={star}
                          size={14}
                          className={star <= rev.rating ? 'text-amber-400' : 'text-slate-200'}
                        />
                      ))}
                    </div>
                    {rev.title && <h5 className="text-xs font-extrabold text-slate-900 truncate">{rev.title}</h5>}
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">{rev.comment}</p>
                </div>

                {/* Status Badge & Moderator Actions */}
                <div className="flex items-center justify-between gap-2 border-t pt-3 border-slate-100">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                      rev.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rev.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {rev.status}
                  </span>

                  <div className="flex items-center gap-1">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => updateReviewStatus(rev.id, 'approved')}
                        className="flex items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-colors"
                      >
                        <HiCheckCircle size={13} /> Approve
                      </button>
                    )}
                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => updateReviewStatus(rev.id, 'rejected')}
                        className="flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        <HiXCircle size={13} /> Hide
                      </button>
                    )}
                    <button
                      onClick={() => deleteReview(rev.id)}
                      className="rounded-xl border border-rose-200 bg-rose-50 p-1 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                    >
                      <HiTrash size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
