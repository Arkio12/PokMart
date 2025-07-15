import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mkrsejfgwvbnhohvojzn.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rcnNlamZnd3ZibmhvaHZvanotbiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzIxMDE3MjU5LCJleHAiOjIwMzY1OTMyNTl9.K4zUqN-3bvJ0cUZDqrFOJUXqWLfBjNaHDmQYQAGD7Y0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (simplified)
export interface Pokemon {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  inStock: boolean;
  featured: boolean;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  pokemon_id: string;
  quantity: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartItemWithPokemon extends CartItem {
  pokemon: Pokemon;
}

// Helper functions for common operations
export const supabaseHelpers = {
  // Pokemon operations
  async getAllPokemon(): Promise<Pokemon[]> {
    const { data, error } = await supabase
      .from('pokemon')
      .select(`
        *,
        types:pokemon_types(type)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getPokemonById(id: string): Promise<Pokemon | null> {
    const { data, error } = await supabase
      .from('pokemon')
      .select(`
        *,
        types:pokemon_types(type)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  async createPokemon(pokemonData: {
    name: string;
    image: string;
    price: number;
    description: string;
    inStock?: boolean;
    featured?: boolean;
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    types: string[];
  }): Promise<Pokemon> {
    const { types, ...pokemonFields } = pokemonData;
    
    // Create pokemon first
    const { data: createdPokemon, error: pokemonError } = await supabase
      .from('pokemon')
      .insert({
        ...pokemonFields,
        in_stock: pokemonFields.inStock ?? true,
        featured: pokemonFields.featured ?? false,
      })
      .select()
      .single();
    
    if (pokemonError) throw pokemonError;
    
    // Create types
    if (types && types.length > 0) {
      const { error: typesError } = await supabase
        .from('pokemon_types')
        .insert(
          types.map(type => ({
            pokemon_id: createdPokemon.id,
            type,
          }))
        );
      
      if (typesError) throw typesError;
    }
    
    // Return pokemon with types
    const pokemonWithTypes = await this.getPokemonById(createdPokemon.id);
    if (!pokemonWithTypes) throw new Error('Failed to retrieve created Pokemon');
    return pokemonWithTypes;
  },

  async updatePokemon(id: string, pokemonData: {
    name?: string;
    image?: string;
    price?: number;
    description?: string;
    inStock?: boolean;
    featured?: boolean;
    hp?: number;
    attack?: number;
    defense?: number;
    speed?: number;
    types?: string[];
  }): Promise<Pokemon> {
    const { types, ...pokemonFields } = pokemonData;
    
    // Update pokemon
    const { error: pokemonError } = await supabase
      .from('pokemon')
      .update({
        ...pokemonFields,
        in_stock: pokemonFields.inStock,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (pokemonError) throw pokemonError;
    
    // Update types if provided
    if (types !== undefined) {
      // Delete existing types
      const { error: deleteError } = await supabase
        .from('pokemon_types')
        .delete()
        .eq('pokemon_id', id);
      
      if (deleteError) throw deleteError;
      
      // Insert new types
      if (types.length > 0) {
        const { error: typesError } = await supabase
          .from('pokemon_types')
          .insert(
            types.map(type => ({
              pokemon_id: id,
              type,
            }))
          );
        
        if (typesError) throw typesError;
      }
    }
    
    // Return updated pokemon with types
    const updatedPokemon = await this.getPokemonById(id);
    if (!updatedPokemon) throw new Error('Failed to retrieve updated Pokemon');
    return updatedPokemon;
  },

  async deletePokemon(id: string): Promise<void> {
    const { error } = await supabase
      .from('pokemon')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // User operations
  async createUser(user: Omit<User, 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  // Cart operations
  async getCartItems(userId: string): Promise<CartItemWithPokemon[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        pokemon:pokemon_id (*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  },

  async saveCart(userId: string, items: any[]): Promise<void> {
    // First ensure the user exists
    let user = await this.getUserById(userId);
    if (!user) {
      user = await this.createUser({
        id: userId,
        email: `user-${userId}@temp.com`,
        name: 'User',
      });
    }

    // Clear existing cart items
    await this.clearCart(userId);

    // Add new cart items
    if (items && items.length > 0) {
      for (const item of items) {
        const pokemon = item.pokemon;
        
        // Ensure Pokemon exists (upsert)
        const { error: upsertError } = await supabase
          .from('pokemon')
          .upsert({
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.image,
            price: pokemon.price,
            description: pokemon.description || '',
            in_stock: pokemon.inStock ?? true,
            featured: pokemon.featured ?? false,
            hp: pokemon.hp ?? pokemon.stats?.hp ?? 100,
            attack: pokemon.attack ?? pokemon.stats?.attack ?? 50,
            defense: pokemon.defense ?? pokemon.stats?.defense ?? 50,
            speed: pokemon.speed ?? pokemon.stats?.speed ?? 50,
          }, {
            onConflict: 'id'
          });

        if (upsertError) throw upsertError;

        // Add to cart
        await this.addToCart(userId, pokemon.id, item.quantity);
      }
    }
  },

  async addToCart(userId: string, pokemonId: string, quantity: number = 1): Promise<CartItem> {
    // Check if item already exists
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('pokemon_id', pokemonId)
      .single();

    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{ user_id: userId, pokemon_id: pokemonId, quantity }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  async updateCartItemQuantity(itemId: string, quantity: number): Promise<CartItem | void> {
    if (quantity <= 0) {
      await this.removeFromCart(itemId);
      return;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeFromCart(itemId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);
    
    if (error) throw error;
  },

  async clearCart(userId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  }
};
