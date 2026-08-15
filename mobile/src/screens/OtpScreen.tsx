import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import Button from '../components/Button';
import { useVerifyOtpMutation, useSendOtpMutation, useRegisterMutation, useResetPasswordMutation } from '../services/api';
import Toast from 'react-native-toast-message';

export default function OtpScreen() {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [timer, setTimer] = useState(30);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  // @ts-ignore
  const { email, name, password, isRegistering, isForgotPassword } = route.params || {};

  const [verifyOtpApi, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [registerApi, { isLoading: isRegisteringLoading }] = useRegisterMutation();
  const [resetPasswordApi, { isLoading: isResettingPassword }] = useResetPasswordMutation();
  const [sendOtpApi, { isLoading: isSending }] = useSendOtpMutation();

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    if (isForgotPassword && (!newPassword || newPassword.length < 6)) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Password must be at least 6 characters' });
      return;
    }
    if (otp.length === 6) {
      try {
        let response;
        if (isForgotPassword) {
          response = await resetPasswordApi({ email, otp, newPassword }).unwrap();
          Toast.show({
            type: 'success',
            text1: 'Password Reset',
            text2: 'Your password has been reset successfully. Please log in.'
          });
          navigation.goBack();
          return;
        } else if (isRegistering) {
          response = await registerApi({ email, name, password, otp }).unwrap();
        } else {
          response = await verifyOtpApi({ email, otp }).unwrap();
        }
        
        const apiUser = response.user;
        const role = apiUser?.role || (email.toLowerCase() === 'admin@quickkart.com' ? 'ADMIN' : 'USER');
        
        dispatch(login({ 
          user: { 
            id: apiUser?.id || '1', 
            email: apiUser?.email || email, 
            name: apiUser?.name || (isRegistering ? name : email.split('@')[0]), 
            phone: apiUser?.phone || '',
            role: role 
          }, 
          token: response.token 
        }));
        
        Toast.show({
          type: 'success',
          text1: isRegistering ? 'Account Created!' : 'Welcome!',
          text2: isRegistering ? 'Account verified and logged in successfully' : 'Logged in successfully'
        });

        // @ts-ignore
        navigation.navigate('MainTabs', { screen: 'Home', params: { showLoginToast: true } });
      } catch (err: any) {
        alert(err.data?.error || 'Invalid OTP');
      }
    } else {
      alert('Please enter a valid 6-digit OTP');
    }
  };

  const handleResend = async () => {
    try {
      await sendOtpApi(email).unwrap();
      setTimer(30);
    } catch (err: any) {
      alert(err.data?.error || 'Failed to resend OTP');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.surface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Details</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to{'\n'}<Text style={styles.emailText}>{email}</Text></Text>
        
        {isForgotPassword && (
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>
        )}

        <View style={styles.otpContainer}>
          <TextInput 
            style={styles.input}
            placeholder="Enter 6-digit OTP"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            autoFocus
          />
        </View>

        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={isSending}>
              <Text style={styles.resendText}>{isSending ? 'Sending...' : 'Resend OTP'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <Button 
           title={isForgotPassword ? "Reset Password" : "Verify OTP"}
           onPress={handleVerify}
           loading={isVerifying || isRegisteringLoading || isResettingPassword}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: spacing.lg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    marginTop: spacing.md,
  },
  title: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.xxl,
    lineHeight: 24,
  },
  emailText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  otpContainer: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary,
    paddingBottom: spacing.sm,
    marginBottom: spacing.lg,
  },
  input: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 8,
    color: colors.text,
  },
  inputWrapper: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary,
    paddingBottom: spacing.sm,
    marginBottom: spacing.xl,
    width: '100%',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  timerText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  resendText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  linkText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  }
});
