# Stacko Studio

A modern e-commerce website for custom collectible figurines, lamps, and keychains. Built with Next.js 16, React 19, and Supabase.

## Features

### Customer-Facing Store
- **Homepage** - Hero carousel, featured products, category showcase
- **Shop** - Product listing with search and category filters
- **Product Details** - Full product information with add to cart
- **Shopping Cart** - Persistent cart with quantity management
- **About Page** - Brand story and information

### Admin Dashboard
- **Product Management** - Create, edit, delete products
- **Category Management** - Organize products by categories
- **Media Library** - Upload and manage product images
- **WordPress-style UI** - Familiar dark sidebar navigation

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Big Shoulders Display, Poppins

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/niharwani/stackowebsite.git
cd stackowebsite
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:
   - Run `supabase-setup.sql` in Supabase SQL Editor to create tables and seed data
   - Run `supabase-admin-setup.sql` for admin panel access
   - Create a storage bucket named `product-images` (set to public)

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) for the store

7. Open [http://localhost:3000/admin](http://localhost:3000/admin) for admin panel
   - Default password: `stacko2024`

## Project Structure

```
stacko-studio/
├── app/
│   ├── (main)/           # Main store pages (with header/footer)
│   │   ├── page.tsx      # Homepage
│   │   ├── about/        # About page
│   │   ├── cart/         # Shopping cart
│   │   ├── shop/         # Product listing
│   │   └── product/      # Product details
│   ├── admin/            # Admin dashboard (standalone)
│   │   ├── page.tsx      # Dashboard
│   │   ├── login/        # Admin login
│   │   ├── products/     # Product management
│   │   ├── categories/   # Category management
│   │   └── media/        # Media library
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── admin/            # Admin components
│   ├── home/             # Homepage components
│   ├── layout/           # Navbar, Footer, etc.
│   ├── shop/             # Shop components
│   └── ui/               # Reusable UI components
├── context/
│   ├── AdminContext.tsx  # Admin authentication
│   └── CartContext.tsx   # Shopping cart state
├── lib/
│   ├── supabase.ts       # Supabase client & queries
│   ├── supabase-admin.ts # Admin CRUD operations
│   └── utils.ts          # Utility functions
└── supabase-*.sql        # Database setup scripts
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build the project and deploy the `.next` folder:
```bash
npm run build
npm run start
```

## License

MIT
