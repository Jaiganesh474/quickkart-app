import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Modal, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { RootState } from '../store';
import { updateUser } from '../store/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import Button from '../components/Button';
import { useUpdateProfileMutation } from '../services/api';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  const [updateProfileApi, { isLoading: isSaving }] = useUpdateProfileMutation();

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setProfilePicture(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to pick image' });
    }
    setIsPhotoModalVisible(false);
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'Camera access is required!' });
        return;
      }
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setProfilePicture(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to take photo' });
    }
    setIsPhotoModalVisible(false);
  };

  const removePhoto = () => {
    setProfilePicture('');
    setIsPhotoModalVisible(false);
  };

  const handleSave = async () => {
    try {
      await updateProfileApi({ name, phone, profilePicture }).unwrap();
      dispatch(updateUser({ name, email, phone, profilePicture }));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile updated successfully!'
      });
      navigation.goBack();
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update profile'
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={60} color={colors.primary} />
              )}
              <TouchableOpacity style={styles.editAvatarBtn} onPress={() => setIsPhotoModalVisible(true)}>
                <Ionicons name="camera" size={16} color={colors.surface} />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarSubtext}>Tap camera to change picture</Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            title={isSaving ? "Saving..." : "Save Changes"} 
            onPress={handleSave} 
            loading={isSaving} 
          />
        </View>

        {/* Photo Options Modal */}
        <Modal visible={isPhotoModalVisible} transparent animationType="slide">
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsPhotoModalVisible(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Profile Photo</Text>
              
              <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
                <Ionicons name="camera-outline" size={24} color={colors.text} style={styles.modalOptionIcon} />
                <Text style={styles.modalOptionText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalOption} onPress={pickImage}>
                <Ionicons name="image-outline" size={24} color={colors.text} style={styles.modalOptionIcon} />
                <Text style={styles.modalOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
              
              {profilePicture ? (
                <TouchableOpacity style={styles.modalOption} onPress={removePhoto}>
                  <Ionicons name="trash-outline" size={24} color={colors.error} style={styles.modalOptionIcon} />
                  <Text style={[styles.modalOptionText, { color: colors.error }]}>Remove Photo</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
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
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  scrollContent: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarSubtext: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },
  formSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 56,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.text,
    outlineStyle: 'none',
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : spacing.xl,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalOptionIcon: {
    marginRight: spacing.md,
  },
  modalOptionText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  }
});
