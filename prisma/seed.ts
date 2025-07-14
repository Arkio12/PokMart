import { PrismaClient } from '@prisma/client';

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
    name: 'Venusaur',
    image: '/api/placeholder/200/200',
    price: 260.00,
    description: 'A Grass/Poison-type Pokemon with a large flower on its back and nature-based attacks.',
    inStock: true,
    featured: true,
    hp: 80,
    attack: 82,
    defense: 83,
    speed: 80,
    types: ['grass', 'poison']
  },
  {
    id: '5',
    name: 'Gengar',
    image: '/api/placeholder/200/200',
    price: 220.00,
    description: 'A Ghost/Poison-type Pokemon known for its mischievous nature and ghostly abilities.',
    inStock: true,
    featured: false,
    hp: 60,
    attack: 65,
    defense: 60,
    speed: 110,
    types: ['ghost', 'poison']
  },
  {
    id: '6',
    name: 'Alakazam',
    image: '/api/placeholder/200/200',
    price: 250.00,
    description: 'A Psychic-type Pokemon with incredible intelligence and powerful psychic abilities.',
    inStock: true,
    featured: false,
    hp: 55,
    attack: 50,
    defense: 45,
    speed: 120,
    types: ['psychic']
  },
  {
    id: '7',
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
  },
  {
    id: '8',
    name: 'Dragonite',
    image: '/api/placeholder/200/200',
    price: 350.00,
    description: 'A Dragon/Flying-type Pokemon with gentle nature despite its powerful appearance.',
    inStock: true,
    featured: true,
    hp: 91,
    attack: 134,
    defense: 95,
    speed: 80,
    types: ['dragon', 'flying']
  }
];

async function main() {
  console.log('🌱 Seeding database...');

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
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
