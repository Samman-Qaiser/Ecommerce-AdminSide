import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";

class OrderService {
  constructor() {
    this.collectionName = "orders";
    this.usersCollection = "users";
  }

  async getAdminOrders({
    pageSize = 15,
    lastVisible = null,
    statusFilter = "",
    paymentMethodFilter = "",
    paymentStatusFilter = "",
  }) {
    try {
      const ordersRef = collection(db, this.collectionName);

      let constraints = [];

      constraints.push(orderBy("createdAt", "desc"));
      constraints.push(limit(pageSize));

      if (statusFilter) {
        constraints.push(where("status", "==", statusFilter));
      }

      if (paymentMethodFilter) {
        constraints.push(where("paymentMethod", "==", paymentMethodFilter));
      }

      if (paymentStatusFilter) {
        constraints.push(where("paymentStatus", "==", paymentStatusFilter));
      }

      if (lastVisible) {
        constraints.push(startAfter(lastVisible));
      }

      const q = query(ordersRef, ...constraints);
      const snapshot = await getDocs(q);

      const lastDoc =
        snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1]
          : null;

      // 🔥 Fetch user names
      const orders = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const orderData = docSnap.data();

          let customerName = "Unknown";
             let customerEmail="email@.com" 
          if (orderData.userId) {
            const userSnap = await getDoc(
              doc(db, this.usersCollection, orderData.userId)
            );
            if (userSnap.exists()) {
              customerName = userSnap.data().fullName || "Unknown";
              customerEmail=userSnap.data().email|| "Unknown";
            }
          }

          return {
            id: docSnap.id,
            ...orderData,
            customerName,
            customerEmail
          };
        })
      );

      return { orders, lastDoc };
    } catch (error) {
      throw new Error("Failed to fetch admin orders: " + error.message);
    }
  }

  async updateOrderStatus(orderNumber, status) {
    const orderRef = doc(db, this.collectionName, orderNumber);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  }

  async updatePaymentStatus(orderNumber, paymentStatus) {
    const orderRef = doc(db, this.collectionName, orderNumber);
    await updateDoc(orderRef, {
      paymentStatus,
      updatedAt: serverTimestamp(),
    });
  }
}

export const orderService = new OrderService();
