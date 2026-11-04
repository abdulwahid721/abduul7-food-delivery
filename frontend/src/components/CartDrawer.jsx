import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    setIsCheckoutOpen,
    subtotal,
    deliveryFee,
    tax,
    total,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-stone-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#a61919] text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">Your Basket</h3>
              <p className="text-[11px] text-stone-500">{items.length} items</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-stone-400 hover:text-red-600 transition px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-7 h-7 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-3xl">
              🥘
            </div>
            <h4 className="text-base font-bold text-stone-800">Your basket is empty</h4>
            <p className="text-xs text-stone-500 max-w-xs">
              Explore restaurants to add authentic Kitfo, Shekla Tibs, Pizza, and Burgers!
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="bg-[#a61919] hover:bg-[#881414] text-white px-5 py-2 rounded-lg text-xs font-bold transition"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-stone-100">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border border-stone-200 bg-stone-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs text-stone-900 truncate">
                        {item.amharicName || item.name}
                      </h4>
                      <span className="font-mono font-bold text-xs text-stone-900 shrink-0">
                        {(item.price * item.quantity).toLocaleString()} ብር
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 truncate">{item.restaurantName}</p>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 rounded bg-white text-stone-700 shadow-2xs flex items-center justify-center hover:bg-stone-200 transition"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 rounded bg-white text-stone-700 shadow-2xs flex items-center justify-center hover:bg-stone-200 transition"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-red-500 p-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-2.5">
              <div className="space-y-1 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-stone-900">{subtotal.toLocaleString()} ብር</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `${deliveryFee} ብር`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (15%)</span>
                  <span className="font-mono">{tax.toLocaleString()} ብር</span>
                </div>
                <div className="flex justify-between font-black text-sm text-stone-900 pt-1.5 border-t border-stone-200">
                  <span>Total</span>
                  <span className="font-mono text-[#a61919] text-base">{total.toLocaleString()} ብር</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#a61919] hover:bg-[#881414] active:scale-[0.98] text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-between shadow-md transition-all"
              >
                <span>Proceed to Checkout</span>
                <div className="flex items-center gap-1 font-mono">
                  <span>{total.toLocaleString()} ብር</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
