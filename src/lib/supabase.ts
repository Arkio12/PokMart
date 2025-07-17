import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

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
  hidden?: boolean;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  stock_quantity?: number;
  created_at?: string;
  updated_at?: string;
  types?: { type: string }[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role?: 'customer' | 'admin' | 'moderator';
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

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  pokemon_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface OrderWithDetails extends Order {
  user: User;
  items: (OrderItem & { pokemon: Pokemon })[];
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
        inStock: pokemonFields.inStock ?? true,
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
    hidden?: boolean;
    hp?: number;
    attack?: number;
    defense?: number;
    speed?: number;
    stock_quantity?: number;
    types?: string[];
  }): Promise<Pokemon> {
    const { types, ...pokemonFields } = pokemonData;
    
    // Prepare the update data
    const updateData: any = {
      ...pokemonFields,
      updated_at: new Date().toISOString(),
    };
    
    // If stock_quantity is provided, automatically determine inStock status
    if (pokemonFields.stock_quantity !== undefined) {
      updateData.inStock = pokemonFields.stock_quantity > 0;
    } else if (pokemonFields.inStock !== undefined) {
      // If only inStock is provided (without stock_quantity), use that value
      updateData.inStock = pokemonFields.inStock;
    }
    
    // Update pokemon
    const { error: pokemonError } = await supabase
      .from('pokemon')
      .update(updateData)
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
  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
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

  async createOrGetUser(userData: { id: string; email: string; name: string; role?: 'customer' | 'admin' | 'moderator'; }): Promise<User> {
    // First check if user exists
    const user = await this.getUserById(userData.id);
    if (user) {
      return user;
    }
    
    // If not found, create with specific ID using upsert
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'customer',
      })
      .select()
      .single();
    
    if (error) throw error;
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
    const user = await this.createOrGetUser({
      id: userId,
      email: `user-${userId}@temp.com`,
      name: 'User',
    });

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
            inStock: pokemon.inStock ?? true,
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
  },

  // Order operations
  async createOrder(orderData: {
    userId: string;
    items: any[];
    total: number;
    status?: string;
  }): Promise<Order> {
    const { userId, items, total, status = 'pending' } = orderData;

    // First ensure the user exists
    const user = await this.createOrGetUser({
      id: userId,
      email: `user-${userId}@temp.com`,
      name: 'User',
    });

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        status,
        total,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      pokemon_id: item.pokemon.id,
      quantity: item.quantity,
      price: item.pokemon.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
  },

  async getAllOrders(): Promise<OrderWithDetails[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:users(*),
        items:order_items(
          *,
          pokemon:pokemon(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getOrderById(id: string): Promise<OrderWithDetails | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:users(*),
        items:order_items(
          *,
          pokemon:pokemon(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  async getOrdersByUserId(userId: string): Promise<OrderWithDetails[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:users(*),
        items:order_items(
          *,
          pokemon:pokemon(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getRecentOrders(limit: number = 50): Promise<OrderWithDetails[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:users(*),
        items:order_items(
          *,
          pokemon:pokemon(*)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getOrdersByStatus(status: string): Promise<OrderWithDetails[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:users(*),
        items:order_items(
          *,
          pokemon:pokemon(*)
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async deleteOrder(id: string): Promise<Order> {
    // First get the order to return it
    const order = await this.getOrderById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    // Delete order items first (foreign key constraint)
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', id);

    if (itemsError) throw itemsError;

    // Delete the order
    const { error: orderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (orderError) throw orderError;

    return order;
  },

  async getOrderStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    ordersByStatus: { [key: string]: number };
  }> {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('status, total');

    if (error) throw error;

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalOrders,
      totalRevenue,
      ordersByStatus,
    };
  },

  async getUsersWithRecentOrders(daysBack: number = 30): Promise<{
    user: User;
    orders: OrderWithDetails[];
    totalSpent: number;
  }[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:users(*),
        items:order_items(
          *,
          pokemon:pokemon(*)
        )
      `)
      .gte('created_at', cutoffDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group orders by user
    const userOrdersMap = new Map<string, {
      user: User;
      orders: OrderWithDetails[];
      totalSpent: number;
    }>();

    orders.forEach(order => {
      if (!userOrdersMap.has(order.user_id)) {
        userOrdersMap.set(order.user_id, {
          user: order.user,
          orders: [],
          totalSpent: 0,
        });
      }

      const userOrders = userOrdersMap.get(order.user_id)!;
      userOrders.orders.push(order);
      userOrders.totalSpent += order.total;
    });

    return Array.from(userOrdersMap.values());
  }
};
