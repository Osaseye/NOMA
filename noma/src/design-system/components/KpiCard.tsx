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
    <article className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${styles[tone]}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-wider opacity-75">{label}</span>
        <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
          <Icon size={18} />
        </div>
      </div>
      <strong className="mt-3 block font-['Outfit'] font-black text-2xl md:text-3xl tracking-tight">{value}</strong>
      {subtitle && <span className="mt-1 block text-[11px] font-medium opacity-80">{subtitle}</span>}
    </article>
  )
}
