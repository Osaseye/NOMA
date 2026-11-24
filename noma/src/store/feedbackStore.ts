import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  feedbackService,
  type FeedbackMessage,
} from '../services/firebase/feedbackService'

let feedbackUnsubscribe: (() => void) | null = null

interface FeedbackState {
  items: FeedbackMessage[]
  initFeedbackListener: () => () => void
  submitFeedback: (
    payload: Omit<FeedbackMessage, 'id' | 'status' | 'createdAt'>
  ) => Promise<FeedbackMessage>
  markStatus: (id: string, status: 'new' | 'resolved') => Promise<void>
  deleteFeedback: (id: string) => Promise<void>
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set) => ({
      items: [],

      initFeedbackListener: () => {
        if (!feedbackUnsubscribe) {
          feedbackUnsubscribe = feedbackService.subscribeFeedback((remoteItems) => {
            if (remoteItems.length > 0) {
              set({ items: remoteItems })
            }
          })
        }
        return () => {
          if (feedbackUnsubscribe) {
            feedbackUnsubscribe()
            feedbackUnsubscribe = null
          }
        }
      },

      submitFeedback: async (payload) => {
        const created = await feedbackService.submitFeedback(payload)
        set((state) => ({ items: [created, ...state.items] }))
        return created
      },

      markStatus: async (id, status) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, status } : item
          ),
        }))
        await feedbackService.updateStatus(id, status)
      },

      deleteFeedback: async (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
        await feedbackService.deleteFeedback(id)
      },
    }),
    {
      name: 'noma_feedback_store_v1',
    }
  )
)

useFeedbackStore.getState().initFeedbackListener()
