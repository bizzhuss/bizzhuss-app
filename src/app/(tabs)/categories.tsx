import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Search,
  X,
  Filter,
  Star,
  Plus,
  Store,
  CheckCircle2,
  PackageOpen,
} from 'lucide-react-native';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/data/mockData';

export default function CategoriesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string; category?: string }>();
  const [search, setSearch] = useState(params.q || '');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(params.category || 'all');
  const addItem = useCartStore((state) => state.addItem);

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch =
      search.trim() === '' ||
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase()) ||
      product.vendor?.store_name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategorySlug === 'all' ||
      product.category?.slug === selectedCategorySlug;

    return matchesSearch && matchesCategory;
  });

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/product/[id]',
      params: { id: product.id.toString() },
    });
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Sticky Top Search Header */}
      <View className="bg-white px-4 pt-3 pb-3 border-b border-slate-100 shadow-2xs">
        <View className="bg-slate-100 rounded-2xl flex-row items-center px-3.5 py-2">
          <Search size={18} color="#0D9488" />
          <TextInput
            placeholder="Search products, brands, verified stores..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            className="flex-1 ml-2.5 text-slate-800 text-sm font-medium"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} className="p-1">
              <X size={16} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Horizontal Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mt-3">
          <TouchableOpacity
            onPress={() => setSelectedCategorySlug('all')}
            className={`mr-2 px-3.5 py-1.5 rounded-full border ${
              selectedCategorySlug === 'all'
                ? 'bg-teal-600 border-teal-600'
                : 'bg-white border-slate-200'
            }`}>
            <Text
              className={`text-xs font-bold ${
                selectedCategorySlug === 'all' ? 'text-white' : 'text-slate-600'
              }`}>
              All Items ({MOCK_PRODUCTS.length})
            </Text>
          </TouchableOpacity>

          {MOCK_CATEGORIES.map((cat) => {
            const isActive = selectedCategorySlug === cat.slug;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategorySlug(cat.slug)}
                className={`mr-2 px-3.5 py-1.5 rounded-full border ${
                  isActive
                    ? 'bg-teal-600 border-teal-600'
                    : 'bg-white border-slate-200'
                }`}>
                <Text
                  className={`text-xs font-bold ${
                    isActive ? 'text-white' : 'text-slate-600'
                  }`}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Filter Info Bar */}
      <View className="flex-row items-center justify-between px-4 py-2 bg-slate-100/70 border-b border-slate-200/50">
        <Text className="text-slate-600 text-xs font-semibold">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
        </Text>
        <View className="flex-row items-center">
          <Filter size={13} color="#0D9488" />
          <Text className="text-teal-700 text-xs font-bold ml-1">Verified Pakistani Stores</Text>
        </View>
      </View>

      {/* Products Grid or Empty State */}
      <ScrollView className="flex-1 px-4 pt-3" showsVerticalScrollIndicator={false}>
        {filteredProducts.length === 0 ? (
          <View className="items-center justify-center py-20">
            <View className="w-16 h-16 rounded-full bg-slate-200 items-center justify-center mb-3">
              <PackageOpen size={30} color="#64748B" />
            </View>
            <Text className="text-slate-900 font-bold text-base mb-1">No products found</Text>
            <Text className="text-slate-500 text-xs text-center max-w-[240px] mb-4">
              Try adjusting your search terms or selecting another category filter.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSearch('');
                setSelectedCategorySlug('all');
              }}
              className="bg-teal-600 px-4 py-2 rounded-xl">
              <Text className="text-white text-xs font-bold">Reset Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between pb-16">
            {filteredProducts.map((product) => {
              const imageUrl = typeof product.images[0] === 'string'
                ? product.images[0]
                : product.images[0]?.url;

              return (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => handleProductPress(product)}
                  activeOpacity={0.9}
                  className="w-[48%] bg-white rounded-2xl mb-4 p-3 border border-slate-100 shadow-sm justify-between">
                  <View>
                    <View className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 relative">
                      <Image
                        source={{ uri: imageUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      {product.sale_price && (
                        <View className="absolute top-2 left-2 bg-rose-600 px-2 py-0.5 rounded-md">
                          <Text className="text-white text-[10px] font-bold">
                            {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
                          </Text>
                        </View>
                      )}
                    </View>

                    {product.vendor && (
                      <View className="flex-row items-center mt-2.5">
                        <Store size={11} color="#0D9488" />
                        <Text numberOfLines={1} className="text-teal-700 text-[11px] font-bold ml-1 flex-1">
                          {product.vendor.store_name}
                        </Text>
                        {product.vendor.is_verified && (
                          <CheckCircle2 size={11} color="#0D9488" />
                        )}
                      </View>
                    )}

                    <Text numberOfLines={2} className="text-slate-800 font-semibold text-xs mt-1 leading-snug">
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
      </ScrollView>
    </View>
  );
}
