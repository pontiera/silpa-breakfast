export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled'

export interface BreakfastOrder {
  id: string
  order_number: string
  room_number: string
  guest_name?: string
  coffee_tea?: string
  juice?: string
  morning_bowl?: string
  bakery?: string
  main_dish: string
  special_requests?: string
  status: OrderStatus
  created_at: string
  updated_at: string
}

export interface MenuCategory {
  id: number
  key: keyof Pick<BreakfastOrder, 'coffee_tea' | 'juice' | 'morning_bowl' | 'bakery' | 'main_dish'>
  title: string
  subtitle: string
  icon: string
  required: boolean
  items: MenuItem[]
}

export interface MenuItem {
  id: string
  name: string
  description?: string
  image_url?: string
}
