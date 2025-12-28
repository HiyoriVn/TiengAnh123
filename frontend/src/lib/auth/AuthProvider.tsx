/**
 * Authentication Context Provider
 * Quản lý state authentication toàn app (type-safe)
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user từ localStorage khi mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const userInfo = localStorage.getItem("user_info");
        if (userInfo) {
          const parsed = JSON.parse(userInfo) as User;
          setUser(parsed);
        }
      } catch (error) {
        console.error("Failed to parse user info:", error);
        // Clear invalid data
        localStorage.removeItem("user_info");
        localStorage.removeItem("access_token");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user_info", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    localStorage.setItem("user_info", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook để sử dụng Auth Context
 * Throw error nếu dùng ngoài AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
