import { createClient } from '@supabase/supabase-js';
import { WatchProduct } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-supabase-anon')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Convert Supabase DB record to WatchProduct
export const mapDbProductToWatch = (row: any): WatchProduct => {
  return {
    id: row.id,
    model: row.model,
    series: row.series,
    gender: row.gender || 'Men',
    name: row.name,
    pricePKR: Number(row.price_pkr),
    originalPricePKR: row.original_price_pkr ? Number(row.original_price_pkr) : undefined,
    inStock: row.is_in_stock !== false,
    stockCount: row.stock_count || 10,
    isFeatured: Boolean(row.is_featured),
    rating: Number(row.rating || 4.9),
    reviewsCount: Number(row.reviews_count || 18),
    imageUrl: row.image_url,
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
    features: row.features || ['Genuine Casio Movement', 'Water Resistant']
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
    price_pkr: watch.pricePKR,
    original_price_pkr: watch.originalPricePKR || null,
    image_url: watch.imageUrl,
    description: watch.description,
    is_featured: Boolean(watch.isFeatured),
    is_in_stock: watch.inStock,
    rating: watch.rating,
    reviews_count: watch.reviewsCount,
    specs: watch.specs,
    features: watch.features,
    updated_at: new Date().toISOString()
  };
};

// Fetch live products from Supabase
export const fetchProductsFromSupabase = async (): Promise<WatchProduct[] | null> => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching products from Supabase:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(mapDbProductToWatch);
  } catch (err) {
    console.warn('Supabase fetch failed:', err);
    return null;
  }
};

// Insert or update product in Supabase
export const upsertProductInSupabase = async (product: WatchProduct): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }
  try {
    const payload = mapWatchToDbProduct(product);
    const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save product' };
  }
};

// Delete product in Supabase
export const deleteProductInSupabase = async (id: string): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete product' };
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
  if (!supabase) {
    // If Supabase is not connected, silently succeed for local frontend flow
    return { success: true };
  }
  try {
    const { error } = await supabase.from('orders').insert({
      id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      order_number: orderData.orderNumber,
      customer_name: orderData.customer.fullName,
      phone: orderData.customer.phone,
      email: orderData.customer.email || null,
      city: orderData.customer.city,
      address: orderData.customer.address,
      payment_method: orderData.paymentMethod,
      total_pkr: orderData.totalPKR,
      items: orderData.items,
      order_notes: orderData.customer.deliveryNotes || '',
      status: 'Pending'
    });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.warn('Failed to save order to Supabase:', err);
    return { success: false, error: err.message };
  }
};

// Fetch orders for Admin Panel
export const fetchOrdersFromSupabase = async () => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Error fetching orders:', err);
    return [];
  }
};

// Update order status in Supabase
export const updateOrderStatusInSupabase = async (orderId: string, status: string) => {
  if (!supabase) return false;
  try {
    const { error } = await supabase
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

// Seed initial watches in bulk to Supabase
export const bulkSeedProductsToSupabase = async (
  products: WatchProduct[], 
  onProgress?: (count: number, total: number) => void
): Promise<{ success: boolean; count: number; error?: string }> => {
  if (!supabase) return { success: false, count: 0, error: 'Supabase is not configured' };

  try {
    const batchSize = 25;
    let uploadedCount = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize).map(mapWatchToDbProduct);
      const { error } = await supabase.from('products').upsert(batch, { onConflict: 'id' });
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
