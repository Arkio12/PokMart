"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Calendar,
  Star,
  Trash2,
  Archive,
  RotateCcw,
  Clock,
  User,
  RefreshCw,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { AddPokemonModal } from "@/components/AddPokemonModal";
import { AnalyticsModal } from "@/components/AnalyticsModal";
import { ManageUsersModal } from "@/components/ManageUsersModal";
import { DeleteItemModal } from "@/components/DeleteItemModal";
import { InventoryModal } from "@/components/InventoryModal";
import { usePokemon } from "@/context/PokemonContext";
import { useAuth } from "@/context/AuthContext";
import { Pokemon } from "@/types";
import { OrderWithDetails } from "@/lib/supabase";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalPokemon: number;
  avgOrderValue: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    date: string;
    timeAgo: string;
  }>;
  topPokemon: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  salesTrends: {
    dailyGrowth: number;
    weeklyGrowth: number;
    monthlyGrowth: number;
  };
  ordersByStatus: { [key: string]: number };
  inventoryStatus: {
    inStock: number;
    outOfStock: number;
    featured: number;
    total: number;
  };
  lastUpdated: string;
}

interface LatestCheckoutUser {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  total: number;
  status: string;
  itemCount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  checkedOutAt: string;
  timeAgo: string;
}

export default function AdminDashboard() {
  const { pokemon, addPokemon, resetToDefaults } = usePokemon();
  const { user } = useAuth();
  const [isAddPokemonModalOpen, setIsAddPokemonModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isManageUsersModalOpen, setIsManageUsersModalOpen] = useState(false);
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [isRealTimeData, setIsRealTimeData] = useState(false);
  const [latestCheckoutUser, setLatestCheckoutUser] = useState<LatestCheckoutUser | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);


  // Function to fetch latest checkout user
  const fetchLatestCheckoutUser = async () => {
    try {
      setCheckoutLoading(true);
      console.log('Fetching latest checkout user...');
      const response = await fetch('/api/latest-checkout');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Latest checkout API Response:', data);
      
      if (data.success && data.latestCheckout) {
        setLatestCheckoutUser(data.latestCheckout);
        console.log('Updated latest checkout user:', data.latestCheckout);
      } else {
        console.log('No recent checkout found');
        setLatestCheckoutUser(null);
      }
    } catch (error) {
      console.error('Error fetching latest checkout user:', error);
      setLatestCheckoutUser(null);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Function to fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      console.log('Fetching dashboard analytics...');
      const response = await fetch('/api/analytics');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Analytics API Response:', result);
      
      if (result.success && result.data) {
        const analyticsData = result.data;
        
        // Transform analytics data to dashboard stats format
        const dashboardStats: DashboardStats = {
          totalRevenue: analyticsData.totalRevenue,
          totalOrders: analyticsData.totalOrders,
          totalUsers: analyticsData.totalUsers,
          totalPokemon: analyticsData.inventoryStatus?.total || pokemon.length,
          avgOrderValue: analyticsData.avgOrderValue,
          recentOrders: analyticsData.recentOrders.slice(0, 3),
          topPokemon: analyticsData.topSellingPokemon.slice(0, 3),
          salesTrends: analyticsData.salesTrends,
          ordersByStatus: analyticsData.ordersByStatus,
          inventoryStatus: analyticsData.inventoryStatus,
          lastUpdated: analyticsData.lastUpdated
        };
        
        setStats(dashboardStats);
        setIsRealTimeData(true);
        console.log('Updated dashboard with real-time analytics data');
      }
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      // Set fallback stats if API fails
      const fallbackStats: DashboardStats = {
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalPokemon: pokemon.length,
        avgOrderValue: 0,
        recentOrders: [],
        topPokemon: [],
        salesTrends: { dailyGrowth: 0, weeklyGrowth: 0, monthlyGrowth: 0 },
        ordersByStatus: {},
        inventoryStatus: { inStock: 0, outOfStock: 0, featured: 0, total: pokemon.length },
        lastUpdated: new Date().toISOString()
      };
      setStats(fallbackStats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
      fetchLatestCheckoutUser();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Update total Pokemon count when pokemon array changes
  useEffect(() => {
    if (stats) {
      setStats(prev => prev ? ({
        ...prev,
        totalPokemon: pokemon.length
      }) : null);
    }
  }, [pokemon, stats]);

  const handleAddPokemon = (newPokemon: Omit<Pokemon, 'id'>) => {
    addPokemon(newPokemon);
    // You could add a toast notification here
    console.log('Pokemon added successfully:', newPokemon.name);
  };

  const StatCard = ({ icon: Icon, title, value, change, color }: {
    icon: any;
    title: string;
    value: string;
    change: string;
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-sm border"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm ${color}`}>{change}</p>
        </div>
        <div className={`p-3 rounded-full ${color === 'text-green-600' ? 'bg-green-100' : 'bg-blue-100'}`}>
          <Icon size={24} className={color === 'text-green-600' ? 'text-green-600' : 'text-blue-600'} />
        </div>
      </div>
    </motion.div>
  );

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {user && (
            <p className="text-sm text-gray-600 mt-1">Welcome back, {user.name || 'User'}!</p>
          )}
          {stats?.lastUpdated && (
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <Clock size={12} className="mr-1" />
              Last updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <div className="flex flex-col items-end space-y-3">
          <div className="flex items-center space-x-4">
            {/* Real-time Data Indicator */}
            {isRealTimeData && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">Live Data</span>
                <Activity size={16} className="text-green-600" />
              </div>
            )}
            
            {/* Refresh Button */}
            <button
              onClick={fetchAnalyticsData}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>Today: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change="+12.5% from last month"
          color="text-green-600"
        />
        <StatCard
          icon={ShoppingCart}
          title="Total Orders"
          value={stats.totalOrders.toString()}
          change="+8.2% from last month"
          color="text-blue-600"
        />
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats.totalUsers.toString()}
          change="+15.3% from last month"
          color="text-green-600"
        />
        <StatCard
          icon={Package}
          title="Total Pokemon"
          value={stats.totalPokemon.toString()}
          change="+3 new this month"
          color="text-blue-600"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Top Pokemon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Pokemon</h2>
            <Star size={20} className="text-gray-500" />
          </div>
          <div className="space-y-3">
            {stats.topPokemon.map((pokemon, index) => (
              <div key={pokemon.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{pokemon.name}</p>
                    <p className="text-sm text-gray-600">{pokemon.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${pokemon.revenue}</p>
                  <p className="text-sm text-gray-600">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Latest Checkout User */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white p-6 rounded-lg shadow-sm border"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">Latest Checkout User</h2>
            {latestCheckoutUser && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-1 animate-pulse"></span>
                Recent Activity
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={20} className="text-gray-500" />
            <button
              onClick={fetchLatestCheckoutUser}
              disabled={checkoutLoading}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {checkoutLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {checkoutLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading latest checkout...</span>
          </div>
        ) : latestCheckoutUser ? (
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{latestCheckoutUser.user.name}</p>
                  <p className="text-sm text-gray-600">{latestCheckoutUser.user.email}</p>
                  <p className="text-xs text-blue-600 font-medium">{latestCheckoutUser.timeAgo}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${latestCheckoutUser.total.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{latestCheckoutUser.itemCount} item{latestCheckoutUser.itemCount !== 1 ? 's' : ''}</p>
                <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                  latestCheckoutUser.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  latestCheckoutUser.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {latestCheckoutUser.status}
                </span>
              </div>
            </div>

            {/* Items List */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Items Purchased:</h3>
              <div className="space-y-2">
                {latestCheckoutUser.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Qty: {item.quantity}</span>
                      <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No recent checkouts found</p>
            <p className="text-sm text-gray-500 mt-1">Latest checkout activity will appear here</p>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-sm border"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <button 
            onClick={() => setIsAddPokemonModalOpen(true)}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            <Package size={24} className="text-blue-600 mb-2" />
            <p className="font-medium text-blue-900">Add Pokemon</p>
          </button>
          <Link 
            href="/admin/analytics"
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative">
              <TrendingUp size={24} className="text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-green-900">Real-Time Analytics</p>
              <p className="text-xs text-green-600 mt-1">Live insights dashboard</p>
            </div>
          </Link>
          <button 
            onClick={() => setIsManageUsersModalOpen(true)}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
          >
            <Users size={24} className="text-purple-600 mb-2" />
            <p className="font-medium text-purple-900">Manage Users</p>
          </button>
          <button 
            onClick={() => setIsDeleteItemModalOpen(true)}
            className="p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 size={24} className="text-red-600 mb-2" />
            <p className="font-medium text-red-900">Delete Items</p>
          </button>
          <button 
            onClick={() => setIsInventoryModalOpen(true)}
            className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors cursor-pointer flex flex-col items-center justify-center"
          >
            <Archive size={24} className="text-yellow-600 mb-2" />
            <p className="font-medium text-yellow-900">Manage Stock</p>
          </button>
          <button 
            onClick={() => resetToDefaults()}
            className="p-4 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={24} className="text-pink-600 mb-2" />
            <p className="font-medium text-pink-900">Reset to Defaults</p>
          </button>
        </div>
      </motion.div>

      {/* Add Pokemon Modal */}
      <AddPokemonModal
        isOpen={isAddPokemonModalOpen}
        onClose={() => setIsAddPokemonModalOpen(false)}
        onAddPokemon={handleAddPokemon}
      />

      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />

      {/* Manage Users Modal */}
      <ManageUsersModal
        isOpen={isManageUsersModalOpen}
        onClose={() => setIsManageUsersModalOpen(false)}
      />

      {/* Delete Item Modal */}
      <DeleteItemModal
        isOpen={isDeleteItemModalOpen}
        onClose={() => setIsDeleteItemModalOpen(false)}
      />

      {/* Inventory Modal */}
      <InventoryModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
      />
    </div>
  );
}
