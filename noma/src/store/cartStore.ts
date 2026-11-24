import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartLineEntry } from '../types/commerce'
import { useAdminStore } from './adminStore'

const LINE_KEY_SEPARATOR = '::'

export function makeCartLineKey(productId: string, size?: string): string {
  const cleanSize = size?.trim()
  return cleanSize ? `${productId}${LINE_KEY_SEPARATOR}${cleanSize}` : productId
}

export function parseCartLineKey(lineKey: string): { productId: string; size?: string } {
  const sepIndex = lineKey.indexOf(LINE_KEY_SEPARATOR)
  if (sepIndex === -1) {
    return { productId: lineKey }
  }
  const productId = lineKey.slice(0, sepIndex)
  const size = lineKey.slice(sepIndex + LINE_KEY_SEPARATOR.length).trim() || undefined
  return size ? { productId, size } : { productId }
}

export function toCartLineEntries(items: Record<string, number>): CartLineEntry[] {
  return Object.entries(items)
    .filter(([, quantity]) => quantity > 0)
    .map(([key, quantity]) => {
      const { productId, size } = parseCartLineKey(key)
      return {
        key,
        productId,
        ...(size ? { size } : {}),
        quantity,
      }
    })
}

export const FREE_DELIVERY_THRESHOLD = 250000

export function estimateStateDeliveryFee(
  stateName: string,
  hasBulkyItem: boolean,
  subtotal: number,
): {
  standardFee: number
  expressFee: number
  freeShippingThreshold: number
  isFreeStandard: boolean
  zoneLabel: string
} {
  const settings = useAdminStore.getState().settings
  const threshold =
    typeof settings.freeDeliveryThreshold === 'number'
      ? settings.freeDeliveryThreshold
      : FREE_DELIVERY_THRESHOLD
  const configuredBulky =
    typeof settings.bulkyItemSurcharge === 'number' ? settings.bulkyItemSurcharge : 4000

  const clean = (stateName || 'Lagos').toLowerCase().trim()
  const configuredState = (settings.deliveryStates || []).find(
    (s) => s.name.toLowerCase().trim() === clean || clean.includes(s.name.toLowerCase().trim())
  )

  let baseStandard = configuredState?.standardFee ?? 7500
  let baseExpress = configuredState?.expressFee ?? 12000
  let zoneLabel = configuredState
    ? `${configuredState.name} (${configuredState.eta})`
    : 'Nationwide Interstate (3 - 5 Days)'

  if (!configuredState) {
    if (clean.includes('lagos')) {
      baseStandard = 3500
      baseExpress = 6000
      zoneLabel = 'Lagos Metro (1 - 2 Days)'
    } else if (clean.includes('oyo') || clean.includes('ogun') || clean.includes('osun')) {
      baseStandard = 4500
      baseExpress = 7500
      zoneLabel = 'South-West Regional (2 - 3 Days)'
    } else if (
      clean.includes('abuja') ||
      clean.includes('fct') ||
      clean.includes('rivers') ||
      clean.includes('edo')
    ) {
      baseStandard = 6000
      baseExpress = 9500
      zoneLabel = 'Major Hub Air/Road (2 - 4 Days)'
    }
  }

  const bulkySurcharge = hasBulkyItem ? configuredBulky : 0
  const isFreeStandard = !hasBulkyItem && threshold > 0 && subtotal >= threshold
  const standardFee = isFreeStandard ? 0 : baseStandard + bulkySurcharge
  const expressFee = baseExpress + bulkySurcharge

  return {
    standardFee,
    expressFee,
    freeShippingThreshold: threshold,
    isFreeStandard,
    zoneLabel,
  }
}

type CartState = {
  items: Record<string, number>
  deliveryState: string
  isDrawerOpen: boolean
  addItem: (productId: string, size?: string, quantity?: number) => void
  removeItem: (productId: string, size?: string) => void
  setItemQuantity: (lineKey: string, quantity: number) => void
  removeLine: (lineKey: string) => void
  clearCart: () => void
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
  setDeliveryState: (deliveryState: string) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      deliveryState: 'Lagos',
      isDrawerOpen: false,
      addItem: (productId, size, quantity = 1) =>
        set((state) => {
          if (!Number.isFinite(quantity) || quantity <= 0) {
            return state
          }
          const delta = Math.floor(quantity)
          if (delta <= 0) {
            return state
          }
          const key = makeCartLineKey(productId, size)
          return {
            items: {
              ...state.items,
              [key]: (state.items[key] ?? 0) + delta,
            },
          }
        }),
      removeItem: (productId, size) =>
        set((state) => {
          const key = makeCartLineKey(productId, size)
          if (!(key in state.items)) {
            return state
          }
          const next = { ...state.items }
          const remaining = (next[key] ?? 1) - 1
          if (remaining <= 0) {
            delete next[key]
          } else {
            next[key] = remaining
          }
          return { items: next }
        }),
      setItemQuantity: (lineKey, quantity) =>
        set((state) => {
          if (!Number.isFinite(quantity)) {
            return state
          }
          const qty = Math.floor(quantity)
          const next = { ...state.items }
          if (qty <= 0) {
            delete next[lineKey]
          } else {
            next[lineKey] = qty
          }
          return { items: next }
        }),
      removeLine: (lineKey) =>
        set((state) => {
          if (!(lineKey in state.items)) {
            return state
          }
          const next = { ...state.items }
          delete next[lineKey]
          return { items: next }
        }),
      clearCart: () => set({ items: {} }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      setDeliveryState: (deliveryState) => set({ deliveryState }),
    }),
    {
      name: 'noma_cart_store_v2',
      partialize: (state) => ({
        items: state.items,
        deliveryState: state.deliveryState,
      }),
    }
  )
)
