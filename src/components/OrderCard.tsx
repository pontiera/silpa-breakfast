import { ChefHat, X, Printer } from 'lucide-react'
import type { BreakfastOrder, OrderStatus } from '../types'
import { formatOrderTime } from '../utils/time'

interface Props {
  order: BreakfastOrder
  orderIndex: number
  onStatusChange: (id: string, status: OrderStatus) => void
}

const STATUS_NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'preparing',
  preparing: 'ready',
  ready: 'served',
}

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  served: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrderCard({ order, orderIndex, onStatusChange }: Props) {
  const nextStatus = STATUS_NEXT[order.status]

  const items = [
    order.coffee_tea && { label: 'เครื่องดื่ม', value: order.coffee_tea },
    order.juice && { label: 'น้ำผลไม้', value: order.juice },
    order.morning_bowl && { label: 'โบวล์', value: order.morning_bowl },
    order.bakery && { label: 'เบเกอรี่', value: order.bakery },
    { label: 'เมนูหลัก', value: order.main_dish },
    order.special_requests && { label: 'หมายเหตุ', value: order.special_requests },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D4] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#8B4513] text-white flex items-center justify-center font-bold text-sm">
            #{orderIndex}
          </div>
          <div>
            <p className="font-semibold text-[#2C1810]">Room โต๊ะ {order.room_number}</p>
            <p className="text-xs text-gray-500">
              {order.order_number} · {formatOrderTime(order.created_at)}
            </p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[order.status]}`}>
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className="px-4 pb-3 space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 text-sm">
            <span className="text-gray-400 w-20 shrink-0">{item.label}</span>
            <span className="text-[#2C1810] font-medium">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 pb-4">
        {nextStatus && (
          <button
            onClick={() => onStatusChange(order.id, nextStatus)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#8B4513] text-white text-sm font-medium flex-1 justify-center hover:bg-[#7A3C11] transition-colors"
          >
            <ChefHat size={16} />
            {nextStatus === 'preparing' ? 'รับออเดอร์' : nextStatus === 'ready' ? 'พร้อมเสิร์ฟ' : 'เสิร์ฟแล้ว'}
          </button>
        )}
        <button
          onClick={() => onStatusChange(order.id, 'cancelled')}
          className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
        >
          <X size={18} />
        </button>
        <button className="p-2 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">
          <Printer size={18} />
        </button>
      </div>
    </div>
  )
}
