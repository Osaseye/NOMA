import { ChartBar } from '@phosphor-icons/react'
import { RevenueAreaChart } from '../../components/admin/RevenueChart'

export function DashboardRevenueChart() {
  return (
    <section className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-[#0B1220]">
            <ChartBar size={18} weight="regular" className="text-[#1049EB]" />
            <span>Sales &amp; Revenue Rhythm</span>
          </h2>
          <p className="mt-0.5 text-xs text-[#5E6675]">
            Chronological order volume breakdown (NGN)
          </p>
        </div>
        <span className="rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#15803D]">
          Live Sync
        </span>
      </div>
      <RevenueAreaChart />
    </section>
  )
}
