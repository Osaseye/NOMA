import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartLineEntry } from '../types/commerce'

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

type CartState = {
  items: Record<string, number>
  addItem: (productId: string, size?: string, quantity?: number) => void
  removeItem: (productId: string, size?: string) => void
  setItemQuantity: (lineKey: string, quantity: number) => void
  removeLine: (lineKey: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: {},
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
    }),
    {
      name: 'noma_cart_store_v2',
    }
  )
)
