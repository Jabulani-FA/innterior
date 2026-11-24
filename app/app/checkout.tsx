import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useStore } from '../lib/StoreContext';
import { colors, money } from '../lib/theme';

export default function CheckoutScreen() {
  const { cart } = useStore();
  const router = useRouter();
  const [review, setReview] = useState(false);
  const [fields, setFields] = useState({ name: '', email: '', phone: '', address: '', city: '', notes: '' });
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.count || 1), 0);
  const update = (key: keyof typeof fields, value: string) => setFields((current) => ({ ...current, [key]: value }));
  const submit = () => {
    if (!fields.name || !fields.email || !fields.phone || !fields.address || !fields.city) { Alert.alert('A few details are missing', 'Please complete your delivery contact and address.'); return; }
    setReview(true);
  };
  if (!cart.length) return <View style={styles.empty}><Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={20} color={colors.ink} /><Text style={styles.backText}>Back to bag</Text></Pressable><Text style={styles.title}>Your bag is empty.</Text><Link href="/(tabs)/shop" style={styles.link}>Browse the collection</Link></View>;
  return (
    <ScrollView style={styles.page} keyboardShouldPersistTaps="handled">
      <Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={20} color={colors.ink} /><Text style={styles.backText}>Edit bag</Text></Pressable>
      <Animated.View entering={FadeInDown.springify()} style={styles.heading}><Text style={styles.kicker}>A FEW DETAILS BEFORE WE ARRANGE DELIVERY</Text><Text style={styles.title}>Review your order.</Text><Text style={styles.description}>The store will confirm availability and delivery details.</Text></Animated.View>
      <Animated.View entering={FadeIn.delay(100)} style={styles.progress}><Text style={styles.progressCurrent}>01  Delivery details</Text><View style={styles.progressLine} /><Text style={review ? styles.progressCurrent : styles.progressIdle}>02  Order review</Text><View style={styles.progressLine} /><Text style={styles.progressIdle}>03  Payment</Text></Animated.View>
      {!review ? <View style={styles.form}><Text style={styles.sectionTitle}>Delivery contact</Text><Text style={styles.formDetail}>We will use these details to confirm your order and delivery.</Text><Field label="Full name" value={fields.name} onChangeText={(value) => update('name', value)} /><Field label="Email address" keyboardType="email-address" value={fields.email} onChangeText={(value) => update('email', value)} /><Field label="Phone number" keyboardType="phone-pad" value={fields.phone} onChangeText={(value) => update('phone', value)} /><Text style={styles.sectionTitle}>Delivery address</Text><Field label="Street address" value={fields.address} onChangeText={(value) => update('address', value)} /><Field label="City" value={fields.city} onChangeText={(value) => update('city', value)} /><Field label="Delivery notes (optional)" value={fields.notes} onChangeText={(value) => update('notes', value)} /></View> : <View style={styles.form}><Text style={styles.sectionTitle}>Delivery details</Text><Text style={styles.formDetail}>{fields.name}\n{fields.email}\n{fields.phone}\n{fields.address}, {fields.city}{fields.notes ? `\n${fields.notes}` : ''}</Text><Pressable onPress={() => setReview(false)} style={styles.edit}><Text style={styles.editText}>Edit delivery details</Text></Pressable><View style={styles.paymentNotice}><Ionicons name="shield-checkmark-outline" size={20} color={colors.forest} /><View style={{ flex: 1 }}><Text style={styles.paymentTitle}>Payment isn't available yet</Text><Text style={styles.note}>Your details have not been sent and no order has been placed.</Text></View></View></View>}
      <View style={styles.summary}><View style={styles.orderLine}><Text style={styles.formDetail}>Items subtotal</Text><Text style={styles.subtotal}>{money(subtotal)}</Text></View><View style={styles.orderLine}><Text style={styles.formDetail}>Delivery</Text><Text style={styles.deliveryValue}>To be confirmed</Text></View><Text style={styles.note}>Delivery cost and timing will be confirmed for your location before payment.</Text>{!review ? <Pressable onPress={submit} style={styles.button}><Text style={styles.buttonText}>Review order</Text><Ionicons name="arrow-forward" size={16} color={colors.white} /></Pressable> : <View style={[styles.button, styles.buttonDisabled]}><Ionicons name="lock-closed-outline" size={16} color={colors.muted} /><Text style={styles.disabledText}>Payment setup required</Text></View>}</View>
    </ScrollView>
  );
}

function Field(props: { label: string; value: string; onChangeText: (value: string) => void; keyboardType?: 'default' | 'email-address' | 'phone-pad' }) {
  return <View style={styles.field}><Text style={styles.label}>{props.label}</Text><TextInput {...props} placeholderTextColor={colors.muted} style={styles.input} autoCapitalize={props.keyboardType === 'email-address' ? 'none' : 'words'} /></View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  back: { height: 49, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { color: colors.muted, fontSize: 12 },
  heading: { paddingHorizontal: 22, paddingTop: 13, paddingBottom: 18 },
  kicker: { color: colors.clay, fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: colors.ink, fontSize: 29, fontWeight: '500', marginTop: 8 },
  description: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 8 },
  progress: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: colors.white, gap: 5 },
  progressCurrent: { color: colors.forest, fontSize: 9, fontWeight: '800' },
  progressIdle: { color: colors.muted, fontSize: 9 },
  progressLine: { flex: 1, height: 1, backgroundColor: colors.line },
  form: { margin: 17, padding: 17, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '600', marginBottom: 4 },
  formDetail: { color: colors.muted, fontSize: 12, lineHeight: 18, marginBottom: 15 },
  field: { marginBottom: 13 },
  label: { color: colors.ink, fontSize: 11, fontWeight: '600', marginBottom: 6 },
  input: { height: 44, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 11, color: colors.ink, fontSize: 13 },
  orderLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9, borderTopWidth: 1, borderTopColor: colors.line },
  orderName: { color: colors.ink, fontSize: 12, flex: 1, paddingRight: 8 },
  orderPrice: { color: colors.ink, fontSize: 12, fontWeight: '600' },
  edit: { alignSelf: 'flex-start', paddingVertical: 9 },
  editText: { color: colors.forest, fontSize: 11, fontWeight: '700' },
  paymentNotice: { flexDirection: 'row', gap: 10, backgroundColor: '#EAF0E9', padding: 12, alignItems: 'flex-start' },
  paymentTitle: { color: colors.ink, fontSize: 12, fontWeight: '700', marginBottom: 3 },
  deliveryValue: { color: colors.muted, fontSize: 11 },
  summary: { marginHorizontal: 17, marginBottom: 28, padding: 17, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  subtotal: { color: colors.ink, fontSize: 17, fontWeight: '700' },
  note: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 10, marginBottom: 15 },
  button: { height: 49, backgroundColor: colors.forest, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 11 },
  buttonText: { color: colors.white, fontSize: 13, fontWeight: '700' },
  buttonDisabled: { backgroundColor: '#ECECE7' },
  disabledText: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.paper, gap: 12 },
  link: { color: colors.forest, fontWeight: '700' },
});