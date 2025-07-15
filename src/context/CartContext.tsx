"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem, Pokemon } from '@/types';
import { generateId } from '@/lib/utils';
import { useAuth } from './AuthContext';
import { saveCartToDatabase, loadCartFromDatabase } from '@/lib/cartApi';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Pokemon }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_ITEMS'; payload: CartItem[] };

interface CartContextType extends CartState {
  addItem: (pokemon: Pokemon) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.pokemon.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.pokemon.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        };
      } else {
        const newItem: CartItem = {
          id: generateId(),
          pokemon: action.payload,
          quantity: 1,
        };
        const updatedItems = [...state.items, newItem];
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };
    
    case 'LOAD_ITEMS': {
      const items = action.payload;
      return {
        ...state,
        items,
        total: calculateTotal(items),
        itemCount: calculateItemCount(items),
      };
    }
    
    default:
      return state;
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + (item.pokemon.price * item.quantity), 0);
}

function calculateItemCount(items: CartItem[]): number {
  return items.length;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      console.log('Loading cart for user:', user.id);
      loadCartFromDatabase(user.id).then(items => {
        console.log('Loaded cart items:', items);
        dispatch({ type: 'LOAD_ITEMS', payload: items });
      }).catch(error => {
        console.error('Error loading cart:', error);
      });
    } else {
      // Clear cart when user logs out
      console.log('Clearing cart - user logged out');
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      saveCartToDatabase(user.id, state.items);
    }
  }, [state.items, user]);

  const addItem = (pokemon: Pokemon) => {
    if (!user) {
      alert('Please log in to add items to your cart');
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: pokemon });
  };

  const removeItem = (id: string) => {
    if (!user) return;
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (!user) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    if (user) {
      saveCartToDatabase(user.id, []);
    }
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
