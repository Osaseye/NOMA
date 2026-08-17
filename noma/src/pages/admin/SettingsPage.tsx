import { useState } from 'react'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { useAdminStore, type StorageProviderType } from '../../store/adminStore'
import { useProductStore } from '../../store/productStore'
import {
  HiSparkles,
  HiPhoto,
  HiFire,
  HiMegaphone,
  HiPlus,
  HiTrash,
  HiCheckCircle,
  HiXCircle,
  HiArrowUpRight,
  HiArrowUpTray,
  HiServer,
  HiCloud,
} from 'react-icons/hi2'
import { formatNaira } from '../../utils/pricing'
import { toast } from 'sonner'
import { storageService } from '../../services/firebase/storageService'

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

export function SettingsPage() {
  const { settings, updateSettings, addHeroBanner, deleteHeroBanner, toggleDealProduct, toggleTrendingProduct } = useAdminStore()
  const { products } = useProductStore()

  const [activeTab, setActiveTab] = useState<'banners' | 'deals' | 'trending' | 'announcement' | 'storage'>('banners')

  // All Products Banner State
  const [allProductsBannerPreview, setAllProductsBannerPreview] = useState(settings.allProductsBannerImage || '')
  const [allProductsSavedSuccess, setAllProductsSavedSuccess] = useState(false)

  // Banner form state
  const [newBannerTitle, setNewBannerTitle] = useState('')
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('')
  const [newBannerBadge, setNewBannerBadge] = useState('Hot Wholesale Deal')
  const [newBannerImageUrl, setNewBannerImageUrl] = useState('')
  const [newBannerTargetUrl, setNewBannerTargetUrl] = useState('/catalog')
  const [showAddBanner, setShowAddBanner] = useState(false)

  // Announcement state
  const [announcementText, setAnnouncementText] = useState(settings.announcementText)
  const [announcementActive, setAnnouncementActive] = useState(settings.announcementActive)
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber)
  const [supportPhone, setSupportPhone] = useState(settings.supportPhone)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Storage Provider Settings state
  const [storageProvider, setStorageProvider] = useState<StorageProviderType>(settings.storageProvider || 'firebase')
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState(settings.cloudinaryCloudName || '')
  const [cloudinaryUploadPreset, setCloudinaryUploadPreset] = useState(settings.cloudinaryUploadPreset || '')
  const [storageSavedSuccess, setStorageSavedSuccess] = useState(false)

  // Handle All Products Catalog Banner Image Upload via storageService
  const handleAllProductsBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const toastId = toast.loading('Uploading banner image to Storage...')
      try {
        const downloadUrl = await storageService.uploadImage(file, 'banners')
        setAllProductsBannerPreview(downloadUrl)
        updateSettings({ allProductsBannerImage: downloadUrl })
        setAllProductsSavedSuccess(true)
        toast.success('Banner uploaded and saved!', { id: toastId })
        setTimeout(() => setAllProductsSavedSuccess(false), 3000)
      } catch (err: any) {
        console.error('Failed to upload banner:', err)
        toast.error(err?.message || 'Failed to upload banner', { id: toastId })
      }
    }
  }

  // Handle local image file upload for hero banners via storageService
  const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const toastId = toast.loading('Uploading hero banner to Storage...')
      try {
        const downloadUrl = await storageService.uploadImage(file, 'hero-banners')
        setNewBannerImageUrl(downloadUrl)
        toast.success('Hero banner uploaded!', { id: toastId })
      } catch (err: any) {
        console.error('Failed to upload hero banner:', err)
        toast.error(err?.message || 'Failed to upload hero banner', { id: toastId })
      }
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
  }

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({
      announcementText,
      announcementActive,
      whatsappNumber,
      supportPhone,
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleSaveStorageSettings = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({
      storageProvider,
      cloudinaryCloudName,
      cloudinaryUploadPreset,
    })
    setStorageSavedSuccess(true)
    toast.success(`Image Storage provider updated live to ${storageProvider.toUpperCase()}`)
    setTimeout(() => setStorageSavedSuccess(false), 3000)
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <AdminTitle
        title="Storefront Site Settings & Landing Page Banners"
        detail="Upload and manage live landing page hero slides, All Products catalog header banner, featured collection banners, target page dropdowns, Today's Best Deals, announcement bar, and dynamic Image Storage Engines."
      />

      {/* Tabs Header */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'banners'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <HiPhoto size={16} /> Catalog & Landing Page Banners ({settings.heroBanners.length})
        </button>

        <button
          onClick={() => setActiveTab('deals')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'deals'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <HiFire size={16} /> Today's Best Deals ({settings.todaysDealsProductIds.length})
        </button>

        <button
          onClick={() => setActiveTab('trending')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'trending'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <HiSparkles size={16} /> Trending Collections ({settings.trendingProductIds.length})
        </button>

        <button
          onClick={() => setActiveTab('announcement')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'announcement'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <HiMegaphone size={16} /> Announcement & Contact
        </button>

        <button
          onClick={() => setActiveTab('storage')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'storage'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <HiServer size={16} /> Image Storage Engine ({storageProvider.toUpperCase()})
        </button>
      </div>

      {/* TAB 1: LANDING PAGE & ALL PRODUCTS CATALOG BANNERS */}
      {activeTab === 'banners' && (
        <div className="flex flex-col gap-8">
          {/* ALL PRODUCTS CATALOG HEADER BANNER EDIT CARD */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <HiPhoto className="text-emerald-600" size={20} />
                  <span>"All Products" Catalog Header Banner Image</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  Upload the header image displayed at the top right of the "All Products" storefront catalog page.
                </p>
              </div>
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-black uppercase text-white tracking-wider">
                Live Storefront Control
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Current Banner Image Preview */}
              <div className="md:col-span-5 lg:col-span-4">
                <span className="text-[11px] font-bold uppercase text-slate-500 block mb-1">Current Banner Image</span>
                <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-200 shadow-sm">
                  <img
                    src={allProductsBannerPreview || settings.allProductsBannerImage || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1000&q=80'}
                    alt="All Products Banner"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2.5 py-1 text-[10px] font-extrabold text-white backdrop-blur-xs">
                    All Products Banner Preview
                  </div>
                </div>
              </div>

              {/* Uploader Controls */}
              <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-3">
                <label className="text-[11px] font-bold uppercase text-slate-600">Upload & Change Banner Image File</label>
                <div className="flex items-center gap-3">
                  <label className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-500 bg-white p-5 text-xs font-bold text-emerald-800 cursor-pointer hover:bg-emerald-50 transition-all shadow-2xs">
                    <HiArrowUpTray size={22} className="text-emerald-600" />
                    <span>Upload New "All Products" Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAllProductsBannerUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {allProductsSavedSuccess && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-100 p-3 text-xs font-extrabold text-emerald-800 animate-in fade-in">
                    <HiCheckCircle size={18} /> "All Products" Header Banner Image updated live on storefront!
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Landing Page & Featured Collections Banners</h2>
              <p className="text-xs text-slate-500">Upload banner images and set their target page for storefront customers.</p>
            </div>
            <button
              onClick={() => setShowAddBanner(!showAddBanner)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700 transition-all"
            >
              <HiPlus size={16} /> Upload New Landing Page Banner
            </button>
          </div>

          {/* Add Banner Modal / Form */}
          {showAddBanner && (
            <form onSubmit={handleCreateBanner} className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 flex flex-col gap-4">
              <h3 className="text-xs font-extrabold uppercase text-emerald-900">Upload & Configure Landing Page Banner</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">Banner Heading Title *</label>
                  <input
                    type="text"
                    required
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    placeholder="e.g. Premium Kitchen & Dining Appliances"
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">Banner Subtitle / Description</label>
                  <input
                    type="text"
                    value={newBannerSubtitle}
                    onChange={(e) => setNewBannerSubtitle(e.target.value)}
                    placeholder="e.g. Save up to 40% on bulk kitchenware"
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={newBannerBadge}
                    onChange={(e) => setNewBannerBadge(e.target.value)}
                    placeholder="e.g. Hot Wholesale Deal"
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">Target Page Link</label>
                  <select
                    value={newBannerTargetUrl}
                    onChange={(e) => setNewBannerTargetUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900"
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
                <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">Upload Banner Image File *</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-50">
                    <HiArrowUpTray size={16} /> Choose Image File
                    <input type="file" accept="image/*" onChange={handleBannerFileUpload} className="hidden" />
                  </label>
                  <span className="text-xs text-slate-500 font-medium">Or paste image URL below:</span>
                </div>
                <input
                  type="text"
                  value={newBannerImageUrl}
                  onChange={(e) => setNewBannerImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900"
                />
              </div>

              {newBannerImageUrl && (
                <div className="h-32 w-full max-w-sm overflow-hidden rounded-xl bg-slate-100 border">
                  <img src={newBannerImageUrl} alt="Banner Preview" className="h-full w-full object-cover" />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBanner(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700"
                >
                  Save & Publish Banner
                </button>
              </div>
            </form>
          )}

          {/* Active Banners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.heroBanners.map((banner) => (
              <div key={banner.id} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3">
                <div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-900">
                  <img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover opacity-80" />
                  <span className="absolute top-2 left-2 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white uppercase">
                    {banner.badge}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{banner.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{banner.subtitle}</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <HiArrowUpRight size={14} /> Links to: {banner.targetUrl}
                  </span>
                  <button
                    onClick={() => deleteHeroBanner(banner.id)}
                    className="flex items-center gap-1 text-red-600 font-bold hover:underline"
                  >
                    <HiTrash size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TODAY'S DEALS */}
      {activeTab === 'deals' && (
        <div className="flex flex-col gap-6">
          {/* Flash Deals Timer Control Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                LIVE STORE TIMER CONTROL
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-2 mb-0.5">Flash Deals Countdown Expiration Timer</h3>
              <p className="text-xs text-slate-500">Set the exact end date and time for the Flash Deals countdown timer on the storefront home page.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <input
                type="datetime-local"
                value={
                  settings.todaysDealsEndTimestamp
                    ? new Date(settings.todaysDealsEndTimestamp - new Date().getTimezoneOffset() * 60000)
                        .toISOString()
                        .slice(0, 16)
                    : ''
                }
                onChange={(e) => {
                  const newTs = new Date(e.target.value).getTime()
                  if (!isNaN(newTs)) {
                    updateSettings({ todaysDealsEndTimestamp: newTs })
                    toast.success('Flash Deals countdown timer updated!')
                  }
                }}
                className="rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 shadow-2xs cursor-pointer"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Select Products to Feature in "Today's Best Deals"</h3>
            <p className="text-xs text-slate-500 mb-4">Toggle products below to feature them on the storefront home page deals carousel.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.map((p) => {
                const isSelected = settings.todaysDealsProductIds.includes(p.id)
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleDealProduct(p.id)}
                    className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-contain bg-white border p-1" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                        <span className="text-[11px] font-extrabold text-emerald-700">{formatNaira(p.finalPrice)}</span>
                      </div>
                    </div>
                    {isSelected ? (
                      <HiCheckCircle size={22} className="text-emerald-600 shrink-0" />
                    ) : (
                      <HiXCircle size={22} className="text-slate-300 shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRENDING COLLECTIONS */}
      {activeTab === 'trending' && (
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Select Products for "Trending & High Demand"</h3>
            <p className="text-xs text-slate-500 mb-4">Selected items will be highlighted with glowing badges on storefront sections.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.map((p) => {
                const isTrending = settings.trendingProductIds.includes(p.id)
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleTrendingProduct(p.id)}
                    className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                      isTrending
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-contain bg-white border p-1" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                        <span className="text-[11px] font-extrabold text-emerald-700">{formatNaira(p.finalPrice)}</span>
                      </div>
                    </div>
                    {isTrending ? (
                      <HiCheckCircle size={22} className="text-emerald-600 shrink-0" />
                    ) : (
                      <HiXCircle size={22} className="text-slate-300 shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ANNOUNCEMENT & CONTACT */}
      {activeTab === 'announcement' && (
        <form onSubmit={handleSaveAnnouncement} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-6 max-w-3xl">
          {savedSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-100 p-3 text-xs font-bold text-emerald-800">
              <HiCheckCircle size={18} /> Storefront settings successfully saved and applied!
            </div>
          )}

          <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">Top Announcement Banner Text</label>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementActive}
                  onChange={(e) => setAnnouncementActive(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                Active on Storefront
              </label>
            </div>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="e.g. FREE NATIONWIDE DELIVERY ON ORDERS ABOVE ₦250,000"
              className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">WhatsApp Support Number</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">Support Phone Line</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-fit rounded-xl bg-emerald-600 px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:bg-emerald-700"
          >
            Save Site Settings
          </button>
        </form>
      )}

      {/* TAB 5: STORAGE ENGINE SELECTOR */}
      {activeTab === 'storage' && (
        <form onSubmit={handleSaveStorageSettings} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-6 max-w-3xl">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <HiServer className="text-emerald-600" size={20} />
              <span>Image Storage Service Provider Engine</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Select which backend service handles image uploads for product images, category icons, and hero banners.
            </p>
          </div>

          {storageSavedSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-100 p-3 text-xs font-extrabold text-emerald-800">
              <HiCheckCircle size={18} /> Storage Provider settings updated and saved live!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Firebase Card */}
            <div
              onClick={() => setStorageProvider('firebase')}
              className={`flex flex-col gap-3 rounded-2xl border p-5 cursor-pointer transition-all ${
                storageProvider === 'firebase'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-amber-500/10 text-amber-700 font-extrabold text-[10px] px-2.5 py-0.5 border border-amber-500/20 uppercase">
                  Default Active
                </span>
                {storageProvider === 'firebase' && <HiCheckCircle size={22} className="text-emerald-600" />}
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Firebase Storage</h4>
                <p className="text-[11px] font-medium text-slate-500 mt-1">
                  Standard Google Cloud Storage (`gs://noma-69c2t`). Directly integrated with Firebase SDK.
                </p>
              </div>
            </div>

            {/* Cloudinary Card */}
            <div
              onClick={() => setStorageProvider('cloudinary')}
              className={`flex flex-col gap-3 rounded-2xl border p-5 cursor-pointer transition-all ${
                storageProvider === 'cloudinary'
                  ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-500/10 text-blue-700 font-extrabold text-[10px] px-2.5 py-0.5 border border-blue-500/20 uppercase">
                  25GB Free Tier
                </span>
                {storageProvider === 'cloudinary' && <HiCheckCircle size={22} className="text-blue-600" />}
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Cloudinary</h4>
                <p className="text-[11px] font-medium text-slate-500 mt-1">
                  Automatic WebP compression, fast global CDN delivery & 25 GB free monthly credits.
                </p>
              </div>
            </div>

            {/* Cloudflare R2 Card */}
            <div
              onClick={() => setStorageProvider('cloudflare_r2')}
              className={`flex flex-col gap-3 rounded-2xl border p-5 cursor-pointer transition-all ${
                storageProvider === 'cloudflare_r2'
                  ? 'border-orange-600 bg-orange-50/50 shadow-md ring-2 ring-orange-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-orange-500/10 text-orange-700 font-extrabold text-[10px] px-2.5 py-0.5 border border-orange-500/20 uppercase">
                  $0 Egress Fees
                </span>
                {storageProvider === 'cloudflare_r2' && <HiCheckCircle size={22} className="text-orange-600" />}
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Cloudflare R2</h4>
                <p className="text-[11px] font-medium text-slate-500 mt-1">
                  Zero download bandwidth costs, 10 GB free monthly storage, S3-compatible API.
                </p>
              </div>
            </div>
          </div>

          {/* Conditional Credentials Inputs */}
          {storageProvider === 'cloudinary' && (
            <div className="flex flex-col gap-4 rounded-xl border border-blue-200 bg-blue-50/30 p-5 animate-in fade-in">
              <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-2">
                <HiCloud size={18} /> Cloudinary Unsigned Upload Credentials
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">Cloud Name</label>
                  <input
                    type="text"
                    value={cloudinaryCloudName}
                    onChange={(e) => setCloudinaryCloudName(e.target.value)}
                    placeholder="e.g. noma-store"
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">Unsigned Upload Preset</label>
                  <input
                    type="text"
                    value={cloudinaryUploadPreset}
                    onChange={(e) => setCloudinaryUploadPreset(e.target.value)}
                    placeholder="e.g. noma_unsigned"
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-fit rounded-xl bg-emerald-600 px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:bg-emerald-700 transition-all"
          >
            Apply & Save Storage Engine Settings
          </button>
        </form>
      )}
    </div>
  )
}
