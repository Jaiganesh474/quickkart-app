import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useGetCustomerOrdersQuery } from '../services/api';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

const { width } = Dimensions.get('window');

export default function QuickKartPlusScreen() {
  const navigation = useNavigation();
  const { data: apiOrders, isLoading } = useGetCustomerOrdersQuery();

  // Dynamic progress data
  const currentOrders = apiOrders ? apiOrders.length : 0;
  
  let membershipTier = 'BRONZE';
  let totalOrdersNeeded = 15;
  let nextTier = 'SILVER';
  
  if (currentOrders >= 20) {
    membershipTier = 'GOLD';
    totalOrdersNeeded = currentOrders; // Reached max tier
    nextTier = 'MAX';
  } else if (currentOrders >= 15) {
    membershipTier = 'SILVER';
    totalOrdersNeeded = 20;
    nextTier = 'GOLD';
  }

  const progressPercentage = Math.min((currentOrders / totalOrdersNeeded) * 100, 100);

  const renderBanner = () => {
    if (membershipTier === 'GOLD') {
      return (
        <View style={styles.bannerCard}>
          <View style={styles.bannerHeader}>
            <Ionicons name="trophy" size={28} color="#FFD700" />
            <Text style={styles.bannerTitle}>QuickKart GOLD</Text>
          </View>
          <Text style={styles.bannerSubtext}>You've unlocked the ultimate tier! Enjoy maximum benefits including exclusive discounts and free delivery.</Text>
        </View>
      );
    } else if (membershipTier === 'SILVER') {
      return (
        <View style={[styles.bannerCard, { backgroundColor: '#2C3E50' }]}>
          <View style={styles.bannerHeader}>
            <Ionicons name="medal" size={28} color="#C0C0C0" />
            <Text style={[styles.bannerTitle, { color: '#E0E0E0' }]}>QuickKart SILVER</Text>
          </View>
          <Text style={styles.bannerSubtext}>Great job! You are a Silver member. Keep ordering to unlock Gold tier benefits.</Text>
        </View>
      );
    }
    return (
      <View style={[styles.bannerCard, { backgroundColor: '#795548' }]}>
        <View style={styles.bannerHeader}>
          <Ionicons name="star" size={28} color="#FFC107" />
          <Text style={[styles.bannerTitle, { color: '#FFECB3' }]}>QuickKart BRONZE</Text>
        </View>
        <Text style={styles.bannerSubtext}>Start your journey. Complete orders to unlock Silver and Gold memberships!</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QuickKart Plus</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Premium Banner */}
        {renderBanner()}

        {/* Progress Tracker */}
        {membershipTier !== 'GOLD' && (
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Your Journey to {nextTier}</Text>
            <Text style={styles.progressSubtitle}>Complete {totalOrdersNeeded - currentOrders} more orders to unlock {nextTier} status!</Text>
            
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
            </View>
            
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabelText}>0</Text>
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.progressLabelHighlight}>{currentOrders} Orders</Text>
              )}
              <Text style={styles.progressLabelText}>{totalOrdersNeeded}</Text>
            </View>
          </View>
        )}

        {/* Membership Benefits */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.sectionTitle}>Your Current Benefits</Text>
          
          <View style={styles.benefitItem}>
            <View style={[styles.benefitIconBox, { backgroundColor: 'rgba(255, 144, 0, 0.1)' }]}>
              <MaterialCommunityIcons name="truck-fast-outline" size={28} color={colors.primary} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Free Priority Delivery</Text>
              <Text style={styles.benefitDesc}>
                {membershipTier === 'GOLD' 
                  ? 'Unlimited FREE deliveries on all orders.' 
                  : membershipTier === 'SILVER' 
                  ? 'FREE delivery on orders above ₹499.' 
                  : 'Standard delivery fees apply.'}
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIconBox, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
              <Ionicons name="pricetag-outline" size={28} color="#4CAF50" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Exclusive Discounts</Text>
              <Text style={styles.benefitDesc}>
                {membershipTier === 'GOLD' 
                  ? 'Extra 10% off on thousands of selected products.' 
                  : membershipTier === 'SILVER' 
                  ? 'Extra 5% off on selected products.' 
                  : 'Regular pricing on all products.'}
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIconBox, { backgroundColor: 'rgba(156, 39, 176, 0.1)' }]}>
              <Ionicons name="cash-outline" size={28} color="#9C27B0" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Reward Coins</Text>
              <Text style={styles.benefitDesc}>
                {membershipTier === 'GOLD' 
                  ? 'Earn 2X SuperCoins on every purchase.' 
                  : 'Earn standard SuperCoins on every purchase.'}
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIconBox, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
              <Ionicons name="headset-outline" size={28} color="#2196F3" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Customer Support</Text>
              <Text style={styles.benefitDesc}>
                {membershipTier === 'GOLD' || membershipTier === 'SILVER' 
                  ? 'Priority instant access to top-tier support executives.' 
                  : 'Standard customer support queue.'}
              </Text>
            </View>
          </View>

        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backBtn: {
    marginRight: spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  bannerCard: {
    margin: spacing.md,
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: '#1E1E1E', // Premium Dark mode card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFD700',
    marginLeft: spacing.sm,
    letterSpacing: 1,
  },
  bannerSubtext: {
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 22,
  },
  progressCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  progressSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  progressTrack: {
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabelText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: 'bold',
  },
  progressLabelHighlight: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  benefitsContainer: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    paddingTop: spacing.xl,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  benefitIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
