import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory database of real Addis Ababa restaurants & menus for Abduul Food Delivery
export const restaurants = [
  {
    id: 'totot-traditional',
    name: 'Totot Traditional Restaurant (ጦጦት)',
    shortName: 'Totot (ጦጦት)',
    branch: 'Gerji (ጀርጂ ቅርንጫፍ)',
    cuisine: 'Traditional Gurage Kitfo, Tibs & Kocho',
    rating: 5.0,
    deliveryTime: '25-35 min',
    deliveryFee: 150,
    image: '/images/real-kitfo.jpg',
    description: 'Addis Ababa’s most renowned destination for authentic Gurage Kitfo prepared with spiced herbal niter kibbeh, fresh kocho, and homemade ayib.',
    promoBadge: 'Free Fresh Kocho & Ayib with Kitfo Platter Orders!',
    isFeatured: true,
  },
  {
    id: 'kategna-restaurant',
    name: 'Kategna Restaurant (ካትኛ)',
    shortName: 'Kategna (ካትኛ)',
    branch: 'Bole Medhanialem & Sarbet (ቦሌ እና ሳርቤት)',
    cuisine: 'Authentic Habesha, Derek Tibs & Shiro Tegabino',
    rating: 5.0,
    deliveryTime: '20-30 min',
    deliveryFee: 150,
    image: '/images/shekla-tibs.jpg',
    description: 'Beloved multi-award winning Ethiopian restaurant known for sizzling clay-dish tibs, clay-pot shiro tegabino, and hospitable service.',
    promoBadge: 'Complimentary Kategna Appetizer with Every Main Order!',
    isFeatured: true,
  },
  {
    id: 'yod-abyssinia',
    name: 'Yod Abyssinia Cultural Restaurant (ዮድ አቢሲኒያ)',
    shortName: 'Yod Abyssinia (ዮድ አቢሲኒያ)',
    branch: 'Bole Japan Embassy (ቦሌ)',
    cuisine: 'Royal Habesha Feasts, Doro Wat & Mahberawi',
    rating: 5.0,
    deliveryTime: '30-40 min',
    deliveryFee: 150,
    image: '/images/doro-wat.jpg',
    description: 'Addis Ababa’s premier cultural dining landmark. Serving heritage recipes, rich Doro Wat simmered for hours, and grand festive platters.',
    promoBadge: 'Special Mahberawi Feast Platter for Family & Groups',
    isFeatured: true,
  },
  {
    id: 'effoi-pizza',
    name: 'Effoi Pizza (እፎይ ፒዛ)',
    shortName: 'Effoi Pizza (እፎይ)',
    branch: 'Bole Atlas & Kazanchis (አትላስ እና ካዛንቺስ)',
    cuisine: 'Artisanal Stone-Oven Pizza & Pastas',
    rating: 4.9,
    deliveryTime: '25-35 min',
    deliveryFee: 150,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    description: 'Pioneering Addis Ababa’s gourmet pizza scene with stone-oven crusts, rosemary seasoned steak cuts, local herbs, and fresh mozzarella.',
    promoBadge: 'Buy 2 Large Pizzas Get 1 Free Coca-Cola or Mirinda!',
    isFeatured: true,
  },
  {
    id: 'moyos-burger',
    name: 'Moyos Burger (ሞዮስ በርገር)',
    shortName: 'Moyos Burger (ሞዮስ)',
    branch: 'Bole & Sarbet (ቦሌ እና ሳርቤት)',
    cuisine: 'Gourmet Smashed Burgers & Loaded Fries',
    rating: 4.9,
    deliveryTime: '20-30 min',
    deliveryFee: 150,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    description: 'Famous local gourmet burger house crafting smashed 100% prime beef patties, melted cheddar, brioche buns, and house secret sauces.',
    promoBadge: 'Special Combo: Double Burger + Loaded Fries + Soda',
    isFeatured: true,
  },
  {
    id: 'castelli-restaurant',
    name: 'Ristorante Castelli (ካስቴሊ)',
    shortName: 'Castelli (ካስቴሊ)',
    branch: 'Piazza (ፒያሳ ታሪካዊ ቅርንጫፍ)',
    cuisine: 'Historic Italian Fine Dining (Est. 1948)',
    rating: 5.0,
    deliveryTime: '30-40 min',
    deliveryFee: 150,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    description: 'Historic fine-dining Italian restaurant in Piazza operating since 1948. Renowned for handmade ravioli, rich beef lasagna, and tiramisu.',
    promoBadge: 'Authentic Handcrafted Pasta from Historic Piazza',
    isFeatured: true,
  },
  {
    id: 'bait-al-mandi',
    name: 'Bait Al Mandi (ቤት አል መንዲ)',
    shortName: 'Bait Al Mandi (ቤት አል መንዲ)',
    branch: 'Bole Olympia (ቦሌ ኦሊምፒያ)',
    cuisine: 'Arabian, Slow-Cooked Lamb Mandi & Maraq',
    rating: 4.8,
    deliveryTime: '25-35 min',
    deliveryFee: 150,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    description: 'Addis Ababa’s most popular spot for fragrant spiced Basmati rice, fall-off-the-bone tender roasted lamb mandi, and hot Yemeni soups.',
    promoBadge: 'Served with Hot Spicy Sahawiq Salsa & Maraq Soup',
    isFeatured: true,
  },
];

