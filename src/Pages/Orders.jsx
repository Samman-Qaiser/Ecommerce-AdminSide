import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { saveAs } from "file-saver";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader2,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useOrders } from "../tanstackhooks/useOrders";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    dot: "bg-amber-500",
  },
  processing: {
    label: "Processing",
    color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    dot: "bg-blue-500",
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    dot: "bg-purple-500",
  },
  delivered: {
    label: "Delivered",
    color:
      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    dot: "bg-red-500",
  },
};

const Orders = () => {
  const { orders, isLoading, page, nextPage, prevPage, updateStatus } =
    useOrders();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [editingOrder, setEditingOrder] = useState(null);

  const handleExport = () => {
    if (!orders || orders.length === 0) return;

    const headers = [
      "Order Number",
      "Customer",
      "Email",
      "Products",
      "Total",
      "Status",
      "Payment Method",
      "Date",
    ];

    const rows = orders.map((order) => [
      order.orderNumber,
      order.customerName,
      order.customerEmail,

      order.items?.map((item) => `${item.name} x${item.quantity}`).join(" | "),
      order.total,
      order.status,
      order.paymentMethod,
      order.createdAt?.toDate().toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((item) => `"${item}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    saveAs(blob, `orders_page_${page}.csv`);
  };
  // Filter orders
  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (orderId, newStatus) => {
    updateStatus.mutate({
      orderNumber: orderId,
      status: newStatus,
    });
    setEditingOrder(null);
  };

  const activeFiltersCount = [
    statusFilter !== "all",
    dateFilter !== "all",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6 lg:p-8">
      <div className="max-w-400 mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Orders Management
            </h1>
            <p className="text-slate-600 mt-1">
              Track and manage all customer orders in real-time
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 border-slate-200 hover:bg-slate-50"
              onClick={handleExport}
            >
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                placeholder="Search by order number, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 border-slate-200 focus-visible:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-45 h-11 border-slate-200">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-slate-500" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full lg:w-45 h-11 border-slate-200">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                onClick={() => {
                  setStatusFilter("all");
                  setDateFilter("all");
                }}
                className="gap-2 text-slate-600 hover:text-slate-900"
              >
                Clear ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = orders?.filter((o) => o.status === key).length || 0;
            return (
              <div
                key={key}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">
                      {config.label}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {count}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${config.dot}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-scroll">
          <div>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 border-slate-200 hover:bg-slate-50/50">
                  <TableHead className="font-semibold text-slate-700">
                    Order ID
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Customer
                  </TableHead>
                   <TableHead className="font-semibold text-slate-700">
                  Email
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Products
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Total Amount
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Order Date
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2
                          className="animate-spin text-blue-500"
                          size={32}
                        />
                        <p className="text-slate-600">Loading orders...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Package className="text-slate-300" size={48} />
                        <div>
                          <p className="text-slate-900 font-medium">
                            No orders found
                          </p>
                          <p className="text-slate-500 text-sm mt-1">
                            Try adjusting your search or filters
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders?.map((order) => (
                    <TableRow
                      key={order.id}
                      className="border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Order Number */}
                      <TableCell className="font-mono font-semibold text-slate-900">
                        #{order.orderNumber}
                      </TableCell>

                      {/* Customer */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="font-medium text-slate-900">
                            {order.customerName}
                          </div>
                          <div className="text-xs text-slate-500">
                        
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>    {order.customerEmail}</TableCell>

                      {/* Products */}
                      <TableCell>
                        <div className="space-y-1 max-w-50">
                          {order.items?.slice(0, 2).map((item, i) => (
                            <div
                              key={i}
                              className="text-sm text-slate-700 truncate"
                            >
                              <span className="font-medium">{item.name}</span>
                              <span className="text-slate-500 ml-1">
                                × {item.quantity}
                              </span>
                            </div>
                          ))}
                          {order.items?.length > 2 && (
                            <div className="text-xs text-slate-500">
                              +{order.items.length - 2} more
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Total */}
                      <TableCell>
                        <div className="font-semibold text-slate-900">
                          Rs. {order.total?.toLocaleString()}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {editingOrder === order.id ? (
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              handleStatusUpdate(order.id, value)
                            }
                          >
                            <SelectTrigger className="w-35 h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusConfig).map(
                                ([key, config]) => (
                                  <SelectItem key={key} value={key}>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`w-2 h-2 rounded-full ${config.dot}`}
                                      />
                                      {config.label}
                                    </div>
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge
                            className={`${
                              statusConfig[order.status]?.color
                            } border font-medium cursor-pointer transition-all`}
                            onClick={() => setEditingOrder(order.id)}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                statusConfig[order.status]?.dot
                              }`}
                            />
                            {statusConfig[order.status]?.label || order.status}
                          </Badge>
                        )}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-sm text-slate-600">
                        {order.createdAt?.toDate().toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-slate-100"
                            >
                              <MoreVertical
                                size={16}
                                className="text-slate-600"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => navigate(`/orders/${order.id}`)}
                            >
                              <Eye size={16} />
                              View Details
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Package size={16} />
                              Track Order
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Download size={16} />
                              Download Invoice
                            </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/30">
            <div className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-medium text-slate-900">
                {filteredOrders?.length || 0}
              </span>{" "}
              orders
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={page === 1}
                className="gap-1 border-slate-200 hover:bg-slate-100 disabled:opacity-50"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>

              <div className="flex items-center gap-1 px-3">
                <span className="text-sm font-medium text-slate-900">
                  Page {page}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={orders?.length < 15}
                className="gap-1 border-slate-200 hover:bg-slate-100 disabled:opacity-50"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
