export function KpiCard({ label, value, tone = 'blue' }: { label: string; value: string; tone?: 'blue' | 'gold' | 'ink' }) {
  return (
    <article className={`kpi-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}
