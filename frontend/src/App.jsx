import React, { useState, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RestaurantCard from './components/RestaurantCard';
import FoodCard from './components/FoodCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import Footer from './components/Footer';
import { RESTAURANTS, FOODS } from './data/mockData';
import { useCart } from './context/CartContext';
import { Search, Utensils, Sparkles, Filter, X } from 'lucide-react';

export default function App() {
  const { toast } = useCart();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const restaurantsRef = useRef(null);
  const menuRef = useRef(null);

  const scrollToRestaurants = () => {
    restaurantsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const categories = ['All', 'Traditional', 'Fasting', 'Pasta & Pizza', 'Burgers', 'Drinks & Market'];

  const handleSelectRestaurant = (id) => {
    if (selectedRestaurantId === id) {
      setSelectedRestaurantId(null);
    } else {
      setSelectedRestaurantId(id);
      scrollToMenu();
    }
  };

  const filteredFoods = useMemo(() => {
    return FOODS.filter((food) => {
      // Restaurant filter
      if (selectedRestaurantId && food.restaurantId !== selectedRestaurantId) {
        return false;
      }
      // Category filter
      if (activeCategory !== 'All' && food.category !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = food.name.toLowerCase().includes(q);
        const matchesAmharic = food.amharicName?.toLowerCase().includes(q);
        const matchesRest = food.restaurantName.toLowerCase().includes(q);
        const matchesDesc = food.description.toLowerCase().includes(q);
        return matchesName || matchesAmharic || matchesRest || matchesDesc;
      }
      return true;
    });
  }, [selectedRestaurantId, activeCategory, searchQuery]);

  const selectedRestaurant = RESTAURANTS.find((r) => r.id === selectedRestaurantId);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans antialiased">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-stone-700">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Deliver Addis Navigation Header */}
      <Navbar
        onScrollToRestaurants={scrollToRestaurants}
        onFilterDrinks={() => {
          setActiveCategory('All');
          setSearchQuery('Drink');
          scrollToMenu();
        }}
        onFilterMarket={() => {
          setActiveCategory('All');
          setSearchQuery('Market');
          scrollToMenu();
        }}
      />

      {/* Deliver Addis Hero Section */}
      <Hero
        onSeeRestaurants={scrollToRestaurants}
        onViewAll={() => {
          setSelectedRestaurantId(null);
          scrollToRestaurants();
        }}
        onSelectMarket={() => {
          setActiveCategory('All');
          setSearchQuery('Market');
          scrollToMenu();
        }}
        onSelectDrinks={() => {
          setActiveCategory('All');
          setSearchQuery('Drink');
          scrollToMenu();
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        
        {/* Section 1: Featured Restaurants (Matching Screenshot) */}
        <section ref={restaurantsRef} id="featured-restaurants" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                Featured Addis Ababa Restaurants
              </h2>
              <p className="text-xs text-stone-500">
                Real, authentic Addis Ababa restaurants delivering right to your door
              </p>
            </div>

            {selectedRestaurantId && (
              <button
                onClick={() => setSelectedRestaurantId(null)}
                className="text-xs font-semibold text-[#a61919] hover:underline flex items-center gap-1"
              >
                <span>Show all restaurants</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RESTAURANTS.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                isSelected={selectedRestaurantId === restaurant.id}
                onSelect={() => handleSelectRestaurant(restaurant.id)}
              />
            ))}
          </div>
        </section>

        {/* Section 2: Restaurant Menu & Food Items */}
        <section ref={menuRef} id="menu-catalog" className="space-y-6 pt-4 border-t border-stone-200">
          
          {/* Header & Active Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#a61919]" />
                <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                  {selectedRestaurant ? `${selectedRestaurant.name} Menu` : 'Order Delicious Dishes'}
                </h3>
              </div>
              <p className="text-xs text-stone-500">
                {selectedRestaurant
                  ? `Viewing menu items for ${selectedRestaurant.name} (${selectedRestaurant.branch})`
                  : 'Authentic Kitfo, sizzling Shekla Tibs, wood-fired pizza & smash burgers'}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Kitfo, Tibs, Pizza..."
                className="w-full text-xs bg-white border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#a61919] shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    isActive
                      ? 'bg-[#a61919] text-white shadow-xs'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {cat === 'Traditional' && '🇪🇹 '}
                  {cat === 'Fasting' && '🥗 '}
                  {cat === 'Pasta & Pizza' && '🍕 '}
                  {cat === 'Burgers' && '🍔 '}
                  {cat === 'Drinks & Market' && '🍷 '}
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Active Filter Pill */}
          {selectedRestaurant && (
            <div className="flex items-center gap-2 bg-red-50 text-[#a61919] px-3 py-2 rounded-xl text-xs font-semibold w-fit border border-red-100">
              <span>Filtered by: <strong>{selectedRestaurant.name}</strong></span>
              <button
                onClick={() => setSelectedRestaurantId(null)}
                className="hover:bg-red-100 p-0.5 rounded transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Foods Grid */}
          {filteredFoods.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-50 text-[#a61919] flex items-center justify-center mx-auto text-xl">
                🔍
              </div>
              <h4 className="font-bold text-sm text-stone-800">No dishes found</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                We couldn&apos;t find any dishes matching &ldquo;{searchQuery}&rdquo;. Try another dish name or reset filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                  setSelectedRestaurantId(null);
                }}
                className="bg-[#a61919] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#881414] transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Cart Slide-over Drawer */}
      <CartDrawer />

      {/* Checkout Modal */}
      <CheckoutModal />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal />

      {/* Deliver Addis Footer */}
      <Footer />
    </div>
  );
}
