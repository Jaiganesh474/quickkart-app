import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import Button from '../components/Button';
import { useLoginMutation, useSendOtpMutation, useSendRegistrationOtpMutation, useSendForgotPasswordOtpMutation } from '../services/api';
import { login } from '../store/slices/authSlice';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isOtpMode, setIsOtpMode] = useState(false);
  
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [loginApi, { isLoading: isLoggingIn }] = useLoginMutation();
  const [sendRegistrationOtp, { isLoading: isSendingRegOtp }] = useSendRegistrationOtpMutation();
  const [sendOtpApi, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [sendForgotPasswordOtp, { isLoading: isSendingForgotOtp }] = useSendForgotPasswordOtpMutation();

  const handleContinue = async () => {
    if (!email || !email.includes('@')) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid email address'
      });
      return;
    }

    if (isOtpMode) {
      try {
        await sendOtpApi(email).unwrap();
        // @ts-ignore
        navigation.navigate('Otp', { email });
      } catch (err: any) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err.data?.error || 'Failed to send OTP'
        });
      }
      return;
    }

    if (!password || password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password must be at least 6 characters'
      });
      return;
    }

    try {
      if (isLoginMode) {
        const response = await loginApi({ email, password }).unwrap();
        const apiUser = response.user;
        const role = apiUser?.role || (email.toLowerCase() === 'admin@quickkart.com' ? 'ADMIN' : 'USER');
        
        dispatch(login({ 
          user: { 
            id: apiUser?.id || '1', 
            email: apiUser?.email || email, 
            name: apiUser?.name || email.split('@')[0], 
            phone: apiUser?.phone || '',
            role: role 
          }, 
          token: response.token 
        }));
        
        Toast.show({
          type: 'success',
          text1: 'Welcome!',
          text2: 'Logged in successfully'
        });
        
        // @ts-ignore
        navigation.navigate('MainTabs', { screen: 'Home', params: { showLoginToast: true } });
      } else {
        if (!name) {
          Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter your full name' });
          return;
        }
        await sendRegistrationOtp(email).unwrap();
        // @ts-ignore
        navigation.navigate('Otp', { email, name, password, isRegistering: true });
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.data?.error || 'Authentication failed'
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!email || !email.includes('@')) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid email address to reset password'
      });
      return;
    }
    
    try {
      await sendForgotPasswordOtp(email).unwrap();
      // @ts-ignore
      navigation.navigate('Otp', { email, isForgotPassword: true });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.data?.error || 'Failed to send reset OTP'
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.surface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QuickKart</Text>
      </View>

        <View style={styles.container}>
          <Text style={styles.title}>{isOtpMode ? 'Log in with OTP' : (isLoginMode ? 'Log in for the best experience' : 'Create an Account')}</Text>
          <Text style={styles.subtitle}>Enter your email to proceed</Text>
          
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              autoFocus
            />
          </View>

          {!isOtpMode && !isLoginMode && (
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          {!isOtpMode && (
            <View style={{ marginBottom: spacing.lg }}>
              <View style={[styles.inputWrapper, { marginBottom: 0 }]}>
                <TextInput 
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              {isLoginMode && (
                <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: 'flex-end', marginTop: spacing.sm }}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <Text style={styles.termsText}>
            By continuing, you agree to QuickKart's <Text style={styles.linkText}>Terms of Use</Text> and <Text style={styles.linkText}>Privacy Policy</Text>.
          </Text>

          <Button 
            title={isOtpMode ? "Send OTP" : (isLoginMode ? "Login" : "Sign Up & Verify")} 
            onPress={handleContinue}
            loading={isLoggingIn || isSendingRegOtp || isSendingOtp || isSendingForgotOtp}
          />
          
          {!isOtpMode && (
            <TouchableOpacity onPress={() => setIsLoginMode(!isLoginMode)} style={{ marginTop: spacing.xl, alignItems: 'center' }}>
              <Text style={styles.toggleText}>{isLoginMode ? "New here? Sign Up" : "Already have an account? Log In"}</Text>
            </TouchableOpacity>
          )}

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <Button 
            title={isOtpMode ? "Login with Password" : "Login with OTP"} 
            type="outline"
            onPress={() => setIsOtpMode(!isOtpMode)}
          />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary, // Brand blue header
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
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  inputWrapper: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary,
    paddingBottom: spacing.s,
    marginBottom: spacing.l,
  },
  input: {
    fontSize: 16,
    color: colors.text,
    outlineStyle: 'none',
  },
  termsText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: spacing.xl,
  },
  linkText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  toggleText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.m,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: 'bold',
  }
});
