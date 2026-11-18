import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Search, Sparkles, Star, Plus, Store } from 'lucide-react-native';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';

// Sample curated multi-vendor products to showcase the store
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Wireless Noise Canceling Headphones',
    slug: 'wireless-noise-canceling-headphones',
    description: 'Premium active noise-canceling over-ear Bluetooth headphones.',
    price: 149.99,
    sale_price: 129.99,
    stock_quantity: 25,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'],
    category_id: 1,
    vendor_id: 101,
    vendor: {
      id: 101,
      user_id: 2,
      store_name: 'SoundWave Audio',
      slug: 'soundwave-audio',
      is_verified: true,
      rating: 4.8,
    },
    rating: 4.9,
    reviews_count: 128,
    is_featured: true,
    is_active: true,
  },
  {
    id: 2,
    title: 'Minimalist Mechanical Keyboard',
    slug: 'minimalist-mechanical-keyboard',
    description: 'Custom hot-swappable tactile RGB mechanical keyboard.',
    price: 99.0,
    sale_price: 84.99,
    stock_quantity: 15,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80'],
    category_id: 1,
    vendor_id: 102,
    vendor: {
      id: 102,
      user_id: 3,
      store_name: 'TechGear Lab',
      slug: 'techgear-lab',
      is_verified: true,
      rating: 4.9,
    },
    rating: 4.8,
    reviews_count: 85,
    is_featured: true,
    is_active: true,
  },
  {
    id: 3,
    title: 'Eco Leather Everyday Backpack',
    slug: 'eco-leather-everyday-backpack',
    description: 'Water-resistant vintage vegan leather laptop travel pack.',
    price: 79.5,
    sale_price: 65.0,
    stock_quantity: 30,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80'],
    category_id: 2,
    vendor_id: 103,
    vendor: {
      id: 103,
      user_id: 4,
      store_name: 'Nomad Goods Co',
      slug: 'nomad-goods-co',
      is_verified: true,
      rating: 4.7,
    },
    rating: 4.7,
    reviews_count: 94,
    is_featured: true,
    is_active: true,
  },
  {
    id: 4,
    title: 'Ceramic Pour-Over Coffee Set',
    slug: 'ceramic-pour-over-coffee-set',
    description: 'Artisan hand-crafted ceramic dripper with wooden collar.',
    price: 45.0,
    sale_price: 39.0,
    stock_quantity: 20,
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80'],
    category_id: 3,
    vendor_id: 104,
    vendor: {
      id: 104,
      user_id: 5,
      store_name: 'Roast & Brew Craft',
      slug: 'roast-brew-craft',
      is_verified: true,
      rating: 5.0,
    },
    rating: 5.0,
    reviews_count: 42,
    is_featured: true,
    is_active: true,
  },
];

const CATEGORY_CHIPS = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports'];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [selectedChip, setSelectedChip] = useState('All');
  const addItem = useCartStore((state) => state.addItem);

  const filteredProducts = SAMPLE_PRODUCTS.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      {/* Hero Banner */}
      <View className="bg-teal-700 px-5 pt-4 pb-6 rounded-b-3xl shadow-sm">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-white text-2xl font-bold tracking-tight">BIZZHUSS</Text>
            <Text className="text-teal-100 text-xs mt-0.5">Multi-Vendor Marketplace</Text>
          </View>
          <View className="bg-teal-800/80 px-3 py-1.5 rounded-full flex-row items-center">
            <Sparkles size={14} color="#5EEAD4" />
            <Text className="text-teal-200 text-xs font-semibold ml-1.5">Official Sellers</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="bg-white rounded-xl flex-row items-center px-3.5 py-2.5 mt-2 shadow-sm">
          <Search size={18} color="#64748B" />
          <TextInput
            placeholder="Search verified products, vendors..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            className="flex-1 ml-2.5 text-slate-800 text-sm font-medium"
          />
        </View>
      </View>

      {/* Categories Filter Bar */}
      <View className="py-3 px-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {CATEGORY_CHIPS.map((chip) => {
            const isActive = selectedChip === chip;
            return (
              <TouchableOpacity
                key={chip}
                onPress={() => setSelectedChip(chip)}
                className={`mr-2 px-4 py-2 rounded-full border ${
                  isActive
                    ? 'bg-teal-600 border-teal-600'
                    : 'bg-white border-slate-200'
                }`}>
                <Text
                  className={`text-xs font-semibold ${
                    isActive ? 'text-white' : 'text-slate-600'
                  }`}>
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Featured Products Section */}
      <View className="px-4 pb-12">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-slate-900 font-bold text-lg">Featured Products</Text>
          <Text className="text-teal-600 text-xs font-semibold">See All</Text>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {filteredProducts.map((product) => {
            const imageUrl = typeof product.images[0] === 'string'
              ? product.images[0]
              : product.images[0]?.url;

            return (
              <View
                key={product.id}
                className="w-[48%] bg-white rounded-2xl mb-4 p-3 border border-slate-100 shadow-sm justify-between">
                <View>
                  {/* Product Image */}
                  <Image
                    source={{ uri: imageUrl }}
                    className="w-full h-32 rounded-xl bg-slate-100"
                    resizeMode="cover"
                  />

                  {/* Vendor Tag */}
                  {product.vendor && (
                    <View className="flex-row items-center mt-2.5">
                      <Store size={12} color="#0D9488" />
                      <Text
                        numberOfLines={1}
                        className="text-teal-700 text-[11px] font-semibold ml-1 flex-1">
                        {product.vendor.store_name}
                      </Text>
                    </View>
                  )}

                  {/* Product Title */}
                  <Text
                    numberOfLines={2}
                    className="text-slate-800 font-semibold text-xs mt-1.5">
                    {product.title}
                  </Text>

                  {/* Rating */}
                  <View className="flex-row items-center mt-1">
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text className="text-slate-700 text-[11px] font-medium ml-1">
                      {product.rating}
                    </Text>
                    <Text className="text-slate-400 text-[10px] ml-0.5">
                      ({product.reviews_count})
                    </Text>
                  </View>
                </View>

                {/* Price & Add to Cart Button */}
                <View className="flex-row items-center justify-between mt-3 pt-2 border-t border-slate-100">
                  <View>
                    <Text className="text-slate-900 font-bold text-sm">
                      ${product.sale_price ?? product.price}
                    </Text>
                    {product.sale_price && (
                      <Text className="text-slate-400 text-[10px] line-through">
                        ${product.price}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => addItem(product, 1)}
                    activeOpacity={0.8}
                    className="bg-teal-600 w-8 h-8 rounded-full items-center justify-center">
                    <Plus size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
