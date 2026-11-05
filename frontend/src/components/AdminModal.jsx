import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  X,
  ShieldCheck,
  RefreshCw,
  Clock,
  Bike,
  ChefHat,
  PackageCheck,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Phone,
  MapPin,
  Utensils,
  Search,
} from 'lucide-react';

export default function AdminModal({ isOpen, onClose, foods = [] }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'menu', 'stats'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId || o.order_number === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'placed':
        return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[10px]">1. Placed</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold text-[10px]">2. Confirmed</span>;
      case 'preparing':
        return <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold text-[10px]">3. In Kitchen</span>;
      case 'on_the_way':
        return <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold text-[10px]">4. On The Way</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">5. Delivered</span>;
      default:
        return <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-bold text-[10px]">{status}</span>;
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const activeDeliveriesCount = orders.filter((o) => o.status !== 'delivered').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">Abduul Store Admin Portal</h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded font-mono font-bold">
                  LIVE DISPATCH
                </span>
              </div>
              <p className="text-[11px] text-stone-400">Order Dispatch &amp; Menu Control (Supabase PostgreSQL)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition flex items-center gap-1 text-xs"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-stone-100 border-b border-stone-200 px-4 py-2 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders Dispatch ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'menu'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Dishes &amp; Prices ({foods.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'stats'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Revenue &amp; Analytics</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Order Status Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap text-xs">
                  <span className="text-stone-500 font-semibold mr-1">Filter:</span>
                  {['all', 'placed', 'confirmed', 'preparing', 'on_the_way', 'delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition capitalize ${
                        filterStatus === st
                          ? 'bg-[#a61919] text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <span className="text-[11px] text-stone-400 font-mono">
                  {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} shown
                </span>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs bg-stone-50 rounded-xl border border-dashed border-stone-200">
                  <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="font-semibold text-stone-600">No orders found matching this filter.</p>
                  <p className="text-[11px]">New orders placed by customers will stream here instantly.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((o) => (
                    <div
                      key={o.id || o.order_number}
                      className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-3 text-xs"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                            #{o.orderNumber || o.order_number || o.id}
                          </span>
                          {getStatusBadge(o.status)}
                          <span className="text-[10px] text-stone-400 font-mono">
                            {new Date(o.createdAt || o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <span className="font-mono font-black text-[#a61919] text-sm">
                          {(Number(o.total) || 0).toLocaleString()} ብር
                        </span>
                      </div>

                      {/* Customer & Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200/60">
                        <div>
                          <p className="font-bold text-stone-900 flex items-center gap-1">
                            <span>👤 {o.customerName || o.customer_name}</span>
                          </p>
                          <p className="text-stone-500 font-mono">📱 {o.phone}</p>
                          <p className="text-stone-600 mt-0.5">
                            📍 <strong>{o.subcity}</strong> — {o.address}
                          </p>
                        </div>
                        <div>
                          <p className="text-stone-500">
                            Payment: <strong className="uppercase text-stone-900 font-mono">{o.paymentMethod || o.payment_method}</strong>
                          </p>
                          <p className="text-stone-500">
                            Courier: <strong className="text-stone-800">{o.driverName || o.driver_name || 'ዳዊት ታደሰ'}</strong> ({o.driverPhone || o.driver_phone || '+251 91 123 4567'})
                          </p>
                        </div>
                      </div>

                      {/* Items Ordered List */}
                      {o.items && o.items.length > 0 && (
                        <div className="space-y-1 bg-stone-100/70 p-2.5 rounded-lg border border-stone-200/50">
                          <p className="font-bold text-stone-700 text-[10px] uppercase tracking-wider mb-1">
                            Dishes to prepare ({o.items.length}):
                          </p>
                          <div className="space-y-1">
                            {o.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-[11px] text-stone-800">
                                <span>
                                  <strong className="text-[#a61919] font-mono">{item.quantity}x</strong>{' '}
                                  {item.amharic_name || item.amharicName || item.name}
                                </span>
                                <span className="font-mono text-stone-600">
                                  {((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()} ብር
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Status Switcher Action Bar */}
                      <div className="pt-1 flex flex-wrap items-center gap-1.5 border-t border-stone-200/70">
                        <span className="text-[10px] text-stone-500 font-bold uppercase mr-1">
                          Advance Stage:
                        </span>

                        {[
                          { key: 'placed', label: '1. Placed' },
                          { key: 'confirmed', label: '2. Accept' },
                          { key: 'preparing', label: '3. Kitchen' },
                          { key: 'on_the_way', label: '4. Dispatch' },
                          { key: 'delivered', label: '5. Delivered' },
                        ].map((st) => {
                          const isActive = o.status === st.key;
                          return (
                            <button
                              key={st.key}
                              disabled={isActive || updatingId === (o.id || o.order_number)}
                              onClick={() => handleStatusChange(o.id || o.order_number, st.key)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                                isActive
                                  ? 'bg-stone-900 text-white cursor-default shadow-xs'
                                  : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-300'
                              }`}
                            >
                              {st.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MENU & DISHES */}
          {activeTab === 'menu' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700">
                  Addis Ababa Restaurant Dishes &amp; Pricing
                </h4>
                <span className="text-[11px] text-stone-500 font-mono">{foods.length} items active</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {foods.map((food) => (
                  <div
                    key={food.id}
                    className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-stone-400 truncate">
                        {food.restaurantName || food.restaurant_name}
                      </p>
                      <p className="font-bold text-xs text-stone-900 truncate">
                        {food.amharicName || food.amharic_name || food.name}
                      </p>
                      <p className="text-[10px] text-stone-500 truncate">{food.name}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-black text-sm text-[#a61919] block">
                        {(Number(food.price) || 0).toLocaleString()} <span className="text-[10px] font-sans">ብር</span>
                      </span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                        In Stock
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-stone-900 text-white p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Sales</span>
                  <p className="font-mono font-black text-xl text-amber-400">
                    {totalRevenue.toLocaleString()} <span className="text-xs text-stone-300 font-sans">ብር</span>
                  </p>
                  <p className="text-[10px] text-stone-400">Across {orders.length} total orders</p>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Active Deliveries</span>
                  <p className="font-mono font-black text-xl text-[#a61919]">
                    {activeDeliveriesCount}
                  </p>
                  <p className="text-[10px] text-stone-500">Currently in kitchen / en route</p>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Platform Security</span>
                  <p className="font-bold text-base text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>PostgreSQL Live</span>
                  </p>
                  <p className="text-[10px] text-stone-500">Supabase Ireland + Render SSL</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs space-y-1 text-amber-900">
                <p className="font-bold">💡 Dispatch Manager Tip:</p>
                <p className="text-[11px] text-amber-800">
                  When you advance an order from <strong>"2. Accept"</strong> to <strong>"3. Kitchen"</strong> and <strong>"4. Dispatch"</strong>, the customer’s live tracking screen immediately reflects the scooter's movement on the Addis Ababa map without requiring them to reload the page!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
