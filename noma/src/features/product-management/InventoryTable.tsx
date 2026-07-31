import { DataRow, DataTable } from '../../components/admin/DataTable'
import type { Product } from '../../types/commerce'

export function InventoryTable({ products }: { products: Product[] }) {
  return (
    <DataTable>
      {products.map((product) => (
        <DataRow key={product.id}>
          <strong>{product.name}</strong>
          <span>{product.category}</span>
          <span>{product.stockQty} in stock</span>
          <b>{product.stockQty < 10 ? 'Low stock' : 'Ready'}</b>
        </DataRow>
      ))}
    </DataTable>
  )
}
