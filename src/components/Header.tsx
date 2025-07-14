"use client";

import { ShoppingCart, User, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Login } from "@/components/Login";
import { useState, useEffect, useRef } from "react";

export function Header() {
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "bg-black text-white shadow-lg"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-xl">PokéMart</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-lg hover:underline">
              Home
            </Link>
            <Link href="/shop" className="text-lg hover:underline">
              Shop
            </Link>
            <Link href="/about" className="text-lg hover:underline">
              About
            </Link>
            <Link href="/contact" className="text-lg hover:underline">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Cart */}
            <div className="relative">
              <Link href="/cart" className="relative">
                <ShoppingCart size={28} />
                {itemCount > 0 && (
                  <span
                    className={cn(
                      "absolute top-0 right-0 inline-flex items-center",
                      "justify-center px-2 py-1 text-xs font-bold leading-none",
                      "text-red-100 bg-red-600 rounded-full",
                      "transform translate-x-1/2 -translate-y-1/2"
                    )}
                  >
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 hover:bg-gray-800 px-3 py-2 rounded-md transition-colors"
                >
                  <User size={24} />
                  <span className="hidden md:block">{user?.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {user?.isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={16} className="mr-3" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
              >
                <User size={20} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </header>
  );
}
