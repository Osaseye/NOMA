import { analytics, categories, customers, orders, products } from '../mock/commerce'
import type { CategoryId, OrderStatus } from '../types/commerce'

const delay = 180

function mock<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), delay)
  })
}

export const commerceService = {
  getProducts: () => mock(products),
  getProductBySlug: (slug: string | undefined) => mock(products.find((product) => product.slug === slug) ?? products[0]),
  getProductsByCategory: (categoryId: CategoryId | undefined) => mock(products.filter((product) => product.category === categoryId)),
  searchProducts: (query: string) => mock(products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))),
  getCategories: () => mock(categories),
  getOrders: () => mock(orders),
  getOrder: (orderId: string | undefined) => mock(orders.find((order) => order.id === orderId) ?? orders[0]),
  getCustomers: () => mock(customers),
  getAnalytics: () => mock(analytics),
  estimateDelivery: (area: string) => mock(area.toLowerCase().includes('lekki') ? 6500 : 4500),
  updateOrderStatus: (orderId: string, status: OrderStatus) => mock({ orderId, status }),
}
