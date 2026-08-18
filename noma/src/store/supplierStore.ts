import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Supplier } from '../types/commerce'
import { supplierService } from '../services/firebase/supplierService'

let supplierUnsubscribe: (() => void) | null = null

interface SupplierState {
  suppliers: Supplier[]
  
  initSupplierListener: () => () => void
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<Supplier>
  updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<void>
  deleteSupplier: (id: string) => Promise<void>
  setSuppliers: (suppliers: Supplier[]) => void
}

export const useSupplierStore = create<SupplierState>()(
  persist(
    (set) => ({
      suppliers: [],

      initSupplierListener: () => {
        if (!supplierUnsubscribe) {
          supplierUnsubscribe = supplierService.subscribeSuppliers((suppliersList) => {
            set({ suppliers: suppliersList })
          })
        }
        return () => {
          if (supplierUnsubscribe) {
            supplierUnsubscribe()
            supplierUnsubscribe = null
          }
        }
      },

      addSupplier: async (supplierData) => {
        const newSupplier = await supplierService.addSupplier(supplierData)
        set((state) => ({ suppliers: [newSupplier, ...state.suppliers] }))
        return newSupplier
      },

      updateSupplier: async (id, updates) => {
        await supplierService.updateSupplier(id, updates)
        set((state) => ({
          suppliers: state.suppliers.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }))
      },

      deleteSupplier: async (id) => {
        await supplierService.deleteSupplier(id)
        set((state) => ({
          suppliers: state.suppliers.filter((s) => s.id !== id),
        }))
      },

      setSuppliers: (suppliers) => set({ suppliers }),
    }),
    {
      name: 'noma-supplier-store-storage',
      partialize: (state) => ({
        suppliers: state.suppliers,
      }),
    }
  )
)

// Auto-initialize real-time Firestore listener
useSupplierStore.getState().initSupplierListener()
