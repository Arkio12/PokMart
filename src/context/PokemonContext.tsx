"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pokemon } from '@/types';
import { mockPokemon } from '@/data/pokemon';

interface PokemonContextType {
  pokemon: Pokemon[];
  addPokemon: (newPokemon: Omit<Pokemon, 'id'>) => void;
  updatePokemon: (id: string, updatedPokemon: Partial<Pokemon>) => void;
  deletePokemon: (id: string) => void;
  toggleStock: (id: string) => void;
  featuredPokemon: Pokemon[];
  loading: boolean;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export function PokemonProvider({ children }: { children: ReactNode }) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial pokemon data
    const loadPokemon = async () => {
      try {
        // In a real app, this would be an API call
        setPokemon(mockPokemon);
      } catch (error) {
        console.error('Error loading pokemon:', error);
      } finally {
        setLoading(false);
      }
    };

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

  const toggleStock = (id: string) => {
    setPokemon(prev => 
      prev.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p)
    );
  };

  const deletePokemon = (id: string) => {
    setPokemon(prev => prev.filter(p => p.id !== id));
  };

  const featuredPokemon = pokemon.filter(p => p.featured);

  const value: PokemonContextType = {
    pokemon,
    addPokemon,
    updatePokemon,
    deletePokemon,
    toggleStock,
    featuredPokemon,
    loading
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
