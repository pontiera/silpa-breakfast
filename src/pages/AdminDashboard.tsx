import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, ChefHat, Wine, ConciergeBell } from 'lucide-react'
import { useOrders, useUpdateOrderStatus } from '../hooks/useOrders'
import OrderCard from '../components/OrderCard'
import DateNavigator from '../components/DateNavigator'
import { todayBangkok } from '../utils/time'
import type { OrderStatus } from '../types'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(todayBangkok)
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all')

  const { data: orders = [], isLoading, refetch } = useOrders(selectedDate)
  const updateStatus = useUpdateOrderStatus()

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    served: orders.filter((o) => o.status === 'served').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  }

  const filtered = activeTab === 'all' ? orders : orders.filter((o) => o.status === activeTab)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#2C1810] text-white px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-serif text-2xl font-semibold">SILPA Admin</h1>
            <p className="text-xs text-white/50">All Stations Overview</p>
          </div>
          <div className="flex items-center gap-2">
            <DateNavigator date={selectedDate} onChange={setSelectedDate} onRefresh={refetch} />
            <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-white/10">
              <Home size={18} />
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            { label: 'ทั้งหมด', count: counts.all, color: 'bg-white/10' },
            { label: 'รอ', count: counts.pending, color: 'bg-amber-500/30' },
            { label: 'เตรียม', count: counts.preparing, color: 'bg-blue-500/30' },
            { label: 'พร้อม', count: counts.ready, color: 'bg-green-500/30' },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-xl p-2 text-center`}>
              <p className="text-xl font-bold">{s.count}</p>
              <p className="text-xs text-white/70">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick nav to stations */}
        <div className="flex gap-2 mb-3">
          <button onClick={() => navigate('/kitchen')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-medium hover:bg-white/20">
            <ChefHat size={12} /> Kitchen
          </button>
          <button onClick={() => navigate('/bar')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-medium hover:bg-white/20">
            <Wine size={12} /> Bar
          </button>
          <button onClick={() => navigate('/service')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-medium hover:bg-white/20">
            <ConciergeBell size={12} /> Service
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {(['all', 'pending', 'preparing', 'ready', 'served', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActiveTab(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === s ? 'bg-white text-[#2C1810]' : 'text-white/60 hover:bg-white/10'
              }`}
            >
              {s === 'all' ? 'ทั้งหมด' : s} ({counts[s as keyof typeof counts] ?? 0})
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-400">กำลังโหลด...</div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-400">ไม่มีออเดอร์</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
