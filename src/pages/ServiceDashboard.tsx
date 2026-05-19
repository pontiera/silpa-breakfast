import { useState } from 'react'
import { Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOrders, useUpdateOrderStatus } from '../hooks/useOrders'
import OrderCard from '../components/OrderCard'
import DateNavigator from '../components/DateNavigator'
import { todayBangkok } from '../utils/time'
import type { OrderStatus } from '../types'

export default function ServiceDashboard() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(todayBangkok)
  const [activeTab, setActiveTab] = useState<OrderStatus>('ready')

  const { data: orders = [], isLoading, refetch } = useOrders(selectedDate)
  const updateStatus = useUpdateOrderStatus()

  const TABS: { label: string; status: OrderStatus }[] = [
    { label: 'พร้อมเสิร์ฟ', status: 'ready' },
    { label: 'เสิร์ฟแล้ว', status: 'served' },
    { label: 'รอดำเนินการ', status: 'pending' },
  ]

  const filtered = orders.filter((o) => o.status === activeTab)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#F5F0E8] border-b border-[#E8E0D4] px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-[#2C1810]">SILPA Service</h1>
            <p className="text-xs text-gray-400">Front of House</p>
          </div>
          <div className="flex items-center gap-2">
            <DateNavigator date={selectedDate} onChange={setSelectedDate} onRefresh={refetch} />
            <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-[#EDE8DF]">
              <Home size={18} />
            </button>
          </div>
        </div>
        <div className="flex gap-1">
          {TABS.map((tab) => {
            const count = orders.filter((o) => o.status === tab.status).length
            return (
              <button
                key={tab.status}
                onClick={() => setActiveTab(tab.status)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.status ? 'bg-[#8B4513] text-white' : 'text-gray-600 hover:bg-[#EDE8DF]'
                }`}
              >
                {tab.label}
                {count > 0 && <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#EDE8DF] text-[#8B4513]">{count}</span>}
              </button>
            )
          })}
        </div>
      </header>

      <main className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-400">กำลังโหลด...</div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-400">ไม่มีออเดอร์ในสถานะนี้</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((order, i) => (
              <OrderCard key={order.id} order={order} orderIndex={i + 1}
                onStatusChange={(id, status) => updateStatus.mutate({ id, status })} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
