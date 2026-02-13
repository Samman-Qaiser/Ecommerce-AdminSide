import React, { useMemo } from "react";
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
  const {
    customers,
    isLoading,
    isUpdating,
    nextPage,
    prevPage,
    page,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    updateUser,
  } = useUsers();

  // 🔹 Debounce search for performance
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // 🔹 Memoized Empty Check
  const isEmpty = useMemo(() => {
    return !isLoading && customers?.length === 0;
  }, [customers, isLoading]);

  // 🔹 Professional Status Toggle
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                      No customers found.
                    </TableCell>
                  </TableRow>
                )}

                {customers?.map((customer) => (
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
                          handleStatusToggle(
                            customer.id,
                            customer.status
                          )
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
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={page === 1}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={customers?.length < PAGE_SIZE}
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
