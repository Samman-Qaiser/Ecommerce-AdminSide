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
import { ToastContainer } from 'react-toastify'
import SubCategories from './Pages/SubCategories'
import Categories from './Pages/Categories'
function App() {


  return (
<>
<ToastContainer />
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
    <Route path='/subcategories' element={<SubCategories />}/>
    <Route path='categories' element={<Categories />}/>
  </Routes>
 </main>
 </SidebarProvider>
</BrowserRouter>
</QueryClientProvider>

</>
  )
}

export default App
