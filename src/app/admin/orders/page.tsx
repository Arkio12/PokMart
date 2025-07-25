"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  RefreshCw,
  X
} from "lucide-react";
import { motion } from "framer-motion";

import { OrderWithDetails } from '@/lib/supabase';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
  shippingAddress: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [lastFetch, setLastFetch] = useState(Date.now());
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders?_t=' + Date.now()); // Cache busting
      const { orders } = await response.json();

      const formattedOrders = orders.map((order: OrderWithDetails) => ({
        id: order.id,
        customerName: order.user.name,
        customerEmail: order.user.email,
        total: order.total,
        status: order.status,
        items: order.items.map(item => ({
          name: item.pokemon.name,
          quantity: item.quantity,
          price: item.price
        })),
        createdAt: order.created_at,
        shippingAddress: '', // Add proper shipping address if available
      }));

      setOrders(formattedOrders);
      setLoading(false);
      setLastFetch(Date.now());
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, []);

  // Auto-refresh every 1 second to get real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 1000); // Refresh every 1 second

    return () => clearInterval(interval);
  }, []);

  // Check for orders older than 6 months and auto-delete them
  useEffect(() => {
    if (orders.length > 0) {
      checkAndDeleteOldOrders();
    }
  }, [orders]);

  // Manual refresh function
  const handleRefresh = () => {
    setLoading(true);
    fetchOrders();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'highest':
        return b.total - a.total;
      case 'lowest':
        return a.total - b.total;
      default:
        return 0;
    }
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Optimistically update the UI
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ));

      // Update the database
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh the orders after successful update
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      // Revert the optimistic update on error
      await fetchOrders();
    }
  };

  // Auto-delete orders older than 6 months
  const checkAndDeleteOldOrders = async () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const ordersToDelete = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate < sixMonthsAgo;
    });
    
    if (ordersToDelete.length > 0) {
      console.log(`Auto-deleting ${ordersToDelete.length} orders older than 6 months`);
      
      for (const order of ordersToDelete) {
        try {
          await fetch(`/api/orders/${order.id}`, {
            method: 'DELETE',
          });
        } catch (error) {
          console.error(`Failed to delete order ${order.id}:`, error);
        }
      }
      
      // Refresh orders after deletion
      await fetchOrders();
    }
  };

  const handleView = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowViewModal(true);
    }
  };

  const handleDelete = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const isConfirmed = confirm(`Are you sure you want to delete this order?\n\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nTotal: $${order.total.toFixed(2)}\n\nThis action cannot be undone.`);
      
      if (isConfirmed) {
        try {
          const response = await fetch(`/api/orders/${orderId}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            throw new Error('Failed to delete order');
          }
          
          // Remove from local state
          setOrders(orders.filter(o => o.id !== orderId));
          
          // Refresh orders
          await fetchOrders();
        } catch (error) {
          console.error('Error deleting order:', error);
          alert('Failed to delete order. Please try again.');
        }
      }
    }
  };

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {new Date(lastFetch).toLocaleTimeString()} • Auto-refreshing every 1 second
          </p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={handleRefresh}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download size={16} />
            <span>Export Orders</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'processing').length}
              </p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Sort */}
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ color: 'black' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-black">{order.customerName}</div>
                    <div className="text-sm text-black">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-black">
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-sm px-2 py-1 rounded-full border-0 ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleView(order.id)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(order.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {sortedOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Clear Filters
          </button>
        </div>
      )}

      {/* Order Details Modal */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Order Info */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                  <p className="text-sm text-black bg-gray-50 px-3 py-2 rounded-lg">{selectedOrder.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <p className="text-sm text-black bg-gray-50 px-3 py-2 rounded-lg">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <p className="text-sm text-black bg-gray-50 px-3 py-2 rounded-lg">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-sm text-black bg-gray-50 px-3 py-2 rounded-lg">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                  <p className="text-sm text-black bg-gray-50 px-3 py-2 rounded-lg font-semibold">
                    ${selectedOrder.total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedOrder.status)}
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Items Ordered</label>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-black">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-black">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-green-600">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleDelete(selectedOrder.id);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Order
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
