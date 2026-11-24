import { lazy, Suspense, type ComponentType } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { StorefrontLayout } from '../layouts/StorefrontLayout'
import { HomePage } from '../pages/storefront/HomePage'
import { StorefrontErrorPage } from '../pages/storefront/StorefrontErrorPage'

function lazyView<P extends object = Record<string, never>>(
  loader: () => Promise<ComponentType<P>>,
  props?: P,
) {
  const Component = lazy(async () => ({ default: await loader() }))
  return (
    <Suspense fallback={null}>
      <Component {...((props ?? {}) as P)} />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    element: <StorefrontLayout />,
    errorElement: <StorefrontErrorPage />,
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: '/catalog',
        element: lazyView(() => import('../pages/storefront/CatalogPage').then((m) => m.CatalogPage)),
      },
      {
        path: '/categories',
        element: lazyView(() => import('../pages/storefront/CatalogPage').then((m) => m.CatalogPage)),
      },
      {
        path: '/category/:categoryId',
        element: lazyView(() => import('../pages/storefront/CatalogPage').then((m) => m.CatalogPage)),
      },
      {
        path: '/search',
        element: lazyView(() => import('../pages/storefront/SearchPage').then((m) => m.SearchPage)),
      },
      {
        path: '/product/:slug',
        element: lazyView(() =>
          import('../pages/storefront/ProductDetailPage').then((m) => m.ProductDetailPage),
        ),
      },
      {
        path: '/cart',
        element: lazyView(() => import('../pages/storefront/CartPage').then((m) => m.CartPage)),
      },
      {
        path: '/checkout',
        element: lazyView(() =>
          import('../pages/storefront/CheckoutPage').then((m) => m.CheckoutPage),
        ),
      },
      {
        path: '/order-success',
        element: lazyView(() =>
          import('../pages/storefront/OrderSuccessPage').then((m) => m.OrderSuccessPage),
        ),
      },
      {
        path: '/orders',
        element: lazyView(() =>
          import('../pages/storefront/MyOrdersPage').then((m) => m.MyOrdersPage),
        ),
      },
      {
        path: '/track-order',
        element: lazyView(() =>
          import('../pages/storefront/MyOrdersPage').then((m) => m.MyOrdersPage),
        ),
      },
      {
        path: '/wishlist',
        element: lazyView(() =>
          import('../pages/storefront/WishlistPage').then((m) => m.WishlistPage),
        ),
      },
      {
        path: '/account',
        element: lazyView(() =>
          import('../pages/storefront/AccountPage').then((m) => m.AccountPage),
        ),
      },
      {
        path: '/whatsapp-order',
        element: lazyView(() =>
          import('../pages/storefront/WhatsAppOrderPage').then((m) => m.WhatsAppOrderPage),
        ),
      },
      {
        path: '/about',
        element: lazyView(
          () => import('../pages/storefront/StaticInfoPage').then((m) => m.StaticInfoPage),
          { type: 'about' },
        ),
      },
      {
        path: '/support',
        element: lazyView(
          () => import('../pages/storefront/StaticInfoPage').then((m) => m.StaticInfoPage),
          { type: 'support' },
        ),
      },
      {
        path: '/help',
        element: lazyView(
          () => import('../pages/storefront/StaticInfoPage').then((m) => m.StaticInfoPage),
          { type: 'support' },
        ),
      },
      {
        path: '/contact',
        element: lazyView(
          () => import('../pages/storefront/StaticInfoPage').then((m) => m.StaticInfoPage),
          { type: 'support' },
        ),
      },
      {
        path: '/faq',
        element: lazyView(
          () => import('../pages/storefront/StaticInfoPage').then((m) => m.StaticInfoPage),
          { type: 'faq' },
        ),
      },
      {
        path: '/returns',
        element: lazyView(
          () => import('../pages/storefront/StaticInfoPage').then((m) => m.StaticInfoPage),
          { type: 'returns' },
        ),
      },
      {
        path: '/privacy',
        element: lazyView(
          () => import('../pages/storefront/StaticInfoPage').then((m) => m.StaticInfoPage),
          { type: 'privacy' },
        ),
      },
      {
        path: '/terms',
        element: lazyView(
          () => import('../pages/storefront/StaticInfoPage').then((m) => m.StaticInfoPage),
          { type: 'terms' },
        ),
      },
      {
        path: '/delivery-policy',
        element: lazyView(
          () => import('../pages/storefront/StaticInfoPage').then((m) => m.StaticInfoPage),
          { type: 'delivery' },
        ),
      },
      {
        path: '/policies',
        element: lazyView(
          () => import('../pages/storefront/StaticInfoPage').then((m) => m.StaticInfoPage),
          { type: 'policies' },
        ),
      },
    ],
  },
  {
    path: '/admin/login',
    element: lazyView(() => import('../pages/admin/LoginPage').then((m) => m.LoginPage)),
  },
  {
    path: '/admin/register',
    element: lazyView(() =>
      import('../pages/admin/AdminRegisterPage').then((m) => m.AdminRegisterPage),
    ),
  },
  {
    path: '/admin',
    element: lazyView(() =>
      import('../components/auth/AdminProtectedRoute').then((m) => m.AdminProtectedRoute),
    ),
    children: [
      {
        element: lazyView(() => import('../layouts/AdminLayout').then((m) => m.AdminLayout)),
        children: [
          {
            index: true,
            element: lazyView(() =>
              import('../pages/admin/DashboardPage').then((m) => m.DashboardPage),
            ),
          },
          {
            path: 'orders',
            element: lazyView(() =>
              import('../pages/admin/OrdersPage').then((m) => m.OrdersPage),
            ),
          },
          {
            path: 'orders/:orderId',
            element: lazyView(() =>
              import('../pages/admin/OrderDetailPage').then((m) => m.OrderDetailPage),
            ),
          },
          {
            path: 'products',
            element: lazyView(() =>
              import('../pages/admin/ProductsPage').then((m) => m.ProductsPage),
            ),
          },
          {
            path: 'products/new',
            element: lazyView(() =>
              import('../pages/admin/ProductEditorPage').then((m) => m.ProductEditorPage),
            ),
          },
          {
            path: 'products/:productId/edit',
            element: lazyView(() =>
              import('../pages/admin/ProductEditorPage').then((m) => m.ProductEditorPage),
            ),
          },
          {
            path: 'inventory',
            element: lazyView(() =>
              import('../pages/admin/InventoryPage').then((m) => m.InventoryPage),
            ),
          },
          {
            path: 'categories',
            element: lazyView(() =>
              import('../pages/admin/CategoriesPage').then((m) => m.CategoriesPage),
            ),
          },
          {
            path: 'customers',
            element: lazyView(() =>
              import('../pages/admin/CustomersPage').then((m) => m.CustomersPage),
            ),
          },
          {
            path: 'revenue',
            element: lazyView(() =>
              import('../pages/admin/RevenuePage').then((m) => m.RevenuePage),
            ),
          },
          {
            path: 'profit',
            element: lazyView(() =>
              import('../pages/admin/ProfitPage').then((m) => m.ProfitPage),
            ),
          },
          {
            path: 'suppliers',
            element: lazyView(() =>
              import('../pages/admin/SuppliersPage').then((m) => m.SuppliersPage),
            ),
          },
          {
            path: 'reports',
            element: lazyView(() =>
              import('../pages/admin/ReportsPage').then((m) => m.ReportsPage),
            ),
          },
          {
            path: 'reviews',
            element: lazyView(() =>
              import('../pages/admin/ReviewsPage').then((m) => m.ReviewsPage),
            ),
          },
          {
            path: 'settings',
            element: lazyView(() =>
              import('../pages/admin/SettingsPage').then((m) => m.SettingsPage),
            ),
          },
        ],
      },
    ],
  },
])
