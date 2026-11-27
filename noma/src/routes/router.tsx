import { lazy, Suspense, type ComponentType } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AnimatedPageShell } from '../components/ui/MotionPrimitives'
import { StorefrontLayout } from '../layouts/StorefrontLayout'
import { HomePage } from '../pages/storefront/HomePage'
import { RouteErrorPage } from '../pages/RouteErrorPage'

function lazyView<P extends object = Record<string, never>>(
  loader: () => Promise<ComponentType<P>>,
  props?: P,
) {
  const Component = lazy(async () => ({ default: await loader() }))
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <AnimatedPageShell>
        <Component {...((props ?? {}) as P)} />
      </AnimatedPageShell>
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    element: <StorefrontLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: '/',
        element: (
          <AnimatedPageShell>
            <HomePage />
          </AnimatedPageShell>
        ),
      },
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
        path: '/orders/:orderId',
        element: lazyView(() =>
          import('../pages/storefront/CustomerOrderDetailPage').then(
            (m) => m.CustomerOrderDetailPage,
          ),
        ),
      },
      {
        path: '/track-order',
        element: lazyView(() =>
          import('../pages/storefront/MyOrdersPage').then((m) => m.MyOrdersPage),
        ),
      },
      {
        path: '/track-order/:orderId',
        element: lazyView(() =>
          import('../pages/storefront/CustomerOrderDetailPage').then(
            (m) => m.CustomerOrderDetailPage,
          ),
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
    errorElement: <RouteErrorPage />,
    element: lazyView(() => import('../pages/admin/LoginPage').then((m) => m.LoginPage)),
  },
  {
    path: '/admin/register',
    errorElement: <RouteErrorPage />,
    element: lazyView(() =>
      import('../pages/admin/AdminRegisterPage').then((m) => m.AdminRegisterPage),
    ),
  },
  {
    path: '/admin',
    errorElement: <RouteErrorPage />,
    element: lazyView(() =>
      import('../components/auth/AdminProtectedRoute').then((m) => m.AdminProtectedRoute),
    ),
    children: [
      {
        element: lazyView(() => import('../layouts/AdminLayout').then((m) => m.AdminLayout)),
        errorElement: <RouteErrorPage />,
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
            path: 'categories/new',
            element: lazyView(() =>
              import('../pages/admin/CategoryEditorPage').then((m) => m.CategoryEditorPage),
            ),
          },
          {
            path: 'categories/:categoryId/edit',
            element: lazyView(() =>
              import('../pages/admin/CategoryEditorPage').then((m) => m.CategoryEditorPage),
            ),
          },
          {
            path: 'customers',
            element: lazyView(() =>
              import('../pages/admin/CustomersPage').then((m) => m.CustomersPage),
            ),
          },
          {
            path: 'feedback',
            element: lazyView(() =>
              import('../pages/admin/FeedbackPage').then((m) => m.FeedbackPage),
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
            path: 'suppliers/new',
            element: lazyView(() =>
              import('../pages/admin/SupplierEditorPage').then((m) => m.SupplierEditorPage),
            ),
          },
          {
            path: 'suppliers/:supplierId/edit',
            element: lazyView(() =>
              import('../pages/admin/SupplierEditorPage').then((m) => m.SupplierEditorPage),
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
