import { collection, getDocs, writeBatch } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export interface CleanupTargets {
  orders: boolean
  reviews: boolean
  feedback: boolean
  products: boolean
}

export interface CleanupResult {
  ordersDeleted: number
  reviewsDeleted: number
  feedbackDeleted: number
  productsDeleted: number
}

async function deleteCollectionDocs(collectionName: string): Promise<number> {
  const snap = await getDocs(collection(db, collectionName))
  if (snap.empty) return 0

  let deleted = 0
  const docs = snap.docs
  // Firestore writeBatch limit is 500 operations per batch
  for (let i = 0; i < docs.length; i += 400) {
    const chunk = docs.slice(i, i + 400)
    const batch = writeBatch(db)
    for (const d of chunk) {
      batch.delete(d.ref)
    }
    await batch.commit()
    deleted += chunk.length
  }
  return deleted
}

/**
 * Safely clears selected test data collections from Firestore (`noma` database)
 * before launch. Never touches `users`, `categories`, `siteSettings`, or `suppliers`.
 */
export async function clearSelectedTestData(
  targets: CleanupTargets,
): Promise<CleanupResult> {
  const result: CleanupResult = {
    ordersDeleted: 0,
    reviewsDeleted: 0,
    feedbackDeleted: 0,
    productsDeleted: 0,
  }

  if (targets.orders) {
    result.ordersDeleted = await deleteCollectionDocs('orders')
    try {
      localStorage.removeItem('noma_recent_order_ids')
    } catch {
      // Ignore storage errors
    }
  }

  if (targets.reviews) {
    result.reviewsDeleted = await deleteCollectionDocs('reviews')
  }

  if (targets.feedback) {
    result.feedbackDeleted = await deleteCollectionDocs('feedback')
  }

  if (targets.products) {
    result.productsDeleted = await deleteCollectionDocs('products')
  }

  return result
}
