import { apiClient } from './client';
import { Category, Product, Vendor } from '@/types';
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_VENDORS,
  PROMO_BANNERS,
  PAKISTANI_CITIES,
  CityDeliveryInfo,
  PromoBanner,
} from '@/data/mockData';

export interface HomeDataResponse {
  banners: PromoBanner[];
  categories: Category[];
  featuredProducts: Product[];
  trendingProducts: Product[];
  vendors: Vendor[];
}

export interface ProductQueryParams {
  category?: string;
  search?: string;
  vendor_id?: number;
  page?: number;
  per_page?: number;
  sort?: 'price_asc' | 'price_desc' | 'popular' | 'latest';
}

/**
 * Fetch home screen aggregated data (banners, top categories, featured & trending products)
 */
export async function getHomeData(): Promise<HomeDataResponse> {
  try {
    const res = await apiClient.get<HomeDataResponse | { data: HomeDataResponse }>('/home');
    const data = 'data' in res.data ? res.data.data : res.data;
    if (data && data.featuredProducts?.length > 0) {
      return data;
    }
  } catch (error) {
    console.log('[API:catalog] /home endpoint unreachable, serving cached/mock marketplace dataset', error);
  }

  // Graceful fallback during offline development / until backend /home endpoint is populated
  return {
    banners: PROMO_BANNERS,
    categories: MOCK_CATEGORIES,
    featuredProducts: MOCK_PRODUCTS.filter((p) => p.is_featured),
    trendingProducts: MOCK_PRODUCTS.slice(2, 6),
    vendors: MOCK_VENDORS,
  };
}

/**
 * Query products with category, search query, vendor, and pagination filters
 */
export async function getProducts(params?: ProductQueryParams): Promise<{ data: Product[]; total: number }> {
  try {
    const res = await apiClient.get<{ data: Product[]; total?: number }>('/products', { params });
    if (res.data?.data && Array.isArray(res.data.data)) {
      return {
        data: res.data.data,
        total: res.data.total ?? res.data.data.length,
      };
    }
  } catch (error) {
    console.log('[API:catalog] /products query fallback:', error);
  }

  // Filter local dataset
  let result = [...MOCK_PRODUCTS];

  if (params?.category && params.category !== 'all') {
    result = result.filter((p) => p.category?.slug === params.category || p.category_id.toString() === params.category);
  }

  if (params?.vendor_id) {
    result = result.filter((p) => p.vendor_id === params.vendor_id);
  }

  if (params?.search && params.search.trim()) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.vendor?.store_name.toLowerCase().includes(q)
    );
  }

  return {
    data: result,
    total: result.length,
  };
}

/**
 * Fetch a single product by ID or slug
 */
export async function getProductById(id: number | string): Promise<Product> {
  try {
    const res = await apiClient.get<Product | { data: Product }>(`/products/${id}`);
    const data = 'data' in res.data ? res.data.data : res.data;
    if (data && data.id) {
      return data;
    }
  } catch (error) {
    console.log(`[API:catalog] /products/${id} fallback:`, error);
  }

  const found = MOCK_PRODUCTS.find((p) => p.id.toString() === id.toString());
  if (found) return found;

  return MOCK_PRODUCTS[0];
}

/**
 * Fetch all active categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await apiClient.get<Category[] | { data: Category[] }>('/categories');
    const data = 'data' in res.data ? res.data.data : res.data;
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (error) {
    console.log('[API:catalog] /categories fallback:', error);
  }

  return MOCK_CATEGORIES;
}

/**
 * Fetch verified vendors list
 */
export async function getVendors(): Promise<Vendor[]> {
  try {
    const res = await apiClient.get<Vendor[] | { data: Vendor[] }>('/vendors');
    const data = 'data' in res.data ? res.data.data : res.data;
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (error) {
    console.log('[API:catalog] /vendors fallback:', error);
  }

  return MOCK_VENDORS;
}

/**
 * Fetch vendor store profile and its catalog of products
 */
export async function getVendorById(id: number | string): Promise<{ vendor: Vendor; products: Product[] }> {
  try {
    const res = await apiClient.get<{ vendor: Vendor; products: Product[] } | { data: { vendor: Vendor; products: Product[] } }>(
      `/vendors/${id}`
    );
    const data = 'data' in res.data ? res.data.data : res.data;
    if (data?.vendor) {
      return data;
    }
  } catch (error) {
    console.log(`[API:catalog] /vendors/${id} fallback:`, error);
  }

  const vendor = MOCK_VENDORS.find((v) => v.id.toString() === id.toString()) || MOCK_VENDORS[0];
  const products = MOCK_PRODUCTS.filter((p) => p.vendor_id === vendor.id);

  return { vendor, products };
}

/**
 * Fetch nationwide city shipping rates and delivery ETAs
 */
export async function getShippingRates(): Promise<CityDeliveryInfo[]> {
  try {
    const res = await apiClient.get<CityDeliveryInfo[] | { data: CityDeliveryInfo[] }>('/shipping-rates');
    const data = 'data' in res.data ? res.data.data : res.data;
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (error) {
    console.log('[API:catalog] /shipping-rates fallback:', error);
  }

  return PAKISTANI_CITIES;
}
