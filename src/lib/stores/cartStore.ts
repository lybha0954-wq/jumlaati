import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  productId: string;
  wholesalerId: string; // المفتاح الجديد لتقسيم السلة
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  // دالة جديدة لتجميع السلة حسب الجملة
  getGroupedItems: () => { [wholesalerId: string]: CartItem[] };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.wholesalerId === item.wholesalerId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.wholesalerId === item.wholesalerId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      
      // الدالة الجديدة: تقوم بتجميع المنتجات حسب تاجر الجملة
      getGroupedItems: () => {
        const groups: { [wholesalerId: string]: CartItem[] } = {};
        get().items.forEach((item) => {
          if (!groups[item.wholesalerId]) {
            groups[item.wholesalerId] = [];
          }
          groups[item.wholesalerId].push(item);
        });
        return groups;
      },
    }),
    { name: "jumla-cart-storage" }
  )
);
