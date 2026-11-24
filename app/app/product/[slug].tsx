import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ErrorState, LoadingState } from '../../components/StoreUI';
import { getProduct } from '../../lib/api';
import { useStore } from '../../lib/StoreContext';
import { colors, money } from '../../lib/theme';
import type { Product } from '../../lib/types';

export default function ProductScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { products, addToCart } = useStore();
  const [product, setProduct] = useState<Product | null>(products.find((item) => item.slug === slug) || null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState('');
  useEffect(() => {
    let alive = true;
    getProduct(slug).then((value) => { if (alive) setProduct(value); }).catch((cause) => { if (alive) setError(cause instanceof Error ? cause.message : 'This piece could not be loaded.'); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [slug]);
  if (loading) return <LoadingState />;
  if (error || !product) return <ErrorState message={error || 'This piece could not be found.'} />;
  return (
    <ScrollView style={styles.page}>
      <Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={20} color={colors.ink} /><Text style={styles.backText}>Back to collection</Text></Pressable>
      <Animated.View entering={FadeIn.duration(400)}><Image source={{ uri: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=85' }} style={styles.image} /></Animated.View>
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.content}>
        <Text style={styles.kicker}>{product.category?.name || product.brand || 'THE INNTERIOR COLLECTION'}</Text>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{money(product.price)}</Text>
        <View style={styles.rule} />
        <Text style={styles.description}>{product.description || 'A considered piece for a home that feels like yours.'}</Text>
        <View style={styles.specs}><View><Text style={styles.specLabel}>COLOUR</Text><Text style={styles.specValue}>{product.color || 'Natural finish'}</Text></View><View><Text style={styles.specLabel}>MAKER</Text><Text style={styles.specValue}>{product.brand || 'Innterior collection'}</Text></View></View>
        <Pressable style={styles.button} onPress={() => addToCart(product)}><Ionicons name="bag-handle-outline" size={18} color={colors.white} /><Text style={styles.buttonText}>Add to bag</Text><Text style={styles.buttonPrice}>{money(product.price)}</Text></Pressable>
        <View style={styles.delivery}><Ionicons name="cube-outline" size={18} color={colors.forest} /><Text style={styles.deliveryText}>Delivery across Nigeria. Final availability and timing confirmed at checkout.</Text></View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  back: { height: 51, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { color: colors.muted, fontSize: 12 },
  image: { width: '100%', aspectRatio: 0.95, backgroundColor: colors.pale },
  content: { padding: 22, paddingBottom: 35 },
  kicker: { color: colors.clay, fontSize: 10, fontWeight: '800', letterSpacing: 1.8 },
  title: { color: colors.ink, fontSize: 29, lineHeight: 34, fontWeight: '500', marginTop: 10 },
  price: { color: colors.forest, fontSize: 18, fontWeight: '700', marginTop: 10 },
  rule: { height: 1, backgroundColor: colors.line, marginVertical: 19 },
  description: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  specs: { flexDirection: 'row', gap: 60, marginTop: 24, marginBottom: 23 },
  specLabel: { color: colors.muted, fontSize: 9, letterSpacing: 1.5, marginBottom: 6 },
  specValue: { color: colors.ink, fontSize: 13, fontWeight: '600' },
  button: { height: 52, paddingHorizontal: 16, backgroundColor: colors.forest, flexDirection: 'row', alignItems: 'center', gap: 12 },
  buttonText: { color: colors.white, fontSize: 13, fontWeight: '700', flex: 1 },
  buttonPrice: { color: colors.lime, fontSize: 13, fontWeight: '700' },
  delivery: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 17, padding: 13, backgroundColor: '#E8E9DF' },
  deliveryText: { color: colors.muted, fontSize: 11, lineHeight: 17, flex: 1 },
});