export const foods = [
  {
    id: 'f-totot-1',
    restaurantId: 'totot-traditional',
    restaurantName: 'Totot Traditional Restaurant (Gerji)',
    name: 'Special Gurage Kitfo with Kocho & Ayib',
    amharicName: 'ልዩ የጉራጌ ክትፎ (በቆጮ እና አይብ)',
    description: 'በተነጠረ አንጓች የሀበሻ ቅቤ፣ ሚጥሚጣና ኮረሪማ የተዘጋጀ ለስላሳ የበሬ ቀይ ስጋ፤ ከትኩስ ቆጮ፣ አይብ እና ጎመን ጋር በሞቀ እንጀራ ይቀርባል።',
    price: 850,
    category: 'Traditional',
    image: '/images/real-kitfo.jpg',
    prepTime: '20 min',
    rating: 5.0,
    isPopular: true,
  },
  {
    id: 'f-totot-2',
    restaurantId: 'totot-traditional',
    restaurantName: 'Totot Traditional Restaurant (Gerji)',
    name: 'Totot Sizzling Clay-Pot Tibs',
    amharicName: 'ጦጦት ልዩ የሸክላ ጥብስ (በቅቤና ቃሪያ)',
    description: 'በትኩስ ሸክላ ላይ በከሰል የሚንሾከሾክ ምርጥ የበሬ ስጋ በሽንኩርት፣ ቃሪያ እና ሮዝመሪ፤ ከልዩ አዋዜና ሰናፍጭ ጋር።',
    price: 780,
    category: 'Traditional',
    image: '/images/shekla-tibs.jpg',
    prepTime: '20 min',
    rating: 4.9,
    isPopular: true,
  },
  {
    id: 'f-kategna-1',
    restaurantId: 'kategna-restaurant',
    restaurantName: 'Kategna Restaurant (Bole & Sarbet)',
    name: 'Kategna Special Derek Tibs',
    amharicName: 'ካትኛ ልዩ ደረቅ ጥብስ ከሰናፍጭ ጋር',
    description: 'በከፍተኛ ሙቀት የተጠበሰ ጥርት ያለ ለስላሳ የበሬ ስጋ በሽንኩርት እና በቃሪያ፤ ከአዋዜና ከተፈጨ ሰናፍጭ ጋር በሞቀ እንጀራ።',
    price: 820,
    category: 'Traditional',
    image: '/images/shekla-tibs.jpg',
    prepTime: '20 min',
    rating: 5.0,
    isPopular: true,
  },
  {
    id: 'f-kategna-3',
    restaurantId: 'kategna-restaurant',
    restaurantName: 'Kategna Restaurant (Bole & Sarbet)',
    name: 'Royal Kategna Fasting Beyaynetu',
    amharicName: 'ልዩ የጾም በያይነቱ (12 አይነት ወጦች)',
    description: 'ምስር ወጥ፣ ሽሮ ፈሰስ፣ አተር ክክ፣ ድንች በካሮት፣ የጎመን ክክ፣ ቀይ ስር፣ ቲማቲም ፍትፍት፣ አዝፋና ሰላጣ በንጹህ የጤፍ እንጀራ ላይ።',
    price: 460,
    category: 'Fasting',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    prepTime: '15 min',
    rating: 5.0,
    isPopular: true,
  },
  {
    id: 'f-yod-1',
    restaurantId: 'yod-abyssinia',
    restaurantName: 'Yod Abyssinia (Bole)',
    name: 'Royal Doro Wat with Boiled Egg & Ayib',
    amharicName: 'ልዩ የሀገር ቤት ዶሮ ወጥ (ከእንቁላል እና አይብ ጋር)',
    description: 'በደከመ ቀይ የበርበሬ ቁሊትና ቅቤ ለሰዓታት የበሰለ የሀበሻ ዶሮ ወጥ፤ ከበሰለ እንቁላል እና ከቀዘቀዘ ለስላሳ አይብ ጋር።',
    price: 980,
    category: 'Traditional',
    image: '/images/doro-wat.jpg',
    prepTime: '25 min',
    rating: 5.0,
    isPopular: true,
  },
  {
    id: 'f-effoi-1',
    restaurantId: 'effoi-pizza',
    restaurantName: 'Effoi Pizza (Atlas & Kazanchis)',
    name: 'Effoi Desta Siga Pizza',
    amharicName: 'እፎይ ደስታ ፒዛ (የበሬ ስጋ፣ ሮዝመሪና ሞዛሬላ)',
    description: 'በድንጋይ ምድጃ የበሰለ ቀጭን ሊጥ፣ የተጠበሰ የበሬ ስጋ ቁርጥራጮች፣ ሮዝመሪ፣ ቃሪያ እና የቀለጠ የሞዛሬላ ቺዝ።',
    price: 620,
    category: 'Pasta & Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    prepTime: '20 min',
    rating: 4.9,
    isPopular: true,
  },
  {
    id: 'f-moyo-1',
    restaurantId: 'moyos-burger',
    restaurantName: 'Moyos Burger (Bole & Sarbet)',
    name: 'Moyos Double Smashed Beef Burger',
    amharicName: 'ሞዮስ ድርብ ስማሽ ቢፍ በርገር',
    description: 'ሁለት ጭማቂ የበዛባቸው 100% የበሬ ስጋዎች፣ የቀለጠ ቼዳር ቺዝ፣ ካራመላይዝድ ሽንኩርት እና የሞዮስ ልዩ ሶስ ከትኩስ ቺፕስ ጋር።',
    price: 490,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    prepTime: '18 min',
    rating: 5.0,
    isPopular: true,
  },
  {
    id: 'f-castelli-1',
    restaurantId: 'castelli-restaurant',
    restaurantName: 'Ristorante Castelli (Piazza)',
    name: 'Castelli Baked Lasagna al Forno',
    amharicName: 'ካስቴሊ ባህላዊ የላዛኛ ፓስታ በስጋና ቺዝ',
    description: 'በካስቴሊ ታሪካዊ የምግብ አሰራር የተዘጋጀ ባለብዙ ድርብ የላዛኛ ፓስታ በቀይ የስጋ ሶስ እና በበዛ ሞዛሬላ ቺዝ የተጋገረ።',
    price: 680,
    category: 'Pasta & Pizza',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    prepTime: '22 min',
    rating: 5.0,
    isPopular: true,
  },
  {
    id: 'f-mandi-1',
    restaurantId: 'bait-al-mandi',
    restaurantName: 'Bait Al Mandi (Bole Olympia)',
    name: 'Special Roasted Lamb Mandi on Basmati',
    amharicName: 'ልዩ የበግ መንዲ በባስማቲ ሩዝ',
    description: 'ለረጅም ሰዓታት በከሰል ምድጃ በዝግታ የበሰለ ለስላሳ የበግ ስጋ፣ በቅመማ ቅመም በተከሸነ ረጅም የባስማቲ ሩዝ እና በሳሃዊቅ ሶስ።',
    price: 920,
    category: 'Traditional',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    prepTime: '20 min',
    rating: 5.0,
    isPopular: true,
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
  console.log(`Abduul Food Delivery Express backend running on http://localhost:${PORT}`);
});
