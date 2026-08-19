import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { Product } from '../../types/commerce'

const PRODUCTS_COLLECTION = 'products'

function sanitizeForFirestore(obj: any): any {
  if (obj === undefined || obj === null) {
    return null
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => (typeof item === 'object' && item !== null ? sanitizeForFirestore(item) : item))
  }
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const cleaned: Record<string, any> = {}
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = typeof value === 'object' && value !== null ? sanitizeForFirestore(value) : value
      }
    }
    return cleaned
  }
  if (typeof obj === 'number' && isNaN(obj)) {
    return 0
  }
  return obj
}

export const productService = {
  subscribeProducts: (callback: (products: Product[]) => void) => {
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('name', 'asc'))
    return onSnapshot(
      q,
      (snapshot) => {
        const productsList: Product[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data()
          return {
            id: docSnap.id,
            slug: data.slug || docSnap.id,
            name: data.name || '',
            category: data.category || 'general',
            subCategory: data.subCategory || data.subcategory || '',
            supplierId: data.supplierId || '',
            supplierName: data.supplierName || '',
            finalPrice: Number(data.finalPrice) || 0,
            basePrice: Number(data.basePrice) || 0,
            stockQty: Number(data.stockQty) || 0,
            rating: Number(data.rating) || 0,
            reviewsCount: Number(data.reviewsCount) || 0,
            image: data.image || '',
            images: Array.isArray(data.images) ? data.images : (data.image ? [data.image] : []),
            badge: data.badge || '',
            discountBadge: data.discountBadge || '',
            brand: data.brand || '',
            bulky: Boolean(data.bulky),
            description: data.description || '',
            specs: Array.isArray(data.specs) ? data.specs : [],
            whatsInTheBox: Array.isArray(data.whatsInTheBox) ? data.whatsInTheBox : [],
            keyFeatures: Array.isArray(data.keyFeatures) ? data.keyFeatures : [],
            sizes: Array.isArray(data.sizes) ? data.sizes : [],
          }
        })
        callback(productsList)
      },
      (error) => {
        console.error('Error listening to Firestore products:', error)
      }
    )
  },

  addProduct: async (productData: Omit<Product, 'id'>) => {
    const customId = `p-${Date.now()}`
    const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const newProduct: Product = {
      ...productData,
      id: customId,
      slug,
    }

    const cleanedData = sanitizeForFirestore({
      ...newProduct,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    try {
      await setDoc(doc(db, PRODUCTS_COLLECTION, customId), cleanedData)
    } catch (err: any) {
      console.error('Firestore addProduct error:', err?.message || err)
      throw err
    }

    return newProduct
  },

  updateProduct: async (id: string, updates: Partial<Product>) => {
    try {
      const ref = doc(db, PRODUCTS_COLLECTION, id)
      const cleanedData = sanitizeForFirestore({
        ...updates,
        updatedAt: serverTimestamp(),
      })
      await updateDoc(ref, cleanedData)
    } catch (err: any) {
      console.error('Firestore updateProduct error:', err?.message || err)
      throw err
    }
  },

  deleteProduct: async (id: string) => {
    try {
      await deleteDoc(doc(db, PRODUCTS_COLLECTION, id))
    } catch (err: any) {
      console.error('Firestore deleteProduct error:', err?.message || err)
      throw err
    }
  },

  updateStockQuantity: async (id: string, qty: number) => {
    const ref = doc(db, PRODUCTS_COLLECTION, id)
    await updateDoc(ref, {
      stockQty: Math.max(0, qty),
      updatedAt: serverTimestamp(),
    })
  },

  toggleStockStatus: async (id: string, currentQty: number) => {
    const newQty = currentQty > 0 ? 0 : 10
    const ref = doc(db, PRODUCTS_COLLECTION, id)
    await updateDoc(ref, {
      stockQty: newQty,
      updatedAt: serverTimestamp(),
    })
  },
}
