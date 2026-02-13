import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useOrders } from "../../tanstackhooks/useOrders";
import { Loader2 } from "lucide-react";

const MonthlyOrdersChart = () => {
  const { orders, isLoading } = useOrders();

  // Generate dynamic data from orders
  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    // Get current month's data
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Initialize array for all days with 0 orders
    const dailyOrders = Array.from({ length: daysInMonth }, (_, i) => ({
      day: (i + 1).toString(),
      orders: 0,
    }));

    // Count orders for each day
    orders.forEach((order) => {
      if (order.createdAt) {
        const orderDate = order.createdAt.toDate();
        const orderMonth = orderDate.getMonth();
        const orderYear = orderDate.getFullYear();

        // Only count orders from current month
        if (orderMonth === currentMonth && orderYear === currentYear) {
          const day = orderDate.getDate();
          dailyOrders[day - 1].orders += 1;
        }
      }
    });

    // Return only days up to today for cleaner visualization
    const today = now.getDate();
    return dailyOrders.slice(0, today);
  }, [orders]);

  const maxOrders = Math.max(...chartData.map((d) => d.orders), 1);

  if (isLoading) {
    return (
      <div className="w-full h-full p-2">
        <h2 className="text-lg font-semibold mb-4 text-slate-900">
          Monthly Orders (Daily)
        </h2>
        <div className="flex items-center justify-center h-70">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p className="text-slate-600 text-sm">Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-87.5 p-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Monthly Orders (Daily)
        </h2>
        <div className="text-sm text-slate-600">
          {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            domain={[0, maxOrders + 2]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{ color: "#0f172a", fontWeight: 600 }}
            formatter={(value) => [`${value} orders`, "Total"]}
            labelFormatter={(label) => `Day ${label}`}
          />
          <Bar
            dataKey="orders"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyOrdersChart;