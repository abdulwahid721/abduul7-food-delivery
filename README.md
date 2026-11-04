# 🚴 Deliver Addis Clone - Ethiopian Food Delivery Platform

An Ethiopian food delivery web application built with **React**, **Vite**, **Tailwind CSS**, and **Node.js Express**, inspired directly by [Deliver Addis](https://deliveraddis.com).

---

## ✨ Features

- **Deliver Addis Navigation Bar**: Deliver Addis crimson red header (`#a61919`), circular scooter delivery badge, quick links (Restaurants, Drinks, Market), and live basket pill.
- **Hero Section**: Exact Deliver Addis hero matching the design:
  - *"Get food from your favorite restaurants in Addis delivered to your home or office."*
  - Dual action buttons: *See restaurants near you*, *View all of our restaurants*, *The Market: Groceries & more*, *Drinks: Wines, Beers, Spirits, etc.*
- **Featured Restaurants (Matching Screenshot)**:
  - **VillaVerde BISTRO (Bisrate Gebriel Branch)** with promo badge `🏷️ For Every Pizza Order Get 1 Free Coca Cola !!!`
  - **Abyssinia Flavors (Summit)** with authentic **Gurage Kitfo**
  - **Soka Sport Bar & BBQ (Bole Atlas)** with smash burgers and BBQ
  - **Habesha 2000 Cultural Restaurant** with sizzling **Shekla Tibs** & **Doro Wat**
- **Dishes & Menu Catalog**:
  - Compact dish photo cards ("minimized pp", 16:9 ratio)
  - English & Amharic dish names (e.g. *ልዩ የጉራጌ ክትፎ*, *የሸክላ ጥብስ*, *የጾም በያይነቱ*)
  - Prices in Ethiopian Birr (`ብር` / ETB)
  - Category filters: *All*, *Traditional 🇪🇹*, *Fasting 🥗*, *Pasta & Pizza 🍕*, *Burgers 🍔*
  - Live search by dish or restaurant name
- **Interactive Cart & Drawer**:
  - Add/remove items with instant quantity adjustment
  - Subtotal, 15% VAT, and delivery fee calculation
- **Checkout Modal**:
  - Delivery location selection across Addis Ababa (*Bole Medhanialem*, *Bisrate Gebriel*, *Summit*, *Bole Atlas*, *Kazanchis*, *Sarbet*, *CMC*, etc.)
  - Payment options: **Telebirr**, **CBE Birr**, and **Cash on Delivery**
  - Confetti celebration on order placement
- **Live Order Tracker**:
  - Real-time order progress simulation (*Order Placed* ➔ *Confirmed* ➔ *In Kitchen* ➔ *On The Way* ➔ *Delivered*)
  - Dedicated courier contact (*ዳዊት ታደሰ / Dawit Tadesse*)

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

### Option A: Deploy via GitHub (Recommended - 1 Click)
1. Push this project to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: Deliver Addis clone complete"
   git remote add origin https://github.com/<your-username>/deliver-addis.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** > **"Project"**.
4. Select your `deliver-addis` repository.
5. In **Root Directory**, click **Edit** and choose `frontend` (or leave default root with the included `vercel.json`).
6. Click **Deploy**! Your site is live on `https://your-app.vercel.app` in ~30 seconds.

### Option B: Deploy via Vercel CLI
```bash
cd frontend
npm install -g vercel
vercel
```
Follow the CLI prompts to deploy directly from your terminal.
