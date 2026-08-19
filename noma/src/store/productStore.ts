import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Category, Customer, Order, OrderStatus, Product, ProductReview, SubCategory } from '../types/commerce'
import { productService } from '../services/firebase/productService'
import { categoryService } from '../services/firebase/categoryService'
import { orderService } from '../services/firebase/orderService'
import { reviewService } from '../services/firebase/reviewService'

let firebaseUnsubscribe: (() => void) | null = null

interface ProductStoreState {
  products: Product[]
  categories: Category[]
  orders: Order[]
  customers: Customer[]
  reviews: ProductReview[]

  // Initialize Firebase Realtime Subscriptions
  initFirebaseListeners: () => () => void

  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  toggleStockStatus: (id: string) => void
  updateStockQuantity: (id: string, qty: number) => void
  setProducts: (products: Product[]) => void

  // Category & Subcategory actions
  addCategory: (category: Category) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void
  setCategories: (categories: Category[]) => void
  addSubCategory: (parentId: string, subCategory: SubCategory) => void
  deleteSubCategory: (parentId: string, subCategoryId: string) => void

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
    (set, get) => ({
      products: [],
      categories: [],
      orders: [],
      customers: [],
      reviews: [],

      initFirebaseListeners: () => {
        if (firebaseUnsubscribe) {
          return firebaseUnsubscribe
        }

        const unsubProducts = productService.subscribeProducts((productsList) => {
          set({ products: productsList })
        })

        const unsubCategories = categoryService.subscribeCategories((categoriesList) => {
          set({ categories: categoriesList })
        })

        const unsubOrders = orderService.subscribeOrders((ordersList) => {
          set({ orders: ordersList })
        })

        const unsubReviews = reviewService.subscribeReviews((reviewsList) => {
          set({ reviews: reviewsList })
        })

        firebaseUnsubscribe = () => {
          unsubProducts()
          unsubCategories()
          unsubOrders()
          unsubReviews()
          firebaseUnsubscribe = null
        }

        return firebaseUnsubscribe
      },

      addProduct: async (productData) => {
        const id = `p-${Date.now()}`
        const newProduct: Product = {
          ...productData,
          id,
          slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        }
        set((state) => ({ products: [newProduct, ...state.products] }))

        try {
          const created = await productService.addProduct(productData)
          // Update the optimistic entry with final created object if needed
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? created : p)),
          }))
          return created
        } catch (err) {
          // Rollback on failure
          set((state) => ({ products: state.products.filter((p) => p.id !== id) }))
          throw err
        }
      },

      updateProduct: async (id, updates) => {
        const original = get().products.find((p) => p.id === id)
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }))
        try {
          await productService.updateProduct(id, updates)
        } catch (err) {
          if (original) {
            set((state) => ({
              products: state.products.map((p) => (p.id === id ? original : p)),
            }))
          }
          throw err
        }
      },

      deleteProduct: async (id) => {
        const original = get().products.find((p) => p.id === id)
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }))
        try {
          await productService.deleteProduct(id)
        } catch (err) {
          if (original) {
            set((state) => ({ products: [...state.products, original] }))
          }
          throw err
        }
      },

      toggleStockStatus: (id) => {
        const product = get().products.find((p) => p.id === id)
        const currentQty = product?.stockQty || 0
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stockQty: currentQty > 0 ? 0 : 10 } : p
          ),
        }))
        productService.toggleStockStatus(id, currentQty).catch((err) => {
          console.error('Failed to toggle stock status in Firestore:', err)
        })
      },

      updateStockQuantity: (id, qty) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, stockQty: Math.max(0, qty) } : p)),
        }))
        productService.updateStockQuantity(id, qty).catch((err) => {
          console.error('Failed to update stock quantity in Firestore:', err)
        })
      },

      setProducts: (products) => set({ products }),

      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category],
        }))
        categoryService.addCategory(category).catch((err) => {
          console.error('Failed to add category to Firestore:', err)
        })
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }))
        categoryService.updateCategory(id, updates).catch((err) => {
          console.error('Failed to update category in Firestore:', err)
        })
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }))
        categoryService.deleteCategory(id).catch((err) => {
          console.error('Failed to delete category from Firestore:', err)
        })
      },

      setCategories: (categories) => set({ categories }),

      addSubCategory: (parentId, subCategory) => {
        set((state) => ({
          categories: state.categories.map((c) => {
            if (c.id === parentId) {
              const subs = c.subcategories || []
              return { ...c, subcategories: [...subs, subCategory] }
            }
            return c
          }),
        }))
        categoryService.addSubCategory(parentId, subCategory).catch((err) => {
          console.error('Failed to add subcategory to Firestore:', err)
        })
      },

      deleteSubCategory: (parentId, subCategoryId) => {
        set((state) => ({
          categories: state.categories.map((c) => {
            if (c.id === parentId) {
              const subs = c.subcategories || []
              return { ...c, subcategories: subs.filter((s) => s.id !== subCategoryId) }
            }
            return c
          }),
        }))
        categoryService.deleteSubCategory(parentId, subCategoryId).catch((err) => {
          console.error('Failed to delete subcategory from Firestore:', err)
        })
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        }))
        orderService.updateOrderStatus(orderId, status).catch((err) => {
          console.error('Failed to update order status in Firestore:', err)
        })
      },

      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }))
        orderService.addOrder(order).catch((err) => {
          console.error('Failed to add order to Firestore:', err)
        })
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
          return { reviews: updatedReviews }
        })
        reviewService.addReview(newReview).catch((err) => {
          console.error('Failed to add review to Firestore:', err)
        })
      },

      updateReviewStatus: (reviewId, status) => {
        set((state) => {
          const updatedReviews = state.reviews.map((r) => (r.id === reviewId ? { ...r, status } : r))
          return { reviews: updatedReviews }
        })
        reviewService.updateReviewStatus(reviewId, status).catch((err) => {
          console.error('Failed to update review status in Firestore:', err)
        })
      },

      deleteReview: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== reviewId),
        }))
        reviewService.deleteReview(reviewId).catch((err) => {
          console.error('Failed to delete review from Firestore:', err)
        })
      },

      setReviews: (reviews) => set({ reviews }),

      clearAllData: () => set({ products: [], categories: [], orders: [], customers: [], reviews: [] }),
    }),
    {
      name: 'noma_product_store_v3',
    }
  )
)
