import { HiArrowTrendingUp, HiSparkles, HiBanknotes, HiBuildingStorefront } from 'react-icons/hi2'

export function KpiCard({
  label,
  value,
  tone = 'blue',
  subtitle,
}: {
  label: string
  value: string
  tone?: 'blue' | 'gold' | 'ink' | 'emerald'
  subtitle?: string
}) {
  const styles = {
    blue: 'border-blue-200 bg-blue-50/40 text-blue-900',
    gold: 'border-amber-200 bg-amber-50/40 text-amber-900',
    ink: 'border-slate-800 bg-slate-900 text-white',
    emerald: 'border-emerald-200 bg-emerald-50/40 text-emerald-900',
  }

  const icons = {
    blue: HiArrowTrendingUp,
    gold: HiSparkles,
    ink: HiBuildingStorefront,
    emerald: HiBanknotes,
  }

  const Icon = icons[tone] || HiArrowTrendingUp

  return (
    <article className={`relative overflow-hidden rounded-2xl border p-3.5 sm:p-5 shadow-xs transition-all hover:shadow-md ${styles[tone]}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider opacity-75 line-clamp-1">{label}</span>
        <div className="rounded-xl bg-white/20 p-1.5 sm:p-2 backdrop-blur-xs shrink-0">
          <Icon className="text-sm sm:text-base" />
        </div>
      </div>
      <strong className="mt-2 sm:mt-3 block font-['Outfit'] font-black text-lg sm:text-2xl md:text-3xl tracking-tight truncate">{value}</strong>
      {subtitle && <span className="mt-1 block text-[10px] sm:text-[11px] font-medium opacity-80 line-clamp-1">{subtitle}</span>}
    </article>
  )
}

