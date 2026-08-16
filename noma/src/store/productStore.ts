import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Category, Customer, Order, OrderStatus, Product, ProductReview } from '../types/commerce'

interface ProductStoreState {
  products: Product[]
  categories: Category[]
  orders: Order[]
  customers: Customer[]
  reviews: ProductReview[]
  
  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => Product
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  toggleStockStatus: (id: string) => void
  updateStockQuantity: (id: string, qty: number) => void
  setProducts: (products: Product[]) => void
  
  // Category actions
  addCategory: (category: Category) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void
  setCategories: (categories: Category[]) => void
  
  // Order actions
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  addOrder: (order: Order) => void
  setOrders: (orders: Order[]) => void

  // Customer actions
  setCustomers: (customers: Customer[]) => void

  // Review actions
  addReview: (review: Omit<ProductReview, 'id' | 'date' | 'status'> & { date?: string; status?: 'approved' | 'pending' | 'rejected' }) => void
  updateReviewStatus: (reviewId: string, status: 'approved' | 'pending' | 'rejected') => void
  deleteReview: (reviewId: string) => void
  setReviews: (reviews: ProductReview[]) => void
  
  // Backend Integration Helper
  clearAllData: () => void
}

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set) => ({
      products: [],
      categories: [],
      orders: [],
      customers: [],
      reviews: [],

      addProduct: (productData) => {
        const id = `p-${Date.now()}`
        const newProduct: Product = {
          ...productData,
          id,
          slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        }
        set((state) => ({ products: [newProduct, ...state.products] }))
        return newProduct
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }))
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }))
      },

      toggleStockStatus: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, stockQty: p.stockQty > 0 ? 0 : 10 }
              : p
          ),
        }))
      },

      updateStockQuantity: (id, qty) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, stockQty: Math.max(0, qty) } : p)),
        }))
      },

      setProducts: (products) => set({ products }),

      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category],
        }))
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }))
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }))
      },

      setCategories: (categories) => set({ categories }),

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        }))
      },

      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }))
      },

      setOrders: (orders) => set({ orders }),

      setCustomers: (customers) => set({ customers }),

      addReview: (reviewData) => {
        const id = `rev-${Date.now()}`
        const newReview: ProductReview = {
          id,
          productId: reviewData.productId,
          productName: reviewData.productName,
          author: reviewData.author,
          email: reviewData.email,
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
          verifiedPurchase: reviewData.verifiedPurchase ?? true,
          date: reviewData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: reviewData.status || 'approved',
        }
        set((state) => {
          const updatedReviews = [newReview, ...state.reviews]
          // Recalculate product rating & reviewsCount
          const productRevs = updatedReviews.filter(r => r.productId === reviewData.productId && r.status === 'approved')
          const avgRating = productRevs.length > 0 
            ? Number((productRevs.reduce((acc, r) => acc + r.rating, 0) / productRevs.length).toFixed(1))
            : 5.0

          const updatedProducts = state.products.map(p => 
            p.id === reviewData.productId
              ? { ...p, rating: avgRating, reviewsCount: productRevs.length }
              : p
          )

          return { reviews: updatedReviews, products: updatedProducts }
        })
      },

      updateReviewStatus: (reviewId, status) => {
        set((state) => {
          const updatedReviews = state.reviews.map((r) => (r.id === reviewId ? { ...r, status } : r))
          return { reviews: updatedReviews }
        })
      },

      deleteReview: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== reviewId),
        }))
      },

      setReviews: (reviews) => set({ reviews }),

      clearAllData: () => set({ products: [], categories: [], orders: [], customers: [], reviews: [] }),
    }),
    {
      name: 'noma_product_store_v3',
    }
  )
)
