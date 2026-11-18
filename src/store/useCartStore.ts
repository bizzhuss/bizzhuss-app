import { create } from 'zustand';
import { Product, CartItem } from '@/types';

interface CartState {
  items: CartItem[];

  // Actions
  addItem: (product: Product, quantity?: number, selectedAttributes?: Record<string, string>) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  // Computed Selectors
  subtotal: () => number;
  totalItems: () => number;
  getItemQuantity: (productId: number) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product: Product, quantity = 1, selectedAttributes) => {
    if (quantity <= 0) return;

    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        const updated = [...state.items];
        const currentQty = updated[existingIndex].quantity;
        const newQty = Math.min(
          currentQty + quantity,
          product.stock_quantity > 0 ? product.stock_quantity : currentQty + quantity
        );

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          selectedAttributes: selectedAttributes || updated[existingIndex].selectedAttributes,
        };
        return { items: updated };
      }

      return {
        items: [
          ...state.items,
          {
            product,
            quantity: Math.min(quantity, product.stock_quantity > 0 ? product.stock_quantity : quantity),
            selectedAttributes,
          },
        ],
      };
    });
  },

  removeItem: (productId: number) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  updateQuantity: (productId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) => {
        if (item.product.id === productId) {
          const max = item.product.stock_quantity > 0 ? item.product.stock_quantity : quantity;
          return {
            ...item,
            quantity: Math.min(quantity, max),
          };
        }
        return item;
      }),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  subtotal: () => {
    return get().items.reduce((sum, item) => {
      const price = item.product.sale_price ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);
  },

  totalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getItemQuantity: (productId: number) => {
    const item = get().items.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  },
}));

export default useCartStore;
