import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  Bell,
  Star,
  Plus,
  Store,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Flame,
  ShieldCheck,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react-native';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, PROMO_BANNERS } from '@/data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  const featuredProducts = MOCK_PRODUCTS.filter((p) => p.is_featured);
  const trendingProducts = MOCK_PRODUCTS.slice(2, 6);

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/product/[id]',
      params: { id: product.id.toString() },
    });
  };

  const handleSearchSubmit = () => {
    router.push({
      pathname: '/(tabs)/categories',
      params: { q: searchQuery },
    });
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      {/* Top Header Bar */}
      <View className="bg-teal-700 px-5 pt-3 pb-5 rounded-b-3xl shadow-sm">
        <View className="flex-row items-center justify-between mb-3.5">
          <View>
            <View className="flex-row items-center">
              <Text className="text-white text-2xl font-black tracking-tight">BIZZHUSS</Text>
              <View className="bg-amber-400 px-1.5 py-0.5 rounded ml-1.5">
                <Text className="text-slate-900 text-[10px] font-extrabold uppercase">PK</Text>
              </View>
            </View>
            <Text className="text-teal-100 text-xs mt-0.5 font-medium">Pakistan's Verified Multi-Vendor Hub</Text>
          </View>

          {/* Header Action Badges */}
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-10 h-10 rounded-full bg-teal-800/80 items-center justify-center relative border border-teal-600/40">
              <Bell size={18} color="#FFFFFF" />
              <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 border border-teal-800" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar Input */}
        <View className="bg-white rounded-2xl flex-row items-center px-4 py-2.5 shadow-sm">
          <Search size={18} color="#0D9488" />
          <TextInput
            placeholder="Search Khaadi, Audionic, mobiles, lawn..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            className="flex-1 ml-3 text-slate-800 text-sm font-medium"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleSearchSubmit}
              className="bg-teal-600 px-2.5 py-1 rounded-lg">
              <Text className="text-white text-xs font-bold">Go</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Promotional Hero Banner Slider */}
      <View className="mt-4 px-4">
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const slide = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 32));
            setActiveBannerIndex(slide);
          }}
          scrollEventThrottle={16}
          className="rounded-2xl">
          {PROMO_BANNERS.map((banner) => (
            <View
              key={banner.id}
              style={{ width: SCREEN_WIDTH - 32 }}
              className={`${banner.bgGradient} rounded-2xl p-4 mr-2 overflow-hidden relative shadow-sm min-h-[140px] justify-between`}>
              <View className="z-10 max-w-[65%]">
                <View className="bg-white/20 self-start px-2.5 py-0.5 rounded-full mb-2">
                  <Text className="text-white text-[10px] font-black tracking-wider uppercase">
                    {banner.badge}
                  </Text>
                </View>
                <Text className="text-white font-black text-lg leading-tight">
                  {banner.title}
                </Text>
                <Text className="text-teal-100 text-xs font-semibold mt-1">
                  {banner.subtitle}
                </Text>
                <View className="flex-row items-center mt-2.5 bg-amber-400 self-start px-3 py-1 rounded-full shadow-xs">
                  <Text className="text-slate-900 font-bold text-[11px] mr-1">Shop Now</Text>
                  <ChevronRight size={12} color="#0F172A" />
                </View>
              </View>

              {/* Banner Graphic Image */}
              <Image
                source={{ uri: banner.imageUrl }}
                className="absolute right-[-10px] top-[-10px] w-36 h-40 rounded-2xl opacity-60"
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>

        {/* Carousel Dots */}
        <View className="flex-row justify-center items-center mt-2.5 space-x-1.5">
          {PROMO_BANNERS.map((_, i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                activeBannerIndex === i ? 'w-6 bg-teal-600' : 'w-1.5 bg-slate-300'
              }`}
            />
          ))}
        </View>
      </View>

      {/* Trust Badges Bar */}
      <View className="flex-row items-center justify-between px-5 py-3 mx-4 my-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
        <View className="flex-row items-center">
          <ShieldCheck size={16} color="#0D9488" />
          <Text className="text-slate-700 text-[11px] font-bold ml-1.5">100% Genuine</Text>
        </View>
        <View className="h-3 w-px bg-slate-200" />
        <View className="flex-row items-center">
          <CheckCircle2 size={16} color="#0D9488" />
          <Text className="text-slate-700 text-[11px] font-bold ml-1.5">Cash On Delivery</Text>
        </View>
        <View className="h-3 w-px bg-slate-200" />
        <View className="flex-row items-center">
          <Sparkles size={16} color="#0D9488" />
          <Text className="text-slate-700 text-[11px] font-bold ml-1.5">Easy Returns</Text>
        </View>
      </View>

      {/* Categories Horizontal Scroll */}
      <View className="mt-1">
        <View className="flex-row items-center justify-between px-4 mb-2.5">
          <Text className="text-slate-900 font-bold text-base">Popular Categories</Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/categories')}
            className="flex-row items-center">
            <Text className="text-teal-600 text-xs font-semibold">View All</Text>
            <ChevronRight size={14} color="#0D9488" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
          <TouchableOpacity
            onPress={() => setSelectedCategorySlug('all')}
            className={`mr-3 items-center ${selectedCategorySlug === 'all' ? 'opacity-100' : 'opacity-85'}`}>
            <View
              className={`w-14 h-14 rounded-2xl items-center justify-center border ${
                selectedCategorySlug === 'all'
                  ? 'bg-teal-600 border-teal-600 shadow-sm'
                  : 'bg-white border-slate-200'
              }`}>
              <ShoppingBag size={22} color={selectedCategorySlug === 'all' ? '#FFFFFF' : '#0D9488'} />
            </View>
            <Text
              numberOfLines={1}
              className={`text-[11px] font-semibold mt-1.5 ${
                selectedCategorySlug === 'all' ? 'text-teal-700 font-bold' : 'text-slate-700'
              }`}>
              All Items
            </Text>
          </TouchableOpacity>

          {MOCK_CATEGORIES.map((cat) => {
            const isSelected = selectedCategorySlug === cat.slug;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  setSelectedCategorySlug(cat.slug);
                  router.push({
                    pathname: '/(tabs)/categories',
                    params: { category: cat.slug },
                  });
                }}
                className="mr-3 items-center">
                <View
                  className={`w-14 h-14 rounded-2xl overflow-hidden border ${
                    isSelected ? 'border-teal-600 ring-2 ring-teal-500' : 'border-slate-200'
                  }`}>
                  <Image
                    source={{ uri: cat.image ?? undefined }}
                    className="w-full h-full bg-slate-100"
                    resizeMode="cover"
                  />
                </View>
                <Text
                  numberOfLines={1}
                  className="text-[11px] font-semibold text-slate-700 mt-1.5 max-w-[65px] text-center">
                  {cat.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Featured Products Section (2-Column Grid) */}
      <View className="px-4 mt-5">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Flame size={18} color="#D97706" />
            <Text className="text-slate-900 font-bold text-base ml-1.5">Featured Products</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
            <Text className="text-teal-600 text-xs font-semibold">Explore More</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {featuredProducts.map((product) => {
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
                  {/* Product Thumbnail */}
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

                  {/* Vendor Name */}
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

                  {/* Title */}
                  <Text numberOfLines={2} className="text-slate-800 font-semibold text-xs mt-1 leading-snug">
                    {product.title}
                  </Text>

                  {/* Rating */}
                  <View className="flex-row items-center mt-1.5">
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text className="text-slate-700 text-[11px] font-bold ml-1">{product.rating}</Text>
                    <Text className="text-slate-400 text-[10px] ml-1">({product.reviews_count})</Text>
                  </View>
                </View>

                {/* Price in PKR and Quick Add Button */}
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
      </View>

      {/* Trending on Bizzhuss Section */}
      <View className="px-4 mt-2 pb-12">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <TrendingUp size={18} color="#0D9488" />
            <Text className="text-slate-900 font-bold text-base ml-1.5">Trending on Bizzhuss</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
            <Text className="text-teal-600 text-xs font-semibold">See All</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {trendingProducts.map((product) => {
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
                    <View className="absolute top-2 left-2 bg-amber-500 px-2 py-0.5 rounded-md">
                      <Text className="text-slate-950 text-[10px] font-black uppercase">HOT</Text>
                    </View>
                  </View>

                  {product.vendor && (
                    <View className="flex-row items-center mt-2.5">
                      <Store size={11} color="#0D9488" />
                      <Text numberOfLines={1} className="text-teal-700 text-[11px] font-bold ml-1 flex-1">
                        {product.vendor.store_name}
                      </Text>
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
      </View>
    </ScrollView>
  );
}
