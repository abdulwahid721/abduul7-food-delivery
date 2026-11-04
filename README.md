# 🚴 Abduul — Authentic Addis Ababa Food Delivery Platform

An Ethiopian food delivery web application built with **React**, **Vite**, **Tailwind CSS**, and **Node.js Express**, featuring real top restaurants found across Addis Ababa.

---

## ✨ Features

- **Brand: Abduul**:
  - Distinctive crimson red navigation header (`#a61919`) with the circular **Abduul** scooter delivery badge.
  - Active basket counter in real-time Ethiopian Birr (`ብር` / ETB).
- **Hero Section**:
  - *"Get food from your favorite restaurants in Addis delivered to your home or office."*
  - Dual action buttons: *See restaurants near you*, *View all of our restaurants*, *The Market: Groceries & more*, *Drinks: Tej, Wines, Beers & Spirits*.
- **Real Addis Ababa Restaurants**:
  1. **Totot Traditional Restaurant (ጦጦት የባህል አዳራሽ)** — *Gerji Branch*: Renowned Gurage Kitfo prepared with spiced herbal niter kibbeh, fresh kocho, and homemade ayib.
  2. **Kategna Restaurant (ካትኛ የባህል ምግብ ቤት)** — *Bole Medhanialem & Sarbet*: Famous clay-dish Derek Tibs, Bozena Shiro Tegabino, and royal Fasting Beyaynetu.
  3. **Yod Abyssinia Cultural Restaurant (ዮድ አቢሲኒያ)** — *Bole*: Heritage cultural meals, traditional Doro Wat simmered for hours, and grand Mahberawi feasts.
  4. **Effoi Pizza (እፎይ ፒዛ)** — *Bole Atlas & Kazanchis*: Addis Ababa’s artisanal stone-oven pizzas (Desta Siga Pizza, Minchet Abish Pizza).
  5. **Moyos Burger (ሞዮስ በርገር)** — *Bole & Sarbet*: Smashed 100% prime beef patties, melted cheddar, and loaded fries.
  6. **Ristorante Castelli (ካስቴሊ)** — *Historic Piazza (Est. 1948)*: Legendary Italian fine dining, baked lasagna al forno, and handmade ravioli.
  7. **Bait Al Mandi (ቤት አል መንዲ)** — *Bole Olympia*: Slow-roasted fragrant lamb mandi, charcoal chicken madhbi, and Yemeni soups.
- **Authentic Dishes & Real Menu**:
  - Real Amharic names (e.g. *ልዩ የጉራጌ ክትፎ*, *ካትኛ ደረቅ ጥብስ*, *የሀገር ቤት ዶሮ ወጥ*, *የጾም በያይነቱ*, *እፎይ ደስታ ፒዛ*, *ሞዮስ ድርብ ስማሽ በርገር*).
  - Accurate pricing in Ethiopian Birr (`ብር`).
  - Minimized compact photos (16:9 ratio, `h-36 sm:h-40`).
- **Interactive Cart & Drawer**:
  - Instant quantity modification, item removal, and subtotal + 15% VAT calculation.
- **Addis Delivery & Checkout**:
  - Locations across Addis Ababa (*Bole Medhanialem*, *Gerji*, *Sarbet*, *Piazza*, *Atlas*, *Kazanchis*, *Summit*, etc.).
  - Payment via **Telebirr**, **CBE Birr**, or **Cash on Delivery**.
  - Confetti celebration on order placement.
- **Live Order Tracker**:
  - Order progression simulation (*Placed* ➔ *Confirmed* ➔ *In Kitchen* ➔ *On The Way* ➔ *Delivered*).
  - Assigned courier contact (*ዳዊት ታደሰ / Dawit Tadesse*, `+251 91 123 4567`).

---

## 🚀 Running Locally

### 1. Start the Backend API (Port 5000)
```bash
cd backend
npm install
node server.js
```

### 2. Start the Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

Open your browser at [http://localhost:3000](http://localhost:3000).

---

## 🌐 How to Deploy to Vercel

```powershell
cd C:\Users\abd\.gemini\antigravity\scratch\food-delivery
git push -u origin main
```
Import the repository on [vercel.com](https://vercel.com) and click **Deploy**.
