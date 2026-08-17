import { createBrowserRouter } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout'
import { StorefrontLayout } from '../layouts/StorefrontLayout'
import { StorefrontErrorPage } from '../pages/storefront/StorefrontErrorPage'
import { CartPage } from '../pages/storefront/CartPage'
import { CatalogPage } from '../pages/storefront/CatalogPage'
import { CheckoutPage } from '../pages/storefront/CheckoutPage'
import { HomePage } from '../pages/storefront/HomePage'
import { OrderSuccessPage } from '../pages/storefront/OrderSuccessPage'
import { MyOrdersPage } from '../pages/storefront/MyOrdersPage'
import { ProductDetailPage } from '../pages/storefront/ProductDetailPage'
import { SearchPage } from '../pages/storefront/SearchPage'
import { StaticInfoPage } from '../pages/storefront/StaticInfoPage'
import { WhatsAppOrderPage } from '../pages/storefront/WhatsAppOrderPage'

import { CategoriesPage } from '../pages/admin/CategoriesPage'
import { CustomersPage } from '../pages/admin/CustomersPage'
import { DashboardPage } from '../pages/admin/DashboardPage'
import { InventoryPage } from '../pages/admin/InventoryPage'
import { LoginPage } from '../pages/admin/LoginPage'
import { AdminRegisterPage } from '../pages/admin/AdminRegisterPage'
import { AdminProtectedRoute } from '../components/auth/AdminProtectedRoute'
import { OrderDetailPage } from '../pages/admin/OrderDetailPage'
import { OrdersPage } from '../pages/admin/OrdersPage'
import { ProductEditorPage } from '../pages/admin/ProductEditorPage'
import { ProductsPage } from '../pages/admin/ProductsPage'
import { ProfitPage } from '../pages/admin/ProfitPage'
import { ReportsPage } from '../pages/admin/ReportsPage'
import { RevenuePage } from '../pages/admin/RevenuePage'
import { SettingsPage } from '../pages/admin/SettingsPage'
import { SuppliersPage } from '../pages/admin/SuppliersPage'
import { ReviewsPage } from '../pages/admin/ReviewsPage'

import { AccountPage } from '../pages/storefront/AccountPage'
import { WishlistPage } from '../pages/storefront/WishlistPage'

export const router = createBrowserRouter([
  {
    element: <StorefrontLayout />,
    errorElement: <StorefrontErrorPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/catalog', element: <CatalogPage /> },
      { path: '/categories', element: <CatalogPage /> },
      { path: '/category/:categoryId', element: <CatalogPage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/product/:slug', element: <ProductDetailPage /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/order-success', element: <OrderSuccessPage /> },
      { path: '/orders', element: <MyOrdersPage /> },
      { path: '/track-order', element: <MyOrdersPage /> },
      { path: '/wishlist', element: <WishlistPage /> },
      { path: '/account', element: <AccountPage /> },
      { path: '/whatsapp-order', element: <WhatsAppOrderPage /> },
      { path: '/about', element: <StaticInfoPage type="about" /> },
      { path: '/contact', element: <StaticInfoPage type="contact" /> },
      { path: '/faq', element: <StaticInfoPage type="faq" /> },
      { path: '/returns', element: <StaticInfoPage type="returns" /> },
      { path: '/privacy', element: <StaticInfoPage type="privacy" /> },
      { path: '/terms', element: <StaticInfoPage type="terms" /> },
      { path: '/delivery-policy', element: <StaticInfoPage type="delivery" /> },
      { path: '/policies', element: <StaticInfoPage type="policies" /> },
    ],
  },
  { path: '/admin/login', element: <LoginPage /> },
  { path: '/admin/register', element: <AdminRegisterPage /> },
  {
    path: '/admin',
    element: <AdminProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'orders/:orderId', element: <OrderDetailPage /> },
          { path: 'products', element: <ProductsPage /> },
          { path: 'products/new', element: <ProductEditorPage /> },
          { path: 'products/:productId/edit', element: <ProductEditorPage /> },
          { path: 'inventory', element: <InventoryPage /> },
          { path: 'categories', element: <CategoriesPage /> },
          { path: 'customers', element: <CustomersPage /> },
          { path: 'revenue', element: <RevenuePage /> },
          { path: 'profit', element: <ProfitPage /> },
          { path: 'suppliers', element: <SuppliersPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'reviews', element: <ReviewsPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])
