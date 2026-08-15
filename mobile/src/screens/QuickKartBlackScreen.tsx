import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { spacing, radius } from '../theme/spacing';

const { width } = Dimensions.get('window');

export default function QuickKartBlackScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QuickKart BLACK</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Premium Hero Banner */}
        <View style={styles.heroBanner}>
          <Ionicons name="diamond" size={48} color="#FFD700" style={styles.heroIcon} />
          <Text style={styles.heroTitle}>Welcome to BLACK</Text>
          <Text style={styles.heroSubtitle}>
            The ultimate membership. Unrivaled luxury, unmatched convenience, and exclusive privileges designed just for you.
          </Text>
          <TouchableOpacity style={styles.subscribeBtn}>
            <Text style={styles.subscribeBtnText}>Join for ₹999/year</Text>
          </TouchableOpacity>
        </View>

        {/* Benefits Grid */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Exclusive Privileges</Text>
          
          <View style={styles.benefitCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FF000020' }]}>
              <Ionicons name="logo-youtube" size={32} color="#FF0000" />
            </View>
            <View style={styles.benefitTextContainer}>
              <Text style={styles.benefitTitle}>Free YouTube Premium</Text>
              <Text style={styles.benefitDesc}>Enjoy 6 months of ad-free YouTube and YouTube Music Premium, on us.</Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FFD70020' }]}>
              <FontAwesome5 name="concierge-bell" size={28} color="#FFD700" />
            </View>
            <View style={styles.benefitTextContainer}>
              <Text style={styles.benefitTitle}>24/7 VIP Concierge</Text>
              <Text style={styles.benefitDesc}>Skip the bots. Get a dedicated human relationship manager available 24/7 via phone or chat.</Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#4CAF5020' }]}>
              <MaterialCommunityIcons name="cash-refund" size={32} color="#4CAF50" />
            </View>
            <View style={styles.benefitTextContainer}>
              <Text style={styles.benefitTitle}>Flat 5% Cashback</Text>
              <Text style={styles.benefitDesc}>Earn a guaranteed flat 5% cashback on every single order, with no upper limit.</Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#2196F320' }]}>
              <MaterialCommunityIcons name="rocket-launch" size={32} color="#2196F3" />
            </View>
            <View style={styles.benefitTextContainer}>
              <Text style={styles.benefitTitle}>Flash Delivery</Text>
              <Text style={styles.benefitDesc}>Get your products delivered in under 4 hours in select metro cities, absolutely free.</Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#E91E6320' }]}>
              <Ionicons name="calendar-outline" size={32} color="#E91E63" />
            </View>
            <View style={styles.benefitTextContainer}>
              <Text style={styles.benefitTitle}>30-Day No Questions Returns</Text>
              <Text style={styles.benefitDesc}>Not happy? Return any product within 30 days. No questions asked. Instant refund.</Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#9C27B020' }]}>
              <Ionicons name="ticket" size={32} color="#9C27B0" />
            </View>
            <View style={styles.benefitTextContainer}>
              <Text style={styles.benefitTitle}>Early Access to Blockbusters</Text>
              <Text style={styles.benefitDesc}>Shop the biggest sales of the year 48 hours before the rest of the world.</Text>
            </View>
          </View>

        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Deep black background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    backgroundColor: '#0A0A0A',
  },
  backBtn: {
    marginRight: spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
  },
  container: {
    flex: 1,
  },
  heroBanner: {
    padding: spacing.xxl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    backgroundColor: '#111',
  },
  heroIcon: {
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: spacing.sm,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  subscribeBtn: {
    backgroundColor: '#FFD700', // Gold button
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  subscribeBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  benefitsSection: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A', // Darker card
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#333',
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 6,
  },
  benefitDesc: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
});
