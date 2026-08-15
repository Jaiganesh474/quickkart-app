import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert, Platform, Image } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { useTranslation } from '../hooks/useTranslation';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import ConfirmModal from '../components/ConfirmModal';

export default function AccountScreen() {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        
        {/* Header Profile Section */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.avatarContainer}>
                {auth.user?.profilePicture ? (
                  <Image source={{ uri: auth.user.profilePicture }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={24} color={colors.primary} />
                )}
              </View>
              <Text style={styles.userName}>
                {auth.isAuthenticated ? auth.user?.name || `+91 ${auth.user?.phoneNumber}` : 'Guest User'}
              </Text>
            </View>
            {auth.isAuthenticated && (
              <View style={styles.coinsContainer}>
                <Ionicons name="flash" size={14} color={colors.warning} />
                <Text style={styles.coinsText}>0</Text>
              </View>
            )}
          </View>
          <Text style={styles.headerSubtext}>
            {auth.isAuthenticated 
              ? 'Enjoy FREE YouTube Premium,\nEarly Access to sale and more with Black.' 
              : 'Log in to get exclusive offers and manage your orders seamlessly.'}
          </Text>
          {auth.isAuthenticated ? (
            <TouchableOpacity 
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('QuickKartBlack' as never)}
            >
              <Text style={styles.exploreBtnText}>Explore BLACK</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
               style={styles.exploreBtn} 
               onPress={() => navigation.navigate('Login' as never)}
            >
              <Text style={styles.exploreBtnText}>Log In</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.listItem} 
            onPress={() => { /* @ts-ignore */ navigation.navigate('Orders') }}
          >
            <Ionicons name="cube-outline" size={24} color={colors.primary} style={styles.listIcon} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Orders</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => { /* @ts-ignore */ navigation.navigate('Wishlist') }}>
            <Ionicons name="heart-outline" size={24} color={colors.primary} style={styles.listIcon} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Wishlist</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => { /* @ts-ignore */ navigation.navigate('Coupons') }}>
            <Ionicons name="ticket-outline" size={24} color={colors.primary} style={styles.listIcon} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Coupons</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {auth.user?.role !== 'SELLER' && auth.user?.role !== 'ADMIN' && (
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.listItem}
              onPress={() => { /* @ts-ignore */ navigation.navigate('BecomeSeller') }}
            >
              <Ionicons name="storefront-outline" size={24} color={colors.primary} style={styles.listIcon} />
              <View style={styles.listContent}>
                <Text style={styles.listTitle}>Sell on QuickKart</Text>
                <Text style={styles.listSubtitle}>Zero commission fees for 3 months</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}

        {/* Finance Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Finance Options</Text>
          
          <View style={styles.listItem}>
            <MaterialCommunityIcons name="hand-coin-outline" size={24} color={colors.primary} style={styles.listIcon} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>QuickKart Personal Loan</Text>
              <Text style={styles.listSubtitle}>Instant Cash upto ₹10,00,000</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </View>

          <View style={styles.listItem}>
            <Ionicons name="card-outline" size={24} color={colors.primary} style={styles.listIcon} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>QuickKart EMI - Only for you!</Text>
              <Text style={styles.listSubtitle}>Upto ₹750 off | No Cost EMI*</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('QuickKartPlus' as never)}>
            <Ionicons name="sparkles-outline" size={24} color={colors.primary} style={styles.listIcon} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>QuickKart Plus</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('ManageDevices' as never)}>
            <Ionicons name="phone-portrait-outline" size={24} color={colors.primary} style={styles.listIcon} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Manage Devices</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('EditProfile' as never)}>
            <Ionicons name="person-outline" size={24} color={colors.primary} style={styles.listIcon} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('SavedCards' as never)}>
            <Ionicons name="wallet-outline" size={24} color={colors.primary} style={styles.listIcon} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Saved Cards</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('SavedAddresses' as never)}>
            <Ionicons name="location-outline" size={24} color={colors.primary} style={styles.listIcon} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Saved Addresses</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('SelectLanguage' as never)}>
            <Ionicons name="language-outline" size={24} color={colors.primary} style={styles.listIcon} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Select Language</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('NotificationSettings' as never)}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary} style={styles.listIcon} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>{t('notification_settings')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('PrivacyCenter' as never)}>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.primary} style={styles.listIcon} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>{t('privacy_center')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          
          {auth.isAuthenticated && (
             <TouchableOpacity style={styles.listItem} onPress={() => setLogoutModalVisible(true)}>
               <Ionicons name="log-out-outline" size={24} color={colors.error} style={styles.listIcon} />
               <View style={styles.listContent}>
                 <Text style={[styles.listTitle, {color: colors.error}]}>{t('log_out')}</Text>
               </View>
             </TouchableOpacity>
          )}
        </View>

      </ScrollView>

      <ConfirmModal 
        visible={logoutModalVisible}
        title={t('log_out')}
        message={t('confirm_logout_message')}
        confirmText={t('log_out')}
        onCancel={() => setLogoutModalVisible(false)}
        onConfirm={() => {
          setLogoutModalVisible(false);
          dispatch(logout());
          Toast.show({ type: 'info', text1: t('logged_out'), text2: t('logged_out_success_message') });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light greyish background
  },
  container: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: '#F0F5FF', // Very light blue
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: '#E6F0FF',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  coinsText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  headerSubtext: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  exploreBtn: {
    backgroundColor: '#000000',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  exploreBtnText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    marginRight: spacing.sm,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    backgroundColor: colors.surface,
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listIcon: {
    marginRight: spacing.md,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  }
});
