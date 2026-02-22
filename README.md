# footfits.pk E-Commerce Platform

A modern, full-stack e-commerce platform for footfits.pk - Pakistan's premier thrift shoe store specializing in authentic branded footwear from USA & Europe.

## 🚀 Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** Neon PostgreSQL
- **Icons:** Lucide React
- **State Management:** React Context API

## 📦 Features

### Storefront
- ✅ Homepage with hero slider and featured products
- ✅ Product catalog with filtering and sorting
- ✅ Product detail pages
- ✅ Shopping cart with persistent storage
- ✅ Checkout flow
- ✅ Order tracking
- ✅ Responsive design with mobile bottom navigation
- ✅ WhatsApp integration for customer inquiries

### Admin Panel
- ✅ Dashboard with key metrics
- ✅ Product management (CRUD operations)
- ✅ Order management
- ✅ Customer management
- ✅ Voucher/discount code management
- ✅ Hero slider management
- ✅ Settings configuration

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Neon PostgreSQL account

### 1. Clone and Install

```bash
cd footfits
npm install
```

### 2. Environment Variables

Create `.env.local` with:

```bash
# Database
DATABASE_URL="your-neon-connection-string"
NEXT_PUBLIC_DATABASE_URL="your-neon-connection-string"

# Store Settings
NEXT_PUBLIC_STORE_NAME=footfits.pk
NEXT_PUBLIC_WHATSAPP_NUMBER=+923001234567
NEXT_PUBLIC_STORE_EMAIL=info@footfits.pk
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/footfits.pk
```

### 3. Database Setup

1. Go to [Neon Console](https://console.neon.tech/app/projects)
2. Open SQL Editor
3. Run `neon-schema.sql` (creates tables)
4. Run `neon-seed.sql` (adds sample data)

See `NEON_SETUP.md` for detailed instructions.

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
footfits/
├── app/
│   ├── (storefront)/          # Customer-facing pages
│   │   ├── shop/
│   │   ├── product/[slug]/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── track/
│   ├── admin/                 # Admin panel
│   │   ├── products/
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── vouchers/
│   │   └── sliders/
│   ├── page.tsx              # Homepage
│   └── layout.tsx
├── components/
│   ├── storefront/           # Customer components
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── db/                   # Database queries
│   ├── context/              # React Context
│   └── utils.ts
├── types/
│   └── index.ts              # TypeScript types
├── public/                   # Static assets
│   ├── logo.svg
│   ├── logo-white-bg.svg
│   └── icon.svg
└── neon-schema.sql           # Database schema
```

## 🎨 Brand Colors

- **Primary (Dark Green):** `#284E3D`
- **Secondary (Gold):** `#D4AF37`
- **Dark Charcoal:** `#2C2C2C`
- **White:** `#FFFFFF`
- **Light Gray:** `#F5F5F5`

## 🔐 Admin Access

Default admin route: `/admin/login`

## 📝 Database Schema

- **products** - Product catalog
- **orders** - Customer orders
- **customers** - Customer information
- **vouchers** - Discount codes
- **sliders** - Homepage hero sliders
- **banners** - Promotional banners
- **admin_users** - Admin authentication

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to add all variables from `.env.local` to your deployment platform.

## 📱 Features in Development

- [ ] Payment gateway integration (JazzCash, EasyPaisa)
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search with filters
- [ ] Image upload to cloud storage
- [ ] Admin analytics dashboard

## 🤝 Contributing

This is a private project for footfits.pk.

## 📄 License

Proprietary - All rights reserved by footfits.pk

## 📞 Support

For support, email info@footfits.pk or message us on WhatsApp at +923001234567.
