// userStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DeliveryAddress {
  fullName: string
  phone: string
  email: string
  state: string
  city: string
  neighborhood: string
  address: string
  additionalInfo?: string
}

export interface UserProfile {
  name: string
  email: string
  phone: string
  isGuest: boolean
  defaultAddress: DeliveryAddress
}

interface UserState {
  profile: UserProfile
  wishlistProductIds: string[]
  updateProfile: (profile: Partial<UserProfile>) => void
  updateDefaultAddress: (address: Partial<DeliveryAddress>) => void
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  login: (userData?: { name?: string; email?: string; phone?: string }) => void
  logout: () => void
}

const initialAddress: DeliveryAddress = {
  fullName: 'Adebayo Ogunlesi',
  phone: '08012345678',
  email: 'adebayo@example.com',
  state: 'Oyo',
  city: 'Ibadan',
  neighborhood: 'Bodija',
  address: '14 Favos Building, Bodija Main Road',
  additionalInfo: 'Opposite First Bank',
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: {
        name: 'Adebayo Ogunlesi',
        email: 'adebayo@example.com',
        phone: '08012345678',
        isGuest: true,
        defaultAddress: initialAddress,
      },
      wishlistProductIds: ['c1', 'c2'],
      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),
      updateDefaultAddress: (addressUpdates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            defaultAddress: { ...state.profile.defaultAddress, ...addressUpdates },
          },
        })),
      toggleWishlist: (productId) =>
        set((state) => {
          const exists = state.wishlistProductIds.includes(productId)
          return {
            wishlistProductIds: exists
              ? state.wishlistProductIds.filter((id) => id !== productId)
              : [...state.wishlistProductIds, productId],
          }
        }),
      isInWishlist: (productId) => get().wishlistProductIds.includes(productId),
      login: (userData) =>
        set((state) => ({
          profile: {
            ...state.profile,
            isGuest: false,
            name: userData?.name || state.profile.name || 'Adebayo Ogunlesi',
            email: userData?.email || state.profile.email || 'adebayo@example.com',
            phone: userData?.phone || state.profile.phone || '08012345678',
          },
        })),
      logout: () =>
        set((state) => ({
          profile: {
            ...state.profile,
            isGuest: true,
          },
        })),
    }),
    {
      name: 'noma-user-storage',
    },
  ),
)
