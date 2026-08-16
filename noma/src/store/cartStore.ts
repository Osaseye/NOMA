import { create } from 'zustand'

type CartState = {
  items: Record<string, number>
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: {},
  addItem: (productId) =>
    set((state) => ({
      items: { ...state.items, [productId]: (state.items[productId] ?? 0) + 1 },
    })),
  removeItem: (productId) =>
    set((state) => {
      const next = { ...state.items, [productId]: Math.max((state.items[productId] ?? 1) - 1, 0) }
      if (!next[productId]) delete next[productId]
      return { items: next }
    }),
  clearCart: () => set({ items: {} }),
}))
