"use client";

import { useState, useEffect } from 'react';
import { X, TrendingUp, BarChart3, DollarSign, Users, Package, ShoppingCart, Calendar, Star, Activity, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePokemon } from '@/context/PokemonContext';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  avgOrderValue: number;
  conversionRate: number;
  topSellingPokemon: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
    image: string;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  typeDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  priceRanges: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  salesTrends: {
    dailyGrowth: number;
    weeklyGrowth: number;
    monthlyGrowth: number;
  };
}

export function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
  const { pokemon } = usePokemon();
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'products' | 'trends'>('overview');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Generate analytics data based on current pokemon
      const generateAnalytics = (): AnalyticsData => {
        const totalRevenue = 45230.75;
        const totalOrders = 1247;
        const totalUsers = 892;
        
        // Generate top selling pokemon from current pokemon data
        const topSellingPokemon = pokemon.slice(0, 5).map((p, index) => ({
          id: p.id,
          name: p.name,
          sales: Math.floor(Math.random() * 100) + 20,
          revenue: Math.floor(p.price * (Math.random() * 50 + 10)),
          image: p.image
        }));

        // Generate revenue by month
        const revenueByMonth = [
          { month: 'Jan', revenue: 3500, orders: 98 },
          { month: 'Feb', revenue: 4200, orders: 115 },
          { month: 'Mar', revenue: 3800, orders: 102 },
          { month: 'Apr', revenue: 4500, orders: 128 },
          { month: 'May', revenue: 5200, orders: 145 },
          { month: 'Jun', revenue: 4800, orders: 135 },
          { month: 'Jul', revenue: 5500, orders: 158 },
          { month: 'Aug', revenue: 6200, orders: 172 },
          { month: 'Sep', revenue: 5800, orders: 165 },
          { month: 'Oct', revenue: 6500, orders: 185 },
          { month: 'Nov', revenue: 7200, orders: 205 },
          { month: 'Dec', revenue: 8000, orders: 225 }
        ];

        // Generate type distribution
        const typeCount: { [key: string]: number } = {};
        pokemon.forEach(p => {
          p.type?.forEach(type => {
            typeCount[type] = (typeCount[type] || 0) + 1;
          });
        });

        const typeDistribution = Object.entries(typeCount)
          .map(([type, count]) => ({
            type,
            count,
            percentage: (count / pokemon.length) * 100
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8);

        // Generate price ranges
        const priceRanges = [
          { range: '$0-$99', count: pokemon.filter(p => p.price < 100).length, percentage: 0 },
          { range: '$100-$199', count: pokemon.filter(p => p.price >= 100 && p.price < 200).length, percentage: 0 },
          { range: '$200-$299', count: pokemon.filter(p => p.price >= 200 && p.price < 300).length, percentage: 0 },
          { range: '$300-$399', count: pokemon.filter(p => p.price >= 300 && p.price < 400).length, percentage: 0 },
          { range: '$400+', count: pokemon.filter(p => p.price >= 400).length, percentage: 0 }
        ];

        priceRanges.forEach(range => {
          range.percentage = (range.count / pokemon.length) * 100;
        });

        return {
          totalRevenue,
          totalOrders,
          totalUsers,
          avgOrderValue: totalRevenue / totalOrders,
          conversionRate: 3.2,
          topSellingPokemon,
          revenueByMonth,
          typeDistribution,
          priceRanges,
          salesTrends: {
            dailyGrowth: 2.4,
            weeklyGrowth: 8.7,
            monthlyGrowth: 15.3
          }
        };
      };

      setAnalytics(generateAnalytics());
    }
  }, [isOpen, pokemon]);

  if (!isOpen || !analytics) return null;

  const StatCard = ({ icon: Icon, title, value, change, color }: {
    icon: any;
    title: string;
    value: string;
    change: string;
    color: string;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-1">
            {change.startsWith('+') ? (
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <p className={`text-sm ${color}`}>{change}</p>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color === 'text-green-600' ? 'bg-green-100' : 'bg-blue-100'}`}>
          <Icon size={24} className={color === 'text-green-600' ? 'text-green-600' : 'text-blue-600'} />
        </div>
      </div>
    </div>
  );

  const SimpleChart = ({ data, title }: { data: any[], title: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.month || item.type || item.range}</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(item.percentage || (item.revenue / 8000) * 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900">
                {item.revenue ? `$${item.revenue}` : item.count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`$${analytics.totalRevenue.toLocaleString()}`}
          change="+15.3%"
          color="text-green-600"
        />
        <StatCard
          icon={ShoppingCart}
          title="Total Orders"
          value={analytics.totalOrders.toString()}
          change="+8.7%"
          color="text-blue-600"
        />
        <StatCard
          icon={Users}
          title="Total Users"
          value={analytics.totalUsers.toString()}
          change="+12.4%"
          color="text-green-600"
        />
        <StatCard
          icon={BarChart3}
          title="Avg Order Value"
          value={`$${analytics.avgOrderValue.toFixed(2)}`}
          change="+2.1%"
          color="text-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart data={analytics.revenueByMonth.slice(-6)} title="Revenue by Month" />
        <SimpleChart data={analytics.typeDistribution} title="Pokemon Types Distribution" />
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">+{analytics.salesTrends.dailyGrowth}%</div>
            <div className="text-sm text-gray-600">Daily Growth</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">+{analytics.salesTrends.weeklyGrowth}%</div>
            <div className="text-sm text-gray-600">Weekly Growth</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">+{analytics.salesTrends.monthlyGrowth}%</div>
            <div className="text-sm text-gray-600">Monthly Growth</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Breakdown</h3>
        <div className="space-y-3">
          {analytics.revenueByMonth.map((month, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900">{month.month}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">${month.revenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">{month.orders} orders</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Pokemon</h3>
        <div className="space-y-4">
          {analytics.topSellingPokemon.map((pokemon, index) => (
            <div key={pokemon.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{pokemon.name}</div>
                  <div className="text-sm text-gray-600">{pokemon.sales} sales</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">${pokemon.revenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">revenue</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SimpleChart data={analytics.priceRanges} title="Price Range Distribution" />
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-3xl font-bold text-blue-600">{analytics.conversionRate}%</div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
            <div className="text-xs text-green-600 mt-1">+0.3% from last month</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">{pokemon.length}</div>
            <div className="text-sm text-gray-600">Total Pokemon</div>
            <div className="text-xs text-green-600 mt-1">+{pokemon.length - 8} new this month</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Status</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">In Stock</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">{pokemon.filter(p => p.inStock).length}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Out of Stock</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="font-medium">{pokemon.filter(p => !p.inStock).length}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Featured</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="font-medium">{pokemon.filter(p => p.featured).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
              <TrendingUp className="text-green-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b">
            <nav className="flex px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'sales', label: 'Sales', icon: DollarSign },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'trends', label: 'Trends', icon: TrendingUp }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'sales' && renderSales()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'trends' && renderTrends()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
