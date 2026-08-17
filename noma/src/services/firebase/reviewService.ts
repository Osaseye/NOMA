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
import type { ProductReview } from '../../types/commerce'

const REVIEWS_COLLECTION = 'reviews'

export const reviewService = {
  subscribeReviews: (callback: (reviews: ProductReview[]) => void) => {
    try {
      const q = query(collection(db, REVIEWS_COLLECTION))
      return onSnapshot(
        q,
        (snapshot) => {
          const list: ProductReview[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data()
            return {
              id: docSnap.id,
              productId: data.productId || '',
              productName: data.productName || '',
              author: data.author || 'Anonymous',
              email: data.email || '',
              rating: Number(data.rating) || 5,
              date: data.date || '',
              title: data.title || '',
              comment: data.comment || '',
              verifiedPurchase: Boolean(data.verifiedPurchase),
              status: data.status || 'approved',
            }
          })
          callback(list)
        },
        (error) => {
          console.warn('Firestore reviews listener notice:', error?.message || error)
          callback([])
        }
      )
    } catch (e) {
      console.warn('Firestore reviews catch notice:', e)
      return () => {}
    }
  },

  addReview: async (reviewData: Omit<ProductReview, 'id'>) => {
    const customId = `rev-${Date.now()}`
    const newReview: ProductReview = {
      ...reviewData,
      id: customId,
    }

    await setDoc(doc(db, REVIEWS_COLLECTION, customId), {
      ...newReview,
      createdAt: serverTimestamp(),
    })

    return newReview
  },

  updateReviewStatus: async (reviewId: string, status: 'approved' | 'pending' | 'rejected') => {
    await updateDoc(doc(db, REVIEWS_COLLECTION, reviewId), {
      status,
      updatedAt: serverTimestamp(),
    })
  },

  deleteReview: async (reviewId: string) => {
    await deleteDoc(doc(db, REVIEWS_COLLECTION, reviewId))
  },
}
