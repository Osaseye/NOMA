export type CategoryId = 'electronics' | 'appliances' | 'cooking' | 'bicycles' | 'wines' | 'general'

export type OrderStatus = 'placed' | 'packed' | 'dispatched' | 'delivered'

export type Product = {
  id: string
  slug: string
  name: string
  category: CategoryId
  finalPrice: number
  basePrice: number
  stockQty: number
  rating: number
  image: string
  badge: string
  bulky?: boolean
  description: string
  specs: string[]
}

export type Category = {
  id: CategoryId
  label: string
  defaultMarkupPercent: number
  merchandisingLine: string
}

export type CartLine = {
  productId: string
  quantity: number
}

export type Order = {
  id: string
  customer: string
  phone: string
  status: OrderStatus
  total: number
  deliveryFee: number
  deliveryArea: string
  baseAmountOwed: number
  markupEarned: number
  paymentRef: string
}

export type Customer = {
  id: string
  name: string
  phone: string
  lifetimeValue: number
  orders: number
}
