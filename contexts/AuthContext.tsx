
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: '@lost_found_user',
  USERS: '@lost_found_users',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (userData) {
        setUser(JSON.parse(userData));
        console.log('User loaded from storage');
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get stored users
      const usersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      
      // Find user with matching email and password
      const foundUser = users.find(u => u.email === email);
      
      if (!foundUser) {
        console.log('User not found');
        return false;
      }

      // In a real app, you'd hash and compare passwords
      // For demo purposes, we'll do a simple comparison
      if (foundUser.email === email) {
        const userToStore = { ...foundUser };
        delete userToStore.password; // Don't store password
        
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userToStore));
        setUser(userToStore);
        console.log('User signed in:', userToStore.email);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error signing in:', error);
      return false;
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Get existing users
      const usersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        console.log('User already exists');
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password, // In a real app, this would be hashed
      };
      
      // Add to users array
      users.push(newUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      
      // Sign in the new user
      const userToStore = { ...newUser };
      delete userToStore.password;
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userToStore));
      setUser(userToStore);
      console.log('User signed up and signed in:', userToStore.email);
      return true;
    } catch (error) {
      console.error('Error signing up:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      setUser(null);
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
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
