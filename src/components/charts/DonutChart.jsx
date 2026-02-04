import React from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { name: "Cash on Delivery", value: 65 },
  { name: "Stripe", value: 35 },
]

const COLORS = [
  "oklch(0.60 0.22 264)", // chart-1
  "#99D9FC",              // chart-2
]

const PaymentMethodDonut = () => {
  return (
    <div className="w-full h-55 bg-white rounded-xl p-2 box-border  shadow-sm">
      <h2 className="text-lg text-center font-semibold ">
       
        Payment Method
      </h2>

      <ResponsiveContainer width="100%" height="70%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={3}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => `${value}%`}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="h-3 w-3 rounded-full bg-[oklch(0.60_0.22_264)]" />
          COD
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="h-3 w-3 rounded-full bg-[#99D9FC]" />
          Stripe
        </div>
      </div>
    </div>
  )
}

export default PaymentMethodDonut
