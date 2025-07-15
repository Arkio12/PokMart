-- Create Pokemon table
CREATE TABLE pokemon (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    image TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    in_stock BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    hp INTEGER NOT NULL,
    attack INTEGER NOT NULL,
    defense INTEGER NOT NULL,
    speed INTEGER NOT NULL,
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

-- Insert sample Pokemon data
INSERT INTO pokemon (id, name, image, price, description, in_stock, featured, hp, attack, defense, speed) VALUES
('1', 'Pikachu', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', 49.99, 'An Electric-type Pokémon', true, true, 35, 55, 40, 90),
('2', 'Charizard', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png', 299.99, 'A Fire/Flying-type Pokémon', true, true, 78, 84, 78, 100),
('3', 'Blastoise', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png', 289.99, 'A Water-type Pokémon', true, false, 79, 83, 100, 78),
('4', 'Venusaur', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png', 279.99, 'A Grass/Poison-type Pokémon', true, false, 80, 82, 83, 80),
('5', 'Mewtwo', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png', 599.99, 'A Psychic-type Pokémon', false, true, 106, 110, 90, 130),
('6', 'Mew', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png', 499.99, 'A Psychic-type Pokémon', false, true, 100, 100, 100, 100),
('7', 'Gyarados', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png', 149.99, 'A Water/Flying-type Pokémon', true, false, 95, 125, 79, 81),
('8', 'Dragonite', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png', 399.99, 'A Dragon/Flying-type Pokémon', true, false, 91, 134, 95, 80);

-- Insert Pokemon types
INSERT INTO pokemon_types (pokemon_id, type) VALUES
('1', 'electric'),
('2', 'fire'),
('2', 'flying'),
('3', 'water'),
('4', 'grass'),
('4', 'poison'),
('5', 'psychic'),
('6', 'psychic'),
('7', 'water'),
('7', 'flying'),
('8', 'dragon'),
('8', 'flying');

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE pokemon ENABLE ROW LEVEL SECURITY;
ALTER TABLE pokemon_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (for development)
CREATE POLICY "Allow all operations on pokemon" ON pokemon FOR ALL USING (true);
CREATE POLICY "Allow all operations on pokemon_types" ON pokemon_types FOR ALL USING (true);
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on cart_items" ON cart_items FOR ALL USING (true);
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations on order_items" ON order_items FOR ALL USING (true);
