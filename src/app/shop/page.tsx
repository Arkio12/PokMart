"use client";

import { PokemonCard } from '@/components/PokemonCard';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { usePokemon } from '@/context/PokemonContext';

export default function Shop() {
  const { pokemon } = usePokemon();
  const [filter, setFilter] = useState<string>('all');
  
  const filteredPokemon = filter === 'all' 
    ? pokemon 
    : pokemon.filter(pokemon => pokemon.type.includes(filter as any));

  const types = ['all', 'fire', 'water', 'grass', 'electric', 'psychic', 'dragon', 'flying'];

  return (
    <div className="pt-16"> {/* Account for fixed header */}
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-8 text-white"
        >
          Pokémon Shop 🏪
        </motion.h1>

        {/* Filter Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full font-medium transition-colors cursor-pointer ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Pokemon Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredPokemon.map((pokemon, index) => (
            <motion.div
              key={pokemon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <PokemonCard pokemon={pokemon} />
            </motion.div>
          ))}
        </motion.div>

        {filteredPokemon.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No Pokemon found with the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
