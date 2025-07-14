"use client";

import { Pokemon, PokemonType } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PokemonCardProps {
  pokemon: Pokemon;
}

const typeColors: Record<PokemonType, string> = {
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  grass: 'bg-green-500',
  electric: 'bg-yellow-500',
  psychic: 'bg-purple-500',
  ice: 'bg-cyan-400',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-800',
  fairy: 'bg-pink-400',
  fighting: 'bg-red-700',
  poison: 'bg-purple-600',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  bug: 'bg-green-400',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  steel: 'bg-gray-500',
  normal: 'bg-gray-400',
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (pokemon.inStock) {
      addItem(pokemon);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        'bg-white rounded-xl shadow-md overflow-hidden',
        'pokemon-card border-2 border-gray-200',
        !pokemon.inStock && 'opacity-60'
      )}
    >
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={pokemon.image}
          alt={pokemon.name}
          fill
          className="object-contain p-4"
        />
        {!pokemon.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
        {pokemon.featured && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
            Featured
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{pokemon.name}</h3>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {pokemon.type.map((type) => (
            <span
              key={type}
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium text-white',
                typeColors[type]
              )}
            >
              {type}
            </span>
          ))}
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {pokemon.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(pokemon.price)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="bg-gray-100 rounded p-2">
            <div className="font-medium text-gray-600">HP</div>
            <div className="font-bold">{pokemon.stats.hp}</div>
          </div>
          <div className="bg-gray-100 rounded p-2">
            <div className="font-medium text-gray-600">Attack</div>
            <div className="font-bold">{pokemon.stats.attack}</div>
          </div>
          <div className="bg-gray-100 rounded p-2">
            <div className="font-medium text-gray-600">Defense</div>
            <div className="font-bold">{pokemon.stats.defense}</div>
          </div>
          <div className="bg-gray-100 rounded p-2">
            <div className="font-medium text-gray-600">Speed</div>
            <div className="font-bold">{pokemon.stats.speed}</div>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!pokemon.inStock}
          className={cn(
            'w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 relative transform-gpu',
            pokemon.inStock
              ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer shadow-lg hover:shadow-xl active:scale-95 hover:-translate-y-1 border-b-4 border-green-800 hover:border-green-900 active:border-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed border-b-4 border-gray-400'
          )}
        >
          {pokemon.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </motion.div>
  );
}
