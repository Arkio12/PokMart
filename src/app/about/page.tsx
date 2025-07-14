"use client";

import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-8 text-white"
        >
          About <span className="text-yellow-500">Poké</span><span className="text-red-500">Mart</span> 🏢
        </motion.h1>

        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-black">Our Story 📖</h2>
            <p className="text-gray-600 mb-4">
              Welcome to PokéMart, the ultimate destination for Pokemon enthusiasts! Founded by passionate trainers, 
              we've been connecting Pokemon with their perfect trainers since the beginning of our journey.
            </p>
            <p className="text-gray-600">
              Our mission is to provide the highest quality Pokemon, items, and accessories to trainers around the world. 
              We believe that every trainer deserves to find their perfect Pokemon companion.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
          >
            <div className="bg-gradient-fire text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">🔥 Quality Guarantee</h3>
              <p>All our Pokemon are ethically sourced and come with full health guarantees.</p>
            </div>
            <div className="bg-gradient-water text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">💧 Expert Care</h3>
              <p>Our team of Pokemon specialists ensures every Pokemon is in perfect condition.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-electric text-white rounded-xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">⚡ Join Our Community</h2>
            <p className="mb-4">
              Become part of the largest Pokemon trading community in the world. 
              Share your journey, trade with friends, and discover rare Pokemon!
            </p>
            <button className="bg-white text-yellow-600 px-6 py-3 rounded-full font-bold hover:bg-yellow-50 transition-colors cursor-pointer">
              Learn More
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
