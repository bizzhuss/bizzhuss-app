import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import {
  Search,
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  BookOpen,
  Car,
  Gift,
  ChevronRight,
} from 'lucide-react-native';
import { Category } from '@/types';

const CATEGORIES_DATA: (Category & { iconComponent: React.ComponentType<{ size: number; color: string }> })[] = [
  {
    id: 1,
    name: 'Electronics & Gadgets',
    slug: 'electronics',
    description: 'Smartphones, audio, laptops & accessories',
    products_count: 1240,
    is_active: true,
    iconComponent: Smartphone,
  },
  {
    id: 2,
    name: 'Fashion & Apparel',
    slug: 'fashion',
    description: "Men, Women, Kids clothing & footwear",
    products_count: 3120,
    is_active: true,
    iconComponent: Shirt,
  },
  {
    id: 3,
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Furniture, kitchenware, decor & lighting',
    products_count: 850,
    is_active: true,
    iconComponent: Home,
  },
  {
    id: 4,
    name: 'Beauty & Wellness',
    slug: 'beauty-wellness',
    description: 'Skincare, makeup, fragrance & personal care',
    products_count: 670,
    is_active: true,
    iconComponent: Sparkles,
  },
  {
    id: 5,
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Fitness equipment, athletic gear & camping',
    products_count: 530,
    is_active: true,
    iconComponent: Dumbbell,
  },
  {
    id: 6,
    name: 'Books & Stationery',
    slug: 'books-stationery',
    description: 'Best-sellers, educational & office supplies',
    products_count: 420,
    is_active: true,
    iconComponent: BookOpen,
  },
  {
    id: 7,
    name: 'Automotive & Tools',
    slug: 'automotive-tools',
    description: 'Vehicle accessories, parts & hand tools',
    products_count: 310,
    is_active: true,
    iconComponent: Car,
  },
  {
    id: 8,
    name: 'Toys, Kids & Baby',
    slug: 'toys-kids-baby',
    description: 'Educational toys, nursery & maternity',
    products_count: 490,
    is_active: true,
    iconComponent: Gift,
  },
];

export default function CategoriesScreen() {
  const [query, setQuery] = useState('');

  const filtered = CATEGORIES_DATA.filter((cat) =>
    cat.name.toLowerCase().includes(query.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      {/* Search Header */}
      <View className="bg-white px-4 pt-3 pb-4 border-b border-slate-100">
        <View className="bg-slate-100 rounded-xl flex-row items-center px-3.5 py-2.5">
          <Search size={18} color="#64748B" />
          <TextInput
            placeholder="Search categories..."
            placeholderTextColor="#94A3B8"
            value={query}
            onChangeText={setQuery}
            className="flex-1 ml-2.5 text-slate-800 text-sm font-medium"
          />
        </View>
      </View>

      {/* Category List */}
      <View className="p-4 space-y-3 pb-12">
        {filtered.map((cat) => {
          const Icon = cat.iconComponent;
          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.7}
              className="bg-white rounded-2xl p-4 mb-3 border border-slate-100 shadow-sm flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 pr-3">
                <View className="w-12 h-12 rounded-xl bg-teal-50 items-center justify-center">
                  <Icon size={24} color="#0D9488" />
                </View>
                <View className="ml-3.5 flex-1">
                  <Text className="text-slate-900 font-bold text-sm">
                    {cat.name}
                  </Text>
                  <Text numberOfLines={1} className="text-slate-500 text-xs mt-0.5">
                    {cat.description}
                  </Text>
                  <Text className="text-teal-600 font-semibold text-[11px] mt-1">
                    {cat.products_count?.toLocaleString()} Products
                  </Text>
                </View>
              </View>

              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
