import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ErrorState, ProductGrid, ScreenTitle } from '../../components/StoreUI';
import { createRoomDesign } from '../../lib/api';
import { useStore } from '../../lib/StoreContext';
import { colors, money } from '../../lib/theme';
import type { RoomDesign } from '../../lib/types';

const rooms = ['Living room', 'Bedroom', 'Dining room', 'Home office'];
const stylesList = ['Warm minimal', 'Modern organic', 'Afro-modern', 'Quiet classic'];
const budgets = [100000, 250000, 500000, 1000000];

export default function StudioScreen() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [room, setRoom] = useState(rooms[0]);
  const [designStyle, setDesignStyle] = useState(stylesList[0]);
  const [budget, setBudget] = useState(250000);
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<RoomDesign | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { addToCart } = useStore();

  const choosePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert('Photo access needed', 'Allow photo library access to choose a room photo.'); return; }
    const selection = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.86, allowsEditing: true });
    if (!selection.canceled) { setPhoto(selection.assets[0].uri); setResult(null); setError(''); }
  };

  const generate = async () => {
    if (!photo) { Alert.alert('Add a room photo', 'Choose a photo of your room to begin.'); return; }
    if (budget < 5000) { Alert.alert('Review your budget', 'Choose a budget of at least ₦5,000.'); return; }
    setBusy(true); setError(''); setResult(null);
    try { setResult(await createRoomDesign(photo, room, designStyle, budget, notes)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'We could not create your room design.'); }
    finally { setBusy(false); }
  };

  if (result) return <ScrollView style={styles.page}><Animated.View entering={FadeIn.duration(450)}>
    <ScreenTitle kicker="YOUR ROOM, REIMAGINED" title={result.summary} detail={result.palette} />
    <View style={styles.beforeAfter}><View style={styles.imagePanel}><Text style={styles.imageLabel}>YOUR ROOM</Text><Image source={{ uri: photo || undefined }} style={styles.roomImage} /></View><View style={styles.imagePanel}><Text style={styles.imageLabel}>THE NEW DIRECTION</Text><Image source={{ uri: result.image }} style={styles.roomImage} /></View></View>
    <View style={styles.budgetBar}><View><Text style={styles.budgetLabel}>YOUR BUDGET</Text><Text style={styles.budgetValue}>{money(result.budget)}</Text></View><View><Text style={styles.budgetLabel}>SELECTED PIECES</Text><Text style={styles.budgetValue}>{money(result.total)}</Text></View><View><Text style={styles.budgetLabel}>LEFT TO SPEND</Text><Text style={styles.budgetValue}>{money(result.remaining)}</Text></View></View>
    <View style={styles.resultHead}><Text style={styles.resultTitle}>Bring the look home</Text><Text style={styles.resultCount}>{result.products.length} pieces</Text></View>
    {result.products.length ? <ProductGrid products={result.products} /> : <Text style={styles.noProducts}>No catalogue pieces matched this brief. Try another budget or room direction.</Text>}
    <View style={styles.resultActions}><Pressable style={styles.outlineButton} onPress={() => { result.products.forEach(addToCart); Alert.alert('Added to your bag', `${result.products.length} design pieces are ready to review.`); }}><Text style={styles.outlineText}>Add all pieces to bag</Text></Pressable><Pressable onPress={() => setResult(null)} style={styles.reset}><Ionicons name="refresh" size={16} color={colors.forest} /><Text style={styles.resetText}>Start another room</Text></Pressable></View>
  </Animated.View></ScrollView>;

  return <ScrollView style={styles.page} keyboardShouldPersistTaps="handled">
    <ScreenTitle kicker="INNTERIOR ROOM STUDIO" title="See the room you could come home to." detail="Share a room photo, set your spend, and explore a refreshed space shaped around real pieces from our collection." />
    <View style={styles.form}>
      <Animated.View entering={FadeInDown.springify()}>
        <Text style={styles.label}>01  START WITH YOUR SPACE</Text>
        <Pressable style={[styles.photoBox, photo && styles.photoSelected]} onPress={choosePhoto}>
          {photo ? <Image source={{ uri: photo }} style={styles.photo} /> : <><Ionicons name="cloud-upload-outline" size={31} color={colors.forest} /><Text style={styles.photoTitle}>Choose a room photo</Text><Text style={styles.photoHint}>JPG, PNG, or WebP · up to 8 MB</Text></>}
          <Text style={styles.photoAction}>{photo ? 'Change photo' : 'Browse photos'}</Text>
        </Pressable>
        <Text style={styles.label}>02  CHOOSE YOUR ROOM</Text>
        <View style={styles.chips}>{rooms.map((item) => <Chip key={item} value={item} active={room === item} onPress={() => setRoom(item)} />)}</View>
        <Text style={styles.label}>03  PICK A DIRECTION</Text>
        <View style={styles.chips}>{stylesList.map((item) => <Chip key={item} value={item} active={designStyle === item} onPress={() => setDesignStyle(item)} />)}</View>
        <Text style={styles.label}>YOUR BUDGET</Text>
        <View style={styles.chips}>{budgets.map((item) => <Chip key={item} value={money(item)} active={budget === item} onPress={() => setBudget(item)} />)}</View>
        <Text style={styles.label}>ANYTHING ELSE WE SHOULD KNOW?</Text>
        <TextInput value={notes} onChangeText={setNotes} placeholder="Materials, colours, or details to keep in mind" placeholderTextColor={colors.muted} multiline style={styles.notes} />
        {error ? <View style={styles.error}><ErrorState message={error} /></View> : null}
        <Pressable style={[styles.generate, busy && styles.disabled]} onPress={generate} disabled={busy}>{busy ? <><ActivityIndicator color={colors.white} /><Text style={styles.generateText}>Imagining your space...</Text></> : <><Ionicons name="sparkles" size={17} color={colors.white} /><Text style={styles.generateText}>Reimagine my room</Text><Ionicons name="arrow-forward" size={16} color={colors.white} /></>}</Pressable>
        <Text style={styles.disclaimer}>The room image is an AI concept. Product availability and exact appearance may vary.</Text>
      </Animated.View>
    </View>
  </ScrollView>;
}

