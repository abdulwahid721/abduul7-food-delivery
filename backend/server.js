import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { initDb, db } from './db/index.js';
import { generateToken, authenticate, requireAdmin } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database (PostgreSQL if DATABASE_URL configured, or local persistent store)
await initDb();

// ==========================================
// 1. HEALTH & ROOT
// ==========================================
app.get('/', (req, res) => {
  res.json({
    name: 'Abduul Food Delivery API',
    status: 'online',
    version: '1.0.0',
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
// 2. AUTHENTICATION & CUSTOMER ACCOUNTS (Step 2)
// ==========================================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const user = await db.createUser({
      name,
      email,
      password,
      phone: phone || '',
      address: address || '',
      role: 'customer',
    });

    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { password_hash, ...safeUser } = user;
    const token = generateToken(safeUser);
    res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
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
    const restaurants = await db.getRestaurants();
    res.json(restaurants);
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
    res.json({ ...restaurant, menu: foods });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});

// ==========================================
// 4. FOOD CRUD MANAGEMENT (Step 3)
// ==========================================
// View all foods or filter by restaurant
app.get('/api/foods', async (req, res) => {
  try {
    const restaurantId = req.query.restaurant_id || null;
    const foods = await db.getFoods(restaurantId);
    res.json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch foods' });
  }
});

// Admin add new food item
app.post('/api/foods', authenticate, requireAdmin, async (req, res) => {
  try {
    const { restaurant_id, name, amharic_name, description, price, category, image, prep_time, is_popular } = req.body;

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

// Admin update food item
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

// Admin delete food item
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
// Place new order
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, phone, subcity, address, paymentMethod, items, subtotal, deliveryFee, tax, total, userId } = req.body;

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return res.status(400).json({ error: 'Customer name, phone, address, and items are required' });
    }

    const order = await db.createOrder({
      userId: userId || null,
      customerName,
      phone,
      subcity,
      address,
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

// Admin view all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin update order status
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
