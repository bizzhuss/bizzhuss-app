import React from 'react';
import { Tabs } from 'expo-router';
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react-native';
import { useCartStore } from '@/store/useCartStore';

export default function TabLayout() {
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0D9488',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontWeight: '700',
          color: '#0F172A',
        },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Bizzhuss Marketplace',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          headerTitle: 'All Categories',
          tabBarIcon: ({ color, size }) => <LayoutGrid size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          headerTitle: 'My Cart',
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#0D9488',
            color: '#FFFFFF',
            fontSize: 10,
          },
          tabBarIcon: ({ color, size }) => <ShoppingCart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerTitle: 'My Account',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
