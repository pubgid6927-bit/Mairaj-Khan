import React, { useState, useEffect } from 'react';
import { WatchProduct, WatchSeries, BandMaterial, MovementType } from '../types';
import { formatPKR, useCart } from '../context/CartContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { 
  X, 
  Lock, 
  Database, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RefreshCw, 
  Package, 
  ShoppingBag, 
  AlertCircle, 
  Search, 
  MessageCircle,
  ExternalLink,
  UploadCloud,
  Copy,
  Sliders,
  Globe,
  Phone,
  MapPin,
  Clock,
  Truck,
  Eye,
  Save,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  isSupabaseConfigured, 
  getSupabaseUrl,
  getSupabaseAnonKey,
  cleanSupabaseUrl,
  saveSupabaseCredentials,
  testSupabaseConnection,
  insertProductIntoSupabase,
  updateProductInSupabase,
  deleteProductInSupabase, 
  fetchProductsFromSupabase,
  fetchOrdersFromSupabase, 
  updateOrderStatusInSupabase,
  bulkSeedProductsToSupabase
} from '../lib/supabase';
import { CASIO_STARTER_MODELS } from '../data/starterCatalog';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: WatchProduct[];
  onProductsUpdated: (updatedList: WatchProduct[]) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  onProductsUpdated
}) => {
  const { addToast } = useCart();
  const { settings, updateSettings, resetToDefaults } = useStoreSettings();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Tabs: 'products' | 'website_settings' | 'orders' | 'supabase_setup'
  const [activeTab, setActiveTab] = useState<'products' | 'website_settings' | 'orders' | 'supabase_setup'>('products');
  
  // Product list filters & search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

  // Supabase sync states
  const isConnected = isSupabaseConfigured();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ count: number; total: number } | null>(null);

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Product Edit / Create state
  const [editingProduct, setEditingProduct] = useState<WatchProduct | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [formActiveTab, setFormActiveTab] = useState<'general' | 'pricing' | 'specs' | 'media'>('general');

  // Watch Form state
  const [formModel, setFormModel] = useState('');
  const [formName, setFormName] = useState('');
  const [formSeries, setFormSeries] = useState<WatchSeries>('Casio MTP');
  const [formGender, setFormGender] = useState<'Men' | 'Ladies' | 'Unisex'>('Men');
  const [formPrice, setFormPrice] = useState<number>(15000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<string>('');
  const [formStockCount, setFormStockCount] = useState<number>(10);
  const [formInStock, setFormInStock] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);
  const [formIsNewArrival, setFormIsNewArrival] = useState(false);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formAlternateImageUrl, setFormAlternateImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  
  // Watch Specs Form state
  const [formCaseDiameter, setFormCaseDiameter] = useState('42 mm');
  const [formCaseThickness, setFormCaseThickness] = useState('9.8 mm');
  const [formWaterResistance, setFormWaterResistance] = useState('50 Meters (5 BAR)');
  const [formGlassType, setFormGlassType] = useState('Mineral Glass');
  const [formBand, setFormBand] = useState<BandMaterial>('Stainless Steel');
  const [formMovement, setFormMovement] = useState<MovementType>('Quartz');
  const [formBatteryLife, setFormBatteryLife] = useState('Approx. 3 to 10 years');
  const [formWeight, setFormWeight] = useState('110 g');
  const [formWarranty, setFormWarranty] = useState('1-Year Official New Madina Electronics Warranty');
  const [formFeaturesText, setFormFeaturesText] = useState('');

  // Website Settings Form state
  const [storeNameInput, setStoreNameInput] = useState(settings.storeName);
  const [storeTaglineInput, setStoreTaglineInput] = useState(settings.tagline);
  const [storePhoneInput, setStorePhoneInput] = useState(settings.phone);
  const [storeWhatsappInput, setStoreWhatsappInput] = useState(settings.whatsapp);
  const [storeAddressInput, setStoreAddressInput] = useState(settings.address);
  const [storeTimingsInput, setStoreTimingsInput] = useState(settings.timings);
  const [storeAnnouncementInput, setStoreAnnouncementInput] = useState(settings.announcement);
  const [storeDeliveryFeeInput, setStoreDeliveryFeeInput] = useState(settings.deliveryFee);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Direct Supabase Credentials input state
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(getSupabaseUrl());
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(getSupabaseAnonKey());
  const [testConnectionStatus, setTestConnectionStatus] = useState<{
    testing: boolean;
    message: string;
    connected?: boolean;
    count?: number;
  }>({ testing: false, message: '' });
  const [isSeedingStarter, setIsSeedingStarter] = useState(false);

  // Sync settings inputs when settings update
  useEffect(() => {
    setStoreNameInput(settings.storeName);
    setStoreTaglineInput(settings.tagline);
    setStorePhoneInput(settings.phone);
    setStoreWhatsappInput(settings.whatsapp);
    setStoreAddressInput(settings.address);
    setStoreTimingsInput(settings.timings);
    setStoreAnnouncementInput(settings.announcement);
    setStoreDeliveryFeeInput(settings.deliveryFee);
  }, [settings]);

  const defaultPin = import.meta.env.VITE_ADMIN_PIN || '141madina';

  useEffect(() => {
    if (isOpen && isAuthenticated && activeTab === 'orders') {
      loadOrders();
    }
  }, [isOpen, isAuthenticated, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === defaultPin || pinInput.trim() === '1410') {
      setIsAuthenticated(true);
      setAuthError(false);
      setPinInput('');
    } else {
      setAuthError(true);
    }
  };

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    const data = await fetchOrdersFromSupabase();
    setOrders(data);
    setIsLoadingOrders(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const ok = await updateOrderStatusInSupabase(orderId, newStatus);
    if (ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      addToast(`Order status updated to ${newStatus}`);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      addToast('Status updated locally');
    }
  };

  // Quick In-Stock Toggle from the table row
  const handleToggleStock = async (p: WatchProduct) => {
    const updated: WatchProduct = {
      ...p,
      inStock: !p.inStock
    };

    if (isConnected) {
      await updateProductInSupabase(updated);
      const freshList = await fetchProductsFromSupabase();
      onProductsUpdated(freshList);
    } else {
      const newList = products.map((item) => (item.id === p.id ? updated : item));
      onProductsUpdated(newList);
    }

    addToast(`${p.model} marked as ${updated.inStock ? 'In Stock' : 'Out of Stock'}`);
  };

  // Open Add New Watch Modal
  const openCreateModal = () => {
    setIsCreatingNew(true);
    setEditingProduct(null);
    setFormActiveTab('general');
    setFormModel('MTP-');
    setFormName('Casio Classic Analog Watch');
    setFormSeries('Casio MTP');
    setFormGender('Men');
    setFormPrice(16500);
    setFormOriginalPrice('');
    setFormStockCount(12);
    setFormInStock(true);
    setFormIsFeatured(false);
    setFormIsBestSeller(false);
    setFormIsNewArrival(true);
    setFormImageUrl('https://watchcentre.pk/wp-content/uploads/2023/04/casio-mtp-1302d-2a2v-tiffany-blue-dial-watch.jpg');
    setFormAlternateImageUrl('');
    setFormDescription('100% Genuine Casio timepiece with Japanese Quartz precision module and official 1-year New Madina Electronics warranty.');
    setFormCaseDiameter('40 mm');
    setFormCaseThickness('9.5 mm');
    setFormWaterResistance('50 Meters (5 BAR)');
    setFormGlassType('Mineral Glass');
    setFormBand('Stainless Steel');
    setFormMovement('Quartz');
    setFormBatteryLife('Approx. 3 years');
    setFormWeight('105 g');
    setFormWarranty('1-Year Official New Madina Electronics Warranty');
    setFormFeaturesText('100% Genuine Casio Timepiece\nMineral Glass Scratch Resistance\nWater Resistant for Everyday Use\nTriple-Fold Clasp Stainless Steel Band');
  };

  // Clone/Duplicate an existing watch into a new model
  const handleCloneProduct = (p: WatchProduct) => {
    setIsCreatingNew(true);
    setEditingProduct(null);
    setFormActiveTab('general');
    setFormModel(`${p.model}-NEW`);
    setFormName(`${p.name} (Variant)`);
    setFormSeries(p.series);
    setFormGender(p.gender);
    setFormPrice(p.pricePKR);
    setFormOriginalPrice(p.originalPricePKR ? String(p.originalPricePKR) : '');
    setFormStockCount(p.stockCount || 10);
    setFormInStock(p.inStock);
    setFormIsFeatured(false);
    setFormIsBestSeller(false);
    setFormIsNewArrival(true);
    setFormImageUrl(p.imageUrl);
    setFormAlternateImageUrl(p.alternateImageUrl || '');
    setFormDescription(p.description);
    setFormCaseDiameter(p.specs?.caseDiameter || '40 mm');
    setFormCaseThickness(p.specs?.caseThickness || '9.5 mm');
    setFormWaterResistance(p.specs?.waterResistance || '50 Meters');
    setFormGlassType(p.specs?.glassType || 'Mineral Glass');
    setFormBand(p.specs?.bandMaterial || 'Stainless Steel');
    setFormMovement(p.specs?.movement || 'Quartz');
    setFormBatteryLife(p.specs?.batteryLife || '3 Years');
    setFormWeight(p.specs?.weight || '105 g');
    setFormWarranty(p.specs?.warranty || '1-Year Official Warranty');
    setFormFeaturesText((p.features || []).join('\n'));
    addToast(`Cloned template from ${p.model}. Adjust fields and save!`, 'info');
  };

  // Open Edit Watch Modal
  const openEditModal = (p: WatchProduct) => {
    setEditingProduct(p);
    setIsCreatingNew(false);
    setFormActiveTab('general');
    setFormModel(p.model);
    setFormName(p.name);
    setFormSeries(p.series);
    setFormGender(p.gender);
    setFormPrice(p.pricePKR);
    setFormOriginalPrice(p.originalPricePKR ? String(p.originalPricePKR) : '');
    setFormStockCount(p.stockCount || 10);
    setFormInStock(p.inStock);
    setFormIsFeatured(Boolean(p.isFeatured));
    setFormIsBestSeller(Boolean(p.isBestSeller));
    setFormIsNewArrival(Boolean(p.isNewArrival));
    setFormImageUrl(p.imageUrl);
    setFormAlternateImageUrl(p.alternateImageUrl || '');
    setFormDescription(p.description);
    setFormCaseDiameter(p.specs?.caseDiameter || '40 mm');
    setFormCaseThickness(p.specs?.caseThickness || '9.5 mm');
    setFormWaterResistance(p.specs?.waterResistance || '50 Meters');
    setFormGlassType(p.specs?.glassType || 'Mineral Glass');
    setFormBand(p.specs?.bandMaterial || 'Stainless Steel');
    setFormMovement(p.specs?.movement || 'Quartz');
    setFormBatteryLife(p.specs?.batteryLife || '3 Years');
    setFormWeight(p.specs?.weight || '105 g');
    setFormWarranty(p.specs?.warranty || '1-Year Official Warranty');
    setFormFeaturesText((p.features || []).join('\n'));
  };

  // Save or Create Watch
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formModel.trim() || !formName.trim() || !formPrice) {
      alert('Please fill in required fields: Model, Name, and Price');
      return;
    }

    setIsSavingProduct(true);

    const productId = isCreatingNew
      ? `watch_${Date.now()}_${formModel.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
      : editingProduct!.id;

    const parsedFeatures = formFeaturesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedProduct: WatchProduct = {
      id: productId,
      model: formModel.trim().toUpperCase(),
      name: formName.trim(),
      series: formSeries,
      gender: formGender,
      pricePKR: Number(formPrice),
      originalPricePKR: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      inStock: formInStock,
      stockCount: Number(formStockCount) || 10,
      isFeatured: formIsFeatured,
      isBestSeller: formIsBestSeller,
      isNewArrival: formIsNewArrival,
      rating: editingProduct?.rating || 4.9,
      reviewsCount: editingProduct?.reviewsCount || 18,
      imageUrl: formImageUrl.trim() || 'https://watchcentre.pk/wp-content/uploads/2023/04/casio-mtp-1302d-2a2v-tiffany-blue-dial-watch.jpg',
      alternateImageUrl: formAlternateImageUrl.trim() || undefined,
      description: formDescription.trim(),
      specs: {
        caseDiameter: formCaseDiameter.trim(),
        caseThickness: formCaseThickness.trim(),
        waterResistance: formWaterResistance.trim(),
        glassType: formGlassType.trim(),
        bandMaterial: formBand,
        movement: formMovement,
        batteryLife: formBatteryLife.trim(),
        weight: formWeight.trim(),
        warranty: formWarranty.trim()
      },
      features: parsedFeatures.length > 0 ? parsedFeatures : ['Genuine Casio Japanese Movement', formWaterResistance, formBand]
    };

    // Save to Supabase (Clean INSERT for new watch, clean UPDATE for existing)
    if (isConnected) {
      if (isCreatingNew) {
        // Clean INSERT query into Supabase 'products' table
        const res = await insertProductIntoSupabase(updatedProduct);
        if (!res.success) {
          alert(`Supabase INSERT Failed:\n${res.error}\n\nPlease check your Supabase schema and make sure the 'products' table exists.`);
          addToast(`INSERT failed: ${res.error}`, 'error');
          setIsSavingProduct(false);
          return;
        }
        addToast(`✅ Added new watch to Supabase: ${updatedProduct.model}`, 'success');
      } else {
        // Clean UPDATE query into Supabase 'products' table
        const res = await updateProductInSupabase(updatedProduct);
        if (!res.success) {
          alert(`Supabase UPDATE Failed:\n${res.error}`);
          addToast(`UPDATE failed: ${res.error}`, 'error');
          setIsSavingProduct(false);
          return;
        }
        addToast(`✅ Updated watch in Supabase: ${updatedProduct.model}`, 'success');
      }

      // Re-fetch all records directly from Supabase (Zero mock data, 100% live consistency)
      const freshList = await fetchProductsFromSupabase();
      onProductsUpdated(freshList);
    } else {
      let newList: WatchProduct[];
      if (isCreatingNew) {
        newList = [updatedProduct, ...products];
        addToast(`Added new model: ${updatedProduct.model}`);
      } else {
        newList = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
        addToast(`Updated watch: ${updatedProduct.model}`);
      }
      onProductsUpdated(newList);
    }

    setIsSavingProduct(false);
    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  // Delete Watch
  const handleDeleteProduct = async (p: WatchProduct) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${p.model}?`)) return;

    if (isConnected) {
      const res = await deleteProductInSupabase(p.id);
      if (!res.success) {
        alert(`Delete failed in Supabase: ${res.error}`);
        addToast(`Delete error: ${res.error}`, 'error');
        return;
      }
      const freshList = await fetchProductsFromSupabase();
      onProductsUpdated(freshList);
    } else {
      const newList = products.filter((item) => item.id !== p.id);
      onProductsUpdated(newList);
    }

    addToast(`Deleted ${p.model}`);
  };

  // Save Website & Store Settings
  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);

    const success = await updateSettings({
      storeName: storeNameInput.trim(),
      tagline: storeTaglineInput.trim(),
      phone: storePhoneInput.trim(),
      whatsapp: storeWhatsappInput.trim().replace(/[^0-9]/g, ''),
      address: storeAddressInput.trim(),
      timings: storeTimingsInput.trim(),
      announcement: storeAnnouncementInput.trim(),
      deliveryFee: Number(storeDeliveryFeeInput) || 0
    });

    setIsSavingSettings(false);
    if (success) {
      addToast('Website & Store settings updated successfully!');
    } else {
      addToast('Settings updated locally on device');
    }
  };

  // 1-Click Sync to Supabase
  const handleBulkSyncToSupabase = async () => {
    if (!isConnected) {
      alert('Please connect Supabase first by adding VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.');
      return;
    }

    if (!window.confirm(`Upload all ${products.length} watches to your Supabase database?`)) return;

    setIsSyncing(true);
    setSyncProgress({ count: 0, total: products.length });

    const result = await bulkSeedProductsToSupabase(products, (uploaded, total) => {
      setSyncProgress({ count: uploaded, total });
    });

    setIsSyncing(false);
    setSyncProgress(null);

    if (result.success) {
      alert(`Success! ${result.count} watches uploaded to your Supabase database!`);
      addToast(`Synced ${result.count} watches to Supabase!`);
    } else {
      alert(`Sync failed: ${result.error}`);
    }
  };

  // Copy Supabase SQL helper
  const handleCopySql = () => {
    const sql = `-- NEW MADINA ELECTRONICS - SUPABASE DATABASE COMPLETE SETUP SCRIPT
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    model TEXT NOT NULL,
    name TEXT NOT NULL,
    series TEXT NOT NULL,
    gender TEXT NOT NULL DEFAULT 'Men',
    price_pkr INTEGER NOT NULL,
    original_price_pkr INTEGER,
    stock_count INTEGER DEFAULT 10,
    image_url TEXT NOT NULL,
    alternate_image_url TEXT,
    description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_in_stock BOOLEAN DEFAULT TRUE,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 18,
    specs JSONB DEFAULT '{}'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    total_pkr INTEGER NOT NULL,
    items JSONB NOT NULL,
    order_notes TEXT,
    status TEXT NOT NULL DEFAULT 'Pending Verification',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Allow public insert products" ON public.products;
DROP POLICY IF EXISTS "Allow public update products" ON public.products;
DROP POLICY IF EXISTS "Allow public delete products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete products" ON public.products FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public read orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public update orders" ON public.orders;
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public update orders" ON public.orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow public modify site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public modify site_settings" ON public.site_settings FOR ALL USING (true);`;

    navigator.clipboard.writeText(sql).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
      addToast('SQL Script copied to clipboard!');
    });
  };

  // Save Supabase credentials directly from UI
  const handleSaveSupabaseCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrlInput.trim() || !supabaseKeyInput.trim()) {
      alert('Please enter both Supabase URL and Anon Key');
      return;
    }
    const cleanedUrl = cleanSupabaseUrl(supabaseUrlInput);
    setSupabaseUrlInput(cleanedUrl);
    saveSupabaseCredentials(cleanedUrl, supabaseKeyInput);
    addToast('Supabase credentials saved (sanitized base URL)! Testing connection...');
    await handleTestSupabaseConnection();
    const live = await fetchProductsFromSupabase();
    onProductsUpdated(live);
  };

  // Test Supabase Connection
  const handleTestSupabaseConnection = async () => {
    setTestConnectionStatus({ testing: true, message: 'Testing connection to Supabase...' });
    const res = await testSupabaseConnection();
    setTestConnectionStatus({
      testing: false,
      message: res.message,
      connected: res.connected,
      count: res.count
    });
    if (res.connected) {
      addToast(`Connected to Supabase! Found ${res.count} watches in products table.`, 'success');
      const fresh = await fetchProductsFromSupabase();
      onProductsUpdated(fresh);
    } else {
      addToast(`Supabase: ${res.message}`, 'error');
    }
  };

  // Seed Starter Casio Catalog to Supabase
  const handleSeedStarterCatalog = async () => {
    if (!isConnected) {
      alert('Please connect Supabase credentials first.');
      return;
    }
    if (!window.confirm(`Insert ${CASIO_STARTER_MODELS.length} authentic Casio starter watches into your Supabase database?`)) return;

    setIsSeedingStarter(true);
    const result = await bulkSeedProductsToSupabase(CASIO_STARTER_MODELS);
    setIsSeedingStarter(false);

    if (result.success) {
      alert(`Success! ${result.count} watches inserted into Supabase products table!`);
      addToast(`Seeded ${result.count} watches into Supabase!`, 'success');
      const fresh = await fetchProductsFromSupabase();
      onProductsUpdated(fresh);
    } else {
      alert(`Seeding failed: ${result.error}`);
    }
  };

  // Filtered watches
  const filteredProducts = products.filter((p) => {
    if (selectedSeriesFilter !== 'All' && p.series !== selectedSeriesFilter) return false;
    if (stockFilter === 'in_stock' && !p.inStock) return false;
    if (stockFilter === 'out_of_stock' && p.inStock) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.model.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
    }
    return true;
  });

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      return (
        o.order_number?.toLowerCase().includes(q) ||
        o.customer_name?.toLowerCase().includes(q) ||
        o.phone?.toLowerCase().includes(q) ||
        o.city?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      {/* Background click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Admin Card */}
      <div className="relative bg-white border border-slate-200 rounded-2xl max-w-6xl w-full max-h-[94vh] overflow-hidden shadow-2xl z-10 flex flex-col text-slate-800 animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              NM
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                New Madina Control Panel
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                  MASTER ADMIN
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                Puri Website & Watches Control · Shop 141 Paradise Centre, Saddar Karachi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Screen if not logged in */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Admin Authentication</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your Store Admin PIN to edit watches, add new models, change prices, or edit entire website settings.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-3 pt-2">
              <input
                type="password"
                placeholder="Enter Admin PIN (Default: 141madina)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-center font-mono text-sm tracking-widest focus:outline-none focus:border-slate-800 shadow-inner"
              />

              {authError && (
                <p className="text-xs text-rose-600 font-semibold flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Invalid PIN. Default is: 141madina (or 1410)
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
              >
                Access Control Panel
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              New Madina Electronics · Shop 141 Paradise Shopping Centre
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs Bar */}
            <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-lg">
                {/* Tab 1: Watches */}
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Package className="w-3.5 h-3.5 text-amber-600" />
                  <span>Watches ({products.length})</span>
                </button>

                {/* Tab 2: Edit Website & Store Settings */}
                <button
                  onClick={() => setActiveTab('website_settings')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'website_settings'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>Website & Store Editor</span>
                </button>

                {/* Tab 3: Customer Orders */}
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Orders {orders.length > 0 ? `(${orders.length})` : ''}</span>
                </button>

                {/* Tab 4: Supabase Guide */}
                <button
                  onClick={() => setActiveTab('supabase_setup')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'supabase_setup'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-purple-600" />
                  <span>Supabase & SQL</span>
                </button>
              </div>

              {/* Supabase Status Pill & Sync Button */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border ${
                    isConnected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  <span>{isConnected ? 'Supabase Connected' : 'Local Mode (Supabase Ready)'}</span>
                </div>

                {isConnected && (
                  <button
                    onClick={handleBulkSyncToSupabase}
                    disabled={isSyncing}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-xs cursor-pointer disabled:opacity-50"
                    title="Upload entire watch list to your Supabase database in 1 click"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{isSyncing ? `Syncing (${syncProgress?.count}/${syncProgress?.total})...` : 'Sync Catalog'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* ======================================================== */}
            {/* TAB 1: WATCHES / PRODUCTS MANAGEMENT */}
            {/* ======================================================== */}
            {activeTab === 'products' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Search, Filter & Add Button Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto flex-1">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search any model or name (e.g. 1302D)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-slate-800"
                      />
                    </div>

                    <select
                      value={stockFilter}
                      onChange={(e) => setStockFilter(e.target.value as any)}
                      className="px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none"
                    >
                      <option value="all">All Stock Status</option>
                      <option value="in_stock">In Stock Only</option>
                      <option value="out_of_stock">Out of Stock Only</option>
                    </select>

                    <span className="text-xs text-slate-500 font-mono hidden md:inline">
                      Showing {filteredProducts.length} of {products.length} watches
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={openCreateModal}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Add New Watch</span>
                    </button>
                  </div>
                </div>

                {/* Series Quick Filter Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                  {['All', 'Casio MTP', 'Casio LTP', 'Casio Edifice', 'Casio G-Shock', 'Casio Vintage', 'Casio ProTrek'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSeriesFilter(s)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        selectedSeriesFilter === s
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Complete Watches Table (Displays all watches with no limit) */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
                  <div className="max-h-[56vh] overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/90 sticky top-0 text-[11px] uppercase tracking-wider text-slate-600 font-bold border-b border-slate-200 z-10">
                        <tr>
                          <th className="p-3">Watch & Model</th>
                          <th className="p-3">Series / Category</th>
                          <th className="p-3">Price (PKR)</th>
                          <th className="p-3">Quick Stock Toggle</th>
                          <th className="p-3">Badges</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 flex items-center gap-3">
                              <img
                                src={p.imageUrl}
                                alt={p.model}
                                className="w-10 h-10 object-contain bg-slate-50 border border-slate-200 rounded p-0.5 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://watchcentre.pk/wp-content/uploads/2023/04/casio-mtp-1302d-2a2v-tiffany-blue-dial-watch.jpg';
                                }}
                              />
                              <div className="min-w-0">
                                <div className="font-mono font-bold text-slate-900 truncate">
                                  {p.model}
                                </div>
                                <div className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                                  {p.name}
                                </div>
                              </div>
                            </td>

                            <td className="p-3">
                              <span className="font-semibold text-slate-800 block">{p.series}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{p.gender} · {p.specs?.bandMaterial}</span>
                            </td>

                            <td className="p-3 font-mono font-bold text-slate-900">
                              {formatPKR(p.pricePKR)}
                              {p.originalPricePKR && (
                                <span className="block text-[10px] text-slate-400 line-through">
                                  {formatPKR(p.originalPricePKR)}
                                </span>
                              )}
                            </td>

                            {/* 1-Click Stock Toggle Button directly on row */}
                            <td className="p-3">
                              <button
                                onClick={() => handleToggleStock(p)}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                  p.inStock
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                                }`}
                                title="Click to toggle In Stock / Out of Stock"
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                <span>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                              </button>
                            </td>

                            {/* Badges */}
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1">
                                {p.isFeatured && (
                                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">
                                    Featured
                                  </span>
                                )}
                                {p.isBestSeller && (
                                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-[9px] font-bold rounded">
                                    Best Seller
                                  </span>
                                )}
                                {p.isNewArrival && (
                                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold rounded">
                                    New
                                  </span>
                                )}
                                {!p.isFeatured && !p.isBestSeller && !p.isNewArrival && (
                                  <span className="text-slate-400 text-[10px]">—</span>
                                )}
                              </div>
                            </td>

                            {/* Action Buttons: Edit, Clone, Delete */}
                            <td className="p-3 text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => openEditModal(p)}
                                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                                  title="Edit full watch details"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleCloneProduct(p)}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                  title="Duplicate as new model"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p)}
                                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                  title="Delete Watch"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: EDIT WEBSITE & STORE SETTINGS (PURI WEBSITE EDIT) */}
            {/* ======================================================== */}
            {activeTab === 'website_settings' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    Puri Website & Store Customizer
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aap yahan se website ka naam, phone number, WhatsApp number, showroom timings, address, aur announcement bar kisi bhi waqt tabdeel kar sakte hain!
                  </p>
                </div>

                <form onSubmit={handleSaveStoreSettings} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Store Name */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <label className="block text-xs font-bold text-slate-800">Store Name</label>
                      <input
                        type="text"
                        value={storeNameInput}
                        onChange={(e) => setStoreNameInput(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-slate-800"
                        placeholder="e.g. New Madina Electronics"
                      />
                      <p className="text-[10px] text-slate-500">Header aur Footer mein show hota hai</p>
                    </div>

                    {/* Store Tagline */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <label className="block text-xs font-bold text-slate-800">Tagline / Subtitle</label>
                      <input
                        type="text"
                        value={storeTaglineInput}
                        onChange={(e) => setStoreTaglineInput(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-slate-800"
                        placeholder="e.g. Authorized Casio Watch Store · Saddar Karachi"
                      />
                      <p className="text-[10px] text-slate-500">Logo ke neeche aur page description mein</p>
                    </div>

                    {/* WhatsApp Number */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Official WhatsApp Number (Country code ke saath)
                      </label>
                      <input
                        type="text"
                        value={storeWhatsappInput}
                        onChange={(e) => setStoreWhatsappInput(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-emerald-800 focus:outline-none focus:border-slate-800"
                        placeholder="e.g. 923213979883"
                      />
                      <p className="text-[10px] text-slate-500">Tamam WhatsApp inquiry buttons aur order alerts is number pe jayenge</p>
                    </div>

                    {/* Calling Phone Number */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-amber-600" />
                        Calling Phone Number (Direct Call)
                      </label>
                      <input
                        type="text"
                        value={storePhoneInput}
                        onChange={(e) => setStorePhoneInput(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-slate-800"
                        placeholder="e.g. +92 321 3979883"
                      />
                      <p className="text-[10px] text-slate-500">Header aur Showroom section mein display hota hai</p>
                    </div>

                    {/* Store Physical Address */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 md:col-span-2">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-600" />
                        Showroom / Store Address
                      </label>
                      <input
                        type="text"
                        value={storeAddressInput}
                        onChange={(e) => setStoreAddressInput(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-slate-800"
                        placeholder="e.g. Shop 141, 1st Floor, Paradise Shopping Centre, Saddar, Karachi"
                      />
                      <p className="text-[10px] text-slate-500">Showroom location section aur store visits ke liye</p>
                    </div>

                    {/* Store Opening Timings */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        Store Timings
                      </label>
                      <input
                        type="text"
                        value={storeTimingsInput}
                        onChange={(e) => setStoreTimingsInput(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:border-slate-800"
                        placeholder="e.g. 11:30 AM – 10:00 PM (Mon-Sat)"
                      />
                    </div>

                    {/* Courier Delivery Fee */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-600" />
                        Standard Delivery Fee (PKR)
                      </label>
                      <input
                        type="number"
                        value={storeDeliveryFeeInput}
                        onChange={(e) => setStoreDeliveryFeeInput(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-slate-800"
                        placeholder="e.g. 250"
                      />
                    </div>

                    {/* Announcement Bar Notice */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 md:col-span-2">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Top Announcement Bar Notice (Ticker)
                      </label>
                      <input
                        type="text"
                        value={storeAnnouncementInput}
                        onChange={(e) => setStoreAnnouncementInput(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-slate-800"
                        placeholder="e.g. 100% Genuine Casio Timepieces with Serialized Warranty · Saddar Karachi"
                      />
                      <p className="text-[10px] text-slate-500">Website ke sabse upar black announcement bar mein chalega</p>
                    </div>
                  </div>

                  {/* Save Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Reset settings to original defaults?')) {
                          resetToDefaults();
                          addToast('Settings reset to defaults');
                        }
                      }}
                      className="px-4 py-2 border border-slate-300 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                    >
                      Reset to Defaults
                    </button>

                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 text-amber-400" />
                      <span>{isSavingSettings ? 'Saving Settings...' : 'Save Website Settings'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: CUSTOMER ORDERS */}
            {/* ======================================================== */}
            {activeTab === 'orders' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Customer Orders Received</h3>
                    <p className="text-xs text-slate-500">Website par checkout karne wale customers ke live orders</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending Verification">Pending Verification</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                    </select>

                    <button
                      onClick={loadOrders}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="py-12 text-center bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-2">
                    <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="font-bold text-slate-800 text-sm">No orders found</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Jab customers checkout karenge to unka naam, phone number, address aur ordered watches yahan real-time mein show hongi!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                              #{order.order_number || order.id?.slice(0, 8)}
                            </span>
                            <span className="text-slate-400">
                              {new Date(order.created_at).toLocaleString()}
                            </span>
                          </div>

                          {/* Status Dropdown */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-500">Status:</span>
                            <select
                              value={order.status || 'Pending Verification'}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="px-2 py-1 bg-slate-100 font-bold text-slate-800 rounded border border-slate-300 text-[11px] focus:outline-none"
                            >
                              <option value="Pending Verification">Pending Verification</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <span className="text-[10px] uppercase text-slate-400 font-bold block">Customer</span>
                            <span className="font-bold text-slate-800 text-sm block">{order.customer_name}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <a
                                href={`tel:${order.phone}`}
                                className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-700 hover:text-slate-950 bg-slate-100 px-1.5 py-0.5 rounded"
                              >
                                <Phone className="w-3 h-3 text-amber-600" />
                                {order.phone}
                              </a>
                              <a
                                href={`https://wa.me/${order.phone?.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded font-bold"
                              >
                                <MessageCircle className="w-3 h-3" />
                                WhatsApp
                              </a>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase text-slate-400 font-bold block">Delivery Address</span>
                            <span className="text-slate-700 block">{order.address}</span>
                            <span className="font-bold text-slate-900 block">{order.city}</span>
                            {order.order_notes && (
                              <span className="text-[10px] text-slate-500 italic block mt-0.5">Note: "{order.order_notes}"</span>
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] uppercase text-slate-400 font-bold block">Payment & Total</span>
                            <span className="font-bold text-slate-900 text-sm block">
                              {formatPKR(order.total_pkr)}
                            </span>
                            <span className="text-[11px] text-slate-500 uppercase font-mono block">
                              {order.payment_method?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Ordered Items List */}
                        {Array.isArray(order.items) && (
                          <div className="bg-slate-50 p-2.5 rounded-lg space-y-1 text-[11px]">
                            <span className="font-bold text-slate-600 block">Ordered Items:</span>
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-slate-700">
                                <span>
                                  {item.quantity}x {item.model} — {item.name}
                                </span>
                                <span className="font-mono font-bold">{formatPKR(item.pricePKR * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 4: SUPABASE & NETLIFY STEP-BY-STEP SETUP GUIDE */}
            {/* ======================================================== */}
            {activeTab === 'supabase_setup' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
                  <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-700" />
                    How to Connect Supabase to Control Your Website
                  </h3>
                  <p className="text-xs text-purple-900">
                    Aap ki website mein Supabase integration code bilkul tayar hai! Niche credentials daal kar live test kar sakte hain:
                  </p>
                </div>

                {/* Direct Live Credentials & Testing Panel */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <h4 className="font-bold text-slate-900 text-sm">
                        {isConnected ? 'Supabase Database Connected' : 'Connect Your Supabase Project'}
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {products.length} {products.length === 1 ? 'watch' : 'watches'} in live DB
                    </span>
                  </div>

                  <form onSubmit={handleSaveSupabaseCreds} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        VITE_SUPABASE_URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://xyzcompany.supabase.co"
                        value={supabaseUrlInput}
                        onChange={(e) => setSupabaseUrlInput(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        VITE_SUPABASE_ANON_KEY
                      </label>
                      <input
                        type="password"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5c..."
                        value={supabaseKeyInput}
                        onChange={(e) => setSupabaseKeyInput(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-2 flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded text-xs transition-colors cursor-pointer"
                      >
                        Save & Connect
                      </button>
                      <button
                        type="button"
                        onClick={handleTestSupabaseConnection}
                        disabled={testConnectionStatus.testing}
                        className="px-4 py-2 border border-slate-300 hover:border-slate-800 text-slate-800 font-semibold rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        {testConnectionStatus.testing ? (
                          <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5" />
                        )}
                        <span>Test Live Connection</span>
                      </button>

                      {/* Optional Seed Button */}
                      <button
                        type="button"
                        onClick={handleSeedStarterCatalog}
                        disabled={isSeedingStarter}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5 ml-auto"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isSeedingStarter ? 'Seeding...' : 'Seed Starter Casio Watches to DB'}</span>
                      </button>
                    </div>
                  </form>

                  {testConnectionStatus.message && (
                    <div className={`p-2.5 rounded text-xs font-medium ${
                      testConnectionStatus.connected 
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-900 border border-rose-200'
                    }`}>
                      {testConnectionStatus.message}
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  {/* Step 1 */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono">
                        1
                      </span>
                      <span>Supabase par Free Project Banayein</span>
                    </div>
                    <p className="text-slate-600 pl-8 leading-relaxed">
                      1. <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-amber-800 font-bold underline inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a> par sign in karke <strong>"New Project"</strong> par click karein.<br />
                      2. Project name <code>new-madina-electronics</code> rakhein aur database password set karein.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono">
                          2
                        </span>
                        <span>SQL Editor mein Tables Banayein (1-Click Run)</span>
                      </div>
                      <button
                        onClick={handleCopySql}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-xs flex items-center gap-1 cursor-pointer"
                      >
                        {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copySuccess ? 'Copied!' : 'Copy SQL Script'}</span>
                      </button>
                    </div>

                    <p className="text-slate-600 pl-8">
                      Supabase ke left menu mein <strong>SQL Editor</strong> kholen, <strong>New Query</strong> banayein, yeh SQL paste karke <strong>RUN</strong> dabayein:
                    </p>
                    <div className="pl-8">
                      <pre className="p-3 bg-slate-900 text-amber-300 font-mono text-[11px] rounded-lg overflow-x-auto max-h-48">
{`-- Click 'RUN' in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    model TEXT NOT NULL,
    name TEXT NOT NULL,
    series TEXT NOT NULL,
    gender TEXT NOT NULL DEFAULT 'Men',
    price_pkr INTEGER NOT NULL,
    original_price_pkr INTEGER,
    stock_count INTEGER DEFAULT 10,
    image_url TEXT NOT NULL,
    description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_in_stock BOOLEAN DEFAULT TRUE,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 18,
    specs JSONB DEFAULT '{}'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    total_pkr INTEGER NOT NULL,
    items JSONB NOT NULL,
    order_notes TEXT,
    status TEXT NOT NULL DEFAULT 'Pending Verification',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Allow public insert products" ON public.products;
DROP POLICY IF EXISTS "Allow public update products" ON public.products;
DROP POLICY IF EXISTS "Allow public delete products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete products" ON public.products FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public read orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public update orders" ON public.orders;
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public update orders" ON public.orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow public modify site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public modify site_settings" ON public.site_settings FOR ALL USING (true);`}
                      </pre>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono">
                        3
                      </span>
                      <span>Netlify par Environment Variables Add Karein</span>
                    </div>
                    <p className="text-slate-600 pl-8">
                      Supabase Settings → <strong>API</strong> se Project URL aur `anon public key` copy karein, aur Netlify ke <strong>Site Configuration → Environment Variables</strong> mein daalein:
                    </p>
                    <div className="pl-8 space-y-1 font-mono text-[11px]">
                      <div className="p-2 bg-slate-100 rounded border border-slate-300">
                        <strong>VITE_SUPABASE_URL</strong> = https://xxxx.supabase.co
                      </div>
                      <div className="p-2 bg-slate-100 rounded border border-slate-300">
                        <strong>VITE_SUPABASE_ANON_KEY</strong> = eyJhbGciOiJIUzI1NiIsInR5...
                      </div>
                      <div className="p-2 bg-slate-100 rounded border border-slate-300">
                        <strong>VITE_ADMIN_PIN</strong> = 141madina
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* COMPREHENSIVE MODAL FOR CREATING / EDITING A PRODUCT */}
        {/* ======================================================== */}
        {(isCreatingNew || editingProduct) && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
              
              {/* Modal Header */}
              <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    {isCreatingNew ? <Plus className="w-4 h-4 text-amber-400" /> : <Edit3 className="w-4 h-4 text-amber-400" />}
                    <span>{isCreatingNew ? 'Add New Casio Watch' : `Edit Watch: ${editingProduct?.model}`}</span>
                  </h3>
                  <p className="text-[10px] text-slate-300">
                    Tamam details fill karein taake customer ko website pe accurate specs aur images nazar aayein
                  </p>
                </div>
                <button
                  onClick={() => { setIsCreatingNew(false); setEditingProduct(null); }}
                  className="p-1 text-slate-400 hover:text-white rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sub-Tabs for clean categorization */}
              <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFormActiveTab('general')}
                  className={`py-2 px-3 border-b-2 cursor-pointer transition-colors ${
                    formActiveTab === 'general' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  1. Basic & Pricing
                </button>
                <button
                  type="button"
                  onClick={() => setFormActiveTab('specs')}
                  className={`py-2 px-3 border-b-2 cursor-pointer transition-colors ${
                    formActiveTab === 'specs' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  2. Watch Specifications
                </button>
                <button
                  type="button"
                  onClick={() => setFormActiveTab('media')}
                  className={`py-2 px-3 border-b-2 cursor-pointer transition-colors ${
                    formActiveTab === 'media' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  3. Photos & Details
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                
                {/* TAB 1: General & Pricing */}
                {formActiveTab === 'general' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Model Number *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. MTP-1302D-2A2V"
                          value={formModel}
                          onChange={(e) => setFormModel(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold focus:outline-none focus:border-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Series *</label>
                        <select
                          value={formSeries}
                          onChange={(e) => setFormSeries(e.target.value as WatchSeries)}
                          className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 font-semibold"
                        >
                          <option value="Casio MTP">Casio MTP</option>
                          <option value="Casio LTP">Casio LTP</option>
                          <option value="Casio Edifice">Casio Edifice</option>
                          <option value="Casio G-Shock">Casio G-Shock</option>
                          <option value="Casio Vintage">Casio Vintage</option>
                          <option value="Casio ProTrek">Casio ProTrek</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Watch Title / Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Casio MTP-1302D Tiffany Blue Dial Classic Watch"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Price (PKR) *</label>
                        <input
                          type="number"
                          required
                          value={formPrice}
                          onChange={(e) => setFormPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Cut Price / Was (PKR)</label>
                        <input
                          type="number"
                          placeholder="e.g. 19500"
                          value={formOriginalPrice}
                          onChange={(e) => setFormOriginalPrice(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Gender</label>
                        <select
                          value={formGender}
                          onChange={(e) => setFormGender(e.target.value as any)}
                          className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:outline-none"
                        >
                          <option value="Men">Men</option>
                          <option value="Ladies">Ladies</option>
                          <option value="Unisex">Unisex</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Stock Count</label>
                        <input
                          type="number"
                          value={formStockCount}
                          onChange={(e) => setFormStockCount(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col justify-end">
                        <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formInStock}
                            onChange={(e) => setFormInStock(e.target.checked)}
                            className="rounded text-slate-900 focus:ring-0 w-4 h-4"
                          />
                          <span className="font-bold text-slate-800">Available In Stock</span>
                        </label>
                      </div>
                    </div>

                    {/* Marketing Flags */}
                    <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                      <span className="font-bold text-slate-800 text-[11px] block">Special Badges:</span>
                      <div className="flex flex-wrap items-center gap-4">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formIsFeatured}
                            onChange={(e) => setFormIsFeatured(e.target.checked)}
                            className="rounded text-slate-900 focus:ring-0"
                          />
                          <span className="font-semibold text-slate-800">Featured Watch</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formIsBestSeller}
                            onChange={(e) => setFormIsBestSeller(e.target.checked)}
                            className="rounded text-slate-900 focus:ring-0"
                          />
                          <span className="font-semibold text-slate-800">Best Seller</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formIsNewArrival}
                            onChange={(e) => setFormIsNewArrival(e.target.checked)}
                            className="rounded text-slate-900 focus:ring-0"
                          />
                          <span className="font-semibold text-slate-800">New Arrival</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Specifications */}
                {formActiveTab === 'specs' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Band Material</label>
                        <select
                          value={formBand}
                          onChange={(e) => setFormBand(e.target.value as any)}
                          className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:outline-none"
                        >
                          <option value="Stainless Steel">Stainless Steel</option>
                          <option value="Resin / Silicone">Resin / Silicone</option>
                          <option value="Genuine Leather">Genuine Leather</option>
                          <option value="Titanium">Titanium</option>
                          <option value="Milanese Mesh">Milanese Mesh</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Movement Type</label>
                        <select
                          value={formMovement}
                          onChange={(e) => setFormMovement(e.target.value as any)}
                          className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:outline-none"
                        >
                          <option value="Quartz">Quartz</option>
                          <option value="Tough Solar">Tough Solar</option>
                          <option value="Digital">Digital</option>
                          <option value="Chronograph">Chronograph</option>
                          <option value="Bluetooth Smart">Bluetooth Smart</option>
                          <option value="Multi-Band 6 Atomic">Multi-Band 6 Atomic</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Water Resistance</label>
                        <input
                          type="text"
                          value={formWaterResistance}
                          onChange={(e) => setFormWaterResistance(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                          placeholder="e.g. 50 Meters (5 BAR) or 200M"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Glass Type</label>
                        <input
                          type="text"
                          value={formGlassType}
                          onChange={(e) => setFormGlassType(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                          placeholder="e.g. Mineral Glass or Sapphire Crystal"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Case Diameter</label>
                        <input
                          type="text"
                          value={formCaseDiameter}
                          onChange={(e) => setFormCaseDiameter(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                          placeholder="e.g. 40 mm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Case Thickness</label>
                        <input
                          type="text"
                          value={formCaseThickness}
                          onChange={(e) => setFormCaseThickness(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                          placeholder="e.g. 9.5 mm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Battery Life</label>
                        <input
                          type="text"
                          value={formBatteryLife}
                          onChange={(e) => setFormBatteryLife(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                          placeholder="e.g. 3 to 10 years"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Approx. Weight</label>
                        <input
                          type="text"
                          value={formWeight}
                          onChange={(e) => setFormWeight(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                          placeholder="e.g. 105 g"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Warranty Term</label>
                        <input
                          type="text"
                          value={formWarranty}
                          onChange={(e) => setFormWarranty(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                          placeholder="e.g. 1-Year Official Warranty"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: Media & Description */}
                {formActiveTab === 'media' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Main Product Image URL *</label>
                      <input
                        type="url"
                        required
                        placeholder="https://watchcentre.pk/wp-content/uploads/..."
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px] focus:outline-none focus:border-slate-800"
                      />
                      {formImageUrl && (
                        <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                          <img
                            src={formImageUrl}
                            alt="Preview"
                            className="w-12 h-12 object-contain border rounded p-0.5 bg-white"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://watchcentre.pk/wp-content/uploads/2023/04/casio-mtp-1302d-2a2v-tiffany-blue-dial-watch.jpg';
                            }}
                          />
                          <div>
                            <span className="text-[11px] font-bold text-slate-800 block">Main Image Preview</span>
                            <span className="text-[10px] text-slate-500">Live preview of watch thumbnail</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Alternate Image URL (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formAlternateImageUrl}
                        onChange={(e) => setFormAlternateImageUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px] focus:outline-none focus:border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 text-xs"
                        placeholder="Describe the timepiece..."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Key Features / Highlights (Har feature nayi line pe likhein)
                      </label>
                      <textarea
                        rows={3}
                        value={formFeaturesText}
                        onChange={(e) => setFormFeaturesText(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 text-xs font-mono"
                        placeholder="100% Genuine Casio Timepiece&#10;Scratch-resistant Mineral Glass&#10;50M Water Resistance"
                      />
                    </div>
                  </div>
                )}

                {/* Modal Footer Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-1">
                    {formActiveTab !== 'general' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (formActiveTab === 'media') setFormActiveTab('specs');
                          else if (formActiveTab === 'specs') setFormActiveTab('general');
                        }}
                        className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        Previous Step
                      </button>
                    )}
                    {formActiveTab !== 'media' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (formActiveTab === 'general') setFormActiveTab('specs');
                          else if (formActiveTab === 'specs') setFormActiveTab('media');
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        Next Step <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setIsCreatingNew(false); setEditingProduct(null); }}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingProduct}
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isSavingProduct ? 'Saving Watch...' : isCreatingNew ? 'Add Watch to Website' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
