import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { BreakfastOrder, OrderStatus } from '../types'
import { toBangkokDateStr } from '../utils/time'
import { useEffect } from 'react'

const SEVEN_DAYS_AGO = () => {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d.toISOString()
}

export function useOrders(selectedDate: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['orders', selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('breakfast_orders')
        .select('*')
        .gte('created_at', SEVEN_DAYS_AGO())
        .order('created_at', { ascending: false })

      if (error) throw error

      // Filter by Bangkok date on frontend (timezone-safe)
      return (data as BreakfastOrder[]).filter(
        (o) => toBangkokDateStr(o.created_at) === selectedDate
      )
    },
    refetchInterval: 15000,
  })

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('breakfast_orders_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'breakfast_orders' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['orders'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return query
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { error } = await supabase
        .from('breakfast_orders')
        .update({ status })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (
      order: Omit<BreakfastOrder, 'id' | 'order_number' | 'status' | 'created_at' | 'updated_at'>
    ) => {
      const { data, error } = await supabase
        .from('breakfast_orders')
        .insert({ ...order, order_number: '' })
        .select()
        .single()
      if (error) throw error
      return data as BreakfastOrder
    },
  })
}
