"use client";

import { useState } from 'react';
import { X, Package, Upload } from 'lucide-react';
import { Pokemon, PokemonType } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface AddPokemonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPokemon: (pokemon: Omit<Pokemon, 'id'>) => void;
}

const pokemonTypes: PokemonType[] = [
  'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 
  'fairy', 'fighting', 'poison', 'ground', 'flying', 'bug', 'rock', 'ghost', 
  'steel', 'normal'
];

export function AddPokemonModal({ isOpen, onClose, onAddPokemon }: AddPokemonModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    description: '',
    type: [] as PokemonType[],
    stats: {
      hp: '',
      attack: '',
      defense: '',
      speed: ''
    },
    inStock: true,
    featured: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.type.length === 0) newErrors.type = 'At least one type is required';
    if (!formData.stats.hp || parseInt(formData.stats.hp) <= 0) newErrors.hp = 'Valid HP is required';
    if (!formData.stats.attack || parseInt(formData.stats.attack) <= 0) newErrors.attack = 'Valid Attack is required';
    if (!formData.stats.defense || parseInt(formData.stats.defense) <= 0) newErrors.defense = 'Valid Defense is required';
    if (!formData.stats.speed || parseInt(formData.stats.speed) <= 0) newErrors.speed = 'Valid Speed is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create Pokemon object
    const newPokemon: Omit<Pokemon, 'id'> = {
      name: formData.name.trim(),
      image: formData.image.trim(),
      price: parseFloat(formData.price),
      description: formData.description.trim(),
      type: formData.type,
      category: 'pokemon',
      stats: {
        hp: parseInt(formData.stats.hp),
        attack: parseInt(formData.stats.attack),
        defense: parseInt(formData.stats.defense),
        speed: parseInt(formData.stats.speed)
      },
      inStock: formData.inStock,
      featured: formData.featured
    };

    onAddPokemon(newPokemon);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      image: '',
      price: '',
      description: '',
      type: [],
      stats: {
        hp: '',
        attack: '',
        defense: '',
        speed: ''
      },
      inStock: true,
      featured: false
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTypeToggle = (type: PokemonType) => {
    setFormData(prev => ({
      ...prev,
      type: prev.type.includes(type) 
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type]
    }));
  };

  const getTypeColor = (type: PokemonType) => {
    const colors: Record<PokemonType, string> = {
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
    return colors[type];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center space-x-2">
              <Package className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Add New Pokemon</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pokemon Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter Pokemon name"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="https://example.com/pokemon-image.png"
                />
                {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Enter Pokemon description"
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Types */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Types *</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {pokemonTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeToggle(type)}
                    className={`px-3 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      formData.type.includes(type)
                        ? `${getTypeColor(type)} text-white`
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type}</p>}
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HP *</label>
                  <input
                    type="number"
                    value={formData.stats.hp}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      stats: { ...prev.stats, hp: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="100"
                  />
                  {errors.hp && <p className="text-red-600 text-sm mt-1">{errors.hp}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attack *</label>
                  <input
                    type="number"
                    value={formData.stats.attack}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      stats: { ...prev.stats, attack: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="100"
                  />
                  {errors.attack && <p className="text-red-600 text-sm mt-1">{errors.attack}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Defense *</label>
                  <input
                    type="number"
                    value={formData.stats.defense}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      stats: { ...prev.stats, defense: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="100"
                  />
                  {errors.defense && <p className="text-red-600 text-sm mt-1">{errors.defense}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Speed *</label>
                  <input
                    type="number"
                    value={formData.stats.speed}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      stats: { ...prev.stats, speed: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="100"
                  />
                  {errors.speed && <p className="text-red-600 text-sm mt-1">{errors.speed}</p>}
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Options</h3>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">In Stock</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Add Pokemon
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
