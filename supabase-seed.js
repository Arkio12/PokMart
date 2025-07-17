const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://mkrsejfgwvbnhohvojzn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rcnNlamZnd3ZibmhvaHZvanotbiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzIxMDE3MjU5LCJleHAiOjIwMzY1OTMyNTl9.K4zUqN-3bvJ0cUZDqrFOJUXqWLfBjNaHDmQYQAGD7Y0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sample Pokemon data
const pokemonData = [
  {
    id: 'pikachu',
    name: 'Pikachu',
    image: '/images/pikachu.png',
    price: 25.99,
    description: 'An Electric-type Pokémon known for its adorable appearance and powerful electric attacks.',
    in_stock: true,
    featured: true,
    hp: 60,
    attack: 55,
    defense: 40,
    speed: 90,
    types: ['Electric']
  },
  {
    id: 'charizard',
    name: 'Charizard',
    image: '/images/charizard.png',
    price: 89.99,
    description: 'A powerful Fire/Flying-type Pokémon with the ability to breathe intense flames.',
    in_stock: true,
    featured: true,
    hp: 150,
    attack: 84,
    defense: 78,
    speed: 100,
    types: ['Fire', 'Flying']
  },
  {
    id: 'blastoise',
    name: 'Blastoise',
    image: '/images/blastoise.png',
    price: 79.99,
    description: 'A Water-type Pokémon with powerful water cannons on its shell.',
    in_stock: true,
    featured: true,
    hp: 140,
    attack: 83,
    defense: 100,
    speed: 78,
    types: ['Water']
  },
  {
    id: 'venusaur',
    name: 'Venusaur',
    image: '/images/venusaur.png',
    price: 69.99,
    description: 'A Grass/Poison-type Pokémon with a large flower on its back.',
    in_stock: true,
    featured: false,
    hp: 130,
    attack: 82,
    defense: 83,
    speed: 80,
    types: ['Grass', 'Poison']
  },
  {
    id: 'mewtwo',
    name: 'Mewtwo',
    image: '/images/mewtwo.png',
    price: 299.99,
    description: 'A legendary Psychic-type Pokémon created through genetic manipulation.',
    in_stock: true,
    featured: true,
    hp: 180,
    attack: 110,
    defense: 90,
    speed: 130,
    types: ['Psychic']
  },
  {
    id: 'mew',
    name: 'Mew',
    image: '/images/mew.png',
    price: 199.99,
    description: 'A mythical Psychic-type Pokémon said to contain the DNA of all Pokémon.',
    in_stock: true,
    featured: false,
    hp: 160,
    attack: 100,
    defense: 100,
    speed: 100,
    types: ['Psychic']
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting Supabase seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await supabase.from('pokemon_types').delete().neq('id', '');
    await supabase.from('pokemon').delete().neq('id', '');

    // Insert Pokemon data
    console.log('🎮 Inserting Pokemon data...');
    for (const pokemon of pokemonData) {
      const { types, ...pokemonFields } = pokemon;
      
      // Insert Pokemon
      const { data: insertedPokemon, error: pokemonError } = await supabase
        .from('pokemon')
        .insert([pokemonFields])
        .select()
        .single();

      if (pokemonError) {
        console.error(`Error inserting ${pokemon.name}:`, pokemonError);
        continue;
      }

      console.log(`✅ Inserted ${pokemon.name}`);

      // Insert types
      if (types && types.length > 0) {
        const typeInserts = types.map(type => ({
          pokemon_id: insertedPokemon.id,
          type: type
        }));

        const { error: typesError } = await supabase
          .from('pokemon_types')
          .insert(typeInserts);

        if (typesError) {
          console.error(`Error inserting types for ${pokemon.name}:`, typesError);
        } else {
          console.log(`  🏷️  Added types: ${types.join(', ')}`);
        }
      }
    }

    console.log('✅ Seeding completed successfully!');
    console.log(`📊 Inserted ${pokemonData.length} Pokemon`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();
