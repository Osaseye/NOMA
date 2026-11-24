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
import type { Order } from '../../types/commerce'

function buildTimeSeriesFromOrders(orders: Order[]) {
  if (orders.length === 0) {
    return [{ date: 'No Data', revenue: 0, profit: 0 }]
  }

  return orders
    .slice()
    .reverse()
    .map((order, index) => ({
      date: order.id || `#${index + 1}`,
      revenue: Number(order.total) || 0,
      profit: Number(order.markupEarned) || 0,
    }))
}

export function RevenueAreaChart({ orders }: { orders: Order[] }) {
  const chartData = buildTimeSeriesFromOrders(orders)

  return (
    <div className="h-[260px] w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0F172A" stopOpacity={0.14} />
              <stop offset="95%" stopColor="#0F172A" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
            tickFormatter={(val) =>
              val >= 1000 ? `₦${(val / 1000).toFixed(0)}k` : `₦${val}`
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              borderRadius: '8px',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              padding: '8px 12px',
            }}
            itemStyle={{ color: '#FFFFFF' }}
            formatter={(value) => [`₦${Number(value ?? 0).toLocaleString()}`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#0F172A"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRev)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ProfitBarChart({ orders }: { orders: Order[] }) {
  const chartData = buildTimeSeriesFromOrders(orders)

  return (
    <div className="h-[260px] w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
            tickFormatter={(val) =>
              val >= 1000 ? `₦${(val / 1000).toFixed(0)}k` : `₦${val}`
            }
          />
          <Tooltip
            cursor={{ fill: '#F8FAFC' }}
            contentStyle={{
              backgroundColor: '#0F172A',
              borderRadius: '8px',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              padding: '8px 12px',
            }}
            itemStyle={{ color: '#FFFFFF' }}
            formatter={(value) => [`₦${Number(value ?? 0).toLocaleString()}`, 'Net Margin']}
          />
          <Bar dataKey="profit" fill="#0F172A" radius={[4, 4, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
