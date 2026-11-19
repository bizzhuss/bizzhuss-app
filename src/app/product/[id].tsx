import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Star,
  Plus,
  Minus,
  Store,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  ArrowRight,
  Share2,
  PackageOpen,
} from 'lucide-react-native';
import { useCartStore } from '@/store/useCartStore';
import { getProductById } from '@/api/catalog';
import { Product } from '@/types';

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    getProductById(id)
      .then((data) => {
        if (!isMounted) return;
        setProduct(data);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log('Error loading product details:', e);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const onRefresh = useCallback(async () => {
    if (!id) return;
    setIsRefreshing(true);
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (e) {
      console.log('Error refreshing product details:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0D9488" />
        <Text className="text-slate-500 text-xs mt-3 font-semibold">Loading Product Details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center p-6">
        <View className="w-16 h-16 rounded-full bg-slate-200 items-center justify-center mb-3">
          <PackageOpen size={30} color="#64748B" />
        </View>
        <Text className="text-slate-900 font-extrabold text-base mb-1">Product Not Found</Text>
        <Text className="text-slate-500 text-xs text-center max-w-[240px] mb-4">
          The requested product may no longer be available in our catalog.
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-teal-600 px-5 py-2.5 rounded-xl">
          <Text className="text-white text-xs font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = (product.images || []).map((img) => (typeof img === 'string' ? img : img.url));

  const currentPrice = product.sale_price ?? product.price;
  const discountPercent = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    Alert.alert(
      'Added to Cart',
      `${quantity}x "${product.title}" has been added to your Bizzhuss shopping cart.`,
      [
        { text: 'Keep Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => router.push('/(tabs)/cart') },
      ]
    );
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/checkout');
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#0D9488']} tintColor="#0D9488" />
        }>
        {/* Product Image Gallery Slider */}
        <View className="w-full h-80 bg-slate-100 relative">
          <Image
            source={{ uri: images[selectedImageIndex] || images[0] }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Share Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 items-center justify-center shadow-sm">
            <Share2 size={16} color="#0F172A" />
          </TouchableOpacity>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <View className="absolute bottom-4 left-4 bg-rose-600 px-3 py-1 rounded-full shadow-sm">
              <Text className="text-white text-xs font-black uppercase tracking-wider">
                {discountPercent}% OFF
              </Text>
            </View>
          )}
        </View>

        {/* Thumbnail Selector (if multiple images) */}
        {images.length > 1 && (
          <View className="flex-row px-4 py-2 bg-slate-50 border-b border-slate-100">
            {images.map((img, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedImageIndex(idx)}
                className={`mr-2.5 w-14 h-14 rounded-xl overflow-hidden border-2 ${
                  selectedImageIndex === idx ? 'border-teal-600' : 'border-slate-200'
                }`}>
                <Image source={{ uri: img }} className="w-full h-full" resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className="p-5 pb-24">
          {/* Price & Stock Header */}
          <View className="flex-row items-baseline justify-between mb-1">
            <View className="flex-row items-baseline">
              <Text className="text-teal-700 font-black text-2xl tracking-tight">
                Rs. {currentPrice.toLocaleString()}
              </Text>
              {product.sale_price && (
                <Text className="text-slate-400 text-sm line-through ml-2.5 font-medium">
                  Rs. {product.price.toLocaleString()}
                </Text>
              )}
            </View>

            {/* In-Stock Indicator */}
            <View className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <Text className="text-emerald-700 text-[11px] font-bold">
                {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity})` : 'Out of Stock'}
              </Text>
            </View>
          </View>

          {/* Product Title */}
          <Text className="text-slate-900 font-extrabold text-lg mt-1 leading-snug">
            {product.title}
          </Text>

          {/* Rating & Reviews Info */}
          <View className="flex-row items-center mt-2.5 pb-4 border-b border-slate-100">
            <View className="flex-row items-center bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              <Star size={13} color="#F59E0B" fill="#F59E0B" />
              <Text className="text-slate-900 font-bold text-xs ml-1">{product.rating}</Text>
            </View>
            <Text className="text-slate-500 text-xs ml-2">
              Based on {product.reviews_count} verified customer reviews
            </Text>
          </View>

          {/* Vendor Card */}
          {product.vendor && (
            <View className="bg-slate-50 rounded-2xl p-4 my-4 border border-slate-200/80 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 pr-2">
                <View className="w-11 h-11 rounded-full bg-teal-600 items-center justify-center shadow-xs">
                  <Store size={20} color="#FFFFFF" />
                </View>
                <View className="ml-3 flex-1">
                  <View className="flex-row items-center">
                    <Text numberOfLines={1} className="text-slate-900 font-bold text-sm">
                      {product.vendor.store_name}
                    </Text>
                    {product.vendor.is_verified && (
                      <CheckCircle2 size={13} color="#0D9488" className="ml-1" />
                    )}
                  </View>
                  <Text className="text-slate-500 text-xs mt-0.5">
                    Official Verified Vendor • {product.vendor.rating ?? 4.9} ★ Store
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/vendor/[id]',
                    params: { id: (product.vendor_id || product.vendor?.id || 101).toString() },
                  })
                }
                className="bg-white border border-teal-600 px-3 py-1.5 rounded-lg shadow-2xs">
                <Text className="text-teal-700 text-xs font-bold">Visit Store</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Quantity Selector */}
          <View className="flex-row items-center justify-between my-3 py-3 border-y border-slate-100">
            <View>
              <Text className="text-slate-900 font-bold text-sm">Select Quantity</Text>
              <Text className="text-slate-400 text-xs">Maximum 10 per order</Text>
            </View>

            <View className="flex-row items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white items-center justify-center shadow-2xs">
                <Minus size={16} color="#0F172A" />
              </TouchableOpacity>
              <Text className="text-slate-900 font-extrabold text-sm mx-4">{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.min(product.stock_quantity || 10, q + 1))}
                className="w-8 h-8 rounded-lg bg-white items-center justify-center shadow-2xs">
                <Plus size={16} color="#0F172A" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Guarantee Badges */}
          <View className="bg-teal-50/60 rounded-2xl p-4 my-3 border border-teal-100 space-y-2.5">
            <View className="flex-row items-center">
              <Truck size={16} color="#0D9488" />
              <Text className="text-slate-800 text-xs font-semibold ml-2.5">
                Nationwide Express Courier (1-3 business days)
              </Text>
            </View>
            <View className="flex-row items-center">
              <RotateCcw size={16} color="#0D9488" />
              <Text className="text-slate-800 text-xs font-semibold ml-2.5">
                7 Days Easy Return & Exchange Guarantee
              </Text>
            </View>
            <View className="flex-row items-center">
              <ShieldCheck size={16} color="#0D9488" />
              <Text className="text-slate-800 text-xs font-semibold ml-2.5">
                Cash on Delivery (COD) / JazzCash / Card Verified
              </Text>
            </View>
          </View>

          {/* Description Section */}
          <View className="mt-4">
            <Text className="text-slate-900 font-bold text-base mb-2">Product Description</Text>
            <Text className="text-slate-600 text-sm leading-relaxed mb-4">
              {product.description}
            </Text>

            {product.sku && (
              <View className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex-row justify-between">
                <Text className="text-slate-500 text-xs font-medium">SKU Reference</Text>
                <Text className="text-slate-800 text-xs font-bold font-mono">{product.sku}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View className="bg-white border-t border-slate-200 px-5 py-3 flex-row items-center justify-between shadow-lg">
        <View>
          <Text className="text-slate-400 text-[11px] font-semibold uppercase">Total</Text>
          <Text className="text-slate-900 font-black text-lg">
            Rs. {(currentPrice * quantity).toLocaleString()}
          </Text>
        </View>

        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={handleAddToCart}
            activeOpacity={0.8}
            className="bg-slate-100 border border-slate-300 px-4 py-3 rounded-xl flex-row items-center mr-2">
            <ShoppingBag size={16} color="#0F172A" />
            <Text className="text-slate-900 font-bold text-xs ml-1.5">Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBuyNow}
            activeOpacity={0.8}
            className="bg-teal-600 px-6 py-3 rounded-xl flex-row items-center shadow-sm">
            <Text className="text-white font-extrabold text-xs mr-1">Buy Now</Text>
            <ArrowRight size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
