import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { useGetProductsQuery } from '../services/api';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

export default function WishlistScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const wishlistIds = useSelector((state: RootState) => state.wishlist.itemIds);
  const { data: allProducts, isLoading } = useGetProductsQuery();

  const handleRemove = (id: string) => {
    dispatch(toggleWishlist(id));
  };

  const wishlistProducts = allProducts?.filter(p => wishlistIds.includes(p.id.toString())) || [];

  const renderWishlistItem = (product: any) => (
    <View key={product.id} style={styles.itemCard}>
      <View style={styles.imagePlaceholder}>
        <Ionicons name="image-outline" size={24} color={colors.border} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>{product.title}</Text>
        <Text style={styles.itemCategory}>{product.category?.name || 'Category'}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          {product.originalPrice > product.price && (
            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
          )}
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.removeBtn} 
          onPress={() => handleRemove(product.id.toString())}
        >
          <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.cartBtn}
          onPress={() => { /* @ts-ignore */ navigation.navigate('ProductDetails', { id: product.id }) }}
        >
          <Ionicons name="cart-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>My Wishlist</Text>
      </View>

      {wishlistIds.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={colors.border} />
          <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
          <Text style={styles.emptySub}>Save items you like here.</Text>
          <TouchableOpacity style={styles.shopNowBtn} onPress={() => { /* @ts-ignore */ navigation.navigate('Home') }}>
            <Text style={styles.shopNowText}>Discover Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.countRow}>
            <Text style={styles.countText}>{wishlistProducts.length} Items</Text>
          </View>
          {wishlistProducts.map(renderWishlistItem)}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: spacing.md, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border,
    backgroundColor: colors.surface
  },
  backBtn: { marginRight: spacing.md },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginTop: spacing.md },
  emptySub: { fontSize: 15, color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
  shopNowBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.round,
  },
  shopNowText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    padding: spacing.md,
  },
  countRow: {
    marginBottom: spacing.md,
  },
  countText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imagePlaceholder: {
    width: 70,
    height: 70,
    backgroundColor: '#F5F5F5',
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm,
  },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
  },
  removeBtn: {
    padding: 4,
  },
  cartBtn: {
    padding: 8,
    backgroundColor: '#F0F8FF',
    borderRadius: radius.round,
  }
});
