import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  itemIds: string[];
}

const initialState: WishlistState = {
  itemIds: [],
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const index = state.itemIds.indexOf(action.payload);
      if (index >= 0) {
        state.itemIds.splice(index, 1);
      } else {
        state.itemIds.push(action.payload);
      }
    },
    clearWishlist: (state) => {
      state.itemIds = [];
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
