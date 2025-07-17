"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Pokemon } from '@/types';
import { mockPokemon } from '@/data/pokemon';

interface PokemonContextType {
  pokemon: Pokemon[];
  addPokemon: (newPokemon: Omit<Pokemon, 'id'>) => void;
  updatePokemon: (id: string, updatedPokemon: Partial<Pokemon>) => void;
  deletePokemon: (id: string) => void;
  toggleStock: (id: string) => void;
  updateStockQuantity: (id: string, quantity: number) => void;
  resetToDefaults: () => void;
  featuredPokemon: Pokemon[];
  loading: boolean;
  refreshPokemon: () => void;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export function PokemonProvider({ children }: { children: ReactNode }) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  // Extract loadPokemon function to make it reusable
  const loadPokemon = async () => {
    try {
      // Try to load from API first
      const response = await fetch('/api/pokemon');
      if (response.ok) {
        const data = await response.json();
        setPokemon(data);
      } else {
        // Fallback to mock data if API fails
        setPokemon(mockPokemon);
      }
    } catch (error) {
      // Fallback to mock data if API fails
      setPokemon(mockPokemon);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPokemon();
  }, []);

  const refreshPokemon = useCallback(() => {
    loadPokemon();
  }, []);


  const addPokemon = (newPokemon: Omit<Pokemon, 'id'>) => {
    const maxId = Math.max(...pokemon.map(p => parseInt(p.id)), 0);
    const pokemonWithId: Pokemon = {
      ...newPokemon,
      id: (maxId + 1).toString()
    };
    
    setPokemon(prev => [...prev, pokemonWithId]);
  };

  const updatePokemon = (id: string, updatedPokemon: Partial<Pokemon>) => {
    setPokemon(prev => 
      prev.map(p => p.id === id ? { ...p, ...updatedPokemon } : p)
    );
  };

  const toggleStock = async (id: string) => {
    // Find the pokemon to get its current state
    const pokemonToUpdate = pokemon.find(p => p.id === id);
    if (!pokemonToUpdate) {
      return;
    }

    const newInStockValue = !pokemonToUpdate.inStock;

    // Update locally first for immediate UI feedback
    setPokemon(prev => 
      prev.map(p => p.id === id ? { ...p, inStock: newInStockValue } : p)
    );

    try {
      // Persist to database using the individual Pokemon endpoint
      const response = await fetch(`/api/pokemon/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inStock: newInStockValue,
        }),
      });

      if (!response.ok) {
        // If API call fails, revert the local state
        setPokemon(prev => 
          prev.map(p => p.id === id ? { ...p, inStock: pokemonToUpdate.inStock } : p)
        );
        alert('Failed to update stock status. Please try again.');
      } else {
        // Update with the response data to ensure consistency
        const updatedPokemon = await response.json();
        setPokemon(prev => 
          prev.map(p => p.id === id ? updatedPokemon : p)
        );
      }
    } catch (error) {
      // If API call fails, revert the local state
      setPokemon(prev => 
        prev.map(p => p.id === id ? { ...p, inStock: pokemonToUpdate.inStock } : p)
      );
      alert('Network error. Please check your connection and try again.');
    }
  };

  const deletePokemon = (id: string) => {
    setPokemon(prev => prev.filter(p => p.id !== id));
  };

  const updateStockQuantity = async (id: string, quantity: number) => {
    // Find the pokemon to get its current state
    const pokemonToUpdate = pokemon.find(p => p.id === id);
    if (!pokemonToUpdate) {
      return;
    }

    // Determine if item should be in stock based on quantity
    const newInStockValue = quantity > 0;

    // Update locally first for immediate UI feedback
    setPokemon(prev => 
      prev.map(p => p.id === id ? { ...p, stock_quantity: quantity, inStock: newInStockValue } : p)
    );

    try {
      // Persist to database using the individual Pokemon endpoint
      const response = await fetch(`/api/pokemon/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock_quantity: quantity,
          inStock: newInStockValue,
        }),
      });

      if (!response.ok) {
        // If API call fails, revert the local state
        setPokemon(prev => 
          prev.map(p => p.id === id ? { ...p, stock_quantity: pokemonToUpdate.stock_quantity, inStock: pokemonToUpdate.inStock } : p)
        );
        alert('Failed to update stock quantity. Please try again.');
      } else {
        // Update with the response data to ensure consistency
        const updatedPokemon = await response.json();
        setPokemon(prev => 
          prev.map(p => p.id === id ? updatedPokemon : p)
        );
      }
    } catch (error) {
      // If API call fails, revert the local state
      setPokemon(prev => 
        prev.map(p => p.id === id ? { ...p, stock_quantity: pokemonToUpdate.stock_quantity, inStock: pokemonToUpdate.inStock } : p)
      );
      alert('Network error. Please check your connection and try again.');
    }
  };

  const resetToDefaults = () => {
    setPokemon(mockPokemon);
  };

  const featuredPokemon = pokemon.filter(p => p.featured && !p.hidden);

  const value: PokemonContextType = {
    pokemon,
    addPokemon,
    updatePokemon,
    deletePokemon,
    toggleStock,
    updateStockQuantity,
    resetToDefaults,
    featuredPokemon,
    loading,
    refreshPokemon
  };

  return (
    <PokemonContext.Provider value={value}>
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemon() {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemon must be used within a PokemonProvider');
  }
  return context;
}
