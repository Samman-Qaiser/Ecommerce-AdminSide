import React from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { month: "Jan", earnings: 120000 },
  { month: "Feb", earnings: 95000 },
  { month: "Mar", earnings: 160000 },
  { month: "Apr", earnings: 140000 },
  { month: "May", earnings: 190000 },
  { month: "Jun", earnings: 175000 },
  { month: "Jul", earnings: 220000 },
  { month: "Aug", earnings: 210000 },
  { month: "Sep", earnings: 180000 },
  { month: "Oct", earnings: 250000 },
  { month: "Nov", earnings: 270000 },
  { month: "Dec", earnings: 300000 },
]

const MonthlyEarningsWave = () => {
  return (
    <div className="w-full h-[360px] bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Monthly Earnings
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            {/* Gradient fill */}
            <linearGradient id="earningsWave" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="oklch(0.60 0.22 264)"
                stopOpacity={0.45}
              />
              <stop
                offset="100%"
                stopColor="oklch(0.60 0.22 264)"
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={(value) => `₹${value / 1000}k`}
          />

          <Tooltip
            formatter={(value) => [`₹ ${value.toLocaleString()}`, "Earnings"]}
          />

          <Area
            type="monotone"     // 👈 smooth wave (crust & trough)
            dataKey="earnings"
            stroke="oklch(0.60 0.22 264)"
            strokeWidth={3}
            fill="url(#earningsWave)"
            dot={false}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlyEarningsWave
