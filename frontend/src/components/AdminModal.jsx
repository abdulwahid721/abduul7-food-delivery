import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, ShieldCheck, RefreshCw, CheckCircle, Clock, Bike, ChefHat, PackageCheck } from 'lucide-react';

export default function AdminModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminOrders();
      setOrders(data);
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
        return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[10px]">Placed</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold text-[10px]">Confirmed</span>;
      case 'preparing':
        return <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold text-[10px]">In Kitchen</span>;
      case 'on_the_way':
        return <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold text-[10px]">On The Way</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">Delivered</span>;
      default:
        return <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-bold text-[10px]">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Abduul Admin Control Panel</h3>
              <p className="text-[11px] text-stone-400">Live order status management (Supabase PostgreSQL)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-600">
              Customer Orders ({orders.length})
            </h4>
            <span className="text-[11px] text-stone-400 font-mono">Real-time sync</span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs">
              No orders placed yet. Orders placed by customers will show up here live!
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div
                  key={o.id || o.order_number}
                  className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2.5 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-900">#{o.order_number || o.id}</span>
                      {getStatusBadge(o.status)}
                    </div>
                    <span className="font-mono font-bold text-[#a61919] text-sm">
                      {(o.total || 0).toLocaleString()} ብር
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-600">
                    <div>
                      <p className="font-semibold text-stone-800">
                        {o.customer_name || o.customerName} ({o.phone})
                      </p>
                      <p className="text-stone-500 truncate">📍 {o.address || o.subcity}</p>
                    </div>
                    <div>
                      <p className="text-stone-500">Payment: <strong className="uppercase text-stone-800">{o.payment_method || o.paymentMethod}</strong></p>
                      <p className="text-stone-400 font-mono">{new Date(o.created_at || o.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  {/* Status Switcher Action Bar */}
                  <div className="pt-1 flex flex-wrap items-center gap-1.5 border-t border-stone-200/70">
                    <span className="text-[10px] text-stone-400 font-bold uppercase mr-1">Update Status:</span>

                    {['placed', 'confirmed', 'preparing', 'on_the_way', 'delivered'].map((st) => {
                      const isActive = o.status === st;
                      return (
                        <button
                          key={st}
                          disabled={isActive || updatingId === (o.id || o.order_number)}
                          onClick={() => handleStatusChange(o.id || o.order_number, st)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition capitalize ${
                            isActive
                              ? 'bg-stone-900 text-white cursor-default'
                              : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-300'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
