import { createContext, useContext, useState } from "react";
import * as authApi from "../../api/authApi";

const STORAGE_KEY = "smagyo_admin_user";

/**
 * Demo quick-fill credentials — these map to real DB accounts.
 * SUPER_ADMIN is seeded by DataSeeder on backend startup.
 * TENANT_ADMIN accounts are created via the register form.
 */
export const DEMO_ACCOUNTS = [
  // {
  //   email: "chadi@smagyo.com",
  //   password: "super1234",
  //   name: "Chadi Rahme",
  //   role: "SUPER_ADMIN",
  //   tenantName: "Smagyo Platform",
  //   avatar: "CR",
  // },
  {
    email: "ayman@smayo.com",
    password: "tenant1234",
    name: "Ayman El Srouji",
    role: "TENANT_ADMIN",
    tenantName: "Rose Garden Shop",
    avatar: "AE",
  },
];

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  // Re-hydrate from localStorage so refresh doesn't log the user out
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
    catch { return null; }
  });

  const login = async (email, password) => {
    try {
      const data = await authApi.login(email.trim().toLowerCase(), password);
      // Spread the full LoginResponse into state; add email from the request
      const safeUser = { email: email.trim().toLowerCase(), ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
      setUser(safeUser);
      return { ok: true, role: data.role };
    } catch (err) {
      return { error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  // Backend returns uppercase: "SUPER_ADMIN" | "TENANT_ADMIN"
  const isSuperAdmin  = user?.role === "SUPER_ADMIN";
  const isTenantAdmin = user?.role === "TENANT_ADMIN";

  return (
    <AdminAuthContext.Provider value={{ user, isSuperAdmin, isTenantAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
