import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'stride_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error: string | null }> => {
    // Simple mock signup - in real app would validate with backend
    if (!email || !password || !fullName) {
      return { error: 'All fields are required' };
    }
    
    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters' };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      fullName,
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { error: null };
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    // Simple mock login - accepts any email/password with basic validation
    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    if (password.length < 6) {
      return { error: 'Invalid email or password' };
    }

    // Create a mock user based on email
    const mockUser: User = {
      id: `user_${Date.now()}`,
      email,
      fullName: email.split('@')[0],
    };

    setUser(mockUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    return { error: null };
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut }}>
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
