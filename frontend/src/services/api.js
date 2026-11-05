import { RESTAURANTS, FOODS } from '../data/mockData';

export const API_BASE = 
  import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : 'https://abduul-backend.onrender.com');

function getAuthHeader() {
  const token = localStorage.getItem('abduul_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // 1. Fetch Restaurants
  async getRestaurants() {
    try {
      const res = await fetch(`${API_BASE}/api/restaurants`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn('API /api/restaurants unavailable, using local data fallback.');
    }
    return RESTAURANTS;
  },

  // 2. Fetch Foods
  async getFoods(restaurantId = null) {
    try {
      const url = restaurantId
        ? `${API_BASE}/api/foods?restaurant_id=${restaurantId}`
        : `${API_BASE}/api/foods`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn('API /api/foods unavailable, using local data fallback.');
    }
    if (restaurantId) {
      return FOODS.filter((f) => f.restaurantId === restaurantId);
    }
    return FOODS;
  },

  // 3. User Authentication
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('abduul_token', data.token);
          localStorage.setItem('abduul_user', JSON.stringify(data.user));
        }
        return data;
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Invalid email or password');
    } catch (fetchErr) {
      // If network fails (e.g. Render server cold-starting), support verified demo fallback
      if (email.toLowerCase() === 'admin@abduul.et' && password === 'Admin@123') {
        const adminUser = {
          id: 'usr-admin-demo',
          name: 'Abduul Store Admin',
          email: 'admin@abduul.et',
          role: 'admin',
          phone: '+251 91 123 4567',
          address: 'Bole Medhanialem, Mega Bldg, Addis Ababa',
          avatar: '🦁',
        };
        localStorage.setItem('abduul_user', JSON.stringify(adminUser));
        return { user: adminUser, token: 'demo-admin-jwt' };
      }
      if (email.toLowerCase() === 'customer@abduul.et' && password === 'Customer@123') {
        const custUser = {
          id: 'usr-cust-demo',
          name: 'Yonas Alex',
          email: 'customer@abduul.et',
          role: 'customer',
          phone: '+251 92 987 6543',
          address: 'Bole Medhanialem, House 342, Addis Ababa',
          avatar: '☕',
        };
        localStorage.setItem('abduul_user', JSON.stringify(custUser));
        return { user: custUser, token: 'demo-cust-jwt' };
      }
      throw fetchErr;
    }
  },

  async register({ name, email, password, phone, address, avatar }) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, address }),
      });
      if (res.ok) {
        const data = await res.json();
        if (avatar) data.user.avatar = avatar;
        if (data.token) {
          localStorage.setItem('abduul_token', data.token);
          localStorage.setItem('abduul_user', JSON.stringify(data.user));
        }
        return data;
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Registration failed');
    } catch (fetchErr) {
      // Offline fallback registration
      const newUser = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role: 'customer',
        phone,
        address,
        avatar: avatar || '☕',
      };
      localStorage.setItem('abduul_user', JSON.stringify(newUser));
      return { user: newUser, token: 'local-jwt' };
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('abduul_token');
      if (token && token !== 'demo-admin-jwt' && token !== 'demo-cust-jwt' && token !== 'local-jwt') {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: getAuthHeader(),
        });
        if (res.ok) {
          const data = await res.json();
          return data.user;
        }
      }
    } catch (e) {}
    const saved = localStorage.getItem('abduul_user');
    return saved ? JSON.parse(saved) : null;
  },

  updateProfile(updates) {
    const saved = localStorage.getItem('abduul_user');
    if (saved) {
      const user = { ...JSON.parse(saved), ...updates };
      localStorage.setItem('abduul_user', JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout() {
    localStorage.removeItem('abduul_token');
    localStorage.removeItem('abduul_user');
  },

  // 4. Orders
  async placeOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API /api/orders unavailable, saving order locally.');
    }
    return null;
  },

  async trackOrder(idOrNumber) {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${idOrNumber}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return null;
  },

  async getAdminOrders() {
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        headers: getAuthHeader(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return [];
  },

  async updateOrderStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return null;
  },
};
