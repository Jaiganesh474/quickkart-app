import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'outline' | 'dashed';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({ title, onPress, type = 'primary', icon, loading = false, style, textStyle }: ButtonProps) {
  const isPrimary = type === 'primary';
  const isOutline = type === 'outline';
  const isDashed = type === 'dashed';

  return (
    <TouchableOpacity 
      style={[
        styles.button,
        isPrimary && styles.primaryBtn,
        isOutline && styles.outlineBtn,
        isDashed && styles.dashedBtn,
        style
      ]} 
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.surface : colors.primary} />
      ) : (
        <>
          {icon && (
            <Ionicons 
              name={icon} 
              size={18} 
              color={isPrimary ? colors.surface : colors.primary} 
              style={styles.icon}
            />
          )}
          <Text 
            style={[
              styles.text,
              isPrimary ? styles.primaryText : styles.outlineText,
              textStyle
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.l,
    borderRadius: radius.l,
    width: '100%',
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    // Modern soft shadow
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dashedBtn: {
    backgroundColor: 'rgba(40, 116, 240, 0.05)',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  primaryText: {
    color: colors.surface,
  },
  outlineText: {
    color: colors.primary,
  },
  icon: {
    marginRight: 8,
  }
});
