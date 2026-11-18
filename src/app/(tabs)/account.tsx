import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import {
  User as UserIcon,
  Package,
  MapPin,
  CreditCard,
  Store,
  ShieldCheck,
  LogOut,
  ChevronRight,
  LogIn,
  UserPlus,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { setAuthToken } from '@/api/client';

export default function AccountScreen() {
  const { user, isAuthenticated, isLoading, login, register, logout, setUser, error, clearError } = useAuthStore();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuthSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Required Fields', 'Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      if (authMode === 'login') {
        await login({ email, password });
      } else {
        await register({
          name: name || 'Bizzhuss Shopper',
          email,
          password,
          password_confirmation: password,
        });
      }
    } catch (err: any) {
      // Error handled in store
    } finally {
      setIsSubmitting(false);
    }
  };

  // Instant demo login for local development / testing without requiring live Sanctum server
  const handleQuickDemoLogin = async (role: 'customer' | 'vendor' = 'customer') => {
    setIsSubmitting(true);
    try {
      const demoToken = '1|sanctum_mock_bearer_token_bizzhuss_' + Date.now();
      await setAuthToken(demoToken);
      setUser({
        id: role === 'vendor' ? 101 : 1,
        name: role === 'vendor' ? 'Haseeb (Vendor)' : 'Haseeb Shopper',
        email: role === 'vendor' ? 'vendor@bizzhuss.com' : 'shopper@bizzhuss.com',
        phone: '+1 555-0199',
        role,
        avatar: null,
        created_at: new Date().toISOString(),
      });
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0D9488" />
        <Text className="text-slate-500 text-xs mt-3">Connecting to Bizzhuss...</Text>
      </View>
    );
  }

  // Authenticated State View
  if (isAuthenticated && user) {
    return (
      <ScrollView className="flex-1 bg-slate-50 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-4">
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-teal-600 items-center justify-center">
              <Text className="text-white text-xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View className="ml-4 flex-1">
              <View className="flex-row items-center">
                <Text className="text-slate-900 font-bold text-base">{user.name}</Text>
                <View className="bg-teal-50 px-2 py-0.5 rounded-full ml-2 border border-teal-200">
                  <Text className="text-teal-700 text-[10px] font-bold uppercase">
                    {user.role}
                  </Text>
                </View>
              </View>
              <Text className="text-slate-500 text-xs mt-0.5">{user.email}</Text>
              {user.phone && <Text className="text-slate-400 text-[11px] mt-0.5">{user.phone}</Text>}
            </View>
          </View>
        </View>

        {/* Multi-Vendor Options */}
        {user.role === 'vendor' && (
          <View className="bg-amber-50 rounded-2xl p-4 mb-4 border border-amber-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Store size={20} color="#D97706" />
                <View className="ml-3">
                  <Text className="text-amber-900 font-bold text-sm">Vendor Dashboard</Text>
                  <Text className="text-amber-700 text-xs">Manage products, orders & earnings</Text>
                </View>
              </View>
              <ChevronRight size={18} color="#D97706" />
            </View>
          </View>
        )}

        {/* Account Menu Navigation */}
        <View className="bg-white rounded-2xl p-2 border border-slate-100 shadow-sm mb-4">
          <TouchableOpacity className="flex-row items-center justify-between p-3 border-b border-slate-50">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-teal-50 items-center justify-center">
                <Package size={16} color="#0D9488" />
              </View>
              <Text className="text-slate-800 font-semibold text-xs ml-3">My Orders</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-3 border-b border-slate-50">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-teal-50 items-center justify-center">
                <MapPin size={16} color="#0D9488" />
              </View>
              <Text className="text-slate-800 font-semibold text-xs ml-3">Shipping Addresses</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-3 border-b border-slate-50">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-teal-50 items-center justify-center">
                <CreditCard size={16} color="#0D9488" />
              </View>
              <Text className="text-slate-800 font-semibold text-xs ml-3">Payment Methods</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-teal-50 items-center justify-center">
                <ShieldCheck size={16} color="#0D9488" />
              </View>
              <Text className="text-slate-800 font-semibold text-xs ml-3">Security & Sanctum Session</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={() => logout()}
          activeOpacity={0.8}
          className="bg-white border border-rose-200 rounded-2xl p-4 flex-row items-center justify-center shadow-sm mb-12">
          <LogOut size={16} color="#E11D48" />
          <Text className="text-rose-600 font-bold text-xs ml-2">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Guest / Unauthenticated State View
  return (
    <ScrollView className="flex-1 bg-slate-50 px-5 pt-4" showsVerticalScrollIndicator={false}>
      {/* Auth Mode Switcher */}
      <View className="flex-row bg-slate-200/80 p-1 rounded-xl mb-5">
        <TouchableOpacity
          onPress={() => { setAuthMode('login'); clearError(); }}
          className={`flex-1 py-2.5 rounded-lg items-center ${authMode === 'login' ? 'bg-white shadow-sm' : ''}`}>
          <Text className={`text-xs font-bold ${authMode === 'login' ? 'text-teal-700' : 'text-slate-600'}`}>
            Sign In
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setAuthMode('register'); clearError(); }}
          className={`flex-1 py-2.5 rounded-lg items-center ${authMode === 'register' ? 'bg-white shadow-sm' : ''}`}>
          <Text className={`text-xs font-bold ${authMode === 'register' ? 'text-teal-700' : 'text-slate-600'}`}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form Card */}
      <View className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-4">
        <Text className="text-slate-900 font-bold text-lg mb-1">
          {authMode === 'login' ? 'Welcome Back' : 'Join Bizzhuss'}
        </Text>
        <Text className="text-slate-500 text-xs mb-5">
          {authMode === 'login'
            ? 'Sign in to access your orders, cart, and vendor tools.'
            : 'Register to start shopping or selling with Bizzhuss.'}
        </Text>

        {error && (
          <View className="bg-rose-50 border border-rose-200 p-3 rounded-xl mb-4">
            <Text className="text-rose-700 text-xs font-medium">{error}</Text>
          </View>
        )}

        {authMode === 'register' && (
          <View className="mb-3">
            <Text className="text-slate-700 font-semibold text-xs mb-1.5">Full Name</Text>
            <TextInput
              placeholder="e.g. John Doe"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs"
            />
          </View>
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
          onPress={handleAuthSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
          className="bg-teal-600 rounded-xl py-3.5 items-center flex-row justify-center shadow-sm">
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              {authMode === 'login' ? <LogIn size={16} color="#FFFFFF" /> : <UserPlus size={16} color="#FFFFFF" />}
              <Text className="text-white font-bold text-xs ml-2">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Testing / Dev Access */}
      <View className="bg-slate-100 rounded-2xl p-4 mb-10 border border-slate-200/80">
        <Text className="text-slate-800 font-bold text-xs mb-1">Developer Quick Demo Login</Text>
        <Text className="text-slate-500 text-[11px] mb-3">
          Simulate a Laravel Sanctum session with Bearer token saved to SecureStore:
        </Text>
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={() => handleQuickDemoLogin('customer')}
            className="flex-1 bg-white border border-slate-300 py-2.5 rounded-xl items-center mr-2 shadow-xs">
            <Text className="text-teal-700 font-bold text-xs">Demo Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleQuickDemoLogin('vendor')}
            className="flex-1 bg-white border border-slate-300 py-2.5 rounded-xl items-center shadow-xs">
            <Text className="text-amber-700 font-bold text-xs">Demo Vendor</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
