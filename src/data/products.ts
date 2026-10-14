import { WatchProduct } from '../types';

// ==============================================================================
// LIVE SUPABASE ARCHITECTURE: NO MOCK DATA FALLBACKS
// ==============================================================================
// Per clean database reset requirements, all product records are read and written
// exclusively live from the connected Supabase 'products' table.
// These exports are maintained as empty arrays to prevent any accidental mock overrides.

export const WATCH_PRODUCTS: WatchProduct[] = [];
export const ALL_PRODUCTS: WatchProduct[] = [];
