# PokéMart - Pokemon E-commerce Platform ⚡🛒

A modern, Pokemon-themed e-commerce platform built with Next.js 14, TypeScript, and Tailwind CSS. Discover, collect, and purchase your favorite Pokemon with an immersive shopping experience!

## ✨ Features

### 🎮 Pokemon Shopping Experience
- **Interactive Pokemon Cards** - Detailed cards showing stats, types, and descriptions
- **Type-based Filtering** - Filter Pokemon by type (Fire, Water, Electric, etc.)
- **Featured Pokemon** - Highlighted special Pokemon on the homepage
- **Real Pokemon Data** - Uses official Pokemon artwork and information

### 🛒 E-commerce Functionality
- **Shopping Cart** - Add, remove, and manage Pokemon in your cart
- **Quantity Management** - Adjust quantities with intuitive controls
- **Price Calculation** - Real-time total calculation with formatting
- **Persistent Cart State** - Cart persists across page navigation

### 🎨 Modern UI/UX
- **Pokemon-themed Design** - Beautiful gradients and colors inspired by Pokemon types
- **Smooth Animations** - Framer Motion animations throughout
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Loading States** - Smooth transitions and hover effects

### 🏗️ Technical Features
- **Next.js 14** - Latest App Router with Server Components
- **TypeScript** - Full type safety throughout the application
- **Context API** - Global state management for cart functionality
- **Component Architecture** - Modular, reusable components
- **Modern CSS** - Tailwind CSS with custom Pokemon-themed utilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pokemon-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages

- **Homepage** (`/`) - Hero section, featured Pokemon, and site overview
- **Shop** (`/shop`) - Complete Pokemon catalog with filtering
- **Cart** (`/cart`) - Shopping cart management and checkout summary
- **About** (`/about`) - Information about PokéMart
- **Contact** (`/contact`) - Contact form and business information

## 🎨 Pokemon Types & Styling

The platform includes custom styling for all Pokemon types:
- 🔥 **Fire** - Red/orange gradients
- 💧 **Water** - Blue gradients
- 🌿 **Grass** - Green gradients
- ⚡ **Electric** - Yellow gradients
- 🔮 **Psychic** - Purple gradients
- 🐉 **Dragon** - Indigo gradients
- And more!

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

### UI Components
- **Lucide React** - Icon library
- **Radix UI** - Accessible component primitives
- **Custom Components** - Pokemon-themed UI elements

### State Management
- **React Context** - Global cart state
- **useReducer** - Complex state logic

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── about/          # About page
│   ├── cart/           # Shopping cart page
│   ├── contact/        # Contact page
│   ├── shop/           # Pokemon shop page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/         # Reusable components
│   ├── Header.tsx      # Navigation header
│   ├── PokemonCard.tsx # Pokemon display card
│   └── ...
├── context/           # React Context providers
│   └── CartContext.tsx # Shopping cart state
├── data/              # Mock data
│   └── pokemon.ts     # Pokemon dataset
├── lib/               # Utility functions
│   └── utils.ts       # Helper functions
└── types/             # TypeScript definitions
    └── index.ts       # Type definitions
```

## 🎯 Key Features Explained

### Pokemon Cards
Each Pokemon is displayed with:
- High-quality official artwork
- Type badges with appropriate colors
- Base stats (HP, Attack, Defense, Speed)
- Price and availability status
- Add to cart functionality

### Shopping Cart
- Persistent state across page navigation
- Quantity adjustments with +/- buttons
- Individual item removal
- Total price calculation
- Empty cart state with call-to-action

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🎨 Customization

The project includes custom Tailwind utilities:
- Pokemon type gradients
- Hover effects and animations
- Custom scrollbar styling
- Responsive design helpers

## 🚀 Deployment

The project is ready to deploy on:
- **Vercel** (recommended)
- **Netlify**
- **Railway**
- Any platform supporting Next.js

### Deploy on Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional Pokemon data
- New Pokemon types
- Enhanced animations
- Payment integration
- User authentication
- Wishlist functionality

## 📝 License

This project is for educational purposes. Pokemon characters and artwork are property of Nintendo/Game Freak.

## 🙏 Acknowledgments

- Pokemon artwork from [PokeAPI](https://pokeapi.co/)
- Icons from [Lucide React](https://lucide.dev/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

---

**Built with ❤️ and ⚡ by Pokemon enthusiasts!**
