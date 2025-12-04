# E-Commerce MVP

Full-stack e-commerce application built with Next.js 14, Supabase, Stripe, and SendGrid.

## Features

- 🛍️ Product catalog with search and filtering
- 🛒 Shopping cart with persistent state
- 💳 Secure checkout with Stripe
- 📧 Order confirmation emails via SendGrid
- 📊 Order management and tracking
- 🎨 Responsive design with Tailwind CSS
- ⚡ Fast performance with Next.js 14

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Email**: SendGrid
- **State Management**: Zustand
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/harikapadia999/ecommerce-mvp.git
cd ecommerce-mvp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the following SQL to create tables:

```sql
-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
('Wireless Headphones', 'Premium noise-cancelling headphones', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 'Electronics', 50),
('Smart Watch', 'Fitness tracking smartwatch', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 'Electronics', 30),
('Laptop Backpack', 'Durable laptop backpack with USB charging', 49.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 'Accessories', 100),
('Coffee Maker', 'Programmable coffee maker', 79.99, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6', 'Home', 25);
```

### 4. Set up Stripe

1. Create account at [stripe.com](https://stripe.com)
2. Get your API keys from the dashboard
3. Set up webhook endpoint: `/api/webhook`

### 5. Set up SendGrid

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Verify a sender email
3. Get your API key

### 6. Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email
```

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 8. Deploy to Vercel

```bash
vercel
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   └── webhook/
│   ├── cart/
│   ├── success/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   └── ProductGrid.tsx
├── lib/
│   ├── supabase.ts
│   ├── stripe.ts
│   └── sendgrid.ts
├── store/
│   └── cartStore.ts
└── public/
```

## License

MIT