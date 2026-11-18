export type UserRole = 'customer' | 'vendor' | 'admin';

export interface Address {
  id?: number;
  user_id?: number;
  name: string;
  phone: string;
  street: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  avatar?: string | null;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
