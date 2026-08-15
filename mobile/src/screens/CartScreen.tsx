import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import ProductCard from '../components/ProductCard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useGetProductsQuery } from '../services/api';
import { Image } from 'react-native';

export default function CartScreen() {
  const [activeTab, setActiveTab] = useState('flipkart');
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { data: products } = useGetProductsQuery();
  
  const recentProducts = products ? products.slice(0, 5) : [];

  const cartTotal = cartItems.reduce((total, item) => {
      const priceStr = item.price.replace(/[^0-9.-]+/g,"");
      return total + (parseFloat(priceStr) * item.quantity);
  }, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        
        {/* Header Title */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>

        {/* Toggle Switch */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, activeTab === 'flipkart' && styles.toggleBtnActive]}
            onPress={() => setActiveTab('flipkart')}
          >
            <Text style={[styles.toggleText, activeTab === 'flipkart' && styles.toggleTextActive]}>QuickKart</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, activeTab === 'minutes' && styles.toggleBtnActive]}
            onPress={() => setActiveTab('minutes')}
          >
            <Text style={[styles.toggleText, activeTab === 'minutes' && styles.toggleTextActive]}>Minutes/Grocery</Text>
          </TouchableOpacity>
        </View>

        {/* Cart State */}
        {activeTab === 'minutes' ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.illustrationPlaceholder}>
              <Ionicons name="basket-outline" size={100} color={colors.border} />
            </View>
            <Text style={styles.emptyTitle}>Your grocery cart is empty!</Text>
            <TouchableOpacity style={styles.shopNowBtn}>
              <Text style={styles.shopNowText}>Shop Groceries</Text>
            </TouchableOpacity>
          </View>
        ) : cartItems.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.illustrationPlaceholder}>
              <Ionicons name="cart-outline" size={100} color={colors.border} />
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty!</Text>
            <TouchableOpacity style={styles.shopNowBtn}>
              <Text style={styles.shopNowText}>Shop now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cartItemsContainer}>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartItemCard}>
                <View style={styles.cartItemTop}>
                   {item.imageUrl ? (
                      <Image source={{ uri: item.imageUrl }} style={styles.cartItemImage} />
                   ) : (
                      <View style={styles.cartItemImagePlaceholder} />
                   )}
                   <View style={styles.cartItemDetails}>
                      <Text style={styles.cartItemTitle}>{item.title}</Text>
                      <Text style={styles.price}>{item.price}</Text>
                   </View>
                </View>
                <View style={styles.cartItemActions}>
                   <View style={styles.quantityControl}>
                      <TouchableOpacity onPress={() => dispatch(updateQuantity({id: item.id, quantity: item.quantity - 1}))}>
                        <Ionicons name="remove-circle-outline" size={24} color={colors.text} />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => dispatch(updateQuantity({id: item.id, quantity: item.quantity + 1}))}>
                        <Ionicons name="add-circle-outline" size={24} color={colors.text} />
                      </TouchableOpacity>
                   </View>
                   <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
                      <Text style={styles.removeText}>Remove</Text>
                   </TouchableOpacity>
                </View>
              </View>
            ))}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{cartTotal.toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
               style={styles.checkoutBtn}
               onPress={() => {
                 if (isAuthenticated) {
                   Toast.show({
                     type: 'success',
                     text1: 'Order Proceeding',
                     text2: 'Redirecting to checkout...'
                   });
                   // @ts-ignore
                   navigation.navigate('Checkout');
                 } else {
                   // @ts-ignore
                   navigation.navigate('Login');
                 }
               }}
            >
               <Text style={styles.checkoutText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Recently Viewed */}
        <View style={styles.recentlyViewedContainer}>
          <Text style={styles.sectionTitle}>Recently Viewed</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
            {recentProducts.map((item: any) => (
              <View key={item.id} style={styles.productCardWrapper}>
                <ProductCard 
                  id={item.id.toString()}
                  title={item.title}
                  category={item.category?.name || item.category || 'General'}
                  imageUrl={item.imageUrl}
                  discountBadge={item.discount}
                  price={item.price}
                  originalPrice={item.originalPrice}
                />
                
                <TouchableOpacity 
                  style={styles.addToCartBtn}
                  onPress={() => dispatch({
                     type: 'cart/addToCart',
                     payload: {
                        id: item.id.toString(),
                        title: item.title,
                        category: item.category?.name || item.category || 'General',
                        price: item.price.toString(),
                        originalPrice: (item.originalPrice || item.price).toString(),
                        discount: item.discount || '',
                        imageUrl: item.imageUrl || ''
                     }
                  })}
                >
                  <Text style={styles.addToCartText}>Add to cart</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 14,
    color: colors.text,
  },
  toggleTextActive: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: '#F9F9F9',
    marginBottom: spacing.xl,
  },
  illustrationPlaceholder: {
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xl,
  },
  shopNowBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    width: 200,
    alignItems: 'center',
  },
  shopNowText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemsContainer: {
    padding: spacing.md,
  },
  cartItemCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cartItemTop: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: radius.sm,
    marginRight: spacing.md,
    backgroundColor: '#fff',
  },
  cartItemImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    marginRight: spacing.md,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemTitle: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  cartItemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: spacing.md,
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeText: {
    color: colors.error,
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.md,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  checkoutBtn: {
    backgroundColor: '#FF9000',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  checkoutText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentlyViewedContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  productsScroll: {
    flexDirection: 'row',
  },
  productCardWrapper: {
    width: 140, // slightly wider than default product card
    marginRight: spacing.md,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  addToCartBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  addToCartText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  }
});
