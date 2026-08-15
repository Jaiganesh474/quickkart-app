import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { applyCoupon, removeCoupon } from '../store/slices/couponsSlice';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

export default function CouponsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { availableCoupons, appliedCoupon } = useSelector((state: RootState) => state.coupons);

  const handleApplyCoupon = (coupon: any) => {
    dispatch(applyCoupon(coupon));
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
  };

  const renderCoupon = (coupon: any) => {
    const isApplied = appliedCoupon?.id === coupon.id;

    return (
      <View key={coupon.id} style={[styles.couponCard, isApplied && styles.couponCardApplied]}>
        <View style={styles.couponHeader}>
          <View style={styles.codeContainer}>
            <Ionicons name="pricetag" size={16} color={isApplied ? colors.surface : colors.primary} />
            <Text style={[styles.codeText, isApplied && { color: colors.surface }]}>{coupon.code}</Text>
          </View>
          {isApplied ? (
            <TouchableOpacity onPress={handleRemoveCoupon} style={styles.actionBtn}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => handleApplyCoupon(coupon)} style={styles.actionBtn}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.couponBody}>
          <Text style={styles.description}>{coupon.description}</Text>
          <Text style={styles.minPurchase}>Valid on orders above ₹{coupon.minPurchaseAmount}</Text>
        </View>
        <View style={styles.dottedLine} />
        <View style={styles.couponFooter}>
          <Text style={styles.expiry}>Valid till 31 Dec 2026</Text>
          <Text style={styles.tnc}>T&C Apply</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Coupons & Offers</Text>
      </View>

      {availableCoupons.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="gift-outline" size={64} color={colors.border} />
          <Text style={styles.emptyTitle}>No Coupons Available</Text>
          <Text style={styles.emptySub}>Check back later for exciting offers.</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Available Coupons</Text>
          {availableCoupons.map(renderCoupon)}
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
  content: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  couponCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  couponCardApplied: {
    borderColor: colors.primary,
    backgroundColor: '#F0F8FF',
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F0FF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  actionBtn: {
    padding: spacing.sm,
  },
  applyText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
  removeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.error,
  },
  couponBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  description: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  minPurchase: {
    fontSize: 13,
    color: colors.textMuted,
  },
  dottedLine: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  couponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  expiry: {
    fontSize: 12,
    color: colors.textMuted,
  },
  tnc: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  }
});
