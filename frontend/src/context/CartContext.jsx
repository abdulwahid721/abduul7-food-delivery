import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [toast, setToast] = useState(null);

  // Load active order on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('abduul_order');
      if (saved) setActiveOrder(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save active order
  useEffect(() => {
    try {
      if (activeOrder) {
        localStorage.setItem('abduul_order', JSON.stringify(activeOrder));
      } else {
        localStorage.removeItem('abduul_order');
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeOrder]);

  // Toast timer
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Live Order Status Sync from Database
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'delivered') return;

    const interval = setInterval(async () => {
      try {
        const orderNumber = activeOrder.orderNumber || activeOrder.order_number;
        const live = await api.trackOrder(orderNumber);
        if (live && live.status && live.status !== activeOrder.status) {
          setActiveOrder((prev) => (prev ? { ...prev, status: live.status } : null));
        }
      } catch (e) {}
    }, 5000);

    return () => clearInterval(interval);
  }, [activeOrder]);

  const showToast = (msg) => setToast(msg);

  const addToCart = (food) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
    showToast(`✨ ${food.name} added to cart!`);
  };

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 1500 ? 0 : 150;
  const tax = Math.round(subtotal * 0.15); // 15% VAT
  const total = subtotal + deliveryFee + tax;

  const placeOrder = async (details) => {
    const fallbackNumber = `ET-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: `ORD-${Date.now()}`,
      orderNumber: fallbackNumber,
      order_number: fallbackNumber,
      items: [...items],
      subtotal,
      deliveryFee,
      tax,
      total,
      customerName: details.customerName,
      phone: details.phone,
      subcity: details.subcity,
      address: details.address,
      paymentMethod: details.paymentMethod,
      status: 'placed',
      createdAt: new Date().toISOString(),
      driverName: 'ዳዊት ታደሰ (Dawit Tadesse)',
      driverPhone: '+251 91 123 4567',
    };

    // Attempt to save in PostgreSQL database via API
    try {
      const saved = await api.placeOrder({
        customerName: details.customerName,
        phone: details.phone,
        subcity: details.subcity,
        address: details.address,
        paymentMethod: details.paymentMethod,
        items,
        subtotal,
        deliveryFee,
        tax,
        total,
      });
      if (saved && (saved.orderNumber || saved.order_number)) {
        newOrder.id = saved.id || newOrder.id;
        newOrder.orderNumber = saved.orderNumber || saved.order_number;
        newOrder.order_number = saved.orderNumber || saved.order_number;
      }
    } catch (e) {
      console.warn('Saved order locally as fallback');
    }

    setActiveOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsTrackerOpen(true);
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackerOpen,
        setIsTrackerOpen,
        activeOrder,
        setActiveOrder,
        placeOrder,
        subtotal,
        deliveryFee,
        tax,
        total,
        toast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
