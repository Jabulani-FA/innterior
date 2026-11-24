import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, money } from '../lib/theme';
import type { Product } from '../lib/types';
import { useStore } from '../lib/StoreContext';

export function ScreenTitle({ kicker, title, detail }: { kicker: string; title: string; detail?: string }) {
  return <View style={styles.screenTitle}><Text style={styles.kicker}>{kicker}</Text><Text style={styles.title}>{title}</Text>{detail ? <Text style={styles.detail}>{detail}</Text> : null}</View>;
}

export function ProductTile({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart } = useStore();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const image = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=900&q=85';
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 6) * 65).springify()} style={[styles.product, animatedStyle]}>
      <Link href={{ pathname: '/product/[slug]', params: { slug: product.slug } }} asChild>
        <Pressable onPressIn={() => { scale.value = withSpring(0.98); }} onPressOut={() => { scale.value = withSpring(1); }}>
          <Image source={{ uri: image }} style={styles.productImage} />
          {product.category?.name ? <Text style={styles.productCategory}>{product.category.name}</Text> : null}
          <Text numberOfLines={1} style={styles.productName}>{product.title}</Text>
          <Text style={styles.productPrice}>{money(product.price)}</Text>
        </Pressable>
      </Link>
      <Pressable style={styles.quickAdd} onPress={() => addToCart(product)} accessibilityLabel={`Add ${product.title} to bag`}>
        <Ionicons name="add" size={21} color={colors.white} />
      </Pressable>
    </Animated.View>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return <View style={styles.grid}>{products.map((product, index) => <ProductTile key={product._id} product={product} index={index} />)}</View>;
}

export function LoadingState({ label = 'Finding your next favourite...' }: { label?: string }) {
  return <View style={styles.state}><ActivityIndicator color={colors.forest} /><Text style={styles.stateText}>{label}</Text></View>;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <View style={styles.state}><Ionicons name="cloud-offline-outline" size={30} color={colors.clay} /><Text style={styles.stateText}>{message}</Text>{onRetry ? <Pressable onPress={onRetry}><Text style={styles.retry}>Try again</Text></Pressable> : null}</View>;
}

const styles = StyleSheet.create({
  screenTitle: { paddingHorizontal: 22, paddingTop: 22, paddingBottom: 20 },
  kicker: { color: colors.clay, fontSize: 10, fontWeight: '800', letterSpacing: 1.8, marginBottom: 9 },
  title: { color: colors.ink, fontSize: 32, lineHeight: 37, fontWeight: '500' },
  detail: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 18, paddingBottom: 28 },
  product: { width: '48%', marginBottom: 20, position: 'relative' },
  productImage: { width: '100%', aspectRatio: 0.82, borderRadius: 5, backgroundColor: colors.pale },
  productCategory: { color: colors.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginTop: 10 },
  productName: { color: colors.ink, fontSize: 14, fontWeight: '600', marginTop: 4, paddingRight: 18 },
  productPrice: { color: colors.forest, fontSize: 13, fontWeight: '700', marginTop: 5 },
  quickAdd: { position: 'absolute', top: 9, right: 9, width: 34, height: 34, borderRadius: 17, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center' },
  state: { alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 160, paddingHorizontal: 28 },
  stateText: { color: colors.muted, fontSize: 14, textAlign: 'center', lineHeight: 21 },
  retry: { color: colors.forest, fontWeight: '700', padding: 8 },
});