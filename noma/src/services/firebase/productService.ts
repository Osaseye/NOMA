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
            finalPrice: Number(data.finalPrice) || 0,
            basePrice: Number(data.basePrice) || 0,
            stockQty: Number(data.stockQty) || 0,
            rating: Number(data.rating) || 5,
            reviewsCount: Number(data.reviewsCount) || 0,
            image: data.image || '',
            badge: data.badge || '',
            discountBadge: data.discountBadge || '',
            brand: data.brand || '',
            bulky: Boolean(data.bulky),
            description: data.description || '',
            specs: Array.isArray(data.specs) ? data.specs : [],
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

    await setDoc(doc(db, PRODUCTS_COLLECTION, customId), {
      ...newProduct,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return newProduct
  },

  updateProduct: async (id: string, updates: Partial<Product>) => {
    const ref = doc(db, PRODUCTS_COLLECTION, id)
    await updateDoc(ref, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  },

  deleteProduct: async (id: string) => {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id))
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
