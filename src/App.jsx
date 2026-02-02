import { useState } from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import './App.css'
import Header from './Layout/Header'
import {SidebarProvider,SidebarTrigger} from "@/components/ui/sidebar"
import AppSidebar from './Layout/AppSidebar'
import Dashboard from './Pages/Dashboard'
import Customers from './Pages/Customers'
import OrderTable from './components/charts/OrderTable'
import Orders from './Pages/Orders'
function App() {


  return (
<>
<BrowserRouter>
<Header />
 <SidebarProvider>
    <AppSidebar />
  <main className='mt-15 w-full'>
  <Routes>
    <Route path='' element={
      <Dashboard />
    }/>
    <Route path='/customers' element={<Customers />}/>
    <Route path='/orders' element={<Orders />}/>
  </Routes>
 
  
  </main>
 </SidebarProvider>
</BrowserRouter>
</>
  )
}

export default App