function Chip({ value, active, onPress }: { value: string; active: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}><Text style={[styles.chipText, active && styles.chipTextActive]}>{value}</Text></Pressable>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  form: { marginHorizontal: 18, marginBottom: 28, padding: 17, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  label: { color: colors.ink, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginTop: 16, marginBottom: 11 },
  photoBox: { minHeight: 168, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line, backgroundColor: '#F7F7F2', alignItems: 'center', justifyContent: 'center', padding: 12 },
  photoSelected: { padding: 0, borderStyle: 'solid' },
  photo: { width: '100%', height: 190 },
  photoTitle: { color: colors.ink, fontSize: 14, fontWeight: '700', marginTop: 9 },
  photoHint: { color: colors.muted, fontSize: 10, marginTop: 5 },
  photoAction: { color: colors.forest, fontSize: 11, fontWeight: '700', marginTop: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: { borderWidth: 1, borderColor: colors.line, paddingHorizontal: 11, paddingVertical: 9, borderRadius: 18 },
  chipActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  chipText: { color: colors.muted, fontSize: 10, fontWeight: '600' },
  chipTextActive: { color: colors.white },
  notes: { minHeight: 78, borderWidth: 1, borderColor: colors.line, padding: 11, textAlignVertical: 'top', color: colors.ink, fontSize: 12 },
  generate: { height: 49, backgroundColor: colors.forest, marginTop: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 11 },
  generateText: { color: colors.white, fontSize: 13, fontWeight: '700' },
  disabled: { opacity: 0.7 },
  disclaimer: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 12, textAlign: 'center' },
  error: { backgroundColor: colors.paper, marginTop: 12 },
  beforeAfter: { flexDirection: 'row', gap: 9, marginHorizontal: 16 },
  imagePanel: { flex: 1 },
  imageLabel: { color: colors.muted, fontSize: 9, letterSpacing: 1, marginBottom: 6 },
  roomImage: { width: '100%', aspectRatio: 0.8, backgroundColor: colors.pale },
  budgetBar: { margin: 16, backgroundColor: colors.white, padding: 14, flexDirection: 'row', justifyContent: 'space-between' },
  budgetLabel: { color: colors.muted, fontSize: 8, letterSpacing: 1 },
  budgetValue: { color: colors.ink, fontSize: 11, fontWeight: '700', marginTop: 5 },
  resultHead: { paddingHorizontal: 21, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultTitle: { color: colors.ink, fontSize: 19, fontWeight: '600' },
  resultCount: { color: colors.muted, fontSize: 11 },
  noProducts: { color: colors.muted, padding: 20 },
  resultActions: { marginHorizontal: 18, marginBottom: 30, gap: 12 },
  outlineButton: { height: 48, backgroundColor: colors.forest, justifyContent: 'center', alignItems: 'center' },
  outlineText: { color: colors.white, fontSize: 13, fontWeight: '700' },
  reset: { height: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7 },
  resetText: { color: colors.forest, fontSize: 12, fontWeight: '700' },
});