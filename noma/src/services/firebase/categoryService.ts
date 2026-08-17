import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  arrayUnion,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { Category, SubCategory } from '../../types/commerce'

const CATEGORIES_COLLECTION = 'categories'

export const categoryService = {
  subscribeCategories: (callback: (categories: Category[]) => void) => {
    return onSnapshot(
      collection(db, CATEGORIES_COLLECTION),
      (snapshot) => {
        const list: Category[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data()
          return {
            id: docSnap.id,
            label: data.label || '',
            defaultMarkupPercent: Number(data.defaultMarkupPercent) || 0,
            merchandisingLine: data.merchandisingLine || '',
            image: data.image || '',
            subcategories: Array.isArray(data.subcategories) ? data.subcategories : [],
          }
        })
        callback(list)
      },
      (error) => {
        console.error('Error listening to Firestore categories:', error)
      }
    )
  },

  addCategory: async (category: Category) => {
    const docId = category.id || `cat-${Date.now()}`
    await setDoc(doc(db, CATEGORIES_COLLECTION, docId), {
      ...category,
      id: docId,
      subcategories: category.subcategories || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  },

  updateCategory: async (id: string, updates: Partial<Category>) => {
    await updateDoc(doc(db, CATEGORIES_COLLECTION, id), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  },

  deleteCategory: async (id: string) => {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, id))
  },

  addSubCategory: async (parentId: string, subCategory: SubCategory) => {
    const ref = doc(db, CATEGORIES_COLLECTION, parentId)
    await updateDoc(ref, {
      subcategories: arrayUnion(subCategory),
      updatedAt: serverTimestamp(),
    })
  },

  deleteSubCategory: async (parentId: string, subCategoryId: string) => {
    const ref = doc(db, CATEGORIES_COLLECTION, parentId)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      const data = snap.data()
      const subs: SubCategory[] = data.subcategories || []
      const filtered = subs.filter((s) => s.id !== subCategoryId)
      await updateDoc(ref, {
        subcategories: filtered,
        updatedAt: serverTimestamp(),
      })
    }
  },
}
