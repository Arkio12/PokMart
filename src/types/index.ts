export interface Pokemon {
  id: string;
  name: string;
  image: string;
  price: number;
  type?: PokemonType[];
  category?: ProductCategory;
  description: string;
  // Individual stats to match database schema
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  inStock: boolean;
  featured: boolean;
  hidden?: boolean;
  stock_quantity?: number;
  // Optional fields for backward compatibility
  stats?: PokemonStats;
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export type PokemonType = 
  | 'fire' 
  | 'water' 
  | 'grass' 
  | 'electric' 
  | 'psychic' 
  | 'ice' 
  | 'dragon' 
  | 'dark' 
  | 'fairy' 
  | 'fighting' 
  | 'poison' 
  | 'ground' 
  | 'flying' 
  | 'bug' 
  | 'rock' 
  | 'ghost' 
  | 'steel' 
  | 'normal';

export type ProductCategory = 
  | 'pokemon' 
  | 'pokeballs' 
  | 'items' 
  | 'berries' 
  | 'accessories';

export interface CartItem {
  id: string;
  pokemon: Pokemon;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
}
