import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, TextInput, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { RootState } from '../store';
import { clearCart } from '../store/slices/cartSlice';
import { useConfirmOrderMutation, useGetAddressesQuery } from '../services/api';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import Button from '../components/Button';
import LocationPickerModal from '../components/LocationPickerModal';

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  // @ts-ignore
  const { buyNowItem } = route.params || {};
  const reduxCartItems = useSelector((state: RootState) => state.cart.items);
  const cartItems = buyNowItem ? [buyNowItem] : reduxCartItems;

  const [confirmOrder] = useConfirmOrderMutation();
  const { data: savedAddresses, isLoading: isLoadingAddresses } = useGetAddressesQuery();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [isAddressModalVisible, setAddressModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    if (savedAddresses && savedAddresses.length > 0 && !selectedAddress) {
      setSelectedAddress(savedAddresses[0]);
    }
  }, [savedAddresses]);

  // Calculate totals
  const totalAmount = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = () => {
    if (!couponCode) return;
    
    const code = couponCode.toUpperCase().trim();
    if (code === 'SAVE10') {
      const discount = totalAmount * 0.10;
      setDiscountAmount(discount);
      setAppliedCoupon('SAVE10 (10% OFF)');
      Toast.show({ type: 'success', text1: 'Coupon Applied!' });
    } else if (code === 'FLAT50') {
      setDiscountAmount(50);
      setAppliedCoupon('FLAT50 (₹50 OFF)');
      Toast.show({ type: 'success', text1: 'Coupon Applied!' });
    } else {
      Toast.show({ type: 'error', text1: 'Invalid Coupon', text2: 'Please check the coupon code and try again.' });
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountAmount(0);
    setAppliedCoupon(null);
  };

  const deliveryFee = totalAmount >= 500 ? 0 : 40;
  const promiseProtectFee = totalAmount >= 50000 ? 99 : 0;
  const handlingFee = paymentMethod === 'cod' ? 5 : 0;
  
  // Prevent negative payable amount just in case
  const calculatedPayable = totalAmount + deliveryFee + promiseProtectFee + handlingFee - discountAmount;
  const totalPayable = Math.max(0, calculatedPayable);

  const handleCheckout = () => {
    if (!selectedAddress) {
      Toast.show({ type: 'error', text1: 'Address Required', text2: 'Please select a delivery address' });
      return;
    }
    
    if (paymentMethod === 'cod') {
      handlePaymentSuccess('cod_' + Date.now());
    } else {
      handleRazorpayPayment();
    }
  };

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    
    try {
      // 1. Create order on backend (dummy logic for actual payment gateway)
      const response = await fetch('http://localhost:8080/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPayable })
      });
      
      const order = await response.json();
      
      if (Platform.OS === 'web') {
        const RAZORPAY_KEY = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key_id';
        
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        
        script.onload = () => {
          const options = {
            key: RAZORPAY_KEY,
            amount: order.amount || totalPayable * 100,
            currency: 'INR',
            name: 'QuickKart',
            description: 'Order Checkout',
            order_id: order.id && !order.id.startsWith('order_mock') ? order.id : undefined,
            handler: function (response: any) {
              handlePaymentSuccess(response.razorpay_payment_id);
            },
            prefill: {
              name: 'John Doe',
              email: 'john@example.com',
              contact: '9999999999'
            },
            theme: { color: colors.primary },
            modal: {
              ondismiss: function() {
                Toast.show({ type: 'info', text1: 'Payment Cancelled' });
                setIsProcessing(false);
              }
            }
          };
          
          // @ts-ignore
          const rzp1 = new window.Razorpay(options);
          rzp1.on('payment.failed', function (response: any){
            Toast.show({ type: 'error', text1: 'Payment Failed', text2: response.error.description });
            setIsProcessing(false);
          });
          rzp1.open();
        };
        document.body.appendChild(script);
      } else {
        setTimeout(() => handlePaymentSuccess('sim_pay_' + Date.now()), 2000);
      }
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to initiate payment.' });
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    setIsProcessing(true);
    try {
      await confirmOrder({
        paymentId,
        amount: totalPayable,
        addressId: selectedAddress?.id,
        items: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity
        }))
      }).unwrap();

      if (!buyNowItem) {
        dispatch(clearCart());
      }
      
      Toast.show({
        type: 'success',
        text1: 'Order Confirmed!',
        text2: paymentMethod === 'cod' ? 'Your order has been placed successfully.' : 'Payment Successful! Order Confirmed.'
      });
      
      // @ts-ignore
      navigation.navigate('Orders');
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to confirm order.' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Checkout</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text>Your cart is empty.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Secure Checkout</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Delivery Address */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={() => setAddressModalVisible(true)}>
              <Text style={styles.linkText}>Change</Text>
            </TouchableOpacity>
          </View>
          {selectedAddress ? (
            <View style={styles.addressDisplay}>
              <View style={styles.addressTypeBadge}>
                <Text style={styles.addressTypeText}>{selectedAddress.type || 'Other'}</Text>
              </View>
              <Text style={styles.addressName}>{selectedAddress.name || 'Saved Address'}</Text>
              <Text style={styles.addressText}>{selectedAddress.street || selectedAddress.addressLine || selectedAddress.address}{selectedAddress.city ? `, ${selectedAddress.city}` : ''}</Text>
              {(selectedAddress.state || selectedAddress.zipCode) ? <Text style={styles.addressText}>{selectedAddress.state || ''} {selectedAddress.zipCode ? `- ${selectedAddress.zipCode}` : ''}</Text> : null}
              {selectedAddress.phone ? <Text style={styles.addressPhone}>Phone: {selectedAddress.phone}</Text> : null}
            </View>
          ) : (
            <TouchableOpacity style={styles.selectAddressBtn} onPress={() => setAddressModalVisible(true)}>
              <Text style={styles.selectAddressBtnText}>Select a Delivery Address</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Coupons Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Coupons & Offers</Text>
          {appliedCoupon ? (
            <View style={styles.appliedCouponContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="pricetag" size={20} color={colors.success} style={{marginRight: 8}} />
                <Text style={styles.appliedCouponText}>Applied: {appliedCoupon}</Text>
              </View>
              <TouchableOpacity onPress={removeCoupon}>
                <Ionicons name="close-circle" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.couponInputContainer}>
              <TextInput 
                style={styles.couponInput}
                placeholder="Enter Coupon Code (e.g. SAVE10)"
                value={couponCode}
                onChangeText={setCouponCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.applyBtn} onPress={applyCoupon}>
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Items</Text>
            <Text style={styles.summaryValue}>{totalItems}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={[styles.summaryValue, deliveryFee === 0 && { color: colors.success }]}>
              {deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}
            </Text>
          </View>
          {promiseProtectFee > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Promise Protect Fee</Text>
              <Text style={styles.summaryValue}>₹{promiseProtectFee.toFixed(2)}</Text>
            </View>
          )}
          {handlingFee > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>COD Handling Fee</Text>
              <Text style={styles.summaryValue}>₹{handlingFee.toFixed(2)}</Text>
            </View>
          )}
          {discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, {color: colors.success}]}>Coupon Discount</Text>
              <Text style={[styles.summaryValue, {color: colors.success}]}>-₹{discountAmount.toFixed(2)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{totalPayable.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'razorpay' && styles.paymentOptionSelected]} 
            onPress={() => setPaymentMethod('razorpay')}
          >
            <Ionicons name="card" size={24} color={paymentMethod === 'razorpay' ? colors.primary : colors.textMuted} />
            <Text style={styles.paymentOptionText}>Razorpay (Cards, UPI, NetBanking)</Text>
            <Ionicons name={paymentMethod === 'razorpay' ? "radio-button-on" : "radio-button-off"} size={24} color={paymentMethod === 'razorpay' ? colors.primary : colors.border} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'cod' && styles.paymentOptionSelected, {marginTop: spacing.sm}]} 
            onPress={() => setPaymentMethod('cod')}
          >
            <Ionicons name="cash" size={24} color={paymentMethod === 'cod' ? colors.primary : colors.textMuted} />
            <View style={{flex: 1, marginLeft: spacing.md}}>
              <Text style={[styles.paymentOptionText, {marginLeft: 0}]}>Cash on Delivery</Text>
              <Text style={{fontSize: 12, color: colors.textMuted}}>Includes ₹5 handling fee</Text>
            </View>
            <Ionicons name={paymentMethod === 'cod' ? "radio-button-on" : "radio-button-off"} size={24} color={paymentMethod === 'cod' ? colors.primary : colors.border} />
          </TouchableOpacity>
        </View>
        
        <View style={{height: 40}} />
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title={isProcessing ? "Processing..." : (paymentMethod === 'cod' ? "Place Order" : `Pay ₹${totalPayable.toFixed(2)}`)} 
          onPress={handleCheckout} 
          loading={isProcessing}
        />
      </View>

      {/* Address Selection Modal using Live LocationPicker */}
      <LocationPickerModal 
        visible={isAddressModalVisible} 
        onClose={() => setAddressModalVisible(false)} 
        onSelectAddress={(addrStr) => { /* Only need full address obj here */ }} 
        onSelectFullAddress={(addr) => setSelectedAddress(addr)}
      />

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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  linkText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  addressDisplay: {
    padding: spacing.sm,
    backgroundColor: '#F9F9F9',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addressTypeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
  },
  addressTypeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  addressName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  addressPhone: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
    marginTop: 4,
  },
  selectAddressBtn: {
    padding: spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  selectAddressBtnText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  couponInputContainer: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,
    marginRight: spacing.sm,
    outlineStyle: 'none',
  },
  applyBtn: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    height: 44,
  },
  applyBtnText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  appliedCouponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E9',
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.success,
  },
  appliedCouponText: {
    color: colors.success,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    marginTop: spacing.sm,
  },
  paymentOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F0F9FF',
  },
  paymentOptionText: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalOverlay: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
