import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import type { BreakfastOrder } from '../types'

export default function OrderConfirmation() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const order = state?.order as BreakfastOrder | undefined

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-full border-4 border-[#8B4513] flex items-center justify-center mb-6">
        <CheckCircle size={40} className="text-[#8B4513]" />
      </div>

      <h1 className="font-serif text-3xl font-semibold text-[#2C1810] mb-2">Order Sent!</h1>
      <p className="text-gray-500 mb-6">Your order has been sent to the kitchen.</p>

      {order && (
        <div className="bg-[#EDE8DF] rounded-2xl px-8 py-4 mb-6 w-full max-w-xs">
          <p className="text-xs text-gray-500 mb-1">Order Number</p>
          <p className="text-2xl font-bold text-[#8B4513] tracking-wider">#{order.order_number}</p>
        </div>
      )}

      <p className="text-sm text-gray-500 mb-8">Please wait a moment. Your food will be prepared shortly 🙏</p>

      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={() => navigate('/track', { state: { order } })}
          className="w-full py-4 rounded-2xl bg-[#8B4513] text-white font-semibold"
        >
          ติดตามสถานะออเดอร์
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 rounded-2xl border border-[#D4C9BA] text-[#8B4513] font-medium"
        >
          New Order
        </button>
      </div>
    </div>
  )
}
