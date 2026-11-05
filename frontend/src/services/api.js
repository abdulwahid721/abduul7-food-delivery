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

  // 3. User Authentication (Real Backend / Supabase Authentication)
  async login(email, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Invalid email address or password');
    }
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('abduul_token', data.token);
      localStorage.setItem('abduul_user', JSON.stringify(data.user));
    }
    return data;
  },

  async register({ name, email, password, phone, address, avatar }) {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone ? phone.trim() : '',
        address: address ? address.trim() : '',
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Registration failed');
    }
    const data = await res.json();
    if (avatar && data.user) data.user.avatar = avatar;
    if (data.token) {
      localStorage.setItem('abduul_token', data.token);
      localStorage.setItem('abduul_user', JSON.stringify(data.user));
    }
    return data;
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('abduul_token');
      if (!token) return null;
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
      // If token expired or invalid, clear session
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('abduul_token');
        localStorage.removeItem('abduul_user');
        return null;
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
