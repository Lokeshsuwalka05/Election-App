import React, { createContext, useState, useContext, type ReactNode } from 'react';
import { type User } from '../utils/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load user from localStorage on initial render
  React.useEffect(() => {
    const storedUser = localStorage.getItem('voter-finder-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);

    // Mock login - replace with actual API call in production
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo purposes - accept any non-empty username/password
        if (username && password) {
          const newUser: User = {
            id: '1',
            username: username,
            name: 'Election Staff',
            role: 'staff',
            token: 'mock-jwt-token'
          };

          setUser(newUser);
          localStorage.setItem('voter-finder-user', JSON.stringify(newUser));
          toast.success("Login Successful", {
            description: "Welcome back to Voter Swift Finder!"
          });
          setLoading(false);
          resolve(true);
        } else {
          toast.error("Login Failed", {
            description: "Please check your username and password"
          });
          setLoading(false);
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('voter-finder-user');
    toast.success("Logged Out", {
      description: "You have been successfully logged out"
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};