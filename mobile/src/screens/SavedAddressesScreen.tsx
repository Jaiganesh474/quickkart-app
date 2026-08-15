import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useGetAddressesQuery, useAddAddressMutation, useDeleteAddressMutation } from '../services/api';
import WebMap from '../components/WebMap';
import Button from '../components/Button';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

export default function SavedAddressesScreen() {
  const navigation = useNavigation();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([13.0827, 80.2707]);
  const [isSearching, setIsSearching] = useState(false);
  const [pendingAddress, setPendingAddress] = useState<any>(null);
  
  const { data: addresses, isLoading, error } = useGetAddressesQuery();
  const [addAddress] = useAddAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  
  const handleMapPinSelected = async (lat: number, lon: number) => {
    setMapCenter([lat, lon]);
    setIsSearching(true);
    setPendingAddress(null);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`);
      const data = await response.json();
      if (data && data.display_name) {
        setPendingAddress({
          addressLine: data.display_name,
          lat, lon
        });
      }
    } catch (e) {
      console.error('Reverse geocoding failed', e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!pendingAddress) return;
    try {
      await addAddress({
        type: 'Other',
        name: 'Map Selection',
        phone: '',
        addressLine: pendingAddress.addressLine,
        latitude: pendingAddress.lat,
        longitude: pendingAddress.lon
      }).unwrap();
      setPendingAddress(null);
    } catch (e) {
      console.error('Failed to save address', e);
    }
  };

  const fetchLiveLocation = () => {
    if (navigator.geolocation) {
      setIsSearching(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          handleMapPinSelected(lat, lon);
        },
        (error) => {
          console.error("Error getting live location", error);
          setIsSearching(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Delivery Address</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Live Location Section */}
        <View style={styles.mapSectionWrapper}>
          <View style={styles.mapContainer}>
            {Platform.OS === 'web' ? (
              <WebMap onLocationSelected={handleMapPinSelected} centerPos={mapCenter} />
            ) : (
               <Image 
                 source={require('../../assets/images/live_map_placeholder.jpg')} 
                 style={styles.mapImage}
                 resizeMode="cover"
               />
            )}
          </View>
          <View style={styles.liveLocationBtnWrapper}>
            <Button 
              title={isSearching ? "Locating..." : "Use current live location"} 
              onPress={fetchLiveLocation} 
              icon="locate" 
              loading={isSearching}
            />
          </View>
        </View>

        {/* Pending Address Selection */}
        {pendingAddress && (
          <View style={styles.pendingContainer}>
            <Text style={styles.pendingTitle}>Selected Location</Text>
            <Text style={styles.pendingText}>{pendingAddress.addressLine}</Text>
            <Button title="Save this Address" onPress={handleSaveAddress} icon="checkmark-circle" />
          </View>
        )}

        {/* Saved Addresses Section */}
        <View style={styles.savedSection}>
          <Text style={styles.sectionTitle}>Saved Addresses</Text>
          
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
          ) : addresses && addresses.length > 0 ? (
            addresses.map((address: any) => (
              <TouchableOpacity 
                key={address.id} 
                style={[
                  styles.addressCard, 
                  selectedAddressId === address.id && styles.addressCardSelected
                ]}
                onPress={() => setSelectedAddressId(address.id)}
              >
              <View style={styles.addressHeader}>
                <View style={styles.addressTypeBadge}>
                  <Ionicons name={address.type === 'Home' ? 'home' : 'briefcase'} size={14} color={colors.textMuted} />
                  <Text style={styles.addressType}>{address.type}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity 
                    onPress={() => deleteAddress(address.id)} 
                    style={{ marginRight: 16, padding: 4 }}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                  <Ionicons 
                    name={selectedAddressId === address.id ? "radio-button-on" : "radio-button-off"} 
                    size={24} 
                    color={selectedAddressId === address.id ? colors.primary : colors.border} 
                  />
                </View>
              </View>
              <View style={styles.addressDetails}>
                <Text style={styles.addressName}>{address.name} <Text style={styles.addressPhone}> {address.phone}</Text></Text>
                <Text style={styles.addressText}>{address.addressLine}</Text>
              </View>
            </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="location-outline" size={48} color={colors.border} style={{ marginBottom: spacing.sm }} />
              <Text style={styles.emptyStateText}>No saved addresses found.</Text>
              <Text style={styles.emptyStateSubtext}>Add a new address below to proceed.</Text>
            </View>
          )}

          <View style={styles.addAddressBtnWrapper}>
            <Button title="Add a new address manually" onPress={() => {}} type="dashed" icon="add" />
          </View>
        </View>
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
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  mapSectionWrapper: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  mapContainer: {
    height: 250,
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  mapImage: {
    width: '100%',
    height: '100%'
  },
  liveLocationBtnWrapper: {
    width: '100%',
  },
  pendingContainer: {
    padding: spacing.md,
    backgroundColor: '#F0F8FF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pendingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  pendingText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.md,
  },
  saveAddressBtn: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  saveAddressBtnText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
  savedSection: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.lg,
    color: colors.text,
    letterSpacing: 0.2,
  },
  addressCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addressCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F0F8FF', // Light blue tint
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  addressTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  addressType: {
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 4,
    fontWeight: '600'
  },
  addressDetails: {
    marginTop: spacing.sm,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  addressPhone: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMuted,
  },
  addressText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginBottom: spacing.lg,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textMuted,
  },
  addAddressBtnWrapper: {
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  }
});
