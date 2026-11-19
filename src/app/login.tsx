import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LogIn, UserPlus, Sparkles, Store, User } from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { setAuthToken } from '@/api/client';

export default function LoginScreen() {
  const router = useRouter();
  const { login, register, setUser, error, clearError } = useAuthStore();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      if (authMode === 'login') {
        await login({ email, password });
      } else {
        await register({
          name: name.trim() || 'Bizzhuss Shopper',
          email: email.trim(),
          password,
          password_confirmation: password,
          phone: phone.trim() || undefined,
        });
      }
      router.back();
    } catch {
      // Handled in store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: 'customer' | 'vendor' = 'customer') => {
    setIsSubmitting(true);
    try {
      const demoToken = '1|sanctum_mock_bearer_token_' + Date.now();
      await setAuthToken(demoToken);
      setUser({
        id: role === 'vendor' ? 101 : 1,
        name: role === 'vendor' ? 'Al-Karam Studio (Vendor)' : 'Haseeb Khan',
        email: role === 'vendor' ? 'vendor@bizzhuss.pk' : 'haseeb@bizzhuss.pk',
        phone: '+92 300 1234567',
        role,
        avatar: null,
        created_at: new Date().toISOString(),
      });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 px-5 pt-4" showsVerticalScrollIndicator={false}>
      {/* Switcher Tab */}
      <View className="flex-row bg-slate-200/80 p-1 rounded-2xl mb-5">
        <TouchableOpacity
          onPress={() => { setAuthMode('login'); clearError(); }}
          className={`flex-1 py-2.5 rounded-xl items-center ${authMode === 'login' ? 'bg-white shadow-sm' : ''}`}>
          <Text className={`text-xs font-bold ${authMode === 'login' ? 'text-teal-700' : 'text-slate-600'}`}>
            Sign In
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setAuthMode('register'); clearError(); }}
          className={`flex-1 py-2.5 rounded-xl items-center ${authMode === 'register' ? 'bg-white shadow-sm' : ''}`}>
          <Text className={`text-xs font-bold ${authMode === 'register' ? 'text-teal-700' : 'text-slate-600'}`}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Form Card */}
      <View className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-5">
        <Text className="text-slate-900 font-black text-xl mb-1">
          {authMode === 'login' ? 'Welcome Back' : 'Join Bizzhuss'}
        </Text>
        <Text className="text-slate-500 text-xs mb-5">
          {authMode === 'login'
            ? 'Sign in to track orders, manage addresses, or access your vendor portal.'
            : 'Register to start shopping verified Pakistani products or launch your store.'}
        </Text>

        {error && (
          <View className="bg-rose-50 border border-rose-200 p-3 rounded-xl mb-4">
            <Text className="text-rose-700 text-xs font-semibold">{error}</Text>
          </View>
        )}

        {authMode === 'register' && (
          <>
            <View className="mb-3">
              <Text className="text-slate-700 font-semibold text-xs mb-1.5">Full Name</Text>
              <TextInput
                placeholder="e.g. Haseeb Khan"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs"
              />
            </View>

            <View className="mb-3">
              <Text className="text-slate-700 font-semibold text-xs mb-1.5">Phone Number (Optional)</Text>
              <TextInput
                placeholder="+92 300 0000000"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs"
              />
            </View>
          </>
        )}

        <View className="mb-3">
          <Text className="text-slate-700 font-semibold text-xs mb-1.5">Email Address</Text>
          <TextInput
            placeholder="you@domain.com"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs"
          />
        </View>

        <View className="mb-5">
          <Text className="text-slate-700 font-semibold text-xs mb-1.5">Password</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs"
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
          className="bg-teal-600 rounded-xl py-3.5 items-center flex-row justify-center shadow-sm">
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              {authMode === 'login' ? <LogIn size={16} color="#FFFFFF" /> : <UserPlus size={16} color="#FFFFFF" />}
              <Text className="text-white font-black text-xs ml-2 uppercase tracking-wide">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Developer / Testing Instant Access */}
      <View className="bg-slate-100 rounded-2xl p-4 mb-10 border border-slate-200/80">
        <View className="flex-row items-center mb-1">
          <Sparkles size={14} color="#0D9488" />
          <Text className="text-slate-800 font-bold text-xs ml-1.5">Quick Demo Login (Sanctum Ready)</Text>
        </View>
        <Text className="text-slate-500 text-[11px] mb-3">
          Instantly simulate a verified Pakistani customer or vendor account:
        </Text>

        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={() => handleDemoLogin('customer')}
            className="flex-1 bg-white border border-slate-300 py-2.5 rounded-xl flex-row items-center justify-center mr-2 shadow-2xs">
            <User size={14} color="#0D9488" />
            <Text className="text-teal-700 font-bold text-xs ml-1.5">Demo Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDemoLogin('vendor')}
            className="flex-1 bg-white border border-slate-300 py-2.5 rounded-xl flex-row items-center justify-center shadow-2xs">
            <Store size={14} color="#D97706" />
            <Text className="text-amber-700 font-bold text-xs ml-1.5">Demo Vendor</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
