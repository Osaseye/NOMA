import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { Supplier } from '../../types/commerce'

const SUPPLIERS_COLLECTION = 'suppliers'

export const initialSuppliers: Supplier[] = []

export const supplierService = {
  subscribeSuppliers: (callback: (suppliers: Supplier[]) => void) => {
    try {
      const q = query(collection(db, SUPPLIERS_COLLECTION))
      return onSnapshot(
        q,
        (snapshot) => {
          const list: Supplier[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data()
            return {
              id: docSnap.id,
              name: data.name || 'Unnamed Supplier',
              contactPerson: data.contactPerson || '',
              phone: data.phone || '',
              email: data.email || '',
              address: data.address || '',
              paymentTerms: data.paymentTerms || '',
              notes: data.notes || '',
              logo: data.logo || data.image || '',
              image: data.image || data.logo || '',
              createdAt: data.createdAt || '',
            }
          })
          callback(list)
        },
        (error) => {
          console.error('Error listening to Firestore suppliers:', error)
          callback([])
        }
      )
    } catch (e) {
      console.error('Error subscribing to suppliers:', e)
      callback([])
      return () => {}
    }
  },

  addSupplier: async (supplierData: Omit<Supplier, 'id'>) => {
    const customId = `sup-${Date.now()}`
    const newSupplier: Supplier = {
      ...supplierData,
      id: customId,
    }

    try {
      await setDoc(doc(db, SUPPLIERS_COLLECTION, customId), {
        ...newSupplier,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.warn('Firestore addSupplier notice (saved locally):', message)
    }

    return newSupplier
  },

  updateSupplier: async (id: string, updates: Partial<Supplier>) => {
    try {
      await updateDoc(doc(db, SUPPLIERS_COLLECTION, id), {
        ...updates,
        updatedAt: serverTimestamp(),
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.warn('Firestore updateSupplier notice (updated locally):', message)
    }
  },

  deleteSupplier: async (id: string) => {
    try {
      await deleteDoc(doc(db, SUPPLIERS_COLLECTION, id))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.warn('Firestore deleteSupplier notice (removed locally):', message)
    }
  },
}
