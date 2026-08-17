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

export const initialSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Sumec Firman Nigeria Ltd',
    contactPerson: 'Chief Emeka Okafor',
    phone: '0803 111 2233',
    email: 'sales@firman-ng.com',
    address: 'Alaba International Market, Ojo, Lagos',
    paymentTerms: 'Net 30 Days',
    notes: 'Primary supplier for generators and heavy power equipment.',
  },
  {
    id: 'sup-2',
    name: 'Guangzhou Home Appliances Co.',
    contactPerson: 'Mr. Chen Wei',
    phone: '0802 444 5566',
    email: 'imports@gz-appliances.com',
    address: 'Trade Fair Complex, Badagry Expressway, Lagos',
    paymentTerms: 'Pay on Stock Delivery',
    notes: 'Direct importer of air fryers, blenders, and nonstick cookware sets.',
  },
  {
    id: 'sup-3',
    name: 'Binatone West Africa',
    contactPerson: 'Mrs. Funke Adebayo',
    phone: '0805 777 8899',
    email: 'orders@binatone-wa.com',
    address: 'Ikeja Industrial Estate, Lagos',
    paymentTerms: 'Consignment / Monthly Settlement',
    notes: 'Authorized distributor for fans, standing coolers, and microwaves.',
  },
]

export const supplierService = {
  subscribeSuppliers: (callback: (suppliers: Supplier[]) => void) => {
    try {
      const q = query(collection(db, SUPPLIERS_COLLECTION))
      return onSnapshot(
        q,
        (snapshot) => {
          if (snapshot.empty) {
            callback(initialSuppliers)
            return
          }
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
              createdAt: data.createdAt || '',
            }
          })
          callback(list)
        },
        (error) => {
          console.warn('Firestore suppliers listener notice:', error?.message || error)
          callback(initialSuppliers)
        }
      )
    } catch (e) {
      console.warn('Firestore suppliers catch notice:', e)
      callback(initialSuppliers)
      return () => {}
    }
  },

  addSupplier: async (supplierData: Omit<Supplier, 'id'>) => {
    const customId = `sup-${Date.now()}`
    const newSupplier: Supplier = {
      ...supplierData,
      id: customId,
    }

    await setDoc(doc(db, SUPPLIERS_COLLECTION, customId), {
      ...newSupplier,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return newSupplier
  },

  updateSupplier: async (id: string, updates: Partial<Supplier>) => {
    await updateDoc(doc(db, SUPPLIERS_COLLECTION, id), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  },

  deleteSupplier: async (id: string) => {
    await deleteDoc(doc(db, SUPPLIERS_COLLECTION, id))
  },
}
