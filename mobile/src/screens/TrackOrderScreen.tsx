import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGetCustomerOrdersQuery } from '../services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useMemo } from 'react';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

export default function TrackOrderScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // @ts-ignore
  const { order: initialOrder } = route.params || {};

  const user = useSelector((state: RootState) => state.auth.user);
  const { data: orders, refetch, isFetching } = useGetCustomerOrdersQuery();

  const order = useMemo(() => {
    if (orders && initialOrder) {
      return orders.find((o: any) => o.id === initialOrder.id) || initialOrder;
    }
    return initialOrder;
  }, [orders, initialOrder]);

  useEffect(() => {
    if (!user?.id) return;
    
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-live'),
      onConnect: () => {
        client.subscribe(`/topic/orders/${user.id}`, () => {
          refetch();
        });
      },
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, [user]);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Track Order</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text>No order information available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const firstOrderItem = order.items && order.items.length > 0 ? order.items[0] : null;
  const dbStatus = firstOrderItem ? (firstOrderItem.status || 'PENDING') : (order.status || 'PENDING');
  let currentIndex = 0;
  if (dbStatus.toUpperCase() === 'PROCESSING') currentIndex = 1;
  else if (dbStatus.toUpperCase() === 'SHIPPED') currentIndex = 2;
  else if (dbStatus.toUpperCase() === 'OUT FOR DELIVERY') currentIndex = 3;
  else if (dbStatus.toUpperCase() === 'DELIVERED') currentIndex = 4;

  // Format date helper
  const formatDate = (dateString: string | undefined, hourOffset = 0, dateOffset = 0, isCompleted: boolean) => {
    if (!isCompleted) return 'Pending';
    if (!dateString) return 'Pending';
    
    const date = new Date(dateString);
    date.setHours(date.getHours() + hourOffset);
    date.setDate(date.getDate() + dateOffset);
    
    // If the step is completed but the mock calculated date is in the future, cap it to current time.
    const now = new Date();
    const finalDate = date > now ? now : date;
    
    return finalDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const createdAt = order.createdAt;

  const statuses = [
    { title: 'Order Placed', subtitle: 'We have received your order', date: formatDate(createdAt, 0, 0, 0 <= currentIndex) },
    { title: 'Processing', subtitle: 'Seller is preparing your order', date: formatDate(createdAt, 2, 0, 1 <= currentIndex) },
    { title: 'Shipped', subtitle: 'Item has been picked up by courier', date: formatDate(createdAt, 0, 1, 2 <= currentIndex) },
    { title: 'Out for Delivery', subtitle: 'Arriving soon', date: formatDate(createdAt, 0, 2, 3 <= currentIndex) },
    { title: 'Delivered', subtitle: 'Item delivered successfully', date: formatDate(createdAt, 4, 2, 4 <= currentIndex) }
  ];

  const firstProduct = firstOrderItem ? firstOrderItem.product : null;

  const handleDownloadInvoice = () => {
    if (Platform.OS === 'web') {
      const invoiceHtml = `
        <html>
          <head>
            <title>Invoice - Order #${order.id}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #333; }
              .header { text-align: center; margin-bottom: 40px; }
              .invoice-title { font-size: 24px; font-weight: bold; }
              .details { margin-bottom: 30px; }
              .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
              .total { text-align: right; font-size: 18px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="invoice-title">QuickKart Invoice</div>
              <div>Order #${order.id}</div>
            </div>
            <div class="details">
              <strong>Order Date:</strong> ${formatDate(createdAt)}<br>
              <strong>Status:</strong> ${dbStatus}<br>
              <strong>Payment ID:</strong> ${order.paymentId || 'N/A'}
            </div>
            <table class="table">
              <tr>
                <th>Product</th>
                <th>Seller</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
              ${order.items.map((item: any) => `
                <tr>
                  <td>${item.product.title}</td>
                  <td>${item.seller ? item.seller.name || item.seller.email : 'QuickKart Seller'}</td>
                  <td>${item.quantity}</td>
                  <td>Rs ${item.price}</td>
                </tr>
              `).join('')}
            </table>
            <div class="total">Total Amount: Rs ${order.totalAmount}</div>
          </body>
        </html>
      `;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(invoiceHtml);
        printWindow.document.close();
        // Give it a moment to render before printing
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    } else {
      // In a real native app, we would use expo-print here
      alert('Invoice download is available on the web version.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Track Order</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} colors={[colors.primary]} tintColor={colors.primary} />}
      >
        
        {/* Order Brief */}
        <View style={styles.card}>
          <View style={styles.orderIdRow}>
            <Text style={styles.orderIdText}>Order ID: <Text style={{fontWeight: 'normal'}}>{order.id}</Text></Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{dbStatus}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          {firstProduct && (
            <View style={styles.productBrief}>
              <View style={{flex: 1}}>
                <Text style={styles.productTitle} numberOfLines={1}>{firstProduct.title}</Text>
                {order.items.length > 1 && (
                  <Text style={styles.extraItems}>+ {order.items.length - 1} more item(s)</Text>
                )}
                <Text style={styles.productPrice}>Total: ₹{order.totalAmount}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Courier Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <View style={styles.courierRow}>
            <View style={styles.courierIconBox}>
              <Ionicons name="cube" size={24} color={colors.primary} />
            </View>
            <View style={styles.courierInfo}>
              <Text style={styles.courierName}>QuickKart Express Logistics</Text>
              <Text style={styles.trackingId}>Tracking ID: QK{order.id}883726</Text>
            </View>
          </View>
        </View>

        {/* Vertical Timeline */}
        <View style={[styles.card, { paddingBottom: spacing.xl }]}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={styles.timelineContainer}>
            {statuses.map((step, index) => {
              const isCompleted = index <= currentIndex;
              const isLast = index === statuses.length - 1;
              const isCurrent = index === currentIndex;
              
              return (
                <View key={index} style={styles.timelineRow}>
                  <View style={styles.timelineLeft}>
                    <View style={[
                      styles.timelineDot,
                      isCompleted ? styles.timelineDotCompleted : null,
                      isCurrent ? styles.timelineDotCurrent : null
                    ]}>
                      {isCompleted && <Ionicons name="checkmark" size={12} color={colors.surface} />}
                    </View>
                    {!isLast && (
                      <View style={[
                        styles.timelineLine,
                        isCompleted && index < currentIndex ? styles.timelineLineCompleted : null
                      ]} />
                    )}
                  </View>
                  <View style={styles.timelineRight}>
                    <Text style={[styles.timelineStepTitle, isCompleted ? styles.timelineStepTitleCompleted : null]}>
                      {step.title}
                    </Text>
                    <Text style={styles.timelineStepSubtitle}>{step.subtitle}</Text>
                    <Text style={styles.timelineStepDate}>{step.date}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Download Invoice Button */}
        <TouchableOpacity style={styles.invoiceBtn} onPress={handleDownloadInvoice}>
          <Ionicons name="document-text-outline" size={20} color={colors.primary} />
          <Text style={styles.invoiceBtnText}>Download Invoice</Text>
        </TouchableOpacity>

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
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  statusBadgeText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  productBrief: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  extraItems: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  courierRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courierIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  courierInfo: {
    flex: 1,
  },
  courierName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  trackingId: {
    fontSize: 13,
    color: colors.textMuted,
  },
  timelineContainer: {
    marginTop: spacing.sm,
    paddingLeft: spacing.xs,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 80,
  },
  timelineLeft: {
    width: 40,
    alignItems: 'center',
  },
  timelineRight: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  timelineDotCompleted: {
    backgroundColor: colors.success,
  },
  timelineDotCurrent: {
    borderWidth: 3,
    borderColor: '#A5D6A7',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: -4,
    marginBottom: -4,
    zIndex: 1,
  },
  timelineLineCompleted: {
    backgroundColor: colors.success,
  },
  timelineStepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textMuted,
    marginBottom: 4,
  },
  timelineStepTitleCompleted: {
    color: colors.text,
  },
  timelineStepSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 4,
  },
  timelineStepDate: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  invoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: '#BBDEFB'
  },
  invoiceBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  }
});
