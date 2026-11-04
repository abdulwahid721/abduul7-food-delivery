import React from 'react';
import { useCart } from '../context/CartContext';
import { Bike, ShoppingBag, Utensils, Wine, Store, User } from 'lucide-react';

export default function Navbar({ onScrollToRestaurants, onFilterDrinks, onFilterMarket }) {
  const { items, setIsCartOpen, activeOrder, setIsTrackerOpen, subtotal } = useCart();
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-[#a61919] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          
          {/* Deliver Addis Circular Logo */}
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#a61919] border-2 border-white/90 shadow-sm flex flex-col items-center justify-center text-white transition-transform group-hover:scale-105 shrink-0">
                <Bike className="w-4 h-4 text-white -mb-0.5" />
                <span className="text-[7px] font-black tracking-tight uppercase leading-tight">Deliver</span>
                <span className="text-[8px] font-black tracking-wider uppercase leading-none">Addis</span>
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-base font-black tracking-tight text-white leading-tight">
                  Deliver Addis
                </span>
                <span className="text-[10px] text-red-100/80 font-medium">
                  Addis Ababa Food Delivery
                </span>
              </div>
            </a>

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
                <span>Drinks</span>
              </button>

              <button
                onClick={onFilterMarket}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Market</span>
              </button>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Active Order Pill */}
            {activeOrder && (
              <button
                onClick={() => setIsTrackerOpen(true)}
                className="flex items-center gap-1.5 bg-white text-[#a61919] px-3 py-1 rounded-full text-xs font-bold shadow-sm transition animate-pulse"
              >
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
                <span>Order #{activeOrder.orderNumber}</span>
              </button>
            )}

            {/* Login / Orders */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login / Orders</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-white text-[#a61919] hover:bg-red-50 px-3.5 py-1.5 rounded-full font-bold shadow-sm transition active:scale-95 text-xs sm:text-sm"
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
