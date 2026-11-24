import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowClockwise, Check, Plus, Trash, UploadSimple } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { storageService } from '../../services/firebase/storageService'
import {
  useAdminStore,
  type SiteSettings,
} from '../../store/adminStore'
import { useProductStore } from '../../store/productStore'
import { formatNaira } from '../../utils/pricing'

interface LiveKeyStatus {
  id: string
  label: string
  masked: string
  source: 'worker' | 'settings'
  status: 'unused' | 'active' | 'swapped' | 'exhausted'
  requests: number
  lastUsedAt: string | null
  cooldownRemainingSec: number
  lastError: string | null
}

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
  const geminiApiKeys = useMemo(
    () => draft.geminiApiKeys ?? settings.geminiApiKeys ?? [],
    [draft.geminiApiKeys, settings.geminiApiKeys]
  )

  // Live Gemini Key Pool State (Key 1..4 on Worker + Key 5..N added here)
  const [liveKeys, setLiveKeys] = useState<LiveKeyStatus[]>([])
  const [loadingKeys, setLoadingKeys] = useState(false)
  const [newApiKeyInput, setNewApiKeyInput] = useState('')

  const fetchLiveKeyStatuses = useCallback(async (extraKeysList: string[]) => {
    setLoadingKeys(true)
    try {
      const headers: Record<string, string> = {}
      if (extraKeysList.length > 0) {
        headers['X-Gemini-Api-Keys'] = extraKeysList.join(',')
      }
      const res = await fetch('https://noma-r2-api.inventra.workers.dev/api/ai/keys-status', {
        headers,
      })
      if (res.ok) {
        const data = (await res.json()) as { keys?: LiveKeyStatus[] }
        if (Array.isArray(data.keys)) {
          setLiveKeys(data.keys)
        }
      }
    } catch {
      // Silently ignore network hiccups
    } finally {
      setLoadingKeys(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab !== 'storage') return
    let cancelled = false
    const headers: Record<string, string> = {}
    if (geminiApiKeys.length > 0) {
      headers['X-Gemini-Api-Keys'] = geminiApiKeys.join(',')
    }
    fetch('https://noma-r2-api.inventra.workers.dev/api/ai/keys-status', { headers })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { keys?: LiveKeyStatus[] } | null) => {
        if (!cancelled && data && Array.isArray(data.keys)) {
          setLiveKeys(data.keys)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [activeTab, geminiApiKeys])

  const handleAddExtraKey = () => {
    const trimmed = newApiKeyInput.trim()
    if (!trimmed) return
    if (geminiApiKeys.includes(trimmed)) {
      toast.info('This API key is already in your pool.')
      return
    }
    const nextKeys = [...geminiApiKeys, trimmed]
    setDraft((prev) => ({ ...prev, geminiApiKeys: nextKeys }))
    updateSettings({ geminiApiKeys: nextKeys })
    setNewApiKeyInput('')
    toast.success(`Added Key ${liveKeys.length + 1} to the smart-shuffle pool.`)
    fetchLiveKeyStatuses(nextKeys)
  }

  const handleRemoveExtraKey = (extraIndex: number) => {
    const nextKeys = geminiApiKeys.filter((_, idx) => idx !== extraIndex)
    setDraft((prev) => ({ ...prev, geminiApiKeys: nextKeys }))
    updateSettings({ geminiApiKeys: nextKeys })
    toast.success('API key removed from pool.')
    fetchLiveKeyStatuses(nextKeys)
  }

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
      cloudflareUploadEndpoint: cloudflareUploadEndpoint.trim() || 'https://noma-r2-api.inventra.workers.dev/api/media/upload',
      cloudflarePublicUrl: cloudflarePublicUrl.trim(),
      geminiApiKeys,
    })
    setDraft((prev) => ({
      ...prev,
      cloudflareUploadEndpoint: undefined,
      cloudflarePublicUrl: undefined,
      geminiApiKeys: undefined,
    }))
    toast.success('Cloudflare R2 & Gemini AI pool settings saved.')
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

          {/* Gemini AI Key Pool Manager (Key 1, Key 2, Key 3, Key 4, Key 5...) */}
          <section className="space-y-4 border-t border-slate-200 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-950">
                  Gemini API Key Pool ({liveKeys.length || 4 + geminiApiKeys.length} Keys)
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Smart shuffle rotates keys automatically across requests and swaps away from any exhausted key.
                </p>
              </div>
              <button
                type="button"
                onClick={() => fetchLiveKeyStatuses(geminiApiKeys)}
                disabled={loadingKeys}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:border-slate-950 hover:text-slate-950 disabled:opacity-50"
              >
                <ArrowClockwise size={13} className={loadingKeys ? 'animate-spin' : ''} />
                <span>Refresh Status</span>
              </button>
            </div>

            {/* Keys Table: Key 1, Key 2, Key 3, Key 4, Key 5... */}
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {liveKeys.map((k) => {
                const statusLabel =
                  k.status === 'exhausted'
                    ? `Exhausted (${k.cooldownRemainingSec}s cooldown)`
                    : k.status === 'swapped'
                    ? 'Swapped / Active Now'
                    : k.status === 'active'
                    ? 'Used & Ready'
                    : 'Not Used Yet'
                const extraIdx =
                  k.source === 'settings'
                    ? Number(k.label.replace(/\D/g, '')) -
                      liveKeys.filter((item) => item.source === 'worker').length -
                      1
                    : -1

                return (
                  <div
                    key={k.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="min-w-[52px] font-bold text-slate-950">{k.label}</span>
                      <span className="font-mono text-[11px] text-slate-400">{k.masked}</span>
                      <span className="text-[11px] text-slate-400">
                        {k.source === 'worker' ? 'Cloudflare Secret' : 'Added Here'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-medium tabular-nums text-slate-500">
                        {k.requests} {k.requests === 1 ? 'use' : 'uses'}
                      </span>
                      <span
                        className={`text-[11px] font-semibold ${
                          k.status === 'exhausted'
                            ? 'text-rose-600'
                            : k.status === 'swapped'
                            ? 'text-slate-950 underline underline-offset-4'
                            : k.status === 'active'
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {statusLabel}
                      </span>
                      {k.source === 'settings' && extraIdx >= 0 ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveExtraKey(extraIdx)}
                          aria-label={`Remove ${k.label}`}
                          className="text-slate-400 hover:text-slate-950"
                        >
                          <Trash size={14} />
                        </button>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Add More Keys (Key 5, Key 6, ...) */}
            <div className="flex flex-col gap-2 pt-1 sm:flex-row">
              <input
                type="password"
                value={newApiKeyInput}
                onChange={(e) => setNewApiKeyInput(e.target.value)}
                placeholder={`Paste Key ${(liveKeys.length || 4) + 1} (AIza... or AQ....)`}
                className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-950 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddExtraKey}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-950 bg-white px-4 text-xs font-semibold text-slate-950 transition-colors hover:bg-slate-950 hover:text-white"
              >
                <Plus size={14} weight="bold" />
                <span>Add Key {(liveKeys.length || 4) + 1}</span>
              </button>
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
