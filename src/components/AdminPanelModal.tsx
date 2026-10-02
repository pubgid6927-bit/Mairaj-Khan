import React, { useState, useEffect } from 'react';
import { WatchProduct, WatchSeries } from '../types';
import { formatPKR, useCart } from '../context/CartContext';
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
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { 
  isSupabaseConfigured, 
  fetchProductsFromSupabase, 
  upsertProductInSupabase, 
  deleteProductInSupabase, 
  fetchOrdersFromSupabase, 
  updateOrderStatusInSupabase,
  bulkSeedProductsToSupabase
} from '../lib/supabase';
import { ALL_PRODUCTS as INITIAL_PRODUCTS } from '../data/products';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'supabase_setup'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState('All');

  // Supabase states
  const isConnected = isSupabaseConfigured();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ count: number; total: number } | null>(null);

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Product Edit / Create state
  const [editingProduct, setEditingProduct] = useState<WatchProduct | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formModel, setFormModel] = useState('');
  const [formName, setFormName] = useState('');
  const [formSeries, setFormSeries] = useState<WatchSeries>('Casio MTP');
  const [formGender, setFormGender] = useState<'Men' | 'Ladies' | 'Unisex'>('Men');
  const [formPrice, setFormPrice] = useState<number>(15000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<string>('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBand, setFormBand] = useState('Stainless Steel');
  const [formWaterResistance, setFormWaterResistance] = useState('50 Meters');
  const [formInStock, setFormInStock] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  const defaultPin = import.meta.env.VITE_ADMIN_PIN || '141madina';

  useEffect(() => {
    if (isOpen && isAuthenticated && activeTab === 'orders') {
      loadOrders();
    }
  }, [isOpen, isAuthenticated, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === defaultPin) {
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
      addToast('Status updated locally');
    }
  };

  const openCreateModal = () => {
    setIsCreatingNew(true);
    setEditingProduct(null);
    setFormModel('MTP-');
    setFormName('Casio Standard Watch');
    setFormSeries('Casio MTP');
    setFormGender('Men');
    setFormPrice(15000);
    setFormOriginalPrice('');
    setFormImageUrl('');
    setFormDescription('Authentic Casio timepiece with Japanese quartz movement.');
    setFormBand('Stainless Steel');
    setFormWaterResistance('50 Meters');
    setFormInStock(true);
    setFormIsFeatured(false);
  };

  const openEditModal = (p: WatchProduct) => {
    setEditingProduct(p);
    setIsCreatingNew(false);
    setFormModel(p.model);
    setFormName(p.name);
    setFormSeries(p.series);
    setFormGender(p.gender);
    setFormPrice(p.pricePKR);
    setFormOriginalPrice(p.originalPricePKR ? String(p.originalPricePKR) : '');
    setFormImageUrl(p.imageUrl);
    setFormDescription(p.description);
    setFormBand(p.specs.bandMaterial);
    setFormWaterResistance(p.specs.waterResistance);
    setFormInStock(p.inStock);
    setFormIsFeatured(Boolean(p.isFeatured));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formModel || !formName || !formPrice) {
      alert('Please fill in required fields (Model, Name, Price)');
      return;
    }

    setIsSaving(true);

    const productId = isCreatingNew
      ? `watch_${Date.now()}_${formModel.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
      : editingProduct!.id;

    const updatedProduct: WatchProduct = {
      id: productId,
      model: formModel.trim().toUpperCase(),
      name: formName.trim(),
      series: formSeries,
      gender: formGender,
      pricePKR: Number(formPrice),
      originalPricePKR: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      inStock: formInStock,
      stockCount: 15,
      isFeatured: formIsFeatured,
      rating: editingProduct?.rating || 4.9,
      reviewsCount: editingProduct?.reviewsCount || 12,
      imageUrl: formImageUrl.trim() || 'https://watchcentre.pk/wp-content/uploads/2023/04/casio-mtp-1302d-2a2v-tiffany-blue-dial-watch.jpg',
      description: formDescription.trim(),
      specs: {
        caseDiameter: editingProduct?.specs?.caseDiameter || '42mm',
        caseThickness: editingProduct?.specs?.caseThickness || '9.8mm',
        waterResistance: formWaterResistance,
        glassType: 'Mineral Glass',
        bandMaterial: formBand as any,
        movement: 'Quartz',
        batteryLife: '3 Years',
        weight: '105g',
        warranty: '1 Year Official'
      },
      features: ['Genuine Casio Movement', formWaterResistance, formBand]
    };

    // Update in Supabase if connected
    if (isConnected) {
      const res = await upsertProductInSupabase(updatedProduct);
      if (!res.success) {
        addToast(`Supabase save note: ${res.error || 'Saved locally'}`);
      }
    }

    // Update local state in app
    let newList: WatchProduct[];
    if (isCreatingNew) {
      newList = [updatedProduct, ...products];
      addToast(`Added new model: ${updatedProduct.model}`);
    } else {
      newList = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      addToast(`Updated model: ${updatedProduct.model}`);
    }

    onProductsUpdated(newList);
    setIsSaving(false);
    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  const handleDeleteProduct = async (p: WatchProduct) => {
    if (!window.confirm(`Are you sure you want to delete ${p.model}?`)) return;

    if (isConnected) {
      await deleteProductInSupabase(p.id);
    }

    const newList = products.filter((item) => item.id !== p.id);
    onProductsUpdated(newList);
    addToast(`Deleted ${p.model}`);
  };

  // 1-Click Sync to Supabase
  const handleBulkSyncToSupabase = async () => {
    if (!isConnected) {
      alert('Please connect Supabase first by adding VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.');
      return;
    }

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      {/* Background click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Admin Card */}
      <div className="relative bg-white border border-slate-200 rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl z-10 flex flex-col text-slate-800 animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              NM
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                New Madina Control Panel
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                  ADMIN
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                Manage Watches, Prices, Stock & Customer Orders · Paradise Centre, Saddar
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
                Enter your Store Admin PIN to edit watches, prices, and view customer orders.
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
                  <AlertCircle className="w-3.5 h-3.5" /> Invalid PIN. Default is: 141madina
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
            {/* Nav Tabs */}
            <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Watches ({products.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Orders {orders.length > 0 ? `(${orders.length})` : ''}</span>
                </button>

                <button
                  onClick={() => setActiveTab('supabase_setup')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'supabase_setup'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Supabase & Netlify Guide</span>
                </button>
              </div>

              {/* Supabase Status Pill */}
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
              </div>
            </div>

            {/* TAB 1: WATCHES / PRODUCTS MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Search & Actions Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search watch model or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-slate-800"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {isConnected && (
                      <button
                        onClick={handleBulkSyncToSupabase}
                        disabled={isSyncing}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                        title="Upload current watch list into your Supabase database"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{isSyncing ? `Uploading (${syncProgress?.count}/${syncProgress?.total})...` : 'Sync Catalog to Supabase'}</span>
                      </button>
                    )}

                    <button
                      onClick={openCreateModal}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Watch</span>
                    </button>
                  </div>
                </div>

                {/* Series Quick Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                  {['All', 'Casio MTP', 'Casio LTP', 'Casio Edifice', 'Casio G-Shock', 'Casio Vintage', 'Casio ProTrek'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSeriesFilter(s)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                        selectedSeriesFilter === s
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Watches Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
                  <div className="max-h-[50vh] overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 sticky top-0 text-[11px] uppercase tracking-wider text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Watch</th>
                          <th className="p-3">Series / Gender</th>
                          <th className="p-3">Price (PKR)</th>
                          <th className="p-3">Stock Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {products
                          .filter((p) => {
                            if (selectedSeriesFilter !== 'All' && p.series !== selectedSeriesFilter) return false;
                            if (searchQuery.trim()) {
                              const q = searchQuery.toLowerCase();
                              return p.model.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
                            }
                            return true;
                          })
                          .slice(0, 100)
                          .map((p) => (
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
                                <span className="font-semibold text-slate-700 block">{p.series}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{p.gender}</span>
                              </td>

                              <td className="p-3 font-mono font-bold text-slate-900">
                                {formatPKR(p.pricePKR)}
                                {p.originalPricePKR && (
                                  <span className="block text-[10px] text-slate-400 line-through">
                                    {formatPKR(p.originalPricePKR)}
                                  </span>
                                )}
                              </td>

                              <td className="p-3">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                                    p.inStock
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}
                                >
                                  {p.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                              </td>

                              <td className="p-3 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    onClick={() => openEditModal(p)}
                                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                                    title="Edit Watch"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
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

            {/* TAB 2: CUSTOMER ORDERS */}
            {activeTab === 'orders' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Customer Orders Received</h3>
                    <p className="text-xs text-slate-500">Live orders placed via Checkout on the website</p>
                  </div>
                  <button
                    onClick={loadOrders}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-2">
                    <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="font-bold text-slate-800 text-sm">No orders recorded in Supabase yet</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      When customers submit the checkout form on your live site, their full details and ordered watches will show up here automatically!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((o) => (
                      <div key={o.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div>
                            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                              {o.order_number}
                            </span>
                            <span className="text-[11px] text-slate-500 ml-2">
                              {new Date(o.created_at).toLocaleDateString()} · {new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Status:</span>
                            <select
                              value={o.status || 'Pending'}
                              onChange={(e) => handleStatusChange(o.id, e.target.value)}
                              className="text-xs font-bold rounded px-2 py-1 bg-slate-100 border border-slate-300 focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Customer:</span>
                            <span className="font-bold text-slate-900">{o.customer_name}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Phone & WhatsApp:</span>
                            <a
                              href={`https://wa.me/${o.phone.replace(/[^0-9]/g, '')}?text=Assalam%20o%20Alaikum%20${encodeURIComponent(o.customer_name)},%20regarding%20your%20Casio%20watch%20order%20${o.order_number}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-600" />
                              <span>{o.phone}</span>
                            </a>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Destination:</span>
                            <span className="text-slate-800 font-medium">{o.city} — {o.address}</span>
                          </div>
                        </div>

                        {/* Ordered Items */}
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
                            Ordered Items & Total:
                          </span>
                          <div className="space-y-1">
                            {Array.isArray(o.items) && o.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between font-mono">
                                <span>{item.quantity}x {item.model} ({item.name})</span>
                                <span className="font-bold">{formatPKR(item.pricePKR * item.quantity)}</span>
                              </div>
                            ))}
                            <div className="pt-1 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                              <span>Total Amount:</span>
                              <span className="text-emerald-700">{formatPKR(o.total_pkr)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SUPABASE & NETLIFY STEP-BY-STEP SETUP GUIDE */}
            {activeTab === 'supabase_setup' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-950">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-700" />
                    How to Connect Supabase to Control Your Website
                  </h4>
                  <p className="text-xs leading-relaxed">
                    Aap ki website mein Supabase integration code bilkul tayar hai! Jab aap Netlify pe deploy karenge to sirf yeh 3 aasan steps follow karlein:
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono">
                        1
                      </span>
                      <span>Supabase par Free Project Banayein</span>
                    </div>
                    <p className="text-slate-600 pl-8">
                      1. <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-amber-800 font-bold underline inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a> par sign in karke <strong>"New Project"</strong> par click karein.<br />
                      2. Project ka name <strong>new-madina-casio</strong> rakhein aur password set karein.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono">
                        2
                      </span>
                      <span>SQL Editor mein Tables Banayein (1-Click Run)</span>
                    </div>
                    <p className="text-slate-600 pl-8">
                      Project ke root folder mein <strong>supabase_schema.sql</strong> file banayi hui hai. Supabase ke left menu mein <strong>SQL Editor</strong> kholen, yeh SQL copy-paste karke <strong>RUN</strong> dabayein:
                    </p>
                    <div className="pl-8">
                      <pre className="p-3 bg-slate-900 text-amber-300 font-mono text-[11px] rounded-lg overflow-x-auto max-h-40">
{`-- Click 'RUN' in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    model TEXT NOT NULL,
    name TEXT NOT NULL,
    series TEXT NOT NULL,
    gender TEXT NOT NULL DEFAULT 'Men',
    price_pkr INTEGER NOT NULL,
    original_price_pkr INTEGER,
    image_url TEXT NOT NULL,
    description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_in_stock BOOLEAN DEFAULT TRUE,
    specs JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    total_pkr INTEGER NOT NULL,
    items JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow public insert orders" ON public.orders FOR ALL USING (true);`}
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

                  {/* Step 4: Netlify Drag & Drop */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-slate-800">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-mono">
                        4
                      </span>
                      <span>Netlify par Drop Kaise Karna Hai?</span>
                    </div>
                    <p className="text-slate-700 pl-8 leading-relaxed">
                      1. Terminal ya command se <code>npm run build</code> chalayein (jo <code>dist</code> folder banata hai).<br />
                      2. Netlify dashboard kholen: <strong>Sites → "Add new site" → "Deploy manually"</strong>.<br />
                      3. Is project ka <strong>dist</strong> folder drag-and-drop kardein!<br />
                      4. Humne <strong>public/_redirects</strong> aur <strong>netlify.toml</strong> already configure kardiye hain taake reload karne par koi 404 error na aaye.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODAL FOR CREATING / EDITING A PRODUCT */}
        {(isCreatingNew || editingProduct) && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  {isCreatingNew ? 'Add New Casio Watch' : `Edit ${editingProduct?.model}`}
                </h3>
                <button
                  onClick={() => { setIsCreatingNew(false); setEditingProduct(null); }}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Model Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MTP-1302D-2A2V"
                      value={formModel}
                      onChange={(e) => setFormModel(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Series *</label>
                    <select
                      value={formSeries}
                      onChange={(e) => setFormSeries(e.target.value as WatchSeries)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 font-semibold"
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
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Watch Title / Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Casio MTP-1302D Tiffany Blue Dial"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Cut Price (Optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 18000"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Gender</label>
                    <select
                      value={formGender}
                      onChange={(e) => setFormGender(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
                    >
                      <option value="Men">Men</option>
                      <option value="Ladies">Ladies</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://watchcentre.pk/wp-content/uploads/..."
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-[11px] focus:outline-none focus:border-slate-800"
                  />
                  {formImageUrl && (
                    <div className="mt-1 flex items-center gap-2">
                      <img src={formImageUrl} alt="Preview" className="w-10 h-10 object-contain border rounded p-0.5 bg-slate-50" />
                      <span className="text-[10px] text-slate-500">Image Preview</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Band Material</label>
                    <select
                      value={formBand}
                      onChange={(e) => setFormBand(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none"
                    >
                      <option value="Stainless Steel">Stainless Steel</option>
                      <option value="Resin / Silicone">Resin / Silicone</option>
                      <option value="Genuine Leather">Genuine Leather</option>
                      <option value="Titanium">Titanium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Water Resistance</label>
                    <select
                      value={formWaterResistance}
                      onChange={(e) => setFormWaterResistance(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none"
                    >
                      <option value="30 Meters (3 BAR)">30 Meters (3 BAR)</option>
                      <option value="50 Meters (5 BAR)">50 Meters (5 BAR)</option>
                      <option value="100 Meters (10 BAR)">100 Meters (10 BAR)</option>
                      <option value="200 Meters (20 BAR)">200 Meters (20 BAR)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formInStock}
                      onChange={(e) => setFormInStock(e.target.checked)}
                      className="rounded text-slate-900 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-800">In Stock</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="rounded text-slate-900 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-800">Featured Watch</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => { setIsCreatingNew(false); setEditingProduct(null); }}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isSaving ? 'Saving...' : 'Save Watch'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
