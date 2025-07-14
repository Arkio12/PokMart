"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Calendar,
  Star,
  Activity,
  Trash2,
  Archive,
  RotateCcw
} from "lucide-react";
import { motion } from "framer-motion";
import { AddPokemonModal } from "@/components/AddPokemonModal";
import { AnalyticsModal } from "@/components/AnalyticsModal";
import { ManageUsersModal } from "@/components/ManageUsersModal";
import { DeleteItemModal } from "@/components/DeleteItemModal";
import { InventoryModal } from "@/components/InventoryModal";
import { usePokemon } from "@/context/PokemonContext";
import { Pokemon } from "@/types";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalPokemon: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    date: string;
  }>;
  topPokemon: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const { pokemon, addPokemon, resetToDefaults } = usePokemon();
  const [isAddPokemonModalOpen, setIsAddPokemonModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isManageUsersModalOpen, setIsManageUsersModalOpen] = useState(false);
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 12450.50,
    totalOrders: 156,
    totalUsers: 89,
    totalPokemon: pokemon.length,
    recentOrders: [
      { id: "1", customerName: "John Doe", total: 89.99, status: "shipped", date: "2024-01-15" },
      { id: "2", customerName: "Jane Smith", total: 45.50, status: "processing", date: "2024-01-14" },
      { id: "3", customerName: "Mike Johnson", total: 120.00, status: "delivered", date: "2024-01-13" },
    ],
    topPokemon: [
      { name: "Pikachu", sales: 25, revenue: 1250.00 },
      { name: "Charizard", sales: 18, revenue: 1800.00 },
      { name: "Blastoise", sales: 15, revenue: 1200.00 },
    ]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Update total Pokemon count when pokemon array changes
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      totalPokemon: pokemon.length
    }));
  }, [pokemon]);

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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Activity size={20} className="text-gray-500" />
          </div>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${order.total}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Pokemon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
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
          <button 
            onClick={() => setIsAnalyticsModalOpen(true)}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
          >
            <TrendingUp size={24} className="text-green-600 mb-2" />
            <p className="font-medium text-green-900">View Analytics</p>
          </button>
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
