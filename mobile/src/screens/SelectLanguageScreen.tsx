import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setLanguage } from '../store/slices/settingsSlice';
import { useTranslation } from '../hooks/useTranslation';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

const LANGUAGES = [
  { id: 'en', name: 'English (US)', localName: 'English' },
  { id: 'hi', name: 'Hindi', localName: 'हिंदी' },
  { id: 'es', name: 'Spanish', localName: 'Español' },
  { id: 'fr', name: 'French', localName: 'Français' },
  { id: 'de', name: 'German', localName: 'Deutsch' },
  { id: 'zh', name: 'Chinese', localName: '中文' },
];

export default function SelectLanguageScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t, currentLanguage } = useTranslation();
  
  const handleLanguageChange = (id: string) => {
    dispatch(setLanguage(id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('select_language')}</Text>
      </View>
      
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>{t('select_language').toUpperCase()}</Text>
        <View style={styles.card}>
          {LANGUAGES.map((lang, index) => (
            <React.Fragment key={lang.id}>
              <TouchableOpacity 
                style={styles.languageRow} 
                onPress={() => handleLanguageChange(lang.id)}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{lang.name}</Text>
                  <Text style={styles.languageLocal}>{lang.localName}</Text>
                </View>
                <View style={[styles.radioCircle, currentLanguage === lang.id && styles.radioActive]}>
                  {currentLanguage === lang.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
              {index < LANGUAGES.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
        
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>Changing the language will apply to menus, notifications, and product details where available.</Text>
        </View>
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
  languageRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.lg },
  languageInfo: { flex: 1 },
  languageName: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  languageLocal: { fontSize: 13, color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: spacing.lg },
  radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  infoBox: { flexDirection: 'row', backgroundColor: 'rgba(255, 144, 0, 0.1)', padding: spacing.md, borderRadius: radius.md, marginTop: spacing.xl, alignItems: 'flex-start' },
  infoText: { flex: 1, marginLeft: spacing.sm, fontSize: 13, color: colors.primary, lineHeight: 18 },
});
