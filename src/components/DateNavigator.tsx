import { ChevronLeft, ChevronRight, Calendar, RefreshCw } from 'lucide-react'
import { formatHeaderDate, addDays, todayBangkok } from '../utils/time'

interface Props {
  date: string
  onChange: (d: string) => void
  onRefresh?: () => void
}

export default function DateNavigator({ date, onChange, onRefresh }: Props) {
  const today = todayBangkok()
  const isToday = date === today

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(addDays(date, -1))}
        className="p-2 rounded-xl hover:bg-[#EDE8DF] transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex items-center gap-2 px-3 py-2 bg-[#EDE8DF] rounded-xl min-w-[160px] justify-center">
        <Calendar size={15} className="text-[#8B4513]" />
        <span className="text-sm font-medium text-[#2C1810]">
          {formatHeaderDate(date)}
          {isToday && <span className="ml-1 text-xs text-[#8B4513]">(วันนี้)</span>}
        </span>
      </div>

      <button
        onClick={() => onChange(addDays(date, 1))}
        disabled={isToday}
        className="p-2 rounded-xl hover:bg-[#EDE8DF] transition-colors disabled:opacity-30"
      >
        <ChevronRight size={18} />
      </button>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="p-2 rounded-xl hover:bg-[#EDE8DF] transition-colors"
        >
          <RefreshCw size={16} />
        </button>
      )}
    </div>
  )
}
