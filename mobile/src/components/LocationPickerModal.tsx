import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { useGetAddressesQuery, useAddAddressMutation, useDeleteAddressMutation } from '../services/api';
import WebMap from './WebMap';
import Button from './Button';

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAddress: (address: string) => void;
  onSelectFullAddress?: (address: any) => void;
}

export default function LocationPickerModal({ visible, onClose, onSelectAddress, onSelectFullAddress }: LocationPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([13.0827, 80.2707]);
  
  const { data: savedAddresses, isLoading: isLoadingSaved } = useGetAddressesQuery();
  const [addAddress] = useAddAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  useEffect(() => {
    if (searchQuery.length > 3) {
      const delayDebounceFn = setTimeout(() => {
        searchNominatim(searchQuery);
      }, 1000);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchNominatim = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=in&accept-language=en`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = async (item: any) => {
    const addressLine = item.display_name;
    // Save to backend
    try {
      const newAddress = await addAddress({
        type: 'Other',
        name: 'Saved from Search',
        phone: '',
        addressLine: addressLine,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      }).unwrap();
      
      if (onSelectFullAddress) onSelectFullAddress(newAddress);
    } catch (e) {
      console.error('Failed to save address', e);
    }
    
    onSelectAddress(addressLine);
    onClose();
  };

  const handleSelectSaved = (address: any) => {
    if (onSelectFullAddress) onSelectFullAddress(address);
    onSelectAddress(address.addressLine || address.address);
    onClose();
  };

  const handleMapPinSelected = async (lat: number, lon: number) => {
    setMapCenter([lat, lon]);
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`);
      const data = await response.json();
      if (data && data.display_name) {
        setSearchQuery(data.display_name);
        // We could auto-save or let the user click a "Confirm" button.
        // For now, let's just populate the search query and results so they can click it.
        setSearchResults([data]);
      }
    } catch (e) {
      console.error('Reverse geocoding failed', e);
    } finally {
      setIsSearching(false);
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
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Location</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for an area or landmark"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>

          {/* Map Visual */}
          <View style={styles.mapContainer}>
            {Platform.OS === 'web' ? (
              <WebMap onLocationSelected={handleMapPinSelected} centerPos={mapCenter} />
            ) : (
              <View style={styles.mapPlaceholder}>
                <Ionicons name="map-outline" size={40} color={colors.border} />
                <Text style={styles.emptyText}>Map view available on web</Text>
              </View>
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

          <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
            {isSearching && <ActivityIndicator size="small" color={colors.primary} style={{ margin: spacing.md }} />}
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Search Results</Text>
                {searchResults.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.cardItem} onPress={() => handleSelectResult(item)}>
                    <View style={styles.iconWrapper}>
                      <Ionicons name="location-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resultText} numberOfLines={2}>{item.display_name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Saved Addresses */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Saved Addresses</Text>
              {isLoadingSaved ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : savedAddresses && savedAddresses.length > 0 ? (
                savedAddresses.map((address: any) => (
                  <TouchableOpacity key={address.id} style={styles.cardItem} onPress={() => handleSelectSaved(address)}>
                    <View style={styles.iconWrapper}>
                      <Ionicons name={address.type === 'Home' ? 'home-outline' : 'bookmark-outline'} size={20} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.savedTitle}>{address.type} - {address.name}</Text>
                      <Text style={styles.resultText} numberOfLines={2}>{address.addressLine || address.address}</Text>
                    </View>
                    <TouchableOpacity onPress={() => deleteAddress(address.id)} style={{ padding: 8 }}>
                      <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>No saved addresses.</Text>
              )}
            </View>
            
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    height: '90%',
    padding: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    height: 48,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: colors.text,
    outlineStyle: 'none',
  },
  mapContainer: {
    height: 220,
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveLocationBtnWrapper: {
    marginBottom: spacing.lg,
  },
  resultsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    letterSpacing: 0.2,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  resultText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  savedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
    fontStyle: 'italic',
    paddingVertical: spacing.md,
  }
});
