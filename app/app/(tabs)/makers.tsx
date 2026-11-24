import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ErrorState, LoadingState, ScreenTitle } from '../../components/StoreUI';
import { getMakers } from '../../lib/api';
import { colors, money } from '../../lib/theme';
import type { Maker } from '../../lib/types';

export default function MakersScreen() {
  const [kind, setKind] = useState<'talents' | 'vendors'>('talents');
  const [vendors, setVendors] = useState<Maker[]>([]);
  const [talents, setTalents] = useState<Maker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([getMakers('vendors'), getMakers('talents')]).then(([shopData, talentData]) => { setVendors(shopData); setTalents(talentData); }).catch((cause) => setError(cause instanceof Error ? cause.message : 'Makers could not be loaded.')).finally(() => setLoading(false));
  }, []);
  const list = kind === 'vendors' ? vendors : talents;
  return (
    <ScrollView style={styles.page}>
      <ScreenTitle kicker="THE PEOPLE BEHIND THE PIECES" title="Meet the makers." detail="Discover verified home retailers and interior design professionals in the Innterior community." />
      <View style={styles.switcher}>{(['talents', 'vendors'] as const).map((option) => <Pressable key={option} onPress={() => setKind(option)} style={[styles.switchButton, kind === option && styles.switchActive]}><Ionicons name={option === 'vendors' ? 'storefront-outline' : 'people-outline'} size={16} color={kind === option ? colors.white : colors.muted} /><Text style={[styles.switchText, kind === option && styles.switchTextActive]}>{option === 'vendors' ? 'Vendors' : 'Design talent'}</Text><Text style={[styles.switchCount, kind === option && styles.switchTextActive]}>{option === 'vendors' ? vendors.length : talents.length}</Text></Pressable>)}</View>
      {loading ? <LoadingState label="Finding verified makers..." /> : error ? <ErrorState message={error} /> : list.length ? <View style={styles.list}>{list.map((maker, index) => <Animated.View entering={FadeInDown.delay(index * 70).springify()} style={styles.card} key={maker._id}>
        <View style={styles.cardTop}><Text style={styles.verified}><Ionicons name="checkmark-circle" size={12} color={colors.forest} /> VERIFIED</Text><Ionicons name={kind === 'vendors' ? 'storefront-outline' : 'color-palette-outline'} size={19} color={colors.forest} /></View>
        <Text style={styles.name}>{kind === 'vendors' ? maker.shopName : maker.displayName}</Text>
        <Text style={styles.location}><Ionicons name="location-outline" size={13} /> {maker.serviceArea || 'Nigeria'}</Text>
        <Text style={styles.description}>{maker.description || (kind === 'vendors' ? 'A verified Innterior marketplace shop.' : 'A verified interior design professional.')}</Text>
        <View style={styles.tags}>{(kind === 'vendors' ? maker.productTypes : maker.specialties)?.slice(0, 4).map((tag) => <Text key={tag} style={styles.tag}>{tag}</Text>)}</View>
        {kind === 'talents' && maker.startingPrice ? <Text style={styles.starting}>Projects from {money(maker.startingPrice)}</Text> : null}
      </Animated.View>)}</View> : <View style={styles.empty}><Ionicons name="people-outline" size={29} color={colors.muted} /><Text style={styles.emptyTitle}>No verified {kind} just yet.</Text><Text style={styles.description}>Approved community profiles will appear here.</Text></View>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  switcher: { marginHorizontal: 19, flexDirection: 'row', backgroundColor: '#E8E7DF', padding: 4, marginBottom: 15 },
  switchButton: { flex: 1, height: 41, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  switchActive: { backgroundColor: colors.forest },
  switchText: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  switchTextActive: { color: colors.white },
  switchCount: { color: colors.muted, fontSize: 10 },
  list: { paddingHorizontal: 19, paddingBottom: 30, gap: 12 },
  card: { backgroundColor: colors.white, padding: 18, borderWidth: 1, borderColor: colors.line },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  verified: { color: colors.forest, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  name: { color: colors.ink, fontSize: 21, fontWeight: '600' },
  location: { color: colors.muted, fontSize: 12, marginTop: 7 },
  description: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 12 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 13 },
  tag: { color: colors.forest, backgroundColor: '#EAF0E9', paddingHorizontal: 9, paddingVertical: 5, fontSize: 10 },
  starting: { color: colors.ink, fontSize: 12, fontWeight: '700', marginTop: 14 },
  empty: { alignItems: 'center', padding: 40, gap: 10 },
  emptyTitle: { color: colors.ink, fontSize: 17, fontWeight: '600' },
});