import React from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { 
  FaRegCalendarAlt, 
  FaRegClock, 
} from "react-icons/fa"
import MonthlyOrdersChart from '../components/charts/BarCharts'
import PaymentMethodDonut from '../components/charts/DonutChart'
import MonthlyEarningsWave from '../components/charts/MonthlyEraningWave'
import OrderTable from '../components/charts/OrderTable'
import DashboardCards from '../components/ui/DashboardCard'
const Dashboard = () => {
      const date = new Date()
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
  return (
    <div className='p-4 w-full bg-background '>
        <Card className='bg-primary w-full text-white px-2 rounded-md'>

            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl sm:text-3xl text-white flex items-center gap-2">
                  <span>👋</span>
                  Welcome back,
                  <span className="font-bold">Admin</span>
                </CardTitle>

                <CardDescription className="text-white/90 flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-sm sm:text-base">
                  <span className="flex items-center gap-2">
                    <FaRegCalendarAlt />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaRegClock />
                    {formattedTime}
                  </span>
                </CardDescription>
              </div>
            </CardHeader>
          
        </Card>
        <DashboardCards />
        <div className='grid grid-cols-4  gap-5 py-2'>
        <Card className='col-span-2'>
          <MonthlyOrdersChart />
        </Card>
 
        <Card className='col-span-2'>
          <MonthlyEarningsWave />
        </Card>
               <Card className='max-h-[300px]'>
               <PaymentMethodDonut />
        </Card>
        <div className='col-span-3 '>
          <OrderTable />
        </div>
        </div>
   
    </div>
  )
}

export default Dashboard