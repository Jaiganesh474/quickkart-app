import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image_url: string;
  }>;
}

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: Order['status'] }>) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
    clearOrders: (state) => {
      state.orders = [];
    }
  },
});

export const { addOrder, updateOrderStatus, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
