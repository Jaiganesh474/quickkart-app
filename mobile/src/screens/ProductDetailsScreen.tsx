import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Share, Image, Dimensions, TextInput } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { useGetProductByIdQuery, useGetProductReviewsQuery, useAddProductReviewMutation } from '../services/api';
import { RootState } from '../store';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { updateQuantity, removeFromCart } from '../store/slices/cartSlice';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

export default function ProductDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  // @ts-ignore
  const productId = String(route.params?.id || '1');
  
  const { data: apiProduct, isLoading } = useGetProductByIdQuery(productId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  const { data: reviews = [], refetch: refetchReviews } = useGetProductReviewsQuery(productId);
  const [addReview, { isLoading: isAddingReview }] = useAddProductReviewMutation();
  const user = useSelector((state: RootState) => state.auth.user);

  const wishlistItems = useSelector((state: RootState) => state.wishlist.itemIds);
  const isWishlisted = wishlistItems.includes(productId);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItem = cartItems.find(item => item.id === productId);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading product details...</Text>
      </SafeAreaView>
    );
  }

  if (!apiProduct) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Product not found.</Text>
      </SafeAreaView>
    );
  }

  let formattedDiscount = apiProduct.discount || '';
  if (formattedDiscount && !formattedDiscount.includes('%') && !formattedDiscount.toLowerCase().includes('off')) {
    formattedDiscount = `${formattedDiscount}% OFF`;
  }

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : '4.5';
  const totalReviews = reviews.length > 0 ? reviews.length.toString() : '0';

  const product = {
      id: apiProduct.id.toString(),
      title: apiProduct.title,
      rating: avgRating,
      reviews: totalReviews,
      price: apiProduct.price,
      originalPrice: apiProduct.originalPrice || apiProduct.price,
      discount: formattedDiscount,
      description: apiProduct.description,
      imageUrl: apiProduct.imageUrl,
      images: apiProduct.images?.length ? apiProduct.images : (apiProduct.imageUrl ? [apiProduct.imageUrl] : []),
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this product: ${product.title} for ${product.price}`,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleAddToCart = () => {
      dispatch({
          type: 'cart/addToCart',
          payload: {
              id: product.id,
              title: product.title,
              category: 'General',
              price: product.price.toString(),
              originalPrice: product.originalPrice.toString(),
              discount: product.discount,
              imageUrl: product.imageUrl || ''
          }
      });
  };

  const handleToggleWishlist = () => {
      dispatch(toggleWishlist(product.id));
      Toast.show({
        type: 'success',
        text1: isWishlisted ? 'Removed' : 'Added',
        text2: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist'
      });
  };

  const handleAddReview = async () => {
    if (!comment.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter a comment' });
      return;
    }
    try {
      await addReview({
        productId,
        review: {
          rating,
          comment,
          reviewerName: user?.name || 'Anonymous User'
        }
      }).unwrap();
      setComment('');
      setRating(5);
      refetchReviews();
      Toast.show({ type: 'success', text1: 'Review added successfully!' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to add review' });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('SearchScreen' as never)}>
              <Ionicons name="search" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('MainTabs' as never, { screen: 'Cart' } as never)}>
              <Ionicons name="cart-outline" size={24} color={colors.text} />
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Image Carousel / Product Image */}
        <View style={styles.imageCarousel} onLayout={(e) => setCarouselWidth(e.nativeEvent.layout.width)}>
            {carouselWidth > 0 && product.images.length > 0 ? (
                <ScrollView 
                  horizontal 
                  pagingEnabled 
                  showsHorizontalScrollIndicator={false}
                  onScroll={(e) => {
                    const slideSize = e.nativeEvent.layoutMeasurement.width;
                    const index = e.nativeEvent.contentOffset.x / slideSize;
                    setCurrentImageIndex(Math.round(index));
                  }}
                  scrollEventThrottle={16}
                  style={{ width: carouselWidth, height: 350 }}
                >
                  {product.images.map((img: string, idx: number) => (
                    <View key={idx} style={{ width: carouselWidth, height: 350 }}>
                      <Image source={{ uri: img }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                    </View>
                  ))}
                </ScrollView>
            ) : product.images.length === 0 ? (
                <View style={styles.placeholderImage} />
            ) : null}
            
            {product.images.length > 1 && (
              <View style={styles.paginationDots}>
                {product.images.map((_, idx) => (
                  <View key={idx} style={[styles.dot, currentImageIndex === idx ? styles.activeDot : null]} />
                ))}
              </View>
            )}

            <View style={styles.imageOverlayActions}>
                <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>{product.rating} ★</Text>
                </View>
                <View style={styles.rightOverlayActions}>
                    <TouchableOpacity style={styles.circleBtn} onPress={handleToggleWishlist}>
                        <Ionicons name={isWishlisted ? "heart" : "heart-outline"} size={20} color={isWishlisted ? colors.error : colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.circleBtn} onPress={handleShare}>
                        <Ionicons name="share-social-outline" size={20} color={colors.textMuted} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        {/* Product Info */}
        <View style={styles.section}>
            <Text style={styles.title}>{product.title}</Text>
            
            <View style={styles.ratingRow}>
                <Text style={styles.reviewsText}>{product.reviews} ratings</Text>
                <MaterialIcons name="verified-user" size={16} color={colors.primary} style={{marginLeft: 8}} />
                <Text style={styles.assuredText}>Assured</Text>
            </View>

            <View style={styles.priceRow}>
                <Text style={styles.price}>₹{product.price}</Text>
                {product.originalPrice > product.price && (
                    <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                )}
                {product.discount ? (
                    <Text style={styles.discount}>{product.discount}</Text>
                ) : null}
            </View>
        </View>

        {/* Offers */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available offers</Text>
            <View style={styles.offerRow}>
                <Ionicons name="pricetag" size={16} color={colors.success} />
                <Text style={styles.offerText}><Text style={styles.bold}>Bank Offer</Text> 5% Cashback on QuickKart Axis Bank Card</Text>
            </View>
            <View style={styles.offerRow}>
                <Ionicons name="pricetag" size={16} color={colors.success} />
                <Text style={styles.offerText}><Text style={styles.bold}>Special Price</Text> Get extra 10% off (price inclusive of cashback/coupon)</Text>
            </View>
        </View>

        {/* Details */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
        </View>

        {/* Ratings & Reviews */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
            
            <View style={styles.addReviewContainer}>
              <Text style={styles.addReviewTitle}>Write a Review</Text>
              <View style={styles.starSelection}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Ionicons name={star <= rating ? "star" : "star-outline"} size={32} color={colors.primary} />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.reviewInput}
                placeholder="Write your review here..."
                value={comment}
                onChangeText={setComment}
                multiline
              />
              <TouchableOpacity style={styles.submitReviewBtn} onPress={handleAddReview} disabled={isAddingReview}>
                <Text style={styles.submitReviewText}>{isAddingReview ? 'Submitting...' : 'Submit Review'}</Text>
              </TouchableOpacity>
            </View>

            {reviews.length > 0 ? (
              reviews.map((rev: any, index: number) => (
                <View key={rev.id || index} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewRatingBadge}>
                      <Text style={styles.reviewRatingText}>{rev.rating} ★</Text>
                    </View>
                    <Text style={styles.reviewerName}>{rev.reviewerName}</Text>
                  </View>
                  <Text style={styles.reviewComment}>{rev.comment}</Text>
                </View>
              ))
            ) : (
              <Text style={{color: colors.textMuted, marginTop: spacing.md}}>No reviews yet. Be the first to review!</Text>
            )}
        </View>
        
        {/* Padding for bottom bar */}
        <View style={{height: 80}} />

      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
          {cartItem ? (
              <View style={[styles.cartBtn, styles.quantityControlContainer]}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => {
                      if (cartItem.quantity === 1) {
                          dispatch(removeFromCart(product.id));
                      } else {
                          dispatch(updateQuantity({id: product.id, quantity: cartItem.quantity - 1}));
                      }
                  }}>
                      <Ionicons name="remove" size={20} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{cartItem.quantity}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => {
                      dispatch(updateQuantity({id: product.id, quantity: cartItem.quantity + 1}));
                  }}>
                      <Ionicons name="add" size={20} color={colors.text} />
                  </TouchableOpacity>
              </View>
          ) : (
              <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
                  <Text style={styles.cartBtnText}>Add to cart</Text>
              </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.buyBtn} onPress={() => {
              /* @ts-ignore */
              navigation.navigate('Checkout', { 
                  buyNowItem: {
                      id: product.id,
                      title: product.title,
                      category: 'General',
                      price: product.price.toString(),
                      originalPrice: product.originalPrice.toString(),
                      discount: product.discount,
                      imageUrl: product.imageUrl || '',
                      quantity: 1
                  }
              });
          }}>
              <Text style={styles.buyBtnText}>Buy Now</Text>
          </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    elevation: 2,
    zIndex: 10,
  },
  headerRight: {
      flexDirection: 'row',
  },
  iconBtn: {
      padding: spacing.sm,
      marginLeft: spacing.sm,
  },
  imageCarousel: {
      height: 350,
      backgroundColor: colors.surface,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
  },
  placeholderImage: {
      width: 250,
      height: 250,
      backgroundColor: colors.border,
      opacity: 0.3,
  },
  imageOverlayActions: {
      position: 'absolute',
      bottom: spacing.md,
      left: spacing.md,
      right: spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
  },
  paginationDots: {
      position: 'absolute',
      bottom: spacing.md,
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
  },
  dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.border,
      marginHorizontal: 4,
  },
  activeDot: {
      backgroundColor: colors.primary,
      width: 12,
  },
  ratingBadge: {
      backgroundColor: colors.success,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.md,
  },
  ratingText: {
      color: colors.surface,
      fontSize: 12,
      fontWeight: 'bold',
  },
  rightOverlayActions: {
      flexDirection: 'column',
  },
  circleBtn: {
      backgroundColor: colors.surface,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
  },
  section: {
      backgroundColor: colors.surface,
      padding: spacing.md,
      marginTop: spacing.sm,
  },
  title: {
      fontSize: 18,
      color: colors.text,
      marginBottom: spacing.sm,
  },
  ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
  },
  reviewsText: {
      fontSize: 12,
      color: colors.textMuted,
  },
  assuredText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: 'bold',
      marginLeft: 2,
      fontStyle: 'italic',
  },
  priceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
  },
  price: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginRight: spacing.sm,
  },
  originalPrice: {
      fontSize: 14,
      color: colors.textMuted,
      textDecorationLine: 'line-through',
      marginRight: spacing.sm,
  },
  discount: {
      fontSize: 14,
      color: colors.success,
      fontWeight: 'bold',
  },
  sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: spacing.md,
  },
  offerRow: {
      flexDirection: 'row',
      marginBottom: spacing.sm,
      alignItems: 'flex-start',
  },
  offerText: {
      fontSize: 13,
      color: colors.text,
      marginLeft: spacing.sm,
      flex: 1,
  },
  bold: {
      fontWeight: 'bold',
  },
  descriptionText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
  },
  bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      backgroundColor: colors.surface,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
  },
  cartBtn: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingVertical: spacing.lg,
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: colors.border,
  },
  cartBtnText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
  },
  quantityControlContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.md,
  },
  qtyBtn: {
      padding: spacing.sm,
      backgroundColor: colors.background,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: colors.border,
  },
  qtyText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginHorizontal: spacing.xl,
      color: colors.text,
  },
  buyBtn: {
      flex: 1,
      backgroundColor: '#FF9000', // Flipkart yellow/orange buy button
      paddingVertical: spacing.lg,
      alignItems: 'center',
  },
  buyBtnText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.surface,
  },
  addReviewContainer: {
      marginBottom: spacing.lg,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
  },
  addReviewTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: spacing.sm,
  },
  starSelection: {
      flexDirection: 'row',
      marginBottom: spacing.md,
  },
  reviewInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      padding: spacing.md,
      minHeight: 80,
      textAlignVertical: 'top',
      marginBottom: spacing.md,
      backgroundColor: colors.background,
  },
  submitReviewBtn: {
      backgroundColor: colors.primary,
      padding: spacing.md,
      borderRadius: radius.md,
      alignItems: 'center',
  },
  submitReviewText: {
      color: colors.surface,
      fontWeight: 'bold',
      fontSize: 15,
  },
  reviewItem: {
      marginBottom: spacing.lg,
  },
  reviewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
  },
  reviewRatingBadge: {
      backgroundColor: colors.success,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.sm,
      marginRight: spacing.sm,
  },
  reviewRatingText: {
      color: colors.surface,
      fontSize: 12,
      fontWeight: 'bold',
  },
  reviewerName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
  },
  reviewComment: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
  },
});
