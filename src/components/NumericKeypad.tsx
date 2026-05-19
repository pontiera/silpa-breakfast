import { Delete } from 'lucide-react'

interface Props {
  value: string
  onChange: (v: string) => void
  onDone: () => void
  maxLength?: number
}

export default function NumericKeypad({ value, onChange, onDone, maxLength = 4 }: Props) {
  const press = (digit: string) => {
    if (value.length < maxLength) onChange(value + digit)
  }
  const del = () => onChange(value.slice(0, -1))

  const btn = 'flex items-center justify-center rounded-2xl text-2xl font-semibold h-16 active:scale-95 transition-transform cursor-pointer select-none'

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center pb-6 px-4">
      <div className="bg-[#F5F0E8] rounded-3xl w-full max-w-sm p-5 shadow-2xl">
        {/* Display */}
        <div className="bg-[#EDE8DF] rounded-xl text-center text-3xl font-bold tracking-widest py-4 mb-4 text-[#2C1810] min-h-[64px]">
          {value || <span className="text-[#2C1810]/30">—</span>}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3">
          {['1','2','3','4','5','6','7','8','9'].map((d) => (
            <button key={d} onClick={() => press(d)}
              className={`${btn} bg-white text-[#2C1810] shadow-sm`}>
              {d}
            </button>
          ))}
          <div />
          <button onClick={() => press('0')}
            className={`${btn} bg-white text-[#2C1810] shadow-sm`}>
            0
          </button>
          <button onClick={del}
            className={`${btn} bg-[#EDE8DF] text-[#2C1810]`}>
            <Delete size={22} />
          </button>
        </div>

        <button
          onClick={onDone}
          className="mt-4 w-full py-4 rounded-2xl bg-[#8B4513] text-white text-lg font-semibold active:scale-95 transition-transform">
          Done
        </button>
      </div>
    </div>
  )
}
