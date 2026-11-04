import pg from 'pg';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

let pool = null;
let usePostgres = false;

// Initial seed data for the 7 real Addis Ababa restaurants
export const SEED_RESTAURANTS = [
  {
    id: 'totot-traditional',
    name: 'Totot Traditional Restaurant (ጦጦት)',
    short_name: 'Totot (ጦጦት)',
    branch: 'Gerji (ጀርጂ ቅርንጫፍ)',
    cuisine: 'Traditional Gurage Kitfo, Tibs & Kocho',
    rating: 5.0,
    delivery_time: '25-35 min',
    delivery_fee: 150,
    image: '/images/real-kitfo.jpg',
    description: 'Addis Ababa’s most renowned destination for authentic Gurage Kitfo prepared with spiced herbal niter kibbeh, fresh kocho, and homemade ayib.',
    promo_badge: 'Free Fresh Kocho & Ayib with Kitfo Platter Orders!',
    is_featured: true,
  },
  {
    id: 'kategna-restaurant',
    name: 'Kategna Restaurant (ካትኛ)',
    short_name: 'Kategna (ካትኛ)',
    branch: 'Bole Medhanialem & Sarbet (ቦሌ እና ሳርቤት)',
    cuisine: 'Authentic Habesha, Derek Tibs & Shiro Tegabino',
    rating: 5.0,
    delivery_time: '20-30 min',
    delivery_fee: 150,
    image: '/images/shekla-tibs.jpg',
    description: 'Beloved multi-award winning Ethiopian restaurant known for sizzling clay-dish tibs, clay-pot shiro tegabino, and hospitable service.',
    promo_badge: 'Complimentary Kategna Appetizer with Every Main Order!',
    is_featured: true,
  },
  {
    id: 'yod-abyssinia',
    name: 'Yod Abyssinia Cultural Restaurant (ዮድ አቢሲኒያ)',
    short_name: 'Yod Abyssinia (ዮድ አቢሲኒያ)',
    branch: 'Bole Japan Embassy (ቦሌ)',
    cuisine: 'Royal Habesha Feasts, Doro Wat & Mahberawi',
    rating: 5.0,
    delivery_time: '30-40 min',
    delivery_fee: 150,
    image: '/images/doro-wat.jpg',
    description: 'Addis Ababa’s premier cultural dining landmark. Serving heritage recipes, rich Doro Wat simmered for hours, and grand festive platters.',
    promo_badge: 'Special Mahberawi Feast Platter for Family & Groups',
    is_featured: true,
  },
  {
    id: 'effoi-pizza',
    name: 'Effoi Pizza (እፎይ ፒዛ)',
    short_name: 'Effoi Pizza (እፎይ)',
    branch: 'Bole Atlas & Kazanchis (አትላስ እና ካዛንቺስ)',
    cuisine: 'Artisanal Stone-Oven Pizza & Pastas',
    rating: 4.9,
    delivery_time: '25-35 min',
    delivery_fee: 150,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    description: 'Pioneering Addis Ababa’s gourmet pizza scene with stone-oven crusts, rosemary seasoned steak cuts, local herbs, and fresh mozzarella.',
    promo_badge: 'Buy 2 Large Pizzas Get 1 Free Coca-Cola or Mirinda!',
    is_featured: true,
  },
  {
    id: 'moyos-burger',
    name: 'Moyos Burger (ሞዮስ በርገር)',
    short_name: 'Moyos Burger (ሞዮስ)',
    branch: 'Bole & Sarbet (ቦሌ እና ሳርቤት)',
    cuisine: 'Gourmet Smashed Burgers & Loaded Fries',
    rating: 4.9,
    delivery_time: '20-30 min',
    delivery_fee: 150,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    description: 'Famous local gourmet burger house crafting smashed 100% prime beef patties, melted cheddar, brioche buns, and house secret sauces.',
    promo_badge: 'Special Combo: Double Burger + Loaded Fries + Soda',
    is_featured: true,
  },
  {
    id: 'castelli-restaurant',
    name: 'Ristorante Castelli (ካስቴሊ)',
    short_name: 'Castelli (ካስቴሊ)',
    branch: 'Piazza (ፒያሳ ታሪካዊ ቅርንጫፍ)',
    cuisine: 'Historic Italian Fine Dining (Est. 1948)',
    rating: 5.0,
    delivery_time: '30-40 min',
    delivery_fee: 150,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    description: 'Historic fine-dining Italian restaurant in Piazza operating since 1948. Renowned for handmade ravioli, rich beef lasagna, and tiramisu.',
    promo_badge: 'Authentic Handcrafted Pasta from Historic Piazza',
    is_featured: true,
  },
  {
    id: 'bait-al-mandi',
    name: 'Bait Al Mandi (ቤት አል መንዲ)',
    short_name: 'Bait Al Mandi (ቤት አል መንዲ)',
    branch: 'Bole Olympia (ቦሌ ኦሊምፒያ)',
    cuisine: 'Arabian, Slow-Cooked Lamb Mandi & Maraq',
    rating: 4.8,
    delivery_time: '25-35 min',
    delivery_fee: 150,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    description: 'Addis Ababa’s most popular spot for fragrant spiced Basmati rice, fall-off-the-bone tender roasted lamb mandi, and hot Yemeni soups.',
    promo_badge: 'Served with Hot Spicy Sahawiq Salsa & Maraq Soup',
    is_featured: true,
  },
];

