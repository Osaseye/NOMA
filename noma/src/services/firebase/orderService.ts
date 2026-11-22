import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { Order, OrderItem, OrderStatus } from '../../types/commerce'

const ORDERS_COLLECTION = 'orders'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => stripUndefined(item)) as unknown as T
  }
  if (isPlainObject(value)) {
    const cleaned: Record<string, unknown> = {}
    for (const [key, entry] of Object.entries(value)) {
      if (entry !== undefined) {
        cleaned[key] = stripUndefined(entry)
      }
    }
    return cleaned as T
  }
  return value
}

function normalizeTimestamp(raw: unknown): string | undefined {
  if (typeof raw === 'string') {
    return raw
  }
  if (raw && typeof raw === 'object') {
    if ('toDate' in raw && typeof (raw as { toDate: () => Date }).toDate === 'function') {
      return (raw as { toDate: () => Date }).toDate().toISOString()
    }
    if ('seconds' in raw && typeof (raw as { seconds: number }).seconds === 'number') {
      return new Date((raw as { seconds: number }).seconds * 1000).toISOString()
    }
  }
  return undefined
}

function mapOrderItems(rawItems: unknown): OrderItem[] | undefined {
  if (!Array.isArray(rawItems)) return undefined
  return rawItems
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => ({
      productId: String(item.productId || ''),
      slug: String(item.slug || ''),
      name: String(item.name || ''),
      image: String(item.image || ''),
      unitPrice: Number(item.unitPrice) || 0,
      basePrice: Number(item.basePrice) || 0,
      quantity: Math.max(1, Number(item.quantity) || 1),
      ...(typeof item.size === 'string' && item.size ? { size: item.size } : {}),
    }))
}

function mapFirestoreOrder(id: string, data: DocumentData): Order {
  const deliveryMethod =
    data.deliveryMethod === 'standard' || data.deliveryMethod === 'express'
      ? data.deliveryMethod
      : undefined

  return {
    id,
    customer: String(data.customer || ''),
    phone: String(data.phone || ''),
    status: (data.status as OrderStatus) || 'placed',
    total: Number(data.total) || 0,
    deliveryFee: Number(data.deliveryFee) || 0,
    deliveryArea: String(data.deliveryArea || ''),
    baseAmountOwed: Number(data.baseAmountOwed) || 0,
    markupEarned: Number(data.markupEarned) || 0,
    paymentRef: String(data.paymentRef || ''),
    items: mapOrderItems(data.items),
    email: typeof data.email === 'string' ? data.email : undefined,
    deliveryMethod,
    paymentMethod: typeof data.paymentMethod === 'string' ? data.paymentMethod : undefined,
    address: typeof data.address === 'string' ? data.address : undefined,
    city: typeof data.city === 'string' ? data.city : undefined,
    state: typeof data.state === 'string' ? data.state : undefined,
    neighborhood: typeof data.neighborhood === 'string' ? data.neighborhood : undefined,
    createdAt: normalizeTimestamp(data.createdAt),
    userId: typeof data.userId === 'string' ? data.userId : undefined,
  }
}

function generateOrderId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    const sixDigit = 100000 + (buf[0] % 900000)
    return `NMA-${sixDigit}`
  }
  const suffix = Date.now().toString().slice(-6)
  return `NMA-${suffix}`
}

export const orderService = {
  subscribeOrders: (callback: (orders: Order[]) => void) => {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'))
    return onSnapshot(
      q,
      (snapshot) => {
        const ordersList: Order[] = snapshot.docs.map((docSnap) =>
          mapFirestoreOrder(docSnap.id, docSnap.data())
        )
        callback(ordersList)
      },
      (error) => {
        console.warn('Firestore orders listener notice:', error?.message || error)
      }
    )
  },

  addOrder: async (orderData: Order): Promise<Order> => {
    const orderId = orderData.id?.trim() || generateOrderId()
    const createdAtIso = orderData.createdAt || new Date().toISOString()

    const finalOrder: Order = stripUndefined({
      ...orderData,
      id: orderId,
      createdAt: createdAtIso,
    })

    const firestorePayload = stripUndefined({
      ...finalOrder,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    await setDoc(doc(db, ORDERS_COLLECTION, orderId), firestorePayload)
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
    const cleanId = orderId.trim()
    if (!cleanId) return null

    const snap = await getDoc(doc(db, ORDERS_COLLECTION, cleanId))
    if (snap.exists()) {
      return mapFirestoreOrder(snap.id, snap.data())
    }
    return null
  },

  findOrderByRef: async (queryStr: string): Promise<Order | null> => {
    const cleanId = queryStr.trim()
    if (!cleanId) return null

    const candidates = Array.from(new Set([cleanId, cleanId.toUpperCase()]))

    for (const candidate of candidates) {
      try {
        const directSnap = await getDoc(doc(db, ORDERS_COLLECTION, candidate))
        if (directSnap.exists()) {
          return mapFirestoreOrder(directSnap.id, directSnap.data())
        }
      } catch (err) {
        console.warn('Order direct lookup error:', err)
      }
    }

    for (const candidate of candidates) {
      try {
        const refQuery = query(
          collection(db, ORDERS_COLLECTION),
          where('paymentRef', '==', candidate),
          limit(1)
        )
        const querySnap = await getDocs(refQuery)
        if (!querySnap.empty) {
          const docSnap = querySnap.docs[0]
          return mapFirestoreOrder(docSnap.id, docSnap.data())
        }
      } catch (err) {
        // Guest list queries on paymentRef are blocked when Firestore list rules require auth;
        // direct order ID lookup above still succeeds for guest tracking.
        console.warn('Order paymentRef lookup notice:', err)
      }
    }

    return null
  },
}
