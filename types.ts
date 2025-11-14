export interface Category {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  businessId: number;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO date string
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
  googleMapsUrl?: string;
  // New fields for reviews
  reviews: Review[];
  averageRating: number;
}

export type View = 'home' | 'categories' | 'notifications' | 'zones' | 'map' | 'adminDashboard' | 'adminAddBusiness' | 'adminManageCategories' | 'adminClients' | 'adminEditBusiness' | 'adminManageBusinesses' | 'businessDetail' | 'advertise' | 'profile';
export type UserRole = 'user' | 'admin';