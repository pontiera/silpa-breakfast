import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import GuestMenu from './pages/GuestMenu'
import OrderConfirmation from './pages/OrderConfirmation'
import KitchenDashboard from './pages/KitchenDashboard'
import BarDashboard from './pages/BarDashboard'
import ServiceDashboard from './pages/ServiceDashboard'
import AdminDashboard from './pages/AdminDashboard'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 10000 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GuestMenu />} />
          <Route path="/order-sent" element={<OrderConfirmation />} />
          <Route path="/kitchen" element={<KitchenDashboard />} />
          <Route path="/bar" element={<BarDashboard />} />
          <Route path="/service" element={<ServiceDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
