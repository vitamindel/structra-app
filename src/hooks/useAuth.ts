import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  institution?: string;
  avatar: string;
  joinDate: string;
  lastLogin: string;
  provider?: string;
  preferences: {
    theme: 'dark' | 'light';
    notifications: boolean;
    autoSave: boolean;
  };
  savedProteins: string[];
  measurements: any[];
  annotations: any[];
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('drugapp_current_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user session:', error);
        localStorage.removeItem('drugapp_current_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('drugapp_current_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('drugapp_current_user');
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem('drugapp_current_user', JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser
  };
};