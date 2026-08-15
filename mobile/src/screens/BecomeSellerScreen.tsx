import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { RootState } from '../store';
import { updateUser } from '../store/slices/authSlice';
import { useApplyToBeSellerMutation } from '../services/api';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import Button from '../components/Button';

export default function BecomeSellerScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [applyToBeSeller, { isLoading }] = useApplyToBeSellerMutation();

  const handleApply = async () => {
    if (!isAuthenticated) {
      Toast.show({
        type: 'info',
        text1: 'Authentication Required',
        text2: 'Please login to apply as a seller.'
      });
      // @ts-ignore
      navigation.navigate('Login');
      return;
    }

    try {
      await applyToBeSeller().unwrap();
      dispatch(updateUser({ role: 'PENDING_SELLER' }));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Application submitted! Awaiting admin approval.'
      });
    } catch (e: any) {
      console.error('Failed to apply', e);
      
      const errorMsg = e.data?.error || 'Failed to apply';
      
      if (errorMsg === 'Already a seller') {
        dispatch(updateUser({ role: 'SELLER' }));
        Toast.show({
          type: 'info',
          text1: 'Notice',
          text2: 'You are already an approved seller! Redirecting to Seller Dashboard...'
        });
        // @ts-ignore
        navigation.navigate('MainTabs', { screen: 'Seller' });
        return;
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Become a Seller</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {user?.role === 'PENDING_SELLER' ? (
          <View style={styles.pendingContainer}>
            <Ionicons name="time-outline" size={64} color={colors.primary} />
            <Text style={styles.pendingTitle}>Application Pending</Text>
            <Text style={styles.pendingDesc}>Your request to become a seller is currently being reviewed by an administrator. Please check back later.</Text>
          </View>
        ) : user?.role === 'SELLER' ? (
          <View style={styles.pendingContainer}>
            <Ionicons name="checkmark-circle-outline" size={64} color={colors.primary} />
            <Text style={styles.pendingTitle}>You are a Seller!</Text>
            <Text style={styles.pendingDesc}>Your account has been approved. You can now manage your products in the Seller Dashboard.</Text>
          </View>
        ) : (
          <View>
            <View style={styles.banner}>
              <Ionicons name="storefront" size={48} color={colors.primary} />
              <Text style={styles.bannerTitle}>Start Selling on QuickKart</Text>
              <Text style={styles.bannerDesc}>Join thousands of sellers and reach millions of customers today.</Text>
            </View>

            <View style={styles.benefitsContainer}>
              <View style={styles.benefitItem}>
                <Ionicons name="wallet-outline" size={24} color={colors.primary} style={styles.benefitIcon} />
                <View style={styles.benefitTextContainer}>
                  <Text style={styles.benefitTitle}>Zero Commission Fees</Text>
                  <Text style={styles.benefitDesc}>Keep 100% of your profits for the first 3 months.</Text>
                </View>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="trending-up-outline" size={24} color={colors.primary} style={styles.benefitIcon} />
                <View style={styles.benefitTextContainer}>
                  <Text style={styles.benefitTitle}>Reach More Customers</Text>
                  <Text style={styles.benefitDesc}>Get access to our massive nationwide customer base instantly.</Text>
                </View>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="shield-checkmark-outline" size={24} color={colors.primary} style={styles.benefitIcon} />
                <View style={styles.benefitTextContainer}>
                  <Text style={styles.benefitTitle}>Secure Payments</Text>
                  <Text style={styles.benefitDesc}>Guaranteed payouts within 48 hours of delivery.</Text>
                </View>
              </View>
            </View>

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>By clicking below, you agree to our Seller Terms and Conditions and consent to an Admin review of your account.</Text>
            </View>

            <Button 
              title={isLoading ? "Submitting..." : "Agree & Apply to Sell"} 
              onPress={handleApply} 
              loading={isLoading} 
              icon="arrow-forward"
            />
          </View>
        )}
      </ScrollView>
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
  title: { fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif' },
  content: {
    padding: spacing.md,
  },
  pendingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.lg,
  },
  pendingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  pendingDesc: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  banner: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: '#F0F8FF',
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#D4E6F1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  bannerDesc: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.sm,
  },
  benefitsContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  benefitIcon: {
    backgroundColor: '#E6F0FF',
    padding: spacing.md,
    borderRadius: radius.md,
    marginRight: spacing.md,
  },
  benefitTextContainer: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  benefitTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  termsContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  termsText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  }
});
