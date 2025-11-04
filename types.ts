
export interface Category {
  id: number;
  name: string;
}

export interface Business {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
  phone: string;
  whatsapp: string;
  website: string;
  categoryId: number;
  services: string[];
  products: string[];
  isFeatured: boolean;
}
