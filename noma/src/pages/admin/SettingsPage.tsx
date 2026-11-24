import { useState } from 'react'
import { Check, Plus, Trash, UploadSimple } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { storageService } from '../../services/firebase/storageService'
import {
  useAdminStore,
  type SiteSettings,
} from '../../store/adminStore'
import { useProductStore } from '../../store/productStore'
import { formatNaira } from '../../utils/pricing'

const publicPageOptions = [
  { label: 'All Products Catalog', value: '/catalog' },
  { label: 'Clothing & Footwear', value: '/category/clothing' },
  { label: 'Kitchen & Dining', value: '/category/kitchen' },
  { label: 'Electronics', value: '/category/electronics' },
  { label: 'Home Appliances', value: '/category/appliances' },
  { label: 'Phones & Tablets', value: '/category/phones' },
  { label: 'WhatsApp Bulk Desk', value: '/whatsapp-order' },
]

export function SettingsPage() {
  const {
    settings,
    updateSettings,
    addHeroBanner,
    deleteHeroBanner,
    toggleDealProduct,
    toggleTrendingProduct,
  } = useAdminStore()
  const { products } = useProductStore()

  const [activeTab, setActiveTab] = useState<
    'storage' | 'curation' | 'banners' | 'contact'
  >('storage')

  const [draft, setDraft] = useState<Partial<SiteSettings>>({})

  const allProductsBannerPreview =
    draft.allProductsBannerImage ?? settings.allProductsBannerImage ?? ''
  const announcementText = draft.announcementText ?? settings.announcementText
  const announcementActive = draft.announcementActive ?? settings.announcementActive
  const whatsappNumber = draft.whatsappNumber ?? settings.whatsappNumber
  const supportPhone = draft.supportPhone ?? settings.supportPhone
  const supportEmail = draft.supportEmail ?? settings.supportEmail ?? 'support@shopnoma.com'
  const cloudflareUploadEndpoint =
    draft.cloudflareUploadEndpoint ??
    settings.cloudflareUploadEndpoint ??
    '/api/media/upload'
  const cloudflarePublicUrl = draft.cloudflarePublicUrl ?? settings.cloudflarePublicUrl ?? ''
  const geminiApiKey = draft.geminiApiKey ?? settings.geminiApiKey ?? ''

  // Banner form state
  const [newBannerTitle, setNewBannerTitle] = useState('')
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('')
  const [newBannerBadge, setNewBannerBadge] = useState('Featured Collection')
  const [newBannerImageUrl, setNewBannerImageUrl] = useState('')
  const [newBannerTargetUrl, setNewBannerTargetUrl] = useState('/catalog')
  const [showAddBanner, setShowAddBanner] = useState(false)

  const handleAllProductsBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const toastId = toast.loading('Uploading catalog banner...')
    try {
      const downloadUrl = await storageService.uploadImage(file, 'banners')
      setDraft((prev) => ({ ...prev, allProductsBannerImage: downloadUrl }))
      updateSettings({ allProductsBannerImage: downloadUrl })
      toast.success('Catalog header banner updated.', { id: toastId })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload banner'
      toast.error(message, { id: toastId })
    }
  }

  const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const toastId = toast.loading('Uploading banner image...')
    try {
      const downloadUrl = await storageService.uploadImage(file, 'hero-banners')
      setNewBannerImageUrl(downloadUrl)
      toast.success('Banner image uploaded.', { id: toastId })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload banner'
      toast.error(message, { id: toastId })
    }
  }

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBannerTitle || !newBannerImageUrl) return
    addHeroBanner({
      title: newBannerTitle,
      subtitle: newBannerSubtitle,
      badge: newBannerBadge,
      imageUrl: newBannerImageUrl,
      targetUrl: newBannerTargetUrl,
      active: true,
    })
    setNewBannerTitle('')
    setNewBannerSubtitle('')
    setNewBannerImageUrl('')
    setShowAddBanner(false)
    toast.success('Collection banner added.')
  }

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({
      announcementText,
      announcementActive,
      whatsappNumber,
      supportPhone,
      supportEmail,
    })
    setDraft((prev) => ({
      ...prev,
      announcementText: undefined,
      announcementActive: undefined,
      whatsappNumber: undefined,
      supportPhone: undefined,
      supportEmail: undefined,
    }))
    toast.success('Contact and announcement settings saved.')
  }

  const handleSaveStorageAndAi = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({
      storageProvider: 'cloudflare_r2',
      cloudflareUploadEndpoint: cloudflareUploadEndpoint.trim() || '/api/media/upload',
      cloudflarePublicUrl: cloudflarePublicUrl.trim(),
      geminiApiKey: geminiApiKey.trim(),
    })
    setDraft((prev) => ({
      ...prev,
      cloudflareUploadEndpoint: undefined,
      cloudflarePublicUrl: undefined,
      geminiApiKey: undefined,
    }))
    toast.success('Cloudflare R2 & Gemini AI pipeline settings saved.')
  }

  return (
    <div className="flex flex-col gap-6 pb-16">
      <AdminTitle
        title="Settings"
        detail="Configure Cloudflare R2 media storage, Gemini AI product pipeline, storefront curation, and contact channels."
      />

      {/* Minimal Monochrome Tabs */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-3">
        {(
          [
            { key: 'storage', label: 'Cloudflare R2 & Gemini AI' },
            { key: 'curation', label: 'Trending & Best Deals' },
            { key: 'banners', label: `Banners (${settings.heroBanners.length})` },
            { key: 'contact', label: 'Store Contact & Top Bar' },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-slate-950 text-white'
                  : 'text-slate-500 hover:bg-[#F4F4F5] hover:text-slate-950'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* TAB 1: CLOUDFLARE R2 & GEMINI AI PIPELINE */}
      {activeTab === 'storage' ? (
        <form onSubmit={handleSaveStorageAndAi} className="max-w-3xl space-y-8">
          {/* Cloudflare R2 Configuration (Only Storage Engine) */}
          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-950">
                Cloudflare R2 Media Storage (`noma-media`)
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                All product photos, studio mockups, category covers, and banners are stored strictly in Cloudflare R2 with zero egress fees, while Cloud Firestore stores catalog and order data.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="cf-upload-endpoint"
                  className="mb-1 block text-xs font-medium text-slate-600"
                >
                  Worker Upload Endpoint
                </label>
                <input
                  id="cf-upload-endpoint"
                  type="text"
                  value={cloudflareUploadEndpoint}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      cloudflareUploadEndpoint: e.target.value,
                    }))
                  }
                  placeholder="/api/media/upload"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="cf-public-url"
                  className="mb-1 block text-xs font-medium text-slate-600"
                >
                  Public R2 Domain / CDN URL (Optional)
                </label>
                <input
                  id="cf-public-url"
                  type="text"
                  value={cloudflarePublicUrl}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      cloudflarePublicUrl: e.target.value,
                    }))
                  }
                  placeholder="https://media.shopnoma.com (or blank for /media/*)"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Gemini AI Product Studio Configuration */}
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <div>
              <h2 className="text-sm font-bold text-slate-950">
                Gemini AI Product Studio Pipeline (4-Key Smart Shuffle Active)
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                4 encrypted Gemini API keys are configured on your Cloudflare Worker (`noma-r2-api`) with smart round-robin shuffling and automatic 60-second rate-limit failover so no single key exhausts itself.
              </p>
            </div>

            <div>
              <label
                htmlFor="gemini-api-key"
                className="mb-1 block text-xs font-medium text-slate-600"
              >
                Optional Override Key (Leave blank to use the 4-key Cloudflare Worker pool)
              </label>
              <input
                id="gemini-api-key"
                type="password"
                value={geminiApiKey}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, geminiApiKey: e.target.value }))
                }
                placeholder="Using 4-key Cloudflare Worker smart-shuffle pool..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
              />
            </div>
          </section>

          <button
            type="submit"
            className="rounded-lg bg-slate-950 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Save Storage &amp; AI Settings
          </button>
        </form>
      ) : null}

      {/* TAB 2: CURATION (TRENDING & TODAY'S DEALS COMBINED CLEANLY) */}
      {activeTab === 'curation' ? (
        <div className="space-y-10">
          {/* Today's Best Deals */}
          <section className="space-y-4">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-bold text-slate-950">
                  Today&apos;s Best Deals ({settings.todaysDealsProductIds.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Select products featured in the homepage deals section and set the countdown end time.
                </p>
              </div>
              <input
                type="datetime-local"
                aria-label="Deals countdown end time"
                value={
                  settings.todaysDealsEndTimestamp
                    ? new Date(
                        settings.todaysDealsEndTimestamp -
                          new Date().getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .slice(0, 16)
                    : ''
                }
                onChange={(e) => {
                  const newTs = new Date(e.target.value).getTime()
                  if (!Number.isNaN(newTs)) {
                    updateSettings({ todaysDealsEndTimestamp: newTs })
                    toast.success('Deals countdown updated.')
                  }
                }}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-950 focus:border-slate-950 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const isSelected = settings.todaysDealsProductIds.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleDealProduct(p.id)}
                    className={`flex items-center justify-between gap-3 rounded-xl border p-2.5 text-left transition-colors ${
                      isSelected
                        ? 'border-slate-950 bg-[#F4F4F5]'
                        : 'border-slate-200 bg-white hover:border-slate-400'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <img
                        src={p.image || '/images/catalog-banner-all.png'}
                        alt={p.name}
                        className="h-9 w-9 shrink-0 rounded-lg bg-[#F4F4F5] object-contain p-1"
                      />
                      <div className="min-w-0">
                        <h4 className="truncate text-xs font-semibold text-slate-950">
                          {p.name}
                        </h4>
                        <span className="text-[11px] font-bold tabular-nums text-slate-500">
                          {formatNaira(p.finalPrice)}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? 'border-slate-950 bg-slate-950 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected ? <Check size={11} weight="bold" /> : null}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Trending Now */}
          <section className="space-y-4 border-t border-slate-200 pt-8">
            <div>
              <h2 className="text-sm font-bold text-slate-950">
                Trending Now ({settings.trendingProductIds.length})
              </h2>
              <p className="text-xs text-slate-500">
                Select products featured in the homepage Trending Now grid.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const isTrending = settings.trendingProductIds.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleTrendingProduct(p.id)}
                    className={`flex items-center justify-between gap-3 rounded-xl border p-2.5 text-left transition-colors ${
                      isTrending
                        ? 'border-slate-950 bg-[#F4F4F5]'
                        : 'border-slate-200 bg-white hover:border-slate-400'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <img
                        src={p.image || '/images/catalog-banner-all.png'}
                        alt={p.name}
                        className="h-9 w-9 shrink-0 rounded-lg bg-[#F4F4F5] object-contain p-1"
                      />
                      <div className="min-w-0">
                        <h4 className="truncate text-xs font-semibold text-slate-950">
                          {p.name}
                        </h4>
                        <span className="text-[11px] font-bold tabular-nums text-slate-500">
                          {formatNaira(p.finalPrice)}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        isTrending
                          ? 'border-slate-950 bg-slate-950 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isTrending ? <Check size={11} weight="bold" /> : null}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      ) : null}

      {/* TAB 3: BANNERS */}
      {activeTab === 'banners' ? (
        <div className="space-y-8">
          {/* Catalog Header Banner */}
          <section className="flex flex-col gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-center">
            <img
              src={
                allProductsBannerPreview ||
                settings.allProductsBannerImage ||
                '/images/catalog-banner-all.png'
              }
              alt="Catalog Header Banner"
              className="h-28 w-full rounded-xl bg-[#F4F4F5] object-cover sm:w-56"
            />
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-slate-950">
                All Products Catalog Header Image
              </h2>
              <p className="text-xs text-slate-500">
                Displayed at the top of the `/catalog` page.
              </p>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 hover:border-slate-950">
                <UploadSimple size={14} />
                <span>Upload New Banner</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAllProductsBannerUpload}
                  className="hidden"
                />
              </label>
            </div>
          </section>

          {/* Editorial Collection Banners */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-950">
                  Featured Collection Banners
                </h2>
                <p className="text-xs text-slate-500">
                  Editorial collection cards displayed on the storefront homepage.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBanner(!showAddBanner)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                <Plus size={14} weight="bold" />
                <span>Add Banner</span>
              </button>
            </div>

            {showAddBanner ? (
              <form
                onSubmit={handleCreateBanner}
                className="space-y-4 border-y border-slate-200 py-5"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBannerTitle}
                      onChange={(e) => setNewBannerTitle(e.target.value)}
                      placeholder="Modern Kitchen & Dining"
                      className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={newBannerSubtitle}
                      onChange={(e) => setNewBannerSubtitle(e.target.value)}
                      placeholder="Commercial blenders and cookware"
                      className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Badge
                    </label>
                    <input
                      type="text"
                      value={newBannerBadge}
                      onChange={(e) => setNewBannerBadge(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Destination Link
                    </label>
                    <select
                      value={newBannerTargetUrl}
                      onChange={(e) => setNewBannerTargetUrl(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
                    >
                      {publicPageOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:border-slate-950">
                    <UploadSimple size={14} />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerFileUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={newBannerImageUrl}
                    onChange={(e) => setNewBannerImageUrl(e.target.value)}
                    placeholder="Or paste image URL..."
                    className="h-9 flex-1 rounded-lg border border-slate-200 px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBanner(false)}
                    className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-slate-950 px-4 py-1.5 text-xs font-semibold text-white"
                  >
                    Save Banner
                  </button>
                </div>
              </form>
            ) : null}

            <div className="divide-y divide-slate-200">
              {settings.heroBanners.map((banner) => (
                <div
                  key={banner.id}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={banner.imageUrl || '/images/catalog-banner-all.png'}
                      alt={banner.title}
                      className="h-12 w-20 shrink-0 rounded-lg bg-[#F4F4F5] object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-950">{banner.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        {banner.subtitle} &bull; {banner.targetUrl}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      deleteHeroBanner(banner.id)
                      toast.success('Banner removed')
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:border-slate-950 hover:text-slate-950"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {/* TAB 4: CONTACT & ANNOUNCEMENT */}
      {activeTab === 'contact' ? (
        <form onSubmit={handleSaveContact} className="max-w-2xl space-y-5">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-medium text-slate-600">
                Top Bar Message
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={announcementActive}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      announcementActive: e.target.checked,
                    }))
                  }
                  className="h-3.5 w-3.5 rounded border-slate-300 text-slate-950 focus:ring-slate-950"
                />
                <span>Active</span>
              </label>
            </div>
            <input
              type="text"
              value={announcementText}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, announcementText: e.target.value }))
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, whatsappNumber: e.target.value }))
                }
                placeholder="2348030006662"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Support Phone
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, supportPhone: e.target.value }))
                }
                placeholder="+234 803 000 6662"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, supportEmail: e.target.value }))
                }
                placeholder="support@shopnoma.com"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-slate-950 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Save Contact Settings
          </button>
        </form>
      ) : null}
    </div>
  )
}
