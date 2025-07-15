"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { loadCartFromDatabase, saveCartToDatabase } from '@/lib/cartApi';

export function CartDebug() {
  const { user } = useAuth();
  const { items, total, itemCount } = useCart();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    if (user) {
      setDebugInfo(prev => ({
        ...prev,
        userId: user.id,
        userName: user.name,
        cartItemsCount: items.length,
        cartTotal: total,
        cartItemCount: itemCount
      }));
    }
  }, [user, items, total, itemCount]);

  const testLoadCart = async () => {
    if (!user) return;
    
    console.log('🧪 Testing cart load...');
    try {
      const loadedItems = await loadCartFromDatabase(user.id);
      console.log('🧪 Test load result:', loadedItems);
      setDebugInfo(prev => ({
        ...prev,
        testLoadResult: loadedItems,
        testLoadCount: loadedItems.length
      }));
    } catch (error) {
      console.error('🧪 Test load error:', error);
      setDebugInfo(prev => ({
        ...prev,
        testLoadError: error.message
      }));
    }
  };

  const testSaveCart = async () => {
    if (!user) return;
    
    console.log('🧪 Testing cart save...');
    try {
      await saveCartToDatabase(user.id, items);
      console.log('🧪 Test save completed');
      setDebugInfo(prev => ({
        ...prev,
        testSaveResult: 'Success',
        testSaveTime: new Date().toISOString()
      }));
    } catch (error) {
      console.error('🧪 Test save error:', error);
      setDebugInfo(prev => ({
        ...prev,
        testSaveError: error.message
      }));
    }
  };

  if (!user) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
        <strong>Cart Debug:</strong> Not logged in
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-50 max-w-md">
      <h3 className="font-bold mb-2">Cart Debug Info</h3>
      <div className="text-sm space-y-1">
        <p><strong>User:</strong> {user.name} ({user.id})</p>
        <p><strong>Cart Items:</strong> {items.length}</p>
        <p><strong>Total:</strong> ${total.toFixed(2)}</p>
        <p><strong>Item Count:</strong> {itemCount}</p>
        
        <div className="mt-2 space-x-2">
          <button 
            onClick={testLoadCart}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
          >
            Test Load
          </button>
          <button 
            onClick={testSaveCart}
            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
          >
            Test Save
          </button>
        </div>
        
        {debugInfo.testLoadCount !== undefined && (
          <p className="text-xs"><strong>Test Load:</strong> {debugInfo.testLoadCount} items</p>
        )}
        {debugInfo.testSaveResult && (
          <p className="text-xs"><strong>Test Save:</strong> {debugInfo.testSaveResult}</p>
        )}
        {debugInfo.testLoadError && (
          <p className="text-xs text-red-600"><strong>Load Error:</strong> {debugInfo.testLoadError}</p>
        )}
        {debugInfo.testSaveError && (
          <p className="text-xs text-red-600"><strong>Save Error:</strong> {debugInfo.testSaveError}</p>
        )}
      </div>
    </div>
  );
}
