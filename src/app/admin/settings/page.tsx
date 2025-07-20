"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  User, 
  Shield, 
  Store, 
  Bell, 
  Database, 
  Mail, 
  Lock, 
  Globe, 
  Palette, 
  Save, 
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  Trash2,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePokemon } from "@/context/PokemonContext";

interface SystemSettings {
  storeName: string;
  storeDescription: string;
  adminEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  maxOrderQuantity: number;
  defaultCurrency: string;
  taxRate: number;
  shippingFee: number;
  freeShippingThreshold: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  orderNotifications: boolean;
  userRegistrationNotifications: boolean;
  lowStockNotifications: boolean;
  salesReportNotifications: boolean;
}

interface SecuritySettings {
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireSpecialCharacters: boolean;
  enableTwoFactor: boolean;
  ipWhitelist: string[];
}

export default function AdminSettings() {
  const { user, getAllUsers } = useAuth();
  const { pokemon, resetToDefaults } = usePokemon();
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  // Settings state
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    storeName: "PokéMart",
    storeDescription: "Your one-stop shop for all things Pokémon!",
    adminEmail: "admin@pokemart.com",
    supportEmail: "support@pokemart.com",
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: false,
    maxOrderQuantity: 50,
    defaultCurrency: "USD",
    taxRate: 8.25,
    shippingFee: 9.99,
    freeShippingThreshold: 100
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    orderNotifications: true,
    userRegistrationNotifications: true,
    lowStockNotifications: true,
    salesReportNotifications: false
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialCharacters: true,
    enableTwoFactor: false,
    ipWhitelist: []
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSystemSettings = localStorage.getItem('adminSystemSettings');
    const savedNotificationSettings = localStorage.getItem('adminNotificationSettings');
    const savedSecuritySettings = localStorage.getItem('adminSecuritySettings');

    if (savedSystemSettings) {
      setSystemSettings(JSON.parse(savedSystemSettings));
    }
    if (savedNotificationSettings) {
      setNotificationSettings(JSON.parse(savedNotificationSettings));
    }
    if (savedSecuritySettings) {
      setSecuritySettings(JSON.parse(savedSecuritySettings));
    }
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    setSaveMessage("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save to localStorage
      localStorage.setItem('adminSystemSettings', JSON.stringify(systemSettings));
      localStorage.setItem('adminNotificationSettings', JSON.stringify(notificationSettings));
      localStorage.setItem('adminSecuritySettings', JSON.stringify(securitySettings));

      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Error saving settings. Please try again.");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to defaults? This cannot be undone.")) {
      // Reset to default values
      setSystemSettings({
        storeName: "PokéMart",
        storeDescription: "Your one-stop shop for all things Pokémon!",
        adminEmail: "admin@pokemart.com",
        supportEmail: "support@pokemart.com",
        maintenanceMode: false,
        allowRegistration: true,
        requireEmailVerification: false,
        maxOrderQuantity: 50,
        defaultCurrency: "USD",
        taxRate: 8.25,
        shippingFee: 9.99,
        freeShippingThreshold: 100
      });

      setNotificationSettings({
        emailNotifications: true,
        orderNotifications: true,
        userRegistrationNotifications: true,
        lowStockNotifications: true,
        salesReportNotifications: false
      });

      setSecuritySettings({
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        requireSpecialCharacters: true,
        enableTwoFactor: false,
        ipWhitelist: []
      });

      // Clear localStorage
      localStorage.removeItem('adminSystemSettings');
      localStorage.removeItem('adminNotificationSettings');
      localStorage.removeItem('adminSecuritySettings');
    }
  };

  const clearCache = async () => {
    if (confirm("Are you sure you want to clear the application cache? This will refresh the page.")) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "store", label: "Store", icon: Store },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "system", label: "System", icon: Database },
  ];

  const StatCard = ({ icon: Icon, title, value, description, color }: {
    icon: any;
    title: string;
    value: string;
    description: string;
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm border"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-600">{title}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your admin settings and preferences</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {saveMessage && (
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              saveMessage.includes("Error") 
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}>
              {saveMessage.includes("Error") ? (
                <AlertCircle size={16} />
              ) : (
                <CheckCircle size={16} />
              )}
              <span className="text-sm font-medium">{saveMessage}</span>
            </div>
          )}
          
          <button
            onClick={resetSettings}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
          
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} className={saving ? 'animate-pulse' : ''} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={User}
          title="Total Users"
          value={getAllUsers().length.toString()}
          description="Active user accounts"
          color="bg-blue-500"
        />
        <StatCard
          icon={Store}
          title="Products"
          value={pokemon.length.toString()}
          description="Pokemon in inventory"
          color="bg-green-500"
        />
        <StatCard
          icon={Shield}
          title="Security Level"
          value={securitySettings.enableTwoFactor ? "High" : "Medium"}
          description={`${securitySettings.enableTwoFactor ? "2FA enabled" : "Password only"}`}
          color="bg-purple-500"
        />
        <StatCard
          icon={Settings}
          title="System Status"
          value={systemSettings.maintenanceMode ? "Maintenance" : "Online"}
          description={`Store is ${systemSettings.maintenanceMode ? "offline" : "operational"}`}
          color={systemSettings.maintenanceMode ? "bg-yellow-500" : "bg-green-500"}
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <motion.div
              key="general"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Administrator Name
                    </label>
                    <input
                      type="text"
                      value={user?.name || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Administrator Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Display Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Dark Mode</label>
                      <p className="text-sm text-gray-500">Switch to dark theme (coming soon)</p>
                    </div>
                    <input
                      type="checkbox"
                      disabled
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 opacity-50"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Compact View</label>
                      <p className="text-sm text-gray-500">Use condensed layout for tables</p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Store Settings */}
          {activeTab === "store" && (
            <motion.div
              key="store"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={systemSettings.storeName}
                      onChange={(e) => setSystemSettings({...systemSettings, storeName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Description
                    </label>
                    <textarea
                      rows={3}
                      value={systemSettings.storeDescription}
                      onChange={(e) => setSystemSettings({...systemSettings, storeDescription: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Currency
                      </label>
                      <select
                        value={systemSettings.defaultCurrency}
                        onChange={(e) => setSystemSettings({...systemSettings, defaultCurrency: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={systemSettings.taxRate}
                        onChange={(e) => setSystemSettings({...systemSettings, taxRate: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shipping Fee ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={systemSettings.shippingFee}
                        onChange={(e) => setSystemSettings({...systemSettings, shippingFee: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Free Shipping Threshold ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={systemSettings.freeShippingThreshold}
                        onChange={(e) => setSystemSettings({...systemSettings, freeShippingThreshold: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Store Status</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                      <p className="text-sm text-gray-500">Temporarily disable the store for maintenance</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => setSystemSettings({...systemSettings, maintenanceMode: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Allow User Registration</label>
                      <p className="text-sm text-gray-500">Allow new users to create accounts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemSettings.allowRegistration}
                      onChange={(e) => setSystemSettings({...systemSettings, allowRegistration: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                      <p className="text-sm text-gray-500">Receive general notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Order Notifications</label>
                      <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.orderNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, orderNotifications: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">User Registration Notifications</label>
                      <p className="text-sm text-gray-500">Receive alerts when new users register</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.userRegistrationNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, userRegistrationNotifications: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Low Stock Notifications</label>
                      <p className="text-sm text-gray-500">Get alerted when inventory is running low</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.lowStockNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, lowStockNotifications: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Sales Report Notifications</label>
                      <p className="text-sm text-gray-500">Receive weekly and monthly sales reports</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.salesReportNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, salesReportNotifications: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Email Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={systemSettings.adminEmail}
                      onChange={(e) => setSystemSettings({...systemSettings, adminEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={systemSettings.supportEmail}
                      onChange={(e) => setSystemSettings({...systemSettings, supportEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="480"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="10"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Password Length
                    </label>
                    <input
                      type="number"
                      min="6"
                      max="20"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Security Features</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Require Special Characters</label>
                      <p className="text-sm text-gray-500">Passwords must contain special characters</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.requireSpecialCharacters}
                      onChange={(e) => setSecuritySettings({...securitySettings, requireSpecialCharacters: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Enable Two-Factor Authentication</label>
                      <p className="text-sm text-gray-500">Require 2FA for admin accounts (coming soon)</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.enableTwoFactor}
                      onChange={(e) => setSecuritySettings({...securitySettings, enableTwoFactor: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Verification Required</label>
                      <p className="text-sm text-gray-500">Users must verify their email to register</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemSettings.requireEmailVerification}
                      onChange={(e) => setSystemSettings({...systemSettings, requireEmailVerification: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* System Settings */}
          {activeTab === "system" && (
            <motion.div
              key="system"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Management</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Order Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={systemSettings.maxOrderQuantity}
                      onChange={(e) => setSystemSettings({...systemSettings, maxOrderQuantity: parseInt(e.target.value)})}
                      className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">System Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={clearCache}
                    className="flex items-center justify-center space-x-2 p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition-colors text-yellow-800"
                  >
                    <RefreshCw size={20} />
                    <span className="font-medium">Clear Cache</span>
                  </button>
                  
                  <button
                    onClick={() => resetToDefaults()}
                    className="flex items-center justify-center space-x-2 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors text-blue-800"
                  >
                    <RotateCcw size={20} />
                    <span className="font-medium">Reset Pokemon Data</span>
                  </button>
                  
                  <button
                    onClick={() => window.open('/admin/analytics', '_blank')}
                    className="flex items-center justify-center space-x-2 p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors text-green-800"
                  >
                    <Globe size={20} />
                    <span className="font-medium">View Analytics</span>
                  </button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">System Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Application Version:</span>
                    <span className="text-sm text-gray-900">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Environment:</span>
                    <span className="text-sm text-gray-900">Development</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Last Restart:</span>
                    <span className="text-sm text-gray-900">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Total Users:</span>
                    <span className="text-sm text-gray-900">{getAllUsers().length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Total Products:</span>
                    <span className="text-sm text-gray-900">{pokemon.length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
