import type { ReactNode } from 'react'

export function DataTable({ children }: { children: ReactNode }) {
  return <div className="table-card">{children}</div>
}

export function DataRow({ children }: { children: ReactNode }) {
  return <div className="table-row">{children}</div>
}
