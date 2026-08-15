import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

export default function NotificationSettingsScreen() {
  const navigation = useNavigation();
  
  const [settings, setSettings] = useState({
    pushOrders: true,
    pushOffers: false,
    emailOrders: true,
    emailPromos: false,
    smsAlerts: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSwitch = (title: string, description: string, value: boolean, onValueChange: () => void) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDesc}>{description}</Text>
      </View>
      <Switch 
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.surface}
        value={value} 
        onValueChange={onValueChange} 
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Notification Settings</Text>
      </View>
      
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>PUSH NOTIFICATIONS</Text>
        <View style={styles.card}>
          {renderSwitch('Order Updates', 'Get instant alerts about your order status.', settings.pushOrders, () => toggleSetting('pushOrders'))}
          <View style={styles.divider} />
          {renderSwitch('Offers & Promos', 'Receive deals and personalized offers.', settings.pushOffers, () => toggleSetting('pushOffers'))}
        </View>

        <Text style={styles.sectionHeader}>EMAIL NOTIFICATIONS</Text>
        <View style={styles.card}>
          {renderSwitch('Order Summaries', 'Get invoices and receipts delivered to your inbox.', settings.emailOrders, () => toggleSetting('emailOrders'))}
          <View style={styles.divider} />
          {renderSwitch('News & Promos', 'Weekly newsletter and special email promotions.', settings.emailPromos, () => toggleSetting('emailPromos'))}
        </View>

        <Text style={styles.sectionHeader}>SMS ALERTS</Text>
        <View style={styles.card}>
          {renderSwitch('Delivery SMS', 'Get a text when the delivery agent is arriving.', settings.smsAlerts, () => toggleSetting('smsAlerts'))}
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
  backBtn: { marginRight: spacing.md },
  title: { fontSize: 18, fontWeight: '600', color: colors.text },
  contentContainer: { flex: 1, padding: spacing.md, backgroundColor: '#f2f4f7' },
  sectionHeader: { fontSize: 13, fontWeight: 'bold', color: colors.textMuted, marginTop: spacing.lg, marginBottom: spacing.sm, marginLeft: spacing.xs, letterSpacing: 0.5 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.lg },
  settingInfo: { flex: 1, paddingRight: spacing.md },
  settingTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  settingDesc: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: spacing.lg },
});
