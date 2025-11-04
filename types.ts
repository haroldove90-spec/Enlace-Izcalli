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
  // Admin fields
  email?: string;
  ownerName?: string;
  promotions?: string[];
  location?: string;
}

export interface Category {
  id: number;
  name: string;
}