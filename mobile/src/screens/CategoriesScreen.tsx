import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { SHARED_CATEGORIES } from '../utils/categories';
import { useGetProductsQuery } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const SIDEBAR_CATEGORIES = SHARED_CATEGORIES;

const POPULAR_STORES = [
  { title: 'Live now', badge: 'FREEDOM SALE' },
  { title: 'Value 365', badge: 'VALUE 365' },
  { title: 'Celebrate Rakhi', badge: 'RAKHI SPECIALS' },
  { title: 'Flipkart Minutes', badge: 'Get in Mins' },
  { title: 'Buses Launched!', badge: 'BUSES' },
  { title: 'Grocery', badge: 'GROCERY' },
];

export default function CategoriesScreen() {
  const [activeCategory, setActiveCategory] = useState(0);
  const { data: apiProducts, isLoading } = useGetProductsQuery();
  const navigation = useNavigation();

  const activeCategoryName = SIDEBAR_CATEGORIES[activeCategory].name;
  
  // Filter products by the active category
  let categoryProducts = [];
  if (apiProducts) {
    categoryProducts = apiProducts.filter((p: any) => 
       p.category === activeCategoryName || (p.category && p.category.includes && p.category.includes(activeCategoryName)) ||
       (p.category && p.category.name === activeCategoryName)
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Categories</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search" size={24} color={colors.text} style={styles.icon} />
          <Ionicons name="mic-none" size={24} color={colors.text} />
        </View>
      </View>

      <View style={styles.content}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {SIDEBAR_CATEGORIES.map((cat, index) => {
              const isActive = activeCategory === index;
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
                  onPress={() => setActiveCategory(index)}
                >
                  <View style={styles.sidebarIconPlaceholder}>
                     {cat.icon ? (
                       <Image source={cat.icon} style={styles.sidebarImage} resizeMode="contain" />
                     ) : (
                       <Ionicons name="apps-outline" size={20} color={isActive ? colors.primary : colors.textMuted} />
                     )}
                  </View>
                  <Text style={[styles.sidebarText, isActive && styles.sidebarTextActive]}>
                    {cat.name}
                  </Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Right Content */}
        <View style={styles.rightContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Popular Store section can remain as shortcuts or be removed. User wants real products. Let's just show products. */}
            <Text style={styles.sectionTitle}>{activeCategoryName} Products</Text>
            
            {isLoading ? (
              <Text style={{ color: colors.textMuted }}>Loading...</Text>
            ) : categoryProducts.length === 0 ? (
              <Text style={{ color: colors.textMuted }}>No products found in this category.</Text>
            ) : (
              <View style={styles.grid}>
                {categoryProducts.map((product: any) => (
                  <TouchableOpacity 
                    key={product.id} 
                    style={styles.gridItem}
                    onPress={() => navigation.navigate('ProductDetails' as never, { id: product.id } as never)}
                  >
                    <View style={styles.launchCard}>
                      {product.imageUrl ? (
                        <Image source={{ uri: product.imageUrl }} style={{ width: '100%', height: '100%', resizeMode: 'cover', position: 'absolute' }} />
                      ) : null}
                      <View style={styles.tagBuyNow}><Text style={styles.tagText}>BUY NOW</Text></View>
                    </View>
                    <Text style={styles.storeTitle} numberOfLines={2}>{product.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 85,
    backgroundColor: '#F5F5F5',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  sidebarItem: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    position: 'relative',
  },
  sidebarItemActive: {
    backgroundColor: colors.surface,
  },
  sidebarIconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  sidebarImage: {
    width: 40,
    height: 40,
  },
  sidebarText: {
    fontSize: 10,
    textAlign: 'center',
    color: colors.textMuted,
  },
  sidebarTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: spacing.md,
    bottom: spacing.md,
    width: 4,
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  rightContent: {
    flex: 1,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  gridItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  storeCard: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    padding: 4,
  },
  storeBadge: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
  },
  storeTitle: {
    fontSize: 10,
    textAlign: 'center',
    color: colors.text,
  },
  launchCard: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: '#E0F7FA', // Light blue background
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  tagBuyNow: {
    backgroundColor: '#00897B',
    paddingHorizontal: 4,
    paddingVertical: 2,
    width: '100%',
  },
  tagText: {
    color: colors.surface,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
