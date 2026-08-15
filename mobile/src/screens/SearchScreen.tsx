import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSearchProductsQuery } from '../services/api';
import ProductCard from '../components/ProductCard';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

const RECENT_SEARCHES_KEY = '@recent_searches';

export default function SearchScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'SearchScreen'>>();
  
  const [query, setQuery] = useState(route.params?.initialQuery || '');
  const [submittedQuery, setSubmittedQuery] = useState(route.params?.initialQuery || '');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Fetch results based on the submitted query
  const { data: searchResults, isLoading } = useSearchProductsQuery(submittedQuery, {
    skip: !submittedQuery || submittedQuery.trim() === '',
  });

  // Instant live search with 300ms debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        setSubmittedQuery(query);
      } else {
        setSubmittedQuery('');
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent searches', error);
    }
  };

  const saveSearch = async (newQuery: string) => {
    if (!newQuery.trim()) return;
    try {
      let searches = [...recentSearches];
      searches = searches.filter(item => item.toLowerCase() !== newQuery.toLowerCase());
      searches.unshift(newQuery.trim());
      if (searches.length > 10) {
        searches.pop(); // Keep only last 10
      }
      setRecentSearches(searches);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving search', error);
    }
  };

  const removeSearch = async (searchToRemove: string) => {
    try {
      const updated = recentSearches.filter(item => item !== searchToRemove);
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing search', error);
    }
  };

  const handleSubmit = () => {
    if (query.trim()) {
      setSubmittedQuery(query);
      saveSearch(query);
    }
  };

  const handleRecentSearchTap = (term: string) => {
    setQuery(term);
    setSubmittedQuery(term);
    saveSearch(term);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Search Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              if (text.length === 0) {
                setSubmittedQuery(''); // Show recent searches again when input is cleared
              }
            }}
            onSubmitEditing={handleSubmit}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setSubmittedQuery(''); }}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} style={{ paddingRight: spacing.sm }} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* If no active search, show Recent Searches */}
        {!submittedQuery || submittedQuery.trim() === '' ? (
          <View style={styles.recentSearchesContainer}>
            {recentSearches.length > 0 && <Text style={styles.sectionTitle}>Recent Searches</Text>}
            {recentSearches.map((item, index) => (
              <View key={index} style={styles.recentItem}>
                <TouchableOpacity style={styles.recentItemLeft} onPress={() => handleRecentSearchTap(item)}>
                  <Ionicons name="time-outline" size={20} color={colors.textMuted} style={styles.recentIcon} />
                  <Text style={styles.recentText}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeSearch(item)}>
                  <Ionicons name="close" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          /* Search Results */
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsHeader}>Results for "{submittedQuery}"</Text>
            
            {isLoading ? (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>Searching...</Text>
            ) : searchResults && searchResults.length > 0 ? (
              <View style={styles.productsGrid}>
                {searchResults.map((item: any) => (
                  <View key={item.id} style={styles.gridItem}>
                    <ProductCard
                      id={item.id}
                      title={item.title}
                      category={item.category?.name || item.description || ''}
                      imageUrl={item.imageUrl || ''}
                      discountBadge={item.discount}
                      price={item.price}
                      originalPrice={item.originalPrice}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noResults}>
                <Ionicons name="search-outline" size={64} color={colors.border} />
                <Text style={styles.noResultsText}>No products found.</Text>
                <Text style={{color: colors.textMuted, marginTop: 5}}>Try a different keyword.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    marginRight: spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: radius.md,
    height: 44,
  },
  searchIcon: {
    paddingHorizontal: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    height: '100%',
  },
  recentSearchesContainer: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recentIcon: {
    marginRight: spacing.sm,
  },
  recentText: {
    fontSize: 15,
    color: colors.text,
  },
  resultsContainer: {
    padding: spacing.md,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.text,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: spacing.md,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  }
});
