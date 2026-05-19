import { X, Clock } from 'lucide-react'
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

const STATUS_CONFIG: Record<OrderStatus, {
  label: string
  textColor: string
  bgColor: string
  borderColor: string
  dotColor: string
}> = {
  pending:   { label: 'รอรับออเดอร์',   textColor: '#92400E', bgColor: '#FFFBEB', borderColor: '#F59E0B', dotColor: '#F59E0B' },
  preparing: { label: 'กำลังเตรียม',    textColor: '#1E40AF', bgColor: '#EFF6FF', borderColor: '#3B82F6', dotColor: '#3B82F6' },
  ready:     { label: 'พร้อมเสิร์ฟ ✓',  textColor: '#065F46', bgColor: '#ECFDF5', borderColor: '#10B981', dotColor: '#10B981' },
  served:    { label: 'เสิร์ฟแล้ว',     textColor: '#6B7280', bgColor: '#F9FAFB', borderColor: '#D1D5DB', dotColor: '#9CA3AF' },
  cancelled: { label: 'ยกเลิก',         textColor: '#991B1B', bgColor: '#FEF2F2', borderColor: '#F87171', dotColor: '#F87171' },
}

const NEXT_BTN: Partial<Record<OrderStatus, { label: string; bg: string }>> = {
  pending:   { label: 'รับออเดอร์',    bg: '#D97706' },
  preparing: { label: 'พร้อมเสิร์ฟ',  bg: '#2563EB' },
  ready:     { label: 'เสิร์ฟแล้ว',   bg: '#059669' },
}

const ITEM_ROWS: { key: keyof BreakfastOrder; emoji: string; label: string }[] = [
  { key: 'coffee_tea',   emoji: '☕', label: 'เครื่องดื่ม' },
  { key: 'juice',        emoji: '🥤', label: 'น้ำผลไม้' },
  { key: 'morning_bowl', emoji: '🥣', label: 'โบวล์' },
  { key: 'bakery',       emoji: '🥐', label: 'เบเกอรี่' },
  { key: 'main_dish',    emoji: '🍳', label: 'เมนูหลัก' },
  { key: 'special_requests', emoji: '📝', label: 'หมายเหตุ' },
]

function timeAgo(created_at: string): string {
  const diff = Math.floor((Date.now() - new Date(created_at).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

export default function OrderCard({ order, orderIndex, onStatusChange }: Props) {
  const nextStatus = STATUS_NEXT[order.status]
  const cfg = STATUS_CONFIG[order.status]
  const btnCfg = NEXT_BTN[order.status]

  const filledItems = ITEM_ROWS.filter((r) => !!order[r.key])

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        borderLeft: `4px solid ${cfg.borderColor}`,
      }}
    >
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: cfg.bgColor }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: cfg.dotColor }} />
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: cfg.textColor }}>
            {cfg.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" style={{ color: '#9CA3AF' }}>
            <Clock size={11} />
            <span className="text-xs">{timeAgo(order.created_at)}</span>
          </div>
          <button
            onClick={() => onStatusChange(order.id, 'cancelled')}
            className="p-1 rounded-lg transition-colors hover:bg-red-100"
            style={{ color: '#D1D5DB' }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Table + order number */}
      <div className="flex items-center gap-3 px-4 pt-3.5 pb-2">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 text-white"
          style={{ background: '#2C1810' }}
        >
          {orderIndex}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-xl leading-none" style={{ color: '#2C1810' }}>
            โต๊ะ {order.room_number}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
            {order.order_number} · {formatOrderTime(order.created_at)}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px" style={{ background: '#F3EEE8' }} />

      {/* Menu items */}
      <div className="px-4 py-3 space-y-2">
        {filledItems.map((row) => (
          <div key={row.key} className="flex items-start gap-2.5">
            <span className="text-base leading-tight mt-0.5">{row.emoji}</span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide" style={{ color: '#B8A898' }}>{row.label}</p>
              <p className="text-sm font-medium leading-snug" style={{ color: '#2C1810' }}>
                {order[row.key] as string}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action button */}
      {btnCfg && nextStatus && (
        <div className="px-4 pb-4 pt-1">
          <button
            onClick={() => onStatusChange(order.id, nextStatus)}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98]"
            style={{ background: btnCfg.bg }}
          >
            ✓ {btnCfg.label}
          </button>
        </div>
      )}
    </div>
  )
}
