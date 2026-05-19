import { useLocation, useNavigate } from 'react-router-dom'
import type { BreakfastOrder } from '../types'

export default function OrderConfirmation() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const order = state?.order as BreakfastOrder | undefined

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#100704' }}>
      {/* Ambient glow */}
      <div
        className="absolute top-[-4rem] left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%)' }}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        {/* Check icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)' }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-8" style={{ background: 'rgba(196,117,58,0.4)' }} />
          <p className="text-[10px] tracking-[0.4em] uppercase" style={{ color: '#C4753A' }}>Order Confirmed</p>
          <div className="h-px w-8" style={{ background: 'rgba(196,117,58,0.4)' }} />
        </div>

        <h1 className="font-serif text-4xl font-semibold text-white mb-2">ออเดอร์ส่งแล้ว!</h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          ออเดอร์ของคุณถูกส่งไปยังครัวเรียบร้อยแล้ว
        </p>

        {/* Order number card */}
        {order && (
          <div
            className="mt-8 px-10 py-5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Order Number</p>
            <p className="font-serif text-3xl font-bold tracking-wider" style={{ color: '#C4753A' }}>
              #{order.order_number}
            </p>
          </div>
        )}

        <p className="mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
          กรุณารอสักครู่ อาหารของคุณกำลังเตรียม 🙏
        </p>
      </div>

      {/* Bottom card */}
      <div className="relative z-10 rounded-t-[2rem] px-6 pt-7 pb-10" style={{ background: '#FBF8F3' }}>
        <div className="w-8 h-1 rounded-full mx-auto mb-6" style={{ background: '#E0D6CC' }} />

        <button
          onClick={() => navigate('/')}
          className="w-full py-4 rounded-2xl text-white font-semibold transition-all active:scale-[0.98]"
          style={{ background: '#2C1810' }}
        >
          สั่งออเดอร์ใหม่
        </button>
      </div>
    </div>
  )
}
