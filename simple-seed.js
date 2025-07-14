const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const pokemonData = [
  {
    id: '1',
    name: 'Pikachu',
    image: '/api/placeholder/200/200',
    price: 150.00,
    description: 'An Electric-type Pokemon known for its adorable appearance and powerful electric attacks.',
    inStock: true,
    featured: true,
    hp: 35,
    attack: 55,
    defense: 40,
    speed: 90,
    types: ['electric']
  },
  {
    id: '2',
    name: 'Charizard',
    image: '/api/placeholder/200/200',
    price: 300.00,
    description: 'A Fire/Flying-type Pokemon with incredible strength and the ability to breathe fire.',
    inStock: true,
    featured: true,
    hp: 78,
    attack: 84,
    defense: 78,
    speed: 100,
    types: ['fire', 'flying']
  },
  {
    id: '3',
    name: 'Blastoise',
    image: '/api/placeholder/200/200',
    price: 280.00,
    description: 'A Water-type Pokemon with powerful water cannons and excellent defensive capabilities.',
    inStock: true,
    featured: true,
    hp: 79,
    attack: 83,
    defense: 100,
    speed: 78,
    types: ['water']
  },
  {
    id: '4',
    name: 'Machamp',
    image: '/api/placeholder/200/200',
    price: 240.00,
    description: 'A Fighting-type Pokemon with four muscular arms and incredible physical strength.',
    inStock: false,
    featured: false,
    hp: 90,
    attack: 130,
    defense: 80,
    speed: 55,
    types: ['fighting']
  }
];

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data
    await prisma.pokemonType.deleteMany();
    await prisma.pokemon.deleteMany();

    // Seed Pokemon data
    for (const pokemon of pokemonData) {
      const { types, ...pokemonFields } = pokemon;
      
      const createdPokemon = await prisma.pokemon.create({
        data: pokemonFields,
      });

      // Add types
      for (const type of types) {
        await prisma.pokemonType.create({
          data: {
            type,
            pokemonId: createdPokemon.id,
          },
        });
      }
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
