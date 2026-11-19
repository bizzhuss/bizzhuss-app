import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin,
  Phone,
  User,
  ChevronDown,
  Check,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  PackageCheck,
} from 'lucide-react-native';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { getShippingRates } from '@/api/catalog';
import { createOrder } from '@/api/orders';
import { CityDeliveryInfo, PAKISTANI_CITIES } from '@/data/mockData';

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const { user, placeOrder } = useAuthStore();

  const [cities, setCities] = useState<CityDeliveryInfo[]>(PAKISTANI_CITIES);
  const [fullName, setFullName] = useState(user?.name || 'Haseeb Khan');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '+92 300 1234567');
  const [streetAddress, setStreetAddress] = useState('House 42-B, Street 7, Block 4');
  const [selectedCity, setSelectedCity] = useState<CityDeliveryInfo>(PAKISTANI_CITIES[0]);
  const [isCityModalVisible, setIsCityModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'wallet' | 'card'>('cod');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isOrderSuccessModalVisible, setIsOrderSuccessModalVisible] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');

  useEffect(() => {
    async function loadRates() {
      try {
        const data = await getShippingRates();
        if (data && data.length > 0) {
          setCities(data);
          setSelectedCity(data[0]);
        }
      } catch (e) {
        console.log('Error fetching shipping rates:', e);
      }
    }
    loadRates();
  }, []);

  const sub = subtotal();
  const isFreeDelivery = sub >= 5000;
  const shippingFee = isFreeDelivery ? 0 : selectedCity.fee;
  const totalAmount = sub + shippingFee;

  const handlePlaceOrder = async () => {
    if (!fullName.trim() || !phoneNumber.trim() || !streetAddress.trim()) {
      Alert.alert('Required Information', 'Please fill in your name, contact phone, and delivery address.');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Please add products before checking out.');
      router.replace('/(tabs)');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const paymentMethodLabel =
        paymentMethod === 'cod'
          ? 'Cash on Delivery (COD)'
          : paymentMethod === 'wallet'
          ? 'JazzCash / Easypaisa'
          : 'Debit / Credit Card';

      // Submit to real API endpoint /orders
      const order = await createOrder({
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          price: i.product.sale_price ?? i.product.price,
          selected_attributes: i.selectedAttributes,
        })),
        shipping_address: {
          name: fullName,
          phone: phoneNumber,
          street: streetAddress,
          city: selectedCity.name,
          postal_code: '75000',
          country: 'Pakistan',
        },
        payment_method: paymentMethodLabel,
        shipping_fee: shippingFee,
      });

      setPlacedOrderNumber(order.order_number);
      placeOrder(order);
      clearCart();
      setIsOrderSuccessModalVisible(true);
    } catch (e: any) {
      Alert.alert('Order Placement Failed', e.message || 'Unable to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleFinishAndGoToOrders = () => {
    setIsOrderSuccessModalVisible(false);
    router.replace('/(tabs)/account');
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-4 pt-3 pb-8" showsVerticalScrollIndicator={false}>
        {/* Section 1: Delivery Address */}
        <View className="bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm">
          <View className="flex-row items-center mb-3">
            <MapPin size={18} color="#0D9488" />
            <Text className="text-slate-900 font-bold text-sm ml-2">Delivery Address (Pakistan)</Text>
          </View>

          {/* Recipient Name */}
          <View className="mb-3">
            <Text className="text-slate-700 text-xs font-semibold mb-1">Full Name</Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
              <User size={15} color="#94A3B8" />
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Receiver name"
                className="flex-1 ml-2 text-slate-800 text-xs font-medium"
              />
            </View>
          </View>

          {/* Contact Phone */}
          <View className="mb-3">
            <Text className="text-slate-700 text-xs font-semibold mb-1">Mobile Phone Number</Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
              <Phone size={15} color="#94A3B8" />
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholder="+92 300 0000000"
                className="flex-1 ml-2 text-slate-800 text-xs font-medium"
              />
            </View>
          </View>

          {/* Street Address */}
          <View className="mb-3">
            <Text className="text-slate-700 text-xs font-semibold mb-1">Street Address, House/Flat #</Text>
            <View className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
              <TextInput
                value={streetAddress}
                onChangeText={setStreetAddress}
                placeholder="Area, Street, House / Flat number"
                className="text-slate-800 text-xs font-medium"
              />
            </View>
          </View>

          {/* City Dropdown Selector */}
          <View>
            <Text className="text-slate-700 text-xs font-semibold mb-1">Delivery City (Dynamic Rates)</Text>
            <TouchableOpacity
              onPress={() => setIsCityModalVisible(true)}
              activeOpacity={0.8}
              className="flex-row items-center justify-between bg-teal-50 border border-teal-200 rounded-xl px-3.5 py-3">
              <View>
                <Text className="text-teal-900 font-extrabold text-xs">{selectedCity.name}</Text>
                <Text className="text-teal-700 text-[10px] mt-0.5">
                  Delivery Rate: {isFreeDelivery ? 'FREE' : `Rs. ${selectedCity.fee}`} • Est: {selectedCity.estimatedDays}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-teal-600 text-xs font-bold mr-1">Change</Text>
                <ChevronDown size={14} color="#0D9488" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 2: Payment Method */}
        <View className="bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm">
          <Text className="text-slate-900 font-bold text-sm mb-3">Select Payment Method</Text>

          {/* Cash on Delivery */}
          <TouchableOpacity
            onPress={() => setPaymentMethod('cod')}
            activeOpacity={0.8}
            className={`p-3.5 rounded-xl border mb-2.5 flex-row items-center justify-between ${
              paymentMethod === 'cod' ? 'border-teal-600 bg-teal-50/50' : 'border-slate-200 bg-slate-50'
            }`}>
            <View className="flex-row items-center flex-1">
              <View className="w-9 h-9 rounded-lg bg-teal-600 items-center justify-center">
                <Banknote size={18} color="#FFFFFF" />
              </View>
              <View className="ml-3 flex-1">
                <View className="flex-row items-center">
                  <Text className="text-slate-900 font-bold text-xs">Cash on Delivery (COD)</Text>
                  <View className="bg-amber-100 px-1.5 py-0.5 rounded ml-1.5">
                    <Text className="text-amber-800 text-[9px] font-black uppercase">POPULAR</Text>
                  </View>
                </View>
                <Text className="text-slate-500 text-[10px] mt-0.5">Pay in cash when rider arrives at your doorstep</Text>
              </View>
            </View>
            <View className={`w-5 h-5 rounded-full border items-center justify-center ${
              paymentMethod === 'cod' ? 'border-teal-600 bg-teal-600' : 'border-slate-300'
            }`}>
              {paymentMethod === 'cod' && <Check size={12} color="#FFFFFF" />}
            </View>
          </TouchableOpacity>

          {/* JazzCash / Easypaisa */}
          <TouchableOpacity
            onPress={() => setPaymentMethod('wallet')}
            activeOpacity={0.8}
            className={`p-3.5 rounded-xl border mb-2.5 flex-row items-center justify-between ${
              paymentMethod === 'wallet' ? 'border-teal-600 bg-teal-50/50' : 'border-slate-200 bg-slate-50'
            }`}>
            <View className="flex-row items-center flex-1">
              <View className="w-9 h-9 rounded-lg bg-rose-600 items-center justify-center">
                <Smartphone size={18} color="#FFFFFF" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-slate-900 font-bold text-xs">JazzCash / Easypaisa Mobile Account</Text>
                <Text className="text-slate-500 text-[10px] mt-0.5">Instant OTP verification with direct wallet debit</Text>
              </View>
            </View>
            <View className={`w-5 h-5 rounded-full border items-center justify-center ${
              paymentMethod === 'wallet' ? 'border-teal-600 bg-teal-600' : 'border-slate-300'
            }`}>
              {paymentMethod === 'wallet' && <Check size={12} color="#FFFFFF" />}
            </View>
          </TouchableOpacity>

          {/* Debit/Credit Card */}
          <TouchableOpacity
            onPress={() => setPaymentMethod('card')}
            activeOpacity={0.8}
            className={`p-3.5 rounded-xl border flex-row items-center justify-between ${
              paymentMethod === 'card' ? 'border-teal-600 bg-teal-50/50' : 'border-slate-200 bg-slate-50'
            }`}>
            <View className="flex-row items-center flex-1">
              <View className="w-9 h-9 rounded-lg bg-indigo-600 items-center justify-center">
                <CreditCard size={18} color="#FFFFFF" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-slate-900 font-bold text-xs">Visa / Mastercard / PayPak</Text>
                <Text className="text-slate-500 text-[10px] mt-0.5">Secure 3D-authentication payment</Text>
              </View>
            </View>
            <View className={`w-5 h-5 rounded-full border items-center justify-center ${
              paymentMethod === 'card' ? 'border-teal-600 bg-teal-600' : 'border-slate-300'
            }`}>
              {paymentMethod === 'card' && <Check size={12} color="#FFFFFF" />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Section 3: Order Summary */}
        <View className="bg-white rounded-2xl p-4 mb-20 border border-slate-100 shadow-sm">
          <Text className="text-slate-900 font-bold text-sm mb-3">Order Final Summary</Text>

          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-500 text-xs">Items Subtotal ({items.length})</Text>
            <Text className="text-slate-800 font-bold text-xs">Rs. {sub.toLocaleString()}</Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-500 text-xs">Delivery to {selectedCity.name}</Text>
            <Text className="text-teal-700 font-bold text-xs">
              {isFreeDelivery ? 'FREE (Orders > Rs. 5,000)' : `Rs. ${selectedCity.fee}`}
            </Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-500 text-xs">Estimated Delivery Time</Text>
            <Text className="text-slate-800 font-bold text-xs">{selectedCity.estimatedDays}</Text>
          </View>

          <View className="h-px bg-slate-100 my-2.5" />

          <View className="flex-row justify-between items-center">
            <Text className="text-slate-900 font-black text-sm">Payable Amount</Text>
            <Text className="text-teal-700 font-black text-lg">Rs. {totalAmount.toLocaleString()}</Text>
          </View>

          <View className="flex-row items-center mt-3 pt-2 border-t border-slate-50">
            <ShieldCheck size={14} color="#0D9488" />
            <Text className="text-slate-500 text-[10px] ml-1.5">
              Buyer Protection Guaranteed • 7 Days Return Policy
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Place Order Button Bar */}
      <View className="bg-white border-t border-slate-200 px-5 py-3.5 flex-row items-center justify-between shadow-lg">
        <View>
          <Text className="text-slate-400 text-[10px] font-bold uppercase">Total Payable</Text>
          <Text className="text-slate-900 font-black text-lg">Rs. {totalAmount.toLocaleString()}</Text>
        </View>

        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder}
          activeOpacity={0.8}
          className="bg-teal-600 px-8 py-3.5 rounded-xl flex-row items-center shadow-sm">
          {isPlacingOrder ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text className="text-white font-black text-xs mr-2 tracking-wide uppercase">
                Confirm & Place Order
              </Text>
              <ArrowRight size={14} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* City Dropdown Selection Modal */}
      <Modal visible={isCityModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5 max-h-[75%]">
            <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
              <Text className="text-slate-900 font-extrabold text-base">Select Delivery City</Text>
              <TouchableOpacity onPress={() => setIsCityModalVisible(false)} className="p-1">
                <Text className="text-teal-600 font-bold text-xs">Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="mt-3">
              {cities.map((city) => {
                const isSelected = selectedCity.name === city.name;
                return (
                  <TouchableOpacity
                    key={city.name}
                    onPress={() => {
                      setSelectedCity(city);
                      setIsCityModalVisible(false);
                    }}
                    className={`flex-row items-center justify-between p-3.5 rounded-xl mb-2 ${
                      isSelected ? 'bg-teal-50 border border-teal-200' : 'bg-slate-50'
                    }`}>
                    <View>
                      <Text className={`text-xs font-bold ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                        {city.name}
                      </Text>
                      <Text className="text-slate-500 text-[10px] mt-0.5">
                        Standard Delivery: Rs. {city.fee} • Transit: {city.estimatedDays}
                      </Text>
                    </View>

                    {isSelected && (
                      <View className="w-5 h-5 rounded-full bg-teal-600 items-center justify-center">
                        <Check size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Order Placement Success Modal */}
      <Modal visible={isOrderSuccessModalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm items-center shadow-xl">
            <View className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 items-center justify-center mb-3">
              <PackageCheck size={36} color="#0D9488" />
            </View>

            <Text className="text-slate-900 font-black text-xl text-center">Order Confirmed!</Text>
            <Text className="text-teal-700 font-bold text-xs mt-1">Order #{placedOrderNumber}</Text>

            <Text className="text-slate-500 text-xs text-center mt-2.5 leading-relaxed">
              Thank you for shopping on Bizzhuss! Your order has been registered on our Laravel API and will be dispatched to{' '}
              <Text className="font-bold text-slate-700">{selectedCity.name}</Text> within {selectedCity.estimatedDays}.
            </Text>

            <View className="w-full bg-slate-50 rounded-xl p-3 my-4 border border-slate-100">
              <View className="flex-row justify-between mb-1">
                <Text className="text-slate-500 text-[11px]">Total Payable:</Text>
                <Text className="text-slate-900 font-bold text-[11px]">Rs. {totalAmount.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-slate-500 text-[11px]">Payment Mode:</Text>
                <Text className="text-teal-700 font-bold text-[11px]">
                  {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Paid'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleFinishAndGoToOrders}
              activeOpacity={0.8}
              className="bg-teal-600 w-full py-3.5 rounded-xl items-center shadow-sm">
              <Text className="text-white font-bold text-xs uppercase tracking-wide">
                View in My Orders
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
