"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Star,
  StarOff,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Pokemon, PokemonType } from "@/types";

interface PokemonWithActions extends Pokemon {
  actions?: any;
}

export default function AdminPokemonPage() {
  const [pokemon, setPokemon] = useState<PokemonWithActions[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonWithActions | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Pokemon>>({});

  // Fetch real data from API
  const fetchPokemon = async () => {
    try {
      const response = await fetch('/api/pokemon');
      if (!response.ok) {
        throw new Error('Failed to fetch Pokemon');
      }
      const data = await response.json();
      
      // Transform the data to match expected format
      const transformedPokemon = data.map((p: any) => ({
        ...p,
        // Ensure inStock is properly set based on stock_quantity
        inStock: p.inStock && (p.stock_quantity || 0) > 0,
        // Ensure hidden property is properly set
        hidden: p.hidden || false,
        type: p.types?.map((t: any) => t.type) || [],
        stats: {
          hp: p.hp,
          attack: p.attack,
          defense: p.defense,
          speed: p.speed
        }
      }));
      
      // Debug: Log the first Pokemon to check data structure
      if (transformedPokemon.length > 0) {
        console.log('Sample Pokemon data:', transformedPokemon[0]);
      }
      
      setPokemon(transformedPokemon);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
    
    // Only auto-refresh every 30 seconds to avoid overwriting local changes
    const interval = setInterval(fetchPokemon, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Also refresh when the page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchPokemon();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const filteredPokemon = pokemon.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || (p.type && p.type.includes(filterType as any));
    return matchesSearch && matchesType;
  });

  const sortedPokemon = [...filteredPokemon].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price":
        return a.price - b.price;
      case "type":
        return (a.type?.[0] || "").localeCompare(b.type?.[0] || "");
      default:
        return 0;
    }
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this Pokemon?")) {
      setPokemon(pokemon.filter(p => p.id !== id));
    }
  };

  const handleToggleStock = async (id: string) => {
    const pokemonToUpdate = pokemon.find(p => p.id === id);
    if (!pokemonToUpdate) return;
    
    const newInStockStatus = !pokemonToUpdate.inStock;
    
    try {
      const response = await fetch(`/api/pokemon/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inStock: newInStockStatus
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update stock status');
      }
      
      // Update local state on successful API call
      setPokemon(pokemon.map(p => 
        p.id === id ? { ...p, inStock: newInStockStatus } : p
      ));
    } catch (error) {
      console.error('Error updating stock status:', error);
      alert('Failed to update stock status');
    }
  };

  const handleToggleFeatured = async (id: string) => {
    const pokemonToUpdate = pokemon.find(p => p.id === id);
    if (!pokemonToUpdate) return;
    
    const newFeaturedStatus = !pokemonToUpdate.featured;
    
    try {
      const response = await fetch(`/api/pokemon/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featured: newFeaturedStatus
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update featured status');
      }
      
      // Update local state on successful API call
      setPokemon(pokemon.map(p => 
        p.id === id ? { ...p, featured: newFeaturedStatus } : p
      ));
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Failed to update featured status');
    }
  };
  
  // Add a hidden property to Pokemon type and handle visibility
  const handleToggleVisibility = async (id: string) => {
    const pokemonToUpdate = pokemon.find(p => p.id === id);
    if (!pokemonToUpdate) return;
    
    const newHiddenStatus = !(pokemonToUpdate as any).hidden;
    
    try {
      const response = await fetch(`/api/pokemon/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hidden: newHiddenStatus
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update visibility status');
      }
      
      // Update local state on successful API call
      setPokemon(pokemon.map(p => 
        p.id === id ? { ...p, hidden: newHiddenStatus } : p
      ));
    } catch (error) {
      console.error('Error updating visibility status:', error);
      alert('Failed to update visibility status');
    }
  };
  
  const handleDeleteClick = (pokemon: PokemonWithActions) => {
    setSelectedPokemon(pokemon);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedPokemon) return;
    
    try {
      const response = await fetch(`/api/pokemon/${selectedPokemon.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete Pokemon');
      }
      
      // Remove from local state on successful API call
      setPokemon(pokemon.filter(p => p.id !== selectedPokemon.id));
      setShowDeleteModal(false);
      setSelectedPokemon(null);
    } catch (error) {
      console.error('Error deleting Pokemon:', error);
      alert('Failed to delete Pokemon');
    }
  };
  
  const handleEditClick = (pokemon: PokemonWithActions) => {
    setSelectedPokemon(pokemon);
    setEditFormData({
      name: pokemon.name,
      price: pokemon.price,
      description: pokemon.description,
      hp: pokemon.hp,
      attack: pokemon.attack,
      defense: pokemon.defense,
      speed: pokemon.speed,
      stock_quantity: pokemon.stock_quantity,
      type: pokemon.type
    });
    setShowEditModal(true);
  };
  
  const handleSaveEdit = async () => {
    if (!selectedPokemon) return;
    
    try {
      const response = await fetch(`/api/pokemon/${selectedPokemon.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update Pokemon');
      }
      
      // Get the updated Pokemon data from the API response
      const updatedPokemonData = await response.json();
      
      // Transform the API response to match the expected format
      const transformedPokemon = {
        ...updatedPokemonData,
        hidden: updatedPokemonData.hidden || false,
        type: updatedPokemonData.type || [],
        stats: {
          hp: updatedPokemonData.hp,
          attack: updatedPokemonData.attack,
          defense: updatedPokemonData.defense,
          speed: updatedPokemonData.speed
        }
      };
      
      // Update local state with the transformed Pokemon object
      setPokemon(pokemon.map(p => 
        p.id === selectedPokemon.id ? transformedPokemon : p
      ));
      setShowEditModal(false);
      setSelectedPokemon(null);
      setEditFormData({});
    } catch (error) {
      console.error('Error updating Pokemon:', error);
      alert('Failed to update Pokemon');
    }
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
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2" onClick={fetchPokemon}>
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
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
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
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
              
              {/* Stock Quantity */}
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <span className={`font-semibold ${
                    (pokemon.stock_quantity || 0) > 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {pokemon.stock_quantity || 0}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {pokemon.type?.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 bg-blue-100 text-black rounded-full text-xs capitalize"
                  >
                    {type}
                  </span>
                ))}
              </div>

              <p className="text-sm text-black mb-4 line-clamp-2">
                {pokemon.description}
              </p>

              {/* Stats Bar */}
              <div className="mb-4">
                <div className="text-xs text-black mb-1">Stats</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-black">
                  <div>HP: {pokemon.stats?.hp}</div>
                  <div>Attack: {pokemon.stats?.attack}</div>
                  <div>Defense: {pokemon.stats?.defense}</div>
                  <div>Speed: {pokemon.stats?.speed}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleStock(pokemon.id)}
                    className={`text-xs px-3 py-1 rounded-full ${
                      pokemon.inStock
                        ? 'bg-red-100 text-black hover:bg-red-200'
                        : 'bg-green-100 text-black hover:bg-green-200'
                    }`}
                  >
                    {pokemon.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(pokemon.id)}
                    className={`text-xs px-3 py-1 rounded-full ${
                      pokemon.featured
                        ? 'bg-yellow-100 text-black hover:bg-yellow-200'
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    }`}
                  >
                    {pokemon.featured ? 'Unfeature' : 'Feature'}
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleToggleVisibility(pokemon.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      (pokemon as any).hidden 
                        ? 'text-gray-400 hover:text-gray-600 bg-gray-50'
                        : 'text-blue-600 hover:text-blue-800 bg-blue-50'
                    }`}
                    title={(pokemon as any).hidden ? 'Show in shop' : 'Hide from shop'}
                  >
                    {(pokemon as any).hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button 
                    onClick={() => handleEditClick(pokemon)}
                    className="p-2 rounded-lg text-green-600 hover:text-green-800 bg-green-50 transition-colors"
                    title="Edit Pokemon"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(pokemon)}
                    className="p-2 rounded-lg text-red-600 hover:text-red-800 bg-red-50 transition-colors"
                    title="Delete Pokemon"
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
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete Pokemon</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete <strong>{selectedPokemon?.name}</strong>? This action cannot be undone.
                </p>
                
                {selectedPokemon && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={selectedPokemon.image}
                      alt={selectedPokemon.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedPokemon.name}</h4>
                      <p className="text-sm text-gray-600">${selectedPokemon.price}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Pokemon
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Pokemon</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>
                
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.price || ''}
                    onChange={(e) => setEditFormData({...editFormData, price: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>
                
                {/* Stock Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editFormData.stock_quantity || ''}
                    onChange={(e) => setEditFormData({...editFormData, stock_quantity: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editFormData.description || ''}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>
                
                {/* Stats */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-black">Stats</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">HP</label>
                      <input
                        type="number"
                        value={editFormData.hp || ''}
                        onChange={(e) => setEditFormData({...editFormData, hp: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Attack</label>
                      <input
                        type="number"
                        value={editFormData.attack || ''}
                        onChange={(e) => setEditFormData({...editFormData, attack: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Defense</label>
                      <input
                        type="number"
                        value={editFormData.defense || ''}
                        onChange={(e) => setEditFormData({...editFormData, defense: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Speed</label>
                      <input
                        type="number"
                        value={editFormData.speed || ''}
                        onChange={(e) => setEditFormData({...editFormData, speed: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
