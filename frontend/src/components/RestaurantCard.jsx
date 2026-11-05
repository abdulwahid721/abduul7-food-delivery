import React from 'react';
import { Star, Tag, Clock, Bike, MapPin } from 'lucide-react';

export default function RestaurantCard({ restaurant, isSelected, onSelect, deliveryInfo }) {
  const ratingNum = Number(restaurant.rating) || 5.0;
  const promo = restaurant.promoBadge || restaurant.promo_badge;
  
  // Use dynamically calculated delivery info from user location if available
  const deliveryTime = deliveryInfo?.deliveryTime || restaurant.deliveryTime || restaurant.delivery_time || '25-35 min';
  const deliveryFee = deliveryInfo?.deliveryFee ?? restaurant.deliveryFee ?? restaurant.delivery_fee ?? 150;
  const distanceKm = deliveryInfo?.distanceKm;
  const isNearest = deliveryInfo?.isNearest;

  return (
    <div
      onClick={onSelect}
      className={`group bg-white rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md ${
        isSelected
          ? 'border-[#a61919] ring-2 ring-[#a61919]/20'
          : 'border-stone-200/90 hover:border-stone-300'
      }`}
    >
      <div>
        {/* Minimized Photo / PP Container (h-36 sm:h-40) */}
        <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-stone-100">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Distance Badge */}
          {distanceKm !== undefined && (
            <div className={`absolute top-2.5 left-2.5 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs flex items-center gap-1 ${
              isNearest || distanceKm <= 1.5
                ? 'bg-emerald-600 text-white ring-1 ring-emerald-300'
                : 'bg-stone-900/80 text-white'
            }`}>
              <MapPin className="w-2.5 h-2.5 text-amber-300" />
              <span>{distanceKm} km {isNearest ? '• Nearest' : ''}</span>
            </div>
          )}

          {/* Delivery Time Badge */}
          <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-stone-800 shadow-xs flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>{deliveryTime}</span>
          </div>
        </div>

        {/* Details matching Deliver Addis aesthetic */}
        <div className="p-3.5 sm:p-4 space-y-2">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#a61919] transition-colors leading-snug line-clamp-1">
              {restaurant.name}
            </h3>
            <p className="text-[11px] text-stone-500">
              📍 {restaurant.branch} • {restaurant.cuisine}
            </p>
          </div>

          {/* Promo Badge matching Deliver Addis */}
          {promo && (
            <div className="bg-red-50/80 border border-red-200 text-red-700 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-red-600 shrink-0" />
              <span className="truncate">{promo}</span>
            </div>
          )}

          {/* 5-Star Golden Rating Row */}
          <div className="flex items-center gap-1 text-amber-400">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.round(ratingNum)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-stone-300'
                }`}
              />
            ))}
            <span className="text-[11px] font-bold text-stone-700 ml-1">
              {ratingNum.toFixed(1)}
            </span>
          </div>

          {/* Description */}
          <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-2">
            {restaurant.description}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-3.5 pb-3.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
        <span className="text-stone-500 flex items-center gap-1 font-medium">
          <Bike className="w-3 h-3 text-[#a61919]" /> {deliveryFee} ብር delivery
        </span>
        <span className={`font-bold transition-colors ${
          isSelected ? 'text-[#a61919]' : 'text-stone-700 group-hover:text-[#a61919]'
        }`}>
          {isSelected ? '✓ Selected' : 'View Menu →'}
        </span>
      </div>
    </div>
  );
}
