"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'banned';
  joinDate: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface RegistrationResult {
  success: boolean;
  message: string;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<RegistrationResult>;
  getAllUsers: () => User[];
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Array<User & { password: string }> = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-123456789000',
    email: 'admin@pokemart.com',
    password: 'admin123',
    name: 'Admin User',
    isAdmin: true,
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-01',
    lastLogin: '2024-01-20',
    totalOrders: 25,
    totalSpent: 3250.75,
  },
  {
    id: 'b2c3d4e5-f6g7-8901-bcde-234567890001',
    email: 'user@pokemart.com',
    password: 'user123',
    name: 'Regular User',
    isAdmin: false,
    role: 'user',
    status: 'active',
    joinDate: '2024-01-10',
    lastLogin: '2024-01-19',
    totalOrders: 5,
    totalSpent: 425.50,
  },
  {
    id: 'c3d4e5f6-g7h8-9012-cdef-345678901002',
    email: 'john.doe@example.com',
    password: 'john123',
    name: 'John Doe',
    isAdmin: true,
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-15',
    lastLogin: '2024-01-20',
    totalOrders: 12,
    totalSpent: 1450.75,
  },
  {
    id: 'd4e5f6g7-h8i9-0123-defg-456789012003',
    email: 'jane.smith@example.com',
    password: 'jane123',
    name: 'Jane Smith',
    isAdmin: false,
    role: 'user',
    status: 'active',
    joinDate: '2024-02-10',
    lastLogin: '2024-01-19',
    totalOrders: 8,
    totalSpent: 980.50,
  },
  {
    id: 'e5f6g7h8-i9j0-1234-efgh-567890123004',
    email: 'mike.johnson@example.com',
    password: 'mike123',
    name: 'Mike Johnson',
    isAdmin: false,
    role: 'moderator',
    status: 'active',
    joinDate: '2024-01-20',
    lastLogin: '2024-01-18',
    totalOrders: 15,
    totalSpent: 2100.25,
  },
  {
    id: 'f6g7h8i9-j0k1-2345-fghi-678901234005',
    email: 'sarah.wilson@example.com',
    password: 'sarah123',
    name: 'Sarah Wilson',
    isAdmin: false,
    role: 'user',
    status: 'inactive',
    joinDate: '2023-12-05',
    lastLogin: '2024-01-10',
    totalOrders: 3,
    totalSpent: 295.00,
  },
  {
    id: 'g7h8i9j0-k1l2-3456-ghij-789012345006',
    email: 'david.brown@example.com',
    password: 'david123',
    name: 'David Brown',
    isAdmin: false,
    role: 'user',
    status: 'banned',
    joinDate: '2024-01-01',
    lastLogin: '2024-01-12',
    totalOrders: 1,
    totalSpent: 45.99,
  },
  {
    id: 'h8i9j0k1-l2m3-4567-hijk-890123456007',
    email: 'emily.davis@example.com',
    password: 'emily123',
    name: 'Emily Davis',
    isAdmin: false,
    role: 'user',
    status: 'active',
    joinDate: '2024-01-18',
    lastLogin: '2024-01-20',
    totalOrders: 6,
    totalSpent: 675.80,
  },
  {
    id: 'i9j0k1l2-m3n4-5678-ijkl-901234567008',
    email: 'alex.thompson@example.com',
    password: 'alex123',
    name: 'Alex Thompson',
    isAdmin: false,
    role: 'user',
    status: 'active',
    joinDate: '2024-01-12',
    lastLogin: '2024-01-17',
    totalOrders: 4,
    totalSpent: 320.45,
  },
  {
    id: 'j0k1l2m3-n4o5-6789-jklm-012345678009',
    email: 'lisa.anderson@example.com',
    password: 'lisa123',
    name: 'Lisa Anderson',
    isAdmin: false,
    role: 'user',
    status: 'active',
    joinDate: '2024-01-08',
    lastLogin: '2024-01-16',
    totalOrders: 9,
    totalSpent: 1125.30,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<Array<User & { password: string }>>(mockUsers);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Check if additional users are stored in localStorage
    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      setUsers(prevUsers => {
        const existingIds = new Set(prevUsers.map(u => u.id));
        const newUsers = parsedUsers.filter((u: User & { password: string }) => !existingIds.has(u.id));
        return [...prevUsers, ...newUsers];
      });
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<RegistrationResult> => {
    // Check if user already exists by email or name in current users state
    const existingEmail = users.find(u => u.email === email);
    const existingName = users.find(u => u.name === name);
    if (existingEmail) {
      return { success: false, message: 'Email already exists' };
    }
    if (existingName) {
      return { success: false, message: 'Name already exists' };
    }

    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      isAdmin: false,
      role: 'user',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      totalSpent: 0,
    };

    const newUserWithPassword = { ...newUser, password };
    
    // Update users state
    setUsers(prevUsers => {
      const updatedUsers = [...prevUsers, newUserWithPassword];
      // Also persist registered users to localStorage
      const registeredUsers = updatedUsers.filter(u => !mockUsers.some(mu => mu.id === u.id));
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      return updatedUsers;
    });
    
    // Don't auto-login after registration
    return { success: true, message: 'Registration successful! Please login with your new account.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const getAllUsers = (): User[] => {
    return users.map(({ password, ...user }) => user);
  };

  const updateUser = (userId: string, updates: Partial<User>): void => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  };

  const deleteUser = (userId: string): void => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const banUser = (userId: string): void => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, status: 'banned' } : user
      )
    );
  };

  const unbanUser = (userId: string): void => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, status: 'active' } : user
      )
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        getAllUsers,
        updateUser,
        deleteUser,
        banUser,
        unbanUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
