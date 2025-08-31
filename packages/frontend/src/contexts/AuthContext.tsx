import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: 'manager' | 'field_worker' | 'admin';
  name: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for stored auth token on app load
    const storedUser = localStorage.getItem('workforce_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('workforce_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // For MVP, use hardcoded users
      const mockUsers = [
        { id: '1', email: 'manager@company.com', password: 'password', role: 'manager' as const, name: 'John Manager' },
        { id: '2', email: 'worker@company.com', password: 'password', role: 'field_worker' as const, name: 'Jane Worker' },
        { id: '3', email: 'admin@company.com', password: 'password', role: 'admin' as const, name: 'Admin User' },
      ];

      // Check for registered users in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('workforce_registered_users') || '[]');
      const allUsers = [...mockUsers, ...registeredUsers];

      const foundUser = allUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name,
      };

      setUser(userData);
      localStorage.setItem('workforce_user', JSON.stringify(userData));
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      // Check if user already exists
      const registeredUsers = JSON.parse(localStorage.getItem('workforce_registered_users') || '[]');
      const mockUsers = [
        { email: 'manager@company.com' },
        { email: 'worker@company.com' },
        { email: 'admin@company.com' },
      ];

      const allEmails = [...mockUsers, ...registeredUsers].map(u => u.email);
      
      if (allEmails.includes(data.email)) {
        throw new Error('User already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: data.email,
        password: data.password,
        role: 'field_worker' as const, // Default role for new registrations
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      };

      // Save to localStorage
      const updatedUsers = [...registeredUsers, newUser];
      localStorage.setItem('workforce_registered_users', JSON.stringify(updatedUsers));

      // Auto-login after registration
      const userData = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      };

      setUser(userData);
      localStorage.setItem('workforce_user', JSON.stringify(userData));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('workforce_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};