import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History, ArrowRight, } from "lucide-react";
import { useOrders } from "../../tanstackhooks/useOrders";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {Link} from 'react-router-dom'
const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  shipped: {
    label: "Shipped",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

// Skeleton Row Component
const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-16 rounded-md" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-20 rounded-full" />
    </TableCell>
  </TableRow>
);

const RecentOrdersTable = ({ limit = 5, showViewAll = true }) => {
  const { orders, isLoading } = useOrders();

  // Get recent orders (sorted by date, limited)
  const recentOrders = React.useMemo(() => {
    if (!orders || orders.length === 0) return [];

    return [...orders]
      .sort((a, b) => {
        const dateA = a.createdAt?.toDate() || new Date(0);
        const dateB = b.createdAt?.toDate() || new Date(0);
        return dateB - dateA; // Most recent first
      })
      .slice(0, limit);
  }, [orders, limit]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <History className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Orders
            </h2>
            <p className="text-xs text-slate-500">
              Latest {limit} customer orders
            </p>
          </div>
        </div>
        
          <Link to='/orders'>
          <Button variant="ghost" size="sm" className="gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
        
View All
            <ArrowRight size={16} />
          
          </Button>
       </Link> 
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-slate-200">
              <TableHead className="font-semibold text-slate-700">
                Order ID
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Customer
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Date
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Payment
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // Show skeleton rows while loading
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : recentOrders.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <History className="h-12 w-12 text-slate-300" />
                    <p className="text-slate-500 font-medium">No orders yet</p>
                    <p className="text-slate-400 text-sm">
                      Orders will appear here once customers place them
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Render actual orders
              recentOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-slate-50/50 transition-colors border-slate-100"
                >
                  <TableCell className="font-mono font-semibold text-slate-900">
                    #{order.orderNumber}
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-medium text-slate-900">
                        {order.customerName}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-45">
                        {order.email}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-sm text-slate-600">
                    {order.createdAt?.toDate().toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  
                  <TableCell className="font-semibold text-slate-900">
                    Rs. {order.total?.toLocaleString()}
                  </TableCell>
                  
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-slate-300 text-slate-700 font-medium"
                    >
                      {order.paymentMethod === "cod" ? "COD" : 
                       order.paymentMethod === "stripe" ? "Stripe" :
                       order.paymentMethod || "N/A"}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge
                      className={`${
                        statusConfig[order.status]?.className || 
                        "bg-slate-100 text-slate-700 border-slate-200"
                      } border font-medium`}
                    >
                      {statusConfig[order.status]?.label || order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer - Show total if data exists */}
      {!isLoading && recentOrders.length > 0 && (
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/30">
          <p className="text-sm text-slate-600">
            Showing {recentOrders.length} of {orders?.length || 0} total orders
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentOrdersTable;