import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, CheckCircle2 } from 'lucide-react'
import { MENU_CATEGORIES } from '../lib/menuData'
import { useCreateOrder } from '../hooks/useOrders'
import NumericKeypad from '../components/NumericKeypad'

type Selections = {
  coffee_tea?: string
  juice?: string
  morning_bowl?: string
  bakery?: string
  main_dish?: string
  special_requests?: string
}

const CATEGORY_GRADIENTS: Record<string, { from: string; to: string }> = {
  coffee_tea:   { from: '#2C1208', to: '#7A4523' },
  juice:        { from: '#1A3D1A', to: '#4E8C3E' },
  morning_bowl: { from: '#2A1F3D', to: '#7B5EA7' },
  bakery:       { from: '#4A2200', to: '#B87333' },
  main_dish:    { from: '#0D2137', to: '#1E6B9A' },
}

export default function GuestMenu() {
  const navigate = useNavigate()
  const createOrder = useCreateOrder()

  const [tableNumber, setTableNumber] = useState('')
  const [showKeypad, setShowKeypad] = useState(false)
  const [step, setStep] = useState<'table' | number>('table')
  const [selections, setSelections] = useState<Selections>({})

  const currentCat = typeof step === 'number' ? MENU_CATEGORIES[step] : null

  const select = (key: string, value: string) => {
    setSelections((prev) => ({ ...prev, [key]: value }))
  }

  const isSelected = (key: string, name: string) =>
    (selections as Record<string, string>)[key] === name

  const goNext = () => {
    if (typeof step === 'number') {
      if (step < MENU_CATEGORIES.length - 1) setStep(step + 1)
      else handleSubmit()
    }
  }

  const goBack = () => {
    if (typeof step === 'number' && step > 0) setStep(step - 1)
    else setStep('table')
  }

  const handleSubmit = async () => {
    if (!selections.main_dish || !tableNumber) return
    try {
      const order = await createOrder.mutateAsync({
        room_number: tableNumber,
        coffee_tea: selections.coffee_tea,
        juice: selections.juice,
        morning_bowl: selections.morning_bowl,
        bakery: selections.bakery,
        main_dish: selections.main_dish!,
        special_requests: selections.special_requests,
      })
      navigate('/order-sent', { state: { order } })
    } catch {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  /* ─── TABLE STEP ─────────────────────────────────────────────── */
  if (step === 'table') {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#100704' }}>
        {/* Ambient glow blobs */}
        <div className="absolute top-[-5rem] right-[-3rem] w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(196,117,58,0.18), transparent 70%)' }} />
        <div className="absolute top-[30%] left-[-5rem] w-64 h-64 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(139,69,19,0.15), transparent 70%)' }} />

        {/* Branding */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-6 text-center">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-[#C4753A]/50" />
            <p className="text-[#C4753A] text-[10px] tracking-[0.5em] uppercase font-medium">Brunch & Breakfast</p>
            <div className="h-px w-8 bg-[#C4753A]/50" />
          </div>
          <h1 className="font-serif text-[6rem] leading-none font-semibold text-white tracking-widest mb-4">
            SILPA
          </h1>
          <p className="text-white/30 text-sm max-w-[16rem] leading-relaxed">
            Good morning. Let us take care of your breakfast today.
          </p>
        </div>

        {/* Form card */}
        <div className="relative z-10 rounded-t-[2.5rem] px-6 pt-7 pb-10" style={{ background: '#FBF8F3' }}>
          <div className="w-8 h-1 rounded-full mx-auto mb-6" style={{ background: '#E0D6CC' }} />

          <h2 className="font-serif text-2xl font-semibold text-[#2C1810] mb-1">Your Table</h2>
          <p className="text-gray-400 text-sm mb-5">Enter your table number to begin ordering</p>

          {/* Table number button */}
          <button
            onClick={() => setShowKeypad(true)}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all"
            style={{
              background: '#fff',
              borderColor: tableNumber ? '#8B4513' : '#E8E0D4',
            }}
          >
            <span className="text-sm text-gray-400">Table Number</span>
            <span className="text-2xl font-bold" style={{ color: tableNumber ? '#2C1810' : '#D4C9BA' }}>
              {tableNumber || '—'}
            </span>
          </button>

          {/* Special requests */}
          <div className="mt-3">
            <textarea
              value={selections.special_requests || ''}
              onChange={(e) => select('special_requests', e.target.value)}
              placeholder="Allergies or special requests (optional)"
              rows={2}
              className="w-full px-4 py-3 rounded-2xl border text-sm resize-none focus:outline-none text-[#2C1810] placeholder-gray-300"
              style={{ background: '#fff', borderColor: '#E8E0D4' }}
            />
          </div>

          <button
            disabled={!tableNumber}
            onClick={() => setStep(0)}
            className="mt-5 w-full py-4 rounded-2xl text-white text-base font-semibold transition-all active:scale-[0.98] disabled:opacity-30"
            style={{ background: '#2C1810' }}
          >
            Begin Ordering →
          </button>
        </div>

        {showKeypad && (
          <NumericKeypad
            value={tableNumber}
            onChange={setTableNumber}
            onDone={() => setShowKeypad(false)}
            maxLength={3}
          />
        )}
      </div>
    )
  }

  /* ─── MENU STEP ───────────────────────────────────────────────── */
  if (!currentCat) return null

  const catKey = currentCat.key
  const selectedValue = (selections as Record<string, string>)[catKey]
  const canContinue = !currentCat.required || !!selectedValue
  const grad = CATEGORY_GRADIENTS[catKey] ?? { from: '#2C1810', to: '#8B4513' }
  const isLastStep = (step as number) === MENU_CATEGORIES.length - 1

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF7F2' }}>

      {/* Category gradient header */}
      <div
        className="relative px-5 pt-12 pb-7"
        style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
      >
        {/* Back button */}
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-sm mb-5 transition-opacity"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          <ChevronLeft size={16} /> ย้อนกลับ
        </button>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-5">
          {MENU_CATEGORIES.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === (step as number) ? 24 : i < (step as number) ? 16 : 12,
                background: i <= (step as number) ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>

        {/* Title */}
        <div className="flex items-end justify-between">
          <div className="flex-1 mr-3">
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
              Step {(step as number) + 1} / {MENU_CATEGORIES.length}
            </p>
            <h2 className="font-serif text-[1.65rem] font-semibold text-white leading-tight">
              {currentCat.title}
            </h2>
            <p className="text-white/55 text-sm mt-1 italic">{currentCat.subtitle}</p>
          </div>
          <span className="text-[3rem] opacity-40">{currentCat.icon}</span>
        </div>

        {!currentCat.required && (
          <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}>
            Optional — you may skip
          </span>
        )}
      </div>

      {/* Items grid */}
      <div className="flex-1 p-4 pb-36">
        <div className="grid grid-cols-2 gap-3">
          {currentCat.items.map((item) => {
            const full = item.description ? `${item.name} (${item.description})` : item.name
            const selected = isSelected(catKey, full) || isSelected(catKey, item.name)
            return (
              <button
                key={item.id}
                onClick={() => select(catKey, item.description ? full : item.name)}
                className="relative rounded-2xl text-left transition-all active:scale-[0.97] overflow-hidden"
                style={{
                  background: '#fff',
                  boxShadow: selected
                    ? `0 0 0 2.5px ${grad.to}, 0 8px 20px rgba(0,0,0,0.08)`
                    : '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                {/* Top gradient block */}
                <div
                  className="relative h-24 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${grad.from}${selected ? 'FF' : 'CC'}, ${grad.to}${selected ? 'FF' : 'CC'})`,
                  }}
                >
                  <span className="text-[2.6rem]">{currentCat.icon}</span>
                  {selected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow">
                      <CheckCircle2 size={14} color={grad.to} />
                    </div>
                  )}
                </div>

                {/* Bottom text */}
                <div
                  className="p-3"
                  style={{ background: selected ? '#FBF0E8' : '#fff' }}
                >
                  <p className="text-[12px] font-semibold text-[#2C1810] leading-snug">{item.name}</p>
                  {item.description && (
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.description}</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sticky bottom */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 shadow-[0_-8px_24px_rgba(0,0,0,0.07)]"
        style={{ background: '#fff' }}>
        {selectedValue && (
          <div className="flex items-center gap-2 mb-2.5 px-1">
            <CheckCircle2 size={13} color="#8B4513" className="shrink-0" />
            <p className="text-xs font-medium truncate" style={{ color: '#8B4513' }}>{selectedValue}</p>
          </div>
        )}
        <div className="flex gap-2.5">
          {!currentCat.required && (
            <button
              onClick={goNext}
              className="flex-1 py-3.5 rounded-2xl border-2 text-sm font-medium transition-colors"
              style={{ borderColor: '#E8E0D4', color: '#9B8B7A' }}
            >
              ข้ามขั้นตอนนี้
            </button>
          )}
          <button
            disabled={!canContinue || createOrder.isPending}
            onClick={goNext}
            className="flex-1 py-3.5 rounded-2xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-30"
            style={{ background: '#2C1810' }}
          >
            {createOrder.isPending ? 'กำลังส่ง...' : isLastStep ? 'ส่งออเดอร์ 🙏' : 'ถัดไป →'}
          </button>
        </div>
      </div>
    </div>
  )
}
