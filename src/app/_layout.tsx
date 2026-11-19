import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet } from 'react-native-css-interop';
import { useAuthStore } from '@/store/useAuthStore';

// Ensure dark mode flag is configured for NativeWind class-based mode
if (typeof (StyleSheet as any).setFlag === 'function') {
  (StyleSheet as any).setFlag('darkMode', 'class');
}
if (typeof document !== 'undefined') {
  document.documentElement.style.setProperty('--css-interop-darkMode', 'class dark');
}

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    async function prepare() {
      try {
        await loadUser();
      } catch (e) {
        console.warn('Auth hydration error:', e);
      } finally {
        await SplashScreen.hideAsync().catch(() => {});
      }
    }
    prepare();
  }, [loadUser]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8FAFC' },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[id]"
          options={{
            headerShown: true,
            headerTitle: 'Product Details',
            headerTintColor: '#0D9488',
            headerTitleStyle: { color: '#0F172A', fontWeight: '700' },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="vendor/[id]"
          options={{
            headerShown: true,
            headerTitle: 'Vendor Store',
            headerTintColor: '#0D9488',
            headerTitleStyle: { color: '#0F172A', fontWeight: '700' },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="checkout"
          options={{
            headerShown: true,
            headerTitle: 'Express Checkout',
            headerTintColor: '#0D9488',
            headerTitleStyle: { color: '#0F172A', fontWeight: '700' },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Account Access',
            headerTintColor: '#0D9488',
            headerTitleStyle: { color: '#0F172A', fontWeight: '700' },
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </>
  );
}
