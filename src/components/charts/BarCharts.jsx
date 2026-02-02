import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

const data = [
  { day: "1", orders: 12 },
  { day: "2", orders: 8 },
  { day: "3", orders: 18 },
  { day: "4", orders: 5 },
  { day: "5", orders: 22 },
  { day: "6", orders: 15 },
  { day: "7", orders: 10 },
  { day: "8", orders: 19 },
  { day: "9", orders: 7 },
  { day: "10", orders: 25 },
]

const MonthlyOrdersChart = () => {
  return (
    <div className="w-full h-[350px] bg-white rounded-xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Monthly Orders (Daily)
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="orders"
            fill="#99D9FC"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlyOrdersChart
