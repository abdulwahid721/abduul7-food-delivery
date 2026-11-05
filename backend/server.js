import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { initDb, db } from './db/index.js';
import { generateToken, authenticate, requireAdmin } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware: Helmet (Secure HTTP Headers)
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false, // Allows frontend assets to load without conflict
  })
);

// CORS configuration
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Payload size limit to prevent memory exhaustion attacks
app.use(express.json({ limit: '1mb' }));

// Initialize Database (PostgreSQL if DATABASE_URL configured, or local persistent store)
await initDb();

// Strict Rate Limiting for Authentication (Brute Force Protection)
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Max 10 attempts per IP per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts from this device. For your security, please wait 15 minutes before trying again.',
  },
});

// General API Rate Limiter
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiRateLimiter);

// Constant-time comparison dummy hash to prevent timing attacks / email enumeration
const DUMMY_BCRYPT_HASH = '$2a$10$wE4jW31j9k0gU10H81yYueK31k9k0gU10H81yYueK31k9k0gU10H8';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================
// 1. HEALTH & ROOT
// ==========================================
app.get('/', (req, res) => {
  res.json({
    name: 'Abduul Food Delivery API',
    status: 'online',
    security: 'enhanced (Rate-limiting, Helmet headers, Timing-attack resistant)',
    version: '1.1.0',
    endpoints: [
      '/api/auth/register',
      '/api/auth/login',
      '/api/restaurants',
      '/api/foods',
      '/api/orders',
    ],
  });
});

// ==========================================
// 2. SECURE AUTHENTICATION (Step 2)
// ==========================================
app.post('/api/auth/register', authRateLimiter, async (req, res) => {
  try {
    let { name, email, password, phone, address } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required' });
    }

    name = String(name).trim();
    email = String(email).trim().toLowerCase();

    // 2. Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // 3. Enforce strong password complexity
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      return res.status(400).json({ error: 'Password must contain both letters and numbers' });
    }

    // 4. Check if user already exists
    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists' });
    }

    // 5. Create secure user
    const user = await db.createUser({
      name,
      email,
      password,
      phone: phone ? String(phone).trim() : '',
      address: address ? String(address).trim() : '',
      role: 'customer',
    });

    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during secure registration' });
  }
});

app.post('/api/auth/login', authRateLimiter, async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    email = String(email).trim().toLowerCase();
    const user = await db.findUserByEmail(email);

    // Timing-attack prevention: always run bcrypt.compare to guarantee identical response time
    const hashToVerify = user ? user.password_hash : DUMMY_BCRYPT_HASH;
    const isPasswordValid = await bcrypt.compare(password, hashToVerify);

    if (!user || !isPasswordValid) {
      // Generic message to avoid email enumeration
      return res.status(401).json({ error: 'Invalid email address or password' });
    }

    const { password_hash, ...safeUser } = user;
    const token = generateToken(safeUser);
    res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during authentication' });
  }
});

app.get('/api/auth/me', authenticate, async (req, res) => {
  res.json({ user: req.user });
});

// ==========================================
// 3. RESTAURANTS
// ==========================================
app.get('/api/restaurants', async (req, res) => {
  try {
    const raw = await db.getRestaurants();
    const formatted = raw.map((r) => ({
      ...r,
      rating: parseFloat(r.rating) || 5.0,
      deliveryFee: parseInt(r.delivery_fee ?? r.deliveryFee, 10) || 150,
      deliveryTime: r.delivery_time || r.deliveryTime || '25-35 min',
      promoBadge: r.promo_badge || r.promoBadge || '',
      isFeatured: Boolean(r.is_featured ?? r.isFeatured),
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await db.getRestaurantById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    const foods = await db.getFoods(req.params.id);
    const formattedFoods = foods.map((f) => ({
      ...f,
      price: parseInt(f.price, 10) || 0,
      rating: parseFloat(f.rating) || 5.0,
      prepTime: f.prep_time || f.prepTime || '20 min',
      restaurantId: f.restaurant_id || f.restaurantId,
      restaurantName: f.restaurant_name || f.restaurantName,
      amharicName: f.amharic_name || f.amharicName,
      isPopular: Boolean(f.is_popular ?? f.isPopular),
    }));
    res.json({
      ...restaurant,
      rating: parseFloat(restaurant.rating) || 5.0,
      deliveryFee: parseInt(restaurant.delivery_fee ?? restaurant.deliveryFee, 10) || 150,
      deliveryTime: restaurant.delivery_time || restaurant.deliveryTime || '25-35 min',
      promoBadge: restaurant.promo_badge || restaurant.promoBadge || '',
      menu: formattedFoods,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});

// ==========================================
// 4. FOOD CRUD MANAGEMENT (Step 3)
// ==========================================
app.get('/api/foods', async (req, res) => {
  try {
    const restaurantId = req.query.restaurant_id || null;
    const raw = await db.getFoods(restaurantId);
    const formatted = raw.map((f) => ({
      ...f,
      price: parseInt(f.price, 10) || 0,
      rating: parseFloat(f.rating) || 5.0,
      prepTime: f.prep_time || f.prepTime || '20 min',
      restaurantId: f.restaurant_id || f.restaurantId,
      restaurantName: f.restaurant_name || f.restaurantName,
      amharicName: f.amharic_name || f.amharicName,
      isPopular: Boolean(f.is_popular ?? f.isPopular),
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch foods' });
  }
});

app.post('/api/foods', authenticate, requireAdmin, async (req, res) => {
  try {
    const { restaurant_id, name, price, category } = req.body;
    if (!restaurant_id || !name || !price || !category) {
      return res.status(400).json({ error: 'Restaurant ID, name, price, and category are required' });
    }

    const newFood = await db.createFood(req.body);
    res.status(201).json(newFood);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create food item' });
  }
});

app.put('/api/foods/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const updated = await db.updateFood(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Food item not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update food item' });
  }
});

app.delete('/api/foods/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const deleted = await db.deleteFood(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Food item not found' });
    res.json({ message: 'Food item deleted successfully', deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete food item' });
  }
});

// ==========================================
// 5. SHOPPING CART & ORDERS (Step 4 & Step 5)
// ==========================================
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, phone, subcity, address, paymentMethod, items, subtotal, deliveryFee, tax, total, userId } = req.body;

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return res.status(400).json({ error: 'Customer name, phone, address, and items are required' });
    }

    const order = await db.createOrder({
      userId: userId || null,
      customerName: String(customerName).trim(),
      phone: String(phone).trim(),
      subcity: String(subcity || 'Bole Medhanialem').trim(),
      address: String(address).trim(),
      paymentMethod: paymentMethod || 'telebirr',
      items,
      subtotal: subtotal || 0,
      deliveryFee: deliveryFee || 150,
      tax: tax || 0,
      total: total || 0,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['placed', 'confirmed', 'preparing', 'on_the_way', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Valid values: ${validStatuses.join(', ')}` });
    }

    const updated = await db.updateOrderStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// ==========================================
// 6. ORDER DELIVERY TRACKING (Step 6)
// ==========================================
app.get('/api/orders/:idOrNumber', async (req, res) => {
  try {
    const order = await db.getOrderById(req.params.idOrNumber);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to track order' });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Abduul Food Delivery API server running on http://localhost:${PORT}`);
});
