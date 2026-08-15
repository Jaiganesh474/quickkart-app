import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useGetCustomerOrdersQuery } from '../services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useState } from 'react';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

export default function OrdersScreen() {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: orders, isLoading, refetch, isFetching } = useGetCustomerOrdersQuery();

  useEffect(() => {
    if (!user?.id) return;
    
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-live'),
      onConnect: () => {
        client.subscribe(`/topic/orders/${user.id}`, () => {
          refetch();
        });
      },
      debug: (str) => console.log(str),
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, [user]);

  const renderOrderItem = ({ item }: { item: any }) => {
    // For simplicity, showing the first product in the order in the list view
    const firstProduct = item.items && item.items.length > 0 ? item.items[0].product : null;
    const title = firstProduct ? firstProduct.title : `Order #${item.id}`;
    
    const firstOrderItem = item.items && item.items.length > 0 ? item.items[0] : null;
    const currentStatus = firstOrderItem ? (firstOrderItem.status || 'PENDING') : (item.status || 'PENDING');
    
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    // Map current status to timeline, default to 'Pending' if unknown
    let currentIndex = statuses.findIndex(s => s.toUpperCase() === currentStatus.toUpperCase());
    if (currentIndex === -1) currentIndex = 0;

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order ID: {item.id}</Text>
          <Text style={styles.orderDate}>Today</Text>
        </View>
        <View style={styles.orderDetails}>
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{title}</Text>
            {item.items && item.items.length > 1 && (
              <Text style={styles.extraItems}>+ {item.items.length - 1} more item(s)</Text>
            )}
            <Text style={styles.productPrice}>Total: ₹{item.totalAmount}</Text>
          </View>
        </View>

        {/* Timeline UI */}
        <View style={styles.timelineWrapper}>
          {statuses.map((status, index) => {
            const isActive = index <= currentIndex;
            const isLast = index === statuses.length - 1;
            
            return (
              <View key={status} style={styles.timelineStep}>
                <View style={styles.timelineIconWrapper}>
                  <View style={[styles.timelineDot, isActive ? styles.timelineDotActive : null]} />
                  {!isLast && (
                    <View style={[styles.timelineLine, isActive && index < currentIndex ? styles.timelineLineActive : null]} />
                  )}
                </View>
                <Text style={[styles.timelineText, isActive ? styles.timelineTextActive : null]}>{status}</Text>
              </View>
            );
          })}
        </View>
        <TouchableOpacity 
          style={styles.trackBtn} 
          onPress={() => {
            /* @ts-ignore */
            navigation.navigate('TrackOrder', { order: item });
          }}
        >
          <Text style={styles.trackBtnText}>Track Order</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>My Orders</Text>
      </View>
      
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : !orders || orders.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text>No orders found.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} colors={[colors.primary]} tintColor={colors.primary} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: spacing.md },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: spacing.md, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border,
    backgroundColor: colors.surface
  },
  backBtn: { marginRight: spacing.md },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderDetails: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  extraItems: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  trackBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  trackBtnText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 14,
  },
  orderDate: {
    fontSize: 13,
    color: colors.textMuted,
  },
  timelineWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  timelineStep: {
    alignItems: 'center',
    flex: 1,
  },
  timelineIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: spacing.xs,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    zIndex: 2,
  },
  timelineDotActive: {
    backgroundColor: colors.success,
  },
  timelineLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: colors.border,
    width: '100%',
    left: '50%',
    zIndex: 1,
  },
  timelineLineActive: {
    backgroundColor: colors.success,
  },
  timelineText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
  timelineTextActive: {
    color: colors.text,
    fontWeight: 'bold',
  }
});
