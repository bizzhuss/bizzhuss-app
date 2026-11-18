import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { useCartStore } from '@/store/useCartStore';

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalItems } = useCartStore();

  const sub = subtotal();
  const shipping = sub > 100 || sub === 0 ? 0 : 9.99;
  const tax = sub > 0 ? Number((sub * 0.05).toFixed(2)) : 0;
  const total = (sub + shipping + tax).toFixed(2);

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center p-6">
        <View className="w-20 h-20 rounded-full bg-teal-50 items-center justify-center mb-4">
          <ShoppingBag size={36} color="#0D9488" />
        </View>
        <Text className="text-slate-900 font-bold text-lg mb-1">Your Cart is Empty</Text>
        <Text className="text-slate-500 text-xs text-center mb-6 max-w-[260px]">
          Discover top products from verified vendors across the Bizzhuss marketplace.
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)')}
          className="bg-teal-600 px-6 py-3 rounded-full flex-row items-center shadow-sm">
          <Text className="text-white font-bold text-sm mr-2">Start Shopping</Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-4 pt-3" showsVerticalScrollIndicator={false}>
        {/* Header Bar */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-slate-700 text-xs font-semibold">
            {totalItems()} {totalItems() === 1 ? 'item' : 'items'} in cart
          </Text>
          <TouchableOpacity onPress={clearCart}>
            <Text className="text-rose-600 text-xs font-semibold">Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Cart Items List */}
        {items.map((item) => {
          const { product, quantity } = item;
          const imageUrl = typeof product.images[0] === 'string'
            ? product.images[0]
            : product.images[0]?.url;
          const unitPrice = product.sale_price ?? product.price;

          return (
            <View
              key={product.id}
              className="bg-white rounded-2xl p-3.5 mb-3 border border-slate-100 shadow-sm flex-row">
              <Image
                source={{ uri: imageUrl }}
                className="w-20 h-20 rounded-xl bg-slate-100"
                resizeMode="cover"
              />

              <View className="flex-1 ml-3.5 justify-between">
                <View>
                  <View className="flex-row items-start justify-between">
                    <Text
                      numberOfLines={2}
                      className="text-slate-900 font-bold text-xs flex-1 pr-2">
                      {product.title}
                    </Text>
                    <TouchableOpacity onPress={() => removeItem(product.id)}>
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  {product.vendor && (
                    <Text className="text-teal-700 text-[10px] font-semibold mt-0.5">
                      Vendor: {product.vendor.store_name}
                    </Text>
                  )}
                </View>

                <View className="flex-row items-center justify-between mt-2 pt-1 border-t border-slate-50">
                  <Text className="text-slate-900 font-bold text-sm">
                    ${(unitPrice * quantity).toFixed(2)}
                  </Text>

                  {/* Quantity Controls */}
                  <View className="flex-row items-center bg-slate-100 rounded-lg px-2 py-1">
                    <TouchableOpacity
                      onPress={() => updateQuantity(product.id, quantity - 1)}
                      className="p-0.5">
                      <Minus size={14} color="#475569" />
                    </TouchableOpacity>
                    <Text className="text-slate-900 font-semibold text-xs mx-2.5">
                      {quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(product.id, quantity + 1)}
                      className="p-0.5">
                      <Plus size={14} color="#475569" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        {/* Order Summary Card */}
        <View className="bg-white rounded-2xl p-4 mt-2 mb-8 border border-slate-100 shadow-sm">
          <Text className="text-slate-900 font-bold text-sm mb-3">Order Summary</Text>

          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-500 text-xs">Subtotal</Text>
            <Text className="text-slate-800 font-semibold text-xs">${sub.toFixed(2)}</Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-500 text-xs">Estimated Shipping</Text>
            <Text className="text-slate-800 font-semibold text-xs">
              {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
            </Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-500 text-xs">Estimated Tax (5%)</Text>
            <Text className="text-slate-800 font-semibold text-xs">${tax.toFixed(2)}</Text>
          </View>

          <View className="h-px bg-slate-100 my-2" />

          <View className="flex-row justify-between items-center">
            <Text className="text-slate-900 font-bold text-sm">Total Amount</Text>
            <Text className="text-teal-700 font-extrabold text-base">${total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Checkout Bottom Bar */}
      <View className="bg-white border-t border-slate-100 px-5 py-4 flex-row items-center justify-between">
        <View>
          <Text className="text-slate-400 text-[11px] font-medium">Total</Text>
          <Text className="text-slate-900 font-extrabold text-lg">${total}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-teal-600 px-8 py-3.5 rounded-xl shadow-sm">
          <Text className="text-white font-bold text-sm tracking-wide">
            Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
