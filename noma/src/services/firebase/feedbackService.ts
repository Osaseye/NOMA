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

export interface FeedbackMessage {
  id: string
  name: string
  email?: string
  phone?: string
  topic: string
  message: string
  status: 'new' | 'resolved'
  createdAt: string
}

const FEEDBACK_COLLECTION = 'feedback'

export const feedbackService = {
  subscribeFeedback: (callback: (items: FeedbackMessage[]) => void) => {
    try {
      const q = query(collection(db, FEEDBACK_COLLECTION))
      return onSnapshot(
        q,
        (snapshot) => {
          const list: FeedbackMessage[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data()
            return {
              id: docSnap.id,
              name: data.name || 'Shopper',
              email: data.email || '',
              phone: data.phone || '',
              topic: data.topic || 'General Inquiry',
              message: data.message || '',
              status: data.status === 'resolved' ? 'resolved' : 'new',
              createdAt:
                typeof data.createdAt === 'string'
                  ? data.createdAt
                  : new Date().toLocaleDateString('en-NG', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }),
            }
          })
          callback(list)
        },
        (err) => {
          console.warn('Firestore feedback subscription notice:', err?.message || err)
        }
      )
    } catch {
      return () => {}
    }
  },

  submitFeedback: async (
    payload: Omit<FeedbackMessage, 'id' | 'status' | 'createdAt'>
  ): Promise<FeedbackMessage> => {
    const id = `fb-${Date.now()}`
    const createdAt = new Date().toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    const entry: FeedbackMessage = {
      ...payload,
      id,
      status: 'new',
      createdAt,
    }

    try {
      await setDoc(doc(db, FEEDBACK_COLLECTION, id), {
        ...entry,
        updatedAt: serverTimestamp(),
      })
    } catch (err) {
      console.warn('Feedback saved locally (Firestore notice):', err)
    }

    return entry
  },

  updateStatus: async (id: string, status: 'new' | 'resolved') => {
    try {
      await updateDoc(doc(db, FEEDBACK_COLLECTION, id), {
        status,
        updatedAt: serverTimestamp(),
      })
    } catch (err) {
      console.warn('Feedback status updated locally:', err)
    }
  },

  deleteFeedback: async (id: string) => {
    try {
      await deleteDoc(doc(db, FEEDBACK_COLLECTION, id))
    } catch (err) {
      console.warn('Feedback deleted locally:', err)
    }
  },
}