// Seed dishes
export const SEED_FOODS = [
  {
    id: 'f-totot-1',
    restaurant_id: 'totot-traditional',
    restaurant_name: 'Totot Traditional Restaurant (Gerji)',
    name: 'Special Gurage Kitfo with Kocho & Ayib',
    amharic_name: 'ልዩ የጉራጌ ክትፎ (በቆጮ እና አይብ)',
    description: 'በተነጠረ አንጓች የሀበሻ ቅቤ፣ ሚጥሚጣና ኮረሪማ የተዘጋጀ ለስላሳ የበሬ ቀይ ስጋ፤ ከትኩስ ቆጮ፣ አይብ እና ጎመን ጋር በሞቀ እንጀራ ይቀርባል።',
    price: 850,
    category: 'Traditional',
    image: '/images/real-kitfo.jpg',
    prep_time: '20 min',
    rating: 5.0,
    is_popular: true,
  },
  {
    id: 'f-totot-2',
    restaurant_id: 'totot-traditional',
    restaurant_name: 'Totot Traditional Restaurant (Gerji)',
    name: 'Totot Sizzling Clay-Pot Tibs',
    amharic_name: 'ጦጦት ልዩ የሸክላ ጥብስ (በቅቤና ቃሪያ)',
    description: 'በትኩስ ሸክላ ላይ በከሰል የሚንሾከሾክ ምርጥ የበሬ ስጋ በሽንኩርት፣ ቃሪያ እና ሮዝመሪ፤ ከልዩ አዋዜና ሰናፍጭ ጋር።',
    price: 780,
    category: 'Traditional',
    image: '/images/shekla-tibs.jpg',
    prep_time: '20 min',
    rating: 4.9,
    is_popular: true,
  },
  {
    id: 'f-kategna-1',
    restaurant_id: 'kategna-restaurant',
    restaurant_name: 'Kategna Restaurant (Bole & Sarbet)',
    name: 'Kategna Special Derek Tibs',
    amharic_name: 'ካትኛ ልዩ ደረቅ ጥብስ ከሰናፍጭ ጋር',
    description: 'በከፍተኛ ሙቀት የተጠበሰ ጥርት ያለ ለስላሳ የበሬ ስጋ በሽንኩርት እና በቃሪያ፤ ከአዋዜና ከተፈጨ ሰናፍጭ ጋር በሞቀ እንጀራ።',
    price: 820,
    category: 'Traditional',
    image: '/images/shekla-tibs.jpg',
    prep_time: '20 min',
    rating: 5.0,
    is_popular: true,
  },
  {
    id: 'f-kategna-3',
    restaurant_id: 'kategna-restaurant',
    restaurant_name: 'Kategna Restaurant (Bole & Sarbet)',
    name: 'Royal Kategna Fasting Beyaynetu',
    amharic_name: 'ልዩ የጾም በያይነቱ (12 አይነት ወጦች)',
    description: 'ምስር ወጥ፣ ሽሮ ፈሰስ፣ አተር ክክ፣ ድንች በካሮት፣ የጎመን ክክ፣ ቀይ ስር፣ ቲማቲም ፍትፍት፣ አዝፋና ሰላጣ በንጹህ የጤፍ እንጀራ ላይ።',
    price: 460,
    category: 'Fasting',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    prep_time: '15 min',
    rating: 5.0,
    is_popular: true,
  },
  {
    id: 'f-yod-1',
    restaurant_id: 'yod-abyssinia',
    restaurant_name: 'Yod Abyssinia (Bole)',
    name: 'Royal Doro Wat with Boiled Egg & Ayib',
    amharic_name: 'ልዩ የሀገር ቤት ዶሮ ወጥ (ከእንቁላል እና አይብ ጋር)',
    description: 'በደከመ ቀይ የበርበሬ ቁሊትና ቅቤ ለሰዓታት የበሰለ የሀበሻ ዶሮ ወጥ፤ ከበሰለ እንቁላል እና ከቀዘቀዘ ለስላሳ አይብ ጋር።',
    price: 980,
    category: 'Traditional',
    image: '/images/doro-wat.jpg',
    prep_time: '25 min',
    rating: 5.0,
    is_popular: true,
  },
  {
    id: 'f-effoi-1',
    restaurant_id: 'effoi-pizza',
    restaurant_name: 'Effoi Pizza (Atlas & Kazanchis)',
    name: 'Effoi Desta Siga Pizza',
    amharic_name: 'እፎይ ደስታ ፒዛ (የበሬ ስጋ፣ ሮዝመሪና ሞዛሬላ)',
    description: 'በድንጋይ ምድጃ የበሰለ ቀጭን ሊጥ፣ የተጠበሰ የበሬ ስጋ ቁርጥራጮች፣ ሮዝመሪ፣ ቃሪያ እና የቀለጠ የሞዛሬላ ቺዝ።',
    price: 620,
    category: 'Pasta & Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    prep_time: '20 min',
    rating: 4.9,
    is_popular: true,
  },
  {
    id: 'f-moyo-1',
    restaurant_id: 'moyos-burger',
    restaurant_name: 'Moyos Burger (Bole & Sarbet)',
    name: 'Moyos Double Smashed Beef Burger',
    amharic_name: 'ሞዮስ ድርብ ስማሽ ቢፍ በርገር',
    description: 'ሁለት ጭማቂ የበዛባቸው 100% የበሬ ስጋዎች፣ የቀለጠ ቼዳር ቺዝ፣ ካራመላይዝድ ሽንኩርት እና የሞዮስ ልዩ ሶስ ከትኩስ ቺፕስ ጋር።',
    price: 490,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    prep_time: '18 min',
    rating: 5.0,
    is_popular: true,
  },
  {
    id: 'f-castelli-1',
    restaurant_id: 'castelli-restaurant',
    restaurant_name: 'Ristorante Castelli (Piazza)',
    name: 'Castelli Baked Lasagna al Forno',
    amharic_name: 'ካስቴሊ ባህላዊ የላዛኛ ፓስታ በስጋና ቺዝ',
    description: 'በካስቴሊ ታሪካዊ የምግብ አሰራር የተዘጋጀ ባለብዙ ድርብ የላዛኛ ፓስታ በቀይ የስጋ ሶስ እና በበዛ ሞዛሬላ ቺዝ የተጋገረ።',
    price: 680,
    category: 'Pasta & Pizza',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    prep_time: '22 min',
    rating: 5.0,
    is_popular: true,
  },
  {
    id: 'f-mandi-1',
    restaurant_id: 'bait-al-mandi',
    restaurant_name: 'Bait Al Mandi (Bole Olympia)',
    name: 'Special Roasted Lamb Mandi on Basmati',
    amharic_name: 'ልዩ የበግ መንዲ በባስማቲ ሩዝ',
    description: 'ለረጅም ሰዓታት በከሰል ምድጃ በዝግታ የበሰለ ለስላሳ የበግ ስጋ፣ በቅመማ ቅመም በተከሸነ ረጅም የባስማቲ ሩዝ እና በሳሃዊቅ ሶስ።',
    price: 920,
    category: 'Traditional',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    prep_time: '20 min',
    rating: 5.0,
    is_popular: true,
  },
  {
    id: 'f-market-1',
    restaurant_id: 'totot-traditional',
    restaurant_name: 'Abduul Fresh Market (Addis Ababa)',
    name: 'Pure 100% Teff Fresh Injera (Pack of 10)',
    amharic_name: 'ትኩስ የሰንጋ ነጭ ጤፍ እንጀራ (10 ፍሬ)',
    description: 'በንጹህ የሰንጋ ጤፍ በባህላዊ ምጣድ የተጋገረ ለስላሳ፣ ዓይናማ እና ትኩስ እንጀራ በጥንቃቄ የታሸገ።',
    price: 320,
    category: 'Drinks & Market',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    prep_time: 'Instant',
    rating: 5.0,
    is_popular: true,
  },
];

