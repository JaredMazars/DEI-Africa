import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockAuthService } from '../services/mockAuth';

interface User {
  id: string;
  email: string;
  isFirstLogin: boolean;
  profile?: UserProfile;
}

interface UserProfile {
  role: 'mentor' | 'mentee';
  name: string;
  location: string;
  expertise: string[];
  interests: string[];
  experience: string;
  goals: string[];
  availability: string;
  languages: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  demoLogin: () => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
  isLoading: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token) {
        try {
          if (userData) {
            const user = JSON.parse(userData);
            // Update isFirstLogin based on current onboarding status
            user.isFirstLogin = !localStorage.getItem('hasCompletedOnboarding');
            setUser(user);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
  setIsLoading(true);
  try {
    const response = await mockAuthService.login(email, password);
    const { user, token } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    if (user.profile) {
      localStorage.setItem('hasCompletedOnboarding', 'true');
    }
    setUser(user);

    return true;
  } catch (error: any) {
    console.error('Login failed:', error);
    throw new Error(error.message || 'Login failed');
  } finally {
    setIsLoading(false);
  }
};

  const demoLogin = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await mockAuthService.demoLogin();
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('hasCompletedOnboarding', 'true');
      setUser(user);

      return true;
    } catch (error: any) {
      console.error('Demo login failed:', error);
      throw new Error(error.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };


  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await mockAuthService.register(email, password);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return true;
    } catch (error: any) {
      console.error('Registration failed:', error);
      const message = error.message || 'Registration failed';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('hasCompletedOnboarding');
  };

  const updateProfile = (profile: UserProfile) => {
    const completeProfile = async () => {
      try {
        const response = await mockAuthService.completeProfile(profile);
        
        if (user) {
          const updatedUser = {
            ...user,
            profile,
            isFirstLogin: false,
          };
          setUser(updatedUser);
          localStorage.setItem('hasCompletedOnboarding', 'true');
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error('Profile update failed:', error);
        throw error;
      }
    };
    
    return completeProfile();
  };

  const value = {
    user,
    login,
    demoLogin,
    register,
    logout,
    updateProfile,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
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