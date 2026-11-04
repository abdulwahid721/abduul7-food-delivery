import React from 'react';
import { MapPin, Utensils, Store, Wine, List, Sparkles } from 'lucide-react';

export default function Hero({ onSeeRestaurants, onViewAll, onSelectMarket, onSelectDrinks }) {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-white min-h-[300px] sm:min-h-[380px] flex items-center justify-center">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/real-kitfo.jpg"
          alt="Abduul Addis Ababa Ethiopian Food"
          className="w-full h-full object-cover object-center brightness-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/85" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-center space-y-4">
        
        {/* Brand Pill */}
        <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-300 border border-white/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Abduul • Addis Ababa Food Delivery</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight max-w-3xl mx-auto">
          Get food from your favorite restaurants in Addis delivered to your home or office.
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-stone-200 font-normal max-w-2xl mx-auto leading-relaxed">
          Order from legendary Addis Ababa restaurants — <strong>Totot</strong>, <strong>Kategna</strong>, <strong>Yod Abyssinia</strong>, <strong>Effoi Pizza</strong>, <strong>Moyos Burger</strong> &amp; <strong>Castelli</strong>.
        </p>

        {/* Two-Column Option Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 max-w-2xl mx-auto text-left">
          
          {/* Left Column: Restaurants */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-white font-bold text-xs sm:text-sm justify-center md:justify-start">
              <Utensils className="w-3.5 h-3.5 text-red-400" />
              <span>Real Addis Restaurants</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={onSeeRestaurants}
                className="w-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/30 hover:border-white/60 text-white px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center md:justify-start gap-2 shadow-sm group"
              >
                <MapPin className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
                <span>See restaurants near you</span>
              </button>

              <button
                onClick={onViewAll}
                className="w-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/30 hover:border-white/60 text-white px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center md:justify-start gap-2 shadow-sm group"
              >
                <List className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>View all of our restaurants</span>
              </button>
            </div>
          </div>

          {/* Right Column: Want more than food? */}
          <div className="space-y-2">
            <div className="text-white font-bold text-xs sm:text-sm text-center md:text-left">
              <span>Want more than food?</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={onSelectMarket}
                className="w-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/30 hover:border-white/60 text-white px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center md:justify-start gap-2 shadow-sm group"
              >
                <Store className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>The Market: Groceries &amp; more</span>
              </button>

              <button
                onClick={onSelectDrinks}
                className="w-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/30 hover:border-white/60 text-white px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center md:justify-start gap-2 shadow-sm group"
              >
                <Wine className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>Drinks: Tej, Wines, Beers &amp; Spirits</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
