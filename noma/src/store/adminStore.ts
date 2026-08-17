import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { settingsService, initialSiteSettings } from '../services/firebase/settingsService'

let settingsUnsubscribe: (() => void) | null = null

export interface HeroBanner {
  id: string
  title: string
  subtitle: string
  badge: string
  imageUrl: string
  targetUrl: string
  active: boolean
}

export type StorageProviderType = 'firebase' | 'cloudinary' | 'cloudflare_r2'

export interface SiteSettings {
  allProductsBannerImage?: string
  heroBanners: HeroBanner[]
  todaysDealsProductIds: string[]
  todaysDealsEndTimestamp: number
  trendingProductIds: string[]
  announcementText: string
  announcementActive: boolean
  supportPhone: string
  supportEmail: string
  whatsappNumber: string
  storageProvider?: StorageProviderType
  cloudinaryCloudName?: string
  cloudinaryUploadPreset?: string
  cloudflareBucketUrl?: string
}

interface AdminState {
  isLoggedIn: boolean
  operatorUser: { name: string; email: string; role: string } | null
  settings: SiteSettings

  initSettingsListener: () => () => void
  login: (email: string) => void
  logout: () => void
  updateSettings: (newSettings: Partial<SiteSettings>) => void
  addHeroBanner: (banner: Omit<HeroBanner, 'id'>) => void
  updateHeroBanner: (id: string, banner: Partial<HeroBanner>) => void
  deleteHeroBanner: (id: string) => void
  toggleDealProduct: (productId: string) => void
  toggleTrendingProduct: (productId: string) => void
  clearAllAdminSettings: () => void
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      operatorUser: null,
      settings: initialSiteSettings,

      initSettingsListener: () => {
        if (settingsUnsubscribe) {
          return settingsUnsubscribe
        }

        const unsub = settingsService.subscribeSiteSettings((liveSettings) => {
          set({ settings: liveSettings })
        })

        settingsUnsubscribe = () => {
          unsub()
          settingsUnsubscribe = null
        }

        return settingsUnsubscribe
      },

      login: (email: string) =>
        set({
          isLoggedIn: true,
          operatorUser: { name: 'Master Admin', email, role: 'Master Admin' },
        }),

      logout: () => set({ isLoggedIn: false, operatorUser: null }),

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }))
        settingsService.updateSiteSettings(newSettings).catch((err) => {
          console.error('Failed to sync siteSettings to Firestore:', err)
        })
      },

      addHeroBanner: (banner) => {
        const newBanner = { ...banner, id: `banner-${Date.now()}` }
        const updatedBanners = [...get().settings.heroBanners, newBanner]

        set((state) => ({
          settings: { ...state.settings, heroBanners: updatedBanners },
        }))
        settingsService.updateSiteSettings({ heroBanners: updatedBanners }).catch((err) => {
          console.error('Failed to add hero banner to Firestore:', err)
        })
      },

      updateHeroBanner: (id, banner) => {
        const updatedBanners = get().settings.heroBanners.map((b) =>
          b.id === id ? { ...b, ...banner } : b
        )
        set((state) => ({
          settings: { ...state.settings, heroBanners: updatedBanners },
        }))
        settingsService.updateSiteSettings({ heroBanners: updatedBanners }).catch((err) => {
          console.error('Failed to update hero banner in Firestore:', err)
        })
      },

      deleteHeroBanner: (id) => {
        const updatedBanners = get().settings.heroBanners.filter((b) => b.id !== id)
        set((state) => ({
          settings: { ...state.settings, heroBanners: updatedBanners },
        }))
        settingsService.updateSiteSettings({ heroBanners: updatedBanners }).catch((err) => {
          console.error('Failed to delete hero banner in Firestore:', err)
        })
      },

      toggleDealProduct: (productId) => {
        const exists = get().settings.todaysDealsProductIds.includes(productId)
        const updated = exists
          ? get().settings.todaysDealsProductIds.filter((id) => id !== productId)
          : [...get().settings.todaysDealsProductIds, productId]

        set((state) => ({
          settings: { ...state.settings, todaysDealsProductIds: updated },
        }))
        settingsService.updateSiteSettings({ todaysDealsProductIds: updated }).catch((err) => {
          console.error('Failed to toggle deal product in Firestore:', err)
        })
      },

      toggleTrendingProduct: (productId) => {
        const exists = get().settings.trendingProductIds.includes(productId)
        const updated = exists
          ? get().settings.trendingProductIds.filter((id) => id !== productId)
          : [...get().settings.trendingProductIds, productId]

        set((state) => ({
          settings: { ...state.settings, trendingProductIds: updated },
        }))
        settingsService.updateSiteSettings({ trendingProductIds: updated }).catch((err) => {
          console.error('Failed to toggle trending product in Firestore:', err)
        })
      },

      clearAllAdminSettings: () => {
        const emptySettings: SiteSettings = {
          allProductsBannerImage: '',
          heroBanners: [],
          todaysDealsProductIds: [],
          todaysDealsEndTimestamp: Date.now(),
          trendingProductIds: [],
          announcementText: '',
          announcementActive: false,
          supportPhone: '',
          supportEmail: '',
          whatsappNumber: '',
          storageProvider: 'firebase',
          cloudinaryCloudName: '',
          cloudinaryUploadPreset: '',
          cloudflareBucketUrl: '',
        }
        set({ settings: emptySettings })
        settingsService.updateSiteSettings(emptySettings).catch((err) => {
          console.error('Failed to clear admin settings in Firestore:', err)
        })
      },
    }),
    {
      name: 'noma_admin_store_v3',
    }
  )
)
