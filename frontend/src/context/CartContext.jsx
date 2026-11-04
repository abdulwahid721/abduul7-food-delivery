import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Order progression simulation
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'delivered') return;
    const stages = ['placed', 'confirmed', 'preparing', 'on_the_way', 'delivered'];
    const idx = stages.indexOf(activeOrder.status);
    if (idx >= 0 && idx < stages.length - 1) {
      const timer = setTimeout(() => {
        setActiveOrder((prev) => (prev ? { ...prev, status: stages[idx + 1] } : null));
      }, 10000);
      return () => clearTimeout(timer);
    }
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

  const placeOrder = (details) => {
    const order = {
      id: `ORD-${Date.now()}`,
      orderNumber: `ET-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...items],
      subtotal,
      deliveryFee,
      tax,
      total,
      customerName: details.customerName,
      phone: details.phone,
      address: details.address,
      paymentMethod: details.paymentMethod,
      status: 'placed',
      createdAt: new Date().toISOString(),
      driverName: 'ዳዊት ታደሰ (Dawit Tadesse)',
      driverPhone: '+251 91 123 4567',
    };
    setActiveOrder(order);
    clearCart();
    setIsCheckoutOpen(false);
    setIsTrackerOpen(true);
    return order;
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
