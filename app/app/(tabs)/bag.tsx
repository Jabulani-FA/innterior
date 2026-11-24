import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { ScreenTitle } from '../../components/StoreUI';
import { useStore } from '../../lib/StoreContext';
import { colors, money } from '../../lib/theme';

export default function BagScreen() {
  const { cart, changeQuantity, removeFromCart } = useStore();
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.count || 1), 0);
  return (
    <ScrollView style={styles.page}>
      <ScreenTitle kicker="YOUR SELECTION" title="Shopping bag" detail={`${cart.length} ${cart.length === 1 ? 'piece' : 'pieces'} selected`} />
      {!cart.length ? <View style={styles.empty}><View style={styles.emptyIcon}><Ionicons name="bag-handle-outline" size={24} color={colors.forest} /></View><Text style={styles.emptyTitle}>Your bag is taking a breather.</Text><Text style={styles.emptyDetail}>Browse considered furniture and finishing touches for your home.</Text><Link href="/shop" asChild><Pressable style={styles.primary}><Text style={styles.primaryText}>Explore the collection</Text><Ionicons name="arrow-forward" size={16} color={colors.white} /></Pressable></Link></View> : <>
        <View style={styles.items}>{cart.map((item, index) => <Animated.View key={item._id} entering={FadeInDown.delay(index * 70).springify()} layout={Layout.springify()} style={styles.item}>
          <Image source={{ uri: item.images?.[0]?.url || 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80' }} style={styles.image} />
          <View style={styles.info}><Text style={styles.category}>{item.category?.name || 'HOME COLLECTION'}</Text><Text style={styles.name}>{item.title}</Text><Text style={styles.price}>{money(item.price)}</Text><View style={styles.actions}><View style={styles.quantity}><Pressable onPress={() => changeQuantity(item._id, -1)}><Ionicons name="remove" size={16} color={colors.ink} /></Pressable><Text style={styles.quantityText}>{item.count || 1}</Text><Pressable onPress={() => changeQuantity(item._id, 1)}><Ionicons name="add" size={16} color={colors.ink} /></Pressable></View><Pressable onPress={() => removeFromCart(item._id)} accessibilityLabel={`Remove ${item.title}`}><Ionicons name="trash-outline" size={17} color={colors.muted} /></Pressable></View></View>
          <Text style={styles.total}>{money(item.price * (item.count || 1))}</Text>
        </Animated.View>)}</View>
        <View style={styles.summary}><View style={styles.summaryLine}><Text style={styles.subtotalLabel}>Subtotal</Text><Text style={styles.subtotal}>{money(subtotal)}</Text></View><Text style={styles.shipping}>Delivery details and availability are confirmed at checkout.</Text><Link href="/checkout" asChild><Pressable style={styles.primary}><Text style={styles.primaryText}>Continue to delivery</Text><Ionicons name="arrow-forward" size={16} color={colors.white} /></Pressable></Link></View>
      </>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  empty: { minHeight: 390, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34, gap: 12 },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E7E9D8', alignItems: 'center', justifyContent: 'center', marginBottom: 3 },
  emptyTitle: { color: colors.ink, fontSize: 21, fontWeight: '600', textAlign: 'center' },
  emptyDetail: { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 8 },
  items: { paddingHorizontal: 18 },
  item: { flexDirection: 'row', gap: 12, paddingVertical: 15, borderTopWidth: 1, borderTopColor: colors.line },
  image: { width: 86, height: 105, backgroundColor: colors.pale },
  info: { flex: 1, paddingVertical: 2 },
  category: { color: colors.muted, fontSize: 9, letterSpacing: 1 },
  name: { color: colors.ink, fontSize: 14, fontWeight: '600', marginTop: 5 },
  price: { color: colors.forest, fontSize: 12, fontWeight: '700', marginTop: 6 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 18, marginTop: 14 },
  quantity: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.line, height: 29, gap: 13, paddingHorizontal: 7 },
  quantityText: { color: colors.ink, fontSize: 12, minWidth: 9, textAlign: 'center' },
  total: { color: colors.ink, fontSize: 12, fontWeight: '700', paddingTop: 4 },
  summary: { marginHorizontal: 19, marginTop: 10, padding: 17, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, marginBottom: 28 },
  summaryLine: { flexDirection: 'row', justifyContent: 'space-between' },
  subtotalLabel: { color: colors.ink, fontSize: 14 },
  subtotal: { color: colors.ink, fontSize: 17, fontWeight: '700' },
  shipping: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 10, marginBottom: 17 },
  primary: { height: 49, backgroundColor: colors.forest, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  primaryText: { color: colors.white, fontSize: 13, fontWeight: '700' },
});