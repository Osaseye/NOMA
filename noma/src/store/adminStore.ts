import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface HeroBanner {
  id: string
  title: string
  subtitle: string
  badge: string
  imageUrl: string
  targetUrl: string
  active: boolean
}

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
}

interface AdminState {
  isLoggedIn: boolean
  operatorUser: { name: string; email: string; role: string } | null
  settings: SiteSettings
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

const initialSettings: SiteSettings = {
  allProductsBannerImage: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1000&q=80',
  heroBanners: [],
  todaysDealsProductIds: [],
  todaysDealsEndTimestamp: Date.now() + 86400000 * 2,
  trendingProductIds: [],
  announcementText: '⚡ WELCOME TO NOMA STORES - CLEAN BACKEND INTEGRATION MODE ACTIVE',
  announcementActive: true,
  supportPhone: '0803 000 NOMA',
  supportEmail: 'support@noma.ng',
  whatsappNumber: '2348030006662',
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isLoggedIn: true,
      operatorUser: {
        name: 'Chief Operator',
        email: 'operator@noma.ng',
        role: 'Master Admin',
      },
      settings: initialSettings,
      login: (email: string) =>
        set({
          isLoggedIn: true,
          operatorUser: { name: 'Chief Operator', email, role: 'Master Admin' },
        }),
      logout: () => set({ isLoggedIn: false, operatorUser: null }),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      addHeroBanner: (banner) =>
        set((state) => ({
          settings: {
            ...state.settings,
            heroBanners: [
              ...state.settings.heroBanners,
              { ...banner, id: `banner-${Date.now()}` },
            ],
          },
        })),
      updateHeroBanner: (id, banner) =>
        set((state) => ({
          settings: {
            ...state.settings,
            heroBanners: state.settings.heroBanners.map((b) =>
              b.id === id ? { ...b, ...banner } : b
            ),
          },
        })),
      deleteHeroBanner: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            heroBanners: state.settings.heroBanners.filter((b) => b.id !== id),
          },
        })),
      toggleDealProduct: (productId) =>
        set((state) => {
          const exists = state.settings.todaysDealsProductIds.includes(productId)
          const updated = exists
            ? state.settings.todaysDealsProductIds.filter((id) => id !== productId)
            : [...state.settings.todaysDealsProductIds, productId]
          return {
            settings: { ...state.settings, todaysDealsProductIds: updated },
          }
        }),
      toggleTrendingProduct: (productId) =>
        set((state) => {
          const exists = state.settings.trendingProductIds.includes(productId)
          const updated = exists
            ? state.settings.trendingProductIds.filter((id) => id !== productId)
            : [...state.settings.trendingProductIds, productId]
          return {
            settings: { ...state.settings, trendingProductIds: updated },
          }
        }),
      clearAllAdminSettings: () =>
        set({
          settings: {
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
          },
        }),
    }),
    {
      name: 'noma_admin_store_v3',
    }
  )
)
