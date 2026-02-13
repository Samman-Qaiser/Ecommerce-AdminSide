import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../service/usersService";
import { useState } from "react";

const PAGE_SIZE = 15;

export const useUsers = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [cursorStack, setCursorStack] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  const currentCursor = cursorStack[page - 2] || null;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["customers", page, searchTerm, sortBy],
    queryFn: () =>
      userService.getAllUsers({
        pageSize: PAGE_SIZE,
        lastVisible: currentCursor,
        searchTerm,
        sortBy,
      }),
    keepPreviousData: true,
  });

  // 🔹 Save new cursor when page changes
  const handleNextPage = () => {
    if (data?.lastDoc) {
      setCursorStack((prev) => [...prev, data.lastDoc]);
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  // 🔹 Reset pagination when search/sort changes
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
    setCursorStack([]);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
    setCursorStack([]);
  };

  // 🔹 Mutation with Optimistic Update
  const updateMutation = useMutation({
    mutationFn: ({ uid, data }) =>
      userService.updateUser(uid, data),

    onMutate: async ({ uid, data }) => {
      await queryClient.cancelQueries(["customers"]);

      const previousData = queryClient.getQueryData([
        "customers",
        page,
        searchTerm,
        sortBy,
      ]);

      queryClient.setQueryData(
        ["customers", page, searchTerm, sortBy],
        (old) => ({
          ...old,
          users: old.users.map((user) =>
            user.id === uid ? { ...user, ...data } : user
          ),
        })
      );

      return { previousData };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["customers", page, searchTerm, sortBy],
        context.previousData
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries(["customers"]);
    },
  });

  return {
    customers: data?.users || [],
    isLoading,
    isFetching,
    nextPage: handleNextPage,
    prevPage: handlePrevPage,
    page,
    searchTerm,
    setSearchTerm: handleSearchChange,
    sortBy,
    setSortBy: handleSortChange,
    updateUser: updateMutation.mutate,
    isUpdating: updateMutation.isLoading,
  };
};
