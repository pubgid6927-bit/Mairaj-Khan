import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { WatchProduct } from '../types';

// Clean the supabaseUrl string before passing it to createClient:
// - Removes trailing slashes
// - Ensures NO extra paths like /rest/v1 or /db are appended to the base domain URL
export const cleanSupabaseUrl = (rawUrl?: string | null): string => {
  if (!rawUrl) return '';
  return rawUrl
    .trim()
    .replace(/\/+$|\/rest\/v1.*$|\/db.*$/g, '')
    .replace(/\/+$/, '');
};

// Strict environment variable resolution per specifications
const rawEnvUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/+$|\/rest\/v1.*$/g, '');
const rawEnvKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// LocalStorage stored fallback for in-browser setup
const getStoredUrl = (): string => {
  if (typeof window === 'undefined') return '';
  return cleanSupabaseUrl(localStorage.getItem('nme_supabase_url'));
};

const getStoredKey = (): string => {
  if (typeof window === 'undefined') return '';
  return (localStorage.getItem('nme_supabase_anon_key')?.trim() || '');
};

// Clean, base domain Supabase URL (no trailing slash, no /rest/v1 suffix)
export const supabaseUrl: string = (rawEnvUrl && !rawEnvUrl.includes('your-project-id'))
  ? cleanSupabaseUrl(rawEnvUrl)
  : (getStoredUrl() || 'https://placeholder.supabase.co');

export const supabaseAnonKey: string = (rawEnvKey && !rawEnvKey.includes('your-supabase-anon'))
  ? rawEnvKey
  : (getStoredKey() || 'placeholder-anon-key');

// Supabase client instance strictly initialized with sanitized base domain URL
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseUrl = (): string => {
  if (rawEnvUrl && !rawEnvUrl.includes('your-project-id')) return cleanSupabaseUrl(rawEnvUrl);
  return getStoredUrl();
};

export const getSupabaseAnonKey = (): string => {
  if (rawEnvKey && !rawEnvKey.includes('your-supabase-anon')) return rawEnvKey;
  return getStoredKey();
};

export const isSupabaseConfigured = (): boolean => {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(
    url && 
    key && 
    !url.includes('placeholder') &&
    !url.includes('your-project-id') &&
    !key.includes('placeholder') &&
    !key.includes('your-supabase-anon')
  );
};

let dynamicClient: SupabaseClient | null = null;
let currentDynamicUrl = '';
let currentDynamicKey = '';

export const getSupabaseClient = (): SupabaseClient => {
  const url = cleanSupabaseUrl(getSupabaseUrl());
  const key = getSupabaseAnonKey();

  if (!isSupabaseConfigured()) {
    return supabase;
  }

  if (!dynamicClient || currentDynamicUrl !== url || currentDynamicKey !== key) {
    try {
      dynamicClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      currentDynamicUrl = url;
      currentDynamicKey = key;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return supabase;
    }
  }

  return dynamicClient;
};

// Save Supabase credentials directly from Admin UI (auto-cleaned)
export const saveSupabaseCredentials = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    const cleaned = cleanSupabaseUrl(url);
    localStorage.setItem('nme_supabase_url', cleaned);
    localStorage.setItem('nme_supabase_anon_key', key.trim());
    dynamicClient = null; // force reload with new cleaned URL
  }
};

export const clearSupabaseCredentials = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('nme_supabase_url');
    localStorage.removeItem('nme_supabase_anon_key');
    dynamicClient = null;
  }
};

// Convert Supabase DB record to WatchProduct
export const mapDbProductToWatch = (row: any): WatchProduct => {
  return {
    id: String(row.id),
    model: String(row.model || ''),
    series: row.series,
    gender: row.gender || 'Men',
    name: String(row.name || ''),
    pricePKR: Number(row.price_pkr) || 0,
    originalPricePKR: row.original_price_pkr ? Number(row.original_price_pkr) : undefined,
    inStock: row.is_in_stock !== false,
    stockCount: typeof row.stock_count === 'number' ? row.stock_count : 10,
    isFeatured: Boolean(row.is_featured),
    isBestSeller: Boolean(row.is_best_seller),
    isNewArrival: Boolean(row.is_new_arrival),
    rating: Number(row.rating || 4.9),
    reviewsCount: Number(row.reviews_count || 18),
    imageUrl: row.image_url || 'https://watchcentre.pk/wp-content/uploads/2023/04/casio-mtp-1302d-2a2v-tiffany-blue-dial-watch.jpg',
    alternateImageUrl: row.alternate_image_url || undefined,
    description: row.description || '',
    specs: row.specs || {
      caseDiameter: '42mm',
      caseThickness: '9.8mm',
      waterResistance: '50 Meters',
      glassType: 'Mineral Crystal',
      bandMaterial: 'Stainless Steel',
      movement: 'Quartz',
      batteryLife: '3 Years',
      weight: '110g',
      warranty: '1 Year Official'
    },
    features: Array.isArray(row.features) && row.features.length > 0 
      ? row.features 
      : ['Genuine Casio Movement', 'Water Resistant']
  };
};

