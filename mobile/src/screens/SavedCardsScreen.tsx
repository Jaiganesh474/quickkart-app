import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function SavedCardsScreen() {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Saved Cards</Text>
      </View>
      <View style={styles.emptyContainer}>
        <Ionicons name="card-outline" size={64} color={colors.border} />
        <Text style={styles.emptyTitle}>No Saved Cards</Text>
        <Text style={styles.emptySub}>Save your credit/debit cards for faster checkout.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { marginRight: spacing.m },
  title: { fontSize: 18, fontWeight: '600', color: colors.text },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.l },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginTop: spacing.m },
  emptySub: { fontSize: 14, color: colors.textMuted, marginTop: spacing.s, textAlign: 'center' }
});
