"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  product_id: string
  name: string
  price: number
  image_url: string | null
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (product_id: string) => void
  updateQuantity: (product_id: string, quantity: number) => void
  clear: () => void
  totalItems: () => number
  totalAmount: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const existing = get().items.find((i) => i.product_id === item.product_id)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product_id === item.product_id
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
          })
        } else {
          set({ items: [...get().items, { ...item, quantity }] })
        }
      },
      removeItem: (product_id) =>
        set({ items: get().items.filter((i) => i.product_id !== product_id) }),
      updateQuantity: (product_id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.product_id !== product_id) })
          return
        }
        set({
          items: get().items.map((i) =>
            i.product_id === product_id ? { ...i, quantity } : i,
          ),
        })
      },
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalAmount: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "lehem-cart",
    },
  ),
)
