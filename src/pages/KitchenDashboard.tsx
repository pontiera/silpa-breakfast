import { useState } from 'react'
import { Bell, Printer, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOrders, useUpdateOrderStatus } from '../hooks/useOrders'
import OrderCard from '../components/OrderCard'
import DateNavigator from '../components/DateNavigator'
import { todayBangkok } from '../utils/time'
import type { OrderStatus } from '../types'

const TABS: { label: string; status: OrderStatus | 'all' }[] = [
  { label: 'รอดำเนินการ', status: 'pending' },
  { label: 'กำลังเตรียม', status: 'preparing' },
  { label: 'พร้อมเสิร์ฟ', status: 'ready' },
  { label: 'เสิร์ฟแล้ว', status: 'served' },
  { label: 'ยกเลิก', status: 'cancelled' },
]

export default function KitchenDashboard() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(todayBangkok)
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('pending')

  const { data: orders = [], isLoading, refetch } = useOrders(selectedDate)
  const updateStatus = useUpdateOrderStatus()

  const filtered = activeTab === 'all' ? orders : orders.filter((o) => o.status === activeTab)
  const pendingCount = orders.filter((o) => o.status === 'pending').length

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#F5F0E8] border-b border-[#E8E0D4] px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-[#2C1810]">SILPA Kitchen</h1>
            <p className="text-xs text-gray-400">Bakery · Main Dish</p>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <div className="flex items-center gap-1 bg-amber-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                <Bell size={14} />
                {pendingCount} ใหม่
              </div>
            )}
            <button className="p-2 rounded-xl hover:bg-[#EDE8DF]"><Printer size={18} /></button>
            <DateNavigator date={selectedDate} onChange={setSelectedDate} onRefresh={refetch} />
            <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-[#EDE8DF]">
              <Home size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const count = orders.filter((o) => o.status === tab.status).length
            return (
              <button
                key={tab.status}
                onClick={() => setActiveTab(tab.status)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.status
                    ? 'bg-[#8B4513] text-white'
                    : 'text-gray-600 hover:bg-[#EDE8DF]'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.status ? 'bg-white/30 text-white' : 'bg-[#EDE8DF] text-[#8B4513]'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </header>

      {/* Orders grid */}
      <main className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-400">กำลังโหลด...</div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-400">ไม่มีออเดอร์ในสถานะนี้</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((order, i) => (
              <OrderCard
                key={order.id}
                order={order}
                orderIndex={i + 1}
                onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
