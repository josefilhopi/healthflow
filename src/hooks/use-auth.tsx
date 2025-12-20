"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    if (storedLoginStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email: string) => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email); // Store user email for display if needed
    toast.success("Login realizado com sucesso!");
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    toast.info("Você foi desconectado.");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};