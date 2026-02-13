import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useOrders } from "../../tanstackhooks/useOrders";
import { Loader2 } from "lucide-react";

const COLORS = {
  cod: "#8b5cf6", // Purple for COD
  stripe: "#3b82f6", // Blue for Stripe
  card: "#10b981", // Green for Card
  other: "#f59e0b", // Amber for Other
};

const PaymentMethodDonut = () => {
  const { orders, isLoading } = useOrders();

  // Calculate payment method distribution
  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const paymentCounts = {};
    let total = 0;

    orders.forEach((order) => {
      const method = order.paymentMethod || "cod";
      paymentCounts[method] = (paymentCounts[method] || 0) + 1;
      total += 1;
    });

    // Convert to percentage and format for chart
    return Object.entries(paymentCounts).map(([method, count]) => ({
      name: method === "cod" 
        ? "Cash on Delivery" 
        : method.charAt(0).toUpperCase() + method.slice(1),
      value: Math.round((count / total) * 100),
      count: count,
      method: method,
    }));
  }, [orders]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200">
          <p className="text-sm font-semibold text-slate-900">
            {payload[0].name}
          </p>
          <p className="text-sm text-slate-600">
            {payload[0].payload.count} orders ({payload[0].value}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="w-full h-75 ">
        <h2 className="text-lg font-semibold text-center text-slate-900 mb-4">
          Payment Methods
        </h2>
        <div className="flex items-center justify-center h-55">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p className="text-slate-600 text-sm">Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full h-75 p-2">
        <h2 className="text-lg font-semibold text-center text-slate-900 mb-4">
          Payment Methods
        </h2>
        <div className="flex items-center justify-center h-55">
          <p className="text-slate-500 text-sm">No payment data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-75 p-2">
      <h2 className="text-lg font-semibold text-center text-slate-900 mb-2">
        Payment Methods
      </h2>

      <ResponsiveContainer width="100%" height="70%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={3}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.method] || COLORS.other}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[entry.method] || COLORS.other }}
            />
            <span className="text-slate-700">
              {entry.name === "Cash on Delivery" ? "COD" : entry.name}
              <span className="text-slate-500 ml-1">({entry.value}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodDonut;