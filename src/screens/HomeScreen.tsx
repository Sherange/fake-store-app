import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProductGrid from '../components/ProductGrid';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <ProductGrid
        products={[]}
        onAddToCart={function (productId: number): void {
          console.log('productId', productId);
          throw new Error('Function not implemented.');
        }}
        onPressProduct={function (productId: number): void {
          console.log('productId', productId);
          throw new Error('Function not implemented.');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default HomeScreen;
