"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Download,
  Upload
} from "lucide-react";
import { motion } from "framer-motion";
import { Pokemon } from "@/types";

interface PokemonWithActions extends Pokemon {
  actions?: any;
}

export default function AdminPokemonPage() {
  const [pokemon, setPokemon] = useState<PokemonWithActions[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchPokemon = async () => {
      // Simulate API call
      setTimeout(() => {
        setPokemon([
          {
            id: "1",
            name: "Pikachu",
            image: "/api/placeholder/150/150",
            price: 49.99,
            type: ["electric"],
            category: "pokemon",
            description: "An Electric-type Pokémon",
            stats: { hp: 35, attack: 55, defense: 40, speed: 90 },
            inStock: true,
            featured: true
          },
          {
            id: "2",
            name: "Charizard",
            image: "/api/placeholder/150/150",
            price: 99.99,
            type: ["fire", "flying"],
            category: "pokemon",
            description: "A Fire/Flying-type Pokémon",
            stats: { hp: 78, attack: 84, defense: 78, speed: 100 },
            inStock: true,
            featured: true
          },
          {
            id: "3",
            name: "Blastoise",
            image: "/api/placeholder/150/150",
            price: 89.99,
            type: ["water"],
            category: "pokemon",
            description: "A Water-type Pokémon",
            stats: { hp: 79, attack: 83, defense: 100, speed: 78 },
            inStock: false,
            featured: false
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchPokemon();
  }, []);

  const filteredPokemon = pokemon.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || p.type.includes(filterType as any);
    return matchesSearch && matchesType;
  });

  const sortedPokemon = [...filteredPokemon].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price":
        return a.price - b.price;
      case "type":
        return a.type[0].localeCompare(b.type[0]);
      default:
        return 0;
    }
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this Pokemon?")) {
      setPokemon(pokemon.filter(p => p.id !== id));
    }
  };

  const handleToggleStock = (id: string) => {
    setPokemon(pokemon.map(p => 
      p.id === id ? { ...p, inStock: !p.inStock } : p
    ));
  };

  const handleToggleFeatured = (id: string) => {
    setPokemon(pokemon.map(p => 
      p.id === id ? { ...p, featured: !p.featured } : p
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Pokemon Management</h1>
        <div className="flex space-x-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Upload size={16} />
            <span>Import</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download size={16} />
            <span>Export</span>
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
            <Plus size={16} />
            <span>Add Pokemon</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Pokemon..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="fire">Fire</option>
            <option value="water">Water</option>
            <option value="electric">Electric</option>
            <option value="grass">Grass</option>
            <option value="flying">Flying</option>
          </select>

          {/* Sort */}
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="type">Sort by Type</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-2">
            <span className="text-sm text-gray-600">
              {sortedPokemon.length} Pokemon found
            </span>
          </div>
        </div>
      </div>

      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedPokemon.map((pokemon) => (
          <motion.div
            key={pokemon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                {pokemon.featured && (
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                    Featured
                  </span>
                )}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  pokemon.inStock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {pokemon.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{pokemon.name}</h3>
                <span className="text-lg font-bold text-green-600">${pokemon.price}</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {pokemon.type.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize"
                  >
                    {type}
                  </span>
                ))}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {pokemon.description}
              </p>

              {/* Stats Bar */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">Stats</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>HP: {pokemon.stats.hp}</div>
                  <div>Attack: {pokemon.stats.attack}</div>
                  <div>Defense: {pokemon.stats.defense}</div>
                  <div>Speed: {pokemon.stats.speed}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleStock(pokemon.id)}
                    className={`text-xs px-3 py-1 rounded-full ${
                      pokemon.inStock
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {pokemon.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(pokemon.id)}
                    className={`text-xs px-3 py-1 rounded-full ${
                      pokemon.featured
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {pokemon.featured ? 'Unfeature' : 'Feature'}
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye size={16} />
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(pokemon.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {sortedPokemon.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pokemon found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
