import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Store,
  CheckCircle2,
  Star,
  MapPin,
  Phone,
  Mail,
  Plus,
  PackageOpen,
} from 'lucide-react-native';
import { Vendor, Product } from '@/types';
import { getVendorById } from '@/api/catalog';
import { useCartStore } from '@/store/useCartStore';

export default function VendorStoreScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const fetchVendorData = useCallback(async () => {
    if (!id) return;
    try {
      const result = await getVendorById(id);
      setVendor(result.vendor);
      setProducts(result.products || []);
    } catch (e) {
      console.log('Error loading vendor store:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVendorData();
  }, [fetchVendorData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchVendorData();
  }, [fetchVendorData]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0D9488" />
        <Text className="text-slate-500 text-xs mt-3 font-semibold">Loading Vendor Storefront...</Text>
      </View>
    );
  }

  if (!vendor) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center p-6">
        <View className="w-16 h-16 rounded-full bg-slate-200 items-center justify-center mb-3">
          <Store size={28} color="#64748B" />
        </View>
        <Text className="text-slate-900 font-extrabold text-base mb-1">Vendor Not Found</Text>
        <Text className="text-slate-500 text-xs text-center max-w-[240px] mb-4">
          This seller storefront could not be located on the Bizzhuss marketplace.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-teal-600 px-5 py-2.5 rounded-xl">
          <Text className="text-white text-xs font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#0D9488']} tintColor="#0D9488" />
      }>
      {/* Vendor Store Banner */}
      <View className="w-full h-36 bg-teal-800 relative">
        {vendor.banner ? (
          <Image source={{ uri: vendor.banner }} className="w-full h-full opacity-80" resizeMode="cover" />
        ) : (
          <View className="w-full h-full bg-teal-800 items-center justify-center opacity-80" />
        )}
      </View>

      {/* Vendor Store Card & Info */}
      <View className="px-4 -mt-10 mb-4">
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <View className="flex-row items-center">
            {/* Logo Avatar */}
            <View className="w-16 h-16 rounded-2xl bg-teal-50 border-2 border-white shadow-sm overflow-hidden items-center justify-center">
              {vendor.logo ? (
                <Image source={{ uri: vendor.logo }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <Store size={28} color="#0D9488" />
              )}
            </View>

            <View className="ml-3.5 flex-1">
              <View className="flex-row items-center">
                <Text numberOfLines={1} className="text-slate-900 font-black text-base flex-1">
                  {vendor.store_name}
                </Text>
                {vendor.is_verified && <CheckCircle2 size={16} color="#0D9488" className="ml-1" />}
              </View>

              <View className="flex-row items-center mt-1">
                <View className="flex-row items-center bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <Star size={12} color="#F59E0B" fill="#F59E0B" />
                  <Text className="text-slate-900 font-bold text-[11px] ml-1">{vendor.rating ?? 4.9}</Text>
                </View>
                <Text className="text-slate-400 text-[11px] ml-2">
                  ({vendor.reviews_count ?? 300}+ reviews)
                </Text>
              </View>
            </View>
          </View>

          {vendor.description && (
            <Text className="text-slate-600 text-xs mt-3.5 leading-relaxed">{vendor.description}</Text>
          )}

          {/* Contact & Location Strip */}
          <View className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
            {vendor.address && (
              <View className="flex-row items-center">
                <MapPin size={13} color="#0D9488" />
                <Text className="text-slate-600 text-[11px] ml-2 font-medium">{vendor.address}</Text>
              </View>
            )}
            {vendor.phone && (
              <View className="flex-row items-center">
                <Phone size={13} color="#0D9488" />
                <Text className="text-slate-600 text-[11px] ml-2 font-medium">{vendor.phone}</Text>
              </View>
            )}
            {vendor.email && (
              <View className="flex-row items-center">
                <Mail size={13} color="#0D9488" />
                <Text className="text-slate-600 text-[11px] ml-2 font-medium">{vendor.email}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Products Catalog Section */}
      <View className="px-4 pb-12">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-slate-900 font-black text-base">Store Catalog ({products.length})</Text>
          <Text className="text-teal-700 text-xs font-semibold">100% Original</Text>
        </View>

        {products.length === 0 ? (
          <View className="items-center justify-center py-12 bg-white rounded-3xl border border-slate-100 p-6">
            <PackageOpen size={32} color="#94A3B8" />
            <Text className="text-slate-800 font-bold text-sm mt-2">No Products Currently Listed</Text>
            <Text className="text-slate-400 text-xs text-center mt-1">
              Check back soon as this seller updates their catalog.
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {products.map((product) => {
              const imageUrl = typeof product.images[0] === 'string'
                ? product.images[0]
                : product.images[0]?.url;

              return (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id.toString() } })}
                  activeOpacity={0.9}
                  className="w-[48%] bg-white rounded-2xl mb-4 p-3 border border-slate-100 shadow-sm justify-between">
                  <View>
                    <View className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 relative">
                      <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
                      {product.sale_price && (
                        <View className="absolute top-2 left-2 bg-rose-600 px-2 py-0.5 rounded-md">
                          <Text className="text-white text-[10px] font-bold">
                            {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text numberOfLines={2} className="text-slate-800 font-semibold text-xs mt-2 leading-snug">
                      {product.title}
                    </Text>

                    <View className="flex-row items-center mt-1.5">
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <Text className="text-slate-700 text-[11px] font-bold ml-1">{product.rating}</Text>
                      <Text className="text-slate-400 text-[10px] ml-1">({product.reviews_count})</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between mt-3 pt-2 border-t border-slate-50">
                    <View>
                      <Text className="text-slate-900 font-black text-sm">
                        Rs. {(product.sale_price ?? product.price).toLocaleString()}
                      </Text>
                      {product.sale_price && (
                        <Text className="text-slate-400 text-[10px] line-through">
                          Rs. {product.price.toLocaleString()}
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        addItem(product, 1);
                      }}
                      activeOpacity={0.8}
                      className="bg-teal-600 w-8 h-8 rounded-full items-center justify-center shadow-xs">
                      <Plus size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
