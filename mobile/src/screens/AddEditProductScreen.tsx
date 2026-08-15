import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAddSellerProductMutation, useUpdateSellerProductMutation } from '../services/api';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import Button from '../components/Button';
import { SHARED_CATEGORIES } from '../utils/categories';

type ParamList = {
  AddEditProduct: {
    product?: any;
  };
};

export default function AddEditProductScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'AddEditProduct'>>();
  const existingProduct = route.params?.product;
  const isEditing = !!existingProduct;

  const [title, setTitle] = useState(existingProduct?.title || '');
  const [description, setDescription] = useState(existingProduct?.description || '');
  const [price, setPrice] = useState(existingProduct?.price?.toString() || '');
  const [originalPrice, setOriginalPrice] = useState(existingProduct?.originalPrice?.toString() || '');
  const [discount, setDiscount] = useState(existingProduct?.discount || '');
  const [category, setCategory] = useState(
    existingProduct?.category?.name || 
    (typeof existingProduct?.category === 'string' ? existingProduct.category : 'For You')
  );
  const [images, setImages] = useState<string[]>(existingProduct?.images?.length ? existingProduct.images : (existingProduct?.imageUrl ? [existingProduct.imageUrl] : []));
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [addProduct, { isLoading: isAdding }] = useAddSellerProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateSellerProductMutation();
  const isLoading = isAdding || isUpdating;

  // Auto-calculate discount
  useEffect(() => {
    const cleanPrice = price.replace(/,/g, '');
    const cleanOriginalPrice = originalPrice.replace(/,/g, '');
    const p = parseFloat(cleanPrice);
    const op = parseFloat(cleanOriginalPrice);
    if (!isNaN(p) && !isNaN(op) && op > 0 && op > p) {
      const disc = Math.round(((op - p) / op) * 100);
      setDiscount(`${disc}% OFF`);
    } else if (p === op) {
      setDiscount('');
    }
  }, [price, originalPrice]);

  const handleSave = async () => {
    if (!title || !price || images.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in required fields (Title, Price, at least 1 Image)'
      });
      return;
    }

    const cleanPrice = price.replace(/,/g, '');
    const cleanOriginalPrice = originalPrice.replace(/,/g, '');

    const productData = {
      title,
      description,
      price: parseFloat(cleanPrice),
      originalPrice: parseFloat(cleanOriginalPrice) || parseFloat(cleanPrice),
      discount,
      imageUrl: images[0],
      images,
      category: { name: category }
    };

    try {
      if (isEditing) {
        await updateProduct({ id: existingProduct.id, product: productData }).unwrap();
      } else {
        await addProduct(productData).unwrap();
      }
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Product ${isEditing ? 'updated' : 'added'} successfully!`
      });
      navigation.goBack();
    } catch (e) {
      console.error('Failed to save product', e);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save product. Please try again.'
      });
    }
  };

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert('Limit Reached', 'You can only upload up to 5 images.');
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        uploadToCloudinary(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const uploadToCloudinary = async (asset: ImagePicker.ImagePickerAsset) => {
    // Requires EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME and EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
    const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'docs_upload_example_us_preset';

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      Alert.alert('Configuration Error', 'Cloudinary credentials are not set in .env');
      return;
    }

    setIsUploadingImage(true);
    try {
      const data = new FormData();
      if (Platform.OS === 'web') {
        // Construct file from base64 or uri for web
        // @ts-ignore
        if (asset.file) {
          // @ts-ignore
          data.append('file', asset.file);
        } else {
          data.append('file', `data:image/jpeg;base64,${asset.base64}`);
        }
      } else {
        // @ts-ignore
        data.append('file', {
          uri: asset.uri,
          type: 'image/jpeg',
          name: 'upload.jpg',
        });
      }
      data.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: data,
      });
      const responseJson = await res.json();
      
      if (responseJson.secure_url) {
        setImages(prev => [...prev, responseJson.secure_url]);
      } else {
        console.error("Cloudinary Error:", responseJson);
        Toast.show({
          type: 'error',
          text1: 'Upload Failed',
          text2: responseJson.error?.message || 'Failed to upload image'
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      Toast.show({
        type: 'error',
        text1: 'Upload Error',
        text2: 'Failed to upload image. Please try again.'
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{isEditing ? 'Edit Product' : 'Add New Product'}</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Apple iPhone 15 Pro"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your product..."
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
              {SHARED_CATEGORIES.map((cat, index) => {
                // Skip 'For You' as it's not a real category
                if (cat.name === 'For You') return null;
                const isSelected = category === cat.name;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected
                    ]}
                    onPress={() => setCategory(cat.name)}
                  >
                    <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.sm }]}>
              <Text style={styles.label}>Selling Price (₹) *</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="e.g. 999"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: spacing.sm }]}>
              <Text style={styles.label}>Original Price (₹)</Text>
              <TextInput
                style={styles.input}
                value={originalPrice}
                onChangeText={setOriginalPrice}
                placeholder="e.g. 1499"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Discount Badge Text</Text>
            <TextInput
              style={styles.input}
              value={discount}
              onChangeText={setDiscount}
              placeholder="e.g. 15% OFF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Images ({images.length}/5) *</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
              {images.map((img, idx) => (
                <View key={idx} style={styles.thumbnailContainer}>
                  <Image source={{ uri: img }} style={styles.thumbnailImage} />
                  <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(idx)}>
                    <Ionicons name="close-circle" size={24} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
              
              {images.length < 5 && (
                <TouchableOpacity 
                  style={[styles.imageUploadBox, { width: 120, height: 120 }]} 
                  onPress={pickImage}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <View style={styles.placeholderContainer}>
                      <Ionicons name="add" size={32} color={colors.primary} />
                      <Text style={styles.placeholderText}>Add Photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <Button 
            title={isLoading ? "Saving..." : (isEditing ? "Save Changes" : "Publish Product")} 
            onPress={handleSave} 
            loading={isLoading} 
          />
        </View>
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
  title: { fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif' },
  content: {
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    fontSize: 16,
    color: colors.text,
    outlineStyle: 'none',
  },
  textArea: {
    height: 100,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  imageUploadBox: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  uploadingContainer: {
    alignItems: 'center',
  },
  uploadingText: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  thumbnailContainer: {
    width: 120,
    height: 120,
    marginRight: spacing.md,
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryChipSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: colors.primary,
  },
  categoryChipText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  }
});
