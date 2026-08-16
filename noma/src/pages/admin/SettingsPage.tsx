import { useState } from 'react'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { useAdminStore } from '../../store/adminStore'
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
} from 'react-icons/hi2'
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

export function SettingsPage() {
  const { settings, updateSettings, addHeroBanner, updateHeroBanner, deleteHeroBanner, toggleDealProduct, toggleTrendingProduct } = useAdminStore()
  const { products } = useProductStore()

  const [activeTab, setActiveTab] = useState<'banners' | 'deals' | 'trending' | 'announcement'>('banners')

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

  // Handle All Products Catalog Banner Image Upload
  const handleAllProductsBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        setAllProductsBannerPreview(dataUrl)
        updateSettings({ allProductsBannerImage: dataUrl })
        setAllProductsSavedSuccess(true)
        setTimeout(() => setAllProductsSavedSuccess(false), 3000)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle local image file upload converting to Data URL for hero banners
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setNewBannerImageUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
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

  return (
    <div className="flex flex-col gap-8 pb-12">
      <AdminTitle
        title="Storefront Site Settings & Landing Page Banners"
        detail="Upload and manage live landing page hero slides, All Products catalog header banner, featured collection banners, target page dropdowns, Today's Best Deals, and announcement bar."
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
                  <label className="text-[11px] font-bold uppercase text-slate-600">Headline Text</label>
                  <input
                    type="text"
                    required
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    placeholder="e.g. Premium Smart Electronics & Home Upgrades"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-600">Badge Tag</label>
                  <input
                    type="text"
                    value={newBannerBadge}
                    onChange={(e) => setNewBannerBadge(e.target.value)}
                    placeholder="e.g. Featured Collection"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold uppercase text-slate-600">Subtitle Description</label>
                  <input
                    type="text"
                    value={newBannerSubtitle}
                    onChange={(e) => setNewBannerSubtitle(e.target.value)}
                    placeholder="e.g. Shop direct wholesale deals delivered across Lagos & Nigeria."
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold"
                  />
                </div>

                {/* File Upload Box */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-600">Upload Banner Image File</label>
                  <div className="flex items-center gap-3 mt-1">
                    <label className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-400 bg-white p-3 text-xs font-bold text-emerald-800 cursor-pointer hover:bg-emerald-50">
                      <HiArrowUpTray size={18} /> Choose Image File
                      <input type="file" accept="image/*" onChange={handleBannerFileUpload} className="hidden" />
                    </label>
                  </div>
                  {newBannerImageUrl && (
                    <div className="mt-2 h-24 w-full rounded-xl bg-slate-100 overflow-hidden border">
                      <img src={newBannerImageUrl} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Target Page Dropdown */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-600">Target Page Link</label>
                  <select
                    value={newBannerTargetUrl}
                    onChange={(e) => setNewBannerTargetUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 bg-white mt-1"
                  >
                    {publicPageOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBanner(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
                >
                  Save & Publish Banner
                </button>
              </div>
            </form>
          )}

          {/* Banner Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settings.heroBanners.map((banner) => {
              const matchedOption = publicPageOptions.find((o) => o.value === banner.targetUrl)
              return (
                <div key={banner.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                  <div className="relative h-52 w-full bg-slate-900">
                    <img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover opacity-85" />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-black uppercase text-white shadow-md">
                        {banner.badge}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        onClick={() => updateHeroBanner(banner.id, { active: !banner.active })}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                          banner.active ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {banner.active ? 'Active' : 'Hidden'}
                      </button>
                      <button
                        onClick={() => deleteHeroBanner(banner.id)}
                        className="rounded-full bg-rose-600 p-1.5 text-white hover:bg-rose-700"
                      >
                        <HiTrash size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <h4 className="font-['Outfit'] font-black text-base text-slate-900">{banner.title}</h4>
                    <p className="text-xs text-slate-500">{banner.subtitle}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-600 border-t border-slate-100 pt-3">
                      <span>Target Page: <strong className="text-emerald-700">{matchedOption?.label || banner.targetUrl}</strong></span>
                      <a href={banner.targetUrl} target="_blank" rel="noreferrer" className="text-emerald-600 flex items-center gap-1 hover:underline">
                        Preview Page <HiArrowUpRight size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TODAY'S BEST DEALS */}
      {activeTab === 'deals' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Today's Best Deals Showcase</h2>
              <p className="text-xs text-slate-500">Toggle products featured under Today's Best Deals on the storefront.</p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800 uppercase">
              {settings.todaysDealsProductIds.length} Products Featured
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => {
              const isDeal = settings.todaysDealsProductIds.includes(p.id)
              return (
                <div
                  key={p.id}
                  onClick={() => toggleDealProduct(p.id)}
                  className={`cursor-pointer rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                    isDeal
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <img src={p.image} alt={p.name} className="h-14 w-14 rounded-xl object-contain bg-slate-50 border p-1" />
                    {isDeal ? (
                      <HiCheckCircle size={24} className="text-emerald-600" />
                    ) : (
                      <HiXCircle size={24} className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">{p.category}</span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{p.name}</h4>
                    <span className="text-xs font-black text-emerald-700 mt-1">{formatNaira(p.finalPrice)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 3: TRENDING PRODUCTS */}
      {activeTab === 'trending' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Trending Now Products</h2>
              <p className="text-xs text-slate-500">Toggle products that appear under "Trending Now" on the storefront homepage.</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 uppercase">
              {settings.trendingProductIds.length} Products Selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => {
              const isTrending = settings.trendingProductIds.includes(p.id)
              return (
                <div
                  key={p.id}
                  onClick={() => toggleTrendingProduct(p.id)}
                  className={`cursor-pointer rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                    isTrending
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <img src={p.image} alt={p.name} className="h-14 w-14 rounded-xl object-contain bg-slate-50 border p-1" />
                    {isTrending ? (
                      <HiCheckCircle size={24} className="text-emerald-600" />
                    ) : (
                      <HiXCircle size={24} className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">{p.category}</span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{p.name}</h4>
                    <span className="text-xs font-black text-emerald-700 mt-1">{formatNaira(p.finalPrice)}</span>
                  </div>
                </div>
              )
            })}
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
    </div>
  )
}
