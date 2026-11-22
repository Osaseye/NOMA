import type { Order } from '../types/commerce'

export type AnalyticsPoint = {
  day: string
  sales: number
  profit: number
  owedToSupplier: number
  orderCount: number
}

interface BucketAccumulator {
  sortKey: number
  day: string
  sales: number
  profit: number
  owedToSupplier: number
  orderCount: number
}

/**
 * Aggregate live orders into chronological daily analytics points (or ordered buckets
 * when legacy order documents lack a `createdAt` timestamp).
 */
export function computeOrderAnalytics(orders: Order[]): AnalyticsPoint[] {
  if (!orders || orders.length === 0) {
    return []
  }

  const datedBuckets = new Map<string, BucketAccumulator>()
  const undatedOrders: Order[] = []

  for (const order of orders) {
    const parsedMs = order.createdAt ? Date.parse(order.createdAt) : Number.NaN
    if (!Number.isNaN(parsedMs)) {
      const date = new Date(parsedMs)
      const isoDay = date.toISOString().slice(0, 10)
      const label = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      })
      const existing = datedBuckets.get(isoDay)
      if (existing) {
        existing.sales += Number(order.total) || 0
        existing.profit += Number(order.markupEarned) || 0
        existing.owedToSupplier += Number(order.baseAmountOwed) || 0
        existing.orderCount += 1
      } else {
        datedBuckets.set(isoDay, {
          sortKey: Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
          day: label,
          sales: Number(order.total) || 0,
          profit: Number(order.markupEarned) || 0,
          owedToSupplier: Number(order.baseAmountOwed) || 0,
          orderCount: 1,
        })
      }
    } else {
      undatedOrders.push(order)
    }
  }

  const points: AnalyticsPoint[] = []

  if (undatedOrders.length > 0) {
    const maxBuckets = 7
    const chunkSize = Math.max(1, Math.ceil(undatedOrders.length / maxBuckets))
    for (let i = 0; i < undatedOrders.length; i += chunkSize) {
      const slice = undatedOrders.slice(i, i + chunkSize)
      const bucketNum = Math.floor(i / chunkSize) + 1
      const label =
        undatedOrders.length <= maxBuckets && slice.length === 1 && slice[0].id
          ? slice[0].id
          : `Batch ${bucketNum}`

      points.push({
        day: label,
        sales: slice.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
        profit: slice.reduce((sum, o) => sum + (Number(o.markupEarned) || 0), 0),
        owedToSupplier: slice.reduce((sum, o) => sum + (Number(o.baseAmountOwed) || 0), 0),
        orderCount: slice.length,
      })
    }
  }

  const sortedDated = Array.from(datedBuckets.values())
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ day, sales, profit, owedToSupplier, orderCount }) => ({
      day,
      sales,
      profit,
      owedToSupplier,
      orderCount,
    }))

  return [...points, ...sortedDated]
}
