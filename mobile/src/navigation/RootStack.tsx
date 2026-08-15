import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import CameraSearchScreen from '../screens/CameraSearchScreen';
import OrdersScreen from '../screens/OrdersScreen';
import WishlistScreen from '../screens/WishlistScreen';
import CouponsScreen from '../screens/CouponsScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import ManageDevicesScreen from '../screens/ManageDevicesScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SavedCardsScreen from '../screens/SavedCardsScreen';
import SavedAddressesScreen from '../screens/SavedAddressesScreen';
import SelectLanguageScreen from '../screens/SelectLanguageScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import PrivacyCenterScreen from '../screens/PrivacyCenterScreen';
import BecomeSellerScreen from '../screens/BecomeSellerScreen';
import AddEditProductScreen from '../screens/AddEditProductScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import TrackOrderScreen from '../screens/TrackOrderScreen';
import SearchScreen from '../screens/SearchScreen';

import QuickKartPlusScreen from '../screens/QuickKartPlusScreen';
import QuickKartBlackScreen from '../screens/QuickKartBlackScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetails: { id: string };
  Login: undefined;
  Otp: { phoneNumber: string };
  CameraSearch: undefined;
  Orders: undefined;
  Wishlist: undefined;
  Coupons: undefined;
  HelpCenter: undefined;
  ManageDevices: undefined;
  EditProfile: undefined;
  SavedCards: undefined;
  SavedAddresses: undefined;
  SelectLanguage: undefined;
  NotificationSettings: undefined;
  PrivacyCenter: undefined;
  BecomeSeller: undefined;
  AddEditProduct: { product?: any };
  Checkout: undefined;
  TrackOrder: { order: any };
  SearchScreen: { initialQuery?: string };
  QuickKartPlus: undefined;
  QuickKartBlack: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="CameraSearch" component={CameraSearchScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="Coupons" component={CouponsScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="ManageDevices" component={ManageDevicesScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="SavedCards" component={SavedCardsScreen} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
      <Stack.Screen name="SelectLanguage" component={SelectLanguageScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="PrivacyCenter" component={PrivacyCenterScreen} />
      <Stack.Screen name="BecomeSeller" component={BecomeSellerScreen} />
      <Stack.Screen name="AddEditProduct" component={AddEditProductScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="QuickKartPlus" component={QuickKartPlusScreen} />
      <Stack.Screen name="QuickKartBlack" component={QuickKartBlackScreen} />
    </Stack.Navigator>
  );
}
