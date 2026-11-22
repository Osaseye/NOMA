import { useState } from 'react'
import {
  ArrowUpRight,
  CheckCircle,
  CloudArrowUp,
  Fire,
  HardDrives,
  Image as ImageIcon,
  Megaphone,
  Plus,
  Sparkle,
  Trash,
  UploadSimple,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { storageService } from '../../services/firebase/storageService'
import {
  useAdminStore,
  type SiteSettings,
  type StorageProviderType,
} from '../../store/adminStore'
import { useProductStore } from '../../store/productStore'
import { formatNaira } from '../../utils/pricing'

const publicPageOptions = [
  { label: 'All Products Catalog', value: '/catalog' },
  { label: 'Electronics Category', value: '/category/electronics' },
  { label: 'Home Appliances Category', value: '/category/appliances' },
  { label: 'Kitchen & Dining Category', value: '/category/kitchen' },
  { label: 'Phones & Tablets Category', value: '/category/phones' },
  { label: 'Cooking Materials Category', value: '/category/cooking' },
  { label: 'Bicycles & Mobility Category', value: '/category/bicycles' },
  { label: 'Wines & Spirits Category', value: '/category/wines' },
  { label: 'General Goods Category', value: '/category/general' },
  { label: 'Clothing & Apparel Category', value: '/category/clothing' },
  { label: 'WhatsApp Order Page', value: '/whatsapp-order' },
  { label: 'Track My Order Page', value: '/track-order' },
]

const inputClass =
  'w-full rounded-[6px] border border-[#D1D5DB] bg-white p-2.5 text-xs font-medium text-[#0B1220] placeholder:text-[#5E6675]/70 transition-colors focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15'

const labelClass =
  'mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]'

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
    'banners' | 'deals' | 'trending' | 'announcement' | 'storage'
  >('banners')

  // Draft overrides merged over live Firestore settings
  const [draft, setDraft] = useState<Partial<SiteSettings>>({})

  const allProductsBannerPreview =
    draft.allProductsBannerImage ?? settings.allProductsBannerImage ?? ''
  const announcementText = draft.announcementText ?? settings.announcementText
  const announcementActive = draft.announcementActive ?? settings.announcementActive
  const whatsappNumber = draft.whatsappNumber ?? settings.whatsappNumber
  const supportPhone = draft.supportPhone ?? settings.supportPhone
  const storageProvider: StorageProviderType =
    draft.storageProvider ?? settings.storageProvider ?? 'firebase'
  const cloudinaryCloudName = draft.cloudinaryCloudName ?? settings.cloudinaryCloudName ?? ''
  const cloudinaryUploadPreset =
    draft.cloudinaryUploadPreset ?? settings.cloudinaryUploadPreset ?? ''
  const cloudflareUploadEndpoint =
    draft.cloudflareUploadEndpoint ??
    settings.cloudflareUploadEndpoint ??
    '/api/media/upload'
  const cloudflarePublicUrl = draft.cloudflarePublicUrl ?? settings.cloudflarePublicUrl ?? ''

  const [allProductsSavedSuccess, setAllProductsSavedSuccess] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [storageSavedSuccess, setStorageSavedSuccess] = useState(false)

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
    const toastId = toast.loading('Uploading banner image to storage...')
    try {
      const downloadUrl = await storageService.uploadImage(file, 'banners')
      setDraft((prev) => ({ ...prev, allProductsBannerImage: downloadUrl }))
      updateSettings({ allProductsBannerImage: downloadUrl })
      setAllProductsSavedSuccess(true)
      toast.success('Catalog header banner updated.', { id: toastId })
      setTimeout(() => setAllProductsSavedSuccess(false), 3000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload banner'
      console.error('Failed to upload banner:', err)
      toast.error(message, { id: toastId })
    }
  }

  const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const toastId = toast.loading('Uploading hero banner to storage...')
    try {
      const downloadUrl = await storageService.uploadImage(file, 'hero-banners')
      setNewBannerImageUrl(downloadUrl)
      toast.success('Banner image uploaded.', { id: toastId })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload hero banner'
      console.error('Failed to upload hero banner:', err)
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
    toast.success('Landing page banner added.')
  }

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({
      announcementText,
      announcementActive,
      whatsappNumber,
      supportPhone,
    })
    setDraft((prev) => ({
      ...prev,
      announcementText: undefined,
      announcementActive: undefined,
      whatsappNumber: undefined,
      supportPhone: undefined,
    }))
    setSavedSuccess(true)
    toast.success('Storefront announcement and contact settings saved.')
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleSaveStorageSettings = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({
      storageProvider,
      cloudinaryCloudName: cloudinaryCloudName.trim(),
      cloudinaryUploadPreset: cloudinaryUploadPreset.trim(),
      cloudflareUploadEndpoint: cloudflareUploadEndpoint.trim() || '/api/media/upload',
      cloudflarePublicUrl: cloudflarePublicUrl.trim(),
    })
    setDraft((prev) => ({
      ...prev,
      storageProvider: undefined,
      cloudinaryCloudName: undefined,
      cloudinaryUploadPreset: undefined,
      cloudflareUploadEndpoint: undefined,
      cloudflarePublicUrl: undefined,
    }))
    setStorageSavedSuccess(true)
    toast.success(`Image storage engine updated to ${storageProvider.toUpperCase()}.`)
    setTimeout(() => setStorageSavedSuccess(false), 3000)
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      <AdminTitle
        title="Storefront Settings & Media Control"
        detail="Configure landing page hero banners, catalog header imagery, featured deals, announcement bar, and active storage engine."
      />

      {/* Tabs Header */}
      <div className="flex flex-wrap gap-2 border-b border-[#E5E7EB] pb-3">
        {(
          [
            {
              key: 'banners',
              label: `Banners (${settings.heroBanners.length})`,
              Icon: ImageIcon,
            },
            {
              key: 'deals',
              label: `Today's Deals (${settings.todaysDealsProductIds.length})`,
              Icon: Fire,
            },
            {
              key: 'trending',
              label: `Trending (${settings.trendingProductIds.length})`,
              Icon: Sparkle,
            },
            {
              key: 'announcement',
              label: 'Announcement & Contact',
              Icon: Megaphone,
            },
            {
              key: 'storage',
              label: `Storage Engine (${storageProvider.toUpperCase()})`,
              Icon: HardDrives,
            },
          ] as const
        ).map(({ key, label, Icon }) => {
          const isActive = activeTab === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`inline-flex items-center gap-2 rounded-[6px] px-3.5 py-2 text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-[#0B1220] text-white'
                  : 'border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F6F7F9] hover:text-[#0B1220]'
              }`}
            >
              <Icon size={15} weight="regular" />
              <span>{label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: BANNERS */}
      {activeTab === 'banners' ? (
        <div className="flex flex-col gap-6">
          {/* All Products Catalog Header Banner */}
          <section className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-[#0B1220]">
                  <ImageIcon size={18} weight="regular" className="text-[#1049EB]" />
                  <span>&quot;All Products&quot; Catalog Header Banner</span>
                </h3>
                <p className="mt-0.5 text-xs text-[#5E6675]">
                  Header image displayed on the storefront All Products catalog page.
                </p>
              </div>
              <span className="rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#15803D]">
                Live Control
              </span>
            </div>

            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
              <div className="md:col-span-5 lg:col-span-4">
                <span className={labelClass}>Current Banner Preview</span>
                <div className="relative h-44 w-full overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9]">
                  <img
                    src={
                      allProductsBannerPreview ||
                      settings.allProductsBannerImage ||
                      '/images/catalog-banner-all.png'
                    }
                    alt="All Products Catalog Banner"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 rounded-[4px] bg-[#0B1220]/80 px-2 py-1 font-mono text-[10px] font-semibold text-white">
                    Catalog Header Preview
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:col-span-7 lg:col-span-8">
                <label className={labelClass}>Upload New Catalog Banner Image</label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-dashed border-[#D1D5DB] bg-[#F6F7F9] p-5 text-xs font-semibold text-[#0B1220] transition-colors hover:border-[#1049EB] hover:bg-[#EEF3FE]/50">
                  <UploadSimple size={18} weight="regular" className="text-[#1049EB]" />
                  <span>Upload &quot;All Products&quot; Banner Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAllProductsBannerUpload}
                    className="hidden"
                  />
                </label>

                {allProductsSavedSuccess ? (
                  <div className="flex items-center gap-2 rounded-[6px] border border-[#BBF7D0] bg-[#F0FDF4] p-3 text-xs font-semibold text-[#15803D]">
                    <CheckCircle size={16} weight="regular" />
                    <span>All Products banner updated live on storefront.</span>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div>
              <h2 className="text-base font-bold tracking-tight text-[#0B1220]">
                Landing Page &amp; Featured Collections Banners
              </h2>
              <p className="mt-0.5 text-xs text-[#5E6675]">
                Configure editorial collection slides and destination links on the homepage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddBanner(!showAddBanner)}
              className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
            >
              <Plus size={15} weight="regular" />
              <span>Add Landing Page Banner</span>
            </button>
          </div>

          {showAddBanner ? (
            <form
              onSubmit={handleCreateBanner}
              className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6"
            >
              <h3 className="border-b border-[#E5E7EB] pb-3 text-xs font-bold uppercase tracking-[0.06em] text-[#0B1220]">
                Configure New Banner
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Banner Heading Title *</label>
                  <input
                    type="text"
                    required
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    placeholder="e.g. Modern Kitchen & Dining"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Banner Subtitle</label>
                  <input
                    type="text"
                    value={newBannerSubtitle}
                    onChange={(e) => setNewBannerSubtitle(e.target.value)}
                    placeholder="e.g. High-efficiency appliances for Nigerian homes"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Badge Tag</label>
                  <input
                    type="text"
                    value={newBannerBadge}
                    onChange={(e) => setNewBannerBadge(e.target.value)}
                    placeholder="e.g. Curated Collection"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Target Page Link</label>
                  <select
                    value={newBannerTargetUrl}
                    onChange={(e) => setNewBannerTargetUrl(e.target.value)}
                    className={inputClass}
                  >
                    {publicPageOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Upload Banner Image File *</label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-4 py-2 text-xs font-semibold text-[#0B1220] hover:bg-[#EEF0F4]">
                    <UploadSimple size={15} weight="regular" className="text-[#1049EB]" />
                    <span>Choose Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-[#5E6675]">Or paste an image URL below:</span>
                </div>
                <input
                  type="text"
                  value={newBannerImageUrl}
                  onChange={(e) => setNewBannerImageUrl(e.target.value)}
                  placeholder="/images/editorial-smart.png or https://..."
                  className={`${inputClass} mt-2`}
                />
              </div>

              {newBannerImageUrl ? (
                <div className="h-32 w-full max-w-sm overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9]">
                  <img
                    src={newBannerImageUrl}
                    alt="Banner Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}

              <div className="flex justify-end gap-2.5 border-t border-[#E5E7EB] pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddBanner(false)}
                  className="rounded-[6px] border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#374151] hover:bg-[#F6F7F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-[6px] bg-[#0B1220] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1E293B]"
                >
                  Save &amp; Publish Banner
                </button>
              </div>
            </form>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {settings.heroBanners.map((banner) => (
              <article
                key={banner.id}
                className="flex flex-col gap-3 overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white p-4"
              >
                <div className="relative h-40 w-full overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9]">
                  <img
                    src={banner.imageUrl || '/images/catalog-banner-all.png'}
                    alt={banner.title}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-2.5 top-2.5 rounded-[4px] bg-[#0B1220] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-white">
                    {banner.badge}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0B1220]">{banner.title}</h4>
                  <p className="mt-0.5 text-xs text-[#5E6675]">{banner.subtitle}</p>
                </div>
                <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-2.5 text-xs">
                  <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-[#1049EB]">
                    <ArrowUpRight size={13} weight="regular" />
                    <span>{banner.targetUrl}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      deleteHeroBanner(banner.id)
                      toast.success('Banner removed.')
                    }}
                    className="inline-flex items-center gap-1 font-semibold text-[#B91C1C] hover:underline"
                  >
                    <Trash size={13} weight="regular" />
                    <span>Remove</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {/* TAB 2: TODAY'S DEALS */}
      {activeTab === 'deals' ? (
        <div className="flex flex-col gap-6">
          <section className="flex flex-col justify-between gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <span className="rounded-[4px] border border-[#FDE68A] bg-[#FFFBEB] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#B45309]">
                Live Countdown Control
              </span>
              <h3 className="mt-2 text-sm font-bold text-[#0B1220]">
                Today&apos;s Best Deals Expiration Timer
              </h3>
              <p className="mt-0.5 text-xs text-[#5E6675]">
                Set the exact date and time for the storefront countdown timer.
              </p>
            </div>
            <div className="shrink-0">
              <input
                type="datetime-local"
                aria-label="Deals countdown expiration timestamp"
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
                    toast.success('Deals countdown timer updated.')
                  }
                }}
                className="cursor-pointer rounded-[6px] border border-[#D1D5DB] bg-[#F6F7F9] px-3 py-2.5 font-mono text-xs font-semibold text-[#0B1220] focus:border-[#1049EB] focus:bg-white focus:outline-none"
              />
            </div>
          </section>

          <section className="rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <h3 className="text-sm font-bold text-[#0B1220]">
              Select Products for &quot;Today&apos;s Best Deals&quot;
            </h3>
            <p className="mb-4 mt-0.5 text-xs text-[#5E6675]">
              Click any SKU to feature or remove it from the homepage spotlight deals grid.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const isSelected = settings.todaysDealsProductIds.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleDealProduct(p.id)}
                    className={`flex items-center justify-between gap-3 rounded-[8px] border p-3 text-left transition-colors ${
                      isSelected
                        ? 'border-[#1049EB] bg-[#EEF3FE]/60'
                        : 'border-[#E5E7EB] bg-white hover:bg-[#F6F7F9]'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={p.image || '/images/catalog-banner-all.png'}
                        alt={p.name}
                        className="h-10 w-10 shrink-0 rounded-[6px] border border-[#E5E7EB] bg-white object-contain p-1"
                      />
                      <div className="min-w-0">
                        <h4 className="line-clamp-1 text-xs font-semibold text-[#0B1220]">
                          {p.name}
                        </h4>
                        <span className="font-mono text-[11px] font-bold text-[#1049EB]">
                          {formatNaira(p.finalPrice)}
                        </span>
                      </div>
                    </div>
                    <CheckCircle
                      size={20}
                      weight={isSelected ? 'fill' : 'regular'}
                      className={`shrink-0 ${isSelected ? 'text-[#1049EB]' : 'text-[#D1D5DB]'}`}
                    />
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      ) : null}

      {/* TAB 3: TRENDING COLLECTIONS */}
      {activeTab === 'trending' ? (
        <section className="rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
          <h3 className="text-sm font-bold text-[#0B1220]">
            Select Products for &quot;Trending Now&quot;
          </h3>
          <p className="mb-4 mt-0.5 text-xs text-[#5E6675]">
            Selected SKUs populate the storefront horizontal trending product rail.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => {
              const isTrending = settings.trendingProductIds.includes(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleTrendingProduct(p.id)}
                  className={`flex items-center justify-between gap-3 rounded-[8px] border p-3 text-left transition-colors ${
                    isTrending
                      ? 'border-[#1049EB] bg-[#EEF3FE]/60'
                      : 'border-[#E5E7EB] bg-white hover:bg-[#F6F7F9]'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={p.image || '/images/catalog-banner-all.png'}
                      alt={p.name}
                      className="h-10 w-10 shrink-0 rounded-[6px] border border-[#E5E7EB] bg-white object-contain p-1"
                    />
                    <div className="min-w-0">
                      <h4 className="line-clamp-1 text-xs font-semibold text-[#0B1220]">
                        {p.name}
                      </h4>
                      <span className="font-mono text-[11px] font-bold text-[#1049EB]">
                        {formatNaira(p.finalPrice)}
                      </span>
                    </div>
                  </div>
                  <CheckCircle
                    size={20}
                    weight={isTrending ? 'fill' : 'regular'}
                    className={`shrink-0 ${isTrending ? 'text-[#1049EB]' : 'text-[#D1D5DB]'}`}
                  />
                </button>
              )
            })}
          </div>
        </section>
      ) : null}

      {/* TAB 4: ANNOUNCEMENT & CONTACT */}
      {activeTab === 'announcement' ? (
        <form
          onSubmit={handleSaveAnnouncement}
          className="flex max-w-3xl flex-col gap-5 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6"
        >
          {savedSuccess ? (
            <div className="flex items-center gap-2 rounded-[6px] border border-[#BBF7D0] bg-[#F0FDF4] p-3 text-xs font-semibold text-[#15803D]">
              <CheckCircle size={16} weight="regular" />
              <span>Storefront announcement and contact settings saved.</span>
            </div>
          ) : null}

          <div className="flex flex-col gap-2 border-b border-[#E5E7EB] pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                Top Announcement Strip Copy
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#374151]">
                <input
                  type="checkbox"
                  checked={announcementActive}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, announcementActive: e.target.checked }))
                  }
                  className="h-4 w-4 rounded-[4px] border-[#D1D5DB] text-[#1049EB] focus:ring-[#1049EB]"
                />
                <span>Active on Storefront</span>
              </label>
            </div>
            <input
              type="text"
              value={announcementText}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, announcementText: e.target.value }))
              }
              placeholder="Transparent Naira pricing across Nigeria - delivery fees confirmed before checkout."
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>WhatsApp Support Number</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, whatsappNumber: e.target.value }))
                }
                placeholder="2348030006662"
                className={`${inputClass} font-mono`}
              />
            </div>
            <div>
              <label className={labelClass}>Support Phone Line</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, supportPhone: e.target.value }))
                }
                placeholder="+234 803 000 6662"
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-fit rounded-[6px] bg-[#0B1220] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
          >
            Save Site Settings
          </button>
        </form>
      ) : null}

      {/* TAB 5: STORAGE ENGINE SELECTOR */}
      {activeTab === 'storage' ? (
        <form
          onSubmit={handleSaveStorageSettings}
          className="flex max-w-3xl flex-col gap-6 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6"
        >
          <div className="border-b border-[#E5E7EB] pb-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#0B1220]">
              <HardDrives size={18} weight="regular" className="text-[#1049EB]" />
              <span>Image Storage Service Provider</span>
            </h3>
            <p className="mt-1 text-xs text-[#5E6675]">
              Select which backend handles image uploads for product galleries, categories, and banners.
            </p>
          </div>

          {storageSavedSuccess ? (
            <div className="flex items-center gap-2 rounded-[6px] border border-[#BBF7D0] bg-[#F0FDF4] p-3 text-xs font-semibold text-[#15803D]">
              <CheckCircle size={16} weight="regular" />
              <span>Storage engine settings updated and synced live.</span>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Firebase Card */}
            <button
              type="button"
              onClick={() => setDraft((prev) => ({ ...prev, storageProvider: 'firebase' }))}
              className={`flex flex-col gap-3 rounded-[8px] border p-4 text-left transition-colors ${
                storageProvider === 'firebase'
                  ? 'border-[#1049EB] bg-[#EEF3FE]/50 ring-1 ring-[#1049EB]'
                  : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="rounded-[4px] border border-[#FDE68A] bg-[#FFFBEB] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#B45309]">
                  Default
                </span>
                {storageProvider === 'firebase' ? (
                  <CheckCircle size={18} weight="fill" className="text-[#1049EB]" />
                ) : null}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0B1220]">Firebase Storage</h4>
                <p className="mt-1 text-[11px] leading-relaxed text-[#5E6675]">
                  Google Cloud Storage integrated directly with Firebase Auth SDK.
                </p>
              </div>
            </button>

            {/* Cloudinary Card */}
            <button
              type="button"
              onClick={() => setDraft((prev) => ({ ...prev, storageProvider: 'cloudinary' }))}
              className={`flex flex-col gap-3 rounded-[8px] border p-4 text-left transition-colors ${
                storageProvider === 'cloudinary'
                  ? 'border-[#1049EB] bg-[#EEF3FE]/50 ring-1 ring-[#1049EB]'
                  : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="rounded-[4px] bg-[#EEF3FE] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#1049EB]">
                  25GB Free
                </span>
                {storageProvider === 'cloudinary' ? (
                  <CheckCircle size={18} weight="fill" className="text-[#1049EB]" />
                ) : null}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0B1220]">Cloudinary</h4>
                <p className="mt-1 text-[11px] leading-relaxed text-[#5E6675]">
                  Automatic WebP optimization and unsigned upload presets.
                </p>
              </div>
            </button>

            {/* Cloudflare R2 Card */}
            <button
              type="button"
              onClick={() => setDraft((prev) => ({ ...prev, storageProvider: 'cloudflare_r2' }))}
              className={`flex flex-col gap-3 rounded-[8px] border p-4 text-left transition-colors ${
                storageProvider === 'cloudflare_r2'
                  ? 'border-[#1049EB] bg-[#EEF3FE]/50 ring-1 ring-[#1049EB]'
                  : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#15803D]">
                  $0 Egress
                </span>
                {storageProvider === 'cloudflare_r2' ? (
                  <CheckCircle size={18} weight="fill" className="text-[#1049EB]" />
                ) : null}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0B1220]">Cloudflare R2</h4>
                <p className="mt-1 text-[11px] leading-relaxed text-[#5E6675]">
                  Zero egress bandwidth fees via authenticated Cloudflare Worker upload endpoint.
                </p>
              </div>
            </button>
          </div>

          {/* Conditional Cloudinary Credentials */}
          {storageProvider === 'cloudinary' ? (
            <div className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-5">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.06em] text-[#0B1220]">
                <CloudArrowUp size={16} weight="regular" className="text-[#1049EB]" />
                <span>Cloudinary Unsigned Upload Credentials</span>
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Cloud Name</label>
                  <input
                    type="text"
                    value={cloudinaryCloudName}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, cloudinaryCloudName: e.target.value }))
                    }
                    placeholder="e.g. noma-store"
                    className={`${inputClass} font-mono`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Unsigned Upload Preset</label>
                  <input
                    type="text"
                    value={cloudinaryUploadPreset}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, cloudinaryUploadPreset: e.target.value }))
                    }
                    placeholder="e.g. noma_unsigned"
                    className={`${inputClass} font-mono`}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {/* Conditional Cloudflare R2 Credentials */}
          {storageProvider === 'cloudflare_r2' ? (
            <div className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-5">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.06em] text-[#0B1220]">
                <CloudArrowUp size={16} weight="regular" className="text-[#1049EB]" />
                <span>Cloudflare R2 Worker Configuration</span>
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="cf-upload-endpoint"
                    className={labelClass}
                  >
                    Cloudflare Worker Upload Endpoint
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
                    className={`${inputClass} font-mono`}
                  />
                </div>
                <div>
                  <label htmlFor="cf-public-url" className={labelClass}>
                    Public R2 CDN URL
                  </label>
                  <input
                    id="cf-public-url"
                    type="text"
                    value={cloudflarePublicUrl}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, cloudflarePublicUrl: e.target.value }))
                    }
                    placeholder="https://media.shopnoma.com"
                    className={`${inputClass} font-mono`}
                  />
                </div>
              </div>
              <p className="text-[11px] text-[#5E6675]">
                Uploads stream via Firebase ID token verification to your R2 bucket (`NOMA_MEDIA`) and return the public asset URL.
              </p>
            </div>
          ) : null}

          <button
            type="submit"
            className="w-fit rounded-[6px] bg-[#0B1220] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
          >
            Apply &amp; Save Storage Settings
          </button>
        </form>
      ) : null}
    </div>
  )
}
