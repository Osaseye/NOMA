import { brand, currency } from '../constants/brand'
import type { Order, Product } from '../types/commerce'

export function formatNaira(value: number) {
  return currency.format(value)
}

export function markupPercent(product: Product) {
  return Math.round(((product.finalPrice - product.basePrice) / product.basePrice) * 100)
}

export function monthlySummary(orders: Order[]) {
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0)
  const owedToSupplier = orders.reduce((sum, order) => sum + order.baseAmountOwed, 0)
  const markupEarned = orders.reduce((sum, order) => sum + order.markupEarned, 0)

  return {
    totalSales,
    owedToSupplier,
    markupEarned,
    salary: brand.salary,
    netIncome: markupEarned + brand.salary,
  }
}
