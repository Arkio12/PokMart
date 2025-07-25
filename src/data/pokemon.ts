import { Pokemon } from '@/types';

export const mockPokemon: Pokemon[] = [
  {
    id: '1',
    name: 'Pikachu',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    price: 199.99,
    type: ['electric'],
    category: 'pokemon',
    description: 'A Mouse Pokémon with the ability to store electricity in its cheek pouches.',
    hp: 35,
    attack: 55,
    defense: 40,
    speed: 90,
    stats: { hp: 35, attack: 55, defense: 40, speed: 90 },
    inStock: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Charizard',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    price: 299.99,
    type: ['fire', 'flying'],
    category: 'pokemon',
    description: 'A Flame Pokémon that can melt almost anything with its fire that reaches 3,000 degrees Fahrenheit.',
    hp: 78,
    attack: 84,
    defense: 78,
    speed: 100,
    stats: { hp: 78, attack: 84, defense: 78, speed: 100 },
    inStock: true,
    featured: true,
  },
  {
    id: '3',
    name: 'Blastoise',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png',
    price: 289.99,
    type: ['water'],
    category: 'pokemon',
    description: 'A Shellfish Pokémon that can withdraw into its shell and blast out water cannons.',
    hp: 79,
    attack: 83,
    defense: 100,
    speed: 78,
    stats: { hp: 79, attack: 83, defense: 100, speed: 78 },
    inStock: true,
    featured: true,
  },
  {
    id: '4',
    name: 'Venusaur',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png',
    price: 279.99,
    type: ['grass', 'poison'],
    category: 'pokemon',
    description: 'A Seed Pokémon that releases a soothing scent from its flower to enhance emotions.',
    hp: 80,
    attack: 82,
    defense: 83,
    speed: 80,
    stats: { hp: 80, attack: 82, defense: 83, speed: 80 },
    inStock: true,
    featured: false,
  },
  {
    id: '5',
    name: 'Mewtwo',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
    price: 599.99,
    type: ['psychic'],
    category: 'pokemon',
    description: 'A Genetic Pokémon created by recombining DNA. It is said to have the most savage heart.',
    hp: 106,
    attack: 110,
    defense: 90,
    speed: 130,
    stats: { hp: 106, attack: 110, defense: 90, speed: 130 },
    inStock: true,
    featured: true,
  },
  {
    id: '6',
    name: 'Mew',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png',
    price: 499.99,
    type: ['psychic'],
    category: 'pokemon',
    description: 'A New Species Pokémon said to possess the genetic composition of all Pokémon.',
    hp: 100,
    attack: 100,
    defense: 100,
    speed: 100,
    stats: { hp: 100, attack: 100, defense: 100, speed: 100 },
    inStock: false,
    featured: true,
  },
  {
    id: '7',
    name: 'Dragonite',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png',
    price: 399.99,
    type: ['dragon', 'flying'],
    category: 'pokemon',
    description: 'A Dragon Pokémon capable of circling the globe in just 16 hours.',
    hp: 91,
    attack: 134,
    defense: 95,
    speed: 80,
    stats: { hp: 91, attack: 134, defense: 95, speed: 80 },
    inStock: true,
    featured: false,
  },
  {
    id: '8',
    name: 'Gyarados',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png',
    price: 349.99,
    type: ['water', 'flying'],
    category: 'pokemon',
    description: 'An Atrocious Pokémon that is extremely fierce and violent.',
    hp: 95,
    attack: 125,
    defense: 79,
    speed: 81,
    stats: { hp: 95, attack: 125, defense: 79, speed: 81 },
    inStock: true,
    featured: false,
  },
];

export const featuredPokemon = mockPokemon.filter(pokemon => pokemon.featured);
export const availablePokemon = mockPokemon.filter(pokemon => pokemon.inStock);
