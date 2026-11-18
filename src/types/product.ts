import { Category } from './category';
import { Vendor } from './vendor';

export interface ProductImage {
  id?: number;
  url: string;
  alt?: string;
  is_primary?: boolean;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description?: string | null;
  price: number;
  regular_price?: number | null;
  sale_price?: number | null;
  stock_quantity: number;
  sku?: string | null;
  images: string[] | ProductImage[];
  category_id: number;
  category?: Category;
  vendor_id: number;
  vendor?: Vendor;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
}
