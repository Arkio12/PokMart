import { prisma } from './prisma';
import { Pokemon } from '@/types';

export class PokemonService {
  static async getAllPokemon(): Promise<Pokemon[]> {
    try {
      const pokemon = await prisma.pokemon.findMany({
        include: {
          types: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return pokemon.map((p) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        price: p.price,
        description: p.description,
        inStock: p.inStock,
        featured: p.featured,
        type: p.types.map((t) => t.type) as any,
        stats: {
          hp: p.hp,
          attack: p.attack,
          defense: p.defense,
          speed: p.speed,
        },
      }));
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      throw new Error('Failed to fetch Pokemon');
    }
  }

  static async getFeaturedPokemon(): Promise<Pokemon[]> {
    try {
      const pokemon = await prisma.pokemon.findMany({
        where: {
          featured: true,
        },
        include: {
          types: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return pokemon.map((p) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        price: p.price,
        description: p.description,
        inStock: p.inStock,
        featured: p.featured,
        type: p.types.map((t) => t.type) as any,
        stats: {
          hp: p.hp,
          attack: p.attack,
          defense: p.defense,
          speed: p.speed,
        },
      }));
    } catch (error) {
      console.error('Error fetching featured Pokemon:', error);
      throw new Error('Failed to fetch featured Pokemon');
    }
  }

  static async getPokemonById(id: string): Promise<Pokemon | null> {
    try {
      const pokemon = await prisma.pokemon.findUnique({
        where: { id },
        include: {
          types: true,
        },
      });

      if (!pokemon) return null;

      return {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        price: pokemon.price,
        description: pokemon.description,
        inStock: pokemon.inStock,
        featured: pokemon.featured,
        type: pokemon.types.map((t) => t.type) as any,
        stats: {
          hp: pokemon.hp,
          attack: pokemon.attack,
          defense: pokemon.defense,
          speed: pokemon.speed,
        },
      };
    } catch (error) {
      console.error('Error fetching Pokemon by ID:', error);
      throw new Error('Failed to fetch Pokemon');
    }
  }

  static async searchPokemon(query: string): Promise<Pokemon[]> {
    try {
      const pokemon = await prisma.pokemon.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { types: { some: { type: { contains: query, mode: 'insensitive' } } } },
          ],
        },
        include: {
          types: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return pokemon.map((p) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        price: p.price,
        description: p.description,
        inStock: p.inStock,
        featured: p.featured,
        type: p.types.map((t) => t.type) as any,
        stats: {
          hp: p.hp,
          attack: p.attack,
          defense: p.defense,
          speed: p.speed,
        },
      }));
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      throw new Error('Failed to search Pokemon');
    }
  }

  static async filterPokemonByType(type: string): Promise<Pokemon[]> {
    try {
      const pokemon = await prisma.pokemon.findMany({
        where: {
          types: {
            some: {
              type: { equals: type, mode: 'insensitive' },
            },
          },
        },
        include: {
          types: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return pokemon.map((p) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        price: p.price,
        description: p.description,
        inStock: p.inStock,
        featured: p.featured,
        type: p.types.map((t) => t.type) as any,
        stats: {
          hp: p.hp,
          attack: p.attack,
          defense: p.defense,
          speed: p.speed,
        },
      }));
    } catch (error) {
      console.error('Error filtering Pokemon by type:', error);
      throw new Error('Failed to filter Pokemon');
    }
  }
}
