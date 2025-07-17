"use client";

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Cart() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const { user, isLoading: authLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to proceed with checkout');
      return;
    }

    setIsProcessing(true);
    setCheckoutError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          items: items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.insufficientStock) {
          setCheckoutError(`Insufficient stock for ${data.item}. Available: ${data.available}, Requested: ${data.requested}`);
        } else {
          setCheckoutError(data.error || 'Checkout failed');
        }
        return;
      }

      // Checkout successful
      setCheckoutSuccess(true);
      clearCart();
      
      // Show success message
      alert(`Checkout successful! Order total: ${formatPrice(data.total)}\n\nStock updated for ${data.itemsUpdated} items.`);
      
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🔄</div>
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your cart</p>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your cart</p>
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some Pokemon to get started!</p>
          <Link 
            href="/shop" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-8 text-white"
        >
          Shopping Cart 🛒
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4"
                >
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg">
                    <Image
                      src={item.pokemon.image}
                      alt={item.pokemon.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex-1 text-black">
                    <h3 className="font-bold text-lg">{item.pokemon.name}</h3>
                    <p className="text-gray-600">{formatPrice(item.pokemon.price)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer text-black"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium text-black">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer text-black"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-black">
                      {formatPrice(item.pokemon.price * item.quantity)}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors mt-1 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6"
            >
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 transition-colors font-medium cursor-pointer"
              >
                Clear Cart
              </button>
            </motion.div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6 sticky top-20"
            >
              <h3 className="text-xl font-bold mb-4 text-black">Order Summary</h3>
              
              <div className="space-y-2 mb-4 text-black">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="text-green-600">Free</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {checkoutError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p className="text-sm">{checkoutError}</p>
                </div>
              )}
              
              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <Link 
                href="/shop" 
                className="block w-full text-center bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
