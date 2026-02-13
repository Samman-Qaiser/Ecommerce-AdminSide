import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useOrders } from "../../tanstackhooks/useOrders";
import { Loader2 } from "lucide-react";

const MonthlyEarningsWave = () => {
  const { orders, isLoading } = useOrders();

  // Calculate monthly earnings from orders
  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const monthlyEarnings = {};
    const currentYear = new Date().getFullYear();

    // Initialize all 12 months with 0
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    monthNames.forEach((month, index) => {
      monthlyEarnings[index] = {
        month: month,
        earnings: 0,
      };
    });

    // Sum up earnings for each month
    orders.forEach((order) => {
      if (order.createdAt && order.total) {
        const orderDate = order.createdAt.toDate();
        const orderYear = orderDate.getFullYear();
        const orderMonth = orderDate.getMonth();

        // Only include current year's data
        if (orderYear === currentYear) {
          monthlyEarnings[orderMonth].earnings += Number(order.total) || 0;
        }
      }
    });

    // Convert to array and return
    return Object.values(monthlyEarnings);
  }, [orders]);

  const totalEarnings = chartData.reduce((sum, item) => sum + item.earnings, 0);
  const avgEarnings = totalEarnings / 12;
  const maxEarnings = Math.max(...chartData.map((d) => d.earnings), 1);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-slate-200">
          <p className="text-sm font-semibold text-slate-900">
            {payload[0].payload.month}
          </p>
          <p className="text-sm text-blue-600 font-medium">
            Rs. {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="w-full h-90 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold mb-4 text-slate-900">
          Monthly Earnings
        </h2>
        <div className="flex items-center justify-center h-70">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p className="text-slate-600 text-sm">Loading earnings data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-2 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Monthly Earnings
        </h2>
        <div className="text-right">
          <p className="text-sm text-slate-600">Total (YTD)</p>
          <p className="text-lg font-bold text-slate-900">
            Rs. {totalEarnings.toLocaleString()}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="earningsWave" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="#3b82f6"
                stopOpacity={0.4}
              />
              <stop
                offset="100%"
                stopColor="#3b82f6"
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>

          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#e2e8f0"
          />

          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            tick={{ fill: "#64748b", fontSize: 12 }}
          />

          <YAxis
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(value) => 
              value >= 1000 
                ? `Rs ${(value / 1000).toFixed(0)}k` 
                : `Rs ${value}`
            }
            domain={[0, maxEarnings * 1.1]}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="earnings"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#earningsWave)"
            dot={false}
            activeDot={{ r: 6, fill: "#3b82f6" }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Stats Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
        <div>
          <p className="text-xs text-slate-600">Average/Month</p>
          <p className="text-sm font-semibold text-slate-900">
            Rs. {Math.round(avgEarnings).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-600">Highest Month</p>
          <p className="text-sm font-semibold text-slate-900">
            Rs. {Math.round(maxEarnings).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyEarningsWave;