import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Store } from 'lucide-react-native';
import { useCartStore } from '@/store/useCartStore';

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalItems } = useCartStore();

  const sub = subtotal();
  const isFreeDelivery = sub >= 5000;

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center p-6">
        <View className="w-20 h-20 rounded-full bg-teal-50 items-center justify-center mb-4 border border-teal-100">
          <ShoppingBag size={38} color="#0D9488" />
        </View>
        <Text className="text-slate-900 font-extrabold text-xl mb-1.5">Your Cart is Empty</Text>
        <Text className="text-slate-500 text-xs text-center mb-6 max-w-[280px] leading-relaxed">
          Discover authentic Pakistani lawn, electronics, kurtas & herbal remedies from verified vendors.
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)')}
          activeOpacity={0.8}
          className="bg-teal-600 px-6 py-3.5 rounded-full flex-row items-center shadow-sm">
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
        <View className="flex-row items-center justify-between mb-3 px-1">
          <Text className="text-slate-700 text-xs font-bold">
            {totalItems()} {totalItems() === 1 ? 'item' : 'items'} in your cart
          </Text>
          <TouchableOpacity onPress={clearCart}>
            <Text className="text-rose-600 text-xs font-bold">Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Free Shipping Progress Indicator */}
        <View className="bg-teal-50 border border-teal-200/80 rounded-2xl p-3.5 mb-4">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-teal-900 text-xs font-bold">
              {isFreeDelivery
                ? '🎉 Congratulations! You have unlocked FREE Delivery.'
                : `Add Rs. ${(5000 - sub).toLocaleString()} more for FREE Nationwide Delivery.`}
            </Text>
          </View>
          <View className="w-full h-1.5 bg-teal-200 rounded-full overflow-hidden mt-1">
            <View
              style={{ width: `${Math.min(100, (sub / 5000) * 100)}%` }}
              className="h-full bg-teal-600 rounded-full"
            />
          </View>
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
                className="w-20 h-22 rounded-xl bg-slate-100"
                resizeMode="cover"
              />

              <View className="flex-1 ml-3.5 justify-between">
                <View>
                  <View className="flex-row items-start justify-between">
                    <Text
                      numberOfLines={2}
                      className="text-slate-900 font-bold text-xs flex-1 pr-2 leading-tight">
                      {product.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeItem(product.id)}
                      className="p-1">
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  {product.vendor && (
                    <View className="flex-row items-center mt-1">
                      <Store size={10} color="#0D9488" />
                      <Text className="text-teal-700 text-[10px] font-bold ml-1">
                        {product.vendor.store_name}
                      </Text>
                    </View>
                  )}
                </View>

                <View className="flex-row items-center justify-between mt-2 pt-1 border-t border-slate-50">
                  <View>
                    <Text className="text-slate-900 font-extrabold text-sm">
                      Rs. {(unitPrice * quantity).toLocaleString()}
                    </Text>
                    <Text className="text-slate-400 text-[10px]">
                      Rs. {unitPrice.toLocaleString()} each
                    </Text>
                  </View>

                  {/* Quantity Incrementer */}
                  <View className="flex-row items-center bg-slate-100 rounded-xl px-2 py-1 border border-slate-200/60">
                    <TouchableOpacity
                      onPress={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1">
                      <Minus size={13} color="#334155" />
                    </TouchableOpacity>
                    <Text className="text-slate-900 font-black text-xs mx-2.5">
                      {quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1">
                      <Plus size={13} color="#334155" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        {/* Order Subtotal Breakdown Card */}
        <View className="bg-white rounded-2xl p-4 mt-2 mb-8 border border-slate-100 shadow-sm">
          <Text className="text-slate-900 font-bold text-sm mb-3">Order Estimate</Text>

          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-500 text-xs font-medium">Subtotal</Text>
            <Text className="text-slate-800 font-bold text-xs">Rs. {sub.toLocaleString()}</Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-500 text-xs font-medium">Shipping</Text>
            <Text className="text-teal-700 font-bold text-xs">
              {isFreeDelivery ? 'FREE' : 'Calculated at City Checkout'}
            </Text>
          </View>

          <View className="h-px bg-slate-100 my-2" />

          <View className="flex-row justify-between items-center">
            <Text className="text-slate-900 font-bold text-sm">Estimated Subtotal</Text>
            <Text className="text-teal-700 font-black text-base">Rs. {sub.toLocaleString()}</Text>
          </View>

          <View className="flex-row items-center mt-3 pt-2 border-t border-slate-100">
            <ShieldCheck size={14} color="#0D9488" />
            <Text className="text-slate-500 text-[11px] ml-1.5">
              Cash on Delivery & Secure Payments Available
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Proceed to Checkout Bar */}
      <View className="bg-white border-t border-slate-200 px-5 py-3.5 flex-row items-center justify-between shadow-lg">
        <View>
          <Text className="text-slate-400 text-[11px] font-semibold uppercase">Subtotal</Text>
          <Text className="text-slate-900 font-black text-lg">Rs. {sub.toLocaleString()}</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/checkout')}
          activeOpacity={0.8}
          className="bg-teal-600 px-7 py-3.5 rounded-xl flex-row items-center shadow-sm">
          <Text className="text-white font-extrabold text-xs mr-2 tracking-wide">
            Proceed to Checkout
          </Text>
          <ArrowRight size={15} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
