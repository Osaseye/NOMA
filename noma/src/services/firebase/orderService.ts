import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { Order, OrderStatus } from '../../types/commerce'

const ORDERS_COLLECTION = 'orders'

export const orderService = {
  subscribeOrders: (callback: (orders: Order[]) => void) => {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'))
    return onSnapshot(
      q,
      (snapshot) => {
        const ordersList: Order[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data()
          return {
            id: docSnap.id,
            customer: data.customer || '',
            phone: data.phone || '',
            status: data.status || 'placed',
            total: Number(data.total) || 0,
            deliveryFee: Number(data.deliveryFee) || 0,
            deliveryArea: data.deliveryArea || '',
            baseAmountOwed: Number(data.baseAmountOwed) || 0,
            markupEarned: Number(data.markupEarned) || 0,
            paymentRef: data.paymentRef || '',
          }
        })
        callback(ordersList)
      },
      (error) => {
        console.error('Error listening to Firestore orders:', error)
      }
    )
  },

  addOrder: async (orderData: Order) => {
    const orderId = orderData.id || `NOM-${Math.floor(100000 + Math.random() * 900000)}`
    const finalOrder = { ...orderData, id: orderId }

    await setDoc(doc(db, ORDERS_COLLECTION, orderId), {
      ...finalOrder,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return finalOrder
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus) => {
    const ref = doc(db, ORDERS_COLLECTION, orderId)
    await updateDoc(ref, {
      status,
      updatedAt: serverTimestamp(),
    })
  },

  getOrderById: async (orderId: string): Promise<Order | null> => {
    const snap = await getDoc(doc(db, ORDERS_COLLECTION, orderId))
    if (snap.exists()) {
      const data = snap.data()
      return {
        id: snap.id,
        customer: data.customer || '',
        phone: data.phone || '',
        status: data.status || 'placed',
        total: Number(data.total) || 0,
        deliveryFee: Number(data.deliveryFee) || 0,
        deliveryArea: data.deliveryArea || '',
        baseAmountOwed: Number(data.baseAmountOwed) || 0,
        markupEarned: Number(data.markupEarned) || 0,
        paymentRef: data.paymentRef || '',
      }
    }
    return null
  },
}
