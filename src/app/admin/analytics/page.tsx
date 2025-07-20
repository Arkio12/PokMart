"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  BarChart3, 
  ShoppingCart,
  Package,
  Activity,
  RefreshCw,
  Clock,
  ArrowUp,
  ArrowDown,
  Star,
  Calendar,
  Eye,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

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
  priceRangeData: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  salesTrends: {
    dailyGrowth: number;
    weeklyGrowth: number;
    monthlyGrowth: number;
  };
  ordersByStatus: { [key: string]: number };
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    date: string;
    timeAgo: string;
  }>;
  inventoryStatus: {
    inStock: number;
    outOfStock: number;
    featured: number;
    total: number;
  };
  lastUpdated: string;
}

function AnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'products' | 'inventory'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchAnalyticsData = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await fetch('/api/analytics');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Analytics fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Auto-refresh every 30 seconds when enabled
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchAnalyticsData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = () => {
    fetchAnalyticsData(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Failed to load analytics data</p>
          <button 
            onClick={() => fetchAnalyticsData()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const StatCard = ({ icon: Icon, title, value, change, color, trend }: {
    icon: any;
    title: string;
    value: string;
    change?: string;
    color: string;
    trend?: 'up' | 'down';
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : trend === 'down' ? (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              ) : null}
              <p className={`text-sm ${color}`}>{change}</p>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${
          color.includes('green') ? 'bg-green-100' : 
          color.includes('blue') ? 'bg-blue-100' :
          color.includes('purple') ? 'bg-purple-100' :
          'bg-gray-100'
        }`}>
          <Icon size={24} className={`${
            color.includes('green') ? 'text-green-600' : 
            color.includes('blue') ? 'text-blue-600' :
            color.includes('purple') ? 'text-purple-600' :
            'text-gray-600'
          }`} />
        </div>
      </div>
    </motion.div>
  );

  const ProgressBar = ({ percentage, color = 'blue' }: { percentage: number; color?: string }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <motion.div 
        className={`h-2 rounded-full ${
          color === 'green' ? 'bg-green-500' :
          color === 'red' ? 'bg-red-500' :
          color === 'yellow' ? 'bg-yellow-500' :
          'bg-blue-500'
        }`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(percentage, 100)}%` }}
        transition={{ duration: 1, delay: 0.2 }}
      />
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`$${data.totalRevenue.toLocaleString()}`}
          change="+15.3% from last month"
          color="text-green-600"
          trend="up"
        />
        <StatCard
          icon={ShoppingCart}
          title="Total Orders"
          value={data.totalOrders.toString()}
          change="+8.7% from last month"
          color="text-blue-600"
          trend="up"
        />
        <StatCard
          icon={Users}
          title="Total Customers"
          value={data.totalUsers.toString()}
          change="+12.4% from last month"
          color="text-purple-600"
          trend="up"
        />
        <StatCard
          icon={BarChart3}
          title="Avg Order Value"
          value={`$${data.avgOrderValue.toFixed(2)}`}
          change="+2.1% from last month"
          color="text-blue-600"
          trend="up"
        />
      </div>

      {/* Sales Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="mr-2 text-green-600" size={20} />
          Sales Growth Trends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">+{data.salesTrends.dailyGrowth}%</div>
            <div className="text-sm text-gray-600 mt-1">Daily Growth</div>
            <ProgressBar percentage={data.salesTrends.dailyGrowth * 10} color="green" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">+{data.salesTrends.weeklyGrowth.toFixed(1)}%</div>
            <div className="text-sm text-gray-600 mt-1">Weekly Growth</div>
            <ProgressBar percentage={Math.abs(data.salesTrends.weeklyGrowth) * 2} color="blue" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">+{data.salesTrends.monthlyGrowth}%</div>
            <div className="text-sm text-gray-600 mt-1">Monthly Growth</div>
            <ProgressBar percentage={data.salesTrends.monthlyGrowth * 2} color="purple" />
          </div>
        </div>
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="mr-2 text-blue-600" size={20} />
          Recent Orders
          <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Live</span>
        </h3>
        <div className="space-y-3">
          {data.recentOrders.slice(0, 5).map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                  <p className="text-sm text-gray-600">{order.timeAgo}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderSales = () => (
    <div className="space-y-6">
      {/* Monthly Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="mr-2 text-blue-600" size={20} />
          Revenue by Month
        </h3>
        <div className="space-y-4">
          {data.revenueByMonth.map((month, index) => {
            const maxRevenue = Math.max(...data.revenueByMonth.map(m => m.revenue));
            const percentage = (month.revenue / maxRevenue) * 100;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  <div className="w-12">
                    <span className="font-medium text-gray-900">{month.month}</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <ProgressBar percentage={percentage} />
                  </div>
                </div>
                <div className="text-right min-w-0">
                  <div className="font-bold text-gray-900">${month.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{month.orders} orders</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Order Status Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Package className="mr-2 text-purple-600" size={20} />
          Orders by Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(data.ordersByStatus).map(([status, count], index) => {
            const percentage = (count / data.totalOrders) * 100;
            const getStatusColor = (status: string) => {
              switch (status) {
                case 'delivered': return 'green';
                case 'shipped': return 'blue';
                case 'processing': return 'yellow';
                case 'pending': return 'gray';
                default: return 'gray';
              }
            };
            
            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <div className={`text-2xl font-bold ${
                  getStatusColor(status) === 'green' ? 'text-green-600' :
                  getStatusColor(status) === 'blue' ? 'text-blue-600' :
                  getStatusColor(status) === 'yellow' ? 'text-yellow-600' :
                  'text-gray-600'
                }`}>
                  {count}
                </div>
                <div className="text-sm font-medium text-gray-900 capitalize mt-1">{status}</div>
                <div className="text-xs text-gray-600">{percentage.toFixed(1)}%</div>
                <div className="mt-2">
                  <ProgressBar percentage={percentage} color={getStatusColor(status)} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      {/* Top Selling Pokemon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Star className="mr-2 text-yellow-600" size={20} />
          Top Selling Pokemon
        </h3>
        <div className="space-y-4">
          {data.topSellingPokemon.map((pokemon, index) => (
            <motion.div
              key={pokemon.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
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
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pokemon Type Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Pokemon Type Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.typeDistribution.map((type, index) => (
            <motion.div
              key={type.type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="text-center p-4 bg-gray-50 rounded-lg"
            >
              <div className="text-xl font-bold text-blue-600">{type.count}</div>
              <div className="text-sm font-medium text-gray-900 capitalize">{type.type}</div>
              <div className="text-xs text-gray-600">{type.percentage.toFixed(1)}%</div>
              <div className="mt-2">
                <ProgressBar percentage={type.percentage} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      {/* Inventory Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={CheckCircle}
          title="In Stock"
          value={data.inventoryStatus.inStock.toString()}
          color="text-green-600"
        />
        <StatCard
          icon={XCircle}
          title="Out of Stock"
          value={data.inventoryStatus.outOfStock.toString()}
          color="text-red-600"
        />
        <StatCard
          icon={Star}
          title="Featured"
          value={data.inventoryStatus.featured.toString()}
          color="text-yellow-600"
        />
        <StatCard
          icon={Package}
          title="Total Pokemon"
          value={data.inventoryStatus.total.toString()}
          color="text-blue-600"
        />
      </div>

      {/* Price Range Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Price Range Distribution</h3>
        <div className="space-y-4">
          {data.priceRangeData.map((range, index) => (
            <motion.div
              key={range.range}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-20">
                  <span className="font-medium text-gray-900">{range.range}</span>
                </div>
                <div className="flex-1 mx-4">
                  <ProgressBar percentage={range.percentage} />
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">{range.count} items</div>
                <div className="text-sm text-gray-600">{range.percentage.toFixed(1)}%</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="mr-3 text-blue-600" size={32} />
            Real-Time Analytics
          </h1>
          <p className="text-gray-600 mt-2">Live insights and performance metrics</p>
          {data.lastUpdated && (
            <p className="text-sm text-gray-500 mt-1 flex items-center">
              <Clock size={14} className="mr-1" />
              Last updated: {formatTime(data.lastUpdated)}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Auto-refresh:</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoRefresh ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoRefresh ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Live Indicator */}
      {autoRefresh && (
        <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg w-fit">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-800">Live Data Active</span>
          <Zap size={16} className="text-green-600" />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <nav className="flex">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'sales', label: 'Sales', icon: DollarSign },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'inventory', label: 'Inventory', icon: Activity }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'sales' && renderSales()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'inventory' && renderInventory()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default AnalyticsPage;

