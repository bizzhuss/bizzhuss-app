import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '@/store/useAuthStore';

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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
