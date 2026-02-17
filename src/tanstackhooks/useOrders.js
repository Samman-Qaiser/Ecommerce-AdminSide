import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { orderService } from "../service/ordersService";
import {toast} from 'react-hot-toast'
const PAGE_SIZE = 15;

export const useOrders = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [cursorStack, setCursorStack] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");

  const currentCursor = cursorStack[page - 2] || null;

  const { data, isLoading } = useQuery({
    queryKey: [
      "adminOrders",
      page,
      statusFilter,
      paymentMethodFilter,
      paymentStatusFilter,
    ],
    queryFn: () =>
      orderService.getAdminOrders({
        pageSize: PAGE_SIZE,
        lastVisible: currentCursor,
        statusFilter,
        paymentMethodFilter,
        paymentStatusFilter,
      }),
    keepPreviousData: true,
  });

  const nextPage = () => {
    if (data?.lastDoc) {
      setCursorStack((prev) => [...prev, data.lastDoc]);
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const updateStatus = useMutation({
    mutationFn: ({ orderNumber, status }) =>
      orderService.updateOrderStatus(orderNumber, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminOrders"]);
    },
  });

  const updatePayment = useMutation({
    mutationFn: ({ orderNumber, paymentStatus }) =>
      orderService.updatePaymentStatus(orderNumber, paymentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminOrders"]);
    },
  });
const deleteOrder = useMutation({
  mutationFn: (orderId) => orderService.deleteOrder(orderId),
  onSuccess: () => {
    toast.success("Order deleted successfully");
    queryClient.invalidateQueries(["adminOrders"]);
  },
  onError: () => {
    toast.error("Failed to delete order");
  },
})
  return {
    orders: data?.orders || [],
    isLoading,
    page,
    nextPage,
    prevPage,
    statusFilter,
    setStatusFilter,
    paymentMethodFilter,
    setPaymentMethodFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    updateStatus,
    updatePayment,
    deleteOrder
  };
};
