"use client";

import { useState, useEffect } from 'react';
import { X, Trash2, Search, AlertTriangle, Package, Eye, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePokemon } from '@/context/PokemonContext';
import { Pokemon } from '@/types';

interface DeleteItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteItemModal({ isOpen, onClose }: DeleteItemModalProps) {
  const { pokemon, deletePokemon } = usePokemon();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Pokemon | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFilteredPokemon(pokemon);
    }
  }, [isOpen, pokemon]);

  useEffect(() => {
    let filtered = pokemon;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => 
        statusFilter === 'inStock' ? item.inStock : !item.inStock
      );
    }

    setFilteredPokemon(filtered);
  }, [searchTerm, statusFilter, pokemon]);

  const handleDeleteSingle = (item: Pokemon) => {
    setItemToDelete(item);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deletePokemon(itemToDelete.id);
      setShowConfirmation(false);
      setItemToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    
    selectedItems.forEach(id => {
      deletePokemon(id);
    });
    
    setSelectedItems([]);
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(filteredPokemon.map(item => item.id));
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const getStatusColor = (inStock: boolean) => {
    return inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          Delete Item
        </h3>
        
        <p className="text-sm text-gray-600 text-center mb-6">
          Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowConfirmation(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center space-x-2">
              <Trash2 className="text-red-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Delete Items</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            {/* Header Stats */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Danger Zone</h3>
                  <p className="text-sm text-red-600">
                    Permanently delete items from your shop. This action cannot be undone.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">{filteredPokemon.length}</div>
                  <div className="text-sm text-red-600">Items available</div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                    />
                  </div>
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                >
                  <option value="all">All Items</option>
                  <option value="inStock">In Stock</option>
                  <option value="outOfStock">Out of Stock</option>
                </select>

                {selectedItems.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                  >
                    Delete Selected ({selectedItems.length})
                  </button>
                )}
              </div>
            </div>

            {/* Bulk Actions */}
            {filteredPokemon.length > 0 && (
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={selectAll}
                    className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAll}
                    className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  {selectedItems.length} of {filteredPokemon.length} items selected
                </div>
              </div>
            )}

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPokemon.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
                    selectedItems.includes(item.id) ? 'ring-2 ring-red-500 bg-red-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.inStock)}`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-gray-900">
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.type?.slice(0, 2).map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteSingle(item)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer text-sm"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPokemon.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>

          {/* Confirmation Modal */}
          {showConfirmation && <ConfirmationModal />}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
