export const toBangkokDateStr = (d: string | Date): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(d))

export const todayBangkok = (): string => toBangkokDateStr(new Date())

export const formatOrderTime = (created_at: string): string =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Bangkok',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(new Date(created_at))
    .replace(',', '')

export const formatHeaderDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-')
  const d = new Date(Number(year), Number(month) - 1, Number(day))
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

export const addDays = (dateStr: string, n: number): string => {
  const d = new Date(dateStr + 'T12:00:00+07:00')
  d.setDate(d.getDate() + n)
  return toBangkokDateStr(d)
}
