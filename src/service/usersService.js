import {
  collection,
  query,
  getDocs,
  limit,
  startAfter,
  orderBy,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";

class UserService {
  constructor() {
    this.collectionName = "users";
  }

  async getAllUsers({
    pageSize = 15,
    lastVisible = null,
    searchTerm = "",
    sortBy = "createdAt",
  }) {
    try {
      const usersRef = collection(db, this.collectionName);
      let q;

      // 🔹 Base Query with Sorting
      let baseQuery = query(
        usersRef,
        orderBy(sortBy === "createdAt" ? "createdAt" : sortBy, "desc"),
        limit(pageSize)
      );

      // 🔹 Search Logic (simple prefix search for fullName)
      if (searchTerm) {
        baseQuery = query(
          usersRef,
          where("fullName", ">=", searchTerm),
          where("fullName", "<=", searchTerm + "\uf8ff"),
          orderBy("fullName"),
          limit(pageSize)
        );
      }

      // 🔹 Pagination
      if (lastVisible) {
        q = query(baseQuery, startAfter(lastVisible));
      } else {
        q = baseQuery;
      }

      const querySnapshot = await getDocs(q);

      const lastDoc =
        querySnapshot.docs.length > 0
          ? querySnapshot.docs[querySnapshot.docs.length - 1]
          : null;

      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { users, lastDoc };
    } catch (error) {
      throw new Error("Failed to fetch users: " + error.message);
    }
  }

  async updateUser(uid, data) {
    try {
      const userRef = doc(db, this.collectionName, uid);
      await updateDoc(userRef, data);
    } catch (error) {
      throw new Error("Failed to update user: " + error.message);
    }
  }
}

export const userService = new UserService();
