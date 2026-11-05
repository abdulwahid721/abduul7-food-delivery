import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Bike, ShoppingBag, Utensils, Wine, Store, User, MapPin, ShieldCheck, ChevronDown } from 'lucide-react';
import { ADDIS_NEIGHBORHOODS } from '../data/locations';

export default function Navbar({
  onScrollToRestaurants,
  onFilterDrinks,
  onFilterMarket,
  currentUser,
  onOpenAuth,
  onOpenAdmin,
  currentNeighborhood,
  onSelectNeighborhood,
}) {
  const { items, setIsCartOpen, activeOrder, setIsTrackerOpen, subtotal } = useCart();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-[#a61919] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Abduul Circular Logo & Brand */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#871212] border-2 border-white/95 shadow-md flex flex-col items-center justify-center text-white transition-transform group-hover:scale-105 shrink-0">
                <Bike className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white -mb-0.5" />
                <span className="text-[8px] sm:text-[9px] font-black tracking-tight uppercase leading-none">Abduul</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-xl font-black tracking-tight text-white leading-tight">
                    Abduul
                  </span>
                  <span className="bg-white/20 text-white text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                    Addis
                  </span>
                </div>
                <span className="hidden lg:block text-[10px] text-red-100/80 font-medium">
                  Real Addis Ababa Restaurants Delivery
                </span>
              </div>
            </a>

            {/* Neighborhood Location Picker Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-1 bg-black/25 hover:bg-black/35 border border-white/20 px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-semibold text-amber-200 transition"
                title="Change delivery neighborhood"
              >
                <MapPin className="w-3 h-3 text-red-300 shrink-0" />
                <span className="truncate max-w-[100px] sm:max-w-[140px]">
                  {currentNeighborhood?.name || 'Addis Ababa'}
                </span>
                <ChevronDown className="w-3 h-3 text-white/70" />
              </button>

              {isLocationOpen && (
                <div className="absolute left-0 mt-1.5 w-64 bg-white text-stone-900 rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 border-b border-stone-100 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Select Your Addis Neighborhood:
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {ADDIS_NEIGHBORHOODS.map((nh) => {
                      const isSelected = currentNeighborhood?.id === nh.id;
                      return (
                        <button
                          key={nh.id}
                          onClick={() => {
                            onSelectNeighborhood(nh);
                            setIsLocationOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs transition flex flex-col ${
                            isSelected
                              ? 'bg-red-50 text-[#a61919] font-bold'
                              : 'hover:bg-stone-50 text-stone-800'
                          }`}
                        >
                          <span className="font-semibold">{nh.name}</span>
                          <span className="text-[10px] text-stone-400">{nh.area}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs sm:text-sm font-semibold text-white/90">
              <button
                onClick={onScrollToRestaurants}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Restaurants</span>
              </button>

              <button
                onClick={onFilterDrinks}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
              >
                <Wine className="w-3.5 h-3.5" />
                <span>Drinks &amp; Tej</span>
              </button>

              <button
                onClick={onFilterMarket}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
              >
                <Store className="w-3.5 h-3.5" />
                <span>The Market</span>
              </button>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Active Order Pill */}
            {activeOrder && (
              <button
                onClick={() => setIsTrackerOpen(true)}
                className="flex items-center gap-1.5 bg-white text-[#a61919] px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold shadow-sm transition animate-pulse"
              >
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
                <span className="truncate max-w-[80px] sm:max-w-none">Track #{activeOrder.orderNumber}</span>
              </button>
            )}

            {/* Admin Portal Button - ALWAYS ACCESSIBLE */}
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs transition ${
                currentUser?.role === 'admin'
                  ? 'bg-amber-400 text-stone-900 hover:bg-amber-300'
                  : 'bg-white/20 hover:bg-white/30 text-white border border-white/25'
              }`}
              title="Store Admin Management & Orders"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Admin Portal</span>
            </button>

            {/* Login / Orders / User Profile (PP) */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 text-xs font-semibold hover:bg-white/10 px-2 sm:px-2.5 py-1.5 rounded-lg transition"
            >
              <span className="text-sm">
                {currentUser?.avatar || '👤'}
              </span>
              <span className="truncate max-w-[70px] sm:max-w-[110px]">
                {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 bg-white text-[#a61919] hover:bg-red-50 px-3 sm:px-3.5 py-1.5 rounded-full font-bold shadow-sm transition active:scale-95 text-xs sm:text-sm"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </div>
              <span className="font-mono">
                {subtotal > 0 ? `${subtotal.toLocaleString()} ብር` : '0 ብር'}
              </span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
