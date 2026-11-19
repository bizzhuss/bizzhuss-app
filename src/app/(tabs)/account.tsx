import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Package,
  MapPin,
  CreditCard,
  Store,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Truck,
  LogIn,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  RefreshCw,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { OrderStatus } from '@/types';

function getOrderStatusBadge(status: OrderStatus) {
  switch (status) {
    case 'delivered':
      return {
        label: 'Delivered',
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        border: 'border-teal-200',
        icon: CheckCircle2,
      };
    case 'shipped':
      return {
        label: 'Dispatched / In Transit',
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        icon: Truck,
      };
    case 'processing':
      return {
        label: 'Processing in Warehouse',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: Send,
      };
    case 'pending':
      return {
        label: 'Order Placed (Pending)',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: Clock,
      };
    default:
      return {
        label: status,
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        icon: AlertCircle,
      };
  }
}

export default function AccountScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, orders, logout, fetchOrders } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchOrders();
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchOrders]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0D9488" />
        <Text className="text-slate-500 text-xs mt-3 font-semibold">Synchronizing with Bizzhuss...</Text>
      </View>
    );
  }

  // Guest State View
  if (!isAuthenticated || !user) {
    return (
      <ScrollView
        className="flex-1 bg-slate-50 px-5 pt-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#0D9488']} tintColor="#0D9488" />
        }>
        {/* Guest Welcome Banner */}
        <View className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm items-center text-center mb-5">
          <View className="w-16 h-16 rounded-full bg-teal-50 items-center justify-center mb-3 border border-teal-100">
            <LogIn size={28} color="#0D9488" />
          </View>

          <Text className="text-slate-900 font-black text-xl text-center">
            Welcome to Bizzhuss
          </Text>
          <Text className="text-slate-500 text-xs text-center mt-1 mb-5 max-w-[260px] leading-relaxed">
            Sign in to track your Pakistani courier shipments, view previous orders, and enjoy faster checkout.
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/login')}
            activeOpacity={0.8}
            className="bg-teal-600 w-full py-3.5 rounded-2xl items-center shadow-sm">
            <Text className="text-white font-black text-xs uppercase tracking-wide">
              Sign In or Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Benefits List */}
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-12">
          <Text className="text-slate-900 font-bold text-sm mb-3">Why Create an Account?</Text>

          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-xl bg-teal-50 items-center justify-center mr-3">
              <Package size={16} color="#0D9488" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-800 font-bold text-xs">Live Order & TCS Tracking</Text>
              <Text className="text-slate-500 text-[11px]">Check courier status and delivery progress</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-xl bg-teal-50 items-center justify-center mr-3">
              <MapPin size={16} color="#0D9488" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-800 font-bold text-xs">Saved Pakistani Addresses</Text>
              <Text className="text-slate-500 text-[11px]">Quick 1-click checkout for your home or office</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-xl bg-teal-50 items-center justify-center mr-3">
              <ShieldCheck size={16} color="#0D9488" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-800 font-bold text-xs">Verified Multi-Vendor Protection</Text>
              <Text className="text-slate-500 text-[11px]">7-day returns on official brand orders</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Logged-in State View
  return (
    <ScrollView
      className="flex-1 bg-slate-50 px-4 pt-4 pb-12"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#0D9488']} tintColor="#0D9488" />
      }>
      {/* User Profile Card */}
      <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-4">
        <View className="flex-row items-center">
          <View className="w-16 h-16 rounded-full bg-teal-600 items-center justify-center shadow-xs">
            <Text className="text-white text-2xl font-black">
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View className="ml-4 flex-1">
            <View className="flex-row items-center">
              <Text className="text-slate-900 font-black text-base">{user.name}</Text>
              <View className="bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full ml-2">
                <Text className="text-teal-700 text-[10px] font-black uppercase">
                  {user.role}
                </Text>
              </View>
            </View>
            <Text className="text-slate-500 text-xs mt-0.5 font-medium">{user.email}</Text>
            {user.phone && (
              <Text className="text-slate-400 text-[11px] mt-0.5 font-medium">{user.phone}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Vendor Store Portal Banner (if vendor role) */}
      {user.role === 'vendor' && (
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/vendor/[id]', params: { id: (user.id || 101).toString() } })}
          activeOpacity={0.8}
          className="bg-amber-50 rounded-2xl p-4 mb-4 border border-amber-200">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 pr-2">
              <Store size={22} color="#D97706" />
              <View className="ml-3 flex-1">
                <Text className="text-amber-900 font-black text-sm">Vendor Store Portal</Text>
                <Text className="text-amber-700 text-xs">
                  Manage inventory, Pakistani logistics & view storefront
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color="#D97706" />
          </View>
        </TouchableOpacity>
      )}

      {/* Tabs Switcher: Orders vs Account Settings */}
      <View className="flex-row bg-slate-200/80 p-1 rounded-2xl mb-4">
        <TouchableOpacity
          onPress={() => setActiveTab('orders')}
          className={`flex-1 py-2.5 rounded-xl items-center flex-row justify-center ${
            activeTab === 'orders' ? 'bg-white shadow-sm' : ''
          }`}>
          <Package size={14} color={activeTab === 'orders' ? '#0D9488' : '#64748B'} />
          <Text
            className={`text-xs font-bold ml-1.5 ${
              activeTab === 'orders' ? 'text-teal-700' : 'text-slate-600'
            }`}>
            My Orders ({orders.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('profile')}
          className={`flex-1 py-2.5 rounded-xl items-center flex-row justify-center ${
            activeTab === 'profile' ? 'bg-white shadow-sm' : ''
          }`}>
          <MapPin size={14} color={activeTab === 'profile' ? '#0D9488' : '#64748B'} />
          <Text
            className={`text-xs font-bold ml-1.5 ${
              activeTab === 'profile' ? 'text-teal-700' : 'text-slate-600'
            }`}>
            Addresses & Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab 1: Orders List */}
      {activeTab === 'orders' && (
        <View className="mb-6">
          <View className="flex-row items-center justify-between px-1 mb-2.5">
            <Text className="text-slate-600 text-xs font-semibold">
              Live orders synced via Sanctum REST API
            </Text>
            <TouchableOpacity onPress={onRefresh} className="flex-row items-center">
              <RefreshCw size={12} color="#0D9488" />
              <Text className="text-teal-700 text-[11px] font-bold ml-1">Refresh</Text>
            </TouchableOpacity>
          </View>

          {orders.map((order) => {
            const badge = getOrderStatusBadge(order.status);
            const BadgeIcon = badge.icon;
            const formattedDate = new Date(order.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <View
                key={order.id}
                className="bg-white rounded-3xl p-4 mb-4 border border-slate-100 shadow-sm">
                {/* Order Top Header */}
                <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
                  <View>
                    <Text className="text-slate-900 font-extrabold text-sm">
                      Order #{order.order_number}
                    </Text>
                    <Text className="text-slate-400 text-[11px] mt-0.5">{formattedDate}</Text>
                  </View>

                  {/* Status Badge */}
                  <View
                    className={`flex-row items-center px-2.5 py-1 rounded-full border ${badge.bg} ${badge.border}`}>
                    <BadgeIcon size={12} color={order.status === 'delivered' ? '#0D9488' : '#4F46E5'} />
                    <Text className={`text-[11px] font-black ml-1.5 ${badge.text}`}>
                      {badge.label}
                    </Text>
                  </View>
                </View>

                {/* Items in this Order */}
                <View className="py-3">
                  {order.items.map((item) => (
                    <View key={item.id} className="flex-row items-center mb-2 last:mb-0">
                      {item.product_image ? (
                        <Image
                          source={{ uri: item.product_image }}
                          className="w-12 h-12 rounded-xl bg-slate-100"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-12 h-12 rounded-xl bg-teal-50 items-center justify-center">
                          <Package size={18} color="#0D9488" />
                        </View>
                      )}

                      <View className="ml-3 flex-1">
                        <Text numberOfLines={1} className="text-slate-800 font-bold text-xs">
                          {item.product_title}
                        </Text>
                        <Text className="text-slate-500 text-[11px] mt-0.5">
                          Qty: {item.quantity} • Rs. {item.price.toLocaleString()} each
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Order Footer & Tracking */}
                <View className="pt-3 border-t border-slate-100 flex-row items-center justify-between">
                  <View>
                    <Text className="text-slate-400 text-[10px]">
                      Destination: {order.shipping_address.city} • {order.payment_method}
                    </Text>
                    {order.tracking_number && (
                      <Text className="text-teal-700 text-[10px] font-bold mt-0.5">
                        Tracking: {order.tracking_number}
                      </Text>
                    )}
                  </View>

                  <View className="items-end">
                    <Text className="text-slate-400 text-[10px] uppercase font-bold">Total</Text>
                    <Text className="text-slate-900 font-black text-sm">
                      Rs. {order.total_amount.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Tab 2: Addresses & Settings */}
      {activeTab === 'profile' && (
        <View className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm mb-6">
          <TouchableOpacity className="flex-row items-center justify-between p-3.5 border-b border-slate-50">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-xl bg-teal-50 items-center justify-center">
                <MapPin size={16} color="#0D9488" />
              </View>
              <View className="ml-3">
                <Text className="text-slate-800 font-bold text-xs">Saved Pakistani Addresses</Text>
                <Text className="text-slate-400 text-[11px]">Karachi, Lahore & Islamabad residences</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-3.5 border-b border-slate-50">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-xl bg-teal-50 items-center justify-center">
                <CreditCard size={16} color="#0D9488" />
              </View>
              <View className="ml-3">
                <Text className="text-slate-800 font-bold text-xs">Payment & Wallets</Text>
                <Text className="text-slate-400 text-[11px]">JazzCash, Easypaisa & Debit Cards</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-3.5 border-b border-slate-50">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-xl bg-teal-50 items-center justify-center">
                <HelpCircle size={16} color="#0D9488" />
              </View>
              <View className="ml-3">
                <Text className="text-slate-800 font-bold text-xs">Help & Customer Support</Text>
                <Text className="text-slate-400 text-[11px]">Call Center & WhatsApp 24/7</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-3.5">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-xl bg-teal-50 items-center justify-center">
                <ShieldCheck size={16} color="#0D9488" />
              </View>
              <View className="ml-3">
                <Text className="text-slate-800 font-bold text-xs">Security & Sanctum Token</Text>
                <Text className="text-slate-400 text-[11px]">Encrypted SecureStore session</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      )}

      {/* Sign Out Button */}
      <TouchableOpacity
        onPress={() => logout()}
        activeOpacity={0.8}
        className="bg-white border border-rose-200 rounded-2xl p-4 flex-row items-center justify-center shadow-sm mb-12">
        <LogOut size={16} color="#E11D48" />
        <Text className="text-rose-600 font-black text-xs ml-2">Sign Out of Bizzhuss</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
