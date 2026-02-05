import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FaHistory, FaSave, FaCheckCircle } from 'react-icons/fa'
import { Loader2 } from "lucide-react"
import {toast} from 'react-toastify'
const Orders = () => {
  // Original Data (Jo Backend se ayega)
  const [orders, setOrders] = useState([
    { id: "ORD-7721", customer: "Zainab Ahmed", date: "2024-02-01",paymentmethod:"COD", amount: "Rs. 12,500", payment: "Paid", status: "Pending" },
    { id: "ORD-7722", customer: "Irfan Khan", date: "2024-02-02",paymentmethod:"Stripe", amount: "Rs. 8,200", payment: "Unpaid", status: "Shipped" },
  ]);

  // Temporary state taake track kar sakein kis order ka status change hua hai
  const [pendingChanges, setPendingChanges] = useState({}); 
  const [loadingId, setLoadingId] = useState(null);

  // Status Colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-orange-500 bg-orange-50 border-orange-100';
      case 'Shipped': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'Delivered': return 'text-green-500 bg-green-50 border-green-100';
      case 'Cancelled': return 'text-red-500 bg-red-50 border-red-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  // Jab dropdown change ho
  const handleStatusSelect = (orderId, newStatus) => {
    setPendingChanges(prev => ({
      ...prev,
      [orderId]: newStatus
    }));
  };

  // Jab "Save" button click ho
  const handleSaveStatus = async (orderId) => {
    const newStatus = pendingChanges[orderId];
    if (!newStatus) return;

    setLoadingId(orderId);

    // --- FUTURE LOGIC START ---
    // Yahan hum TanStack Mutation aur Firebase call lagayenge
    console.log(`Calling Firebase: Update Order ${orderId} to ${newStatus}`);
    
    // Fake Delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // --- FUTURE LOGIC END ---

    // Local state update kar rahe hain fake success dikhane ke liye
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    // Clear the pending change for this order
    const updatedPending = { ...pendingChanges };
    delete updatedPending[orderId];
    setPendingChanges(updatedPending);
    setLoadingId(null);
   toast.success(`Order ${orderId} status saved successfully!`)
  };

  return (
    <div className='p-6 bg-[#fcfcfc] min-h-screen font-sans'>
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-black rounded-xl">
              <FaHistory className="text-white w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 ">Order Control Panel</h2>
          </div>
          <Badge className="bg-slate-100 text-slate-600 border-none px-4 py-1">Total: {orders.length}</Badge>
        </div>

        <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className=" py-5 pl-6">Order Details</TableHead>
                  <TableHead className=" py-5 pl-6">Customer Name</TableHead>
                  <TableHead className="">Date</TableHead>
                  <TableHead className="">Payment Method</TableHead>
                  <TableHead className="">Payment Staus</TableHead>
                  <TableHead className="">Status</TableHead>
                  <TableHead className=" text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {orders.map((order) => {
                  const isDirty = pendingChanges[order.id] !== undefined;
                  const currentDisplayStatus = pendingChanges[order.id] || order.status;

                  return (
                    <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-6">
                    {order.id}

                      </TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="text-sm text-slate-500 font-medium">{order.date}</TableCell>
                      <TableCell>{order.paymentmethod}</TableCell>
                      <TableCell>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${order.payment === 'Paid' ? 'border-green-200 text-green-600 bg-green-50' : 'border-red-200 text-red-600 bg-red-50'}`}>
                          {order.payment}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select 
                          onValueChange={(val) => handleStatusSelect(order.id, val)}
                          defaultValue={order.status}
                        >
                          <SelectTrigger className={`w-[130px] h-9 text-xs font-bold rounded-lg border shadow-none ${getStatusColor(currentDisplayStatus)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-xl">
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        {isDirty ? (
                          <Button 
                            size="sm" 
                            disabled={loadingId === order.id}
                            onClick={() => handleSaveStatus(order.id)}
                            className="bg-black hover:bg-slate-800 text-white rounded-lg px-4 transition-all animate-in fade-in zoom-in duration-200"
                          >
                            {loadingId === order.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <><FaSave className="mr-2 h-3 w-3" /> Save</>
                            )}
                          </Button>
                        ) : (
                          <div className="flex justify-end pr-4">
                            <FaCheckCircle className="text-slate-200 h-5 w-5" title="All changes saved" />
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Orders