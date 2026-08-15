import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Image, Alert, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useGetSellerProductsQuery, useDeleteSellerProductMutation, useGetSellerAnalyticsQuery, useGetSellerOrdersQuery, useUpdateSellerOrderStatusMutation } from '../services/api';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

export default function SellerDashboardScreen() {
  const navigation = useNavigation();
  const { data: products, isLoading: isLoadingProducts, refetch } = useGetSellerProductsQuery();
  const { data: analytics, isLoading: isLoadingAnalytics } = useGetSellerAnalyticsQuery();
  const { data: orders, isLoading: isLoadingOrders, refetch: refetchOrders } = useGetSellerOrdersQuery();
  const [deleteProduct] = useDeleteSellerProductMutation();
  const [updateOrderStatus] = useUpdateSellerOrderStatusMutation();
  const [activeTab, setActiveTab] = React.useState<'inventory'|'orders'>('inventory');

  const handleDelete = (id: number) => {
    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to delete this product?")) {
        deleteProduct(id).unwrap().then(() => refetch());
      }
    } else {
      Alert.alert(
        "Delete Product",
        "Are you sure you want to delete this product?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: () => deleteProduct(id).unwrap().then(() => refetch()) }
        ]
      );
    }
  };

  // Format currency
  const formatCurrency = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val}`;
  };

  const renderProductItem = ({ item }: { item: any }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => { /* @ts-ignore */ navigation.navigate('AddEditProduct', { product: item }) }}
          >
            <Ionicons name="pencil" size={18} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => handleDelete(item.id)}
          >
            <Ionicons name="trash" size={18} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Seller Dashboard</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sales Analytics Section */}
        <View style={styles.analyticsContainer}>
          <Text style={styles.sectionTitle}>Sales Analytics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="trending-up" size={24} color={colors.primary} />
              <Text style={styles.statValue}>
                {analytics?.totalSales ? formatCurrency(analytics.totalSales) : '₹0'}
              </Text>
              <Text style={styles.statLabel}>Total Sales</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="cube" size={24} color={colors.secondary} />
              <Text style={styles.statValue}>{analytics?.totalOrders || 0}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="people" size={24} color={colors.warning} />
              <Text style={styles.statValue}>{analytics?.totalCustomers || 0}</Text>
              <Text style={styles.statLabel}>Customers</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'inventory' && styles.activeTabBtn]} 
            onPress={() => setActiveTab('inventory')}
          >
            <Text style={[styles.tabText, activeTab === 'inventory' && styles.activeTabText]}>My Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'orders' && styles.activeTabBtn]} 
            onPress={() => setActiveTab('orders')}
          >
            <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>Customer Orders</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'inventory' ? (
          <>
            <View style={styles.listHeader}>
              <TouchableOpacity 
                style={styles.addBtn}
                onPress={() => { /* @ts-ignore */ navigation.navigate('AddEditProduct') }}
              >
                <Ionicons name="add" size={20} color={colors.surface} />
                <Text style={styles.addBtnText}>Add Product</Text>
              </TouchableOpacity>
            </View>
            {isLoadingProducts ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
            ) : products && products.length > 0 ? (
              <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderProductItem}
                contentContainerStyle={{ paddingBottom: spacing.xl }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="cube-outline" size={64} color={colors.border} />
                <Text style={styles.emptyText}>No products yet.</Text>
                <Text style={styles.emptySubtext}>Start adding products to your store!</Text>
              </View>
            )}
          </>
        ) : (
          <>
            {isLoadingOrders ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
            ) : orders && orders.length > 0 ? (
              <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.productCard}>
                     <Image source={{ uri: item.product.imageUrl || 'https://via.placeholder.com/150' }} style={styles.productImage} />
                     <View style={styles.productInfo}>
                       <Text style={styles.productTitle} numberOfLines={2}>Order #{item.id} - {item.product.title}</Text>
                       <Text style={styles.productPrice}>Qty: {item.quantity}</Text>
                       <Text style={styles.statLabel}>Customer: {item.order.customer.name}</Text>
                       <Text style={styles.statLabel}>Status: {item.status}</Text>
                       <View style={styles.actions}>
                          {['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                            <TouchableOpacity 
                              key={st}
                              style={[styles.actionBtn, item.status === st && {backgroundColor: colors.primary}]}
                              onPress={() => updateOrderStatus({ id: item.id, status: st })}
                            >
                              <Text style={[styles.actionText, item.status === st && {color: 'white'}]}>{st}</Text>
                            </TouchableOpacity>
                          ))}
                       </View>
                     </View>
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: spacing.xl }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="cube-outline" size={64} color={colors.border} />
                <Text style={styles.emptyText}>No orders yet.</Text>
                <Text style={styles.emptySubtext}>You will see customer orders here.</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: spacing.md, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border,
    backgroundColor: colors.surface
  },
  backBtn: { marginRight: spacing.md },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif' },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  analyticsContainer: {
    marginBottom: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  statBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    width: '31%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  activeTabBtn: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
  },
  activeTabText: {
    color: colors.primary,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.round,
  },
  addBtnText: {
    color: colors.surface,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: radius.sm,
    backgroundColor: '#F5F5F5',
  },
  productInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  productTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
  },
  actionText: {
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: spacing.sm,
  }
});
