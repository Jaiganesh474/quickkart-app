import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import authReducer from './slices/authSlice';
import ordersReducer from './slices/ordersSlice';
import couponsReducer from './slices/couponsSlice';
import settingsReducer from './slices/settingsSlice';
import { quickKartApi } from '../services/api';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'cart', 'wishlist', 'orders', 'coupons', 'settings'], // Only persist these
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  orders: ordersReducer,
  coupons: couponsReducer,
  settings: settingsReducer,
  [quickKartApi.reducerPath]: quickKartApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }).concat(quickKartApi.middleware),
});

export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
