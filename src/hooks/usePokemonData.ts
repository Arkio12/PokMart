import { useState, useEffect } from 'react';
import { Pokemon } from '@/types';

// Fallback to mock data if database is not available
const mockPokemon: Pokemon[] = [
  {
    id: 1,
    name: 'Pikachu',
    image: '/api/placeholder/200/200',
    price: 150.00,
    description: 'An Electric-type Pokemon known for its adorable appearance and powerful electric attacks.',
    inStock: true,
    featured: true,
    type: ['electric'],
    category: 'pokemon',
    stats: { hp: 35, attack: 55, defense: 40, speed: 90 }
  },
  {
    id: 2,
    name: 'Charizard',
    image: '/api/placeholder/200/200',
    price: 300.00,
    description: 'A Fire/Flying-type Pokemon with incredible strength and the ability to breathe fire.',
    inStock: true,
    featured: true,
    type: ['fire', 'flying'],
    category: 'pokemon',
    stats: { hp: 78, attack: 84, defense: 78, speed: 100 }
  },
  {
    id: 3,
    name: 'Blastoise',
    image: '/api/placeholder/200/200',
    price: 280.00,
    description: 'A Water-type Pokemon with powerful water cannons and excellent defensive capabilities.',
    inStock: true,
    featured: true,
    type: ['water'],
    category: 'pokemon',
    stats: { hp: 79, attack: 83, defense: 100, speed: 78 }
  },
  {
    id: 4,
    name: 'Venusaur',
    image: '/api/placeholder/200/200',
    price: 260.00,
    description: 'A Grass/Poison-type Pokemon with a large flower on its back and nature-based attacks.',
    inStock: true,
    featured: true,
    type: ['grass', 'poison'],
    category: 'pokemon',
    stats: { hp: 80, attack: 82, defense: 83, speed: 80 }
  },
  {
    id: 5,
    name: 'Gengar',
    image: '/api/placeholder/200/200',
    price: 220.00,
    description: 'A Ghost/Poison-type Pokemon known for its mischievous nature and ghostly abilities.',
    inStock: true,
    featured: false,
    type: ['ghost', 'poison'],
    category: 'pokemon',
    stats: { hp: 60, attack: 65, defense: 60, speed: 110 }
  },
  {
    id: 6,
    name: 'Alakazam',
    image: '/api/placeholder/200/200',
    price: 250.00,
    description: 'A Psychic-type Pokemon with incredible intelligence and powerful psychic abilities.',
    inStock: true,
    featured: false,
    type: ['psychic'],
    category: 'pokemon',
    stats: { hp: 55, attack: 50, defense: 45, speed: 120 }
  },
  {
    id: 7,
    name: 'Machamp',
    image: '/api/placeholder/200/200',
    price: 240.00,
    description: 'A Fighting-type Pokemon with four muscular arms and incredible physical strength.',
    inStock: false,
    featured: false,
    type: ['fighting'],
    category: 'pokemon',
    stats: { hp: 90, attack: 130, defense: 80, speed: 55 }
  },
  {
    id: 8,
    name: 'Dragonite',
    image: '/api/placeholder/200/200',
    price: 350.00,
    description: 'A Dragon/Flying-type Pokemon with gentle nature despite its powerful appearance.',
    inStock: true,
    featured: true,
    type: ['dragon', 'flying'],
    category: 'pokemon',
    stats: { hp: 91, attack: 134, defense: 95, speed: 80 }
  }
];

export function usePokemonData() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPokemon = async () => {
      try {
        // Try to fetch from API first
        const response = await fetch('/api/pokemon');
        if (response.ok) {
          const data = await response.json();
          setPokemon(data);
        } else {
          // Fallback to mock data
          console.log('Using mock data as fallback');
          setPokemon(mockPokemon);
        }
      } catch (err) {
        console.log('Database not available, using mock data');
        setPokemon(mockPokemon);
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, []);

  const featuredPokemon = pokemon.filter(p => p.featured);

  return {
    pokemon,
    featuredPokemon,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      // Reload data logic here
    }
  };
}
