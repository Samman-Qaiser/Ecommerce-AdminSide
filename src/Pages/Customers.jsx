import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "../tanstackhooks/useUsers";
import { CategoryTableSkeleton } from "../components/ui/CategoryTableSkeleton";
import { Search, ArrowUpDown, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";

const PAGE_SIZE = 15;

const Customers = () => {
  // 🔹 Local search state — separate from hook's server-side state
  const [localSearch, setLocalSearch] = useState("");
  const [debouncedSearch] = useDebounce(localSearch, 300);

  const {
    customers,
    isLoading,
    isUpdating,
    nextPage,
    prevPage,
    page,
    sortBy,
    setSortBy,
    updateUser,
  } = useUsers(); // ✅ Removed searchTerm from hook — we do filtering client-side

  // 🔹 Client-side filtering by name OR email
  const filteredCustomers = useMemo(() => {
    if (!debouncedSearch.trim()) return customers ?? [];

    const query = debouncedSearch.toLowerCase().trim();

    return (customers ?? []).filter((customer) => {
      const nameMatch = customer.fullName?.toLowerCase().includes(query);
      const emailMatch = customer.email?.toLowerCase().includes(query);
      return nameMatch || emailMatch;
    });
  }, [customers, debouncedSearch]);

  // 🔹 Client-side sort (applied after filter)
  const sortedCustomers = useMemo(() => {
    if (!sortBy) return filteredCustomers;

    return [...filteredCustomers].sort((a, b) => {
      if (sortBy === "fullName") {
        return (a.fullName || "").localeCompare(b.fullName || "");
      }
      if (sortBy === "email") {
        return (a.email || "").localeCompare(b.email || "");
      }
      if (sortBy === "createdAt") {
        // Newest first
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });
  }, [filteredCustomers, sortBy]);

  // 🔹 Empty state check
  const isEmpty = !isLoading && sortedCustomers.length === 0;

  // 🔹 Status Toggle
  const handleStatusToggle = (id, currentStatus = "Active") => {
    const newStatus = currentStatus === "Active" ? "InActive" : "Active";
    updateUser({ uid: id, data: { status: newStatus } });
  };

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Customers Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage registered users efficiently.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-8"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fullName">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="createdAt">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
        {isLoading ? (
          <CategoryTableSkeleton />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                    <TableHead>Phone Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isEmpty && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {debouncedSearch
                        ? `No customers found for "${debouncedSearch}".`
                        : "No customers found."}
                    </TableCell>
                  </TableRow>
                )}

                {sortedCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="hover:bg-muted/50 transition"
                  >
                    <TableCell className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={customer.photoURL} />
                        <AvatarFallback>
                          {customer.fullName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {customer.fullName || "Unknown User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {customer.id?.slice(0, 8)}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm">
                      {customer.email}
                    </TableCell>
  <TableCell className="text-sm">
                      {customer.phoneNumber}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          customer.status === "InActive"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {customer.status || "Active"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() =>
                          handleStatusToggle(customer.id, customer.status)
                        }
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Change Status"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* ================= PAGINATION ================= */}
            <div className="flex items-center justify-between px-4 py-4 border-t bg-muted/20">
              <p className="text-sm text-muted-foreground">
                Page <strong>{page}</strong>
                {debouncedSearch && (
                  <span className="ml-2 text-xs">
                    · {sortedCustomers.length} result
                    {sortedCustomers.length !== 1 ? "s" : ""}
                  </span>
                )}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={page === 1 || !!debouncedSearch}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={
                    customers?.length < PAGE_SIZE || !!debouncedSearch
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Customers;