// Persistent File Store path for fallback
const DB_FILE_PATH = path.join(__dirname, '..', 'data', 'db.json');

// Initialize database
export async function initDb() {
  const dbUrl = process.env.DATABASE_URL;

  if (dbUrl) {
    try {
      pool = new Pool({
        connectionString: dbUrl,
        ssl: dbUrl.includes('localhost') ? false : { rejectUnauthorized: false },
      });
      const client = await pool.connect();
      console.log('✅ Connected to PostgreSQL database successfully!');
      usePostgres = true;

      // Run schema
      const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
      await client.query(schemaSql);
      console.log('✅ PostgreSQL tables verified/created.');

      // Check if seeded
      const resCount = await client.query('SELECT COUNT(*) FROM restaurants');
      if (parseInt(resCount.rows[0].count, 10) === 0) {
        console.log('🌱 Seeding PostgreSQL with real Addis Ababa restaurants...');
        for (const r of SEED_RESTAURANTS) {
          await client.query(
            `INSERT INTO restaurants (id, name, short_name, branch, cuisine, rating, delivery_time, delivery_fee, image, description, promo_badge, is_featured)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [r.id, r.name, r.short_name, r.branch, r.cuisine, r.rating, r.delivery_time, r.delivery_fee, r.image, r.description, r.promo_badge, r.is_featured]
          );
        }
        for (const f of SEED_FOODS) {
          await client.query(
            `INSERT INTO foods (id, restaurant_id, restaurant_name, name, amharic_name, description, price, category, image, prep_time, rating, is_popular)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [f.id, f.restaurant_id, f.restaurant_name, f.name, f.amharic_name, f.description, f.price, f.category, f.image, f.prep_time, f.rating, f.is_popular]
          );
        }
        // Seed default admin and customer
        const adminPass = await bcrypt.hash('Admin@123', 10);
        const custPass = await bcrypt.hash('Customer@123', 10);
        await client.query(
          `INSERT INTO users (id, name, email, password_hash, phone, role)
           VALUES ('user-admin', 'Abduul Admin', 'admin@abduul.et', $1, '+251 91 123 4567', 'admin')
           ON CONFLICT DO NOTHING`,
          [adminPass]
        );
        await client.query(
          `INSERT INTO users (id, name, email, password_hash, phone, address, role)
           VALUES ('user-cust-1', 'Alex / ዮናስ', 'customer@abduul.et', $1, '+251 91 234 5678', 'Bole Medhanialem', 'customer')
           ON CONFLICT DO NOTHING`,
          [custPass]
        );
        console.log('✅ PostgreSQL database seeded successfully!');
      }

      client.release();
      return;
    } catch (err) {
      console.warn('⚠️ PostgreSQL connection failed:', err.message);
      console.log('🔄 Falling back to persistent local storage mode...');
      usePostgres = false;
    }
  }

  // Fallback to persistent local file storage (ensures 100% working app without downtime)
  initFileDb();
}

function initFileDb() {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(DB_FILE_PATH)) {
    const adminPass = bcrypt.hashSync('Admin@123', 10);
    const custPass = bcrypt.hashSync('Customer@123', 10);

    const initialData = {
      users: [
        {
          id: 'user-admin',
          name: 'Abduul Admin',
          email: 'admin@abduul.et',
          password_hash: adminPass,
          phone: '+251 91 123 4567',
          role: 'admin',
          created_at: new Date().toISOString(),
        },
        {
          id: 'user-cust-1',
          name: 'Alex / ዮናስ',
          email: 'customer@abduul.et',
          password_hash: custPass,
          phone: '+251 91 234 5678',
          address: 'Bole Medhanialem, House #342',
          role: 'customer',
          created_at: new Date().toISOString(),
        },
      ],
      restaurants: [...SEED_RESTAURANTS],
      foods: [...SEED_FOODS],
      orders: [],
      order_items: [],
    };

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialData, null, 2));
    console.log('✅ Persistent local database initialized at backend/data/db.json');
  } else {
    console.log('✅ Loaded persistent database from backend/data/db.json');
  }
}

// Database helper queries supporting both PostgreSQL and Local Store
export const db = {
  // Query interface
  async query(text, params = []) {
    if (usePostgres && pool) {
      return pool.query(text, params);
    }
    // Return dummy rows for fallback
    return { rows: [] };
  },

  // USERS
  async findUserByEmail(email) {
    if (usePostgres && pool) {
      const res = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
      return res.rows[0] || null;
    }
    const data = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (usePostgres && pool) {
      const res = await pool.query('SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    const data = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
    const u = data.users.find((x) => x.id === id);
    if (!u) return null;
    const { password_hash, ...safe } = u;
    return safe;
  },

  async createUser({ name, email, password, phone, address, role = 'customer' }) {
    const id = `user-${Date.now()}`;
    const password_hash = await bcrypt.hash(password, 10);
    const created_at = new Date().toISOString();

    if (usePostgres && pool) {
      const res = await pool.query(
        `INSERT INTO users (id, name, email, password_hash, phone, address, role, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, email, phone, address, role, created_at`,
        [id, name, email, password_hash, phone, address, role, created_at]
      );
      return res.rows[0];
    }

    const data = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
    const newUser = { id, name, email, password_hash, phone, address, role, created_at };
    data.users.push(newUser);
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2));
    const { password_hash: _, ...safe } = newUser;
    return safe;
  },

  // RESTAURANTS
  async getRestaurants() {
    if (usePostgres && pool) {
      const res = await pool.query('SELECT * FROM restaurants ORDER BY rating DESC');
      return res.rows;
    }
    const data = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
    return data.restaurants;
  },

  async getRestaurantById(id) {
    if (usePostgres && pool) {
      const res = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    const data = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
    return data.restaurants.find((r) => r.id === id) || null;
  },

  // FOODS (CRUD)
  async getFoods(restaurantId = null) {
    if (usePostgres && pool) {
      if (restaurantId) {
        const res = await pool.query('SELECT * FROM foods WHERE restaurant_id = $1 ORDER BY rating DESC', [restaurantId]);
        return res.rows;
      }
      const res = await pool.query('SELECT * FROM foods ORDER BY rating DESC');
      return res.rows;
    }
    const data = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
    if (restaurantId) {
      return data.foods.filter((f) => f.restaurant_id === restaurantId);
    }
    return data.foods;
  },

  async createFood(foodData) {
    const id = `f-${Date.now()}`;
    const food = {
      id,
      restaurant_id: foodData.restaurant_id,
      restaurant_name: foodData.restaurant_name || '',
      name: foodData.name,
      amharic_name: foodData.amharic_name || foodData.name,
      description: foodData.description || '',
      price: parseInt(foodData.price, 10),
      category: foodData.category || 'Traditional',
      image: foodData.image || '/images/real-kitfo.jpg',
      prep_time: foodData.prep_time || '20 min',
      rating: parseFloat(foodData.rating || 5.0),
      is_popular: Boolean(foodData.is_popular),
      created_at: new Date().toISOString(),
    };

    if (usePostgres && pool) {
      const res = await pool.query(
        `INSERT INTO foods (id, restaurant_id, restaurant_name, name, amharic_name, description, price, category, image, prep_time, rating, is_popular, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [food.id, food.restaurant_id, food.restaurant_name, food.name, food.amharic_name, food.description, food.price, food.category, food.image, food.prep_time, food.rating, food.is_popular, food.created_at]
      );
      return res.rows[0];
    }

    const data = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
    data.foods.unshift(food);
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2));
    return food;
  },

  async updateFood(id, updates) {
    if (usePostgres && pool) {
      const fields = [];
      const values = [];
      let idx = 1;
      for (const [k, v] of Object.entries(updates)) {
        fields.push(`${k} = $${idx++}`);
        values.push(v);
      }
      values.push(id);
      const res = await pool.query(`UPDATE foods SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
      return res.rows[0] || null;
    }

    const data = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
    const fIdx = data.foods.findIndex((f) => f.id === id);
    if (fIdx === -1) return null;
    data.foods[fIdx] = { ...data.foods[fIdx], ...updates };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2));
    return data.foods[fIdx];
  },

  async deleteFood(id) {
    if (usePostgres && pool) {
      const res = await pool.query('DELETE FROM foods WHERE id = $1 RETURNING *', [id]);
      return res.rows[0] || null;
    }

    const data = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
    const fIdx = data.foods.findIndex((f) => f.id === id);
    if (fIdx === -1) return null;
    const deleted = data.foods.splice(fIdx, 1)[0];
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2));
    return deleted;
  },

  // ORDERS & TRACKING
  async createOrder({ userId, customerName, phone, subcity, address, paymentMethod, items, subtotal, deliveryFee, tax, total }) {
    const id = `ORD-${Date.now()}`;
    const orderNumber = `ET-${Math.floor(100000 + Math.random() * 900000)}`;
    const createdAt = new Date().toISOString();
    const driverName = 'ዳዊት ታደሰ (Dawit Tadesse)';
    const driverPhone = '+251 91 123 4567';

    const order = {
      id,
      order_number: orderNumber,
      user_id: userId || null,
      customer_name: customerName,
      phone,
      subcity: subcity || 'Bole Medhanialem',
      address,
      payment_method: paymentMethod,
      status: 'placed',
      subtotal,
      delivery_fee: deliveryFee,
      tax,
      total,
      driver_name: driverName,
      driver_phone: driverPhone,
      created_at: createdAt,
      items: items || [],
    };

    if (usePostgres && pool) {
      await pool.query(
        `INSERT INTO orders (id, order_number, user_id, customer_name, phone, subcity, address, payment_method, status, subtotal, delivery_fee, tax, total, driver_name, driver_phone, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [id, orderNumber, userId || null, customerName, phone, subcity, address, paymentMethod, 'placed', subtotal, deliveryFee, tax, total, driverName, driverPhone, createdAt]
      );

      for (const item of items) {
        await pool.query(
          `INSERT INTO order_items (order_id, food_id, name, amharic_name, price, quantity)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, item.id, item.name, item.amharicName || item.name, item.price, item.quantity]
        );
      }
      return order;
    }

    const data = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
    data.orders.unshift(order);
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2));
    return order;
  },

  async getOrders() {
    if (usePostgres && pool) {
      const res = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
      return res.rows;
    }
    const data = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
    return data.orders;
  },

  async getOrderById(idOrNumber) {
    if (usePostgres && pool) {
      const res = await pool.query(
        'SELECT * FROM orders WHERE id = $1 OR order_number = $1',
        [idOrNumber]
      );
      if (res.rows.length === 0) return null;
      const order = res.rows[0];
      const itemsRes = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
      return { ...order, items: itemsRes.rows };
    }
    const data = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
    return data.orders.find((o) => o.id === idOrNumber || o.order_number === idOrNumber) || null;
  },

  async updateOrderStatus(id, status) {
    if (usePostgres && pool) {
      const res = await pool.query(
        'UPDATE orders SET status = $1 WHERE id = $2 OR order_number = $2 RETURNING *',
        [status, id]
      );
      return res.rows[0] || null;
    }
    const data = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
    const o = data.orders.find((x) => x.id === id || x.order_number === id);
    if (!o) return null;
    o.status = status;
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2));
    return o;
  },
};
