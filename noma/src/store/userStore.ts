import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService, type UserDoc } from '../services/firebase/authService'

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
  uid?: string
  name: string
  email: string
  phone: string
  isGuest: boolean
  defaultAddress: DeliveryAddress
}

export interface FirebaseAuthSnapshotUser {
  uid: string
  email?: string | null
  displayName?: string | null
}

interface UserState {
  profile: UserProfile
  wishlistProductIds: string[]
  updateProfile: (profile: Partial<UserProfile>) => void
  updateDefaultAddress: (address: Partial<DeliveryAddress>) => void
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  syncFromFirebaseUser: (
    authUser: FirebaseAuthSnapshotUser | null,
    userDoc: UserDoc | null
  ) => void
  login: (userData?: { uid?: string; name?: string; email?: string; phone?: string }) => void
  logout: () => void
}

const initialAddress: DeliveryAddress = {
  fullName: '',
  phone: '',
  email: '',
  state: '',
  city: '',
  neighborhood: '',
  address: '',
  additionalInfo: '',
}

const initialProfile: UserProfile = {
  uid: undefined,
  name: '',
  email: '',
  phone: '',
  isGuest: true,
  defaultAddress: initialAddress,
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: initialProfile,
      wishlistProductIds: [],

      updateProfile: (updates) => {
        const current = get().profile
        const nextProfile: UserProfile = {
          ...current,
          ...updates,
          uid: current.uid,
          defaultAddress: updates.defaultAddress
            ? { ...current.defaultAddress, ...updates.defaultAddress }
            : current.defaultAddress,
        }

        set({ profile: nextProfile })

        if (current.uid) {
          const firestoreUpdates: Partial<UserDoc> = {}
          if (updates.name !== undefined) firestoreUpdates.name = updates.name
          if (updates.email !== undefined) firestoreUpdates.email = updates.email
          if (updates.phone !== undefined) firestoreUpdates.phone = updates.phone
          if (updates.defaultAddress !== undefined) {
            firestoreUpdates.defaultAddress = nextProfile.defaultAddress
          }
          if (Object.keys(firestoreUpdates).length > 0) {
            authService.updateUserProfile(current.uid, firestoreUpdates).catch((err) => {
              console.warn('Failed to persist profile update to Firestore:', err)
            })
          }
        }
      },

      updateDefaultAddress: (addressUpdates) => {
        const current = get().profile
        const nextAddress: DeliveryAddress = {
          ...current.defaultAddress,
          ...addressUpdates,
        }

        set({
          profile: {
            ...current,
            defaultAddress: nextAddress,
          },
        })

        if (current.uid) {
          authService
            .updateUserProfile(current.uid, { defaultAddress: nextAddress })
            .catch((err) => {
              console.warn('Failed to persist defaultAddress to Firestore:', err)
            })
        }
      },

      toggleWishlist: (productId) => {
        const currentIds = get().wishlistProductIds
        const exists = currentIds.includes(productId)
        const nextWishlist = exists
          ? currentIds.filter((id) => id !== productId)
          : [...currentIds, productId]

        set({ wishlistProductIds: nextWishlist })

        const uid = get().profile.uid
        if (uid) {
          authService
            .updateUserProfile(uid, { wishlistProductIds: nextWishlist })
            .catch((err) => {
              console.warn('Failed to persist wishlist to Firestore:', err)
            })
        }
      },

      isInWishlist: (productId) => get().wishlistProductIds.includes(productId),

      syncFromFirebaseUser: (authUser, userDoc) => {
        const currentState = get()

        if (!authUser) {
          if (currentState.profile.uid) {
            set({
              profile: initialProfile,
              wishlistProductIds: [],
            })
          } else {
            set((state) => ({
              profile: {
                ...state.profile,
                uid: undefined,
                isGuest: true,
              },
            }))
          }
          return
        }

        const wasGuest = !currentState.profile.uid || currentState.profile.uid !== authUser.uid
        const remoteWishlist = Array.isArray(userDoc?.wishlistProductIds)
          ? userDoc.wishlistProductIds
          : []
        const nextWishlist = wasGuest
          ? Array.from(new Set([...remoteWishlist, ...currentState.wishlistProductIds]))
          : Array.isArray(userDoc?.wishlistProductIds)
            ? remoteWishlist
            : currentState.wishlistProductIds

        const nextProfile: UserProfile = {
          uid: authUser.uid,
          name: userDoc?.name || authUser.displayName || currentState.profile.name || '',
          email: userDoc?.email || authUser.email || currentState.profile.email || '',
          phone: userDoc?.phone || currentState.profile.phone || '',
          isGuest: false,
          defaultAddress: userDoc?.defaultAddress
            ? { ...initialAddress, ...userDoc.defaultAddress }
            : currentState.profile.defaultAddress,
        }

        set({
          profile: nextProfile,
          wishlistProductIds: nextWishlist,
        })

        // Persist guest-accumulated wishlist items up to Firestore on fresh login
        if (
          wasGuest &&
          userDoc &&
          nextWishlist.length > remoteWishlist.length
        ) {
          authService
            .updateUserProfile(authUser.uid, { wishlistProductIds: nextWishlist })
            .catch((err) => {
              console.warn('Failed to merge guest wishlist to Firestore:', err)
            })
        }
      },

      login: (userData) =>
        set((state) => ({
          profile: {
            ...state.profile,
            isGuest: false,
            uid: userData?.uid ?? state.profile.uid,
            name: userData?.name ?? state.profile.name,
            email: userData?.email ?? state.profile.email,
            phone: userData?.phone ?? state.profile.phone,
          },
        })),

      logout: () =>
        set({
          profile: initialProfile,
          wishlistProductIds: [],
        }),
    }),
    {
      name: 'noma-user-storage',
    }
  )
)
