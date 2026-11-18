export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  parent_id?: number | null;
  products_count?: number;
  is_active: boolean;
}
