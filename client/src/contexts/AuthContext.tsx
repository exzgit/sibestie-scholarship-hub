import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'verifikator';
  isVerified: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected' | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
  }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isRole: string;
  checkVerificationStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Check if the user has submitted verification data
  const checkVerificationStatus = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get(`http://127.0.0.1:8081/api/verifikasi/status/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const status = response.data.status;
      const updatedUser = {
        ...user,
        verificationStatus: status,
        isVerified: status === 'approved',
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to check verification status:", err);
    }
  };

  useEffect(() => {
    if (user && user.role === 'user' && !user.verificationStatus) {
      checkVerificationStatus();
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('http://127.0.0.1:8081/login', { email, password });
      const { token, user } = res.data;
      user.role = user.role?.toLowerCase();
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    try {
      await axios.post('http://127.0.0.1:8081/register', data);
      return true;
    } catch (err) {
      throw err; 
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isRole: user?.role,
        checkVerificationStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
