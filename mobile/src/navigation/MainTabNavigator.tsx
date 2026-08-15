import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import PlayScreen from '../screens/PlayScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import AccountScreen from '../screens/AccountScreen';
import CartScreen from '../screens/CartScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import SellerDashboardScreen from '../screens/SellerDashboardScreen';
import { colors } from '../theme/colors';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            return <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />;
          } else if (route.name === 'Play') {
            return <Ionicons name={focused ? 'play-circle' : 'play-circle-outline'} size={size} color={color} />;
          } else if (route.name === 'Categories') {
            return <MaterialIcons name="category" size={size} color={color} />;
          } else if (route.name === 'Account') {
            return <MaterialIcons name={focused ? 'person' : 'person-outline'} size={size} color={color} />;
          } else if (route.name === 'Cart') {
            return <Ionicons name={focused ? 'cart' : 'cart-outline'} size={size} color={color} />;
          } else if (route.name === 'Admin') {
            return <Ionicons name={focused ? 'shield-checkmark' : 'shield-checkmark-outline'} size={size} color={color} />;
          } else if (route.name === 'Seller') {
            return <Ionicons name={focused ? 'storefront' : 'storefront-outline'} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Play" component={PlayScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      {user?.role === 'ADMIN' && (
        <Tab.Screen name="Admin" component={AdminDashboardScreen} />
      )}
      {user?.role === 'SELLER' && (
        <Tab.Screen name="Seller" component={SellerDashboardScreen} />
      )}
    </Tab.Navigator>
  );
}
