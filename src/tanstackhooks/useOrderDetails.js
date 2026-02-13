import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import { toast } from "react-hot-toast";

export const useOrderDetails = (orderNumber) => {
  const queryClient = useQueryClient();

  // Fetch single order with user details
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: async () => {
      if (!orderNumber) throw new Error("Order ID is required");

      const orderRef = doc(db, "orders", orderNumber);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        throw new Error("Order not found");
      }

      const orderData = {
        id: orderSnap.id,
        ...orderSnap.data(),
      };

      // Fetch user details if userId exists
      if (orderData.userId) {
        try {
          const userRef = doc(db, "users", orderData.userId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            orderData.userDetails = {
              fullName: userData.fullName || null,
              email: userData.email || null,
              photoURL: userData.photoURL || null,
            };
          }
        } catch (userError) {
          console.error("Error fetching user details:", userError);
          // Continue without user details if fetch fails
          orderData.userDetails = null;
        }
      }

      return orderData;
    },
    enabled: !!orderNumber,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update order status
  const updateStatus = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date(),
      });
      return { orderId, status };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["order", data.orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      
      toast.success("Order status updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update order status");
      console.error("Update error:", error);
    },
  });

  // Update shipping address
  const updateShippingAddress = useMutation({
    mutationFn: async ({ orderId, address }) => {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        shippingAddress: address,
        updatedAt: new Date(),
      });
      return { orderId, address };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["order", data.orderId] });
      toast.success("Shipping address updated!");
    },
    onError: (error) => {
      toast.error("Failed to update shipping address");
      console.error("Update error:", error);
    },
  });

  // Update billing address
  const updateBillingAddress = useMutation({
    mutationFn: async ({ orderId, address }) => {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        billingAddress: address,
        updatedAt: new Date(),
      });
      return { orderId, address };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["order", data.orderId] });
      toast.success("Billing address updated!");
    },
    onError: (error) => {
      toast.error("Failed to update billing address");
      console.error("Update error:", error);
    },
  });

  // Cancel order
  const cancelOrder = useMutation({
    mutationFn: async (orderId) => {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: "cancelled",
        cancelledAt: new Date(),
        updatedAt: new Date(),
      });
      return orderId;
    },
    onSuccess: (orderId) => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order cancelled successfully");
    },
    onError: (error) => {
      toast.error("Failed to cancel order");
      console.error("Cancel error:", error);
    },
  });

  return {
    order,
    isLoading,
    error,
    refetch,
    updateStatus,
    updateShippingAddress,
    updateBillingAddress,
    cancelOrder,
  };
};