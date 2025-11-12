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
  ownerName: string;
  ownerEmail:string;
  isActive: boolean;
  promotionEndDate: string; // ISO date string
  address: string;
  latitude: number;
  longitude: number;
}

export type View = 'home' | 'categories' | 'notifications' | 'zones' | 'adminDashboard' | 'adminAddBusiness' | 'adminManageCategories' | 'adminClients' | 'adminEditBusiness' | 'adminManageBusinesses';
export type UserRole = 'user' | 'admin';
