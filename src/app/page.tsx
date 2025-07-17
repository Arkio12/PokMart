"use client";

import { PokemonCard } from '@/components/PokemonCard';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';
import { usePokemon } from '@/context/PokemonContext';

export default function Home() {
  const { featuredPokemon, refreshPokemon } = usePokemon();
  
  // Refresh Pokemon data when component mounts to ensure we have the latest data
  useEffect(() => {
    refreshPokemon();
  }, [refreshPokemon]);
  
  return (
    <div className="pt-16"> {/* Account for fixed header */}
      {/* Hero Section */}
      <section className="bg-gradient-electric text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Welcome to <span className ="text-yellow-500">Poké</span><span className="text-red-500">Mart!</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-yellow-100"
          >
            Discover and collect your favorite Pokémon
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link 
            href="/shop" 
            className="bg-white text-yellow-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-50 transition-colors inline-block cursor-pointer"
          >
              Start Shopping 🛒
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Pokemon Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-12 text-gray-900"
          >
            Featured Pokemon ⭐
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-black">
            {featuredPokemon.map((pokemon, index) => (
              <motion.div
                key={pokemon.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PokemonCard pokemon={pokemon} />
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/shop" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block cursor-pointer"
            >
              View All Pokémon →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-12 text-gray-900"
          >
            Why Choose PokéMart? 🎯
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6"
            >
              <div className="text-6xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2 text-black">Fast Delivery</h3>
              <p className="text-gray-600">Get your Pokémon delivered within 24 hours!</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6"
            >
              <div className="text-6xl mb-4">💎</div>
              <h3 className="text-xl font-bold mb-2 text-black">Premium Quality</h3>
              <p className="text-gray-600">Only the finest Pokémon from certified trainers.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-6"
            >
              <div className="text-6xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-2 text-black">Secure Trading</h3>
              <p className="text-gray-600">Safe and secure transactions guaranteed.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