// Convert WatchProduct to Supabase DB record
export const mapWatchToDbProduct = (watch: WatchProduct) => {
  return {
    id: watch.id,
    model: watch.model,
    series: watch.series,
    gender: watch.gender,
    name: watch.name,
    price_pkr: Number(watch.pricePKR),
    original_price_pkr: watch.originalPricePKR ? Number(watch.originalPricePKR) : null,
    stock_count: typeof watch.stockCount === 'number' ? watch.stockCount : 10,
    image_url: watch.imageUrl,
    alternate_image_url: watch.alternateImageUrl || null,
    description: watch.description || '',
    is_featured: Boolean(watch.isFeatured),
    is_best_seller: Boolean(watch.isBestSeller),
    is_new_arrival: Boolean(watch.isNewArrival),
    is_in_stock: Boolean(watch.inStock),
    rating: Number(watch.rating || 4.9),
    reviews_count: Number(watch.reviewsCount || 18),
    specs: watch.specs || {},
    features: watch.features || [],
    updated_at: new Date().toISOString()
  };
};

// Fetch ALL live products directly from Supabase (No pagination limits, no mock fallback)
export const fetchProductsFromSupabase = async (): Promise<WatchProduct[]> => {
  const client = getSupabaseClient();
  if (!client) {
    console.info('Supabase client not configured');
    return [];
  }

  try {
    // Attempt query ordered by created_at descending (newest watches first)
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Query with created_at order failed, retrying without order:', error.message);
      // Fallback query if created_at column is not present
      const fallbackQuery = await client.from('products').select('*');
      if (fallbackQuery.error) {
        console.error('Supabase products fetch failed:', fallbackQuery.error.message);
        return [];
      }
      return (fallbackQuery.data || []).map(mapDbProductToWatch);
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(mapDbProductToWatch);
  } catch (err: any) {
    console.error('Supabase fetch failed:', err);
    return [];
  }
};

// Explicit clean INSERT query into Supabase 'products' table
export const insertProductIntoSupabase = async (
  product: WatchProduct
): Promise<{ success: boolean; data?: WatchProduct; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase is not configured. Please enter your Supabase URL & Anon Key.' };
  }

  try {
    const payload = {
      ...mapWatchToDbProduct(product),
      created_at: new Date().toISOString()
    };

    const { data, error } = await client
      .from('products')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Supabase INSERT error:', error);
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      data: data ? mapDbProductToWatch(data) : product 
    };
  } catch (err: any) {
    console.error('insertProductIntoSupabase exception:', err);
    return { success: false, error: err.message || 'Failed to insert watch into Supabase' };
  }
};

// Explicit clean UPDATE query into Supabase 'products' table
export const updateProductInSupabase = async (
  product: WatchProduct
): Promise<{ success: boolean; data?: WatchProduct; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  try {
    const payload = mapWatchToDbProduct(product);

    const { data, error } = await client
      .from('products')
      .update(payload)
      .eq('id', product.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase UPDATE error:', error);
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      data: data ? mapDbProductToWatch(data) : product 
    };
  } catch (err: any) {
    console.error('updateProductInSupabase exception:', err);
    return { success: false, error: err.message || 'Failed to update watch in Supabase' };
  }
};

// Insert or update (upsert) product in Supabase
export const upsertProductInSupabase = async (
  product: WatchProduct
): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase is not configured' };
  }
  try {
    const payload = mapWatchToDbProduct(product);
    const { error } = await client.from('products').upsert(payload, { onConflict: 'id' });
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save product' };
  }
};

// Delete product from Supabase
export const deleteProductInSupabase = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase is not configured' };
  }
  try {
    const { error } = await client.from('products').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete product' };
  }
};

// Test Supabase Connection & Table check
export const testSupabaseConnection = async (): Promise<{
  connected: boolean;
  count: number;
  message: string;
}> => {
  const client = getSupabaseClient();
  if (!client) {
    return { connected: false, count: 0, message: 'Missing Supabase URL or Anon Public Key.' };
  }
  try {
    const { data, error, count } = await client
      .from('products')
      .select('id', { count: 'exact', head: false })
      .limit(5);

    if (error) {
      return { connected: false, count: 0, message: `Database error: ${error.message}` };
    }

    const totalCount = count !== null && count !== undefined ? count : (data ? data.length : 0);
    return { 
      connected: true, 
      count: totalCount, 
      message: `Connection successful! Found ${totalCount} watches in 'products' table.` 
    };
  } catch (err: any) {
    return { connected: false, count: 0, message: `Network error: ${err.message || 'Connection failed'}` };
  }
};

