import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, Dimensions, useWindowDimensions, RefreshControl, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { useTranslation } from '../hooks/useTranslation';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import LocationPickerModal from '../components/LocationPickerModal';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import ConfirmModal from '../components/ConfirmModal';
import { useGetProductsQuery, useGetActiveBannersQuery, useGetCategoriesQuery } from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SHARED_CATEGORIES } from '../utils/categories';

export default function HomeScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const bannerWidth = windowWidth - (spacing.md * 2);

  const { data: apiProducts, isLoading, error, refetch: refetchProducts } = useGetProductsQuery();
  const { data: apiCategories, refetch: refetchCategories } = useGetCategoriesQuery();
  const { data: apiBanners, refetch: refetchBanners } = useGetActiveBannersQuery();
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      refetchProducts(),
      refetchCategories(),
      refetchBanners()
    ]).finally(() => setRefreshing(false));
  }, [refetchProducts, refetchCategories, refetchBanners]);

  const categories = SHARED_CATEGORIES;

  const [activeCategory, setActiveCategory] = useState('For You');
  const [isLocationModalVisible, setLocationModalVisible] = useState(false);
  const [activeAddress, setActiveAddress] = useState('No 3/772, Kamarajar street, ...');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { recentProducts } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  // @ts-ignore
  useEffect(() => {
    // @ts-ignore
    if (route.params?.showLoginToast) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      // Clear param
      navigation.setParams({ showLoginToast: undefined } as any);
    }
  }, [route.params]);
  
  // Use API products ONLY
  let productsToDisplay = apiProducts || [];
    
  if (activeCategory !== 'For You') {
    productsToDisplay = productsToDisplay.filter((item: any) => {
      if (!item.category) return false;
      if (typeof item.category === 'string') {
        return item.category === activeCategory || item.category.includes(activeCategory);
      }
      return item.category.name === activeCategory || (item.category.name && item.category.name.includes(activeCategory));
    });
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header & Shortcuts */}
        <View style={styles.header}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shortcutsContainer}>
            <View style={[styles.shortcut, { backgroundColor: colors.secondary }]}>
                <Ionicons name="cart" size={16} color={colors.primary} />
                <Text style={styles.shortcutText}>QuickKart</Text>
            </View>
            <View style={styles.shortcut}>
                <Text style={styles.shortcutNumber}>13</Text>
                <Text style={styles.shortcutText}>Minutes</Text>
            </View>
            <View style={styles.shortcut}>
                <Ionicons name="airplane" size={16} color={colors.error} />
                <Text style={styles.shortcutText}>Travel</Text>
            </View>
            <View style={styles.shortcut}>
                <Ionicons name="pricetag" size={16} color={colors.error} />
                <Text style={styles.shortcutText}>Value Deals</Text>
            </View>
          </ScrollView>

          {/* Location & Profile/Coins */}
          <View style={styles.locationContainer}>
            <TouchableOpacity style={styles.locationLeft} onPress={() => setLocationModalVisible(true)}>
              <Ionicons name="home" size={14} color={colors.text} />
              <Text style={styles.locationTitle}>{t('home').toUpperCase()}</Text>
              <Text style={styles.locationText} numberOfLines={1}>{activeAddress}</Text>
              <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
            </TouchableOpacity>
            
            {isAuthenticated ? (
              <View style={{ position: 'relative', zIndex: 100 }}>
                <TouchableOpacity onPress={() => setDropdownVisible(true)} style={styles.profileIconBtn}>
                  <Ionicons name="person-circle" size={32} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.coinsContainer} onPress={() => { /* @ts-ignore */ navigation.navigate('Login'); }}>
                <Ionicons name="flash" size={12} color={colors.warning} />
                <Text style={styles.coinsText}>Login</Text>
              </TouchableOpacity>
            )}
          </View>

          <SearchBar placeholder={t('search_placeholder')} />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesWrapper}>
          {categories.map((cat, index) => {
            const isActive = activeCategory === cat.name;
            return (
              <TouchableOpacity key={index} style={styles.categoryItem} onPress={() => setActiveCategory(cat.name)}>
                <View style={styles.categoryIconPlace}>
                  {typeof cat.icon === 'string' && cat.icon.startsWith('http') ? (
                    <Image source={{ uri: cat.icon }} style={styles.categoryImage} resizeMode="contain" />
                  ) : typeof cat.icon === 'string' ? (
                    <Ionicons name={cat.icon as any} size={24} color={colors.primary} />
                  ) : cat.icon ? (
                    <Image source={cat.icon} style={styles.categoryImage} resizeMode="contain" />
                  ) : (
                    <Ionicons name="pricetag-outline" size={24} color={colors.primary} />
                  )}
                </View>
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {cat.name === 'For You' ? t('suggested_for_you') : cat.name}
                </Text>
                {isActive && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <ScrollView 
          style={{ flex: 1, position: 'relative' }} 
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} progressBackgroundColor={colors.surface} tintColor={colors.primary} />}
        >
          {refreshing && Platform.OS === 'web' && (
            <View style={{
              position: 'absolute',
              top: 50,
              left: '50%',
              marginLeft: -20,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.surface,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5,
              zIndex: 9999
            }}>
              <Ionicons name="refresh" size={24} color={colors.primary} />
            </View>
          )}
          {/* Hero Banner Slider */}
        <View style={styles.bannerContainer}>
          {apiBanners && apiBanners.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              snapToInterval={bannerWidth + spacing.sm}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              style={{ width: '100%' }}
              contentContainerStyle={{ paddingRight: spacing.md }}
            >
              {apiBanners.map((banner: any, index: number) => (
                <View key={index} style={{ width: bannerWidth, height: 150, marginRight: spacing.sm }}>
                  <Image 
                    source={{ uri: banner.imageUrl }} 
                    style={styles.bannerImage} 
                    resizeMode="cover" 
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <Image 
              source={require('../../assets/images/flash_sale_banner.png')} 
              style={styles.bannerImage} 
              resizeMode="cover" 
            />
          )}
        </View>

        {/* Products Section */}
        <View style={[styles.sectionContainer, { paddingHorizontal: 0 }]}>
          {isLoading ? (
            <Text style={{ textAlign: 'center', marginVertical: 20 }}>Loading products...</Text>
          ) : activeCategory === 'For You' ? (
            <View>
              {/* Suggested For You Slider */}
              {recentProducts && recentProducts.length > 0 && (
                <View style={{ marginBottom: 20, paddingLeft: spacing.md }}>
                  <Text style={styles.sectionTitle}>{t('suggested_for_you')}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
                    {recentProducts.map((item: any) => (
                      <View key={`recent-${item.id}`} style={{ marginRight: spacing.md }}>
                        <ProductCard 
                          id={item.id.toString()}
                          title={item.title}
                          category={item.category?.name || item.category || 'General'}
                          imageUrl={item.imageUrl}
                          discountBadge={item.discount}
                          price={item.price}
                          originalPrice={item.originalPrice}
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Sliders for each category */}
              {categories.filter(c => c.name !== 'For You').map(cat => {
                const catProducts = apiProducts?.filter((p: any) => {
                   if (!p.category) return false;
                   if (typeof p.category === 'string') return p.category === cat.name || p.category.includes(cat.name);
                   return p.category.name === cat.name || (p.category.name && p.category.name.includes(cat.name));
                }) || [];
                
                if (catProducts.length === 0) return null;

                return (
                  <View key={cat.name} style={{ marginBottom: 20, paddingLeft: spacing.md }}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: spacing.md}}>
                      <Text style={styles.sectionTitle}>{cat.name}</Text>
                      <TouchableOpacity onPress={() => setActiveCategory(cat.name)}>
                        <Text style={{color: colors.primary, fontWeight: 'bold'}}>See All</Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
                      {catProducts.map((item: any) => (
                        <View key={`cat-${cat.name}-${item.id}`} style={{ marginRight: spacing.md }}>
                           <ProductCard 
                             id={item.id}
                             title={item.title}
                             category={item.category?.name || item.description || ''}
                             imageUrl={item.imageUrl || ''}
                             discountBadge={item.discount}
                             price={item.price}
                             originalPrice={item.originalPrice}
                           />
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                );
              })}
              
              {apiProducts?.length === 0 && (
                <Text style={{ textAlign: 'center', marginVertical: 20, color: colors.textMuted }}>No products available from sellers yet.</Text>
              )}
            </View>
          ) : (
            <View style={{ paddingHorizontal: spacing.md }}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md}}>
                <Text style={styles.sectionTitle}>{activeCategory}</Text>
                <TouchableOpacity onPress={() => setActiveCategory('For You')}>
                  <Text style={{color: colors.textMuted}}>Clear</Text>
                </TouchableOpacity>
              </View>
              {productsToDisplay.length === 0 ? (
                <Text style={{ textAlign: 'center', marginVertical: 20, color: colors.textMuted }}>No products in this category.</Text>
              ) : (
                <View style={styles.productsGrid}>
                  {productsToDisplay.map((item: any) => (
                    <View key={item.id} style={styles.gridItem}>
                      <ProductCard 
                        id={item.id}
                        title={item.title}
                        category={item.category?.name || item.description || ''}
                        imageUrl={item.imageUrl || ''}
                        discountBadge={item.discount}
                        price={item.price}
                        originalPrice={item.originalPrice}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      </View>

      <LocationPickerModal 
        visible={isLocationModalVisible} 
        onClose={() => setLocationModalVisible(false)} 
        onSelectAddress={setActiveAddress} 
      />

      {/* Dropdown Modal overlay */}
      <Modal visible={isDropdownVisible} transparent={true} animationType="fade" onRequestClose={() => setDropdownVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownMenu}>
                <Text style={styles.dropdownHeader}>Hi, {user?.name || 'User'}</Text>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => { setDropdownVisible(false); /* @ts-ignore */ navigation.navigate('Account'); }}>
                  <Ionicons name="person-outline" size={18} color={colors.text} style={{marginRight: 8}}/>
                  <Text style={styles.dropdownItemText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => { setDropdownVisible(false); /* @ts-ignore */ navigation.navigate('Orders'); }}>
                  <Ionicons name="cube-outline" size={18} color={colors.text} style={{marginRight: 8}}/>
                  <Text style={styles.dropdownItemText}>Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => { setDropdownVisible(false); /* @ts-ignore */ navigation.navigate('NotificationSettings'); }}>
                  <Ionicons name="settings-outline" size={18} color={colors.text} style={{marginRight: 8}}/>
                  <Text style={styles.dropdownItemText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => { 
                  setDropdownVisible(false); 
                  setLogoutModalVisible(true);
                }}>
                  <Ionicons name="log-out-outline" size={18} color={colors.error} style={{marginRight: 8}}/>
                  <Text style={[styles.dropdownItemText, {color: colors.error}]}>Logout</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Toast Notification */}
      {showToast && (
        <View style={styles.toastContainer}>
          <Ionicons name="checkmark-circle" size={24} color={colors.surface} />
          <Text style={styles.toastText}>Logged in successfully!</Text>
        </View>
      )}

      <ConfirmModal 
        visible={logoutModalVisible}
        title="Log Out"
        message="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        onCancel={() => setLogoutModalVisible(false)}
        onConfirm={() => {
          setLogoutModalVisible(false);
          dispatch(logout());
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFEBEE', // Peach background from screenshot
  },
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
  },
  shortcutsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  shortcut: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginRight: spacing.sm,
    minWidth: 80,
  },
  shortcutText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
    color: colors.text,
  },
  shortcutNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.error,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
    zIndex: 9999, // Ensure this entire container sits above the SearchBar
    elevation: 9999,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationTitle: {
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  coinsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 4,
  },
  profileIconBtn: {
    marginLeft: spacing.m,
  },
  modalOverlay: {
    flex: 1,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 90,
    right: 20,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  dropdownHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    letterSpacing: 0.2,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999,
  },
  toastText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.s,
  },
  categoriesWrapper: {
    backgroundColor: colors.surface,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
    flexGrow: 0,
    flexShrink: 0,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: spacing.lg,
    width: 60,
  },
  categoryIconPlace: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5', // Light clean background for 3D icons
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs, // Reduced margin
    overflow: 'hidden',
  },
  categoryImage: {
    width: 40,
    height: 40,
  },
  categoryText: {
    fontSize: 11,
    color: colors.text,
    textAlign: 'center',
  },
  categoryTextActive: {
    fontWeight: 'bold',
  },
  activeIndicator: {
    height: 2,
    width: '100%',
    backgroundColor: colors.text,
    marginTop: 2, // Reduced margin
  },
  bannerContainer: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: radius.md,
  },
  sectionContainer: {
    backgroundColor: '#E8F5E9', // Light green background
    padding: spacing.md,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.text,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: spacing.md,
  }
});
