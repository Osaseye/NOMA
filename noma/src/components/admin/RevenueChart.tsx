import { ChartLineUp } from '@phosphor-icons/react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useProductStore } from '../../store/productStore'
import type { Order } from '../../types/commerce'
import { computeOrderAnalytics } from '../../utils/analytics'
import { formatNaira } from '../../utils/pricing'

function ChartTooltip({
  active,
  payload,
  label,
  seriesLabel,
}: {
  active?: boolean
  payload?: Array<{ value?: number; payload?: { orderCount?: number } }>
  label?: string
  seriesLabel: string
}) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const val = Number(payload[0]?.value ?? 0)
  const orderCount = payload[0]?.payload?.orderCount

  return (
    <div className="rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2 shadow-[0_8px_24px_rgba(11,18,32,0.08)]">
      <div className="font-mono text-[11px] font-semibold text-[#5E6675]">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-xs font-medium text-[#374151]">{seriesLabel}:</span>
        <span className="font-mono tabular-nums text-xs font-bold text-[#0B1220]">
          {formatNaira(val)}
        </span>
      </div>
      {typeof orderCount === 'number' ? (
        <div className="mt-0.5 font-mono tabular-nums text-[10px] text-[#5E6675]">
          {orderCount} {orderCount === 1 ? 'order' : 'orders'}
        </div>
      ) : null}
    </div>
  )
}

function formatAxisNaira(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1000) return `${Math.round(value / 1000)}k`
  return `${value}`
}

export function RevenueAreaChart({ orders: propOrders }: { orders?: Order[] }) {
  const storeOrders = useProductStore((state) => state.orders)
  const orders = propOrders ?? storeOrders
  const data = computeOrderAnalytics(orders)

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<ChartLineUp size={24} weight="regular" />}
        title="No sales trajectory yet"
        detail="Once customer orders are recorded, daily gross revenue points will render here automatically."
      />
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#E5E7EB" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: '#5E6675', fontSize: 11, fontFamily: '"JetBrains Mono", monospace' }}
          axisLine={{ stroke: '#E5E7EB' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatAxisNaira}
          tick={{ fill: '#5E6675', fontSize: 11, fontFamily: '"JetBrains Mono", monospace' }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip content={<ChartTooltip seriesLabel="Gross Sales" />} />
        <Area
          type="monotone"
          dataKey="sales"
          stroke="#1049EB"
          strokeWidth={2}
          fill="#EEF3FE"
          fillOpacity={0.95}
          activeDot={{ r: 4, fill: '#1049EB', stroke: '#FFFFFF', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function ProfitBarChart({ orders: propOrders }: { orders?: Order[] }) {
  const storeOrders = useProductStore((state) => state.orders)
  const orders = propOrders ?? storeOrders
  const data = computeOrderAnalytics(orders)

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<ChartLineUp size={24} weight="regular" />}
        title="No profit distribution yet"
        detail="Operator markup margin bars will populate once orders are recorded."
      />
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#E5E7EB" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: '#5E6675', fontSize: 11, fontFamily: '"JetBrains Mono", monospace' }}
          axisLine={{ stroke: '#E5E7EB' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatAxisNaira}
          tick={{ fill: '#5E6675', fontSize: 11, fontFamily: '"JetBrains Mono", monospace' }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip content={<ChartTooltip seriesLabel="Net Profit" />} />
        <Bar
          dataKey="profit"
          fill="#0B1220"
          activeBar={{ fill: '#FEB719' }}
          radius={[4, 4, 0, 0]}
          maxBarSize={44}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
