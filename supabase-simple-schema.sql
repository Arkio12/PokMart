-- Create Pokemon table
CREATE TABLE IF NOT EXISTS pokemon (
    id TEXT PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS pokemon_types (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    pokemon_id TEXT NOT NULL,
    type TEXT NOT NULL,
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE
);

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Cart Items table
CREATE TABLE IF NOT EXISTS cart_items (
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

-- Disable RLS for now (enable it later when auth is set up)
ALTER TABLE pokemon DISABLE ROW LEVEL SECURITY;
ALTER TABLE pokemon_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;

-- Insert sample Pokemon data
INSERT INTO pokemon (id, name, image, price, description, in_stock, featured, hp, attack, defense, speed) VALUES
('pikachu', 'Pikachu', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', 49.99, 'An Electric-type Pokémon', true, true, 35, 55, 40, 90),
('charizard', 'Charizard', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png', 299.99, 'A Fire/Flying-type Pokémon', true, true, 78, 84, 78, 100),
('blastoise', 'Blastoise', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png', 289.99, 'A Water-type Pokémon', true, false, 79, 83, 100, 78),
('venusaur', 'Venusaur', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png', 279.99, 'A Grass/Poison-type Pokémon', true, false, 80, 82, 83, 80),
('mewtwo', 'Mewtwo', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png', 599.99, 'A Psychic-type Pokémon', false, true, 106, 110, 90, 130),
('mew', 'Mew', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png', 499.99, 'A Psychic-type Pokémon', false, true, 100, 100, 100, 100),
('gyarados', 'Gyarados', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png', 149.99, 'A Water/Flying-type Pokémon', true, false, 95, 125, 79, 81),
('dragonite', 'Dragonite', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png', 399.99, 'A Dragon/Flying-type Pokémon', true, false, 91, 134, 95, 80)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    image = EXCLUDED.image,
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    in_stock = EXCLUDED.in_stock,
    featured = EXCLUDED.featured,
    hp = EXCLUDED.hp,
    attack = EXCLUDED.attack,
    defense = EXCLUDED.defense,
    speed = EXCLUDED.speed;

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
('dragonite', 'flying')
ON CONFLICT (pokemon_id, type) DO NOTHING;
