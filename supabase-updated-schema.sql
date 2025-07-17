-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS pokemon_types CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS pokemon CASCADE;

-- Create Pokemon table with correct column names including stock_quantity
CREATE TABLE pokemon (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    image TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    "inStock" BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    hp INTEGER NOT NULL,
    attack INTEGER NOT NULL,
    defense INTEGER NOT NULL,
    speed INTEGER NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Pokemon Types table
CREATE TABLE pokemon_types (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    pokemon_id TEXT NOT NULL,
    type TEXT NOT NULL,
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE
);

-- Create Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Cart Items table
CREATE TABLE cart_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    pokemon_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE,
    UNIQUE(user_id, pokemon_id)
);

-- Create Orders table
CREATE TABLE orders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Order Items table
CREATE TABLE order_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL,
    pokemon_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE
);

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update updated_at column
CREATE TRIGGER update_pokemon_updated_at BEFORE UPDATE ON pokemon FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Disable RLS for now (enable it later when auth is set up)
ALTER TABLE pokemon DISABLE ROW LEVEL SECURITY;
ALTER TABLE pokemon_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Insert sample Pokemon data with correct column names and stock quantities
INSERT INTO pokemon (id, name, image, price, description, "inStock", featured, hp, attack, defense, speed, stock_quantity) VALUES
('pikachu', 'Pikachu', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', 49.99, 'An Electric-type Pokémon', true, true, 35, 55, 40, 90, 10),
('charizard', 'Charizard', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png', 299.99, 'A Fire/Flying-type Pokémon', true, true, 78, 84, 78, 100, 5),
('blastoise', 'Blastoise', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png', 289.99, 'A Water-type Pokémon', true, false, 79, 83, 100, 78, 3),
('venusaur', 'Venusaur', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png', 279.99, 'A Grass/Poison-type Pokémon', true, false, 80, 82, 83, 80, 7),
('mewtwo', 'Mewtwo', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png', 599.99, 'A Psychic-type Pokémon', false, true, 106, 110, 90, 130, 0),
('mew', 'Mew', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png', 499.99, 'A Psychic-type Pokémon', false, true, 100, 100, 100, 100, 0),
('gyarados', 'Gyarados', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png', 149.99, 'A Water/Flying-type Pokémon', true, false, 95, 125, 79, 81, 8),
('dragonite', 'Dragonite', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png', 399.99, 'A Dragon/Flying-type Pokémon', true, false, 91, 134, 95, 80, 4);

-- Insert Pokemon types
INSERT INTO pokemon_types (pokemon_id, type) VALUES
('pikachu', 'electric'),
('charizard', 'fire'),
('charizard', 'flying'),
('blastoise', 'water'),
('venusaur', 'grass'),
('venusaur', 'poison'),
('mewtwo', 'psychic'),
('mew', 'psychic'),
('gyarados', 'water'),
('gyarados', 'flying'),
('dragonite', 'dragon'),
('dragonite', 'flying');

-- Add hidden column to pokemon table
ALTER TABLE pokemon ADD COLUMN hidden BOOLEAN DEFAULT false;

-- Update existing records to not be hidden by default
UPDATE pokemon SET hidden = false WHERE hidden IS NULL;
