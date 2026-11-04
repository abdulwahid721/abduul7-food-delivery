-- Abduul Food Delivery - PostgreSQL Schema

-- 1. Users (Customers & Administrators)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(40),
  address TEXT,
  role VARCHAR(20) DEFAULT 'customer', -- 'customer' or 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Restaurants (Real Addis Ababa Restaurants)
CREATE TABLE IF NOT EXISTS restaurants (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  short_name VARCHAR(100),
  branch VARCHAR(120) NOT NULL,
  cuisine VARCHAR(180) NOT NULL,
  rating NUMERIC(3, 1) DEFAULT 5.0,
  delivery_time VARCHAR(50) DEFAULT '25-35 min',
  delivery_fee INTEGER DEFAULT 150,
  image TEXT NOT NULL,
  description TEXT,
  promo_badge VARCHAR(255),
  is_featured BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Foods (Authentic Ethiopian Cuisine & Dishes)
CREATE TABLE IF NOT EXISTS foods (
  id VARCHAR(64) PRIMARY KEY,
  restaurant_id VARCHAR(64) REFERENCES restaurants(id) ON DELETE CASCADE,
  restaurant_name VARCHAR(180),
  name VARCHAR(180) NOT NULL,
  amharic_name VARCHAR(255),
  description TEXT,
  price INTEGER NOT NULL,
  category VARCHAR(80) NOT NULL,
  image TEXT NOT NULL,
  prep_time VARCHAR(50) DEFAULT '20 min',
  rating NUMERIC(3, 1) DEFAULT 5.0,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  order_number VARCHAR(30) UNIQUE NOT NULL,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(120) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  subcity VARCHAR(100),
  address TEXT NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- 'telebirr', 'cbe_birr', 'cash'
  status VARCHAR(40) DEFAULT 'placed', -- 'placed', 'confirmed', 'preparing', 'on_the_way', 'delivered'
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL,
  tax INTEGER NOT NULL,
  total INTEGER NOT NULL,
  driver_name VARCHAR(120) DEFAULT 'ዳዊት ታደሰ (Dawit Tadesse)',
  driver_phone VARCHAR(50) DEFAULT '+251 91 123 4567',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
  food_id VARCHAR(64),
  name VARCHAR(180) NOT NULL,
  amharic_name VARCHAR(255),
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1
);
