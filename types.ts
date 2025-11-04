export interface Business {
  id: number;
  name: string;
  logoUrl: string;
  description: string;
  services: string[];
  products: string[];
  categoryId: number;
  phone: string;
  whatsapp: string;
  website: string;
  isFeatured: boolean;
}

export interface Category {
  id: number;
  name: string;
}
