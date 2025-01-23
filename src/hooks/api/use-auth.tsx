/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ApiClient } from "@/config/api-client";
import { ProfileType } from "@/types/base-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext } from "react";

interface AuthContextType {
  user: ProfileType;
  isLoading: boolean;
  isError: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: (callback?: () => void) => Promise<void>;
  getToken: () => string;
  refreshAccessToken: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password
    }: {
      email: string;
      password: string;
    }) => {
      const { data } = (await ApiClient.post("/auth/login", {
        email,
        password
      })) as any;
      return data.data as { token: string; refreshToken: string; user: any };
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      queryClient.setQueryData(["user"], data.user);
    },
    onError: (error: any) => {
      console.error(
        "Login failed:",
        error.response?.data?.msg || "Unknown error"
      );
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  });

  const {
    data: user,
    isLoading,
    isError
  } = useQuery({
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const { data } = (await ApiClient.get<{ user: any }>("/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })) as any;

      return data.data;
    },
    queryKey: ["user"],
    enabled: !!localStorage.getItem("token"),
    retry: false
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };
  const logout = async (callback = () => {}) => {
    await logoutMutation.mutateAsync();

    callback();
  };

  const getToken = () => {
    return localStorage.getItem("token")!;
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");

    try {
      const { data } = (await ApiClient.post("/auth/refresh-token", {
        refreshToken
      })) as any;

      localStorage.setItem("token", data.data.token);
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      return data.token;
    } catch (error: any) {
      console.error(
        "Token refresh failed:",
        error.response?.data?.msg || "Unknown error"
      );
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isError,
        login,
        logout,
        getToken,
        refreshAccessToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
