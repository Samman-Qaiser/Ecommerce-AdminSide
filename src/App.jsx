import { useState } from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import './App.css'
import Header from './Layout/Header'
import {SidebarProvider,SidebarTrigger} from "@/components/ui/sidebar"
import AppSidebar from './Layout/AppSidebar'
import Dashboard from './Pages/Dashboard'
import Customers from './Pages/Customers'
import Orders from './Pages/Orders'
import ProductAdd from './Pages/ProductAdd'
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from './service/queryClient'
function App() {


  return (
<>
<QueryClientProvider client={queryClient}>
  <BrowserRouter>
<Header />
 <SidebarProvider>
    <AppSidebar />

  <main className='mt-17 p-4 w-full'>
      <SidebarTrigger />
  <Routes>
    <Route path='' element={
      <Dashboard />
    }/>
    <Route path='/customers' element={<Customers />}/>
    <Route path='/orders' element={<Orders />}/>
    <Route path='/addproduct' element={<ProductAdd />}/>
  </Routes>
 </main>
 </SidebarProvider>
</BrowserRouter>
</QueryClientProvider>

</>
  )
}

export default App
