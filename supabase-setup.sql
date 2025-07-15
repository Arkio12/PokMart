-- Create database tables for Pokemon ecommerce
-- Run this SQL in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pokemon table
CREATE TABLE IF NOT EXISTS pokemon (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    image TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    "inStock" BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    hp INTEGER NOT NULL DEFAULT 100,
    attack INTEGER NOT NULL DEFAULT 50,
    defense INTEGER NOT NULL DEFAULT 50,
    speed INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pokemon_id UUID NOT NULL REFERENCES pokemon(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, pokemon_id)
);

-- Create pokemon_types table (for storing Pokemon types)
CREATE TABLE IF NOT EXISTS pokemon_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pokemon_id UUID NOT NULL REFERENCES pokemon(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'PENDING',
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    pokemon_id UUID NOT NULL REFERENCES pokemon(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample Pokemon data
INSERT INTO pokemon (name, image, price, description, "inStock", featured, hp, attack, defense, speed) VALUES
('Pikachu', '/api/placeholder/150/150', 49.99, 'An Electric-type Pokémon', true, true, 35, 55, 40, 90),
('Charizard', '/api/placeholder/150/150', 299.99, 'A Fire/Flying-type Pokémon', true, true, 78, 84, 78, 100),
('Blastoise', '/api/placeholder/150/150', 289.99, 'A Water-type Pokémon', true, true, 79, 83, 100, 78),
('Venusaur', '/api/placeholder/150/150', 279.99, 'A Grass/Poison-type Pokémon', true, true, 80, 82, 83, 80),
('Mewtwo', '/api/placeholder/150/150', 599.99, 'A Psychic-type Pokémon', true, true, 106, 110, 90, 130),
('Mew', '/api/placeholder/150/150', 499.99, 'A Psychic-type Pokémon', false, true, 100, 100, 100, 100),
('Gyarados', '/api/placeholder/150/150', 199.99, 'A Water/Flying-type Pokémon', true, false, 95, 125, 79, 81),
('Dragonite', '/api/placeholder/150/150', 399.99, 'A Dragon/Flying-type Pokémon', true, true, 91, 134, 95, 80)
ON CONFLICT (name) DO NOTHING;

-- Insert Pokemon types
INSERT INTO pokemon_types (pokemon_id, type) 
SELECT p.id, 'electric' FROM pokemon p WHERE p.name = 'Pikachu'
UNION ALL
SELECT p.id, 'fire' FROM pokemon p WHERE p.name = 'Charizard'
UNION ALL
SELECT p.id, 'flying' FROM pokemon p WHERE p.name = 'Charizard'
UNION ALL
SELECT p.id, 'water' FROM pokemon p WHERE p.name = 'Blastoise'
UNION ALL
SELECT p.id, 'grass' FROM pokemon p WHERE p.name = 'Venusaur'
UNION ALL
SELECT p.id, 'poison' FROM pokemon p WHERE p.name = 'Venusaur'
UNION ALL
SELECT p.id, 'psychic' FROM pokemon p WHERE p.name = 'Mewtwo'
UNION ALL
SELECT p.id, 'psychic' FROM pokemon p WHERE p.name = 'Mew'
UNION ALL
SELECT p.id, 'water' FROM pokemon p WHERE p.name = 'Gyarados'
UNION ALL
SELECT p.id, 'flying' FROM pokemon p WHERE p.name = 'Gyarados'
UNION ALL
SELECT p.id, 'dragon' FROM pokemon p WHERE p.name = 'Dragonite'
UNION ALL
SELECT p.id, 'flying' FROM pokemon p WHERE p.name = 'Dragonite'
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pokemon_updated_at BEFORE UPDATE ON pokemon FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pokemon ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pokemon_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Pokemon policies (read-only for everyone)
CREATE POLICY "Pokemon are viewable by everyone" ON pokemon FOR SELECT USING (true);
CREATE POLICY "Pokemon types are viewable by everyone" ON pokemon_types FOR SELECT USING (true);

-- User policies (users can only see their own data)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Users can insert their own data" ON users FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Cart policies (users can only see their own cart)
CREATE POLICY "Users can view their own cart" ON cart_items FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can modify their own cart" ON cart_items FOR ALL USING (auth.uid()::text = user_id::text);

-- Order policies (users can only see their own orders)
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create their own orders" ON orders FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND auth.uid()::text = orders.user_id::text)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pokemon_name ON pokemon(name);
CREATE INDEX IF NOT EXISTS idx_pokemon_featured ON pokemon(featured);
CREATE INDEX IF NOT EXISTS idx_pokemon_instock ON pokemon("inStock");
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_pokemon_id ON cart_items(pokemon_id);
CREATE INDEX IF NOT EXISTS idx_pokemon_types_pokemon_id ON pokemon_types(pokemon_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
