"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  tenantProfile?: Record<string, unknown>;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const fetchProfile = useCallback(async () => {
    try {
      const result = await api.get<{ success: boolean; data: User }>("/api/v1/auth/me");
      setState({ user: result.data, isLoading: false, isAuthenticated: true });
    } catch {
      setState({ user: null, isLoading: false, isAuthenticated: false });
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
  }, []);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (token) {
      fetchProfile();
    } else {
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, [fetchProfile]);

  const login = async (email: string, password: string) => {
    const result = await api.post<{
      success: boolean;
      data: { user: User; accessToken: string; refreshToken: string };
    }>("/api/v1/auth/login", { email, password });

    localStorage.setItem("accessToken", result.data.accessToken);
    localStorage.setItem("refreshToken", result.data.refreshToken);
    setState({ user: result.data.user, isLoading: false, isAuthenticated: true });
    return result.data;
  };

  const signup = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => {
    const result = await api.post<{
      success: boolean;
      data: { user: User; accessToken: string; refreshToken: string };
    }>("/api/v1/auth/signup", data);

    localStorage.setItem("accessToken", result.data.accessToken);
    localStorage.setItem("refreshToken", result.data.refreshToken);
    setState({ user: result.data.user, isLoading: false, isAuthenticated: true });
    return result.data;
  };

  const logout = async () => {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
    try {
      if (refreshToken) {
        await api.post("/api/v1/auth/logout", { refreshToken });
      }
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  };

  return { ...state, login, signup, logout, refetch: fetchProfile };
}
