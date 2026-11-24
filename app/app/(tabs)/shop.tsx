import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ErrorState, LoadingState, ProductGrid, ScreenTitle } from '../../components/StoreUI';
import { searchProducts } from '../../lib/api';
import { useStore } from '../../lib/StoreContext';
import { colors } from '../../lib/theme';
import type { Product } from '../../lib/types';

const filters = ['All pieces', 'Living', 'Bedroom', 'Lighting', 'Decor'];

export default function ShopScreen() {
  const { products: allProducts, loading, error, refresh } = useStore();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('All pieces');
  const [results, setResults] = useState<Product[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (!query.trim()) { setResults(null); setSearchError(''); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try { setResults(await searchProducts(query.trim())); setSearchError(''); }
      catch { setSearchError('Search is unavailable right now.'); }
      finally { setSearching(false); }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  const source = results || allProducts;
  const shown = active === 'All pieces' ? source : source.filter((item) => `${item.title} ${item.category?.name || ''}`.toLowerCase().includes(active.toLowerCase().replace(' pieces', '')));
  return (
    <ScrollView style={styles.page} keyboardShouldPersistTaps="handled">
      <ScreenTitle kicker="THE INNTERIOR COLLECTION" title="Find your piece." detail="Considered furniture and finishing touches for everyday living." />
      <View style={styles.search}><Ionicons name="search" size={19} color={colors.muted} /><TextInput value={query} onChangeText={setQuery} placeholder="Search furniture, lighting, decor" placeholderTextColor={colors.muted} style={styles.input} returnKeyType="search" /><Pressable onPress={() => setQuery('')}><Ionicons name="close-circle" size={18} color={colors.muted} /></Pressable></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>{filters.map((filter) => <Pressable key={filter} onPress={() => setActive(filter)} style={[styles.filter, active === filter && styles.filterActive]}><Text style={[styles.filterText, active === filter && styles.filterTextActive]}>{filter}</Text></Pressable>)}</ScrollView>
      <Text style={styles.count}>{shown.length} {shown.length === 1 ? 'piece' : 'pieces'} to explore</Text>
      {searching || loading ? <LoadingState label="Looking through the collection..." /> : searchError ? <ErrorState message={searchError} /> : error && !allProducts.length ? <ErrorState message={error} onRetry={refresh} /> : shown.length ? <ProductGrid products={shown} /> : <View style={styles.empty}><Ionicons name="search-outline" size={30} color={colors.muted} /><Text style={styles.emptyTitle}>Nothing in this corner yet.</Text><Text style={styles.emptyDetail}>Try another search or explore all pieces.</Text></View>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  search: { height: 48, marginHorizontal: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, color: colors.ink, fontSize: 13 },
  filters: { paddingHorizontal: 20, paddingVertical: 16, gap: 8 },
  filter: { borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14, height: 34, justifyContent: 'center', borderRadius: 17 },
  filterActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  filterText: { color: colors.muted, fontSize: 11, fontWeight: '600' },
  filterTextActive: { color: colors.white },
  count: { color: colors.muted, fontSize: 11, marginLeft: 21, marginBottom: 12 },
  empty: { alignItems: 'center', paddingVertical: 65, gap: 10 },
  emptyTitle: { color: colors.ink, fontSize: 19, fontWeight: '600' },
  emptyDetail: { color: colors.muted, fontSize: 13 },
});