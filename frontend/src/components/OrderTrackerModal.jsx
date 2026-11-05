import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import {
  X,
  CheckCircle2,
  Clock,
  Bike,
  Phone,
  MapPin,
  ChefHat,
  PackageCheck,
  Navigation,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export default function OrderTrackerModal() {
  const { activeOrder, isTrackerOpen, setIsTrackerOpen, setActiveOrder } = useCart();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Poll for live status from backend/Supabase every 3 seconds
  useEffect(() => {
    if (!isTrackerOpen || !activeOrder || activeOrder.status === 'delivered') return;

    const interval = setInterval(async () => {
      try {
        const orderNum = activeOrder.orderNumber || activeOrder.order_number || activeOrder.id;
        const live = await api.trackOrder(orderNum);
        if (live && live.status && live.status !== activeOrder.status) {
          setActiveOrder((prev) => (prev ? { ...prev, status: live.status } : null));
        }
      } catch (e) {}
    }, 3000);

    return () => clearInterval(interval);
  }, [isTrackerOpen, activeOrder, setActiveOrder]);

  if (!isTrackerOpen || !activeOrder) return null;

  const steps = [
    { key: 'placed', label: 'Order Received', icon: Clock, desc: 'Verified and queued at restaurant' },
    { key: 'confirmed', label: 'Accepted by Kitchen', icon: CheckCircle2, desc: 'Chef started preparation' },
    { key: 'preparing', label: 'Sizzling in Kitchen', icon: ChefHat, desc: 'Simmering hot with fresh kibbeh & spices' },
    { key: 'on_the_way', label: 'Courier En Route', icon: Bike, desc: 'Scooter dispatched on Addis roads' },
    { key: 'delivered', label: 'Delivered & Enjoy', icon: PackageCheck, desc: 'Handed to customer • መልካም ምግብ!' },
  ];

  const currentIdx = steps.findIndex((s) => s.key === activeOrder.status);
  const progressPercent = Math.min(100, Math.max(10, ((currentIdx + 1) / steps.length) * 100));

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const orderNum = activeOrder.orderNumber || activeOrder.order_number || activeOrder.id;
      const live = await api.trackOrder(orderNum);
      if (live && live.status) {
        setActiveOrder((prev) => (prev ? { ...prev, ...live } : null));
      }
    } catch (e) {
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const getETA = () => {
    switch (activeOrder.status) {
      case 'placed':
        return 'Estimated: 30 - 40 mins';
      case 'confirmed':
        return 'Estimated: 25 - 35 mins';
      case 'preparing':
        return 'Estimated: 15 - 20 mins';
      case 'on_the_way':
        return 'Courier nearby: 5 - 10 mins';
      case 'delivered':
        return 'Order Completed • መልካም ምግብ!';
      default:
        return 'Estimated: 25 - 35 mins';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#a61919] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
              <Bike className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">Live Addis Order Tracker</h3>
                <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded font-mono font-bold">
                  #{activeOrder.orderNumber || activeOrder.order_number}
                </span>
              </div>
              <p className="text-[11px] text-red-100 font-medium">{getETA()}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleManualRefresh}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
              title="Sync Status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsTrackerOpen(false)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Animated Route & GPS Map Visualization */}
          <div className="bg-stone-900 text-white rounded-xl p-3.5 space-y-3 relative overflow-hidden border border-stone-800 shadow-inner">
            <div className="flex items-center justify-between text-[11px] border-b border-stone-800 pb-2">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Navigation className="w-3.5 h-3.5 animate-spin" />
                <span>Addis Ababa Live Delivery Route</span>
              </span>
              <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded text-emerald-400 font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                GPS CONNECTED
              </span>
            </div>

            {/* Stylized Visual Map Route */}
            <div className="py-2 px-1 relative">
              <div className="flex items-center justify-between relative z-10">
                {/* Origin Restaurant */}
                <div className="flex flex-col items-center text-center max-w-[90px]">
                  <div className="w-8 h-8 rounded-full bg-stone-800 border-2 border-amber-400 flex items-center justify-center text-xs mb-1">
                    🥘
                  </div>
                  <span className="text-[10px] font-bold text-stone-200 truncate w-full">
                    Addis Kitchen
                  </span>
                </div>

                {/* Scooter Moving along the route */}
                <div className="flex-1 mx-3 relative flex items-center">
                  <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-red-500 to-emerald-400 transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div
                    className="absolute -top-3 transition-all duration-700 text-base"
                    style={{ left: `calc(${progressPercent}% - 12px)` }}
                  >
                    🛵
                  </div>
                </div>

                {/* Destination */}
                <div className="flex flex-col items-center text-center max-w-[90px]">
                  <div className="w-8 h-8 rounded-full bg-stone-800 border-2 border-emerald-400 flex items-center justify-center text-xs mb-1">
                    📍
                  </div>
                  <span className="text-[10px] font-bold text-stone-200 truncate w-full">
                    {activeOrder.subcity || 'Destination'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-stone-400 text-center font-mono">
              Road: Bole Medhanialem ➔ Cameroon St ➔ Destination
            </p>
          </div>

          {/* Progress Timeline */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
                <span>Real-Time Stage</span>
                <span className="text-[10px] text-stone-400 font-normal">(Synced live with kitchen dispatch)</span>
              </h4>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {steps.map((step, idx) => {
                const isPassed = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                const IconComponent = step.icon;

                return (
                  <div key={step.key} className="relative flex items-start gap-3">
                    <span
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#a61919] text-white ring-4 ring-red-100'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-200 text-stone-400'
                      }`}
                    >
                      <IconComponent className="w-2.5 h-2.5" />
                    </span>

                    <div className="min-w-0">
                      <p
                        className={`font-bold text-xs ${
                          isCurrent
                            ? 'text-[#a61919]'
                            : isPassed
                            ? 'text-stone-900'
                            : 'text-stone-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[11px] text-stone-500">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Card */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-lg shrink-0">
                🛵
              </div>
              <div>
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                  Assigned Rider (Addis Dispatch)
                </p>
                <p className="font-bold text-xs text-stone-900">
                  {activeOrder.driverName || activeOrder.driver_name || 'ዳዊት ታደሰ (Dawit Tadesse)'}
                </p>
                <p className="text-[11px] text-stone-500 font-mono">
                  {activeOrder.driverPhone || activeOrder.driver_phone || '+251 91 123 4567'} • Plate: AA-2-84920
                </p>
              </div>
            </div>

            <a
              href={`tel:${activeOrder.driverPhone || activeOrder.driver_phone || '+251911234567'}`}
              className="bg-[#a61919] hover:bg-[#881414] text-white p-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5 text-[11px] font-bold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Courier</span>
            </a>
          </div>

          {/* Destination */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#a61919] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-stone-900 text-xs">Delivery Address</p>
              <p className="text-[11px] text-stone-700">
                <strong>{activeOrder.subcity}</strong> — {activeOrder.address}
              </p>
              <p className="text-[10px] text-stone-400">
                Recipient: {activeOrder.customerName || activeOrder.customer_name} ({activeOrder.phone})
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border border-stone-200 rounded-xl p-3 space-y-2">
            <p className="font-bold text-stone-800 text-xs border-b border-stone-100 pb-1.5">
              Items in Delivery ({activeOrder.items?.length || 0})
            </p>

            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {activeOrder.items?.map((item, idx) => (
                <div key={item.id || idx} className="flex justify-between text-[11px]">
                  <span className="text-stone-700">
                    <span className="font-bold text-stone-900">{item.quantity}x</span>{' '}
                    {item.amharicName || item.amharic_name || item.name}
                  </span>
                  <span className="font-mono font-semibold text-stone-900">
                    {((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()} ብር
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-between font-black text-stone-900">
              <span>Total Paid ({String(activeOrder.paymentMethod || activeOrder.payment_method || 'telebirr').toUpperCase()})</span>
              <span className="font-mono text-[#a61919] text-sm">
                {Number(activeOrder.total || 0).toLocaleString()} ብር
              </span>
            </div>
          </div>

          {/* Close / Dismiss */}
          <button
            onClick={() => {
              setIsTrackerOpen(false);
            }}
            className="w-full text-center text-[11px] text-stone-500 hover:text-stone-800 py-1 transition"
          >
            Keep tracker in background &amp; browse more foods
          </button>
        </div>
      </div>
    </div>
  );
}
