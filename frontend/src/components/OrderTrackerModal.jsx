import React from 'react';
import { useCart } from '../context/CartContext';
import { X, CheckCircle2, Clock, Bike, Phone, MapPin, ChefHat, PackageCheck, AlertCircle } from 'lucide-react';

export default function OrderTrackerModal() {
  const { activeOrder, isTrackerOpen, setIsTrackerOpen, setActiveOrder } = useCart();

  if (!isTrackerOpen || !activeOrder) return null;

  const steps = [
    { key: 'placed', label: 'Order Placed', icon: Clock, desc: 'We received your order' },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, desc: 'Restaurant accepted' },
    { key: 'preparing', label: 'In Kitchen', icon: ChefHat, desc: 'Freshly cooking your food' },
    { key: 'on_the_way', label: 'On The Way', icon: Bike, desc: 'Courier is en route to you' },
    { key: 'delivered', label: 'Delivered', icon: PackageCheck, desc: 'Enjoy your meal!' },
  ];

  const currentIdx = steps.findIndex((s) => s.key === activeOrder.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#a61919] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Bike className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">Live Order Tracking</h3>
                <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded font-mono font-bold">
                  #{activeOrder.orderNumber}
                </span>
              </div>
              <p className="text-[11px] text-red-100">Estimated delivery: 25 - 35 mins</p>
            </div>
          </div>

          <button
            onClick={() => setIsTrackerOpen(false)}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Progress Timeline */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
            <h4 className="font-bold text-stone-800 text-xs mb-3 flex items-center gap-1.5">
              <span>Status Timeline</span>
              <span className="text-[10px] text-stone-400 font-normal">(Auto-updates live)</span>
            </h4>

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
              <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-900 text-xs shrink-0">
                DT
              </div>
              <div>
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Your Courier</p>
                <p className="font-bold text-xs text-stone-900">{activeOrder.driverName}</p>
                <p className="text-[11px] text-stone-500 font-mono">{activeOrder.driverPhone}</p>
              </div>
            </div>

            <a
              href={`tel:${activeOrder.driverPhone}`}
              className="bg-[#a61919] hover:bg-[#881414] text-white p-2 rounded-lg transition shadow-xs flex items-center gap-1 text-[11px] font-bold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          </div>

          {/* Delivery Location */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#a61919] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-stone-900 text-xs">Destination</p>
              <p className="text-[11px] text-stone-600">{activeOrder.address}</p>
              <p className="text-[10px] text-stone-400">Recipient: {activeOrder.customerName} ({activeOrder.phone})</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border border-stone-200 rounded-xl p-3 space-y-2">
            <p className="font-bold text-stone-800 text-xs border-b border-stone-100 pb-1.5">
              Items Ordered ({activeOrder.items?.length || 0})
            </p>

            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {activeOrder.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-[11px]">
                  <span className="text-stone-700">
                    <span className="font-bold text-stone-900">{item.quantity}x</span> {item.name}
                  </span>
                  <span className="font-mono font-semibold text-stone-900">
                    {(item.price * item.quantity).toLocaleString()} ብር
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-between font-black text-stone-900">
              <span>Total Paid ({String(activeOrder.paymentMethod || 'cash').toUpperCase()})</span>
              <span className="font-mono text-[#a61919] text-sm">
                {Number(activeOrder.total || 0).toLocaleString()} ብር
              </span>
            </div>
          </div>

          {/* Reset / Clear Order */}
          <button
            onClick={() => {
              setActiveOrder(null);
              setIsTrackerOpen(false);
            }}
            className="w-full text-center text-[11px] text-stone-400 hover:text-stone-700 py-1 transition"
          >
            Close Tracking / Place New Order
          </button>
        </div>
      </div>
    </div>
  );
}
