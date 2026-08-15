import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

// Standard approximation of bottom tab height + status bar
const WINDOW_HEIGHT = Dimensions.get('window').height - 85; 

const MOCK_VIDEOS = [
  {
    id: 'v1',
    title: 'Top 5 Gaming Laptops of 2024!',
    creator: '@tech_guru',
    likes: '45.2K',
    comments: '1,204',
    product: {
      id: 'p1',
      title: 'Acer Nitro 5 AMD Ryzen 7',
      price: '₹95,062',
      discount: '12% off',
      originalPrice: '₹1,08,990',
    },
    bgGradient: ['#1A2980', '#26D0CE'],
  },
  {
    id: 'v2',
    title: 'GRWM: Styling the new Nike Air Max',
    creator: '@sneakerhead_in',
    likes: '128K',
    comments: '5,602',
    product: {
      id: 'p2',
      title: 'Nike Air Max 2024 Edition',
      price: '₹4,999',
      discount: '40% off',
      originalPrice: '₹8,299',
    },
    bgGradient: ['#FF416C', '#FF4B2B'],
  },
  {
    id: 'v3',
    title: 'Unboxing the new Poco X5 Pro - Camera Test 📸',
    creator: '@gadget_reviews',
    likes: '89K',
    comments: '3,110',
    product: {
      id: 'p3',
      title: 'Poco X5 Pro (Yellow, 256GB)',
      price: '₹22,999',
      discount: '25% off',
      originalPrice: '₹30,999',
    },
    bgGradient: ['#FDC830', '#F37335'],
  }
];

export default function PlayScreen() {
  const [activeVideo, setActiveVideo] = useState(0);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const handleAddToCart = (product: any) => {
    dispatch({
        type: 'cart/addToCart',
        payload: {
            id: product.id,
            title: product.title,
            category: 'Video Featured',
            price: product.price,
            originalPrice: product.originalPrice,
            discount: product.discount,
            imageUrl: ''
        }
    });
    // @ts-ignore
    navigation.navigate('Cart');
  };

  const renderVideoItem = ({ item, index }: { item: any, index: number }) => {
    const isPlaying = activeVideo === index;

    return (
      <View style={[styles.videoContainer, { backgroundColor: item.bgGradient[0] }]}>
        
        {/* Simulated Video Player Area */}
        <View style={styles.simulatedVideo}>
           <Ionicons name={isPlaying ? "pause-circle-outline" : "play-circle-outline"} size={64} color="rgba(255,255,255,0.5)" />
        </View>

        {/* Right Action Bar */}
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="heart" size={32} color={colors.surface} />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={32} color={colors.surface} />
            <Text style={styles.actionText}>{item.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="arrow-redo-outline" size={32} color={colors.surface} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="ellipsis-vertical" size={28} color={colors.surface} />
          </TouchableOpacity>
        </View>

        {/* Bottom Details & Shoppable Overlay */}
        <View style={styles.bottomOverlay}>
          <Text style={styles.creatorText}>{item.creator}</Text>
          <Text style={styles.videoTitle}>{item.title}</Text>
          
          {/* Featured Product Card */}
          <TouchableOpacity 
             style={styles.productCard}
             activeOpacity={0.9}
             onPress={() => navigation.navigate('ProductDetails', { id: item.product.id })}
          >
             <View style={styles.productImagePlaceholder} />
             <View style={styles.productDetails}>
                <Text style={styles.productTitle} numberOfLines={1}>{item.product.title}</Text>
                <View style={styles.priceRow}>
                   <Text style={styles.productPrice}>{item.product.price}</Text>
                   <Text style={styles.productDiscount}>{item.product.discount}</Text>
                </View>
             </View>
             <TouchableOpacity 
                style={styles.buyBtn}
                onPress={() => handleAddToCart(item.product)}
             >
                <Text style={styles.buyBtnText}>Buy</Text>
             </TouchableOpacity>
          </TouchableOpacity>
        </View>

      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={MOCK_VIDEOS}
        renderItem={renderVideoItem}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={({ viewableItems }) => {
          if (viewableItems.length > 0 && viewableItems[0].index !== null) {
            setActiveVideo(viewableItems[0].index);
          }
        }}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000', // Black background for video feed
  },
  videoContainer: {
    width: Dimensions.get('window').width,
    height: WINDOW_HEIGHT,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  simulatedVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)', // Slight dark overlay
  },
  rightActions: {
    position: 'absolute',
    right: spacing.md,
    bottom: 140,
    alignItems: 'center',
  },
  actionBtn: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  actionText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 20,
    left: spacing.md,
    right: spacing.md,
  },
  creatorText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  videoTitle: {
    color: colors.surface,
    fontSize: 14,
    marginBottom: spacing.md,
    paddingRight: 60, // Leave space for right actions
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    width: '85%', // Don't take full width to leave right actions space
  },
  productImagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: colors.border,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: spacing.sm,
  },
  productDiscount: {
    fontSize: 12,
    color: colors.success,
    fontWeight: 'bold',
  },
  buyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    marginLeft: spacing.sm,
  },
  buyBtnText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 12,
  },
});
