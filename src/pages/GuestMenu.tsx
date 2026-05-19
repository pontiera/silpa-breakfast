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

  const isSelected = (key: string, name: string) => {
    return (selections as Record<string, string>)[key] === name
  }

  const goNext = () => {
    if (typeof step === 'number') {
      if (step < MENU_CATEGORIES.length - 1) {
        setStep(step + 1)
      } else {
        handleSubmit()
      }
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
    } catch (e) {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  // TABLE NUMBER STEP
  if (step === 'table') {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Hero */}
        <div className="bg-[#A89880] text-white text-center py-16 px-6">
          <h1 className="font-serif text-5xl font-semibold tracking-wide mb-2">SILPA</h1>
          <div className="w-12 h-px bg-[#C4753A] mx-auto mb-3" />
          <p className="text-[#C4753A] text-lg font-medium tracking-wide">Brunch Breakfast Experience</p>
          <p className="text-white/70 text-sm mt-1">Please fill in your details before ordering</p>
        </div>

        {/* Form */}
        <div className="flex-1 p-6 max-w-md mx-auto w-full">
          <div className="mt-6">
            <label className="block text-sm font-medium text-[#8B4513] mb-2">
              Table Number <span className="text-red-500">*</span>
            </label>
            <button
              onClick={() => setShowKeypad(true)}
              className="w-full text-left px-4 py-4 rounded-2xl bg-white border-2 border-[#E8E0D4] text-lg font-semibold text-[#2C1810] focus:outline-none focus:border-[#8B4513]"
            >
              {tableNumber || <span className="text-gray-400 font-normal text-base">กดเพื่อใส่หมายเลขโต๊ะ</span>}
            </button>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-500 mb-2">Special Requests (optional)</label>
            <textarea
              value={selections.special_requests || ''}
              onChange={(e) => select('special_requests', e.target.value)}
              placeholder="Dietary restrictions, allergies..."
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E8E0D4] text-sm resize-none focus:outline-none focus:border-[#8B4513]"
            />
          </div>

          <button
            disabled={!tableNumber}
            onClick={() => setStep(0)}
            className="mt-6 w-full py-4 rounded-2xl bg-[#8B4513] text-white text-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            Start Ordering →
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

  // MENU STEP
  if (!currentCat) return null

  const catKey = currentCat.key
  const selectedValue = (selections as Record<string, string>)[catKey]
  const canContinue = !currentCat.required || !!selectedValue

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 bg-[#F5F0E8] border-b border-[#E8E0D4] z-10">
        {/* Order info */}
        <div className="bg-[#EDE8DF] px-4 py-2 flex items-center justify-between text-sm">
          <span className="text-[#8B4513] font-medium">Order for โต๊ะ {tableNumber}</span>
          <div className="flex gap-1">
            {MENU_CATEGORIES.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < (step as number)
                    ? 'bg-[#8B4513]'
                    : i === (step as number)
                    ? 'bg-[#C4753A]'
                    : 'bg-[#D4C9BA]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Category stepper */}
        <div className="flex items-center gap-3 px-4 py-3 overflow-x-auto scrollbar-hide">
          {(step as number) > 0 && (
            <button
              onClick={goBack}
              className="flex items-center gap-1 text-sm text-[#8B4513] font-medium shrink-0"
            >
              <ChevronLeft size={16} /> ย้อนกลับ
            </button>
          )}
          <div className="flex gap-3 flex-1">
            {MENU_CATEGORIES.map((cat, i) => (
              <button
                key={i}
                onClick={() => i < (step as number) && setStep(i)}
                className={`flex flex-col items-center shrink-0 transition-all ${
                  i === (step as number) ? 'opacity-100' : i < (step as number) ? 'opacity-60 cursor-pointer' : 'opacity-30 cursor-default'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                {i < (step as number) && (
                  <CheckCircle2 size={14} className="text-[#8B4513] mt-0.5" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category header */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs text-[#8B4513] font-medium uppercase tracking-wider">
          Step {(step as number) + 1} of {MENU_CATEGORIES.length}
        </p>
        <h2 className="font-serif text-2xl font-semibold text-[#2C1810] leading-tight">
          {currentCat.title}
        </h2>
        <p className="text-sm text-gray-500 italic">— {currentCat.subtitle}</p>
        {!currentCat.required && (
          <p className="text-xs text-gray-400 mt-1">Optional — skip if not needed</p>
        )}
      </div>

      {/* 2-column grid of items */}
      <div className="flex-1 px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {currentCat.items.map((item) => {
            const full = item.description ? `${item.name} (${item.description})` : item.name
            const selected = isSelected(catKey, full) || isSelected(catKey, item.name)
            return (
              <button
                key={item.id}
                onClick={() => select(catKey, item.description ? full : item.name)}
                className={`rounded-2xl overflow-hidden border-2 text-left transition-all ${
                  selected
                    ? 'border-[#8B4513] shadow-md'
                    : 'border-[#E8E0D4] bg-white'
                }`}
              >
                <div className={`aspect-square flex items-center justify-center text-5xl ${selected ? 'bg-[#8B4513]/10' : 'bg-[#EDE8DF]'}`}>
                  {currentCat.icon}
                </div>
                <div className="p-2">
                  <p className="text-xs font-semibold text-[#2C1810] leading-tight">{item.name}</p>
                  {item.description && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{item.description}</p>
                  )}
                  {selected && (
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle2 size={12} className="text-[#8B4513]" />
                      <span className="text-xs text-[#8B4513] font-medium">Selected</span>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom action */}
      <div className="sticky bottom-0 bg-[#F5F0E8] border-t border-[#E8E0D4] p-4">
        {selectedValue && (
          <p className="text-xs text-center text-[#8B4513] font-medium mb-2">
            ✓ เลือก: {selectedValue}
          </p>
        )}
        <div className="flex gap-3">
          {!currentCat.required && (
            <button
              onClick={goNext}
              className="flex-1 py-3 rounded-2xl border border-[#8B4513] text-[#8B4513] font-medium text-sm"
            >
              ข้ามขั้นตอนนี้
            </button>
          )}
          <button
            disabled={!canContinue || createOrder.isPending}
            onClick={goNext}
            className="flex-1 py-3 rounded-2xl bg-[#8B4513] text-white font-semibold text-sm disabled:opacity-40 transition-opacity"
          >
            {createOrder.isPending
              ? 'กำลังส่ง...'
              : (step as number) === MENU_CATEGORIES.length - 1
              ? 'ส่งออเดอร์ →'
              : 'ถัดไป →'}
          </button>
        </div>
      </div>
    </div>
  )
}
