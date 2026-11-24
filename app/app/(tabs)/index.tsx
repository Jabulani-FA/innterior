import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ErrorState, LoadingState, ProductGrid } from '../../components/StoreUI';
import { useStore } from '../../lib/StoreContext';
import { colors } from '../../lib/theme';

const heroImage = 'https://images.pexels.com/photos/5998120/pexels-photo-5998120.jpeg?auto=compress&cs=tinysrgb&w=1400';

export default function HomeScreen() {
  const { products, loading, error, refresh } = useStore();
  const router = useRouter();
  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.topbar}><Text style={styles.brand}>innterior®</Text><Pressable onPress={() => router.push('/account')} style={styles.profile}><Ionicons name="person-outline" size={20} color={colors.ink} /></Pressable></View>
      <Animated.View entering={FadeIn.duration(700)} style={styles.heroWrap}>
        <ImageBackground source={{ uri: heroImage }} imageStyle={styles.heroImage} style={styles.hero}>
          <View style={styles.heroShade} />
          <Animated.View entering={FadeInDown.delay(180).springify()} style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>A HOME, MORE YOU</Text>
            <Text style={styles.heroTitle}>Make room for<Text style={styles.heroItalic}> better living.</Text></Text>
            <Text style={styles.heroDetail}>Thoughtful furniture and finishing touches for the spaces you call your own.</Text>
            <Pressable style={styles.heroButton} onPress={() => router.push('/shop')}><Text style={styles.heroButtonText}>Explore the collection</Text><Ionicons name="arrow-forward" size={17} color={colors.ink} /></Pressable>
          </Animated.View>
          <Text style={styles.photoCaption}>SPACES FOR LIVING, MADE TO LAST</Text>
        </ImageBackground>
      </Animated.View>
      <View style={styles.serviceRow}><Text style={styles.serviceText}>Considered design</Text><Text style={styles.serviceText}>Pieces for everyday</Text><Text style={styles.serviceText}>Across Nigeria</Text></View>
      <View style={styles.sectionHead}><View><Text style={styles.kicker}>THE EDIT</Text><Text style={styles.sectionTitle}>New to the collection</Text></View><Link href="/shop" style={styles.link}>View all <Ionicons name="arrow-forward" size={14} /></Link></View>
      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={refresh} /> : products.length ? <ProductGrid products={products.slice(0, 4)} /> : <Text style={styles.empty}>The collection is taking a moment. Check back shortly.</Text>}
      <Pressable style={styles.studioBanner} onPress={() => router.push('/studio')}>
        <View style={styles.studioIcon}><Ionicons name="sparkles" size={20} color={colors.forest} /></View>
        <View style={{ flex: 1 }}><Text style={styles.kicker}>YOUR SPACE, REIMAGINED</Text><Text style={styles.studioTitle}>Meet your room's next chapter.</Text></View>
        <Ionicons name="arrow-forward" size={20} color={colors.forest} />
      </Pressable>
      <View style={styles.footerSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  topbar: { height: 57, marginHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { color: colors.ink, fontSize: 23, fontWeight: '700' },
  profile: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  heroWrap: { paddingHorizontal: 12 },
  hero: { height: 480, justifyContent: 'flex-end', overflow: 'hidden', backgroundColor: colors.forest },
  heroImage: { borderRadius: 5 },
  heroShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(16,28,24,0.38)' },
  heroCopy: { paddingHorizontal: 25, paddingBottom: 54 },
  heroEyebrow: { color: colors.lime, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 13 },
  heroTitle: { color: colors.white, fontSize: 39, lineHeight: 43, fontWeight: '500', maxWidth: 300 },
  heroItalic: { fontStyle: 'italic', fontWeight: '400' },
  heroDetail: { color: '#E4E9E5', fontSize: 14, lineHeight: 21, marginTop: 13, maxWidth: 285 },
  heroButton: { marginTop: 23, backgroundColor: colors.lime, height: 48, paddingHorizontal: 16, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 17 },
  heroButtonText: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  photoCaption: { position: 'absolute', bottom: 17, right: 15, color: colors.white, fontSize: 8, letterSpacing: 1.6 },
  serviceRow: { marginTop: 16, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: colors.line, marginHorizontal: 21, flexDirection: 'row', justifyContent: 'space-between' },
  serviceText: { color: colors.muted, fontSize: 9 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 22, paddingTop: 28, paddingBottom: 14 },
  kicker: { color: colors.clay, fontSize: 9, fontWeight: '800', letterSpacing: 1.7, marginBottom: 7 },
  sectionTitle: { color: colors.ink, fontSize: 23, fontWeight: '500' },
  link: { color: colors.forest, fontSize: 12, fontWeight: '700' },
  empty: { color: colors.muted, padding: 24, textAlign: 'center' },
  studioBanner: { marginHorizontal: 19, backgroundColor: '#E7E9D8', padding: 17, flexDirection: 'row', alignItems: 'center', gap: 13, borderRadius: 4 },
  studioIcon: { width: 38, height: 38, backgroundColor: colors.lime, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  studioTitle: { color: colors.ink, fontSize: 17, fontWeight: '600' },
  footerSpace: { height: 35 },
});
