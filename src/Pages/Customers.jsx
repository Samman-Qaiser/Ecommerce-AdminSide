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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const Customers = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Customers
        </h1>
        <p className="text-sm text-muted-foreground">
          List of all registered customers
        </p>
      </div>

      {/* Table Card */}
      <div className="rounded-xl border bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-50">Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Sample Row */}
            <TableRow className="hover:bg-muted/50 transition">
              <TableCell className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-xs text-muted-foreground">
                    ID: CUST-001
                  </p>
                </div>
              </TableCell>

              <TableCell className="text-sm">
                johnsmith@gmail.com
              </TableCell>

              <TableCell>
                <Badge variant="secondary">Active</Badge>
              </TableCell>
            </TableRow>

            {/* Empty State Example */}
            {/* 
            <TableRow>
              <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                No customers found
              </TableCell>
            </TableRow> 
            */}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Customers
