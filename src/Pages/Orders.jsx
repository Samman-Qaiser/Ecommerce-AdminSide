import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
} from "@/components/ui/card"
import { FaHistory } from 'react-icons/fa'
const Orders = () => {
  return (
    <div className='p-4'>
   
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <FaHistory className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold tracking-wide">
              View All Orders
              </h2>
            </div>
            <span className="text-sm text-gray-500">
              Last 10 orders
            </span>
          </div>
          <Card>
               <Table>
                <TableHeader className='bg-primary-foreground'>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
      
                <TableBody className='bg-accent'>
               
                </TableBody>
        </Table>
          </Card>
     
    </div>
  )
}

export default Orders