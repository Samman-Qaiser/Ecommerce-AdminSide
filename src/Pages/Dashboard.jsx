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
   <Card className="relative overflow-hidden border border-slate-200/60 bg-white/70 backdrop-blur-xl w-full rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
  {/* Soft Accent Glows */}
  <div className="absolute top-[-10%] right-[-5%] w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
  <div className="absolute bottom-[-10%] left-[-5%] w-56 h-56 bg-blue-400/10 rounded-full blur-[80px]" />

  <CardHeader className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 p-8">
    <div className="space-y-2">
      {/* Small uppercase eyebrow text for high-end feel */}
      <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-slate-400">
        System Overview
      </p>
      
      <CardTitle className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 flex items-center gap-3">
        Welcome back, 
        <span className="font-semibold bg-linear-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent">
          Admin
        </span>
      </CardTitle>

      {/* Modern pill-style metadata badges */}
      <div className="flex flex-wrap items-center gap-3 mt-6">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/50 shadow-sm">
          <FaRegCalendarAlt className="text-primary text-xs" />
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            {formattedDate}
          </span>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/50 shadow-sm">
          <FaRegClock className="text-primary text-xs" />
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            {formattedTime}
          </span>
        </div>
      </div>
    </div>

    {/* Elegant Active Status UI */}
    <div className="hidden md:flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider leading-none">Status</span>
        <span className="text-xs font-medium text-emerald-600/80">Live & Encrypted</span>
      </div>
    </div>
  </CardHeader>
</Card>
        <DashboardCards />

<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 py-4'>
  
 
  <Card className='md:col-span-2'>
    <MonthlyOrdersChart />
  </Card>

  <Card className='md:col-span-2'>
    <MonthlyEarningsWave />
  </Card>

 
  <Card className='col-span-1 max-h-75 overflow-hidden'>
    <PaymentMethodDonut />
  </Card>


  <div className='col-span-1 lg:col-span-3 overflow-x-auto'>
    <OrderTable />
  </div>
</div>
   
    </div>
  )
}

export default Dashboard