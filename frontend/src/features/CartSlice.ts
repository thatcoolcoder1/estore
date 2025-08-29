// src/features/CartSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface CartItem {
  product: string;
  title: string;
  image: string[];
  price: number;
  quantity: number;
}

interface Cart {
  _id?: string;
  user?: string;
  items: CartItem[];
  totalPrice: number;
}

const initialState: Cart = {
  items: [],
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ NEW: set entire cart from backend
    setCart: (_state, action: PayloadAction<Cart>) => {
      return action.payload;
    },

    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.product === item.product);

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }

      state.totalPrice = state.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
    },

    removeItemFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.product !== action.payload);
      state.totalPrice = state.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
    },

    updateItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.product === productId);

      if (item) {
        item.quantity = quantity;
      }

      state.totalPrice = state.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
    },

    // Assuming your state looks like { items: [], totalPrice: 0 }
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const {
  setCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
