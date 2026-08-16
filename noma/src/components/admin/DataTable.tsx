import type { ReactNode } from 'react'

export function DataTable({ children, headers }: { children: ReactNode; headers?: string[] }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          {headers && (
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-extrabold uppercase tracking-wider text-slate-500 text-[11px]">
                {headers.map((h, i) => (
                  <th key={i} className="px-5 py-3.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
    </div>
  )
}

export function DataRow({ children }: { children: ReactNode }) {
  return (
    <tr className="hover:bg-slate-50/80 transition-colors">
      {children}
    </tr>
  )
}
