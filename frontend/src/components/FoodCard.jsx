import React from 'react';
import { useCart } from '../context/CartContext';
import { Plus, Star, Clock } from 'lucide-react';

export default function FoodCard({ food }) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Minimized Photo Container */}
        <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-stone-100">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs flex items-center gap-1 border border-white/10">
            <Clock className="w-2.5 h-2.5 text-amber-400" />
            <span>{food.prepTime}</span>
          </div>

          <div className="absolute bottom-2 left-2.5 flex items-center gap-1 text-white text-xs font-bold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{food.rating}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5 space-y-1">
          <p className="text-[10px] text-stone-400 font-semibold truncate">
            {food.restaurantName}
          </p>
          <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#a61919] transition-colors leading-snug line-clamp-1">
            {food.amharicName || food.name}
          </h4>
          <p className="text-[11px] font-medium text-amber-800 -mt-0.5 truncate">
            {food.name}
          </p>
          <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed pt-0.5">
            {food.description}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-3.5 pb-3.5 pt-2 border-t border-stone-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] text-stone-400 font-bold uppercase">Price</span>
          <span className="text-base font-black text-stone-900 font-mono">
            {food.price.toLocaleString()} <span className="text-xs font-bold text-amber-600 font-sans">ብር</span>
          </span>
        </div>

        <button
          onClick={() => addToCart(food)}
          className="flex items-center gap-1 bg-[#a61919] hover:bg-[#881414] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}
