import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  imageUrl?: string;
  discountBadge?: string;
  price?: number;
  originalPrice?: number;
}

export default function ProductCard({ id, title, category, imageUrl, discountBadge, price, originalPrice }: ProductCardProps) {
  const navigation = useNavigation<any>();
  
  return (
    <TouchableOpacity 
       style={styles.card} 
       activeOpacity={0.8}
       onPress={() => navigation.navigate('ProductDetails', { id })}
    >
      <View style={styles.imageContainer}>
        {discountBadge ? (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{discountBadge}</Text>
          </View>
        ) : null}
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.productImage} />
        ) : (
          <View style={styles.placeholderImage}>
              <View style={{flex: 1, backgroundColor: colors.border, opacity: 0.5}} />
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {price && (
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{price}</Text>
            {originalPrice && (
              <Text style={styles.originalPrice}>₹{originalPrice}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageContainer: {
    height: 120,
    backgroundColor: '#fff',
    position: 'relative',
    padding: spacing.md,
  },
  productImage: {
      flex: 1,
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
  },
  placeholderImage: {
      flex: 1,
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: colors.warning,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderBottomRightRadius: radius.sm,
    zIndex: 1,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: spacing.sm,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  originalPrice: {
    fontSize: 10,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
});
