"use client";

import { useState, useEffect, useCallback } from 'react';
import { X, Users, Search, Filter, UserPlus, Edit3, Trash2, Shield, ShieldCheck, Mail, Calendar, ShoppingCart, Ban, CheckCircle, AlertCircle, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface ManageUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'banned';
  joinDate: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
  avatar?: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  bannedUsers: number;
  adminUsers: number;
}

export function ManageUsersModal({ isOpen, onClose }: ManageUsersModalProps) {
  const { getAllUsers, updateUser, deleteUser, banUser, unbanUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'banned'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user' | 'moderator'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    bannedUsers: 0,
    adminUsers: 0
  });

  const loadUsers = useCallback(() => {
    const authUsers = getAllUsers();
    setUsers(authUsers);
    setFilteredUsers(authUsers);

    // Calculate stats
    const newStats: UserStats = {
      totalUsers: authUsers.length,
      activeUsers: authUsers.filter(u => u.status === 'active').length,
      newUsersThisMonth: authUsers.filter(u => new Date(u.joinDate).getMonth() === new Date().getMonth()).length,
      bannedUsers: authUsers.filter(u => u.status === 'banned').length,
      adminUsers: authUsers.filter(u => u.role === 'admin').length
    };
    setStats(newStats);
  }, [getAllUsers]);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, loadUsers]);

  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, statusFilter, roleFilter, users]);

  const handleUserAction = (userId: string, action: 'ban' | 'unban' | 'activate' | 'deactivate' | 'delete' | 'makeAdmin' | 'makeUser') => {
    switch (action) {
      case 'ban':
        banUser(userId);
        break;
      case 'unban':
        unbanUser(userId);
        break;
      case 'activate':
        updateUser(userId, { status: 'active' });
        break;
      case 'deactivate':
        updateUser(userId, { status: 'inactive' });
        break;
      case 'makeAdmin':
        updateUser(userId, { role: 'admin' });
        break;
      case 'makeUser':
        updateUser(userId, { role: 'user' });
        break;
      case 'delete':
        deleteUser(userId);
        break;
    }
    // Refresh the user list after any action
    loadUsers();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'banned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }: {
    icon: any;
    title: string;
    value: number;
    color: string;
  }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );

  const UserDetailsModal = ({ user, onClose }: { user: User; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">User Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{user.name}</h4>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                {user.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Join Date</p>
              <p className="font-medium text-black">{new Date(user.joinDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Login</p>
              <p className="font-medium text-black">{new Date(user.lastLogin).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="font-medium text-black">{user.totalOrders ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="font-medium text-black">${(user.totalSpent ?? 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const DeleteConfirmModal = ({ user, onClose, onConfirm }: { user: User; onClose: () => void; onConfirm: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-red-600">Delete User</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <Trash2 size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{user.name}</h4>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This action cannot be undone. Deleting this user will permanently remove:
            </p>
            <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
              <li>User account and profile</li>
              <li>Order history ({user.totalOrders} orders)</li>
              <li>All associated data</li>
            </ul>
          </div>

          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong>{user.name}</strong>?
          </p>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
            >
              Delete User
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (!isOpen) return null;

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
              <Users className="text-purple-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Manage Users</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <StatCard
                icon={Users}
                title="Total Users"
                value={stats.totalUsers}
                color="bg-blue-500"
              />
              <StatCard
                icon={CheckCircle}
                title="Active Users"
                value={stats.activeUsers}
                color="bg-green-500"
              />
              <StatCard
                icon={UserPlus}
                title="New This Month"
                value={stats.newUsersThisMonth}
                color="bg-purple-500"
              />
              <StatCard
                icon={Ban}
                title="Banned Users"
                value={stats.bannedUsers}
                color="bg-red-500"
              />
              <StatCard
                icon={Shield}
                title="Admins"
                value={stats.adminUsers}
                color="bg-yellow-500"
              />
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    />
                  </div>
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </select>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Spent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.totalOrders ?? 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${(user.totalSpent ?? 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserDetails(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer"
                              title="View Details"
                            >
                              <AlertCircle size={16} />
                            </button>
                            
                            {user.status === 'banned' ? (
                              <button
                                onClick={() => handleUserAction(user.id, 'unban')}
                                className="text-green-600 hover:text-green-800 cursor-pointer"
                                title="Unban User"
                              >
                                <CheckCircle size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserAction(user.id, 'ban')}
                                className="text-red-600 hover:text-red-800 cursor-pointer"
                                title="Ban User"
                              >
                                <Ban size={16} />
                              </button>
                            )}

                            {user.role === 'admin' ? (
                              <button
                                onClick={() => handleUserAction(user.id, 'makeUser')}
                                className="text-purple-600 hover:text-purple-800 cursor-pointer"
                                title="Remove Admin"
                              >
                                <Shield size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserAction(user.id, 'makeAdmin')}
                                className="text-purple-600 hover:text-purple-800 cursor-pointer"
                                title="Make Admin"
                              >
                                <ShieldCheck size={16} />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setUserToDelete(user);
                                setShowDeleteConfirm(true);
                              }}
                              className="text-red-600 hover:text-red-800 cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>

          {/* User Details Modal */}
          {showUserDetails && selectedUser && (
            <UserDetailsModal
              user={selectedUser}
              onClose={() => {
                setShowUserDetails(false);
                setSelectedUser(null);
              }}
            />
          )}

          {/* Delete Confirm Modal */}
          {showDeleteConfirm && userToDelete && (
            <DeleteConfirmModal
              user={userToDelete}
              onClose={() => {
                setShowDeleteConfirm(false);
                setUserToDelete(null);
              }}
              onConfirm={() => {
                if (userToDelete) {
                  handleUserAction(userToDelete.id, 'delete');
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }
              }}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
