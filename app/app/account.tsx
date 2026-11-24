import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, type Auth } from 'firebase/auth';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { API_BASE } from '../lib/api';
import { colors } from '../lib/theme';

const firebaseConfig = {
  apiKey: 'AIzaSyCNziADEr44z-bE-Do0Wbq1AYqLyCR660o',
  authDomain: 'e-commerce-47277.firebaseapp.com',
  projectId: 'e-commerce-47277',
  storageBucket: 'e-commerce-47277.appspot.com',
  messagingSenderId: '679330501220',
  appId: '1:679330501220:web:e29751824657d89ca8c571',
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const nativeAuth: Auth = getAuth(firebaseApp);

export default function AccountScreen() {
  const router = useRouter();
  const [register, setRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (register && !name.trim()) { Alert.alert('Add your name', 'Enter your name to create an account.'); return; }
    if (password.length < 6) { Alert.alert('Check your password', 'Use at least 6 characters.'); return; }
    setBusy(true);
    try {
      const credential = register
        ? await createUserWithEmailAndPassword(nativeAuth, email.trim(), password)
        : await signInWithEmailAndPassword(nativeAuth, email.trim(), password);
      const token = await credential.user.getIdToken();
      const endpoint = register ? '/create-or-update-user' : '/current-user';
      const response = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json', authtoken: token }, body: '{}' });
      if (!response.ok) throw new Error('Your account could not be loaded. Please try again.');
      const profile = await response.json();
      await AsyncStorage.setItem('innterior.session', JSON.stringify({ token, ...profile }));
      Alert.alert(register ? 'Welcome to Innterior' : 'Welcome home', `Signed in as ${profile.name || credential.user.email}.`, [{ text: 'Continue', onPress: () => router.replace('/(tabs)') }]);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message.replace('Firebase: ', '') : 'Sign in could not be completed.';
      Alert.alert(register ? 'Account not created' : 'Sign in failed', message);
    } finally { setBusy(false); }
  };

  return <ScrollView style={styles.page} keyboardShouldPersistTaps="handled"><Pressable onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>‹  Back</Text></Pressable>
    <Animated.View entering={FadeInDown.springify()} style={styles.content}><Text style={styles.kicker}>{register ? 'MAKE YOURSELF AT HOME' : 'WELCOME BACK'}</Text><Text style={styles.title}>{register ? 'A good place to begin.' : 'Good to have you home.'}</Text><Text style={styles.detail}>{register ? 'Create an account and keep the pieces you love close.' : 'Sign in to pick up where your next room begins.'}</Text>
      {register ? <Field label="Your name" value={name} onChangeText={setName} /> : null}<Field label="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" /><Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {!register ? <Link href="/account" style={styles.forgot}>Forgot password? Use the web sign-in to reset your password.</Link> : null}
      <Pressable onPress={submit} disabled={busy} style={[styles.button, busy && styles.disabled]}>{busy ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>{register ? 'Create account' : 'Continue with email'}</Text>}</Pressable>
      <View style={styles.switchLine}><Text style={styles.switchText}>{register ? 'Already with us?' : 'New to Innterior?'}</Text><Pressable onPress={() => setRegister(!register)}><Text style={styles.switchAction}>{register ? ' Sign in' : ' Create an account'}</Text></Pressable></View>
    </Animated.View>
  </ScrollView>;
}

function Field(props: { label: string; value: string; onChangeText: (text: string) => void; keyboardType?: 'default' | 'email-address'; secureTextEntry?: boolean }) {
  return <View style={styles.field}><Text style={styles.label}>{props.label}</Text><TextInput {...props} autoCapitalize={props.keyboardType === 'email-address' ? 'none' : 'words'} autoCorrect={false} placeholderTextColor={colors.muted} style={styles.input} /></View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  back: { height: 55, paddingHorizontal: 20, justifyContent: 'center' },
  backText: { color: colors.muted, fontSize: 13 },
  content: { margin: 18, marginTop: 50, padding: 22, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  kicker: { color: colors.clay, fontSize: 9, fontWeight: '800', letterSpacing: 1.6 },
  title: { color: colors.ink, fontSize: 29, lineHeight: 35, marginTop: 10, fontWeight: '500' },
  detail: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 8, marginBottom: 24 },
  field: { marginBottom: 15 },
  label: { color: colors.ink, fontSize: 11, fontWeight: '600', marginBottom: 7 },
  input: { height: 46, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, color: colors.ink, fontSize: 13 },
  forgot: { color: colors.forest, fontSize: 10, marginTop: -4, marginBottom: 17 },
  button: { height: 49, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center', marginTop: 3 },
  buttonText: { color: colors.white, fontSize: 13, fontWeight: '700' },
  disabled: { opacity: 0.7 },
  switchLine: { flexDirection: 'row', justifyContent: 'center', marginTop: 21 },
  switchText: { color: colors.muted, fontSize: 12 },
  switchAction: { color: colors.forest, fontSize: 12, fontWeight: '700' },
});