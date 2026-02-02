import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { History } from "lucide-react"

const orders = [
  {
    id: "#ORD-1021",
    customer: "Ayesha Khan",
    date: "12 Jan 2026",
    amount: 12499,
    payment: "COD",
    status: "Delivered",
  },
  {
    id: "#ORD-1022",
    customer: "Ali Raza",
    date: "13 Jan 2026",
    amount: 8999,
    payment: "Stripe",
    status: "Pending",
  },
  {
    id: "#ORD-1023",
    customer: "Sara Ahmed",
    date: "13 Jan 2026",
    amount: 15499,
    payment: "COD",
    status: "Cancelled",
  },
  {
    id: "#ORD-1024",
    customer: "Hassan Noor",
    date: "14 Jan 2026",
    amount: 20999,
    payment: "Stripe",
    status: "Delivered",
  },
  {
    id: "#ORD-1025",
    customer: "Fatima Zahra",
    date: "15 Jan 2026",
    amount: 6799,
    payment: "COD",
    status: "Pending",
  },
  {
    id: "#ORD-1026",
    customer: "Usman Ali",
    date: "15 Jan 2026",
    amount: 11299,
    payment: "Stripe",
    status: "Delivered",
  },

]

const statusClasses = {
  Delivered: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
}

const OrderTable = () => {
  return (
    <div className="bg-white rounded-xl border shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold tracking-wide">
            Recent Orders
          </h2>
        </div>
        <span className="text-sm text-gray-500">
          Last 10 orders
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium">
                  {order.id}
                </TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell className="font-medium">
                  ₹ {order.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {order.payment}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses[order.status]}`}
                  >
                    {order.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default OrderTable
