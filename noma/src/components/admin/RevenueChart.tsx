import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { analytics } from '../../mock/commerce'
import { formatNaira } from '../../utils/pricing'

export function RevenueAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={analytics}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
        <Tooltip formatter={(value) => formatNaira(Number(value))} />
        <Area type="monotone" dataKey="sales" stroke="#1049EB" fill="#EAF1FF" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function ProfitBarChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={analytics}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
        <Tooltip formatter={(value) => formatNaira(Number(value))} />
        <Bar dataKey="profit" fill="#FEB719" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
