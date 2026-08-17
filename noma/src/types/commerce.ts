export type CategoryId =
  | 'electronics'
  | 'appliances'
  | 'cooking'
  | 'kitchen'
  | 'phones'
  | 'home-essentials'
  | 'outdoor'
  | 'bicycles'
  | 'wines'
  | 'general'
  | 'clothing'

export type OrderStatus = 'placed' | 'processing' | 'packed' | 'dispatched' | 'delivered' | 'cancelled'

export type ProductReview = {
  id: string
  productId: string
  productName?: string
  author: string
  email?: string
  rating: number
  date: string
  title?: string
  comment: string
  verifiedPurchase?: boolean
  status: 'approved' | 'pending' | 'rejected'
}

export type Product = {
  id: string
  slug: string
  name: string
  category: CategoryId
  subCategory?: string
  subcategory?: string
  finalPrice: number
  basePrice: number
  stockQty: number
  rating: number
  reviewsCount?: number
  image: string
  badge: string
  discountBadge?: string
  brand?: string
  bulky?: boolean
  description: string
  specs: string[]
}

export type SubCategory = {
  id: string
  label: string
  parentId: string
  image?: string
  ageGroup?: 'Adults' | 'Children' | 'Babies' | 'All Ages'
  genderTarget?: 'Men' | 'Women' | 'Unisex' | 'Boys' | 'Girls'
}

export type Category = {
  id: CategoryId | string
  label: string
  defaultMarkupPercent: number
  merchandisingLine: string
  image?: string
  subcategories?: SubCategory[]
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
  email?: string
  lifetimeValue: number
  orders: number
  isGuest?: boolean
}
