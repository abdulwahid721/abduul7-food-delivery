import React from 'react';
import { Star, Tag, Clock, Bike } from 'lucide-react';

export default function RestaurantCard({ restaurant, isSelected, onSelect }) {
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
          <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-stone-800 shadow-xs flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>{restaurant.deliveryTime}</span>
          </div>
        </div>

        {/* Details matching Deliver Addis screenshot */}
        <div className="p-3.5 sm:p-4 space-y-2">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#a61919] transition-colors leading-snug line-clamp-1">
              {restaurant.name} <span className="text-stone-500 font-normal text-xs">({restaurant.branch})</span>
            </h3>
            <p className="text-[11px] text-stone-500">{restaurant.cuisine}</p>
          </div>

          {/* Promo Badge matching screenshot */}
          {restaurant.promoBadge && (
            <div className="bg-red-50/80 border border-red-200 text-red-700 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-red-600 shrink-0" />
              <span className="truncate">{restaurant.promoBadge}</span>
            </div>
          )}

          {/* 5-Star Golden Rating Row */}
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(restaurant.rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-[11px] font-bold text-stone-700 ml-1">{restaurant.rating.toFixed(1)}</span>
          </div>

          {/* Description */}
          <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-2">
            {restaurant.description}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-3.5 pb-3.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
        <span className="text-stone-400 flex items-center gap-1 font-medium">
          <Bike className="w-3 h-3 text-[#a61919]" /> {restaurant.deliveryFee} ብር
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
