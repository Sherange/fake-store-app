import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

// Types and Interfaces
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  description: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onPress: (productId: number) => void;
  onAddToCart: (productId: number) => void;
  cardWidth: number;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (productId: number) => void;
  onPressProduct: (productId: number) => void;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
}

// Sample data for testing
const sampleProducts: Product[] = [
  {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    price: 109.95,
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: { rate: 3.9, count: 120 },
    description: 'Your perfect pack for everyday use and walks in the forest.',
    category: "men's clothing",
  },
  {
    id: 2,
    title: 'Mens Casual Premium Slim Fit T-Shirts',
    price: 22.3,
    image:
      'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    rating: { rate: 4.1, count: 259 },
    description: 'Slim-fitting style, contrast raglan long sleeve.',
    category: "men's clothing",
  },
  {
    id: 3,
    title: 'Mens Cotton Jacket',
    price: 55.99,
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    rating: { rate: 4.7, count: 500 },
    description: 'Great outerwear jackets for Spring/Autumn/Winter.',
    category: "men's clothing",
  },
  {
    id: 4,
    title: 'Mens Casual Slim Fit',
    price: 15.99,
    image: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
    rating: { rate: 2.1, count: 430 },
    description: 'The color could be slightly different between on the screen.',
    category: "men's clothing",
  },
  {
    id: 5,
    title:
      "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    price: 695,
    image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ml3_.jpg',
    rating: { rate: 4.6, count: 400 },
    description:
      'From our Legends Collection, the Naga was inspired by the mythical water dragon.',
    category: 'jewelry',
  },
  {
    id: 6,
    title: 'Solid Gold Petite Micropave',
    price: 168,
    image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ml3_.jpg',
    rating: { rate: 3.9, count: 70 },
    description:
      'Satisfaction Guaranteed. Return or exchange any order within 30 days.',
    category: 'jewelry',
  },
];

// Helper function to render stars
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={styles.starContainer}>
      {[...Array(fullStars)].map((_, index) => (
        <Text key={`full-${index}`} style={styles.star}>
          ★
        </Text>
      ))}
      {hasHalfStar && <Text style={styles.star}>☆</Text>}
      {[...Array(emptyStars)].map((_, index) => (
        <Text key={`empty-${index}`} style={styles.starEmpty}>
          ☆
        </Text>
      ))}
      <Text style={styles.ratingText}>({rating.toFixed(1)})</Text>
    </View>
  );
};

// ProductCard Component
const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ product, onPress, onAddToCart, cardWidth }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const handlePress = useCallback(() => {
      onPress(product.id);
    }, [onPress, product.id]);

    const handleAddToCart = useCallback(
      (event: any) => {
        event.stopPropagation(); // Prevent triggering the card press
        onAddToCart(product.id);
      },
      [onAddToCart, product.id],
    );

    const handleImageLoad = useCallback(() => {
      setImageLoading(false);
    }, []);

    const handleImageError = useCallback(() => {
      setImageLoading(false);
      setImageError(true);
    }, []);

    return (
      <TouchableOpacity
        style={[styles.card, { width: cardWidth }]}
        onPress={handlePress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityLabel={`Product: ${product.title}, Price: $${product.price}, Rating: ${product.rating.rate} stars`}
        accessibilityRole="button"
        accessibilityHint="Double tap to view product details"
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {imageLoading && (
            <View style={styles.imagePlaceholder}>
              <ActivityIndicator size="small" color="#666" />
            </View>
          )}
          {!imageError ? (
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              onLoad={handleImageLoad}
              onError={handleImageError}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imageError}>
              <Text style={styles.imageErrorText}>Image not available</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {product.title}
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
          </View>

          {renderStars(product.rating.rate)}

          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
            activeOpacity={0.8}
            accessible={true}
            accessibilityLabel={`Add ${product.title} to cart`}
            accessibilityRole="button"
            accessibilityHint="Double tap to add this product to your cart"
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  },
);

// ProductGrid Component
const ProductGrid: React.FC<ProductGridProps> = ({
  products = sampleProducts, // Default to sample data if no products provided
  onAddToCart,
  onPressProduct,
  loading = false,
  refreshing = false,
  onRefresh,
  onLoadMore,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const paddingHorizontal = 16;
  const gap = 12;

  // Calculate card width for two-column layout
  const cardWidth = useMemo(() => {
    return (screenWidth - paddingHorizontal * 2 - gap) / 2;
  }, [screenWidth]);

  // Memoized render item function
  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        onPress={onPressProduct}
        onAddToCart={onAddToCart}
        cardWidth={cardWidth}
      />
    ),
    [onPressProduct, onAddToCart, cardWidth],
  );

  // Memoized key extractor
  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  // Memoized item separator
  const ItemSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  // Memoized list footer component for loading more
  const ListFooterComponent = useCallback(() => {
    if (loading && products.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>Loading more products...</Text>
        </View>
      );
    }
    return null;
  }, [loading, products.length]);

  // Memoized empty component
  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No products available</Text>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ItemSeparatorComponent={ItemSeparator}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
              colors={['#007AFF']}
            />
          ) : undefined
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={6}
        getItemLayout={(data, index) => ({
          length: 280, // Approximate item height
          offset: 280 * Math.floor(index / 2),
          index,
        })}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  separator: {
    height: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  imageError: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  imageErrorText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  star: {
    fontSize: 14,
    color: '#FFD700',
    marginRight: 2,
  },
  starEmpty: {
    fontSize: 14,
    color: '#ddd',
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProductGrid;
export type { Product, ProductGridProps, ProductCardProps };
