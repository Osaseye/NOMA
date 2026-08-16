import { RevenueAreaChart } from '../../components/admin/RevenueChart'
import { HiChartBar } from 'react-icons/hi2'

export function DashboardRevenueChart() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-['Outfit'] text-base font-black text-slate-900 flex items-center gap-2">
            <HiChartBar className="text-emerald-600" size={18} /> Sales & Revenue Rhythm
          </h2>
          <p className="text-xs text-slate-500">Weekly sales volume breakdown (in Naira)</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase text-emerald-800">
          Live Sync
        </span>
      </div>
      <RevenueAreaChart />
    </div>
  )
}
