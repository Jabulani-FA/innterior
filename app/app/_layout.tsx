import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StoreProvider } from '../lib/StoreContext';
import { colors } from '../lib/theme';

export default function RootLayout() {
  return (
    <StoreProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper }, animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[slug]" options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="checkout" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="account" options={{ animation: 'fade_from_bottom' }} />
      </Stack>
    </StoreProvider>
  );
}
