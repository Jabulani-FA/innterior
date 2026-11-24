import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { colors } from '../../lib/theme';
import { useStore } from '../../lib/StoreContext';

export default function TabLayout() {
  const { cart } = useStore();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.forest,
      tabBarInactiveTintColor: colors.muted,
      tabBarStyle: { height: 69, paddingTop: 8, paddingBottom: 9, backgroundColor: colors.white, borderTopColor: colors.line },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Discover', tabBarIcon: ({ focused, size }) => <Ionicons name="home-outline" color={focused ? colors.forest : colors.muted} size={size} /> }} />
      <Tabs.Screen name="shop" options={{ title: 'Shop', tabBarIcon: ({ focused, size }) => <Ionicons name="grid-outline" color={focused ? colors.forest : colors.muted} size={size} /> }} />
      <Tabs.Screen name="makers" options={{ title: 'Makers', tabBarIcon: ({ focused, size }) => <Ionicons name="people-outline" color={focused ? colors.forest : colors.muted} size={size} /> }} />
      <Tabs.Screen name="studio" options={{ title: 'Room Studio', tabBarIcon: ({ focused, size }) => <Ionicons name="sparkles-outline" color={focused ? colors.forest : colors.muted} size={size} /> }} />
      <Tabs.Screen name="bag" options={{ title: 'Bag', tabBarBadge: cart.length || undefined, tabBarBadgeStyle: { backgroundColor: colors.clay }, tabBarIcon: ({ focused, size }) => <Ionicons name="bag-handle-outline" color={focused ? colors.forest : colors.muted} size={size} /> }} />
    </Tabs>
  );
}
