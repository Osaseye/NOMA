import { useProductStore } from '../store/productStore'
import type { CategoryId, OrderStatus } from '../types/commerce'

const delay = 100

function mock<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), delay)
  })
}

export const commerceService = {
  getProducts: () => mock(useProductStore.getState().products),
  getProductBySlug: (slug: string | undefined) => mock(useProductStore.getState().products.find((p) => p.slug === slug)),
  getProductsByCategory: (categoryId: CategoryId | string | undefined) =>
    mock(useProductStore.getState().products.filter((p) => p.category === categoryId)),
  searchProducts: (query: string) =>
    mock(useProductStore.getState().products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))),
  getCategories: () => mock(useProductStore.getState().categories),
  getOrders: () => mock(useProductStore.getState().orders),
  getOrder: (orderId: string | undefined) => mock(useProductStore.getState().orders.find((o) => o.id === orderId)),
  getCustomers: () => mock(useProductStore.getState().customers),
  getAnalytics: () => mock([]),
  estimateDelivery: (area: string) => mock(area.toLowerCase().includes('lekki') ? 6500 : 4500),
  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    useProductStore.getState().updateOrderStatus(orderId, status)
    return mock({ orderId, status })
  },
}