// Save Customer Order in Supabase
export const saveOrderInSupabase = async (orderData: {
  orderNumber: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    city: string;
    address: string;
    deliveryNotes?: string;
  };
  paymentMethod: string;
  totalPKR: number;
  items: Array<{
    productId: string;
    model: string;
    name: string;
    pricePKR: number;
    quantity: number;
  }>;
}): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: true }; // offline fallback
  }
  try {
    const payload = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      order_number: orderData.orderNumber,
      customer_name: orderData.customer.fullName,
      phone: orderData.customer.phone,
      email: orderData.customer.email || null,
      city: orderData.customer.city,
      address: orderData.customer.address,
      payment_method: orderData.paymentMethod,
      total_pkr: orderData.totalPKR,
      items: orderData.items,
      order_notes: orderData.customer.deliveryNotes || null,
      status: 'Pending Verification',
      created_at: new Date().toISOString()
    };

    const { error } = await client.from('orders').insert([payload]);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.warn('Failed to save order to Supabase:', err.message);
    return { success: false, error: err.message };
  }
};

// Fetch customer orders from Supabase (for Admin Panel)
export const fetchOrdersFromSupabase = async (): Promise<any[]> => {
  const client = getSupabaseClient();
  if (!client) return [];
  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching orders:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Failed to fetch orders:', err);
    return [];
  }
};

// Update order status in Supabase
export const updateOrderStatusInSupabase = async (orderId: string, status: string) => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const { error } = await client
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Error updating order status:', err);
    return false;
  }
};

// Bulk seed starter watches to Supabase
export const bulkSeedProductsToSupabase = async (
  products: WatchProduct[], 
  onProgress?: (count: number, total: number) => void
): Promise<{ success: boolean; count: number; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, count: 0, error: 'Supabase is not configured' };

  try {
    const batchSize = 25;
    let uploadedCount = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize).map((p) => ({
        ...mapWatchToDbProduct(p),
        created_at: new Date().toISOString()
      }));
      const { error } = await client.from('products').upsert(batch, { onConflict: 'id' });
      if (error) throw error;

      uploadedCount += batch.length;
      if (onProgress) {
        onProgress(uploadedCount, products.length);
      }
    }

    return { success: true, count: uploadedCount };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || 'Bulk upload failed' };
  }
};

// Site Settings Interface
export interface SiteSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  timings: string;
  announcement: string;
  deliveryFee: number;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  storeName: 'New Madina Electronics',
  tagline: 'Authorized Casio Watch Store · Saddar Karachi',
  phone: '+92 321 3979883',
  whatsapp: '923213979883',
  address: 'Shop 141, 1st Floor, Paradise Shopping Centre, Saddar, Karachi',
  timings: '11:30 AM – 10:00 PM (Mon – Sat)',
  announcement: '100% ORIGINAL CASIO TIMEPIECES WITH OFFICIAL 1-YEAR NEW MADINA ELECTRONICS KARACHI STAMPED WARRANTY',
  deliveryFee: 0
};

// Fetch site settings from Supabase
export const fetchSiteSettingsFromSupabase = async (): Promise<SiteSettings | null> => {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('site_settings')
      .select('value')
      .eq('key', 'store_info')
      .single();

    if (error || !data || !data.value) return null;

    const v = data.value;
    return {
      storeName: v.store_name || DEFAULT_SITE_SETTINGS.storeName,
      tagline: v.tagline || DEFAULT_SITE_SETTINGS.tagline,
      phone: v.phone || DEFAULT_SITE_SETTINGS.phone,
      whatsapp: v.whatsapp || DEFAULT_SITE_SETTINGS.whatsapp,
      address: v.address || DEFAULT_SITE_SETTINGS.address,
      timings: v.timings || DEFAULT_SITE_SETTINGS.timings,
      announcement: v.announcement || DEFAULT_SITE_SETTINGS.announcement,
      deliveryFee: typeof v.delivery_fee === 'number' ? v.delivery_fee : DEFAULT_SITE_SETTINGS.deliveryFee
    };
  } catch (err) {
    console.warn('Failed to fetch site settings from Supabase:', err);
    return null;
  }
};

// Save site settings in Supabase
export const saveSiteSettingsInSupabase = async (settings: SiteSettings): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const payload = {
      key: 'store_info',
      value: {
        store_name: settings.storeName,
        tagline: settings.tagline,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        address: settings.address,
        timings: settings.timings,
        announcement: settings.announcement,
        delivery_fee: settings.deliveryFee
      },
      updated_at: new Date().toISOString()
    };

    const { error } = await client
      .from('site_settings')
      .upsert(payload, { onConflict: 'key' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Failed to save site settings to Supabase:', err);
    return false;
  }
};
