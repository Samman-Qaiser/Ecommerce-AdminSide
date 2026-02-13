import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  Download,
  Printer,
  Edit3,
  MoreVertical,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import { useOrderDetails } from "../tanstackhooks/useOrderDetails";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    icon: XCircle,
  },
};

const OrderDetails = () => {
  const { orderid } = useParams();
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const {
    order,
    isLoading,
    error,
    updateStatus,
    cancelOrder,
  } = useOrderDetails( orderid );

  // Handle status change
  const handleStatusChange = (newStatus) => {
    updateStatus.mutate({
      orderId: order.id,
      status: newStatus,
    });
  };
const handleDownloadInvoice = () => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();

  // === LOGO ===
  const img = new Image();
  img.src = "./logo.jpeg";

  doc.addImage(img, "JPEG", 14, 10, 30, 30);

  // === COMPANY INFO ===
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Doritaaga", pageWidth - 14, 20, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Doritaaga Ecommerce Store", pageWidth - 14, 26, { align: "right" });
  doc.text("GST:  06AKWPY3989Q1ZF", pageWidth - 14, 32, { align: "right" });
  doc.text("Haryana, India ", pageWidth - 14, 38, { align: "right" });
  doc.text("support@yourstore.com", pageWidth - 14, 44, { align: "right" });

  // Line Separator
  doc.setDrawColor(200);
  doc.line(14, 50, pageWidth - 14, 50);

  // === INVOICE TITLE ===
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 14, 60);

  // === ORDER INFO ===
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text(`Invoice #: ${order.orderNumber}`, 14, 70);
  doc.text(
    `Date: ${
      order.createdAt?.toDate().toLocaleDateString("en-GB") || ""
    }`,
    14,
    78
  );

  doc.text(
    `Customer: ${order?.userDetails?.fullName || ""}`,
    14,
    88
  );
  doc.text(
    `Email: ${order?.userDetails?.email || ""}`,
    14,
    96
  );

  // === PRODUCTS TABLE ===
  autoTable(doc, {
    startY: 105,
    head: [["Product", "Qty", "Unit Price", "Total"]],
    body: order.items?.map((item) => [
      item.name,
      item.quantity,
      `Rs. ${item.price?.toLocaleString()}`,
      `Rs. ${(item.price * item.quantity).toLocaleString()}`,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [30, 41, 59], // slate-800
      textColor: 255,
    },
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // === TOTALS BOX ===
  doc.setFontSize(11);

  doc.text(
    `Subtotal: Rs. ${(order.subtotal || 0).toLocaleString()}`,
    pageWidth - 14,
    finalY,
    { align: "right" }
  );

  doc.text(
    `Shipping: Rs. ${(order.shipping || 0).toLocaleString()}`,
    pageWidth - 14,
    finalY + 8,
    { align: "right" }
  );

  doc.text(
    `Tax: Rs. ${(order.tax || 0).toLocaleString()}`,
    pageWidth - 14,
    finalY + 16,
    { align: "right" }
  );

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Total: Rs. ${(order.total || 0).toLocaleString()}`,
    pageWidth - 14,
    finalY + 28,
    { align: "right" }
  );

  // === FOOTER ===
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Thank you for shopping with us!",
    pageWidth / 2,
    285,
    { align: "center" }
  );

  doc.text(
    "This is a computer-generated invoice.",
    pageWidth / 2,
    292,
    { align: "center" }
  );

  doc.save(`invoice_${order.orderNumber}.pdf`);
};

const handlePrint = () => {
  window.print();
};

  // Handle cancel order
  const handleCancelOrder = () => {
    cancelOrder.mutate(order.id, {
      onSuccess: () => {
        setShowCancelDialog(false);
      },
    });
  };
useEffect(()=>{
    console.log('orderid' , orderid )
},[])
  // Generate timeline based on order status
  const generateTimeline = (order) => {
    const baseTimeline = [
      {
        status: "pending",
        label: "Order Placed",
        time: order.createdAt?.toDate().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        completed: true,
      },
    ];

    const statusOrder = ["pending", "processing", "shipped", "delivered"];
    const currentStatusIndex = statusOrder.indexOf(order.status);

    // Add confirmed step if order is processing or beyond
    if (currentStatusIndex >= 1) {
      baseTimeline.push({
        status: "confirmed",
        label: "Order Confirmed",
        time: order.confirmedAt?.toDate().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) || "Confirmed",
        completed: true,
      });
    }

    // Add processing step
    if (currentStatusIndex >= 1) {
      baseTimeline.push({
        status: "processing",
        label: "Processing",
        time: order.processingAt?.toDate().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) || "In Progress",
        completed: true,
      });
    } else {
      baseTimeline.push({
        status: "processing",
        label: "Processing",
        time: "Pending",
        completed: false,
      });
    }

    // Add shipped step
    if (currentStatusIndex >= 2) {
      baseTimeline.push({
        status: "shipped",
        label: "Shipped",
        time: order.shippedAt?.toDate().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) || "Shipped",
        completed: true,
      });
    } else {
      baseTimeline.push({
        status: "shipped",
        label: "Shipped",
        time: "Pending",
        completed: false,
      });
    }

    // Add delivered step
    if (currentStatusIndex >= 3) {
      baseTimeline.push({
        status: "delivered",
        label: "Delivered",
        time: order.deliveredAt?.toDate().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) || "Delivered",
        completed: true,
      });
    } else {
      baseTimeline.push({
        status: "delivered",
        label: "Delivered",
        time: "Pending",
        completed: false,
      });
    }

    // Handle cancelled orders
    if (order.status === "cancelled") {
      return [
        ...baseTimeline.slice(0, currentStatusIndex + 1),
        {
          status: "cancelled",
          label: "Order Cancelled",
          time: order.cancelledAt?.toDate().toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }) || "Cancelled",
          completed: true,
        },
      ];
    }

    return baseTimeline;
  };

  // Get customer initials
  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-slate-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="p-4 rounded-full bg-red-50">
            <AlertCircle className="text-red-500" size={48} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Order Not Found
            </h2>
            <p className="text-slate-600 mb-6">
              {error?.message || "The order you're looking for doesn't exist."}
            </p>
            <Button onClick={() => navigate("/orders")} className="gap-2">
              <ArrowLeft size={16} />
              Back to Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[order.status]?.icon || Clock;
  const timeline = generateTimeline(order);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className="border-slate-200 hover:bg-slate-100"
            >
              <ArrowLeft size={18} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Order Details
              </h1>
              <p className="text-slate-600 mt-1">Order #{order.orderNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
            onClick={handleDownloadInvoice}
              variant="outline"
              className="gap-2 border-slate-200 hover:bg-slate-100"
            >
              <Download size={16} />Download Invoice
            
            </Button>
            <Button
            onClick={handlePrint}
              variant="outline"
              className="gap-2 border-slate-200 hover:bg-slate-100"
            >
              <Printer size={16} />
              Print
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-slate-200 hover:bg-slate-100"
                >
                  <MoreVertical size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
          
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={order.status === "cancelled" || order.status === "delivered"}
                >
                  Cancel Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        statusConfig[order.status]?.color
                      }`}
                    >
                      <StatusIcon size={24} />
                    </div>
                    <div>
                      <CardTitle>Order Status</CardTitle>
                      <CardDescription>Track your order progress</CardDescription>
                    </div>
                  </div>
                  <Select
                    value={order.status}
                    onValueChange={handleStatusChange}
                    disabled={updateStatus.isPending}
                  >
                    <SelectTrigger className="w-[160px] border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {/* Timeline */}
                <div className="space-y-4">
                  {timeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            item.completed
                              ? item.status === "cancelled"
                                ? "bg-red-500 border-red-500"
                                : "bg-emerald-500 border-emerald-500"
                              : "bg-slate-100 border-slate-300"
                          }`}
                        >
                          {item.completed ? (
                            item.status === "cancelled" ? (
                              <XCircle className="text-white" size={20} />
                            ) : (
                              <CheckCircle2 className="text-white" size={20} />
                            )
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-slate-400" />
                          )}
                        </div>
                        {index < timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-16 ${
                              item.completed
                                ? item.status === "cancelled"
                                  ? "bg-red-500"
                                  : "bg-emerald-500"
                                : "bg-slate-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`font-semibold ${
                              item.completed ? "text-slate-900" : "text-slate-500"
                            }`}
                          >
                            {item.label}
                          </h4>
                          <span className="text-sm text-slate-500">
                            {item.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  {order.items?.length || 0} items in this order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-20 h-20 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="text-slate-300" size={32} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">
                          {item.name}
                        </h4>
                        {item.sku && (
                          <p className="text-sm text-slate-500 mt-1">
                            SKU: {item.sku}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-slate-600">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm text-slate-600">
                            Price: Rs. {item.price?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">
                          Rs. {((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Order Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="text-slate-900 font-medium">
                      Rs. {(order.subtotal || 0).toLocaleString()}
                    </span>
                     <span className="text-slate-600">Shipping Cost</span>
                        <span className="text-slate-900 font-medium">
                      Rs. {(order.shippingCost || 0).toLocaleString()}
                    </span>
                  </div>
                  {order.shipping > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Shipping</span>
                      <span className="text-slate-900 font-medium">
                        Rs. {order.shipping.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {order.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Tax</span>
                      <span className="text-slate-900 font-medium">
                        Rs. {order.tax.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Discount</span>
                      <span className="text-emerald-600 font-medium">
                        - Rs. {order.discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="font-bold text-lg text-slate-900">
                      Rs. {(order.total || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-blue-100">
                  <AvatarImage src={order?.userDetails?.photoURL}/>
                    <AvatarFallback className="bg-blue-500 text-white font-semibold">
                      {getInitials(order?.userDetails?.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {order?.userDetails?.fullName || "N/A"}
                    </p>
                    <p className="text-sm text-slate-500">Customer</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="text-slate-400" size={16} />
                    <span className="text-slate-700">
                      {order?.userDetails?.email || "No email provided"}
                    </span>
                  </div>
                  {order.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="text-slate-400" size={16} />
                      <span className="text-slate-700">{order.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.address && (
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Shipping Address</CardTitle>
               
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-slate-400 mt-0.5" size={18} />
                    <div className="text-sm text-slate-700 space-y-1">
                      <p>{order.address.street || order.address.address}</p>
                      <p>
                        {order.address.city}
                        {order.address.state && `, ${order.address.state}`}
                      </p>
                   
                        <p>
                        
                          {order.address.zipcode && `, ${order.address.zipcode}`}
                        </p>
                  
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {order.orderNote &&(
             <Card className='p-2'>
              
             <CardHeader><CardTitle>Order Note</CardTitle></CardHeader>
               <CardContent>
                {order.orderNote}
               </CardContent>
             </Card>
            )}

            {/* Payment Method */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <Package className="text-slate-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {order.paymentMethod || "Cash on Delivery"}
                    </p>
                    <p className="text-xs text-slate-500">Payment method</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Order Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              className="bg-red-600 hover:bg-red-700"
              disabled={cancelOrder.isPending}
            >
              {cancelOrder.isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Order"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrderDetails;