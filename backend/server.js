import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory persistent database for Deliver Addis
export const restaurants = [
  {
    id: 'villa-verde',
    name: 'VillaVerde BISTRO',
    branch: 'Bisrate Gebriel Branch',
    cuisine: 'Italian, Wood-Fired Pizza & Pastas',
    rating: 5.0,
    deliveryTime: '30-40 min',
    deliveryFee: 150,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    description: 'Authentic stone-oven pizzas, creamy pastas, and fresh salads crafted daily.',
    promoBadge: 'For Every Pizza Order Get 1 Free Coca Cola !!!',
    isFeatured: true,
  },
  {
    id: 'abyssinia-flavors',
    name: 'Abyssinia Flavors',
    branch: 'Summit Branch',
    cuisine: 'Traditional Habesha, Kitfo & Tibs',
    rating: 5.0,
    deliveryTime: '25-35 min',
    deliveryFee: 150,
    image: '/images/real-kitfo.jpg',
    description: 'A place where you can experience the true taste of habeshan cuisine.',
    promoBadge: 'Free Kocho & Ayib with Kitfo Platter Orders!',
    isFeatured: true,
  },
  {
    id: 'soka-sport-bar',
    name: 'Soka Sport Bar & BBQ',
    branch: 'Bole Atlas Branch',
    cuisine: 'American, Smashed Burgers & BBQ',
    rating: 5.0,
    deliveryTime: '20-30 min',
    deliveryFee: 150,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    description: 'Home of the famous double smash burger, loaded fries, and smoky wings.',
    promoBadge: '20% Discount with Promo Code HABESHA20',
    isFeatured: true,
  },
  {
    id: 'habesha-2000',
    name: 'Habesha 2000 Cultural Restaurant',
    branch: 'Bole Medhanialem',
    cuisine: 'Cultural Habesha, Sizzling Tibs, Doro Wat',
    rating: 4.9,
    deliveryTime: '25-35 min',
    deliveryFee: 150,
    image: '/images/shekla-tibs.jpg',
    description: 'Traditional clay-pot cooked meals, special Gurage kitfo, and festive cultural feasts.',
    promoBadge: 'Special Sizzling Shekla Tibs Night',
    isFeatured: true,
  },
];

export const foods = [
  {
    id: 'food-1',
    restaurantId: 'abyssinia-flavors',
    restaurantName: 'Abyssinia Flavors (Summit)',
    name: 'Special Gurage Kitfo',
    amharicName: 'ልዩ የጉራጌ ክትፎ (በቆጮ እና አይብ)',
    description: 'በተነጠረ አንጓች የሀበሻ ቅቤ እና ሚጥሚጣ የተዘጋጀ ለስላሳ የበሬ ቀይ ስጋ፤ ከትኩስ ቆጮ፣ አይብ እና ጎመን ጋር በሞቀ እንጀራ ይቀርባል።',
    price: 850,
    category: 'kitfo-tibs',
    image: '/images/real-kitfo.jpg',
    calories: 780,
    rating: 5.0,
    prepTime: '20 min',
    isPopular: true,
  },
  {
    id: 'food-2',
    restaurantId: 'habesha-2000',
    restaurantName: 'Habesha 2000 Cultural Restaurant',
    name: 'Special Shekla Tibs',
    amharicName: 'የሸክላ ጥብስ ከሮዝመሪ እና አዋዜ ጋር',
    description: 'በትኩስ ሸክላ ላይ በጋለ ከሰል የሚንሾከሾክ ምርጥ የበሬ ስጋ በሽንኩርት፣ ቃሪያ እና የቅቤ መዓዛ፤ ከልዩ አዋዜ እና ሰናፍጭ ጋር።',
    price: 780,
    category: 'kitfo-tibs',
    image: '/images/shekla-tibs.jpg',
    calories: 720,
    rating: 4.9,
    prepTime: '20 min',
    isPopular: true,
  },
  {
    id: 'food-3',
    restaurantId: 'habesha-2000',
    restaurantName: 'Habesha 2000 Cultural Restaurant',
    name: 'Royal Doro Wat with Egg & Ayib',
    amharicName: 'ልዩ የሀገር ቤት ዶሮ ወጥ (ከእንቁላል እና አይብ ጋር)',
    description: 'በደከመ ቀይ የበርበሬ ቁሊትና ቅቤ ለሰዓታት የበሰለ የሀበሻ ዶሮ ወጥ፤ ከበሰለ እንቁላል እና ከቀዘቀዘ ለስላሳ አይብ ጋር።',
    price: 950,
    category: 'traditional',
    image: '/images/doro-wat.jpg',
    calories: 820,
    rating: 5.0,
    prepTime: '25 min',
    isPopular: true,
  },
  {
    id: 'food-4',
    restaurantId: 'abyssinia-flavors',
    restaurantName: 'Abyssinia Flavors (Summit)',
    name: 'Grand Fasting Beyaynetu',
    amharicName: 'የጾም በያይነቱ (ልዩ 10 አይነት ወጦች)',
    description: 'ምስር ወጥ፣ ሽሮ ፈሰስ፣ አተር ክክ፣ ድንች በካሮት፣ የጎመን ክክ፣ ቀይ ስር፣ ቲማቲም ፍትፍት እና አዝፋ በንጹህ የጤፍ እንጀራ ላይ።',
    price: 450,
    category: 'fasting',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    calories: 550,
    rating: 4.9,
    prepTime: '15 min',
    isPopular: true,
  },
  {
    id: 'food-5',
    restaurantId: 'villa-verde',
    restaurantName: 'VillaVerde BISTRO (Bisrate Gebriel)',
    name: 'Siga Tibs Special Pizza',
    amharicName: 'የጥብስ ፒዛ (የተጠበሰ የበሬ ስጋ በሞዛሬላ)',
    description: 'የተጠበሰ የጥብስ ስጋ ቁርጥራጮች፣ ቃሪያ፣ ሽንኩርት፣ ሮዝመሪ እና የሞዛሬላ ቺዝ በጣሊያንኛ ሊጥ ላይ።',
    price: 650,
    category: 'pizza-pasta',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    calories: 890,
    rating: 5.0,
    prepTime: '20 min',
    isPopular: true,
  },
  {
    id: 'food-6',
    restaurantId: 'villa-verde',
    restaurantName: 'VillaVerde BISTRO (Bisrate Gebriel)',
    name: 'Creamy Basil Pesto Fettuccine',
    amharicName: 'ክሬሚ ባሲል ፔስቶ ፌቱቺኒ ፓስታ',
    description: 'ትኩስ የባሲል ቅጠል፣ የኦሊቭ ዘይት፣ የተፈጨ ዋልነት እና የፓርሜሳን ቺዝ ክሬም በለስላሳ ፌቱቺኒ ፓስታ ላይ።',
    price: 540,
    category: 'pizza-pasta',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    calories: 620,
    rating: 4.9,
    prepTime: '18 min',
    isPopular: false,
  },
  {
    id: 'food-7',
    restaurantId: 'soka-sport-bar',
    restaurantName: 'Soka Sport Bar & BBQ (Bole Atlas)',
    name: 'Soka Double Smash Burger',
    amharicName: 'ሶካ ስፔሻል ድርብ ቢፍ በርገር',
    description: 'ሁለት ጭማቂ የበዛባቸው 100% የበሬ ስጋዎች፣ የቀለጠ ቼዳር ቺዝ፣ ካራመላይዝድ ሽንኩርት እና የሶካ ልዩ ባርቤኪው ሶስ ከትኩስ ቺፕስ ጋር።',
    price: 490,
    category: 'fast-food',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    calories: 790,
    rating: 5.0,
    prepTime: '18 min',
    isPopular: true,
  },
  {
    id: 'food-8',
    restaurantId: 'soka-sport-bar',
    restaurantName: 'Soka Sport Bar & BBQ (Bole Atlas)',
    name: 'Smoky BBQ Wings & Fries Platter',
    amharicName: 'ስሞኪ የባርቤኪው ክንፎች ከቺፕስ ጋር (8 ፍሬ)',
    description: 'በከሰል የተጠበሱ ጭማቂ የበዛባቸው 8 የዶሮ ክንፎች በጣፋጭ ስሞኪ ባርቤኪው ሶስ ከትኩስ ቺፕስ ጋር።',
    price: 520,
    category: 'fast-food',
    image: 'https://images.unsplash.com/photo-1527477321055-43615b6294a5?auto=format&fit=crop&w=800&q=80',
    calories: 680,
    rating: 4.8,
    prepTime: '20 min',
    isPopular: false,
  },
];

export const orders = [];

// API Endpoints
app.get('/api/restaurants', (req, res) => {
  res.json(restaurants);
});

app.get('/api/restaurants/:id', (req, res) => {
  const restaurant = restaurants.find((r) => r.id === req.params.id);
  if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
  const menu = foods.filter((f) => f.restaurantId === req.params.id);
  res.json({ ...restaurant, menu });
});

app.get('/api/foods', (req, res) => {
  res.json(foods);
});

app.post('/api/orders', (req, res) => {
  const { customerName, phone, address, items, total, paymentMethod } = req.body;
  const newOrder = {
    id: `ORD-${Date.now()}`,
    orderNumber: `ET-${Math.floor(100000 + Math.random() * 900000)}`,
    customerName,
    phone,
    address,
    items,
    total,
    paymentMethod,
    status: 'placed',
    createdAt: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`Deliver Addis Express backend running on http://localhost:${PORT}`);
});
