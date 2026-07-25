import { createContext, useContext, useState } from "react";
import * as customerAuthApi from "../api/customerAuthApi";

const STORAGE_KEY = "smagyo_customer";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Re-hydrate from localStorage so refresh doesn't log the customer out
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
    catch { return null; }
  });

  const login = async (email, password) => {
    try {
      const data = await customerAuthApi.login(email.trim().toLowerCase(), password);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setUser(data);
      return { ok: true };
    } catch (err) {
      return { error: err.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await customerAuthApi.register({ name, email: email.trim().toLowerCase(), password });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setUser(data);
      return { ok: true };
    } catch (err) {
      return { error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
