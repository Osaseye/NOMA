# Noma Frontend Architecture

## Source Of Truth

The implementation follows the Noma PRD, PRD v1.1 palette, and UX Screen Design Document.

## Screen Inventory

Storefront routes: home, catalog, category listing, search, product detail, cart, checkout, order success, order tracking, WhatsApp order flow, about, contact, FAQ, policies, and account.

Admin routes: login, dashboard, orders, order detail, products, product editor, inventory, categories, customers, revenue tracking, profit tracking, supplier tracking, reports, and settings.

## Design System

Foundations live in `src/design-system/foundations`.
Reusable primitives live in `src/design-system/components`.
Commerce-specific components live in `src/components/commerce`.
Admin-specific components live in `src/components/admin`.

The customer storefront never renders supplier base price or markup. Those fields exist only in authenticated admin pages and mock services for backend handoff.

## Mock Frontend Services

`src/services/commerceService.ts` simulates async frontend API calls for catalog, orders, customers, analytics, delivery estimates, and order status updates.

## State

`src/store/cartStore.ts` uses Zustand for cart state. TanStack Query wraps mock service calls to model production data fetching.
