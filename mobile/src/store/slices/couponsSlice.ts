import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount: number;
  description: string;
}

interface CouponsState {
  availableCoupons: Coupon[];
  appliedCoupon: Coupon | null;
}

const initialState: CouponsState = {
  availableCoupons: [
    {
      id: '1',
      code: 'WELCOME50',
      discountType: 'percentage',
      discountValue: 50,
      minPurchaseAmount: 100,
      description: 'Get 50% off on your first order above ₹100'
    },
    {
      id: '2',
      code: 'FLAT200',
      discountType: 'fixed',
      discountValue: 200,
      minPurchaseAmount: 1000,
      description: 'Flat ₹200 off on orders above ₹1000'
    }
  ],
  appliedCoupon: null,
};

const couponsSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    applyCoupon: (state, action: PayloadAction<Coupon>) => {
      state.appliedCoupon = action.payload;
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
    }
  },
});

export const { applyCoupon, removeCoupon } = couponsSlice.actions;
export default couponsSlice.reducer;
