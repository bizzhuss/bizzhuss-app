export interface Vendor {
  id: number;
  user_id: number;
  store_name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  banner?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  rating?: number;
  reviews_count?: number;
  is_verified: boolean;
  created_at?: string;
}
