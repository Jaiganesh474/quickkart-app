import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function PrivacyCenterScreen() {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Center</Text>
      </View>
      
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.iconHeader}>
          <Ionicons name="shield-checkmark" size={48} color={colors.primary} />
          <Text style={styles.headerTitle}>Your Privacy Matters</Text>
          <Text style={styles.headerSub}>Please read our terms and policies carefully.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Data Collection</Text>
          <Text style={styles.paragraph}>
            We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested, delivery notes, and other information you choose to provide.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Use of Information</Text>
          <Text style={styles.paragraph}>
            We may use the information we collect about you to: Provide, maintain, and improve our Services, including, for example, to facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support to Users and Sellers, develop safety features, authenticate users, and send product updates and administrative messages.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Sharing of Information</Text>
          <Text style={styles.paragraph}>
            We may share the information we collect about you with vendors, consultants, marketing partners, and other service providers who need access to such information to carry out work on our behalf or to provide you with the services.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.paragraph}>
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. However, no internet or email transmission is ever fully secure or error free.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Your Choices</Text>
          <Text style={styles.paragraph}>
            You may correct your account information at any time by logging into your online or in-app account. If you wish to cancel your account, please email us at support@quickkart.com.
          </Text>
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
  contentContainer: { flex: 1, padding: spacing.lg, backgroundColor: '#f2f4f7' },
  iconHeader: { alignItems: 'center', marginBottom: spacing.xl, marginTop: spacing.md },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginTop: spacing.md },
  headerSub: { fontSize: 14, color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
  section: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: 12, marginBottom: spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: spacing.sm },
  paragraph: { fontSize: 14, color: colors.textMuted, lineHeight: 22 },
});
