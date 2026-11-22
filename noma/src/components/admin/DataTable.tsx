import type { ReactNode } from 'react'

export function DataTable({ children, headers }: { children: ReactNode; headers?: string[] }) {
  return (
    <div className="w-full overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs md:text-sm">
          {headers ? (
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F6F7F9] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                {headers.map((header, i) => (
                  <th key={i} className="px-4 py-3 sm:px-5">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody className="divide-y divide-[#E5E7EB]">{children}</tbody>
        </table>
      </div>
    </div>
  )
}

export function DataRow({ children }: { children: ReactNode }) {
  return <tr className="transition-colors hover:bg-[#F6F7F9]/70">{children}</tr>
}
