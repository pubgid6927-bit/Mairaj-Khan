export type WatchSeries = 
  | 'Casio MTP' 
  | 'Casio LTP' 
  | 'Casio Edifice' 
  | 'Casio G-Shock' 
  | 'Casio Vintage' 
  | 'Casio ProTrek';

export type BandMaterial = 'Stainless Steel' | 'Resin / Silicone' | 'Genuine Leather' | 'Titanium' | 'Milanese Mesh';

export type MovementType = 'Quartz' | 'Tough Solar' | 'Bluetooth Smart' | 'Digital' | 'Chronograph' | 'Multi-Band 6 Atomic';

export interface WatchProduct {
  id: string;
  model: string;
  series: WatchSeries;
  gender: 'Men' | 'Ladies' | 'Unisex';
  name: string;
  pricePKR: number;
  originalPricePKR?: number | null;
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  alternateImageUrl?: string;
  description: string;
  specs: {
    caseDiameter: string;
    caseThickness: string;
    waterResistance: string;
    glassType: string;
    bandMaterial: BandMaterial;
    movement: MovementType;
    batteryLife: string;
    weight: string;
    accuracy?: string;
    warranty: string;
  };
  features: string[];
}

export interface CartItem {
  product: WatchProduct;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  deliveryNotes?: string;
}

export type PaymentMethodType = 'cod' | 'bank_transfer' | 'jazzcash_easypaisa' | 'whatsapp_order';

export interface Order {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  customer: CustomerDetails;
  paymentMethod: PaymentMethodType;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'Pending Verification' | 'Confirmed' | 'Dispatched' | 'Delivered';
}

export interface CustomerReview {
  id: string;
  author: string;
  city: string;
  watchPurchased: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}
