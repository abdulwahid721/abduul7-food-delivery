import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RestaurantCard from './components/RestaurantCard';
import FoodCard from './components/FoodCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import AuthModal from './components/AuthModal';
import AdminModal from './components/AdminModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import Footer from './components/Footer';
import { RESTAURANTS as initialRestaurants, FOODS as initialFoods } from './data/mockData';
import { ADDIS_NEIGHBORHOODS, getRestaurantDeliveryInfo } from './data/locations';
import { api } from './services/api';
import { useCart } from './context/CartContext';
import { Search, Utensils, Sparkles, MapPin, X, ArrowUpDown, ShieldCheck } from 'lucide-react';

export default function App() {
  const { toast } = useCart();
  const [restaurantsList, setRestaurantsList] = useState(initialRestaurants);
  const [foodsList, setFoodsList] = useState(initialFoods);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Delivery Neighborhood Location (Default to Bole Medhanialem)
  const [currentNeighborhood, setCurrentNeighborhood] = useState(ADDIS_NEIGHBORHOODS[0]);
  const [restaurantSort, setRestaurantSort] = useState('nearest'); // 'nearest', 'rating'

  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const restaurantsRef = useRef(null);
  const menuRef = useRef(null);

  // Load live data from Supabase backend
  useEffect(() => {
    async function loadData() {
      try {
        const [rData, fData, uData] = await Promise.all([
          api.getRestaurants(),
          api.getFoods(),
          api.getCurrentUser(),
        ]);
        if (rData && rData.length > 0) setRestaurantsList(rData);
        if (fData && fData.length > 0) setFoodsList(fData);
        if (uData) setCurrentUser(uData);
      } catch (e) {
        console.error('Data loading error:', e);
      }
    }
    loadData();
  }, []);

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

  // Calculate live distance & delivery info from selected Addis neighborhood
  const restaurantsWithDelivery = useMemo(() => {
    const list = restaurantsList.map((r) => {
      const info = getRestaurantDeliveryInfo(r, currentNeighborhood);
      return {
        ...r,
        deliveryInfo: info,
      };
    });

    // Find nearest restaurant
    let minDistance = Infinity;
    list.forEach((r) => {
      if (r.deliveryInfo.distanceKm < minDistance) {
        minDistance = r.deliveryInfo.distanceKm;
      }
    });

    list.forEach((r) => {
      r.deliveryInfo.isNearest = r.deliveryInfo.distanceKm === minDistance;
    });

    if (restaurantSort === 'nearest') {
      return [...list].sort((a, b) => a.deliveryInfo.distanceKm - b.deliveryInfo.distanceKm);
    }
    if (restaurantSort === 'rating') {
      return [...list].sort((a, b) => (Number(b.rating) || 5) - (Number(a.rating) || 5));
    }
    return list;
  }, [restaurantsList, currentNeighborhood, restaurantSort]);

  const filteredFoods = useMemo(() => {
    return foodsList.filter((food) => {
      const restId = food.restaurantId || food.restaurant_id;
      // Restaurant filter
      if (selectedRestaurantId && restId !== selectedRestaurantId) {
        return false;
      }
      // Category filter
      if (activeCategory !== 'All' && food.category !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = food.name?.toLowerCase().includes(q);
        const matchesAmharic = (food.amharicName || food.amharic_name)?.toLowerCase().includes(q);
        const matchesRest = (food.restaurantName || food.restaurant_name)?.toLowerCase().includes(q);
        const matchesDesc = food.description?.toLowerCase().includes(q);
        const matchesCat = food.category?.toLowerCase().includes(q);
        return matchesName || matchesAmharic || matchesRest || matchesDesc || matchesCat;
      }
      return true;
    });
  }, [foodsList, selectedRestaurantId, activeCategory, searchQuery]);

  const selectedRestaurant = restaurantsList.find((r) => r.id === selectedRestaurantId);

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
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        currentNeighborhood={currentNeighborhood}
        onSelectNeighborhood={(nh) => {
          setCurrentNeighborhood(nh);
          setRestaurantSort('nearest');
        }}
        onScrollToRestaurants={scrollToRestaurants}
        onFilterDrinks={() => {
          setSelectedRestaurantId(null);
          setActiveCategory('Drinks & Market');
          setSearchQuery('');
          scrollToMenu();
        }}
        onFilterMarket={() => {
          setSelectedRestaurantId(null);
          setActiveCategory('Drinks & Market');
          setSearchQuery('');
          scrollToMenu();
        }}
      />

      {/* Deliver Addis Hero Section */}
      <Hero
        currentNeighborhood={currentNeighborhood}
        onSeeRestaurants={() => {
          setRestaurantSort('nearest');
          scrollToRestaurants();
        }}
        onViewAll={() => {
          setSelectedRestaurantId(null);
          setActiveCategory('All');
          setSearchQuery('');
          scrollToRestaurants();
        }}
        onSelectMarket={() => {
          setSelectedRestaurantId(null);
          setActiveCategory('Drinks & Market');
          setSearchQuery('');
          scrollToMenu();
        }}
        onSelectDrinks={() => {
          setSelectedRestaurantId(null);
          setActiveCategory('Drinks & Market');
          setSearchQuery('');
          scrollToMenu();
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        
        {/* Section 1: Featured Restaurants */}
        <section ref={restaurantsRef} id="featured-restaurants" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                  Addis Ababa Restaurants Near You
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Distance
                </span>
              </div>
              <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#a61919]" />
                <span>
                  Delivering to: <strong className="text-stone-800">{currentNeighborhood.name}</strong> ({currentNeighborhood.area})
                </span>
              </p>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-500 font-semibold flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-stone-400" /> Sort:
              </span>
              <button
                onClick={() => setRestaurantSort('nearest')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  restaurantSort === 'nearest'
                    ? 'bg-[#a61919] text-white shadow-2xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                📍 Nearest First
              </button>
              <button
                onClick={() => setRestaurantSort('rating')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  restaurantSort === 'rating'
                    ? 'bg-[#a61919] text-white shadow-2xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                ⭐ Top Rated
              </button>

              {selectedRestaurantId && (
                <button
                  onClick={() => setSelectedRestaurantId(null)}
                  className="text-xs font-semibold text-[#a61919] hover:underline flex items-center gap-1 ml-2"
                >
                  <span>Show all</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Restaurant Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {restaurantsWithDelivery.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                deliveryInfo={restaurant.deliveryInfo}
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
                  {selectedRestaurant ? `${selectedRestaurant.name} Menu` : 'Order Authentic Dishes'}
                </h3>
              </div>
              <p className="text-xs text-stone-500">
                {selectedRestaurant
                  ? `Viewing authentic menu items from ${selectedRestaurant.name} (${selectedRestaurant.branch})`
                  : 'Traditional Kitfo, sizzling Shekla Tibs, fasting beyaynetu, pasta, pizza & smash burgers'}
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
      <CheckoutModal
        currentUser={currentUser}
        currentNeighborhood={currentNeighborhood}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal />

      {/* Authentication Modal (Login / Register / Profile Picture PP) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={currentUser}
        onUserChange={setCurrentUser}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Admin Order & Menu Control Panel Modal - ONLY FOR ADMIN */}
      {currentUser?.role === 'admin' && (
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          foods={foodsList}
        />
      )}

      {/* Privacy Policy & Data Security Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Deliver Addis Footer */}
      <Footer
        currentUser={currentUser}
        onOpenAdmin={() => {
          if (currentUser?.role === 'admin') {
            setIsAdminOpen(true);
          } else {
            setIsAuthOpen(true);
          }
        }}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />
    </div>
  );
}
