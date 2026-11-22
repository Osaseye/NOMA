import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { ProductReview } from '../../types/commerce'

const REVIEWS_COLLECTION = 'reviews'

function stripUndefinedFields(obj: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = value
    }
  }
  return cleaned
}

export const reviewService = {
  subscribeReviews: (
    callback: (reviews: ProductReview[]) => void,
    options?: { approvedOnly?: boolean }
  ) => {
    try {
      const approvedOnly = options?.approvedOnly ?? true
      const reviewsCol = collection(db, REVIEWS_COLLECTION)
      const q = approvedOnly
        ? query(reviewsCol, where('status', '==', 'approved'))
        : query(reviewsCol)

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

  addReview: async (reviewData: Omit<ProductReview, 'id'> & { id?: string }) => {
    const customId = reviewData.id?.trim() || `rev-${Date.now()}`
    const newReview: ProductReview = {
      ...reviewData,
      id: customId,
    }

    const payload = stripUndefinedFields(newReview as unknown as Record<string, unknown>)

    await setDoc(doc(db, REVIEWS_COLLECTION, customId), {
      ...payload,
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
